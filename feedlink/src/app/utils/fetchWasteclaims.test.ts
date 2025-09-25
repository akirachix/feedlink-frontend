import { renderHook } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { WasteClaimType } from "../utils/type";
import useFetchWasteclaims from "../hooks/useFetchWasteclaims";

jest.mock("../utils/fetchWasteclaims", () => ({
  fetchWasteclaims: jest.fn(),
}));

const mockWasteClaimsData: WasteClaimType[] = [
  {
    waste_id: 1,
    user: 10,
    listing_id: 100,
    claim_time: "2025-09-22T10:00:00Z",
    claim_status: "pending",
  },
  {
    waste_id: 2,
    user: 12,
    listing_id: 104,
    claim_time: "2025-09-23T13:45:00Z",
    claim_status: "collected",
  },
];

describe("useFetchWasteclaims", () => {
  const { fetchWasteclaims } = require("../utils/fetchWasteclaims");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should successfully fetch the waste claims", async () => {
    fetchWasteclaims.mockResolvedValueOnce(mockWasteClaimsData);

    const { result } = renderHook(() => useFetchWasteclaims());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.wasteClaims).toEqual(mockWasteClaimsData);
    expect(result.current.error).toBeNull();
  });

  test("should show an error when fetching fails", async () => {
    fetchWasteclaims.mockRejectedValueOnce(new Error("Failed to fetch"));

    const { result } = renderHook(() => useFetchWasteclaims());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.wasteClaims).toEqual([]);
    expect(result.current.error).toBe("Failed to fetch");
  });
});