'use client';
import { useState } from 'react';
import { fetchSignin } from '../utils/fetchSigninUsers';


export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(email: string, password: string, expectedRole?: string) {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchSignin(email, password);

      if (expectedRole && result.user.role !== expectedRole) {
        setError("This account does not have access to this role.");
        return null;
      }

 
      return result;
    } catch (err) {
      setError((err as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { handleLogin, loading, error };
}