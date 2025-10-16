import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TestersTab from '../../components/TestersTab';

vi.mock('../../lib/api', () => ({
  default: {
    getTesters: vi.fn(() => Promise.resolve([
      { tester_id: 1, name: 'John Doe', email: 'john@test.com', role: 'QA Engineer', date_joined: '2024-01-01' }
    ])),
    createTester: vi.fn((tester) => Promise.resolve({ tester_id: 2, ...tester })),
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

describe('TestersTab Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders tester creation form', () => {
    render(<TestersTab />, { wrapper: createWrapper() });
    
    expect(screen.getByRole('button', { name: /add tester/i })).toBeInTheDocument();
  });

  it('displays testers after loading', async () => {
    render(<TestersTab />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@test.com')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    render(<TestersTab />, { wrapper: createWrapper() });
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
