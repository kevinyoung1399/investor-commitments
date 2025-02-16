/**
 * Core type definitions for the investor commitment tracking system.
 */
export interface Investor {
  id: number;
  name: string;
  totalCommitment: number;
}

export interface Commitment {
  assetClass: string;
  amount: number;
  currency: string;
}

export interface InvestorCommitmentDetails {
  investor: string;
  totalCommitment: number;
  commitments: Commitment[];
}
