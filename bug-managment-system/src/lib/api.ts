const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

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
  getProjects: () => fetch(`${API_URL}/api/projects`).then(handleResponse),
  createProject: (project: Project) =>
    fetch(`${API_URL}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    }).then(handleResponse),

  getSubProjects: (projectId?: number) => {
    const url = projectId
      ? `${API_URL}/api/subprojects?project_id=${projectId}`
      : `${API_URL}/api/subprojects`;
    return fetch(url).then(handleResponse);
  },
  createSubProject: (subproject: SubProject) =>
    fetch(`${API_URL}/api/subprojects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subproject),
    }).then(handleResponse),

  getTesters: () => fetch(`${API_URL}/api/testers`).then(handleResponse),
  createTester: (tester: Tester) =>
    fetch(`${API_URL}/api/testers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tester),
    }).then(handleResponse),

  getTestSuites: (projectId?: number) => {
    const url = projectId
      ? `${API_URL}/api/testsuites?project_id=${projectId}`
      : `${API_URL}/api/testsuites`;
    return fetch(url).then(handleResponse);
  },
  createTestSuite: (suite: TestSuite) =>
    fetch(`${API_URL}/api/testsuites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(suite),
    }).then(handleResponse),

  getTestCases: (suiteId?: number) => {
    const url = suiteId
      ? `${API_URL}/api/testcases?test_suite_id=${suiteId}`
      : `${API_URL}/api/testcases`;
    return fetch(url).then(handleResponse);
  },
  createTestCase: (testcase: TestCase) =>
    fetch(`${API_URL}/api/testcases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testcase),
    }).then(handleResponse),

  getExecutions: () => fetch(`${API_URL}/api/executions`).then(handleResponse),
  createExecution: (execution: TestExecution) =>
    fetch(`${API_URL}/api/executions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(execution),
    }).then(handleResponse),

  getBugs: (projectId?: number) => {
    const url = projectId
      ? `${API_URL}/api/bugs?project_id=${projectId}`
      : `${API_URL}/api/bugs`;
    return fetch(url).then(handleResponse);
  },
  createBug: (bug: Bug) =>
    fetch(`${API_URL}/api/bugs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bug),
    }).then(handleResponse),
  updateBug: (bugId: number, updates: Partial<Bug>) =>
    fetch(`${API_URL}/api/bugs/${bugId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }).then(handleResponse),

  getTestExecutionsBySuite: (days: number = 7) =>
    fetch(`${API_URL}/api/reports/test-executions-by-suite?days=${days}`).then(
      handleResponse
    ),
  getProjectsWithBugs: () =>
    fetch(`${API_URL}/api/reports/projects-with-bugs`).then(handleResponse),
  getBugsPerTester: (days: number = 7) =>
    fetch(`${API_URL}/api/reports/bugs-per-tester?days=${days}`).then(
      handleResponse
    ),
  getBugsDiscoveredLastWeek: () =>
    fetch(`${API_URL}/api/reports/bugs-discovered-last-week`).then(
      handleResponse
    ),
  getUnassignedBugs: () =>
    fetch(`${API_URL}/api/reports/unassigned-bugs`).then(handleResponse),

  getOpenIssuesByProject: (days: number = 30) =>
    fetch(`${API_URL}/api/charts/open-issues-by-project?days=${days}`).then(
      handleResponse
    ),
  getClosedIssuesByProject: (days: number = 30) =>
    fetch(`${API_URL}/api/charts/closed-issues-by-project?days=${days}`).then(
      handleResponse
    ),
  getBugStatusDistribution: () =>
    fetch(`${API_URL}/api/charts/bug-status-distribution`).then(handleResponse),
  getBugSeverityDistribution: () =>
    fetch(`${API_URL}/api/charts/bug-severity-distribution`).then(
      handleResponse
    ),
};

export default api;
