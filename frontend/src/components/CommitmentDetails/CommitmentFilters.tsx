/**
 * Component for filtering commitments by asset class.
 * Renders a list of toggle buttons for each available asset class.
 */
import React from 'react';

interface CommitmentFiltersProps {
  assetClasses: string[];
  selectedAssetClass: string;
  onSelectAssetClass: (assetClass: string) => void;
}

export const CommitmentFilters: React.FC<CommitmentFiltersProps> = ({
  assetClasses,
  selectedAssetClass,
  onSelectAssetClass,
}) => (
  <div className="mb-6 flex gap-2">
    {assetClasses.map((assetClass) => (
      <button
        key={assetClass}
        onClick={() => onSelectAssetClass(assetClass)}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          selectedAssetClass === assetClass
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        aria-pressed={selectedAssetClass === assetClass}
      >
        {assetClass}
      </button>
    ))}
  </div>
);
