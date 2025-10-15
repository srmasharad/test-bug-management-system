import {
  useEffect,
  useState,
} from 'react';

import {
  FileText,
  Play,
  Plus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import api, {
  type TestCase,
  type Tester,
  type TestExecution,
  type TestSuite,
} from '@/lib/api';

export default function TestCasesTab() {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [testers, setTesters] = useState<Tester[]>([]);
  const [loading, setLoading] = useState(false);
  const [showExecutionForm, setShowExecutionForm] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState<number | null>(null);

  const [formData, setFormData] = useState<TestCase>({
    test_suite_id: 0,
    name: "",
    description: "",
    preconditions: "",
    steps: "",
    expected_result: "",
    priority: "Medium",
  });

  const [executionForm, setExecutionForm] = useState<TestExecution>({
    test_case_id: 0,
    tester_id: 0,
    status: "Pass",
    notes: "",
  });

  useEffect(() => {
    loadTestCases();
    loadTestSuites();
    loadTesters();
  }, []);

  const loadTestCases = async () => {
    setLoading(true);
    try {
      const data = await api.getTestCases();
      setTestCases(data);
    } catch (error) {
      console.error("Error loading test cases:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTestSuites = async () => {
    try {
      const data = await api.getTestSuites();
      setTestSuites(data);
    } catch (error) {
      console.error("Error loading test suites:", error);
    }
  };

  const loadTesters = async () => {
    try {
      const data = await api.getTesters();
      setTesters(data);
    } catch (error) {
      console.error("Error loading testers:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createTestCase(formData);
      setFormData({
        test_suite_id: 0,
        name: "",
        description: "",
        preconditions: "",
        steps: "",
        expected_result: "",
        priority: "Medium",
      });
      loadTestCases();
    } catch (error) {
      console.error("Error creating test case:", error);
    }
  };

  const handleExecutionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createExecution(executionForm);
      setExecutionForm({
        test_case_id: 0,
        tester_id: 0,
        status: "Pass",
        notes: "",
      });
      setShowExecutionForm(false);
      setSelectedTestCase(null);
    } catch (error) {
      console.error("Error creating execution:", error);
    }
  };

  const startExecution = (testCaseId: number) => {
    setSelectedTestCase(testCaseId);
    setExecutionForm({ ...executionForm, test_case_id: testCaseId });
    setShowExecutionForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Test Case
            </CardTitle>
            <CardDescription>
              Add a new test case to a test suite
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="test_suite_id">Test Suite *</Label>
                <Select
                  value={formData.test_suite_id.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, test_suite_id: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select test suite" />
                  </SelectTrigger>
                  <SelectContent>
                    {testSuites.map((suite) => (
                      <SelectItem
                        key={suite.test_suite_id}
                        value={suite.test_suite_id!.toString()}
                      >
                        {suite.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name">Test Case Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="preconditions">Preconditions</Label>
                <Textarea
                  id="preconditions"
                  value={formData.preconditions}
                  onChange={(e) =>
                    setFormData({ ...formData, preconditions: e.target.value })
                  }
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="steps">Test Steps</Label>
                <Textarea
                  id="steps"
                  value={formData.steps}
                  onChange={(e) =>
                    setFormData({ ...formData, steps: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="expected_result">Expected Result</Label>
                <Textarea
                  id="expected_result"
                  value={formData.expected_result}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expected_result: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={!formData.test_suite_id}
              >
                Create Test Case
              </Button>
            </form>
          </CardContent>
        </Card>

        {showExecutionForm && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Execute Test Case
              </CardTitle>
              <CardDescription>Record test execution results</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleExecutionSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="tester_id">Tester *</Label>
                  <Select
                    value={executionForm.tester_id.toString()}
                    onValueChange={(value) =>
                      setExecutionForm({
                        ...executionForm,
                        tester_id: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tester" />
                    </SelectTrigger>
                    <SelectContent>
                      {testers.map((tester) => (
                        <SelectItem
                          key={tester.tester_id}
                          value={tester.tester_id!.toString()}
                        >
                          {tester.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={executionForm.status}
                    onValueChange={(value) =>
                      setExecutionForm({ ...executionForm, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pass">Pass</SelectItem>
                      <SelectItem value="Fail">Fail</SelectItem>
                      <SelectItem value="Blocked">Blocked</SelectItem>
                      <SelectItem value="Skipped">Skipped</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={executionForm.notes}
                    onChange={(e) =>
                      setExecutionForm({
                        ...executionForm,
                        notes: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={!executionForm.tester_id}
                  >
                    Record Execution
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowExecutionForm(false);
                      setSelectedTestCase(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            All Test Cases
          </CardTitle>
          <CardDescription>View and execute test cases</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <div className="space-y-3">
              {testCases.map((testCase) => {
                const suite = testSuites.find(
                  (s) => s.test_suite_id === testCase.test_suite_id
                );
                return (
                  <div
                    key={testCase.test_case_id}
                    className="border rounded-lg p-4 bg-white"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">{testCase.name}</h3>
                        {testCase.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {testCase.description}
                          </p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-xs">
                          {testCase.preconditions && (
                            <div>
                              <span className="font-medium text-gray-700">
                                Preconditions:
                              </span>
                              <p className="text-gray-600">
                                {testCase.preconditions}
                              </p>
                            </div>
                          )}
                          {testCase.steps && (
                            <div>
                              <span className="font-medium text-gray-700">
                                Steps:
                              </span>
                              <p className="text-gray-600">{testCase.steps}</p>
                            </div>
                          )}
                          {testCase.expected_result && (
                            <div>
                              <span className="font-medium text-gray-700">
                                Expected:
                              </span>
                              <p className="text-gray-600">
                                {testCase.expected_result}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          <span>Suite: {suite?.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded ${
                              testCase.priority === "High"
                                ? "bg-red-100 text-red-800"
                                : testCase.priority === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {testCase.priority}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => startExecution(testCase.test_case_id!)}
                        className="ml-4"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Execute
                      </Button>
                    </div>
                  </div>
                );
              })}
              {testCases.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No test cases yet. Create your first test case!
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
