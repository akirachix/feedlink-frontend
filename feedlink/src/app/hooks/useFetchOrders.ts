'use client';

import { useEffect, useState } from "react";
import { fetchOrders } from "../utils/fetchorders";
import { Order } from "../utils/types";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);
  return { orders, loading, error };

};


