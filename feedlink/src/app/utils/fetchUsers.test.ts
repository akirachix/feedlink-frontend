import { fetchUsers } from "./fetchUsers";

global.fetch = jest.fn();

describe('fetchUsers (without modifying source)', () => {
  const baseUrl = '/api/users/';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and return users successfully', async () => {
    const mockUsers = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockUsers),
    });

    const result = await fetchUsers();

    expect(global.fetch).toHaveBeenCalledWith(baseUrl);
    expect(result).toEqual(mockUsers);
  });

  it('should throw an error with a message when the response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Unauthorized',
    });

    await expect(fetchUsers()).rejects.toThrow('Something went wrongUnauthorized');
  });

  it('should throw a network error with a message when fetching fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    await expect(fetchUsers()).rejects.toThrow('Failed to fetch users:Network Error');
  });
});