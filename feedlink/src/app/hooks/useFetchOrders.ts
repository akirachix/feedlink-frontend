'use client';

import { useEffect, useState } from "react";
import { fetchOrders, updateOrderStatus as apiUpdateOrderStatus } from "../utils/fetchorders";
import { OrderType } from "../utils/type";

export const useOrders = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const updateOrderStatus = async (orderId: number, newStatus: "pending" | "picked") => {
    try {
      const response = await apiUpdateOrderStatus(orderId, newStatus);
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.order_id === orderId 
            ? { ...order, order_status: newStatus, updated_at: response.updated_at } 
            : order
        )
      );
      return response;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  return { orders, loading, error, updateOrderStatus };
};