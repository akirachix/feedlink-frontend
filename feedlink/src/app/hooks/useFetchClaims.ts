'use client';

import { useEffect, useState } from "react";
import { fetchWasteClaims } from "../utils/fetchclaims";
import { WasteClaim } from "../utils/types";

export const useWasteClaims = () => {
  const [wasteClaims, setWasteClaims] = useState<WasteClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const loadWasteClaims = async () => {
      try {
        const data = await fetchWasteClaims();
        setWasteClaims(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadWasteClaims();
  }, []);

  return { wasteClaims, loading, error };
};