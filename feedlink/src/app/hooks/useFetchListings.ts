'use client';

import { useEffect, useState } from "react";
import { fetchListings } from "../utils/fetchListing";
import { Listing } from "../utils/types";

export const useListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const loadListings = async () => {
      try {
        const data = await fetchListings();
        setListings(data);
      } catch (err) {
        setError((err as Error).message );
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  return { listings, loading, error };
};