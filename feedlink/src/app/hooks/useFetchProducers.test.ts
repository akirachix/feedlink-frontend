
import { renderHook, waitFor } from '@testing-library/react';
import { useProducers } from './useFetchProducers';
import * as fetchProducersModule from '../utils/fetchProducers';


jest.mock('../utils/fetchProducers', () => ({
  fetchProducers: jest.fn(),
}));

describe('useProducers', () => {
  const mockProducers = [
    { id: '1', name: 'Alice', email: 'alice@example.com' },
    { id: '2', name: 'Bob', email: 'bob@example.com' },
  ] as any[];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading true and fetch producers on mount', async () => {
    (fetchProducersModule.fetchProducers as jest.Mock).mockResolvedValueOnce(mockProducers);

    const { result } = renderHook(() => useProducers());

  
    expect(result.current.loadingProducers).toBe(true);
    expect(result.current.producerError).toBeNull();
    expect(result.current.producers).toEqual([]);

    
    await waitFor(() => {
      expect(result.current.loadingProducers).toBe(false);
    });

    expect(result.current.producers).toEqual(mockProducers);
    expect(result.current.producerError).toBeNull();
    expect(fetchProducersModule.fetchProducers).toHaveBeenCalledTimes(1);
  });

  it('should set error when fetch fails', async () => {
    (fetchProducersModule.fetchProducers as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useProducers());

    await waitFor(() => {
      expect(result.current.loadingProducers).toBe(false);
    });

    expect(result.current.producerError).toBe('Failed to load producers. Please try again.');
    expect(result.current.producers).toEqual([]);
  });

  it('should not refetch producers on re-renders (only on mount)', async () => {
    (fetchProducersModule.fetchProducers as jest.Mock).mockResolvedValueOnce(mockProducers);

    const { result, rerender } = renderHook(() => useProducers());

    await waitFor(() => {
      expect(result.current.loadingProducers).toBe(false);
    });

    
    rerender();


    expect(fetchProducersModule.fetchProducers).toHaveBeenCalledTimes(1);
  });
});