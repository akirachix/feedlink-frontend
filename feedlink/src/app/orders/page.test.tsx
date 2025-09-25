import { render, screen, fireEvent, within } from "@testing-library/react";
import Orders from "./page";

const mockOrdersHook = require("../hooks/useFetchOrders");

jest.mock("../hooks/useFetchOrders", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../hooks/useFetchUsers", () => ({
  __esModule: true,
  default: () => ({
    users: {
      1: "Semhal Estifanos",
      2: "Pauline Mwihaki",
      3: "Kisanet Sshay",
    },
    loading: false,
    error: null,
  }),
}));

jest.mock("../hooks/useFetchListing", () => ({
  __esModule: true,
  default: () => ({
    listings: {
      11: { listing_id: 11, category: "Fruits", quantity: "10" },
      12: { listing_id: 12, category: "Vegetables", quantity: "5" },
    },
    loading: false,
    error: null,
  }),
}));

jest.mock("../shared-components/Sidebar", () => () => <div data-testid="sidebar" />);
jest.mock("../component/Pagination", () => ({ currentPage, totalPages, onPageChange }: any) =>
  <div data-testid="pagination" data-current-page={currentPage} data-total-pages={totalPages} />
);
jest.mock("../component/Calendar", () => ({ selectedDate, setSelectedDate }: any) =>
  <input data-testid="calendar" value={selectedDate || ""} readOnly />
);

beforeEach(() => {
  mockOrdersHook.default.mockImplementation(() => ({
    orders: [
      {
        order_id: 1,
        user: 1,
        items: [{ listing: 11 }],
        total_amount: 100,
        order_date: "2025-09-21T10:00:00Z",
        order_status: "pending",
      },
      {
        order_id: 2,
        user: 2,
        items: [{ listing: 12 }],
        total_amount: 200,
        order_date: "2025-09-22T15:30:00Z",
        order_status: "picked",
      },
      {
        order_id: 3,
        user: 3,
        items: [{ listing: 11 }],
        total_amount: 50,
        order_date: "2025-09-21T10:00:00Z",
        order_status: "picked",
      },
    ],
    loading: false,
    error: null,
  }));
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Orders page", () => {
  test("renders totals and table by default", () => {
    render(<Orders />);
    expect(screen.getByText("Total customers")).toBeInTheDocument();
    expect(screen.getByText("Total orders")).toBeInTheDocument();

    const threes = screen.getAllByText("3");
    expect(threes.length).toBeGreaterThanOrEqual(2);
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

  test("filters by order_status (pending)", () => {
    render(<Orders />);
    fireEvent.click(screen.getByLabelText(/pending/i));
    expect(screen.getByText("Semhal Estifanos")).toBeInTheDocument();
    expect(screen.queryByText("Pauline Mwihaki")).not.toBeInTheDocument();
    expect(screen.queryByText("Kisanet Sshay")).not.toBeInTheDocument();
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

  test("shows loading state", () => {
    mockOrdersHook.default.mockImplementationOnce(() => ({
      orders: [],
      loading: true,
      error: null,
    }));
    render(<Orders />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("shows error state", () => {
    mockOrdersHook.default.mockImplementationOnce(() => ({
      orders: [],
      loading: false,
      error: "Something went wrong",
    }));
    render(<Orders />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  test("shows empty state", () => {
    mockOrdersHook.default.mockImplementationOnce(() => ({
      orders: [],
      loading: false,
      error: null,
    }));
    render(<Orders />);
    expect(screen.getByText(/no orders found/i)).toBeInTheDocument();
  });

  test("shows empty cell for missing listing", () => {
    mockOrdersHook.default.mockImplementationOnce(() => ({
      orders: [
        {
          order_id: 5,
          user: 1,
          items: [{ listing: 999 }],
          total_amount: 80,
          order_date: "2025-09-21T10:00:00Z",
          order_status: "pending",
        },
      ],
      loading: false,
      error: null,
    }));
    render(<Orders />);

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row").slice(1);
    const categoryCell = rows[0].querySelectorAll("td")[1];
    expect(categoryCell.textContent?.trim()).toBe("");
  });

  test("status badge displays correct class for each status", () => {
    render(<Orders />);
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row").slice(1);
    rows.forEach((row) => {
      const statusCell = row.querySelector("td:last-child");
      if (!statusCell) return;
      const badge = statusCell.querySelector("span");
      if (!badge) return;
      const statusText = badge.textContent?.trim();
      if (statusText === "picked") {
        expect(badge.className).toMatch(/bg-\[var\(--primary-color\)\]/);
      } else if (statusText === "pending") {
        expect(badge.className).toMatch(/bg-\[var\(--secondary-color\)\]/);
      }
    });
  });

  test("handles user not found situation and renders an empty cell", () => {
    mockOrdersHook.default.mockImplementationOnce(() => ({
      orders: [
        {
          order_id: 6,
          user: 999,
          items: [{ listing: 11 }],
          total_amount: 80,
          order_date: "2025-09-21T10:00:00Z",
          order_status: "pending",
        },
      ],
      loading: false,
      error: null,
    }));
    render(<Orders />);
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row").slice(1);
    const buyerCell = rows[0].querySelector("td");
    expect(buyerCell?.textContent?.trim()).toBe("");
  });
});