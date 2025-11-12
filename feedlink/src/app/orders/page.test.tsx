import { render, screen, fireEvent, within, waitFor } from "@testing-library/react";
import Orders from "./page";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface CalendarProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

const mockUseOrdersHook = require("../hooks/useFetchOrders");

jest.mock("../hooks/useOrders", () => ({
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
    listings: {},
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
  mockUseOrdersHook.default.mockImplementation(() => ({
    orders: [
      {
        order_id: 1,
        user: 101,
        order_date: "2025-09-21",
        total_amount: "150.00",
        order_status: "pending",
        payment_status: "completed",
        pin: "12345",
        created_at: "2025-09-21T10:00:00Z",
        updated_at: "2025-09-21T10:00:00Z",
        items: [
          { id: 1, quantity: 2, price: "75.00", listing: 201 }
        ],
      },
      {
        order_id: 2,
        user: 102,
        order_date: "2025-09-22",
        total_amount: "200.00",
        order_status: "picked",
        payment_status: "completed",
        pin: "67890",
        created_at: "2025-09-22T15:30:00Z",
        updated_at: "2025-09-22T15:30:00Z",
        items: [
          { id: 2, quantity: 1, price: "200.00", listing: 202 }
        ],
      },
      {
        order_id: 3,
        user: 103,
        order_date: "2025-09-21",
        total_amount: "100.00",
        order_status: "picked",
        payment_status: "completed",
        pin: "54321",
        created_at: "2025-09-21T10:00:00Z",
        updated_at: "2025-09-21T10:00:00Z",
        items: [
          { id: 3, quantity: 1, price: "100.00", listing: 201 }
        ],
      },
    ],
    loading: false,
    error: null,
    updateOrderStatus: jest.fn(),
  }));
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Orders page", () => {
  test("renders totals and table by default", () => {
    render(<Orders />);
    expect(screen.getByText("Total customers")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Total orders")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Semhal Estifanos")).toBeInTheDocument();
    expect(screen.getByText("Pauline Mwihaki")).toBeInTheDocument();
    expect(screen.getByText("Kisanet Sshay")).toBeInTheDocument();
  });

  test("filters by order_status (picked)", () => {
    render(<Orders />);
    fireEvent.click(screen.getByLabelText(/picked/i));
    expect(screen.queryByText("Semhal Estifanos")).not.toBeInTheDocument();
    expect(screen.getByText("Pauline Mwihaki")).toBeInTheDocument();
    expect(screen.getByText("Kisanet Sshay")).toBeInTheDocument();
  });

  test("shows loading state", () => {
    mockUseOrdersHook.default.mockImplementationOnce(() => ({
      orders: [],
      loading: true,
      error: null,
      updateOrderStatus: jest.fn(),
    }));
    render(<Orders />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("shows error state", () => {
    mockUseOrdersHook.default.mockImplementationOnce(() => ({
      orders: [],
      loading: false,
      error: "Something went wrong",
      updateOrderStatus: jest.fn(),
    }));
    render(<Orders />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  test("shows empty state", () => {
    mockUseOrdersHook.default.mockImplementationOnce(() => ({
      orders: [],
      loading: false,
      error: null,
      updateOrderStatus: jest.fn(),
    }));
    render(<Orders />);
    expect(screen.getByText(/no orders found/i)).toBeInTheDocument();
  });

  test("search filters results (case insensitive)", () => {
    render(<Orders />);
    fireEvent.change(screen.getByPlaceholderText("Search by user..."), {
      target: { value: "pauline" },
    });
    expect(screen.getByText("Pauline Mwihaki")).toBeInTheDocument();
    expect(screen.queryByText("Semhal Estifanos")).not.toBeInTheDocument();
    expect(screen.queryByText("Kisanet Sshay")).not.toBeInTheDocument();
  });

  test("filters by order_status (pending)", () => {
    render(<Orders />);
    fireEvent.click(screen.getByLabelText(/pending/i));
    expect(screen.getByText("Semhal Estifanos")).toBeInTheDocument();
    expect(screen.queryByText("Pauline Mwihaki")).not.toBeInTheDocument();
    expect(screen.queryByText("Kisanet Sshay")).not.toBeInTheDocument();
  });

  test("filters by date", () => {
    render(<Orders />);
    const calendar = screen.getByTestId("calendar");
    fireEvent.change(calendar, { target: { value: "2025-09-22" } });
    expect(screen.getByText("Pauline Mwihaki")).toBeInTheDocument();
    expect(screen.queryByText("Semhal Estifanos")).not.toBeInTheDocument();
    expect(screen.queryByText("Kisanet Sshay")).not.toBeInTheDocument();
  });

  test("pagination updates currentPage", async () => {
    mockUseOrdersHook.default.mockImplementationOnce(() => ({
      orders: Array.from({ length: 10 }, (_, i) => ({
        order_id: i + 1,
        user: 101,
        order_date: `2025-09-21`,
        total_amount: "100.00",
        order_status: i % 2 === 0 ? "pending" : "picked",
        payment_status: "completed",
        pin: `${1000 + i}`,
        created_at: `2025-09-21T${10 + i}:00:00Z`,
        updated_at: `2025-09-21T${10 + i}:00:00Z`,
        items: [
          { id: i + 1, quantity: 1, price: "100.00", listing: 201 }
        ],
      })),
      loading: false,
      error: null,
      updateOrderStatus: jest.fn(),
    }));
    render(<Orders />);
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByTestId("pagination")).toHaveAttribute("data-current-page", "2");
  });

  test("handles a situation where user is not found", () => {
    mockUseOrdersHook.default.mockImplementationOnce(() => ({
      orders: [
        {
          order_id: 4,
          user: 200,
          order_date: "2025-09-21",
          total_amount: "100.00",
          order_status: "pending",
          payment_status: "completed",
          pin: "22222",
          created_at: "2025-09-21T10:00:00Z",
          updated_at: "2025-09-21T10:00:00Z",
          items: [
            { id: 4, quantity: 1, price: "100.00", listing: 201 }
          ],
        },
      ],
      loading: false,
      error: null,
      updateOrderStatus: jest.fn(),
    }));
    render(<Orders />);
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row").slice(1);
    const buyerCell = rows[0].querySelector("td");
    expect(buyerCell?.textContent?.trim()).toBe("");
  });

  test("handles missing pin gracefully", () => {
    mockUseOrdersHook.default.mockImplementationOnce(() => ({
      orders: [
        {
          order_id: 5,
          user: 101,
          order_date: "2025-09-21",
          total_amount: "100.00",
          order_status: "pending",
          payment_status: "completed",
          pin: null,
          created_at: "2025-09-21T10:00:00Z",
          updated_at: "2025-09-21T10:00:00Z",
          items: [
            { id: 5, quantity: 1, price: "100.00", listing: 201 }
          ],
        },
      ],
      loading: false,
      error: null,
      updateOrderStatus: jest.fn(),
    }));
    render(<Orders />);
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  test("updates status when dropdown option is selected", async () => {
    const mockUpdateStatus = jest.fn();
    mockUseOrdersHook.default.mockImplementationOnce(() => ({
      orders: [
        {
          order_id: 1,
          user: 101,
          order_date: "2025-09-21",
          total_amount: "100.00",
          order_status: "pending",
          payment_status: "completed",
          pin: "12345",
          created_at: "2025-09-21T10:00:00Z",
          updated_at: "2025-09-21T10:00:00Z",
          items: [
            { id: 1, quantity: 1, price: "100.00", listing: 201 }
          ],
        }
      ],
      loading: false,
      error: null,
      updateOrderStatus: mockUpdateStatus,
    }));
    render(<Orders />);
    const statusSelect = screen.getByText("Pending");
    fireEvent.click(statusSelect);
    const pickedOption = screen.getByText("Picked");
    fireEvent.click(pickedOption);
    await waitFor(() => {
      expect(mockUpdateStatus).toHaveBeenCalledWith(1, "picked");
    });
  });
});