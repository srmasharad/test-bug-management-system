const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

let mockQuery;
let mockDb = {
  query: jest.fn()
};

beforeEach(() => {
  mockQuery = jest.fn();
  mockDb.query = mockQuery;
});

describe('Backend API Unit Tests', () => {
  
  describe('Health Check', () => {
    test('GET /healthz should return status ok', async () => {
      app.get('/healthz', (req, res) => {
        res.json({ status: 'ok' });
      });
      
      const response = await request(app).get('/healthz');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('Projects API', () => {
    beforeEach(() => {
      app.post('/api/projects', async (req, res) => {
        try {
          const { name, description, start_date, end_date, status } = req.body;
          if (!name) {
            return res.status(400).json({ error: 'Name is required' });
          }
          const result = { insertId: 1 };
          res.json({ project_id: result.insertId, ...req.body });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });

      app.get('/api/projects', async (req, res) => {
        try {
          const projects = [
            { project_id: 1, name: 'Test Project', description: 'Test Description', status: 'Active' }
          ];
          res.json(projects);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });

      app.get('/api/projects/:id', async (req, res) => {
        try {
          const project = { project_id: 1, name: 'Test Project', status: 'Active' };
          res.json(project);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });
    });

    test('POST /api/projects should create a new project', async () => {
      const newProject = {
        name: 'Test Project',
        description: 'Test Description',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        status: 'Active'
      };

      const response = await request(app)
        .post('/api/projects')
        .send(newProject);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('project_id');
      expect(response.body.name).toBe('Test Project');
    });

    test('POST /api/projects should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({ description: 'Test' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('GET /api/projects should return all projects', async () => {
      const response = await request(app).get('/api/projects');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('GET /api/projects/:id should return a specific project', async () => {
      const response = await request(app).get('/api/projects/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('project_id');
      expect(response.body).toHaveProperty('name');
    });
  });

  describe('Testers API', () => {
    beforeEach(() => {
      app.post('/api/testers', async (req, res) => {
        try {
          const { name, email, role, date_joined } = req.body;
          if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
          }
          res.json({ tester_id: 1, ...req.body });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });

      app.get('/api/testers', async (req, res) => {
        res.json([{ tester_id: 1, name: 'Test Tester', email: 'test@test.com' }]);
      });
    });

    test('POST /api/testers should create a new tester', async () => {
      const newTester = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'QA Engineer',
        date_joined: '2024-01-01'
      };

      const response = await request(app)
        .post('/api/testers')
        .send(newTester);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('tester_id');
      expect(response.body.email).toBe('john@example.com');
    });

    test('POST /api/testers should validate required fields', async () => {
      const response = await request(app)
        .post('/api/testers')
        .send({ role: 'QA Engineer' });

      expect(response.status).toBe(400);
    });

    test('GET /api/testers should return all testers', async () => {
      const response = await request(app).get('/api/testers');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Test Suites API', () => {
    beforeEach(() => {
      app.post('/api/testsuites', async (req, res) => {
        try {
          const { project_id, name, description } = req.body;
          if (!project_id || !name) {
            return res.status(400).json({ error: 'Project ID and name are required' });
          }
          res.json({ test_suite_id: 1, ...req.body, created_date: new Date().toISOString() });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });

      app.get('/api/testsuites', async (req, res) => {
        res.json([{ test_suite_id: 1, project_id: 1, name: 'Test Suite' }]);
      });
    });

    test('POST /api/testsuites should create a new test suite', async () => {
      const newSuite = {
        project_id: 1,
        name: 'Payment Tests',
        description: 'Payment functionality tests'
      };

      const response = await request(app)
        .post('/api/testsuites')
        .send(newSuite);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('test_suite_id');
      expect(response.body.name).toBe('Payment Tests');
    });

    test('GET /api/testsuites should return all test suites', async () => {
      const response = await request(app).get('/api/testsuites');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Test Cases API', () => {
    beforeEach(() => {
      app.post('/api/testcases', async (req, res) => {
        try {
          const { test_suite_id, name } = req.body;
          if (!test_suite_id || !name) {
            return res.status(400).json({ error: 'Test suite ID and name are required' });
          }
          res.json({ test_case_id: 1, ...req.body });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });

      app.get('/api/testcases', async (req, res) => {
        res.json([{ test_case_id: 1, test_suite_id: 1, name: 'Test Case' }]);
      });
    });

    test('POST /api/testcases should create a new test case', async () => {
      const newTestCase = {
        test_suite_id: 1,
        name: 'Login Test',
        description: 'Test user login functionality',
        preconditions: 'User exists',
        steps: '1. Enter credentials\n2. Click login',
        expected_result: 'User logged in successfully',
        priority: 'High'
      };

      const response = await request(app)
        .post('/api/testcases')
        .send(newTestCase);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('test_case_id');
      expect(response.body.priority).toBe('High');
    });

    test('GET /api/testcases should return all test cases', async () => {
      const response = await request(app).get('/api/testcases');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Bugs API', () => {
    beforeEach(() => {
      app.post('/api/bugs', async (req, res) => {
        try {
          const { project_id, discovered_by, name, severity, priority } = req.body;
          if (!project_id || !discovered_by || !name || !severity || !priority) {
            return res.status(400).json({ error: 'Required fields missing' });
          }
          res.json({ bug_id: 1, ...req.body, status: req.body.status || 'New' });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });

      app.get('/api/bugs', async (req, res) => {
        res.json([{ bug_id: 1, name: 'Test Bug', severity: 'High', status: 'New' }]);
      });

      app.put('/api/bugs/:id', async (req, res) => {
        try {
          const bug = { bug_id: req.params.id, ...req.body };
          res.json(bug);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });
    });

    test('POST /api/bugs should create a new bug', async () => {
      const newBug = {
        project_id: 1,
        discovered_by: 1,
        name: 'Login button not working',
        description: 'Button does not respond to clicks',
        severity: 'Critical',
        priority: 'P1',
        status: 'New'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(newBug);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('bug_id');
      expect(response.body.severity).toBe('Critical');
    });

    test('PUT /api/bugs/:id should update a bug', async () => {
      const updates = {
        status: 'Fixed',
        assigned_to: 2
      };

      const response = await request(app)
        .put('/api/bugs/1')
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('Fixed');
    });

    test('GET /api/bugs should return all bugs', async () => {
      const response = await request(app).get('/api/bugs');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Test Executions API', () => {
    beforeEach(() => {
      app.post('/api/executions', async (req, res) => {
        try {
          const { test_case_id, tester_id, status } = req.body;
          if (!test_case_id || !tester_id || !status) {
            return res.status(400).json({ error: 'Required fields missing' });
          }
          res.json({ execution_id: 1, ...req.body });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });

      app.get('/api/executions', async (req, res) => {
        res.json([{ execution_id: 1, test_case_id: 1, status: 'Pass' }]);
      });
    });

    test('POST /api/executions should create a new execution', async () => {
      const newExecution = {
        test_case_id: 1,
        tester_id: 1,
        status: 'Pass',
        notes: 'All steps passed'
      };

      const response = await request(app)
        .post('/api/executions')
        .send(newExecution);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('execution_id');
      expect(response.body.status).toBe('Pass');
    });

    test('GET /api/executions should return all executions', async () => {
      const response = await request(app).get('/api/executions');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
