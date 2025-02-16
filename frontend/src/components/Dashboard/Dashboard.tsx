/**
 * Main dashboard component that manages investor selection and displays commitment details.
 * Handles data fetching, filtering, and error states.
 */
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { InvestorList } from '../InvestorList/InvestorList';
import { CommitmentFilters } from '../CommitmentDetails/CommitmentFilters';
import { CommitmentTable } from '../CommitmentDetails/CommitmentTable';
import { fetchInvestors, fetchInvestorCommitments } from '../../api/investors';
import { Investor, InvestorCommitmentDetails } from '../../api/types';

export const Dashboard: React.FC = () => {
  const [selectedInvestor, setSelectedInvestor] = useState<number | null>(null);
  const [selectedAssetClass, setSelectedAssetClass] = useState('All');

  const {
    data: investors = [],
    isLoading: isLoadingInvestors,
    error: investorsError,
  } = useQuery<Investor[]>({
    queryKey: ['investors'],
    queryFn: fetchInvestors,
  });

  const {
    data: investorCommitments,
    isLoading: isLoadingCommitments,
    error: commitmentsError,
  } = useQuery<InvestorCommitmentDetails>({
    queryKey: ['commitments', selectedInvestor],
    queryFn: () => fetchInvestorCommitments(selectedInvestor!),
    enabled: !!selectedInvestor,
  });

  const filteredCommitments = React.useMemo(
    () =>
      selectedInvestor && investorCommitments
        ? investorCommitments.commitments.filter(
            (c) => selectedAssetClass === 'All' || c.assetClass === selectedAssetClass
          )
        : [],
    [selectedInvestor, investorCommitments, selectedAssetClass]
  );

  const assetClasses = React.useMemo(
    () => ['All', ...new Set(investorCommitments?.commitments.map((c) => c.assetClass) || [])],
    [investorCommitments]
  );

  const currentInvestor = investors.find((i) => i.id === selectedInvestor);

  if (investorsError) {
    return (
      <div className="p-4 text-red-600">Failed to load investors. Please try again later.</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <InvestorList
          investors={investors}
          selectedInvestorId={selectedInvestor}
          onSelectInvestor={setSelectedInvestor}
          isLoading={isLoadingInvestors}
        />

        <div className="flex-1 overflow-hidden">
          <div className="h-full p-8">
            {selectedInvestor && currentInvestor ? (
              <div className="h-full space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentInvestor.name} Commitments
                </h1>

                <CommitmentFilters
                  assetClasses={assetClasses}
                  selectedAssetClass={selectedAssetClass}
                  onSelectAssetClass={setSelectedAssetClass}
                />

                {isLoadingCommitments ? (
                  <div className="flex h-64 items-center justify-center">
                    <div
                      data-testid="loading-spinner"
                      className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
                    />
                  </div>
                ) : commitmentsError ? (
                  <div className="text-red-600">
                    Failed to load commitments. Please try again later.
                  </div>
                ) : (
                  <CommitmentTable
                    commitments={filteredCommitments}
                    totalCommitment={investorCommitments?.totalCommitment || 0}
                  />
                )}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">Select an investor to view commitment details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
