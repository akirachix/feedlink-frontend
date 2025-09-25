
import { renderHook, act, waitFor } from '@testing-library/react';
import { useVerifyCode } from './useVerifyCode';
import * as fetchModule from '../utils/fetchVerifyCode';

jest.mock('../utils/fetchVerifyCode');

describe('useVerifyCode', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should verify successfully and set success state when response detail is "OTP verified."', async () => {
    (fetchModule.verifyCodeApi as jest.Mock).mockResolvedValue({ detail: 'OTP verified.' });

    const { result } = renderHook(() => useVerifyCode());

    act(() => {
      result.current.verify('semhal@gmail.com', '123456');
    });

    await waitFor(() => {
      expect(result.current.success).toBe(true);
    }, { timeout: 3000 });

    expect(result.current.error).toBe('');
    expect(result.current.loading).toBe(false);
  });

  it('should set error and fail when response detail is NOT "OTP verified."', async () => {
    (fetchModule.verifyCodeApi as jest.Mock).mockResolvedValue({ detail: 'OTP verification failed' });

    const { result } = renderHook(() => useVerifyCode());

    act(() => {
      result.current.verify('semhal@gmail.com', '123456');
    });

    await waitFor(() => {
      expect(result.current.error).toBe('OTP verification failed');
    }, { timeout: 3000 });

    expect(result.current.success).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it('should set error on API rejection', async () => {
    const errorMessage = 'Network error';
    (fetchModule.verifyCodeApi as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useVerifyCode());

    act(() => {
      result.current.verify('semhal@gmail.com', '123456');
    });

    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage);
    }, { timeout: 3000 });

    expect(result.current.success).toBe(false);
    expect(result.current.loading).toBe(false);
  });
});
