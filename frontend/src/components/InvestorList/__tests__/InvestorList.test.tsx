import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InvestorList } from '../InvestorList';

describe('InvestorList', () => {
  const mockInvestors = [
    { id: 1, name: 'Investor One', totalCommitment: 1000000 },
    { id: 2, name: 'Investor Two', totalCommitment: 2000000 },
    { id: 3, name: 'Investor Three', totalCommitment: 3000000 },
  ];

  it('renders loading state when isLoading is true', () => {
    render(
      <InvestorList
        investors={[]}
        selectedInvestorId={null}
        onSelectInvestor={() => {}}
        isLoading={true}
      />
    );

    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
  });

  it('renders all investors when not loading', () => {
    render(
      <InvestorList
        investors={mockInvestors}
        selectedInvestorId={null}
        onSelectInvestor={() => {}}
        isLoading={false}
      />
    );

    expect(screen.getByText('Investors')).toBeInTheDocument();
    expect(screen.getByText('Investor One')).toBeInTheDocument();
    expect(screen.getByText('Investor Two')).toBeInTheDocument();
    expect(screen.getByText('Investor Three')).toBeInTheDocument();
  });

  it('renders empty list when investors array is empty', () => {
    render(
      <InvestorList
        investors={[]}
        selectedInvestorId={null}
        onSelectInvestor={() => {}}
        isLoading={false}
      />
    );

    expect(screen.getByText('Investors')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('passes correct props to InvestorCard components', () => {
    const mockOnSelectInvestor = vi.fn();
    const selectedId = 2;

    render(
      <InvestorList
        investors={mockInvestors}
        selectedInvestorId={selectedId}
        onSelectInvestor={mockOnSelectInvestor}
        isLoading={false}
      />
    );

    const selectedCard = screen.getByText('Investor Two').closest('[role="button"]');
    const nonSelectedCard = screen.getByText('Investor One').closest('[role="button"]');

    expect(selectedCard).toHaveClass('border-blue-500');
    expect(nonSelectedCard).toHaveClass('border-gray-200');
  });

  it('preserves order of investors as provided', () => {
    render(
      <InvestorList
        investors={mockInvestors}
        selectedInvestorId={null}
        onSelectInvestor={() => {}}
        isLoading={false}
      />
    );

    const investorElements = screen.getAllByRole('button');
    expect(investorElements[0]).toHaveTextContent('Investor One');
    expect(investorElements[1]).toHaveTextContent('Investor Two');
    expect(investorElements[2]).toHaveTextContent('Investor Three');
  });

  it('displays correct heading text', () => {
    render(
      <InvestorList
        investors={mockInvestors}
        selectedInvestorId={null}
        onSelectInvestor={() => {}}
        isLoading={false}
      />
    );

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Investors');
    expect(heading).toHaveClass('text-xl', 'font-semibold', 'text-gray-700');
  });

  it('renders with correct container styles', () => {
    const { container } = render(
      <InvestorList
        investors={mockInvestors}
        selectedInvestorId={null}
        onSelectInvestor={() => {}}
        isLoading={false}
      />
    );

    const sidebar = container.firstChild;
    expect(sidebar).toHaveClass('w-80', 'border-r', 'bg-white', 'p-6');
  });
});
