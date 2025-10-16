import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReportsTab from '../../components/ReportsTab';

vi.mock('../../lib/api', () => ({
  default: {
    getTestExecutionsBySuite: vi.fn(() => Promise.resolve([])),
    getProjectsWithBugs: vi.fn(() => Promise.resolve([])),
    getBugsPerTester: vi.fn(() => Promise.resolve([])),
    getBugsDiscoveredLastWeek: vi.fn(() => Promise.resolve([])),
    getUnassignedBugs: vi.fn(() => Promise.resolve([])),
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

describe('ReportsTab Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders reports tab component', () => {
    render(<ReportsTab />, { wrapper: createWrapper() });
    const reportElements = screen.getAllByText(/report/i);
    expect(reportElements.length).toBeGreaterThan(0);
  });

  it('displays multiple report sections', async () => {
    render(<ReportsTab />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      const reportElements = screen.getAllByText(/report/i);
      expect(reportElements.length).toBeGreaterThan(1);
    });
  });
});
