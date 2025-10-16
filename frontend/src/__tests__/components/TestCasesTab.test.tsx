import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TestCasesTab from '../../components/TestCasesTab';

vi.mock('../../lib/api', () => ({
  default: {
    getTestCases: vi.fn(() => Promise.resolve([
      { 
        test_case_id: 1, 
        name: 'Login Test',
        description: 'Test login functionality',
        preconditions: 'User exists',
        steps: '1. Enter credentials\n2. Click login',
        expected_result: 'User logged in',
        priority: 'High'
      }
    ])),
    createTestCase: vi.fn((testCase) => Promise.resolve({ test_case_id: 2, ...testCase })),
    getTestSuites: vi.fn(() => Promise.resolve([])),
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

describe('TestCasesTab Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders test case creation form', () => {
    render(<TestCasesTab />, { wrapper: createWrapper() });
    
    expect(screen.getByRole('button', { name: /create test case/i })).toBeInTheDocument();
  });

  it('displays test cases after loading', async () => {
    render(<TestCasesTab />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Login Test')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    render(<TestCasesTab />, { wrapper: createWrapper() });
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays test case priority', async () => {
    render(<TestCasesTab />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText(/high/i)).toBeInTheDocument();
    });
  });
});
