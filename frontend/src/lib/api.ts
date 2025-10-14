const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Project {
  project_id?: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
}

export interface SubProject {
  sub_project_id?: number;
  project_id: number;
  name: string;
  description?: string;
}

export interface Tester {
  tester_id?: number;
  name: string;
  email: string;
  role?: string;
  date_joined: string;
}

export interface TestSuite {
  test_suite_id?: number;
  project_id: number;
  name: string;
  description?: string;
  created_date?: string;
}

export interface TestCase {
  test_case_id?: number;
  test_suite_id: number;
  name: string;
  description?: string;
  preconditions?: string;
  steps?: string;
  expected_result?: string;
  priority?: string;
  created_date?: string;
}

export interface TestExecution {
  execution_id?: number;
  test_case_id: number;
  tester_id: number;
  status: string;
  notes?: string;
  execution_date?: string;
}

export interface Bug {
  bug_id?: number;
  project_id: number;
  sub_project_id?: number;
  test_case_id?: number;
  discovered_by: number;
  assigned_to?: number;
  name: string;
  description?: string;
  steps_to_reproduce?: string;
  status?: string;
  severity: string;
  priority: string;
  type?: string;
  environment?: string;
  discovered_date?: string;
  assigned_date?: string;
  resolution_date?: string;
}

const api = {
  getProjects: () => fetch(`${API_URL}/api/projects`).then(r => r.json()),
  createProject: (project: Project) => 
    fetch(`${API_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    }).then(r => r.json()),
  
  getSubProjects: (projectId?: number) => {
    const url = projectId 
      ? `${API_URL}/api/subprojects?project_id=${projectId}`
      : `${API_URL}/api/subprojects`;
    return fetch(url).then(r => r.json());
  },
  createSubProject: (subproject: SubProject) => 
    fetch(`${API_URL}/api/subprojects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subproject)
    }).then(r => r.json()),
  
  getTesters: () => fetch(`${API_URL}/api/testers`).then(r => r.json()),
  createTester: (tester: Tester) => 
    fetch(`${API_URL}/api/testers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tester)
    }).then(r => r.json()),
  
  getTestSuites: (projectId?: number) => {
    const url = projectId 
      ? `${API_URL}/api/testsuites?project_id=${projectId}`
      : `${API_URL}/api/testsuites`;
    return fetch(url).then(r => r.json());
  },
  createTestSuite: (suite: TestSuite) => 
    fetch(`${API_URL}/api/testsuites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(suite)
    }).then(r => r.json()),
  
  getTestCases: (suiteId?: number) => {
    const url = suiteId 
      ? `${API_URL}/api/testcases?test_suite_id=${suiteId}`
      : `${API_URL}/api/testcases`;
    return fetch(url).then(r => r.json());
  },
  createTestCase: (testcase: TestCase) => 
    fetch(`${API_URL}/api/testcases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testcase)
    }).then(r => r.json()),
  
  getExecutions: () => fetch(`${API_URL}/api/executions`).then(r => r.json()),
  createExecution: (execution: TestExecution) => 
    fetch(`${API_URL}/api/executions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(execution)
    }).then(r => r.json()),
  
  getBugs: (projectId?: number) => {
    const url = projectId 
      ? `${API_URL}/api/bugs?project_id=${projectId}`
      : `${API_URL}/api/bugs`;
    return fetch(url).then(r => r.json());
  },
  createBug: (bug: Bug) => 
    fetch(`${API_URL}/api/bugs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bug)
    }).then(r => r.json()),
  updateBug: (bugId: number, updates: Partial<Bug>) => 
    fetch(`${API_URL}/api/bugs/${bugId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).then(r => r.json()),
  
  getTestExecutionsBySuite: (days: number = 7) => 
    fetch(`${API_URL}/api/reports/test-executions-by-suite?days=${days}`).then(r => r.json()),
  getProjectsWithBugs: () => 
    fetch(`${API_URL}/api/reports/projects-with-bugs`).then(r => r.json()),
  getBugsPerTester: (days: number = 7) => 
    fetch(`${API_URL}/api/reports/bugs-per-tester?days=${days}`).then(r => r.json()),
  getBugsDiscoveredLastWeek: () => 
    fetch(`${API_URL}/api/reports/bugs-discovered-last-week`).then(r => r.json()),
  getUnassignedBugs: () => 
    fetch(`${API_URL}/api/reports/unassigned-bugs`).then(r => r.json()),
  
  getOpenIssuesByProject: (days: number = 30) => 
    fetch(`${API_URL}/api/charts/open-issues-by-project?days=${days}`).then(r => r.json()),
  getClosedIssuesByProject: (days: number = 30) => 
    fetch(`${API_URL}/api/charts/closed-issues-by-project?days=${days}`).then(r => r.json()),
  getBugStatusDistribution: () => 
    fetch(`${API_URL}/api/charts/bug-status-distribution`).then(r => r.json()),
  getBugSeverityDistribution: () => 
    fetch(`${API_URL}/api/charts/bug-severity-distribution`).then(r => r.json()),
};

export default api;
