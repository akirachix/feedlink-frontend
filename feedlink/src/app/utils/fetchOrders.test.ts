import { fetchOrders } from "./fetchOrders";

global.fetch = jest.fn();

describe('fetchOrders (without modifying source)', () => {
  const baseUrl = '/api/orders/';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and return orders successfully', async () => {
    const mockOrders = [{ id: 101, total: 99.99 }];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockOrders),
    });

    const result = await fetchOrders();

    expect(global.fetch).toHaveBeenCalledWith(baseUrl);
    expect(result).toEqual(mockOrders);
  });

  it('should throw an error with a message when the response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Forbidden',
    });

    await expect(fetchOrders()).rejects.toThrow('Something went wrongForbidden');
  });

  it('should throw a network error with a message when fetching fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    await expect(fetchOrders()).rejects.toThrow('Failed to fetch orders:Network Error');
  });
});