
import { fetchListings } from "./fetchListing";

global.fetch = jest.fn();

describe('fetchListings', () => {
  const baseUrl = '/api/listings/';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and return listings successfully', async () => {
    const mockListings = [{ id: 1, title: 'Nice listing' }];
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockListings),
    });

    const result = await fetchListings();

    expect(global.fetch).toHaveBeenCalledWith(baseUrl);
    expect(result).toEqual(mockListings);
  });

  it('should throw an error when response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    });

    await expect(fetchListings()).rejects.toThrow('Something went wrong: Not Found');
  });

  it('should throw a network error when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    await expect(fetchListings()).rejects.toThrow('Failed to fetch listings: Network Error');
  });
});