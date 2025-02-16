import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CommitmentFilters } from '../CommitmentFilters';

describe('CommitmentFilters', () => {
  const mockAssetClasses = ['All', 'Private Equity', 'Natural Resources'];
  const mockOnSelectAssetClass = vi.fn();

  beforeEach(() => {
    mockOnSelectAssetClass.mockClear();
  });

  it('renders all asset class buttons', () => {
    render(
      <CommitmentFilters
        assetClasses={mockAssetClasses}
        selectedAssetClass="All"
        onSelectAssetClass={mockOnSelectAssetClass}
      />
    );

    mockAssetClasses.forEach((assetClass) => {
      expect(screen.getByText(assetClass)).toBeInTheDocument();
    });
  });

  it('applies correct styles to selected asset class', () => {
    render(
      <CommitmentFilters
        assetClasses={mockAssetClasses}
        selectedAssetClass="Private Equity"
        onSelectAssetClass={mockOnSelectAssetClass}
      />
    );

    const selectedButton = screen.getByText('Private Equity');
    const unselectedButton = screen.getByText('Natural Resources');

    expect(selectedButton).toHaveClass('bg-blue-500');
    expect(selectedButton).toHaveClass('text-white');
    expect(unselectedButton).toHaveClass('bg-gray-100');
    expect(unselectedButton).toHaveClass('text-gray-700');
  });

  it('calls onSelectAssetClass with correct asset class when clicked', () => {
    render(
      <CommitmentFilters
        assetClasses={mockAssetClasses}
        selectedAssetClass="All"
        onSelectAssetClass={mockOnSelectAssetClass}
      />
    );

    fireEvent.click(screen.getByText('Private Equity'));
    expect(mockOnSelectAssetClass).toHaveBeenCalledWith('Private Equity');
  });
});
