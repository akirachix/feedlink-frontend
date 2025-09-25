import { useEffect, useState } from "react";
import { fetchOrders } from "../utils/fetchOrders";
import { OrderType } from "../utils/type";

const useFetchOrders = () => {
  const [orders, setOrders] = useState<Array<OrderType>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const order = await fetchOrders();
        const orderArray = Array.isArray(order) ? order : [order];

        setOrders(orderArray as OrderType[]);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return { orders, loading, error };
};
export default useFetchOrders;
