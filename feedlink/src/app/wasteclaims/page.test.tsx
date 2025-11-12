import { render, screen, fireEvent, within, waitFor } from "@testing-library/react";
import WasteClaims from "./page";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface CalendarProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

const mockWasteclaimsHook = require("../hooks/useFetchWasteclaims");

jest.mock("../hooks/useFetchWasteclaims", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../hooks/useFetchUsers", () => ({
  __esModule: true,
  default: () => ({
    users: {
      101: "Semhal Estifanos",
      102: "Pauline Mwihaki",
      103: "Kisanet Sshay",
    },
    loading: false,
    error: null,
  }),
}));

jest.mock("../hooks/useFetchListing", () => ({
  __esModule: true,
  default: () => ({
    listings: {
      201: { listing_id: 201, category: "Fruits", quantity: "10" },
      202: { listing_id: 202, category: "Vegetables", quantity: "5" },
    },
    loading: false,
    error: null,
  }),
}));

jest.mock("../shared-components/Sidebar", () => () => <div data-testid="sidebar" />);

jest.mock("../component/Pagination", () => ({
  __esModule: true,
  default: ({ currentPage, totalPages, onPageChange }: PaginationProps) => (
    <div
      data-testid="pagination"
      data-current-page={currentPage}
      data-total-pages={totalPages}
    >
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}>
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
        Next
      </button>
    </div>
  ),
}));

jest.mock("../component/Calendar", () => ({
  __esModule: true,
  default: ({ selectedDate, setSelectedDate }: CalendarProps) => (
    <input
      data-testid="calendar"
      type="date"
      value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
      onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
    />
  ),
}));

