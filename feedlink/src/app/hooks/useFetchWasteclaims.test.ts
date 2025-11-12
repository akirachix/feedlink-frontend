import { renderHook, act } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import useFetchWasteclaims from "./useFetchWasteclaims";
import { fetchWasteclaims, updateWasteClaimStatus } from "../utils/fetchWasteclaims";

jest.mock("../utils/fetchWasteclaims", () => ({
  fetchWasteclaims: jest.fn(),
  updateWasteClaimStatus: jest.fn(),
}));

const mockWasteclaims = [
  {
    waste_id: 1,
    description: "2 buckets of waste in Naivas, Karen",
    claim_status: "pending",
    claim_time: "2025-11-12T11:00:00Z",
  },
  {
    waste_id: 2,
    description: "20 kgs of waste in Kanva supermarket",
    claim_status: "collected",
    claim_time: "2025-11-11T12:00:00Z",
  },
];

describe("useFetchWasteclaims", () => {
  const mockFetchWasteclaims = fetchWasteclaims as jest.MockedFunction<typeof fetchWasteclaims>;
  const mockUpdateWasteClaimStatus = updateWasteClaimStatus as jest.MockedFunction<typeof updateWasteClaimStatus>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should start in loading state with empty waste claims and no error", () => {
    const { result } = renderHook(() => useFetchWasteclaims());
    expect(result.current.loading).toBe(true);
    expect(result.current.wasteClaims).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  test("should fetch and set waste claims correctly when array is returned", async () => {
    mockFetchWasteclaims.mockResolvedValueOnce(mockWasteclaims);

    const { result } = renderHook(() => useFetchWasteclaims());
    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.wasteClaims).toEqual(mockWasteclaims);
    expect(result.current.error).toBeNull();
  });

  test("should handle when there are no waste claims", async () => {
    mockFetchWasteclaims.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useFetchWasteclaims());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.wasteClaims).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  test("should handle failure during fetching with error state", async () => {
    mockFetchWasteclaims.mockRejectedValueOnce(new Error("Failed to fetch"));

    const { result } = renderHook(() => useFetchWasteclaims());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.wasteClaims).toEqual([]);
    expect(result.current.error).toBe("Failed to fetch");
  });

  test("should update claim status for a waste claim", async () => {
    mockFetchWasteclaims.mockResolvedValueOnce(mockWasteclaims);
    mockUpdateWasteClaimStatus.mockResolvedValueOnce({
      waste_id: 1,
      claim_status: "collected",
      claim_time: "2025-11-12T12:34:00Z",
    });

    const { result } = renderHook(() => useFetchWasteclaims());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.updateClaimStatus(1, "collected");
    });

    expect(mockUpdateWasteClaimStatus).toHaveBeenCalledWith(1, "collected");
    expect(result.current.wasteClaims.find(c => c.waste_id === 1)?.claim_status).toBe("collected");
    expect(result.current.error).toBeNull();
  });

test("should handle error when updating claim status", async () => {
  mockFetchWasteclaims.mockResolvedValueOnce(mockWasteclaims);
  mockUpdateWasteClaimStatus.mockRejectedValueOnce(new Error("Update error"));

  const { result } = renderHook(() => useFetchWasteclaims());
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  await expect(result.current.updateClaimStatus(1, "collected")).rejects.toThrow("Update error");

  await waitFor(() => {
    expect(result.current.error).toBe("Update error");
  });
});
});