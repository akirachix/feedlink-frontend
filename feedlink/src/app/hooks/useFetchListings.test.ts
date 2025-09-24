import { renderHook, waitFor } from '@testing-library/react';
import { useListings } from './useFetchListings';
import * as fetchModule from '../utils/fetchListing'; 
jest.mock('../utils/fetchListing', () => ({
  fetchListings: jest.fn(),
}));

describe('useListings hook', () => {
  const mockListings = [
    {
      listing_id: 1,
      title: 'Bread',
      quantity: '50',
      created_at: '2025-09-01',
     
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and return listings data successfully', async () => {
    (fetchModule.fetchListings as jest.Mock).mockResolvedValueOnce(mockListings);

    const { result } = renderHook(() => useListings());
    expect(result.current.loading).toBe(true);
    expect(result.current.listings).toEqual([]);
    expect(result.current.error).toBeUndefined();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

  
    expect(fetchModule.fetchListings).toHaveBeenCalledTimes(1);
    expect(result.current.listings).toEqual(mockListings);
    expect(result.current.error).toBeUndefined();
  });

  it('should handle error during fetching listings', async () => {
    const errorMessage = 'Network error';
    (fetchModule.fetchListings as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useListings());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.listings).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
  });
});