beforeEach(() => {
  mockWasteclaimsHook.default.mockImplementation(() => ({
    wasteClaims: [
      {
        waste_id: 1,
        user: 101,
        listing_id: 201,
        claim_time: "2025-09-21T10:00:00Z",
        claim_status: "pending",
        pin: "12345"
      },
      {
        waste_id: 2,
        user: 102,
        listing_id: 202,
        claim_time: "2025-09-22T15:30:00Z",
        claim_status: "collected",
        pin: "67890"
      },
      {
        waste_id: 3,
        user: 103,
        listing_id: 201,
        claim_time: "2025-09-21T10:00:00Z",
        claim_status: "collected",
        pin: "54321"
      },
    ],
    loading: false,
    error: null,
    updateClaimStatus: jest.fn(),
  }));
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("WasteClaims page", () => {
  test("renders totals and table by default", () => {
    render(<WasteClaims />);
    expect(screen.getByText("Total claimed")).toBeInTheDocument();
    expect(screen.getByText("25.0 kg")).toBeInTheDocument();
    expect(screen.getByText("Total recyclers")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Semhal Estifanos")).toBeInTheDocument();
    expect(screen.getByText("Pauline Mwihaki")).toBeInTheDocument();
    expect(screen.getByText("Kisanet Sshay")).toBeInTheDocument();
  });

  test("filters by claim_status (collected)", () => {
    render(<WasteClaims />);
    fireEvent.click(screen.getByLabelText(/collected/i));
    expect(screen.queryByText("Semhal Estifanos")).not.toBeInTheDocument();
    expect(screen.getByText("Pauline Mwihaki")).toBeInTheDocument();
    expect(screen.getByText("Kisanet Sshay")).toBeInTheDocument();
  });

  test("shows loading state", () => {
    mockWasteclaimsHook.default.mockImplementationOnce(() => ({
      wasteClaims: [],
      loading: true,
      error: null,
      updateClaimStatus: jest.fn(),
    }));
    render(<WasteClaims />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("shows error state", () => {
    mockWasteclaimsHook.default.mockImplementationOnce(() => ({
      wasteClaims: [],
      loading: false,
      error: "Something went wrong",
      updateClaimStatus: jest.fn(),
    }));
    render(<WasteClaims />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  test("shows empty state", () => {
    mockWasteclaimsHook.default.mockImplementationOnce(() => ({
      wasteClaims: [],
      loading: false,
      error: null,
      updateClaimStatus: jest.fn(),
    }));
    render(<WasteClaims />);
    expect(screen.getByText(/no waste claims found/i)).toBeInTheDocument();
  });

  test("search filters results (case insensitive)", () => {
    render(<WasteClaims />);
    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "pauline" },
    });
    expect(screen.getByText("Pauline Mwihaki")).toBeInTheDocument();
    expect(screen.queryByText("Semhal Estifanos")).not.toBeInTheDocument();
    expect(screen.queryByText("Kisanet Sshay")).not.toBeInTheDocument();
  });

  test("filters by claim_status (pending)", () => {
    render(<WasteClaims />);
    fireEvent.click(screen.getByLabelText(/pending/i));
    expect(screen.getByText("Semhal Estifanos")).toBeInTheDocument();
    expect(screen.queryByText("Pauline Mwihaki")).not.toBeInTheDocument();
    expect(screen.queryByText("Kisanet Sshay")).not.toBeInTheDocument();
  });

  test("filters by date", () => {
    render(<WasteClaims />);
    const calendar = screen.getByTestId("calendar");
    fireEvent.change(calendar, { target: { value: "2025-09-22" } });
    
    expect(screen.getByText("Pauline Mwihaki")).toBeInTheDocument();
    expect(screen.queryByText("Semhal Estifanos")).not.toBeInTheDocument();
    expect(screen.queryByText("Kisanet Sshay")).not.toBeInTheDocument();
  });

  test("pagination updates currentPage", async () => {
    mockWasteclaimsHook.default.mockImplementationOnce(() => ({
      wasteClaims: Array.from({ length: 10 }, (_, i) => ({
        waste_id: i + 1,
        user: 101,
        listing_id: 201,
        claim_time: `2025-09-21T${10 + i}:00:00Z`,
        claim_status: i % 2 === 0 ? "pending" : "collected",
        pin: `${1000 + i}`
      })),
      loading: false,
      error: null,
      updateClaimStatus: jest.fn(),
    }));
    
    render(<WasteClaims />);
    
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByTestId("pagination")).toHaveAttribute("data-current-page", "2");
  });

  test("handles unknown listing quantity gracefully", () => {
    mockWasteclaimsHook.default.mockImplementationOnce(() => ({
      wasteClaims: [
        {
          waste_id: 4,
          user: 101,
          listing_id: 999,
          claim_time: "2025-09-21T10:00:00Z",
          claim_status: "pending",
          pin: "11111"
        },
      ],
      loading: false,
      error: null,
      updateClaimStatus: jest.fn(),
    }));
    render(<WasteClaims />);
    expect(screen.getByText(/Unknown Kgs/i)).toBeInTheDocument();
  });

  test("handles a situation where user is not found", () => {
    mockWasteclaimsHook.default.mockImplementationOnce(() => ({
      wasteClaims: [
        {
          waste_id: 5,
          user: 200,
          listing_id: 201,
          claim_time: "2025-09-21T10:00:00Z",
          claim_status: "pending",
          pin: "22222"
        },
      ],
      loading: false,
      error: null,
      updateClaimStatus: jest.fn(),
    }));
    render(<WasteClaims />);
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row").slice(1);
    const recyclerCell = rows[0].querySelector("td");
    expect(recyclerCell?.textContent?.trim()).toBe("");
  });

  test("handles missing pin gracefully", () => {
    mockWasteclaimsHook.default.mockImplementationOnce(() => ({
      wasteClaims: [
        {
          waste_id: 6,
          user: 101,
          listing_id: 201,
          claim_time: "2025-09-21T10:00:00Z",
          claim_status: "pending",
          pin: null
        },
      ],
      loading: false,
      error: null,
      updateClaimStatus: jest.fn(),
    }));
    render(<WasteClaims />);
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  test("updates status when dropdown option is selected", async () => {
    const mockUpdateStatus = jest.fn();
    mockWasteclaimsHook.default.mockImplementationOnce(() => ({
      wasteClaims: [
        {
          waste_id: 1,
          user: 101,
          listing_id: 201,
          claim_time: "2025-09-21T10:00:00Z",
          claim_status: "pending",
          pin: "12345"
        }
      ],
      loading: false,
      error: null,
      updateClaimStatus: mockUpdateStatus,
    }));

    render(<WasteClaims />);
    
    const statusSelect = screen.getByText("Pending");
    fireEvent.click(statusSelect);
    
    const collectedOption = screen.getByText("Collected");
    fireEvent.click(collectedOption);
    
    await waitFor(() => {
      expect(mockUpdateStatus).toHaveBeenCalledWith(1, "collected");
    });
  });
});