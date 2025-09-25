import { renderHook } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import useFetchUsers from "./useFetchUsers";
import { UserType } from "../utils/type";

jest.mock("../utils/fetchUsers", () => ({
  fetchUsers: jest.fn(),
}));

const mockUsersData: UserType[] = [
  { id: 1, first_name: "Semhal", last_name: "Estifanos" },
  { id: 2, first_name: "Pauline", last_name: "Mwihaki" },
];

describe("useFetchUsers", () => {
  const { fetchUsers } = require("../utils/fetchUsers");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should start in loading state with empty users and no error", () => {
    const { result } = renderHook(() => useFetchUsers());

    expect(result.current.loading).toBe(true);
    expect(result.current.users).toEqual({});
    expect(result.current.error).toBeNull();
  });

  test("should fetch and map users correctly", async () => {
    fetchUsers.mockResolvedValueOnce(mockUsersData);

    const { result } = renderHook(() => useFetchUsers());

    expect(result.current.loading).toBe(true); 

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.users).toEqual({
      1: "Semhal Estifanos",
      2: "Pauline Mwihaki",
    });
    expect(result.current.error).toBeNull();
  });

  test("should handle when there are no users", async () => {
    fetchUsers.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useFetchUsers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.users).toEqual({});
    expect(result.current.error).toBeNull();
  });

  test("should handle failure during fetching with error state", async () => {
    fetchUsers.mockRejectedValueOnce(new Error("Failed to fetch"));

    const { result } = renderHook(() => useFetchUsers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.users).toEqual({});
    expect(result.current.error).toBe("Failed to fetch");
  });


});