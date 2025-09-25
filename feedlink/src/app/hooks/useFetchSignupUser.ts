
'use client';

import { useState } from 'react';
import { fetchSignup } from '../utils/fetchSignupUsers';


const useSignup = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    till_number: string;
    address: string;
    role?: string; 
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchSignup({
        ...userData,
        role: 'producer', 
      });

      return result;
    } catch (error) {
      
      setError((error as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error };
};

export default useSignup;