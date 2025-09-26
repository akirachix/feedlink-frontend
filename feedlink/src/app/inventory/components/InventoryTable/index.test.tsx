import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InventoryTable from '../InventoryTable';
import { Listing } from '../../../utils/types';

jest.mock('../../../utils/utils', () => ({
  capitalizeFirstLetter: (str: string) => str?.charAt(0).toUpperCase() + str?.slice(1) || '',
}));

const mockOpenDetailModal = jest.fn();

const mockListings: Listing[] = [
  {
    listing_id: 1,
    product_type: 'edible',
    quantity: 10,
    category: 'Fruits',
    description: 'Fresh apples',
    original_price: '2.50',
    expiry_date: '2025-12-31',
    discounted_price: null,
    image: null,
    image_url: '',
    status: 'available',
    created_at: '2024-01-01',
    updated_at: '2024-01-02',
    upload_method: 'manual',
    pickup_window_duration: '2 hours',
    unit: 'kg',
    producer: 123,
  },
  {
    listing_id: 2,
    product_type: 'inedible',
    quantity: 5,
    category: 'Cleaning',
    description: 'Eco-friendly detergent',
    original_price: '8.00',
    expiry_date: '2024-06-01',
    discounted_price: '6.00',
    image: null,
    image_url: '',
    status: 'expired',
    created_at: '2024-01-01',
    updated_at: '2024-01-02',
    upload_method: 'csv',
    pickup_window_duration: '1 day',
    unit: 'bottle',
    producer: 456,
  },
];

describe('InventoryTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state when loading is true', () => {
    render(
      <InventoryTable
        loading={true}
        error={null}
        listings={[]}
        openDetailModal={mockOpenDetailModal}
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error message when error is present', () => {
    render(
      <InventoryTable
        loading={false}
        error="Failed to load"
        listings={[]}
        openDetailModal={mockOpenDetailModal}
      />
    );

    expect(screen.getByText('Failed to load listings.')).toBeInTheDocument();
  });

  it('shows empty state when no listings and not loading/error', () => {
    render(
      <InventoryTable
        loading={false}
        error={null}
        listings={[]}
        openDetailModal={mockOpenDetailModal}
      />
    );

    expect(screen.getByText('No items found.')).toBeInTheDocument();
  });

  it('renders table headers correctly', () => {
    render(
      <InventoryTable
        loading={false}
        error={null}
        listings={mockListings}
        openDetailModal={mockOpenDetailModal}
      />
    );

    expect(screen.getByText('Item')).toBeInTheDocument();
    expect(screen.getByText('Quantity')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Expiry')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders listing rows with correct data', () => {
    render(
      <InventoryTable
        loading={false}
        error={null}
        listings={mockListings}
        openDetailModal={mockOpenDetailModal}
      />
    );

    expect(screen.getByText('Edible')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Fruits')).toBeInTheDocument();
    expect(screen.getByText('12/31/2025')).toBeInTheDocument(); 

    expect(screen.getByText('Inedible')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Cleaning')).toBeInTheDocument();
  });

  it('applies correct status styling', () => {
    render(
      <InventoryTable
        loading={false}
        error={null}
        listings={mockListings}
        openDetailModal={mockOpenDetailModal}
      />
    );

    const availableBadge = screen.getByText('Available');
    expect(availableBadge).toHaveClass('bg-[#234B06]');
    expect(availableBadge).toHaveClass('text-white');

    const expiredBadge = screen.getByText('Expired');
    expect(expiredBadge).toHaveClass('bg-[#FF8614]');
    expect(expiredBadge).toHaveClass('text-white');
  });

  it('calls openDetailModal when a row is clicked', () => {
    render(
      <InventoryTable
        loading={false}
        error={null}
        listings={mockListings}
        openDetailModal={mockOpenDetailModal}
      />
    );

    const firstRow = screen.getByText('Edible').closest('tr');
    fireEvent.click(firstRow!);

    expect(mockOpenDetailModal).toHaveBeenCalledWith(mockListings[0]);
  });
});
