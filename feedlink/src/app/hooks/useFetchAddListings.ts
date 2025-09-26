
import { useState } from "react";
import { addListing as apiAddListing } from "../utils/fetchAddListings";

export function useAddListing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const addListing = async (formData: FormData) => {
    setLoading(true);
    setError("");
    try {
      const result = await apiAddListing(formData);
      setLoading(false);
      return result;
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { addListing, loading, error };
}


