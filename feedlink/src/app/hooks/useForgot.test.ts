import { renderHook, act, waitFor } from '@testing-library/react';
import useForgotPassword from './useForgotPassword';
import * as fetchModule from '../utils/fetchForgotPassword';
import { useRouter } from 'next/navigation';
jest.mock('../utils/fetchForgotPassword');
jest.mock('next/navigation', () => ({
 useRouter: jest.fn(),
}));
describe('useForgotPassword', () => {
 const mockPush = jest.fn();
 beforeEach(() => {
   jest.clearAllMocks();
   (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
   jest.useFakeTimers();
 });
 afterEach(() => {
   jest.runOnlyPendingTimers();
   jest.useRealTimers();
 });
 it('should send reset email and update success and message on OTP sent response', async () => {
   const email = 'semhal@egmail.com';
   const response = { detail: 'OTP sent to email' };
   (fetchModule.forgotPasswordApi as jest.Mock).mockResolvedValue(response);
   const { result } = renderHook(() => useForgotPassword());
   act(() => {
     result.current.sendResetEmail(email);
   });
   expect(result.current.loading).toBe(true);
   await waitFor(() => expect(result.current.loading).toBe(false));
   expect(fetchModule.forgotPasswordApi).toHaveBeenCalledWith(email);
   expect(result.current.success).toBe(true);
   expect(result.current.message).toBe(response.detail);
   expect(localStorage.getItem('forgotEmail')).toBe(email);
   act(() => {
     jest.runAllTimers();
   });
   expect(mockPush).toHaveBeenCalledWith('/verifyCode');
   expect(result.current.error).toBe('');
 });
 it('should set error message if response detail does not include OTP sent', async () => {
   const email = 'semehal@gmail.com';
   const response = { detail: 'Some error' };
   (fetchModule.forgotPasswordApi as jest.Mock).mockResolvedValue(response);
   const { result } = renderHook(() => useForgotPassword());
   act(() => {
     result.current.sendResetEmail(email);
   });
   await waitFor(() => expect(result.current.loading).toBe(false));
   expect(result.current.success).toBe(false);
   expect(result.current.error).toBe(response.detail);
 });
 it('should set error message on API throw', async () => {
   const email = "semhal@gmail.com";
   const errorMessage = 'Network error';
   (fetchModule.forgotPasswordApi as jest.Mock).mockRejectedValue(new Error(errorMessage));
   const { result } = renderHook(() => useForgotPassword());
   act(() => {
     result.current.sendResetEmail(email);
   });
   await waitFor(() => expect(result.current.loading).toBe(false));
   expect(result.current.error).toBe(errorMessage);
   expect(result.current.success).toBe(false);
 });
});