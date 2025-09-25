import { fetchSignup } from "./fetchSignupUsers"; 

global.fetch = jest.fn();

describe('fetchSignup', () => {
  const userData = {
    email: 'user@example.com',
    password: 'password123',
    first_name: 'John',
    last_name: 'Doe',
  };

  const mockResponse = {
    user_id: 1,
    email: 'user@example.com',
    first_name: 'John',
    last_name: 'Doe',
    message: 'User created successfully',
  };

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should successfully sign up and return user data', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await fetchSignup(userData);

    expect(fetch).toHaveBeenCalledWith('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error when response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Bad Request',
    } as Response);

    await expect(fetchSignup(userData)).rejects.toThrow(
      'Signup failed: Bad Request'
    );
  });

  it('should throw an error when fetch fails (e.g., network error)', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    await expect(fetchSignup(userData)).rejects.toThrow(
      'Failed to signup: Network error'
    );
  });
});