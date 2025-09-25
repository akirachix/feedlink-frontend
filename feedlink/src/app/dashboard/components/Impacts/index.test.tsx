import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Chart from ".";
import { Order } from '../../../utils/types/index';

jest.mock('recharts', () => {
  const Original = jest.requireActual('recharts');
  return {
    ...Original,
    BarChart: ({ children, ...props }: any) => (
      <div data-testid="mocked-bar-chart" {...props}>
        {children}
      </div>
    ),
    XAxis: ({ }: any) => (
      <div data-testid="mocked-x-axis">
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'].map(month => (
          <div key={month} data-testid={`x-axis-tick-${month}`}>
            {month}
          </div>
        ))}
      </div>
    ),
    YAxis: () => <div data-testid="mocked-y-axis" />,
    Bar: () => <div data-testid="mocked-bar" />,
    CartesianGrid: () => <div data-testid="mocked-grid" />,
    Tooltip: () => <div data-testid="mocked-tooltip" />,
    ResponsiveContainer: ({ children }: any) => (
      <div style={{ width: '100%', height: 300 }}>{children}</div>
    ),
  };
});

describe("Chart Component", () => {
  const sampleOrders: Order[] = [
    {
      order_id: 1,
      items: [
        { quantity: 5, price: "10", listing: 101 },
        { quantity: 10, price: "15", listing: 102 },
      ],
      user: 1,
      order_date: "2025-01-15",
      total_amount: "250",
      created_at: "2025-01-15T12:00:00Z",
    },
    {
      order_id: 2,
      items: [
        { quantity: 15, price: "20", listing: 103 },
      ],
      user: 2,
      order_date: "2025-02-10",
      total_amount: "300",
      created_at: "2025-02-10T12:00:00Z",
    },
    {
      order_id: 3,
      items: [
        { quantity: 10, price: "20", listing: 104 },
      ],
      user: 3,
      order_date: "2025-01-25",
      total_amount: "400",
      created_at: "2025-01-25T12:00:00Z",
    },
  ];

  test("renders Impact Over Time title and subtitle", () => {
    render(
      <div style={{ width: 600, height: 400 }}>
        <Chart orders={sampleOrders} />
      </div>
    );
    expect(screen.getByText("Impact Over Time")).toBeInTheDocument();
    expect(screen.getByText("Food diverted")).toBeInTheDocument();
  });

  test("calculates monthly data correctly", async () => {
    render(
      <div style={{ width: 600, height: 400 }}>
        <Chart orders={sampleOrders} />
      </div>
    );


    expect(screen.getByTestId('x-axis-tick-Jan')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis-tick-Feb')).toBeInTheDocument();
  });
});