import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CommitmentTable } from '../CommitmentTable';

describe('CommitmentTable', () => {
  const mockCommitments = [
    { assetClass: 'Private Equity', amount: 500000, currency: 'GBP' },
    { assetClass: 'Natural Resources', amount: 300000, currency: 'GBP' },
  ];

  it('renders table headers correctly', () => {
    render(<CommitmentTable commitments={mockCommitments} totalCommitment={800000} />);

    expect(screen.getByText('Asset Class')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Currency')).toBeInTheDocument();
    expect(screen.getByText('% of Total')).toBeInTheDocument();
  });

  it('renders commitment data correctly', () => {
    render(<CommitmentTable commitments={mockCommitments} totalCommitment={800000} />);

    expect(screen.getByText('Private Equity')).toBeInTheDocument();
    expect(screen.getByText('£0.5M')).toBeInTheDocument();
    expect(screen.getAllByText('GBP')[0]).toBeInTheDocument();
    expect(screen.getByText('62.5%')).toBeInTheDocument();
  });

  it('handles empty commitments array', () => {
    render(<CommitmentTable commitments={[]} totalCommitment={0} />);

    expect(screen.queryByRole('cell')).not.toBeInTheDocument();
  });

  it('calculates percentages correctly', () => {
    render(<CommitmentTable commitments={mockCommitments} totalCommitment={1000000} />);

    expect(screen.getByText('50.0%')).toBeInTheDocument();
    expect(screen.getByText('30.0%')).toBeInTheDocument();
  });
});
