const db = require("../config/database");

class Bug {
  static async create(data) {
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
    } = data;

    const assigned_date = assigned_to ? new Date() : null;

    const result = await db.query(
      `INSERT INTO bugs (project_id, sub_project_id, test_case_id, discovered_by, assigned_to,
       name, description, steps_to_reproduce, status, severity, priority, type, environment, assigned_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
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
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = "SELECT * FROM bugs";
    const params = [];
    const conditions = [];

    if (filters.project_id) {
      conditions.push(`project_id = $${params.length + 1}`);
      params.push(filters.project_id);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY discovered_date DESC";

    const result = await db.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query("SELECT * FROM bugs WHERE bug_id = $1", [id]);
    return result.rows[0];
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;

        if (key === "assigned_to" && value) {
          fields.push(`assigned_date = $${paramCount}`);
          values.push(new Date());
          paramCount++;
        }

        if (key === "status" && (value === "Closed" || value === "Verified")) {
          fields.push(`resolution_date = $${paramCount}`);
          values.push(new Date());
          paramCount++;
        }
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const result = await db.query(
      `UPDATE bugs SET ${fields.join(
        ", "
      )} WHERE bug_id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0];
  }
}

module.exports = Bug;
