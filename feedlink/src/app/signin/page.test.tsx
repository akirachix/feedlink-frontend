'use client';
import { act } from 'react';
import { renderHook } from '@testing-library/react';
import { useLogin } from '../hooks/useFetchSigninUser';
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


 it('should return user data on successful login', async () => {
   mockFetchSignin.mockResolvedValue({ user: { role: 'producer' } });


   const { result } = renderHook(() => useLogin());


   let loginResult;
   await act(async () => {
     loginResult = await result.current.handleLogin('test@example.com', 'password123');
   });


   expect(loginResult).toEqual({ user: { role: 'producer' } });
   expect(result.current.error).toBeNull();
 });


 it('should set error if fetchSignin throws', async () => {
   mockFetchSignin.mockRejectedValue(new Error('Network Error'));


   const { result } = renderHook(() => useLogin());


   let loginResult;
   await act(async () => {
     loginResult = await result.current.handleLogin('bad@example.com', 'wrong');
   });


   expect(loginResult).toBeNull();
   expect(result.current.error).toBe('Network Error');
 });
});

