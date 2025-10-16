import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProjectsTab from '../ProjectsTab';

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

vi.mock('../../lib/api', () => ({
  default: {
    getProjects: vi.fn(() => Promise.resolve([
      { project_id: 1, name: 'Test Project', description: 'Test Desc', status: 'Active' }
    ])),
    createProject: vi.fn((project) => Promise.resolve({ project_id: 2, ...project })),
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

describe('ProjectsTab Component', () => {
  it('renders project creation form', () => {
    render(<ProjectsTab />, { wrapper: createWrapper() });
    
    expect(screen.getAllByText(/Create Project/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Create Project/i })).toBeInTheDocument();
  });

  it('displays loading state while fetching projects', () => {
    render(<ProjectsTab />, { wrapper: createWrapper() });
    
    expect(screen.getByText(/Loading projects.../i)).toBeInTheDocument();
  });

  it('displays projects after loading', async () => {
    render(<ProjectsTab />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });
  });

  it('creates a new project when form is submitted', async () => {
    const user = userEvent.setup();
    render(<ProjectsTab />, { wrapper: createWrapper() });
    
    const nameInput = screen.getByLabelText(/Project Name/i);
    const descInput = screen.getByLabelText(/Description/i);
    const submitButton = screen.getByRole('button', { name: /Create Project/i });
    
    await user.type(nameInput, 'New Test Project');
    await user.type(descInput, 'New Description');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(nameInput).toHaveValue('');
    });
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<ProjectsTab />, { wrapper: createWrapper() });
    
    const submitButton = screen.getByRole('button', { name: /Create Project/i });
    
    await user.click(submitButton);
    
    const nameInput = screen.getByLabelText(/Project Name/i);
    expect(nameInput).toBeInvalid();
  });

  it('displays sub-project creation form', async () => {
    render(<ProjectsTab />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText(/Create Sub-Project/i)).toBeInTheDocument();
    });
  });
});
