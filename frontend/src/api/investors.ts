/**
 * API functions for fetching investor and commitment data.
 */
import { environment } from '../environment';
import { Investor, InvestorCommitmentDetails } from './types';

/**
 * Fetches the list of all investors from the API.
 * @returns Promise resolving to an array of Investor objects
 * @throws Error if the API request fails
 */
export const fetchInvestors = async (): Promise<Investor[]> => {
  const response = await fetch(`${environment.apiUrl}/investors`);
  if (!response.ok) {
    throw new Error('Failed to fetch investors');
  }
  return response.json();
};

/**
 * Fetches detailed commitment information for a specific investor.
 * @param investorId - The unique identifier of the investor
 * @returns Promise resolving to InvestorCommitmentDetails
 * @throws Error if the API request fails
 */
export const fetchInvestorCommitments = async (
  investorId: number
): Promise<InvestorCommitmentDetails> => {
  const response = await fetch(`${environment.apiUrl}/investors/${investorId}/commitments`);
  if (!response.ok) {
    throw new Error(`Failed to fetch commitments for investor ${investorId}`);
  }
  const data = await response.json();

  if (!data || !Array.isArray(data.commitments)) {
    throw new Error('Invalid response format from commitments endpoint');
  }

  return data;
};
