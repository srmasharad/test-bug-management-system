const express = require("express");
const cors = require("cors");
require("dotenv").config();

const usePostgres = !!process.env.DATABASE_URL;
const dbModule = usePostgres ? require("./database-pg") : require("./database");
const { initDatabase, getPool } = dbModule;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let db;

const query = async (sql, params = []) => {
  if (usePostgres) {
    let pgSql = sql;
    params.forEach((_, i) => {
      pgSql = pgSql.replace("?", `$${i + 1}`);
    });
    const result = await dbModule.query(pgSql, params);
    return [result.rows]; // Return in MySQL format
  } else {
    return await db.query(sql, params);
  }
};

initDatabase()
  .then(async (pool) => {
    db = pool;
    console.log(
      `Database connected (${usePostgres ? "PostgreSQL" : "SQLite"})`
    );

    if (process.env.SEED_DATA === "true") {
      try {
        console.log("Seeding database with test data...");
        const { seedData } = usePostgres
          ? require("./seed-data-pg")
          : require("./seed-data");
        await seedData(db);
        console.log("Database seeded successfully!");
      } catch (error) {
        console.error("Error seeding database:", error);
      }
    }
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });

app.get("/healthz", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/projects", async (req, res) => {
  try {
    const { name, description, start_date, end_date, status } = req.body;
    const [result] = await query(
      "INSERT INTO projects (name, description, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)",
      [name, description, start_date, end_date, status || "Active"]
    );
    res.json({ project_id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/projects", async (req, res) => {
  try {
    const [projects] = await query("SELECT * FROM projects");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/projects/:id", async (req, res) => {
  try {
    const [projects] = await query(
      "SELECT * FROM projects WHERE project_id = ?",
      [req.params.id]
    );
    if (projects.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(projects[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/subprojects", async (req, res) => {
  try {
    const { project_id, name, description } = req.body;
    const [result] = await query(
      "INSERT INTO sub_projects (project_id, name, description) VALUES (?, ?, ?)",
      [project_id, name, description]
    );
    res.json({ sub_project_id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/subprojects", async (req, res) => {
  try {
    const { project_id } = req.query;
    let sql = "SELECT * FROM sub_projects";
    let params = [];

    if (project_id) {
      sql += " WHERE project_id = ?";
      params.push(project_id);
    }

    const [subprojects] = await query(sql, params);
    res.json(subprojects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/testers", async (req, res) => {
  try {
    const { name, email, role, date_joined } = req.body;
    const [result] = await query(
      "INSERT INTO testers (name, email, role, date_joined) VALUES (?, ?, ?, ?)",
      [name, email, role, date_joined]
    );
    res.json({ tester_id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/testers", async (req, res) => {
  try {
    const [testers] = await query("SELECT * FROM testers");
    res.json(testers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/testers/:id", async (req, res) => {
  try {
    const [testers] = await query("SELECT * FROM testers WHERE tester_id = ?", [
      req.params.id,
    ]);
    if (testers.length === 0) {
      return res.status(404).json({ error: "Tester not found" });
    }
    res.json(testers[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/testsuites", async (req, res) => {
  try {
    const { project_id, name, description } = req.body;
    const [result] = await query(
      "INSERT INTO test_suites (project_id, name, description) VALUES (?, ?, ?)",
      [project_id, name, description]
    );
    const [suite] = await query(
      "SELECT * FROM test_suites WHERE test_suite_id = ?",
      [result.insertId]
    );
    res.json(suite[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/testsuites", async (req, res) => {
  try {
    const { project_id } = req.query;
    let sql = "SELECT * FROM test_suites";
    let params = [];

    if (project_id) {
      sql += " WHERE project_id = ?";
      params.push(project_id);
    }

    const [suites] = await query(sql, params);
    res.json(suites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/testcases", async (req, res) => {
  try {
    const {
      test_suite_id,
      name,
      description,
      preconditions,
      steps,
      expected_result,
      priority,
    } = req.body;
    const [result] = await query(
      "INSERT INTO test_cases (test_suite_id, name, description, preconditions, steps, expected_result, priority) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        test_suite_id,
        name,
        description,
        preconditions,
        steps,
        expected_result,
        priority || "Medium",
      ]
    );
    const [testcase] = await query(
      "SELECT * FROM test_cases WHERE test_case_id = ?",
      [result.insertId]
    );
    res.json(testcase[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/testcases", async (req, res) => {
  try {
    const { test_suite_id } = req.query;
    let sql = "SELECT * FROM test_cases";
    let params = [];

    if (test_suite_id) {
      sql += " WHERE test_suite_id = ?";
      params.push(test_suite_id);
    }

    const [testcases] = await query(sql, params);
    res.json(testcases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/testcases/:id", async (req, res) => {
  try {
    const [testcases] = await query(
      "SELECT * FROM test_cases WHERE test_case_id = ?",
      [req.params.id]
    );
    if (testcases.length === 0) {
      return res.status(404).json({ error: "Test case not found" });
    }
    res.json(testcases[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/executions", async (req, res) => {
  try {
    const { test_case_id, tester_id, status, notes } = req.body;
    const [result] = await query(
      "INSERT INTO test_executions (test_case_id, tester_id, status, notes) VALUES (?, ?, ?, ?)",
      [test_case_id, tester_id, status, notes]
    );
    const [execution] = await query(
      "SELECT * FROM test_executions WHERE execution_id = ?",
      [result.insertId]
    );
    res.json(execution[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/executions", async (req, res) => {
  try {
    const [executions] = await query("SELECT * FROM test_executions");
    res.json(executions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/bugs", async (req, res) => {
  try {
    const {
      project_id,
      sub_project_id,
      test_case_id,
      discovered_by,
      assigned_to,
      name,
      description,
      steps_to_reproduce,
      status,
      severity,
      priority,
      type,
      environment,
    } = req.body;

    const assigned_date = assigned_to ? new Date().toISOString() : null;

    const [result] = await query(
      `INSERT INTO bugs (project_id, sub_project_id, test_case_id, discovered_by, assigned_to,
       name, description, steps_to_reproduce, status, severity, priority, type, environment, assigned_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        project_id,
        sub_project_id,
        test_case_id,
        discovered_by,
        assigned_to,
        name,
        description,
        steps_to_reproduce,
        status || "New",
        severity,
        priority,
        type || "Functional",
        environment,
        assigned_date,
      ]
    );

    const [bug] = await query("SELECT * FROM bugs WHERE bug_id = ?", [
      result.insertId,
    ]);
    res.json(bug[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/bugs", async (req, res) => {
  try {
    const { project_id } = req.query;
    let sql = "SELECT * FROM bugs";
    let params = [];

    if (project_id) {
      sql += " WHERE project_id = ?";
      params.push(project_id);
    }

    const [bugs] = await query(sql, params);
    res.json(bugs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/bugs/:id", async (req, res) => {
  try {
    const [bugs] = await query("SELECT * FROM bugs WHERE bug_id = ?", [
      req.params.id,
    ]);
    if (bugs.length === 0) {
      return res.status(404).json({ error: "Bug not found" });
    }
    res.json(bugs[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/bugs/:id", async (req, res) => {
  try {
    const bugId = req.params.id;
    const updates = req.body;

    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);

        if (key === "assigned_to" && value) {
          fields.push("assigned_date = ?");
          values.push(new Date().toISOString());
        }

        if (key === "status" && (value === "Closed" || value === "Verified")) {
          fields.push("resolution_date = ?");
          values.push(new Date().toISOString());
        }
      }
    }

    if (fields.length > 0) {
      values.push(bugId);
      await query(
        `UPDATE bugs SET ${fields.join(", ")} WHERE bug_id = ?`,
        values
      );
    }

    const [bug] = await query("SELECT * FROM bugs WHERE bug_id = ?", [bugId]);
    res.json(bug[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/reports/test-executions-by-suite", async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const sqlQuery = usePostgres
      ? `
      SELECT 
        ts.test_suite_id,
        ts.name as suite_name,
        p.name as project_name,
        COUNT(DISTINCT tc.test_case_id) as total_test_cases,
        COUNT(te.execution_id) as total_executions,
        COUNT(CASE WHEN te.execution_date >= CURRENT_TIMESTAMP - INTERVAL '1 day' * $1 THEN te.execution_id END) as recent_executions
      FROM test_suites ts
      JOIN projects p ON ts.project_id = p.project_id
      LEFT JOIN test_cases tc ON ts.test_suite_id = tc.test_suite_id
      LEFT JOIN test_executions te ON tc.test_case_id = te.test_case_id
      GROUP BY ts.test_suite_id, ts.name, p.name
      ORDER BY p.name, ts.name
    `
      : `
      SELECT 
        ts.test_suite_id,
        ts.name as suite_name,
        p.name as project_name,
        COUNT(DISTINCT tc.test_case_id) as total_test_cases,
        COUNT(te.execution_id) as total_executions,
        COUNT(CASE WHEN te.execution_date >= datetime('now', '-' || ? || ' days') THEN te.execution_id END) as recent_executions
      FROM test_suites ts
      JOIN projects p ON ts.project_id = p.project_id
      LEFT JOIN test_cases tc ON ts.test_suite_id = tc.test_suite_id
      LEFT JOIN test_executions te ON tc.test_case_id = te.test_case_id
      GROUP BY ts.test_suite_id, ts.name, p.name
      ORDER BY p.name, ts.name
    `;
    const [results] = await query(sqlQuery, [days]);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/reports/projects-with-bugs", async (req, res) => {
  try {
    const sqlQuery = `
      SELECT 
        p.project_id,
        p.name as project_name,
        p.status as project_status,
        sp.sub_project_id,
        sp.name as sub_project_name,
        COUNT(b.bug_id) as total_bugs,
        SUM(CASE WHEN b.status IN ('New', 'Assigned', 'Open', 'Fixed', 'Retest') THEN 1 ELSE 0 END) as open_bugs,
        SUM(CASE WHEN b.status IN ('Closed', 'Verified') THEN 1 ELSE 0 END) as closed_bugs,
        SUM(CASE WHEN b.severity = 'Critical' THEN 1 ELSE 0 END) as critical_bugs,
        SUM(CASE WHEN b.severity = 'High' THEN 1 ELSE 0 END) as high_bugs,
        SUM(CASE WHEN b.severity = 'Medium' THEN 1 ELSE 0 END) as medium_bugs,
        SUM(CASE WHEN b.severity = 'Low' THEN 1 ELSE 0 END) as low_bugs
      FROM projects p
      LEFT JOIN sub_projects sp ON p.project_id = sp.project_id
      LEFT JOIN bugs b ON sp.sub_project_id = b.sub_project_id
      WHERE p.status = 'Active'
      GROUP BY p.project_id, p.name, p.status, sp.sub_project_id, sp.name
      ORDER BY p.name, sp.name
    `;
    const [results] = await query(sqlQuery);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/reports/bugs-per-tester", async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const sqlQuery = usePostgres
      ? `
      SELECT 
        t.tester_id,
        t.name as tester_name,
        t.email,
        COUNT(CASE WHEN b.assigned_date >= CURRENT_TIMESTAMP - INTERVAL '1 day' * $1 THEN b.bug_id END) as bugs_assigned_period,
        COUNT(b.bug_id) as total_bugs_assigned,
        COUNT(CASE WHEN b.status IN ('Closed', 'Verified') THEN 1 END) as bugs_resolved
      FROM testers t
      LEFT JOIN bugs b ON t.tester_id = b.assigned_to
      GROUP BY t.tester_id, t.name, t.email
      ORDER BY bugs_assigned_period DESC, t.name
    `
      : `
      SELECT 
        t.tester_id,
        t.name as tester_name,
        t.email,
        COUNT(CASE WHEN b.assigned_date >= datetime('now', '-' || ? || ' days') THEN b.bug_id END) as bugs_assigned_period,
        COUNT(b.bug_id) as total_bugs_assigned,
        COUNT(CASE WHEN b.status IN ('Closed', 'Verified') THEN 1 END) as bugs_resolved
      FROM testers t
      LEFT JOIN bugs b ON t.tester_id = b.assigned_to
      GROUP BY t.tester_id, t.name, t.email
      ORDER BY bugs_assigned_period DESC, t.name
    `;
    const [results] = await query(sqlQuery, [days]);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/reports/bugs-discovered-last-week", async (req, res) => {
  try {
    const sqlQuery = usePostgres
      ? `
      SELECT 
        b.bug_id,
        b.name as bug_name,
        b.description,
        b.status,
        b.severity,
        b.priority,
        b.discovered_date,
        t.name as discovered_by_name,
        t.email as tester_email,
        tc.test_case_id,
        tc.name as test_case_name,
        p.name as project_name
      FROM bugs b
      JOIN testers t ON b.discovered_by = t.tester_id
      LEFT JOIN test_cases tc ON b.test_case_id = tc.test_case_id
      JOIN projects p ON b.project_id = p.project_id
      WHERE b.discovered_date >= CURRENT_DATE - INTERVAL '7 days'
      ORDER BY b.discovered_date DESC
    `
      : `
      SELECT 
        b.bug_id,
        b.name as bug_name,
        b.description,
        b.status,
        b.severity,
        b.priority,
        b.discovered_date,
        t.name as discovered_by_name,
        t.email as tester_email,
        tc.test_case_id,
        tc.name as test_case_name,
        p.name as project_name
      FROM bugs b
      JOIN testers t ON b.discovered_by = t.tester_id
      LEFT JOIN test_cases tc ON b.test_case_id = tc.test_case_id
      JOIN projects p ON b.project_id = p.project_id
      WHERE b.discovered_date >= date('now', '-7 days')
      ORDER BY b.discovered_date DESC
    `;
    const [results] = await query(sqlQuery);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/reports/unassigned-bugs", async (req, res) => {
  try {
    const sqlQuery = `
      SELECT 
        b.bug_id,
        b.name,
        b.description,
        b.status,
        b.severity,
        b.priority,
        b.type,
        b.discovered_date,
        b.environment,
        t.name as discovered_by_name,
        p.name as project_name,
        sp.name as sub_project_name
      FROM bugs b
      JOIN testers t ON b.discovered_by = t.tester_id
      JOIN projects p ON b.project_id = p.project_id
      LEFT JOIN sub_projects sp ON b.sub_project_id = sp.sub_project_id
      WHERE b.assigned_to IS NULL
      ORDER BY 
        CASE b.priority
          WHEN 'P1' THEN 1
          WHEN 'P2' THEN 2
          WHEN 'P3' THEN 3
          WHEN 'P4' THEN 4
        END,
        CASE b.severity
          WHEN 'Critical' THEN 1
          WHEN 'High' THEN 2
          WHEN 'Medium' THEN 3
          WHEN 'Low' THEN 4
        END,
        b.discovered_date DESC
    `;
    const [results] = await query(sqlQuery);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/charts/open-issues-by-project", async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const sqlQuery = usePostgres
      ? `
      SELECT 
        p.project_id,
        p.name as project_name,
        DATE(b.discovered_date) as date,
        COUNT(b.bug_id) as open_issues
      FROM projects p
      LEFT JOIN bugs b ON p.project_id = b.project_id 
        AND b.status IN ('New', 'Assigned', 'Open', 'Fixed', 'Retest')
        AND b.discovered_date >= CURRENT_DATE - INTERVAL '1 day' * $1
      GROUP BY p.project_id, p.name, DATE(b.discovered_date)
      ORDER BY date DESC
    `
      : `
      SELECT 
        p.project_id,
        p.name as project_name,
        DATE(b.discovered_date) as date,
        COUNT(b.bug_id) as open_issues
      FROM projects p
      LEFT JOIN bugs b ON p.project_id = b.project_id 
        AND b.status IN ('New', 'Assigned', 'Open', 'Fixed', 'Retest')
        AND b.discovered_date >= date('now', '-' || ? || ' days')
      GROUP BY p.project_id, p.name, DATE(b.discovered_date)
      ORDER BY date DESC
    `;
    const [results] = await query(sqlQuery, [days]);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/charts/closed-issues-by-project", async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const sqlQuery = usePostgres
      ? `
      SELECT 
        p.project_id,
        p.name as project_name,
        DATE(b.resolution_date) as date,
        COUNT(b.bug_id) as closed_issues
      FROM projects p
      LEFT JOIN bugs b ON p.project_id = b.project_id 
        AND b.status IN ('Closed', 'Verified')
        AND b.resolution_date >= CURRENT_DATE - INTERVAL '1 day' * $1
      GROUP BY p.project_id, p.name, DATE(b.resolution_date)
      ORDER BY date DESC
    `
      : `
      SELECT 
        p.project_id,
        p.name as project_name,
        DATE(b.resolution_date) as date,
        COUNT(b.bug_id) as closed_issues
      FROM projects p
      LEFT JOIN bugs b ON p.project_id = b.project_id 
        AND b.status IN ('Closed', 'Verified')
        AND b.resolution_date >= date('now', '-' || ? || ' days')
      GROUP BY p.project_id, p.name, DATE(b.resolution_date)
      ORDER BY date DESC
    `;
    const [results] = await query(sqlQuery, [days]);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/charts/bug-status-distribution", async (req, res) => {
  try {
    const sqlQuery = `
      SELECT 
        status,
        COUNT(*) as count
      FROM bugs
      GROUP BY status
      ORDER BY count DESC
    `;
    const [results] = await query(sqlQuery);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/charts/bug-severity-distribution", async (req, res) => {
  try {
    const sqlQuery = `
      SELECT 
        severity,
        COUNT(*) as count
      FROM bugs
      GROUP BY severity
      ORDER BY 
        CASE severity
          WHEN 'Critical' THEN 1
          WHEN 'High' THEN 2
          WHEN 'Medium' THEN 3
          WHEN 'Low' THEN 4
        END
    `;
    const [results] = await query(sqlQuery);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
