/**
 * Card component displaying basic investor information.
 * Shows investor name and total commitment amount.
 */
import React from 'react';
import { Investor } from '../../api/types';

interface InvestorCardProps {
  investor: Investor;
  isSelected: boolean;
  onClick: () => void;
}

export const InvestorCard: React.FC<InvestorCardProps> = ({ investor, isSelected, onClick }) => (
  <div
    className={`cursor-pointer rounded-lg border p-4 transition-colors ${
      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'
    }`}
    onClick={onClick}
    role="button"
    aria-pressed={isSelected}
  >
    <h3 className="font-medium text-gray-900">{investor.name}</h3>
    <p className="text-sm text-gray-500">
      Total Commitment: £{(investor.totalCommitment / 1000000).toFixed(1)}M
    </p>
  </div>
);
