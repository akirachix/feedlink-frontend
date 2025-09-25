import { renderHook, waitFor } from '@testing-library/react';
import { useOrders } from './useFetchOrders';
import * as fetchModule from '../utils/fetchorders';

jest.mock('../utils/fetchorders', () => ({
  fetchOrders: jest.fn(),
}));

describe('useOrders hook', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('fetches and returns orders successfully', async () => {
    const mockOrders = [
      {
        order_id: 1,
        items: [
          { quantity: 5, price: "10", listing: 101 },
          { quantity: 10, price: "15", listing: 102 },
        ],
        user: 1,
        order_date: "2025-09-01",
        total_amount: "250",
        created_at: "2025-09-01T12:00:00Z",
      },
    ];

    jest.spyOn(fetchModule, 'fetchOrders').mockResolvedValueOnce(mockOrders);

    const { result } = renderHook(() => useOrders());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeUndefined();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchModule.fetchOrders).toHaveBeenCalledTimes(1);
    expect(result.current.orders).toEqual(mockOrders);
    expect(result.current.error).toBeUndefined();
  });

  test('handles error when fetching orders', async () => {
    const errorMessage = 'Network error';
    jest.spyOn(fetchModule, 'fetchOrders').mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useOrders());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchModule.fetchOrders).toHaveBeenCalledTimes(1);
    expect(result.current.orders).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
  });
});
