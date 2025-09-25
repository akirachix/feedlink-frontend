"use client";

import { useEffect, useState, useCallback } from "react";
import  {fetchListings } from "../utils/fetchInventory";
import { Listing, User } from "../utils/types";


const useInventory = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const listings = await fetchListings();
      setListings(listings);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { listings, loading, error, refresh };
};

export default useInventory;