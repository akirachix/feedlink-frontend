import { fetchWasteClaims } from "./fetchclaims";

describe('fetchWasteClaims', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns data when fetch is successful', async () => {
    const mockData = [
      {
        waste_id: 1,
        listing_id: 1,
        user: 1,
        claim_status: 'approved',
        pin: '1234',
        created_at: '2025-09-01T15:00:00Z',
        updated_at: '2025-09-01T15:30:00Z',
        claim_time: '2025-09-01T15:05:00Z',
      },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response)
    );

    const data = await fetchWasteClaims();
    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/api/wasteclaims/');
  });

  it('throws error when response is not ok', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Internal Server Error',
      } as Response)
    );

    await expect(fetchWasteClaims()).rejects.toThrow(
      'Something went wrong: Internal Server Error'
    );
  });

  it('throws error when fetch fails', async () => {
    const errorMessage = 'Network error';
    global.fetch = jest.fn(() => Promise.reject(new Error(errorMessage)));

    await expect(fetchWasteClaims()).rejects.toThrow(
      'Failed to fetch waste claims: ' + errorMessage
    );
  });
});
