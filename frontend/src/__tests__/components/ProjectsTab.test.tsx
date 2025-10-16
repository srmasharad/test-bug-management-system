import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProjectsTab from '../../components/ProjectsTab';

vi.mock('../../lib/api', () => ({
  default: {
    getProjects: vi.fn(() => Promise.resolve([])),
    createProject: vi.fn((project) => Promise.resolve({ project_id: 1, ...project })),
    getSubProjects: vi.fn(() => Promise.resolve([])),
    createSubProject: vi.fn((subproject) => Promise.resolve({ sub_project_id: 1, ...subproject })),
  }
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('ProjectsTab Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders project form', () => {
    render(<ProjectsTab />, { wrapper: createWrapper() });
    expect(screen.getAllByText(/project/i).length).toBeGreaterThan(0);
  });

  it('shows loading state initially', () => {
    render(<ProjectsTab />, { wrapper: createWrapper() });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
