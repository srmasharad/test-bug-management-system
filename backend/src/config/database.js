const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/test_management',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('✓ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
  process.exit(-1);
});

const initDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        project_id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        start_date DATE,
        end_date DATE,
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS sub_projects (
        sub_project_id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS testers (
        tester_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        role VARCHAR(100),
        date_joined DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS test_suites (
        test_suite_id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        created_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS test_cases (
        test_case_id SERIAL PRIMARY KEY,
        test_suite_id INTEGER NOT NULL REFERENCES test_suites(test_suite_id) ON DELETE CASCADE,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        preconditions TEXT,
        steps TEXT,
        expected_result TEXT,
        priority VARCHAR(20) DEFAULT 'Medium',
        created_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS test_executions (
        execution_id SERIAL PRIMARY KEY,
        test_case_id INTEGER NOT NULL REFERENCES test_cases(test_case_id) ON DELETE CASCADE,
        tester_id INTEGER NOT NULL REFERENCES testers(tester_id) ON DELETE CASCADE,
        execution_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) NOT NULL,
        notes TEXT
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS bugs (
        bug_id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
        sub_project_id INTEGER REFERENCES sub_projects(sub_project_id) ON DELETE SET NULL,
        test_case_id INTEGER REFERENCES test_cases(test_case_id) ON DELETE SET NULL,
        discovered_by INTEGER NOT NULL REFERENCES testers(tester_id) ON DELETE RESTRICT,
        assigned_to INTEGER REFERENCES testers(tester_id) ON DELETE SET NULL,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        steps_to_reproduce TEXT,
        status VARCHAR(50) DEFAULT 'New',
        severity VARCHAR(20) NOT NULL,
        priority VARCHAR(20) NOT NULL,
        type VARCHAR(50) DEFAULT 'Functional',
        environment TEXT,
        discovered_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        assigned_date TIMESTAMP,
        resolution_date TIMESTAMP
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bugs_project ON bugs(project_id);
      CREATE INDEX IF NOT EXISTS idx_bugs_status ON bugs(status);
      CREATE INDEX IF NOT EXISTS idx_bugs_severity ON bugs(severity);
      CREATE INDEX IF NOT EXISTS idx_bugs_discovered_date ON bugs(discovered_date);
      CREATE INDEX IF NOT EXISTS idx_test_executions_date ON test_executions(execution_date);
    `);

    console.log('✓ Database tables created successfully');
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  initDatabase,
  query: (text, params) => pool.query(text, params)
};
