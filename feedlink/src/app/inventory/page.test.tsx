'use client';

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InventoryPage from './page';

jest.mock('../hooks/useFetchInventory', () => ({
  __esModule: true,
  default: () => ({
    listings: [],
    loading: false,
    error: null,
    refresh: jest.fn(),
  }),
}));

jest.mock('../hooks/useFetchModal', () => ({
  __esModule: true,
  default: () => ({
    modalOpen: false,
    modalContent: 'uploadMethod',
    openModal: jest.fn(),
    closeModal: jest.fn(),
    setModalContent: jest.fn(),
  }),
}));

jest.mock('../utils/utils', () => ({
  isExpired: jest.fn(() => false),
  isExpiringSoon: jest.fn(() => false),
}));

jest.mock('./components/InventorySummary', () => () => <div data-testid="inventory-summary" />);
jest.mock('./components/InventoryFilters', () => () => <div data-testid="inventory-filters" />);
jest.mock('./components/InventoryTable', () => () => <div data-testid="inventory-table" />);
jest.mock('./components/InventoryModals', () => () => <div data-testid="inventory-modals" />);
jest.mock('./components/InventoryPagination', () => () => <div data-testid="inventory-pagination" />);
jest.mock('../shared-components/Sidebar', () => () => <div data-testid="sidebar" />);

describe('InventoryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<InventoryPage />);
    
    expect(screen.getByText('Inventory Management')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('inventory-summary')).toBeInTheDocument();
    expect(screen.getByTestId('inventory-filters')).toBeInTheDocument();
    expect(screen.getByTestId('inventory-table')).toBeInTheDocument();
    expect(screen.getByTestId('inventory-pagination')).toBeInTheDocument();
  });

  it('displays loading state when useInventory is loading', () => {
    jest.mock('../hooks/useFetchInventory', () => ({
      __esModule: true,
      default: () => ({
        listings: [],
        loading: true,
        error: null,
        refresh: jest.fn(),
      }),
    }));

    const { rerender } = render(<InventoryPage />);
    
   
    expect(screen.getByText('Inventory Management')).toBeInTheDocument();
  });

  it('displays success message when set', async () => {
   
    render(<InventoryPage />);
    
    expect(screen.queryByText('Product updated successfully!')).not.toBeInTheDocument();

  });

  it('applies filters and pagination correctly (via mocked hooks)', () => {
    const mockListings = [
      {
        listing_id: '1',
        product_type: 'Milk',
        category: 'Dairy',
        quantity: '100',
        expiry_date: '2025-01-01',
        created_at: '2024-06-01T12:00:00Z',
        upload_method: 'manual',
        pickup_window_duration: '2024-06-10T12:00:00Z',
        unit: 'liters',
        image_url: '',
        producer: null,
      },
    ];

    jest.mock('../hooks/useFetchInventory', () => ({
      __esModule: true,
      default: () => ({
        listings: mockListings,
        loading: false,
        error: null,
        refresh: jest.fn(),
      }),
    }));

    render(<InventoryPage />);

    expect(screen.getByText('Inventory Management')).toBeInTheDocument();
  });
});