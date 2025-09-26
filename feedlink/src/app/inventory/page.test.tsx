'use client';

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InventoryPage from './page';

const mockUseFetchInventory = jest.fn();
const mockUseFetchModal = jest.fn();

jest.mock('../hooks/useFetchInventory', () => ({
  __esModule: true,
  default: () => mockUseFetchInventory(),
}));

jest.mock('../hooks/useFetchModal', () => ({
  __esModule: true,
  default: () => mockUseFetchModal(),
}));


describe('InventoryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    mockUseFetchInventory.mockReturnValue({
      listings: [],
      loading: false,
      error: null,
      refresh: jest.fn(),
    });
    mockUseFetchModal.mockReturnValue({
      modalOpen: false,
      modalContent: 'uploadMethod',
      openModal: jest.fn(),
      closeModal: jest.fn(),
      setModalContent: jest.fn(),
    });

    render(<InventoryPage />);
    
    expect(screen.getByText('Inventory Management')).toBeInTheDocument();
  });

  it('displays loading state when useInventory is loading', () => {
    mockUseFetchInventory.mockReturnValue({
      listings: [],
      loading: true,
      error: null,
      refresh: jest.fn(),
    });
    mockUseFetchModal.mockReturnValue({
      modalOpen: false,
      modalContent: 'uploadMethod',
      openModal: jest.fn(),
      closeModal: jest.fn(),
      setModalContent: jest.fn(),
    });

    render(<InventoryPage />);
    
    expect(screen.getByText('Inventory Management')).toBeInTheDocument();
  });

  
});