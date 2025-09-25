import { useEffect, useState } from "react";
import { fetchOrders } from "../utils/fetchorders";
import { OrderType } from "../utils/type";

const useFetchOrders = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const order = await fetchOrders();
        const orderArray = Array.isArray(order) ? order : [order];
        setOrders(orderArray as OrderType[]);
      } catch (err) {
        setError((err as Error).message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { orders, loading, error };
};

export default useFetchOrders;