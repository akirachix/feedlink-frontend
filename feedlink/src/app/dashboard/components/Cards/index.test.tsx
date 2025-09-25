import React from "react";
import { render, screen } from "@testing-library/react";
import MetricCard from ".";
import { Order, WasteClaim, Listing} from '../../../utils/types/index';

describe("MetricCard Component", () => {
  const sampleOrders: Order[] = [
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
    {
      order_id: 2,
      items: [
        { quantity: 15, price: "20", listing: 103 },
      ],
      user: 2,
      order_date: "2025-09-02",
      total_amount: "300",
      created_at: "2025-09-02T12:00:00Z",
    },
  ];

  const sampleListings: Listing[] = [
    { listing_id: 101, title: "Listing 1", quantity: "20", unit: "kg" },
    { listing_id: 102, title: "Listing 2", quantity: "30", unit: "kg" },
  ];

  const sampleWasteClaims: WasteClaim[] = [
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
    {
      waste_id: 2,
      listing_id: 102,
      user: 2,
      claim_status: "approved",
      pin: "5678",
      created_at: "2025-09-02T15:00:00Z",
      updated_at: "2025-09-02T15:30:00Z",
      claim_time: "2025-09-02T15:05:00Z",
    },
  ];

  test("displays Total food diverted (KGS) correctly", () => {
    render(
      <MetricCard
        title="Total food diverted (KGS)"
        orders={sampleOrders}
        wasteClaims={sampleWasteClaims}
        listings={sampleListings}
        trend="+5%"
        isFirst={true}
      />
    );

    expect(screen.getByText("Total food diverted (KGS)")).toBeInTheDocument();
    expect(screen.getByText("80")).toBeInTheDocument();
    expect(screen.getByText("+5%")).toBeInTheDocument();
  });

  test("displays Revenue recovered (KSH) correctly", () => {
    render(
      <MetricCard
        title="Revenue recovered (KSH)"
        orders={sampleOrders}
        wasteClaims={[]}
        listings={[]}
        trend=""
        isFirst={false}
      />
    );

    expect(screen.getByText("Revenue recovered (KSH)")).toBeInTheDocument();
    expect(screen.getByText("550")).toBeInTheDocument();
  });

  test("displays Carbon emissions saved (T) correctly", () => {
    render(
      <MetricCard
        title="Carbon emissions saved (T)"
        orders={[]}
        wasteClaims={sampleWasteClaims}
        listings={sampleListings}
        trend=""
        isFirst={false}
      />
    );

    expect(screen.getByText("Carbon emissions saved (T)")).toBeInTheDocument();
    expect(screen.getByText("0.1")).toBeInTheDocument();
  });

  test("displays Recycling partners correctly", () => {
    render(
      <MetricCard
        title="Recycling partners"
        orders={[]}
        wasteClaims={sampleWasteClaims}
        listings={sampleListings}
        trend=""
        isFirst={false}
      />
    );

    expect(screen.getByText("Recycling partners")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
