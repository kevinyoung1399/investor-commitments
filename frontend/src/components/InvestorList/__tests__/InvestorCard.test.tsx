import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InvestorCard } from '../InvestorCard';

describe('InvestorCard', () => {
  const mockInvestor = {
    id: 1,
    name: 'Test Investor',
    totalCommitment: 1000000,
  };

  it('renders investor information correctly', () => {
    render(<InvestorCard investor={mockInvestor} isSelected={false} onClick={() => {}} />);

    expect(screen.getByText('Test Investor')).toBeInTheDocument();
    expect(screen.getByText('Total Commitment: £1.0M')).toBeInTheDocument();
  });

  it('formats total commitment correctly', () => {
    const bigInvestor = {
      ...mockInvestor,
      totalCommitment: 1234567890,
    };

    render(<InvestorCard investor={bigInvestor} isSelected={false} onClick={() => {}} />);

    expect(screen.getByText('Total Commitment: £1234.6M')).toBeInTheDocument();
  });

  it('applies correct styles when selected', () => {
    render(<InvestorCard investor={mockInvestor} isSelected={true} onClick={() => {}} />);

    const card = screen.getByRole('button');
    expect(card).toHaveClass('border-blue-500');
    expect(card).toHaveClass('bg-blue-50');
  });

  it('applies correct styles when not selected', () => {
    render(<InvestorCard investor={mockInvestor} isSelected={false} onClick={() => {}} />);

    const card = screen.getByRole('button');
    expect(card).toHaveClass('border-gray-200');
    expect(card).not.toHaveClass('bg-blue-50');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<InvestorCard investor={mockInvestor} isSelected={false} onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
