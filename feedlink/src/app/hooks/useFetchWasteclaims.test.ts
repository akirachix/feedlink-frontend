import { renderHook } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import useFetchWasteclaims from "./useFetchWasteclaims";
import { fetchWasteclaims } from "../utils/fetchWasteclaims";

jest.mock("../utils/fetchWasteclaims", () => ({
  fetchWasteclaims: jest.fn(),
}));

const mockWasteclaims = [
     { id: 1, description: '2 buckets of waste in Naivas, Karen' },
     { id: 2, description: '20 kgs of waste in Kanva supermarket' },
   ];


describe("useFetchWasteclaims", () => {
  const mockFetchWasteclaims = fetchWasteclaims as jest.MockedFunction<typeof fetchWasteclaims>;

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

    expect(result.current.wasteClaims).toEqual(mockWasteclaims

    );
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
});