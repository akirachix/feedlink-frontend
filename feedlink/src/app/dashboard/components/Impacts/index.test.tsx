import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Chart from './';
import { Order } from '../../../utils/types/index';
import React from 'react';

interface ResponsiveContainerProps {
  children: React.ReactNode;
}

interface BarChartProps {
  children: React.ReactNode;
  data: ChartDataPoint[];
}

interface BarProps {
  dataKey: string;
}

interface XAxisProps {
  dataKey: string;
}

interface ChartDataPoint {
  month: string;
  weight: number;
  revenue: number;
}

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: ResponsiveContainerProps) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    BarChart: ({ children, data }: BarChartProps) => (
      <div data-testid="bar-chart" data-chart-data={JSON.stringify(data)}>
        {children}
      </div>
    ),
    Bar: ({ dataKey }: BarProps) => <div data-testid={`bar-${dataKey}`}></div>,
    XAxis: ({ dataKey }: XAxisProps) => <div data-testid="x-axis" data-key={dataKey}></div>,
    YAxis: () => <div data-testid="y-axis"></div>,
    CartesianGrid: () => <div data-testid="cartesian-grid"></div>,
    Tooltip: () => <div data-testid="tooltip"></div>,
  };
});

describe('Chart Component', () => {
  const mockOrders: Order[] = [
    {
      order_id: '1',
      user: 101,
      order_date: '2024-01-15',
      total_amount: '100.00',
      created_at: '2024-01-15T10:00:00Z',
      order_status: 'completed',
      items: [{ id: 1, quantity: 10, price: '10.00', listing: 1001 }],
    },
    {
      order_id: '2',
      user: 102,
      order_date: '2024-02-20',
      total_amount: '200.00',
      created_at: '2024-02-20T11:00:00Z',
      order_status: 'completed',
      items: [
        { id: 2, quantity: 15, price: '12.00', listing: 1002 },
        { id: 3, quantity: 5, price: '4.00', listing: 1003 },
      ],
    },
    {
      order_id: '3',
      user: 103,
      order_date: '2024-12-01',
      total_amount: '50.00',
      created_at: '2024-12-01T09:00:00Z',
      order_status: 'completed',
      items: [{ id: 4, quantity: 8, price: '6.25', listing: 1004 }],
    },
  ];

  it('renders without crashing', () => {
    render(<Chart orders={[]} />);
    expect(screen.getByText('Impact Over Time')).toBeInTheDocument();
    expect(screen.getByText('Food diverted')).toBeInTheDocument();
  });

  it('calculates monthly data correctly', () => {
    render(<Chart orders={mockOrders} />);

    const chartElement = screen.getByTestId('bar-chart');
    const chartData: ChartDataPoint[] = JSON.parse(
      chartElement.getAttribute('data-chart-data') || '[]'
    );

    expect(chartData).toHaveLength(12);

    expect(chartData[0]).toEqual(expect.objectContaining({ month: 'Jan', weight: 10, revenue: 100 }));
    expect(chartData[1]).toEqual(expect.objectContaining({ month: 'Feb', weight: 20, revenue: 200 }));
    expect(chartData[11]).toEqual(expect.objectContaining({ month: 'Dec', weight: 8, revenue: 50 }));
    expect(chartData[3]).toEqual(expect.objectContaining({ month: 'Apr', weight: 0, revenue: 0 }));
  });

  it('renders 12 months in correct order', () => {
    render(<Chart orders={mockOrders} />);
    const chartElement = screen.getByTestId('bar-chart');
    const chartData: ChartDataPoint[] = JSON.parse(
      chartElement.getAttribute('data-chart-data') || '[]'
    );
    expect(chartData.map((d) => d.month)).toEqual([
      'Jan', 'Feb', 'Mar', 'Apr',
      'May', 'Jun', 'Jul', 'Aug',
      'Sept', 'Oct', 'Nov', 'Dec'
    ]);
  });

  it('displays the weight bar', () => {
    render(<Chart orders={mockOrders} />);
    expect(screen.getByTestId('bar-weight')).toBeInTheDocument();
  });

  it('handles orders with missing or non-array items', () => {
    const badOrder1 = {
      order_id: '5',
      user: 105,
      order_date: '2024-03-10',
      total_amount: '50',
      created_at: '2024-03-10T00:00:00Z',
      order_status: 'completed',
      items: null,
    } as unknown as Order;

    const badOrder2 = {
      order_id: '6',
      user: 106,
      order_date: '2024-04-10',
      total_amount: '60',
      created_at: '2024-04-10T00:00:00Z',
      order_status: 'completed',
      items: 'not an array',
    } as unknown as Order;

    render(<Chart orders={[badOrder1, badOrder2]} />);

    const chartElement = screen.getByTestId('bar-chart');
    const chartData: ChartDataPoint[] = JSON.parse(
      chartElement.getAttribute('data-chart-data') || '[]'
    );

    expect(chartData[2].weight).toBe(0);
    expect(chartData[3].weight).toBe(0);
    expect(chartData[2].revenue).toBe(50);
    expect(chartData[3].revenue).toBe(60);
  });
});
