import { uploadCsvFile } from './fetchCsvUpload';

const baseUrl = '/api/listings/upload-csv/'; 

global.fetch = jest.fn();

describe('uploadCsvFile', () => {
  const mockFile = new File(['csv content'], 'test.csv', { type: 'text/csv' });

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should successfully upload a CSV file', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const result = await uploadCsvFile(mockFile);

    
    expect(global.fetch).toHaveBeenCalledWith(baseUrl, {
      method: 'POST',
      body: expect.any(FormData),
    });
    expect(result).toBe('CSV file uploaded successfully!');
  });

  it('should throw an error when response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ detail: 'Bad Request' }),
    });

    await expect(uploadCsvFile(mockFile)).rejects.toThrow(
      'An unexpected error occurred. Please try again. Bad Request'
    );
  });

  it('should handle network-level fetch errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new TypeError('Network error'));

    await expect(uploadCsvFile(mockFile)).rejects.toThrow(
      'An unexpected error occurred. Please try again. Network error'
    );
  });
});