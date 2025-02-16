/**
 * Sidebar component displaying a list of investors.
 * Handles investor selection and loading states.
 */
import React from 'react';
import { InvestorCard } from './InvestorCard';
import { Investor } from '../../api/types';

interface InvestorListProps {
  investors: Investor[];
  selectedInvestorId: number | null;
  onSelectInvestor: (id: number) => void;
  isLoading: boolean;
}

export const InvestorList: React.FC<InvestorListProps> = ({
  investors,
  selectedInvestorId,
  onSelectInvestor,
  isLoading,
}) => (
  <div className="w-80 border-r bg-white p-6">
    <h2 className="mb-4 text-xl font-semibold text-gray-700">Investors</h2>
    {isLoading ? (
      <div className="flex items-center justify-center">
        <div
          data-testid="loading-spinner"
          className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
        />
      </div>
    ) : (
      <div className="space-y-3">
        {investors.map((investor) => (
          <InvestorCard
            key={investor.id}
            investor={investor}
            isSelected={selectedInvestorId === investor.id}
            onClick={() => onSelectInvestor(investor.id)}
          />
        ))}
      </div>
    )}
  </div>
);
