import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from './page';

interface Order {
  id: number;
  amount: number;
  
}

interface WasteClaim {
  id: number;
  kg: number;
}

interface Listing {
  id: number;
  status: string;
}

jest.mock('../shared-components/Sidebar', () => () => <div data-testid="sidebar">Sidebar</div>);

jest.mock('./components/Cards', () => ({ title, trend }: { title: string; trend: string }) => (
  <div data-testid="metric-card">
    <h3>{title}</h3>
    <p>{trend}</p>
  </div>
));

jest.mock('./components/Impacts', () => ({ orders }: { orders: Order[] }) => (
  <div data-testid="chart">Chart with {orders.length} orders</div>
));

jest.mock('./components/Badges', () => ({
  orders,
  wasteClaims,
  listings,
}: {
  orders: Order[];
  wasteClaims: WasteClaim[];
  listings: Listing[];
}) => (
  <div data-testid="badges">
    Badges: {orders.length} orders, {wasteClaims.length} claims, {listings.length} listings
  </div>
));

jest.mock('../hooks/useFetchOrders');
jest.mock('../hooks/useFetchClaims');
jest.mock('../hooks/useFetchListings');

const mockUseOrders = require('../hooks/useFetchOrders').useOrders;
const mockUseWasteClaims = require('../hooks/useFetchClaims').useWasteClaims;
const mockUseListings = require('../hooks/useFetchListings').useListings;

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state when any hook is loading', () => {
    mockUseOrders.mockReturnValue({ orders: null, loading: true });
    mockUseWasteClaims.mockReturnValue({ wasteClaims: null, loading: false });
    mockUseListings.mockReturnValue({ listings: null, loading: false });

    render(<Dashboard />);

    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
  });

  it('renders nothing if data is missing after loading', () => {
    mockUseOrders.mockReturnValue({ orders: null, loading: false });
    mockUseWasteClaims.mockReturnValue({ wasteClaims: null, loading: false });
    mockUseListings.mockReturnValue({ listings: null, loading: false });

    const { container } = render(<Dashboard />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders dashboard content when all data is loaded', async () => {
    const mockOrders: Order[] = [{ id: 1, amount: 10 }];
    const mockClaims: WasteClaim[] = [{ id: 1, kg: 5 }];
    const mockListings: Listing[] = [{ id: 1, status: 'active' }];

    mockUseOrders.mockReturnValue({ orders: mockOrders, loading: false });
    mockUseWasteClaims.mockReturnValue({ wasteClaims: mockClaims, loading: false });
    mockUseListings.mockReturnValue({ listings: mockListings, loading: false });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
    });

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();

    const metricCards = screen.getAllByTestId('metric-card');
    expect(metricCards).toHaveLength(4);

    expect(screen.getByText('Total food diverted (KGS)')).toBeInTheDocument();
    expect(screen.getByText('Revenue recovered (KSH)')).toBeInTheDocument();
    expect(screen.getByText('Carbon emissions saved (T)')).toBeInTheDocument();
    expect(screen.getByText('Recycling partners')).toBeInTheDocument();

    expect(screen.getByText('Every kg feeds hope')).toBeInTheDocument();
    expect(screen.getByText('Funding sustainability')).toBeInTheDocument();

    expect(screen.getByTestId('chart')).toBeInTheDocument();
    expect(screen.getByTestId('badges')).toBeInTheDocument();
  });

  it('handles partial loading correctly (e.g., only orders loading)', () => {
    mockUseOrders.mockReturnValue({ orders: null, loading: true });
    mockUseWasteClaims.mockReturnValue({ wasteClaims: [], loading: false });
    mockUseListings.mockReturnValue({ listings: [], loading: false });

    render(<Dashboard />);

    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
  });
});
