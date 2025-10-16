import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BugsTab from '../../components/BugsTab';

vi.mock('../../lib/api', () => ({
  default: {
    getBugs: vi.fn(() => Promise.resolve([])),
    createBug: vi.fn((bug) => Promise.resolve({ bug_id: 1, ...bug })),
    updateBug: vi.fn((id, updates) => Promise.resolve({ bug_id: id, ...updates })),
    getProjects: vi.fn(() => Promise.resolve([])),
    getSubProjects: vi.fn(() => Promise.resolve([])),
    getTesters: vi.fn(() => Promise.resolve([])),
    getTestCases: vi.fn(() => Promise.resolve([])),
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

describe('BugsTab Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders bugs tab component', () => {
    render(<BugsTab />, { wrapper: createWrapper() });
    const bugsElements = screen.getAllByText(/bugs/i);
    expect(bugsElements.length).toBeGreaterThan(0);
  });

  it('shows loading state initially', () => {
    render(<BugsTab />, { wrapper: createWrapper() });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
