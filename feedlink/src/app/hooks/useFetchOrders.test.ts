import { renderHook } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { OrderType } from "../utils/type";

jest.mock("../utils/useFetchOrders", () => ({
  fetchOrders: jest.fn(),
}));

const mockOrdersData: OrderType[] = [
  {
    order_id: 1,
    user: 10,
    total_amount: "200.00",
    order_date: "2025-09-21",
    order_status: "pending",
    items: [
      { id: 1, quantity: 2, price: "100.00", listing: 4 },
      { id: 2, quantity: 1, price: "50.00", listing: 5 },
    ],
  },
  {
    order_id: 2,
    user: 22,
    total_amount: "75.00",
    order_date: "2025-09-22",
    order_status: "picked",
    items: [
      { id: 3, quantity: 5, price: "15.00", listing: 6 },
    ],
  },
];

describe("useFetchOrders", () => {
  const { fetchOrders } = require("../utils/fetchOrders");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should start in loading state with empty orders and no error", () => {
    const { result } = renderHook(() => fetchOrders());

    expect(result.current.loading).toBe(true);
    expect(result.current.orders).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  test("should successfully fetch orders", async () => {
    fetchOrders.mockResolvedValueOnce(mockOrdersData);

    const { result } = renderHook(() => fetchOrders());

    expect(result.current.loading).toBe(true); 

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.orders).toEqual(mockOrdersData);
    expect(result.current.error).toBeNull();
  });


  test("should handle when there are no orders", async () => {
    fetchOrders.mockResolvedValueOnce([]);

    const { result } = renderHook(() => fetchOrders());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.orders).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  test("should handle failure during fetching with error state", async () => {
    fetchOrders.mockRejectedValueOnce(new Error("Failed to fetch"));

    const { result } = renderHook(() => fetchOrders());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.orders).toEqual([]);
    expect(result.current.error).toBe("Failed to fetch");
  });

});