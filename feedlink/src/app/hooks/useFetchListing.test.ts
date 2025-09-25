import { renderHook } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { ListingType } from "../utils/type";
import useFetchListings from "./useFetchListing";

jest.mock("../utils/fetchListing", () => ({
  fetchListings: jest.fn(),
}));

const mockListingData: ListingType[] = [
  { listing_id: 1, category: "Fruits", quantity: "10kg" },
  { listing_id: 2, category: "Dairy", quantity: "5kg" },
];

describe("useFetchListings", () => {
  const { fetchListings } = require("../utils/fetchListing");

  beforeEach(() => {
    jest.clearAllMocks();
  });

   test("should start in loading state with empty data and no error", () => {
    const { result } = renderHook(() => useFetchListings());

    expect(result.current.loading).toBe(true);
    expect(result.current.listings).toEqual({});
    expect(result.current.error).toBeNull();
  });

  test("should fetch the listings successfully and map them correctly", async () => {
    fetchListings.mockResolvedValueOnce(mockListingData);

    const { result } = renderHook(() => useFetchListings());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.listings).toEqual({
      1: mockListingData[0],
      2: mockListingData[1],
    });
    expect(result.current.error).toBeNull();
  });

  test("should handle when there are no listings", async () => {
    fetchListings.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useFetchListings());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.listings).toEqual({});
    expect(result.current.error).toBeNull();
  });

  test("should handle failure during fetching with error state", async () => {
    fetchListings.mockRejectedValueOnce(new Error("Failed to fetch"));

    const { result } = renderHook(() => useFetchListings());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.listings).toEqual({});
    expect(result.current.error).toBe("Failed to fetch");
  });
});