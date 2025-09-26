import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import * as fetchInventory from '../utils/fetchInventory';
import useInventory from './useFetchInventory';

interface Seller {
  id: string;
  name: string;
}

interface Listing {
  id: string;
  title: string;
  price: number;
  seller: Seller;
  createdAt: string; 
}

jest.mock('../utils/fetchInventory', () => ({
  fetchListings: jest.fn(),
}));

describe('useInventory', () => {
  const initialListings: Listing[] = [
    {
      id: '1',
      title: 'Laptop',
      price: 500,
      seller: { id: 'user1', name: 'Alice' },
      createdAt: '2024-01-01T00:00:00Z',
    },
  ];

  const refreshedListings: Listing[] = [
    {
      id: '3',
      title: 'Tablet',
      price: 200,
      seller: { id: 'user3', name: 'Charlie' },
      createdAt: '2024-01-03T00:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading true and fetch listings on mount', async () => {
    (fetchInventory.fetchListings as jest.Mock).mockResolvedValueOnce(initialListings);

    const { result } = renderHook(() => useInventory());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.listings).toEqual(initialListings);
    expect(fetchInventory.fetchListings).toHaveBeenCalledTimes(1);
  });

  it('should set error when fetch fails', async () => {
    const errorMessage = 'Network error';
    (fetchInventory.fetchListings as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useInventory());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.listings).toEqual([]);
  });

  it('should allow manual refresh', async () => {
    const mockFn = fetchInventory.fetchListings as jest.Mock;
    mockFn
      .mockResolvedValueOnce(initialListings)
      .mockResolvedValueOnce(refreshedListings);

    const { result } = renderHook(() => useInventory());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.listings).toEqual(initialListings);

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.listings).toEqual(refreshedListings);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});