import { useState, useEffect } from "react";
import { fetchProducers } from "../utils/fetchProducers";
import { User } from "../utils/types"; 

export function useProducers() {
  const [producers, setProducers] = useState<User[]>([]);
  const [loadingProducers, setLoadingProducers] = useState(false);
  const [producerError, setProducerError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducers = async () => {
      setLoadingProducers(true);
      try {
        const producersData = await fetchProducers();
        setProducers(producersData);
      } catch (err) {
        setProducerError((err as Error).message);
      } finally {
        setLoadingProducers(false);
      }
    };

    loadProducers();
  }, []);

  return { producers, loadingProducers, producerError };
}
