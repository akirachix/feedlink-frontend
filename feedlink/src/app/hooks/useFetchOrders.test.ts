import { renderHook, act, waitFor } from '@testing-library/react';
import { fetchOrders, updateOrderStatus as apiUpdateOrderStatus } from '../utils/fetchorders';
import { useOrders } from './useFetchOrders';

jest.mock('../utils/fetchorders', () => ({
  fetchOrders: jest.fn(),
  updateOrderStatus: jest.fn(),
}));

const mockFetchOrders = fetchOrders as jest.MockedFunction<typeof fetchOrders>;
const mockUpdateOrderStatus = apiUpdateOrderStatus as jest.MockedFunction<typeof apiUpdateOrderStatus>;

const mockOrders = [
  {
    order_id: 1,
    user: 101,
    order_date: '2024-06-01',
    total_amount: '150.00',
    created_at: '2024-06-01T10:00:00Z',
    updated_at: '2024-06-01T10:00:00Z',
    order_status: 'pending',
    items: [
      { id: 1, quantity: 1, price: '150.00', listing: 501 },
    ],
  },
  {
    order_id: 2,
    user: 102,
    order_date: '2024-06-02',
    total_amount: '80.50',
    created_at: '2024-06-02T11:30:00Z',
    updated_at: '2024-06-02T11:30:00Z',
    order_status: 'completed',
    items: [
      { id: 2, quantity: 2, price: '40.25', listing: 502 },
    ],
  },
];

describe('useOrders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load orders successfully', async () => {
    mockFetchOrders.mockResolvedValueOnce(mockOrders);

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
    mockFetchOrders.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useOrders());

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.orders).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should update order status successfully', async () => {
    mockFetchOrders.mockResolvedValueOnce(mockOrders);
    mockUpdateOrderStatus.mockResolvedValueOnce({ ...mockOrders[0], order_status: 'picked', updated_at: '2024-06-03T09:00:00Z' });

    const { result } = renderHook(() => useOrders());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.updateOrderStatus(1, 'picked');
    });

    expect(mockUpdateOrderStatus).toHaveBeenCalledWith(1, 'picked');
    expect(result.current.orders.find(o => o.order_id === 1)?.order_status).toBe('picked');
    expect(result.current.error).toBeUndefined();
  });

  it('should handle error when updating order status fails', async () => {
    mockFetchOrders.mockResolvedValueOnce(mockOrders);
    mockUpdateOrderStatus.mockRejectedValueOnce(new Error('failed to update status'));

    const { result } = renderHook(() => useOrders());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await expect(result.current.updateOrderStatus(1, 'picked')).rejects.toThrow('failed to update status');

    await waitFor(() => {
      expect(result.current.error).toBe('failed to update status');
    });
  });
});