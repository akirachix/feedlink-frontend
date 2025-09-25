'use client';
import { act } from 'react';
import { renderHook } from '@testing-library/react';
import useSignup from './useFetchSignupUser'; 
import { fetchSignup } from '../utils/fetchSignupUsers';

jest.mock('../utils/fetchSignupUsers', () => ({
  fetchSignup: jest.fn(),
}));

describe('useSignup hook', () => {
  const mockFetchSignup = fetchSignup as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading false and no error', () => {
    const { result } = renderHook(() => useSignup());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should set loading to true when signup is triggered', async () => {
    mockFetchSignup.mockResolvedValue({ success: true });

    const { result } = renderHook(() => useSignup());

    await act(async () => {
      await result.current.signup({
        first_name: 'Hewan',
        last_name: 'Mehari',
        email: 'john@example.com',
        password: 'password123',
        till_number: '123456',
        address: 'Nairobi',
      });
    });

    expect(result.current.loading).toBe(false); 
  });

  it('should force role to "producer" and return result on success', async () => {
    const mockResponse = { user: { id: '123', role: 'producer' } };
    mockFetchSignup.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useSignup());

    let signupResult;
    await act(async () => {
      signupResult = await result.current.signup({
        first_name: 'Naod',
        last_name: 'Berhe',
        email: 'naod@example.com',
        password: 'securePass',
        till_number: '654321',
        address: 'Mombasa',
        role: 'admin', 
      });
    });

    expect(mockFetchSignup).toHaveBeenCalledWith(
      expect.objectContaining({
        first_name: 'Naod',
        last_name: 'Berhe',
        email: 'naod@example.com',
        password: 'securePass',
        till_number: '654321',
        address: 'Mombasa',
        role: 'producer', 
      })
    );

    expect(signupResult).toEqual(mockResponse);
    expect(result.current.error).toBeNull();
  });

  it('should set error if fetchSignup throws', async () => {
    mockFetchSignup.mockRejectedValue(new Error('Email already exists'));

    const { result } = renderHook(() => useSignup());

    let signupResult;
    await act(async () => {
      signupResult = await result.current.signup({
        first_name: 'Fail',
        last_name: 'User',
        email: 'fail@example.com',
        password: '123',
        till_number: '000000',
        address: 'Error City',
      });
    });

    expect(signupResult).toBeNull();
    expect(result.current.error).toBe('Email already exists');
    expect(result.current.loading).toBe(false);
  });

  it('should clear previous error before attempting signup', async () => {
  mockFetchSignup.mockResolvedValue({ success: true });

  const { result } = renderHook(() => useSignup());


  await act(async () => {
    await result.current.signup({
      first_name: 'Clean',
      last_name: 'Start',
      email: 'clean@example.com',
      password: 'fresh',
      till_number: '111111',
      address: 'Reset City',
    });
  });

  expect(result.current.error).toBeNull();
});
});