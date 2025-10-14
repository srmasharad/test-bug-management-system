import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Bug, Edit } from 'lucide-react';
import api, { Bug as BugType, Project, SubProject, TestCase, Tester } from '../lib/api';

export default function BugsTab() {
  const [bugs, setBugs] = useState<BugType[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [subProjects, setSubProjects] = useState<SubProject[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [testers, setTesters] = useState<Tester[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingBug, setEditingBug] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<BugType>({
    project_id: 0,
    sub_project_id: undefined,
    test_case_id: undefined,
    discovered_by: 0,
    assigned_to: undefined,
    name: '',
    description: '',
    steps_to_reproduce: '',
    status: 'New',
    severity: 'Medium',
    priority: 'P3',
    type: 'Functional',
    environment: ''
  });

  useEffect(() => {
    loadBugs();
    loadProjects();
    loadSubProjects();
    loadTestCases();
    loadTesters();
  }, []);

  const loadBugs = async () => {
    setLoading(true);
    try {
      const data = await api.getBugs();
      setBugs(data);
    } catch (error) {
      console.error('Error loading bugs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadSubProjects = async () => {
    try {
      const data = await api.getSubProjects();
      setSubProjects(data);
    } catch (error) {
      console.error('Error loading sub-projects:', error);
    }
  };

  const loadTestCases = async () => {
    try {
      const data = await api.getTestCases();
      setTestCases(data);
    } catch (error) {
      console.error('Error loading test cases:', error);
    }
  };

  const loadTesters = async () => {
    try {
      const data = await api.getTesters();
      setTesters(data);
    } catch (error) {
      console.error('Error loading testers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createBug(formData);
      setFormData({
        project_id: 0,
        sub_project_id: undefined,
        test_case_id: undefined,
        discovered_by: 0,
        assigned_to: undefined,
        name: '',
        description: '',
        steps_to_reproduce: '',
        status: 'New',
        severity: 'Medium',
        priority: 'P3',
        type: 'Functional',
        environment: ''
      });
      loadBugs();
    } catch (error) {
      console.error('Error creating bug:', error);
    }
  };

  const handleUpdate = async (bugId: number, updates: Partial<BugType>) => {
    try {
      await api.updateBug(bugId, updates);
      loadBugs();
      setEditingBug(null);
    } catch (error) {
      console.error('Error updating bug:', error);
    }
  };

  const filteredSubProjects = subProjects.filter(sp => sp.project_id === formData.project_id);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Assigned': return 'bg-purple-100 text-purple-800';
      case 'Open': return 'bg-yellow-100 text-yellow-800';
      case 'Fixed': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      case 'Verified': return 'bg-teal-100 text-teal-800';
      case 'Reopened': return 'bg-red-100 text-red-800';
      case 'Rejected': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Report Bug
          </CardTitle>
          <CardDescription>Create a new bug report with all essential information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Bug Title *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="project_id">Project *</Label>
              <Select 
                value={formData.project_id.toString()} 
                onValueChange={(value) => setFormData({ ...formData, project_id: parseInt(value), sub_project_id: undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(project => (
                    <SelectItem key={project.project_id} value={project.project_id!.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sub_project_id">Sub-Project</Label>
              <Select 
                value={formData.sub_project_id?.toString() || 'none'} 
                onValueChange={(value) => setFormData({ ...formData, sub_project_id: value === 'none' ? undefined : parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-project (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {filteredSubProjects.map(sp => (
                    <SelectItem key={sp.sub_project_id} value={sp.sub_project_id!.toString()}>
                      {sp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="test_case_id">Related Test Case</Label>
              <Select 
                value={formData.test_case_id?.toString() || 'none'} 
                onValueChange={(value) => setFormData({ ...formData, test_case_id: value === 'none' ? undefined : parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select test case (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {testCases.map(tc => (
                    <SelectItem key={tc.test_case_id} value={tc.test_case_id!.toString()}>
                      {tc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="discovered_by">Discovered By *</Label>
              <Select 
                value={formData.discovered_by.toString()} 
                onValueChange={(value) => setFormData({ ...formData, discovered_by: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tester" />
                </SelectTrigger>
                <SelectContent>
                  {testers.map(tester => (
                    <SelectItem key={tester.tester_id} value={tester.tester_id!.toString()}>
                      {tester.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="assigned_to">Assigned To</Label>
              <Select 
                value={formData.assigned_to?.toString() || 'none'} 
                onValueChange={(value) => setFormData({ ...formData, assigned_to: value === 'none' ? undefined : parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {testers.map(tester => (
                    <SelectItem key={tester.tester_id} value={tester.tester_id!.toString()}>
                      {tester.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="severity">Severity *</Label>
              <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority *</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="P1">P1 - Urgent</SelectItem>
                  <SelectItem value="P2">P2 - High</SelectItem>
                  <SelectItem value="P3">P3 - Medium</SelectItem>
                  <SelectItem value="P4">P4 - Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Assigned">Assigned</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Fixed">Fixed</SelectItem>
                  <SelectItem value="Retest">Retest</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Reopened">Reopened</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Deferred">Deferred</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Bug Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Functional">Functional</SelectItem>
                  <SelectItem value="Performance">Performance</SelectItem>
                  <SelectItem value="UI/UX">UI/UX</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Compatibility">Compatibility</SelectItem>
                  <SelectItem value="Data">Data</SelectItem>
                  <SelectItem value="Integration">Integration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="environment">Environment</Label>
              <Input
                id="environment"
                value={formData.environment}
                onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                placeholder="e.g., Chrome 120, Windows 11"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="steps_to_reproduce">Steps to Reproduce</Label>
              <Textarea
                id="steps_to_reproduce"
                value={formData.steps_to_reproduce}
                onChange={(e) => setFormData({ ...formData, steps_to_reproduce: e.target.value })}
                rows={4}
                placeholder="1. Go to...\n2. Click on...\n3. Observe..."
              />
            </div>

            <div className="md:col-span-2">
              <Button type="submit" className="w-full" disabled={!formData.project_id || !formData.discovered_by}>
                Report Bug
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            All Bugs
          </CardTitle>
          <CardDescription>View and manage all reported bugs</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <div className="space-y-4">
              {bugs.map(bug => {
                const project = projects.find(p => p.project_id === bug.project_id);
                const subProject = subProjects.find(sp => sp.sub_project_id === bug.sub_project_id);
                const testCase = testCases.find(tc => tc.test_case_id === bug.test_case_id);
                const discoveredBy = testers.find(t => t.tester_id === bug.discovered_by);
                const assignedTo = testers.find(t => t.tester_id === bug.assigned_to);
                const isEditing = editingBug === bug.bug_id;

                return (
                  <div key={bug.bug_id} className={`border rounded-lg p-4 ${getSeverityColor(bug.severity)} border`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">#{bug.bug_id} - {bug.name}</h3>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(bug.status!)}`}>
                            {bug.status}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(bug.severity)}`}>
                            {bug.severity}
                          </span>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {bug.priority}
                          </span>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {bug.type}
                          </span>
                        </div>
                      </div>
                      {!isEditing && (
                        <Button size="sm" variant="outline" onClick={() => setEditingBug(bug.bug_id!)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>

                    {bug.description && <p className="text-sm mt-2">{bug.description}</p>}
                    {bug.steps_to_reproduce && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Steps to Reproduce:</span>
                        <pre className="mt-1 whitespace-pre-wrap bg-white/50 p-2 rounded">{bug.steps_to_reproduce}</pre>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-xs">
                      <div>
                        <span className="font-medium">Project:</span> {project?.name}
                      </div>
                      {subProject && (
                        <div>
                          <span className="font-medium">Sub-Project:</span> {subProject.name}
                        </div>
                      )}
                      {testCase && (
                        <div>
                          <span className="font-medium">Test Case:</span> {testCase.name}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Discovered By:</span> {discoveredBy?.name}
                      </div>
                      <div>
                        <span className="font-medium">Assigned To:</span> {assignedTo?.name || 'Unassigned'}
                      </div>
                      {bug.environment && (
                        <div>
                          <span className="font-medium">Environment:</span> {bug.environment}
                        </div>
                      )}
                      {bug.discovered_date && (
                        <div>
                          <span className="font-medium">Discovered:</span> {new Date(bug.discovered_date).toLocaleDateString()}
                        </div>
                      )}
                      {bug.resolution_date && (
                        <div>
                          <span className="font-medium">Resolved:</span> {new Date(bug.resolution_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div>
                          <Label className="text-xs">Status</Label>
                          <Select 
                            value={bug.status} 
                            onValueChange={(value) => handleUpdate(bug.bug_id!, { status: value })}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="New">New</SelectItem>
                              <SelectItem value="Assigned">Assigned</SelectItem>
                              <SelectItem value="Open">Open</SelectItem>
                              <SelectItem value="Fixed">Fixed</SelectItem>
                              <SelectItem value="Retest">Retest</SelectItem>
                              <SelectItem value="Verified">Verified</SelectItem>
                              <SelectItem value="Closed">Closed</SelectItem>
                              <SelectItem value="Reopened">Reopened</SelectItem>
                              <SelectItem value="Rejected">Rejected</SelectItem>
                              <SelectItem value="Deferred">Deferred</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Assign To</Label>
                          <Select 
                            value={bug.assigned_to?.toString() || 'none'} 
                            onValueChange={(value) => handleUpdate(bug.bug_id!, { assigned_to: value === 'none' ? undefined : parseInt(value) })}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Unassigned</SelectItem>
                              {testers.map(tester => (
                                <SelectItem key={tester.tester_id} value={tester.tester_id!.toString()}>
                                  {tester.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => setEditingBug(null)} className="mt-auto">
                          Done
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
              {bugs.length === 0 && (
                <p className="text-center text-gray-500 py-8">No bugs reported yet.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
