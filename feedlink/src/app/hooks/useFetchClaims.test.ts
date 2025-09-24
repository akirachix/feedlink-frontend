
import { renderHook, waitFor } from '@testing-library/react';
import { useWasteClaims } from './useFetchClaims';
import * as fetchModule from '../utils/fetchclaims'; 

jest.mock('../utils/fetchclaims', () => ({
  fetchWasteClaims: jest.fn(),
}));

describe('useWasteClaims hook', () => {
  const mockWasteClaims = [
    {
      waste_id: 1,
      listing_id: 1,
      user: 1,
      claim_status: 'approved',
      pin: '1234',
      created_at: '2025-09-01T15:00:00Z',
      updated_at: '2025-09-01T15:30:00Z',
      claim_time: '2025-09-01T15:05:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and return waste claims data successfully', async () => {
    (fetchModule.fetchWasteClaims as jest.Mock).mockResolvedValueOnce(mockWasteClaims);

    const { result } = renderHook(() => useWasteClaims());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.wasteClaims).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchModule.fetchWasteClaims).toHaveBeenCalledTimes(1);
    expect(result.current.wasteClaims).toEqual(mockWasteClaims);
    expect(result.current.error).toBeUndefined();
  });

  it('should handle error during fetching waste claims', async () => {
    const errorMessage = 'Network error';
    (fetchModule.fetchWasteClaims as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useWasteClaims());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.wasteClaims).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
  });
});