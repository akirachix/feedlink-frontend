import { fetchSignin } from './fetchSigninUsers'; 

global.fetch = jest.fn();

describe('fetchSignin', () => {
  const email = 'user@example.com';
  const password = 'password123';
  const mockResponse = {
    token: 'abc123',
    user_id: 1,
    email: 'user@example.com',
    first_name: 'John',
    last_name: 'Doe',
  };

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should successfully login and return user data', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await fetchSignin(email, password);

    expect(fetch).toHaveBeenCalledWith('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error when response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Unauthorized',
    } as Response);

    await expect(fetchSignin(email, password)).rejects.toThrow(
      'Login failed: Unauthorized'
    );
  });

  it('should throw an error when fetch fails (network error)', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    await expect(fetchSignin(email, password)).rejects.toThrow(
      'Failed to login: Network error'
    );
  });
});