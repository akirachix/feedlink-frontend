import { fetchOrders } from "./fetchorders";



describe('fetchOrders', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('resolves with data when fetch succeeds', async () => {
    const mockData = [
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

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response)
    );

    const data = await fetchOrders();
    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/api/orders/');
  });

  test('throws error when response is not ok', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Internal Server Error',
      } as Response)
    );

    await expect(fetchOrders()).rejects.toThrow(
      'Something went wrong: Internal Server Error'
    );
  });

  test('throws error on network failure', async () => {
    const errorMessage = 'Network error';
    global.fetch = jest.fn(() => Promise.reject(new Error(errorMessage)));

    await expect(fetchOrders()).rejects.toThrow(
      'Failed to fetch waste claims: ' + errorMessage
    );
  });
});
