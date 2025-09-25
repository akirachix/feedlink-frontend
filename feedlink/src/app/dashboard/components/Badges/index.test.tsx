import React from "react";
import { render, screen } from "@testing-library/react";
import Badges from ".";
import { Order, WasteClaim, Listing } from '../../../utils/types/index';

describe("Badges Component", () => {
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
        { listing_id: 1, title: "Listing 1", quantity: "20", unit: "kg" },
        { listing_id: 2, title: "Listing 2", quantity: "30", unit: "kg" },
    ];

    const sampleWasteClaims: WasteClaim[] = [
        {
            waste_id: 1,
            listing_id: 1,
            user: 1,
            claim_status: "approved",
            pin: "1234",
            created_at: "2025-09-01T15:00:00Z",
            updated_at: "2025-09-01T15:30:00Z",
            claim_time: "2025-09-01T15:05:00Z",
        },
        {
            waste_id: 2,
            listing_id: 2,
            user: 2,
            claim_status: "approved",
            pin: "5678",
            created_at: "2025-09-02T15:00:00Z",
            updated_at: "2025-09-02T15:30:00Z",
            claim_time: "2025-09-02T15:05:00Z",
        },
        {
            waste_id: 3,
            listing_id: 1,
            user: 1,
            claim_status: "pending",
            pin: "0000",
            created_at: "2025-09-03T15:00:00Z",
            updated_at: "2025-09-03T15:30:00Z",
            claim_time: "2025-09-03T15:05:00Z",
        },
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
  expect(screen.getByText(/30\s*\/\s*10,000\s*kg/, { exact: false })).toBeInTheDocument();
  expect(screen.getByText(/30\s*\/\s*2,500\s*kg/, { exact: false })).toBeInTheDocument();

  expect(screen.queryAllByText(/30\s*\/\s*10,000\s*kg/).length).toBeGreaterThan(0);

});


test("calculates foodFromWaste and carbonSaved correctly", () => {
  render(<Badges orders={[]} wasteClaims={sampleWasteClaims} listings={sampleListings} />);
  const regexWaste = /70\s*\/\s*10,000\s*kg/;
  const regexCarbon = /0.175\s*\/\s*20\s*T/;
  

  expect(screen.queryAllByText(regexWaste).length).toBeGreaterThan(0);
  expect(screen.queryAllByText(regexCarbon).length).toBeGreaterThan(0);
});

test("shows tick and pulse animation if badge achieved", () => {
  const highOrders: Order[] = [
    {
      order_id: 1,
      items: [{ quantity: 20000, price: "100", listing: 1 }],
      user: 1,
      order_date: "2025-09-23",
      total_amount: "2000000",
      created_at: "2025-09-23T12:00:00Z"
    }
  ];
  render(<Badges orders={highOrders} wasteClaims={[]} listings={[]} />);

  const tickDivs = screen.getAllByTestId('check-icon');
expect(tickDivs[0].className).toMatch(/animate-pulse/);

});

});
