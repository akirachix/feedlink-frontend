import { renderHook, waitFor } from '@testing-library/react';
import { useProducers } from './useFetchProducers';
import { fetchProducers } from '../utils/fetchProducers';
import { User } from '../utils/types';

jest.mock('../utils/fetchProducers');

const mockFetchProducers = fetchProducers as jest.MockedFunction<typeof fetchProducers>;

describe('useProducers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set loading to true initially', () => {
    mockFetchProducers.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useProducers());

    expect(result.current.loadingProducers).toBe(true);
    expect(result.current.producers).toEqual([]);
    expect(result.current.producerError).toBeNull();
  });

  it('should load producers successfully with numeric IDs', async () => {
    const mockProducers: User[] = [
      {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        role: 'producer',
        profile_picture: 'https://example.com/john.jpg',
        address: 'Nairobi, Kenya',
        till_number: '123456',
        latitude: -1.2864,
        longitude: 36.8172,
      },
      {
        id: 2,
        first_name: 'Jane',
        last_name: 'Mwangi',
        email: 'jane.mwangi@example.com',
        role: 'producer',
        profile_picture: 'https://example.com/jane.jpg',
        address: 'Mombasa, Kenya',
        till_number: '789012',
        latitude: -4.0435,
        longitude: 39.6682,
      },
    ];

    mockFetchProducers.mockResolvedValue(mockProducers);

    const { result } = renderHook(() => useProducers());

    
    expect(result.current.loadingProducers).toBe(true);

    
    await waitFor(() => {
      expect(result.current.loadingProducers).toBe(false);
    });

   
    expect(result.current.producers).toEqual(mockProducers);
    expect(result.current.producerError).toBeNull();
    expect(result.current.producers[0].id).toBe(1); 
    expect(result.current.producers[1].id).toBe(2);
  });

  it('should handle errors when fetching producers', async () => {
    const errorMessage = 'Failed to fetch producers';
    mockFetchProducers.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useProducers());

    await waitFor(() => {
      expect(result.current.loadingProducers).toBe(false);
    });

    expect(result.current.producers).toEqual([]);
    expect(result.current.producerError).toBe(errorMessage);
  });

  it('should only call fetchProducers once on mount', () => {
    const mockProducers: User[] = [
      {
        id: 1,
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        role: 'producer',
        profile_picture: '',
        address: 'Test Address',
        till_number: '000000',
        latitude: null,
        longitude: null,
      },
    ];
    mockFetchProducers.mockResolvedValue(mockProducers);

    const { rerender } = renderHook(() => useProducers());

    rerender();

    expect(mockFetchProducers).toHaveBeenCalledTimes(1);
  });
});