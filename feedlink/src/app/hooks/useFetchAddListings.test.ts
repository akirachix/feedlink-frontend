import { renderHook, act } from '@testing-library/react';
import { useAddListing } from './useFetchAddListings';
import * as fetchAddListings from '../utils/fetchAddListings';

jest.mock('../utils/fetchAddListings');

describe('useAddListing', () => {
  it('should call API and return data on success', async () => {
    const mockResponse = { id: '1' };
    (fetchAddListings.addListing as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAddListing());
    const formData = new FormData();

    let response;
    await act(async () => {
      response = await result.current.addListing(formData);
    });

    expect(response).toEqual(mockResponse);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('should set error state on API failure', async () => {
    const mockError = new Error('API request failed');
    (fetchAddListings.addListing as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAddListing());
    const formData = new FormData();

    await act(async () => {
      try {
        await result.current.addListing(formData);
      } catch {
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('API request failed');
  });
});