import { useEffect, useState } from "react";
import { fetchWasteclaims, updateWasteClaimStatus } from "../utils/fetchWasteclaims"; 
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

  const updateClaimStatus = async (wasteId: number, newStatus: "pending" | "collected") => {
    try {
      const response = await updateWasteClaimStatus(wasteId, newStatus);
      setWasteClaims(prevClaims => 
        prevClaims.map(claim => 
          claim.waste_id === wasteId 
            ? { ...claim, claim_status: newStatus, claim_time: response.claim_time || claim.claim_time } 
            : claim
        )
      );
      return response;
    } catch (err) {
      setError((err as Error).message);
      throw err; 
    }
  };

  return { wasteClaims, loading, error, updateClaimStatus };
};

export default useFetchWasteclaims;