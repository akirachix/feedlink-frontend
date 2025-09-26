'use client';
import { useState } from 'react';
import { verifyCodeApi } from '../utils/fetchVerifyCode';

export function useVerifyCode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const verify = async (email: string, code: string) => {
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      const response = await verifyCodeApi(email, code);
      if ( response.detail === 'OTP verified.') {
        setSuccess(true);
      } else {
        setError(response.detail || "OTP verification failed");
        setSuccess(false);
      }
    } catch (error) {
      setError((error as Error).message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { verify, loading, error, success };
}
