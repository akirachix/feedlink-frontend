import { fetchListings } from "./fetchListing";

describe('fetchListings', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('resolves with data when fetch succeeds', async () => {
    const mockData = [
      {
        listing_id: 1,
        title: 'Listing 1',
        quantity: '20',
        unit: 'kg',
      },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response)
    );

    const data = await fetchListings();

    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/api/listings/');
  });

  it('throws error when response is not ok', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Internal Server Error',
      } as Response)
    );

    await expect(fetchListings()).rejects.toThrow(
      'Something went wrong: Internal Server Error'
    );
  });

  it('throws error when fetch rejects', async () => {
    const errorMessage = 'Network error';
    global.fetch = jest.fn(() => Promise.reject(new Error(errorMessage)));

    await expect(fetchListings()).rejects.toThrow(
      'Failed to fetch waste claims: ' + errorMessage
    );
  });
});
