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
    } catch (error) {
      setError((error as Error).message);
      return null;
    }finally{
      setLoading(false);
  };

  return { addListing, loading, error };
}
