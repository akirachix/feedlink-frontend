import { addListing } from './fetchAddListings';

const baseUrl = '/api/listings/';

global.fetch = jest.fn();

describe('addListing', () => {
  const mockFormData = new FormData();
  mockFormData.append('title', 'Test Item');
  mockFormData.append('price', '100');

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should successfully add a listing and return success message', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '123', title: 'Test Item' }),
    });

    const result = await addListing(mockFormData);

    expect(global.fetch).toHaveBeenCalledWith(baseUrl, {
      method: 'POST',
      body: mockFormData,
    });
    expect(result).toBe('Product added successfully!');
  });

  it('should throw an error when response is not ok and detail is provided', async () => {
    const mockErrorDetail = 'Title is required';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: mockErrorDetail }),
    });

    await expect(addListing(mockFormData)).rejects.toThrow(mockErrorDetail);
    expect(global.fetch).toHaveBeenCalledWith(baseUrl, {
      method: 'POST',
      body: mockFormData,
    });
  });

  it('should throw a generic error when response is not ok and no detail is provided', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    await expect(addListing(mockFormData)).rejects.toThrow(
      'Failed to add item. Please try again.'
    );
  });

  it('should handle network-level fetch errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(addListing(mockFormData)).rejects.toThrow('Network error');
  });
});