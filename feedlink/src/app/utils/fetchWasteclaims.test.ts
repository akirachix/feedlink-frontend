import { renderHook, act } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { WasteClaimType } from "../utils/type";
import useFetchWasteclaims from "../hooks/useFetchWasteclaims";

global.fetch = jest.fn();

const mockWasteClaimsData: WasteClaimType[] = [
  {
    waste_id: 1,
    user: 10,
    listing_id: 100,
    claim_time: "2025-09-22T10:00:00Z",
    claim_status: "pending",
    pin: "12345"
  },
  {
    waste_id: 2,
    user: 12,
    listing_id: 104,
    claim_time: "2025-09-23T13:45:00Z",
    claim_status: "collected",
    pin: "67890"
  },
];

describe("useFetchWasteclaims", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.MockedFunction<typeof global.fetch>).mockClear();
  });

  test("should successfully fetch the waste claims", async () => {
    (global.fetch as jest.MockedFunction<typeof global.fetch>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockWasteClaimsData,
      } as Response);

    const { result } = renderHook(() => useFetchWasteclaims());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.wasteClaims).toEqual(mockWasteClaimsData);
    expect(result.current.error).toBeNull();
  });

  test("should show an error when fetching fails", async () => {
    (global.fetch as jest.MockedFunction<typeof global.fetch>)
      .mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
        json: async () => ({}),
      } as Response);

    const { result } = renderHook(() => useFetchWasteclaims());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.wasteClaims).toEqual([]);
    expect(result.current.error).toBe("Failed to fetch waste claims:Something went wrongNot Found");
  });

  test("should handle network error when fetching", async () => {
    (global.fetch as jest.MockedFunction<typeof global.fetch>)
      .mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useFetchWasteclaims());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.wasteClaims).toEqual([]);
    expect(result.current.error).toBe("Failed to fetch waste claims:Network error");
  });

  test("should successfully update waste claim status", async () => {
    (global.fetch as jest.MockedFunction<typeof global.fetch>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockWasteClaimsData,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockWasteClaimsData[0], claim_status: "collected" }),
      } as Response);

    const { result } = renderHook(() => useFetchWasteclaims());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.updateClaimStatus(1, "collected");
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/wasteclaims/1", {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        claim_status: "collected"
      }),
    });
  });

  test("should handle error when updating waste claim status", async () => {
    (global.fetch as jest.MockedFunction<typeof global.fetch>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockWasteClaimsData,
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: "Bad Request" }),
      } as Response);

    const { result } = renderHook(() => useFetchWasteclaims());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(
      act(async () => {
        // Instead of using "invalid_status" as any, we can use a valid status type
        // but since we want to test error handling, we'll use a valid status that might fail on the backend
        await result.current.updateClaimStatus(1, "collected");
      })
    ).rejects.toThrow("Failed to update status: 400 - {\"message\":\"Bad Request\"}");
  });

  test("should handle network error when updating waste claim status", async () => {
    (global.fetch as jest.MockedFunction<typeof global.fetch>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockWasteClaimsData,
      } as Response)
      .mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useFetchWasteclaims());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(
      act(async () => {
        await result.current.updateClaimStatus(1, "collected");
      })
    ).rejects.toThrow("Failed to update waste claim status: Network error");
  });
});