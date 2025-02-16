/**
 * Table component displaying commitment details including asset class,
 * amount, currency, and percentage of total commitment.
 */
import React from 'react';
import { Commitment } from '../../api/types';

interface CommitmentTableProps {
  commitments: Commitment[];
  totalCommitment: number;
}

export const CommitmentTable: React.FC<CommitmentTableProps> = ({
  commitments,
  totalCommitment,
}) => (
  <div className="h-full overflow-auto rounded-lg border bg-white">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="sticky top-0 bg-gray-50">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
          >
            Asset Class
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
          >
            Amount
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
          >
            Currency
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
          >
            % of Total
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {commitments.map((commitment, index) => {
          const percentageOfTotal = ((commitment.amount / totalCommitment) * 100).toFixed(1);

          return (
            <tr key={`${commitment.assetClass}-${index}`}>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="text-sm text-gray-500">{commitment.assetClass}</div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="text-sm text-gray-900">
                  £{(commitment.amount / 1000000).toFixed(1)}M
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="text-sm text-gray-900">{commitment.currency}</div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="text-sm text-gray-900">{percentageOfTotal}%</div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
