import { useEffect, useState } from "react";
import { fetchListings } from "../utils/fetchListing";
import { ListingType } from "../utils/type";

const useFetchListings = () => {
  const [listings, setListings] = useState<Record<number, ListingType>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const  listing: ListingType[] = await fetchListings();
        const listingMap: Record<number, ListingType> = {}; 
        listing.forEach((listing) => {
          listingMap[listing.listing_id] = listing;
        });

        setListings(listingMap);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { listings, loading, error };
};

export default useFetchListings;