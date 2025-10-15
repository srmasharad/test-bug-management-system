import {
  useEffect,
  useState,
} from 'react';

import {
  Clipboard,
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
  type Project,
  type TestSuite,
} from '@/lib/api';

export default function TestSuitesTab() {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TestSuite>({
    project_id: 0,
    name: "",
    description: "",
  });

  useEffect(() => {
    loadTestSuites();
    loadProjects();
  }, []);

  const loadTestSuites = async () => {
    setLoading(true);
    try {
      const data = await api.getTestSuites();
      setTestSuites(data);
    } catch (error) {
      console.error("Error loading test suites:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createTestSuite(formData);
      setFormData({ project_id: 0, name: "", description: "" });
      loadTestSuites();
    } catch (error) {
      console.error("Error creating test suite:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Test Suite
          </CardTitle>
          <CardDescription>
            Add a new test suite to organize test cases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="project_id">Project *</Label>
              <Select
                value={formData.project_id.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, project_id: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem
                      key={project.project_id}
                      value={project.project_id!.toString()}
                    >
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="name">Test Suite Name *</Label>
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
                rows={4}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={!formData.project_id}
            >
              Create Test Suite
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clipboard className="h-5 w-5" />
            All Test Suites
          </CardTitle>
          <CardDescription>View all test suites</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <div className="space-y-3">
              {testSuites.map((suite) => {
                const project = projects.find(
                  (p) => p.project_id === suite.project_id
                );
                return (
                  <div
                    key={suite.test_suite_id}
                    className="border rounded-lg p-4 bg-white"
                  >
                    <h3 className="font-semibold">{suite.name}</h3>
                    {suite.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {suite.description}
                      </p>
                    )}
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span>Project: {project?.name}</span>
                      {suite.created_date && (
                        <span>
                          Created:{" "}
                          {new Date(suite.created_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              {testSuites.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No test suites yet. Create your first test suite!
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
