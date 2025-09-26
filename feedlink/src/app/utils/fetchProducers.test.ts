
import { fetchProducers } from './fetchProducers';


global.fetch = jest.fn();

describe('fetchProducers', () => {
  const baseUrl = '/api/users/';

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should fetch users and return only those with role "producer"', async () => {
    const mockUsers = [
      { id: '1', name: 'Abel', role: 'producer' },
      { id: '2', name: 'John', role: 'consumer' },
      { id: '3', name: 'Caleb', role: 'producer' },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      statusText: 'OK',
      json: async () => mockUsers,
    });

    const result = await fetchProducers();

    expect(global.fetch).toHaveBeenCalledWith(baseUrl);
    expect(result).toEqual([
      { id: '1', name: 'Abel', role: 'producer' },
      { id: '3', name: 'Caleb', role: 'producer' },
    ]);
  });

  it('should return an empty array if no producers are found', async () => {
    const mockUsers = [
      { id: '1', name: 'Abel', role: 'admin' },
      { id: '2', name: 'John', role: 'consumer' },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    const result = await fetchProducers();

    expect(result).toEqual([]);
  });

  it('should throw a custom error when response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error',
      json: async () => ({}),
    });

    await expect(fetchProducers()).rejects.toThrow(
      'Failed to fetch producers: Something went wrong: Internal Server Error'
    );
  });

  it('should handle network-level fetch errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new TypeError('Network error'));

    await expect(fetchProducers()).rejects.toThrow(
      'Failed to fetch producers: Network error'
    );
  });
});