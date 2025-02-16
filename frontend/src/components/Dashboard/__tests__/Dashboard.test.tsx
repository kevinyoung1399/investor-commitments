import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from '../Dashboard';
import { fetchInvestors, fetchInvestorCommitments } from '../../../api/investors';

vi.mock('../../../api/investors');

describe('Dashboard', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const mockInvestors = [
    { id: 1, name: 'Investor 1', totalCommitment: 1000000 },
    { id: 2, name: 'Investor 2', totalCommitment: 2000000 },
  ];

  const mockCommitments = {
    investor: 'Investor 1',
    totalCommitment: 1000000,
    commitments: [
      { assetClass: 'Private Equity', amount: 600000, currency: 'GBP' },
      { assetClass: 'Natural Resources', amount: 400000, currency: 'GBP' },
    ],
  };

  beforeEach(() => {
    vi.resetAllMocks();
    (fetchInvestors as any).mockResolvedValue(mockInvestors);
    (fetchInvestorCommitments as any).mockResolvedValue(mockCommitments);
  });

  const renderDashboard = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    );
  };

  it('shows loading state initially', () => {
    renderDashboard();
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
  });

  it('renders investors list after loading', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Investor 1')).toBeInTheDocument();
      expect(screen.getByText('Investor 2')).toBeInTheDocument();
    });
  });

  it('shows error message when investors fetch fails', async () => {
    (fetchInvestors as any).mockRejectedValue(new Error('Failed to fetch'));
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/Failed to load investors/)).toBeInTheDocument();
    });
  });

  it('loads commitments when investor is selected', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Investor 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Investor 1'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Private Equity' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Natural Resources' })).toBeInTheDocument();
    });
  });

  it('filters commitments by asset class', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Investor 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Investor 1'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Private Equity' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Private Equity' }));

    expect(screen.queryByRole('heading', { name: 'Natural Resources' })).not.toBeInTheDocument();
  });
});
