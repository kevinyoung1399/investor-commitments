import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchInvestors, fetchInvestorCommitments } from '../investors';
import { environment } from '../../environment';

// Mock the environment module
vi.mock('../../environment', () => ({
  environment: {
    apiUrl: 'http://mock-api',
  },
}));

// Test utilities
const createMockResponse = (data: any, options: ResponseInit = {}) => {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: new Headers(),
    ...options,
  });
};

describe('Investor API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  describe('fetchInvestors', () => {
    const mockInvestors = [
      { id: 1, name: 'Investor 1', totalCommitment: 1000000 },
      { id: 2, name: 'Investor 2', totalCommitment: 2000000 },
    ];

    it('fetches investors successfully', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(createMockResponse(mockInvestors));

      const result = await fetchInvestors();
      expect(result).toEqual(mockInvestors);
      expect(fetch).toHaveBeenCalledWith(`${environment.apiUrl}/investors`);
    });

    it('handles empty investor list', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(createMockResponse([]));

      const result = await fetchInvestors();
      expect(result).toEqual([]);
    });

    it('throws error on network failure', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchInvestors()).rejects.toThrow('Network error');
    });

    it('throws error on server error (500)', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        createMockResponse({ error: 'Server error' }, { status: 500 })
      );

      await expect(fetchInvestors()).rejects.toThrow('Failed to fetch investors');
    });

    it('throws error on not found (404)', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(createMockResponse(null, { status: 404 }));

      await expect(fetchInvestors()).rejects.toThrow('Failed to fetch investors');
    });

    it('throws error on malformed JSON', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(new Response('invalid json', { status: 200 }));

      await expect(fetchInvestors()).rejects.toThrow();
    });
  });

  describe('fetchInvestorCommitments', () => {
    const mockCommitments = {
      investor: 'Test Investor',
      totalCommitment: 1000000,
      commitments: [
        { assetClass: 'Private Equity', amount: 500000, currency: 'GBP' },
        { assetClass: 'Natural Resources', amount: 500000, currency: 'GBP' },
      ],
    };

    it('fetches investor commitments successfully', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(createMockResponse(mockCommitments));

      const result = await fetchInvestorCommitments(1);
      expect(result).toEqual(mockCommitments);
      expect(fetch).toHaveBeenCalledWith(`${environment.apiUrl}/investors/1/commitments`);
    });

    it('handles empty commitments array', async () => {
      const emptyCommitments = {
        investor: 'Test Investor',
        totalCommitment: 0,
        commitments: [],
      };
      vi.mocked(fetch).mockResolvedValueOnce(createMockResponse(emptyCommitments));

      const result = await fetchInvestorCommitments(1);
      expect(result).toEqual(emptyCommitments);
    });

    it('throws error on network failure', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchInvestorCommitments(1)).rejects.toThrow('Network error');
    });

    it('throws error on server error (500)', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        createMockResponse({ error: 'Server error' }, { status: 500 })
      );

      await expect(fetchInvestorCommitments(1)).rejects.toThrow(
        'Failed to fetch commitments for investor 1'
      );
    });

    it('throws error when response format is invalid', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(createMockResponse({ invalid: 'data' }));

      await expect(fetchInvestorCommitments(1)).rejects.toThrow(
        'Invalid response format from commitments endpoint'
      );
    });

    it('throws error when commitments field is not an array', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        createMockResponse({
          investor: 'Test Investor',
          totalCommitment: 1000000,
          commitments: 'not an array',
        })
      );

      await expect(fetchInvestorCommitments(1)).rejects.toThrow(
        'Invalid response format from commitments endpoint'
      );
    });
  });
});
