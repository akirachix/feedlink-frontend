'use client';
import { act } from 'react';
import { renderHook } from '@testing-library/react';
import { useLogin } from './useFetchSigninUser'; 
import { fetchSignin } from '../utils/fetchSigninUsers';

jest.mock('../utils/fetchSigninUsers', () => ({
  fetchSignin: jest.fn(),
}));

describe('useLogin hook', () => {
  const mockFetchSignin = fetchSignin as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading false and no error', () => {
    const { result } = renderHook(() => useLogin());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should set loading to true when login is triggered', async () => {
    mockFetchSignin.mockResolvedValue({ user: { role: 'producer' } });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin('test@example.com', 'password123');
    });

    
    expect(result.current.loading).toBe(false);
  });

  it('should return user data on successful login with no role restriction', async () => {
    const mockResponse = { user: { role: 'admin', name: 'John' } };
    mockFetchSignin.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useLogin());

    let loginResult;
    await act(async () => {
      loginResult = await result.current.handleLogin('admin@example.com', 'secret');
    });

    expect(loginResult).toEqual(mockResponse);
    expect(result.current.error).toBeNull();
  });

  it('should reject login if user role does not match expected role', async () => {
    mockFetchSignin.mockResolvedValue({ user: { role: 'producer' } });

    const { result } = renderHook(() => useLogin());

    let loginResult;
    await act(async () => {
      loginResult = await result.current.handleLogin('user@example.com', 'pass', 'admin');
    });

    expect(loginResult).toBeNull();
    expect(result.current.error).toBe('This account does not have access to this role.');
  });

  it('should set error message if fetchSignin throws', async () => {
    mockFetchSignin.mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useLogin());

    let loginResult;
    await act(async () => {
      loginResult = await result.current.handleLogin('bad@example.com', 'wrong');
    });

    expect(loginResult).toBeNull();
    expect(result.current.error).toBe('Network Error');
    expect(result.current.loading).toBe(false);
  });

  it('should reset error and set loading before making request', async () => {
  mockFetchSignin.mockResolvedValue({ user: { role: 'producer' } });

  const { result } = renderHook(() => useLogin());



  await act(async () => {
    await result.current.handleLogin('test@example.com', 'password123');
  });

  expect(result.current.error).toBeNull();
});
});