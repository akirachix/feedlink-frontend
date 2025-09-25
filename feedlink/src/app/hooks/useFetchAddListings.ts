import { useState } from "react";
import { addListing as apiAddListing } from "../utils/fetchAddListings";

export function useAddListing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const addListing = async (formData: FormData) => {
    setLoading(true);
    setError("");
    try {
      const response = await apiAddListing(formData);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { addListing, loading, error };
}
