import { renderHook, waitFor } from '@testing-library/react';
import { fetchOrders } from '../utils/fetchorders';
import { Order } from '../utils/types';
import { useOrders } from '../hooks/useFetchOrders';

jest.mock('../utils/fetchorders', () => ({
  fetchOrders: jest.fn(),
}));

const mockFetchOrders = fetchOrders as jest.MockedFunction<typeof fetchOrders>;


interface Item {
  id: number;
  name: string;
  quantity: number;
  price: string;
}

describe('useOrders', () => {
  const mockOrders: Order[] = [
    {
      order_id: 1,
      user: 101,
      order_date: '2024-06-01',
      total_amount: '150.00',
      created_at: '2024-06-01T10:00:00Z',
      order_status: 'pending',
      items: [
        { id: 1, quantity: 1, price: '150.00', listing: 501 }
        ,
      ],
    },
    {
      order_id: 2,
      user: 102,
      order_date: '2024-06-02',
      total_amount: '80.50',
      created_at: '2024-06-02T11:30:00Z',
      order_status: 'completed',
      items: [
        { id: 1, quantity: 1, price: '150.00', listing: 501 }
        ,
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load orders successfully', async () => {
    mockFetchOrders.mockResolvedValue(mockOrders);

    const { result } = renderHook(() => useOrders());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.orders).toEqual([]);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.orders).toEqual(mockOrders);
    expect(result.current.error).toBeUndefined();
  });

  it('should handle error when fetching orders fails', async () => {
    const errorMessage = 'Failed to fetch orders';
    mockFetchOrders.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useOrders());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.orders).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
  });
});