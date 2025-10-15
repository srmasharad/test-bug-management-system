import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api, { Project, SubProject, Tester, TestSuite, TestCase, TestExecution, Bug } from '../lib/api';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: api.getProjects,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create project: ${error.message}`);
    },
  });
};

export const useSubProjects = (projectId?: number) => {
  return useQuery({
    queryKey: projectId ? ['subprojects', projectId] : ['subprojects'],
    queryFn: () => api.getSubProjects(projectId),
  });
};

export const useCreateSubProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createSubProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subprojects'] });
      toast.success('Sub-project created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create sub-project: ${error.message}`);
    },
  });
};

export const useTesters = () => {
  return useQuery({
    queryKey: ['testers'],
    queryFn: api.getTesters,
  });
};

export const useCreateTester = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createTester,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testers'] });
      toast.success('Tester created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create tester: ${error.message}`);
    },
  });
};

export const useTestSuites = (projectId?: number) => {
  return useQuery({
    queryKey: projectId ? ['testsuites', projectId] : ['testsuites'],
    queryFn: () => api.getTestSuites(projectId),
  });
};

export const useCreateTestSuite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createTestSuite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testsuites'] });
      toast.success('Test suite created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create test suite: ${error.message}`);
    },
  });
};

export const useTestCases = (suiteId?: number) => {
  return useQuery({
    queryKey: suiteId ? ['testcases', suiteId] : ['testcases'],
    queryFn: () => api.getTestCases(suiteId),
  });
};

export const useCreateTestCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createTestCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testcases'] });
      toast.success('Test case created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create test case: ${error.message}`);
    },
  });
};

export const useExecutions = () => {
  return useQuery({
    queryKey: ['executions'],
    queryFn: api.getExecutions,
  });
};

export const useCreateExecution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createExecution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['executions'] });
      toast.success('Test execution recorded successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to record execution: ${error.message}`);
    },
  });
};

export const useBugs = (projectId?: number) => {
  return useQuery({
    queryKey: projectId ? ['bugs', projectId] : ['bugs'],
    queryFn: () => api.getBugs(projectId),
  });
};

export const useCreateBug = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createBug,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bugs'] });
      toast.success('Bug created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create bug: ${error.message}`);
    },
  });
};

export const useUpdateBug = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bugId, updates }: { bugId: number; updates: Partial<Bug> }) =>
      api.updateBug(bugId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bugs'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['charts'] });
      toast.success('Bug updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update bug: ${error.message}`);
    },
  });
};

export const useTestExecutionsBySuite = (days: number = 7) => {
  return useQuery({
    queryKey: ['reports', 'test-executions-by-suite', days],
    queryFn: () => api.getTestExecutionsBySuite(days),
    staleTime: 1000 * 60 * 2,
  });
};

export const useProjectsWithBugs = () => {
  return useQuery({
    queryKey: ['reports', 'projects-with-bugs'],
    queryFn: api.getProjectsWithBugs,
    staleTime: 1000 * 60 * 2,
  });
};

export const useBugsPerTester = (days: number = 7) => {
  return useQuery({
    queryKey: ['reports', 'bugs-per-tester', days],
    queryFn: () => api.getBugsPerTester(days),
    staleTime: 1000 * 60 * 2,
  });
};

export const useBugsDiscoveredLastWeek = () => {
  return useQuery({
    queryKey: ['reports', 'bugs-discovered-last-week'],
    queryFn: api.getBugsDiscoveredLastWeek,
    staleTime: 1000 * 60 * 2,
  });
};

export const useUnassignedBugs = () => {
  return useQuery({
    queryKey: ['reports', 'unassigned-bugs'],
    queryFn: api.getUnassignedBugs,
    staleTime: 1000 * 60 * 2,
  });
};

export const useOpenIssuesByProject = (days: number = 30) => {
  return useQuery({
    queryKey: ['charts', 'open-issues-by-project', days],
    queryFn: () => api.getOpenIssuesByProject(days),
    staleTime: 1000 * 60 * 3,
  });
};

export const useClosedIssuesByProject = (days: number = 30) => {
  return useQuery({
    queryKey: ['charts', 'closed-issues-by-project', days],
    queryFn: () => api.getClosedIssuesByProject(days),
    staleTime: 1000 * 60 * 3,
  });
};

export const useBugStatusDistribution = () => {
  return useQuery({
    queryKey: ['charts', 'bug-status-distribution'],
    queryFn: api.getBugStatusDistribution,
    staleTime: 1000 * 60 * 3,
  });
};

export const useBugSeverityDistribution = () => {
  return useQuery({
    queryKey: ['charts', 'bug-severity-distribution'],
    queryFn: api.getBugSeverityDistribution,
    staleTime: 1000 * 60 * 3,
  });
};
