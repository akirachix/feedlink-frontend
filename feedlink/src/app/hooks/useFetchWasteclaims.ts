import { useEffect, useState } from "react";
import { fetchWasteclaims } from "../utils/fetchWasteclaims";
import { WasteClaimType } from "../utils/type";

const useFetchWasteclaims = () => {
  const [wasteClaims, setWasteClaims] = useState<WasteClaimType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetchWasteclaims();
        setWasteClaims(response);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { wasteClaims, loading, error };
};

export default useFetchWasteclaims;