import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FolderKanban, Loader2 } from 'lucide-react';
import { Project, SubProject } from '../lib/api';
import { useProjects, useSubProjects, useCreateProject, useCreateSubProject } from '../hooks/useQueries';

export default function ProjectsTab() {
  const { data: projects = [], isLoading } = useProjects();
  const { data: subProjects = [] } = useSubProjects();
  const createProject = useCreateProject();
  const createSubProject = useCreateSubProject();

  const [formData, setFormData] = useState<Project>({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'Active'
  });
  const [subProjectForm, setSubProjectForm] = useState<SubProject>({
    project_id: 0,
    name: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createProject.mutate(formData, {
      onSuccess: () => {
        setFormData({ name: '', description: '', start_date: '', end_date: '', status: 'Active' });
      }
    });
  };

  const handleSubProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createSubProject.mutate(subProjectForm, {
      onSuccess: () => {
        setSubProjectForm({ project_id: 0, name: '', description: '' });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Project
          </CardTitle>
          <CardDescription>Add a new project to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={createProject.isPending}>
              {createProject.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {createProject.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Sub-Project
          </CardTitle>
          <CardDescription>Add a sub-project under an existing project</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubProjectSubmit} className="space-y-4">
            <div>
              <Label htmlFor="project_id">Parent Project *</Label>
              <Select 
                value={subProjectForm.project_id.toString()} 
                onValueChange={(value) => setSubProjectForm({ ...subProjectForm, project_id: parseInt(value) })}
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
              <Label htmlFor="sub_name">Sub-Project Name *</Label>
              <Input
                id="sub_name"
                value={subProjectForm.name}
                onChange={(e) => setSubProjectForm({ ...subProjectForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="sub_description">Description</Label>
              <Textarea
                id="sub_description"
                value={subProjectForm.description}
                onChange={(e) => setSubProjectForm({ ...subProjectForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <Button type="submit" className="w-full" disabled={!subProjectForm.project_id || createSubProject.isPending}>
              {createSubProject.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {createSubProject.isPending ? 'Creating...' : 'Create Sub-Project'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5" />
            All Projects
          </CardTitle>
          <CardDescription>View all projects and their sub-projects</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-500">Loading projects...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map(project => (
                <div key={project.project_id} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      {project.description && <p className="text-sm text-gray-600 mt-1">{project.description}</p>}
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        {project.start_date && <span>Start: {project.start_date}</span>}
                        {project.end_date && <span>End: {project.end_date}</span>}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Active' ? 'bg-green-100 text-green-800' :
                      project.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  {subProjects.filter(sp => sp.project_id === project.project_id).length > 0 && (
                    <div className="mt-3 pl-4 border-l-2 border-gray-200">
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Sub-Projects:</h4>
                      {subProjects.filter(sp => sp.project_id === project.project_id).map(subProject => (
                        <div key={subProject.sub_project_id} className="text-sm py-1">
                          <span className="font-medium">{subProject.name}</span>
                          {subProject.description && <span className="text-gray-600 ml-2">- {subProject.description}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-center text-gray-500 py-8">No projects yet. Create your first project above!</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
