import { renderHook, act } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { OrderType } from "../utils/type";
import { useOrders } from "../hooks/useFetchOrders";

global.fetch = jest.fn();

const mockOrdersData: OrderType[] = [
  {
    order_id: 1,
    user: 10,
    items: [
      { id: 1, quantity: 2, price: "15", listing: 101 },
      { id: 2, quantity: 1, price: "20", listing: 102 }
    ],
    total_amount: "50",
    order_date: "2025-09-22",
    order_status: "pending",
    payment_status: "completed",
    pin: "12345",
    created_at: "2025-09-22T10:00:00Z",
    updated_at: "2025-09-22T10:00:00Z"
  },
  {
    order_id: 2,
    user: 12,
    items: [
      { id: 3, quantity: 3, price: "10", listing: 103 }
    ],
    total_amount: "30",
    order_date: "2025-09-23",
    order_status: "picked",
    payment_status: "completed",
    pin: "67890",
    created_at: "2025-09-23T13:45:00Z",
    updated_at: "2025-09-23T13:45:00Z"
  },
];

describe("useFetchOrders", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.MockedFunction<typeof global.fetch>).mockClear();
  });

  test("should show an error when fetching fails", async () => {
    (global.fetch as jest.MockedFunction<typeof global.fetch>)
      .mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
        json: async () => ({}),
      } as Response);

    const { result } = renderHook(() => useOrders());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.orders).toEqual([]);
    expect(result.current.error).toBe("Failed to fetch orders: Something went wrong: Not Found");
  });

  test("should handle network error when fetching", async () => {
    (global.fetch as jest.MockedFunction<typeof global.fetch>)
      .mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useOrders());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.orders).toEqual([]);
    expect(result.current.error).toBe("Failed to fetch orders: Network error");
  });

  test("should successfully update order status", async () => {
    (global.fetch as jest.MockedFunction<typeof global.fetch>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrdersData,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockOrdersData[0], order_status: "picked" }),
      } as Response);

    const { result } = renderHook(() => useOrders());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.updateOrderStatus(1, "picked");
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/orders/1", {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_status: "picked"
      }),
    });
  });

  test("should handle error when updating order status", async () => {
    (global.fetch as jest.MockedFunction<typeof global.fetch>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrdersData,
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: "Bad Request" }),
      } as Response);

    const { result } = renderHook(() => useOrders());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(
      act(async () => {
        // Instead of using "invalid_status" as any, we can use a valid status type
        // but since we want to test error handling, we'll use a valid status that might fail on the backend
        await result.current.updateOrderStatus(1, "picked");
      })
    ).rejects.toThrow("Failed to update status: 400 - {\"message\":\"Bad Request\"}");
  });

  test("should handle network error when updating order status", async () => {
    (global.fetch as jest.MockedFunction<typeof global.fetch>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrdersData,
      } as Response)
      .mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useOrders());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(
      act(async () => {
        await result.current.updateOrderStatus(1, "picked");
      })
    ).rejects.toThrow("Failed to update order status: Network error");
  });
});