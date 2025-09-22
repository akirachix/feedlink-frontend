import { useEffect, useState } from "react";
import { fetchListings } from "../utils/fetchListing";

export interface ListingType {
  listing_id: number;
  category: string;

}

const useFetchListings = () => {
  const [listings, setListings] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data: ListingType[] = await fetchListings(); 

        const listingMap: Record<number, string> = {};
        data.forEach((listing) => {
          listingMap[listing.listing_id] = listing.category || "Unknown";
        });

        setListings(listingMap);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { listings, loading, error };
};

export default useFetchListings;