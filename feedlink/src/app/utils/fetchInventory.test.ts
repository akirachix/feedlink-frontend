
import { fetchListings } from './fetchInventory';

global.fetch = jest.fn();

describe('fetchListings', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should fetch and return listings successfully', async () => {
    const mockData = [
      { id: '1', title: 'Diary', price: 500 },
      { id: '2', title: 'Fruit', price: 300 },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      statusText: 'OK',
      json: async () => mockData,
    });

    const result = await fetchListings();

    expect(global.fetch).toHaveBeenCalledWith('/api/listings/');
    expect(result).toEqual(mockData);
  });

  it('should throw a custom error when response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
      json: async () => ({}),
    });

    await expect(fetchListings()).rejects.toThrow(
      'Failed to fetch listings: Something went wrong: Not Found'
    );
  });

  it('should handle network-level fetch errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new TypeError('Network error'));

    await expect(fetchListings()).rejects.toThrow(
      'Failed to fetch listings: Network error'
    );
  });
});