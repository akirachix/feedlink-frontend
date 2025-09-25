import React from "react";
import { render, screen } from "@testing-library/react";
import Dashboard from "./page";
import * as useOrdersModule from '../hooks/useFetchOrders';
import * as useClaimsModule from '../hooks/useFetchClaims';
import * as useListingsModule from '../hooks/useFetchListings';
import { Order, WasteClaim, Listing } from '../utils/types';


jest.mock('../hooks/useFetchOrders');
jest.mock('../hooks/useFetchClaims');
jest.mock('../hooks/useFetchListings');

describe("Dashboard Component", () => {
  afterEach(() => {
    jest.resetAllMocks(); 
  });

  test("renders loading state initially", () => {
    jest.spyOn(useOrdersModule, 'useOrders').mockReturnValue({
      orders: [] as Order[],
      loading: true,
      error: undefined,
    });

    jest.spyOn(useClaimsModule, 'useWasteClaims').mockReturnValue({
      wasteClaims: [] as WasteClaim[],
      loading: true,
      error: undefined,
    });

    jest.spyOn(useListingsModule, 'useListings').mockReturnValue({
      listings: [] as Listing[],
      loading: true,
      error: undefined,
    });

    render(<Dashboard />);

    expect(screen.getByText("Loading dashboard...")).toBeInTheDocument();
  });

  test("renders dashboard main content when data available", () => {
    const mockOrders: Order[] = [
      {
        order_id: 1,
        items: [
          { quantity: 5, price: "10", listing: 101 },
          { quantity: 10, price: "15", listing: 102 },
        ],
        user: 1,
        order_date: "2025-09-01",
        total_amount: "250",
        created_at: "2025-09-01T12:00:00Z",
      },
    ];

    const mockWasteClaims: WasteClaim[] = [
      {
        waste_id: 1,
        listing_id: 101,
        user: 1,
        claim_status: "approved",
        pin: "1234",
        created_at: "2025-09-01T15:00:00Z",
        updated_at: "2025-09-01T15:30:00Z",
        claim_time: "2025-09-01T15:05:00Z",
      },
    ];

    const mockListings: Listing[] = [
      { listing_id: 101, title: "Listing 1", quantity: "20", unit: "kg" },
    ];

    jest.spyOn(useOrdersModule, 'useOrders').mockReturnValue({
      orders: mockOrders,
      loading: false,
      error: undefined,
    });

    jest.spyOn(useClaimsModule, 'useWasteClaims').mockReturnValue({
      wasteClaims: mockWasteClaims,
      loading: false,
      error: undefined,
    });

    jest.spyOn(useListingsModule, 'useListings').mockReturnValue({
      listings: mockListings,
      loading: false,
      error: undefined,
    });

    render(<Dashboard />);

    expect(screen.getByText("Dashboard Overview")).toBeInTheDocument();
    expect(screen.getByText("Welcome Back !!!")).toBeInTheDocument();
    expect(screen.getByText("Total food diverted (KGS)")).toBeInTheDocument();
    expect(screen.getByText("Revenue recovered (KSH)")).toBeInTheDocument();
    expect(screen.getByText("Carbon emissions saved (T)")).toBeInTheDocument();
    expect(screen.getByText("Recycling partners")).toBeInTheDocument();
    expect(screen.getByText("Impact Over Time")).toBeInTheDocument();
    expect(screen.getByText("Sustainability badges")).toBeInTheDocument();
    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });
});
