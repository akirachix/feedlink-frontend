import React from "react";
import { render, screen } from "@testing-library/react";
import Badges from ".";
import { Order, WasteClaim, Listing } from '../../../utils/types/index';

describe("Badges Component", () => {
  const sampleOrders: Order[] = [
    {
      order_id: 1,
      items: [
        { id: 1, quantity: 5, price: "10", listing: 101 },
        { id: 2, quantity: 10, price: "15", listing: 102 },
      ],
      user: 1,
      order_date: "2025-09-01",
      total_amount: "250",
      created_at: "2025-09-01T12:00:00Z",
      order_status: "picked",
    },
    {
      order_id: 2,
      items: [
        { id: 3, quantity: 15, price: "20", listing: 103 },
      ],
      user: 2,
      order_date: "2025-09-02",
      total_amount: "300",
      created_at: "2025-09-02T12:00:00Z",
      order_status: "pending",
    },
  ];

  const sampleListings: Listing[] = [
    {
      listing_id: 1,
      title: "Listing 1",
      quantity: "20",
      unit: "kg",
      product_type: "food",
      category: "produce",
      description: "Test listing",
      original_price: null,
      expiry_date: null,
      discounted_price: null,
      image: null,
      image_url: "",
      status: "active",
      created_at: "2025-09-01T10:00:00Z",
      updated_at: "2025-09-01T10:00:00Z",
      upload_method: "manual",
      pickup_window_duration: "2h",
      producer: 1,
    },
    {
      listing_id: 2,
      title: "Listing 2",
      quantity: "30",
      unit: "kg",
      product_type: "food",
      category: "dairy",
      description: "Another test listing",
      original_price: null,
      expiry_date: null,
      discounted_price: null,
      image: null,
      image_url: "",
      status: "active",
      created_at: "2025-09-01T10:00:00Z",
      updated_at: "2025-09-01T10:00:00Z",
      upload_method: "manual",
      pickup_window_duration: "2h",
      producer: 2,
    },
  ];

  const sampleWasteClaims: WasteClaim[] = [
    { waste_id: 1, listing_id: 1, user: 1, claim_status: "approved", pin: "1234", created_at: "2025-09-01T15:00:00Z", updated_at: "2025-09-01T15:30:00Z", claim_time: "2025-09-01T15:05:00Z" },
    { waste_id: 2, listing_id: 2, user: 2, claim_status: "approved", pin: "5678", created_at: "2025-09-02T15:00:00Z", updated_at: "2025-09-02T15:30:00Z", claim_time: "2025-09-02T15:05:00Z" },
    { waste_id: 3, listing_id: 1, user: 1, claim_status: "pending", pin: "0000", created_at: "2025-09-03T15:00:00Z", updated_at: "2025-09-03T15:30:00Z", claim_time: "2025-09-03T15:05:00Z" },
  ];

  test("renders all badges with correct titles", () => {
    render(<Badges orders={sampleOrders} wasteClaims={sampleWasteClaims} listings={sampleListings} />);
    expect(screen.getByText("Landfill Hero")).toBeInTheDocument();
    expect(screen.getByText("Hunger Hero")).toBeInTheDocument();
    expect(screen.getByText("Planet Hero")).toBeInTheDocument();
    expect(screen.getByText("Recycling Hero")).toBeInTheDocument();
  });

  test("calculates foodFromOrders correctly", () => {
    render(<Badges orders={sampleOrders} wasteClaims={[]} listings={[]} />);
    expect(screen.getByText(/30\s*\/\s*10,000\s*kg/i)).toBeInTheDocument();
    expect(screen.getByText(/30\s*\/\s*2,500\s*kg/i)).toBeInTheDocument();
  });

  test("calculates foodFromWaste correctly", () => {
    render(<Badges orders={[]} wasteClaims={sampleWasteClaims} listings={sampleListings} />);
    expect(screen.getByText(/70\s*\/\s*10,000\s*kg/i)).toBeInTheDocument();
  });

  test("shows tick and pulse animation if badge achieved", () => {
    const highOrders: Order[] = [
      {
        order_id: 1,
        items: [{ id: 4, quantity: 20000, price: "100", listing: 1 }],
        user: 1,
        order_date: "2025-09-23",
        total_amount: "2000000",
        created_at: "2025-09-23T12:00:00Z",
        order_status: "picked",
      }
    ];
    render(<Badges orders={highOrders} wasteClaims={[]} listings={[]} />);
    
    expect(screen.getByText(/20,000\s*\/\s*10,000\s*kg/i)).toBeInTheDocument();
    expect(screen.getByText(/20,000\s*\/\s*2,500\s*kg/i)).toBeInTheDocument();
    
    expect(screen.getByText("Landfill Hero")).toBeInTheDocument();
    expect(screen.getByText("Hunger Hero")).toBeInTheDocument();
  });
});