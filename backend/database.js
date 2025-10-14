const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

async function initDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.end();

    pool = mysql.createPool(dbConfig);

    await createTables();
    
    console.log('Database initialized successfully');
    return pool;
  } catch (error) {
    console.error('Error initializing database:', error);
    console.log('Falling back to SQLite in-memory database...');
    return initSQLite();
  }
}

async function createTables() {
  const connection = await pool.getConnection();
  
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS projects (
        project_id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        start_date DATE,
        end_date DATE,
        status VARCHAR(50) DEFAULT 'Active'
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS sub_projects (
        sub_project_id INT PRIMARY KEY AUTO_INCREMENT,
        project_id INT NOT NULL,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        FOREIGN KEY (project_id) REFERENCES projects(project_id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS testers (
        tester_id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        role VARCHAR(50),
        date_joined DATE NOT NULL
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS test_suites (
        test_suite_id INT PRIMARY KEY AUTO_INCREMENT,
        project_id INT NOT NULL,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(project_id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS test_cases (
        test_case_id INT PRIMARY KEY AUTO_INCREMENT,
        test_suite_id INT NOT NULL,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        preconditions TEXT,
        steps TEXT,
        expected_result TEXT,
        priority VARCHAR(20) DEFAULT 'Medium',
        created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (test_suite_id) REFERENCES test_suites(test_suite_id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS test_executions (
        execution_id INT PRIMARY KEY AUTO_INCREMENT,
        test_case_id INT NOT NULL,
        tester_id INT NOT NULL,
        execution_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) NOT NULL,
        notes TEXT,
        FOREIGN KEY (test_case_id) REFERENCES test_cases(test_case_id),
        FOREIGN KEY (tester_id) REFERENCES testers(tester_id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS bugs (
        bug_id INT PRIMARY KEY AUTO_INCREMENT,
        project_id INT NOT NULL,
        sub_project_id INT,
        test_case_id INT,
        discovered_by INT NOT NULL,
        assigned_to INT,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        steps_to_reproduce TEXT,
        status VARCHAR(50) DEFAULT 'New',
        severity VARCHAR(20) NOT NULL,
        priority VARCHAR(20) NOT NULL,
        type VARCHAR(50) DEFAULT 'Functional',
        discovered_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        assigned_date DATETIME,
        resolution_date DATETIME,
        environment VARCHAR(200),
        FOREIGN KEY (project_id) REFERENCES projects(project_id),
        FOREIGN KEY (sub_project_id) REFERENCES sub_projects(sub_project_id),
        FOREIGN KEY (test_case_id) REFERENCES test_cases(test_case_id),
        FOREIGN KEY (discovered_by) REFERENCES testers(tester_id),
        FOREIGN KEY (assigned_to) REFERENCES testers(tester_id)
      )
    `);

  } finally {
    connection.release();
  }
}

function initSQLite() {
  const sqlite3 = require('better-sqlite3');
  const db = sqlite3(':memory:');

  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      project_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(200) NOT NULL,
      description TEXT,
      start_date DATE,
      end_date DATE,
      status VARCHAR(50) DEFAULT 'Active'
    );

    CREATE TABLE IF NOT EXISTS sub_projects (
      sub_project_id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      name VARCHAR(200) NOT NULL,
      description TEXT,
      FOREIGN KEY (project_id) REFERENCES projects(project_id)
    );

    CREATE TABLE IF NOT EXISTS testers (
      tester_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      role VARCHAR(50),
      date_joined DATE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS test_suites (
      test_suite_id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      name VARCHAR(200) NOT NULL,
      description TEXT,
      created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(project_id)
    );

    CREATE TABLE IF NOT EXISTS test_cases (
      test_case_id INTEGER PRIMARY KEY AUTOINCREMENT,
      test_suite_id INTEGER NOT NULL,
      name VARCHAR(200) NOT NULL,
      description TEXT,
      preconditions TEXT,
      steps TEXT,
      expected_result TEXT,
      priority VARCHAR(20) DEFAULT 'Medium',
      created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (test_suite_id) REFERENCES test_suites(test_suite_id)
    );

    CREATE TABLE IF NOT EXISTS test_executions (
      execution_id INTEGER PRIMARY KEY AUTOINCREMENT,
      test_case_id INTEGER NOT NULL,
      tester_id INTEGER NOT NULL,
      execution_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(20) NOT NULL,
      notes TEXT,
      FOREIGN KEY (test_case_id) REFERENCES test_cases(test_case_id),
      FOREIGN KEY (tester_id) REFERENCES testers(tester_id)
    );

    CREATE TABLE IF NOT EXISTS bugs (
      bug_id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      sub_project_id INTEGER,
      test_case_id INTEGER,
      discovered_by INTEGER NOT NULL,
      assigned_to INTEGER,
      name VARCHAR(200) NOT NULL,
      description TEXT,
      steps_to_reproduce TEXT,
      status VARCHAR(50) DEFAULT 'New',
      severity VARCHAR(20) NOT NULL,
      priority VARCHAR(20) NOT NULL,
      type VARCHAR(50) DEFAULT 'Functional',
      discovered_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      assigned_date DATETIME,
      resolution_date DATETIME,
      environment VARCHAR(200),
      FOREIGN KEY (project_id) REFERENCES projects(project_id),
      FOREIGN KEY (sub_project_id) REFERENCES sub_projects(sub_project_id),
      FOREIGN KEY (test_case_id) REFERENCES test_cases(test_case_id),
      FOREIGN KEY (discovered_by) REFERENCES testers(tester_id),
      FOREIGN KEY (assigned_to) REFERENCES testers(tester_id)
    );
  `);

  console.log('SQLite database initialized');

  return {
    query: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        try {
          const stmt = db.prepare(sql);
          let result;
          
          if (sql.trim().toUpperCase().startsWith('SELECT')) {
            result = stmt.all(...params);
            resolve([result]);
          } else {
            result = stmt.run(...params);
            resolve([{ insertId: result.lastInsertRowid, affectedRows: result.changes }]);
          }
        } catch (error) {
          reject(error);
        }
      });
    },
    getConnection: async () => {
      return {
        query: (sql, params = []) => {
          return new Promise((resolve, reject) => {
            try {
              const stmt = db.prepare(sql);
              let result;
              
              if (sql.trim().toUpperCase().startsWith('SELECT')) {
                result = stmt.all(...params);
                resolve([result]);
              } else {
                result = stmt.run(...params);
                resolve([{ insertId: result.lastInsertRowid, affectedRows: result.changes }]);
              }
            } catch (error) {
              reject(error);
            }
          });
        },
        release: () => {}
      };
    }
  };
}

function getPool() {
  return pool;
}

module.exports = { initDatabase, getPool };
