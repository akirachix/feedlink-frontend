import { useEffect, useState } from "react";
import { fetchOrders } from "../utils/fetchOrders";

export interface OrderItemType {
  id: number;
  quantity: number;
  price: string;
  listing: number; 
}

export interface OrderType {
  order_id: number;
  user: number;
  total_amount: string;
  order_date: string;
  order_status: "pending" | "picked";
  items: OrderItemType[]; 
}

const useFetchOrders = () => {
  const [orders, setOrders] = useState<Array<OrderType>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchOrders();
        const arrayData = Array.isArray(data) ? data : [data];

        setOrders(arrayData as OrderType[]);
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
