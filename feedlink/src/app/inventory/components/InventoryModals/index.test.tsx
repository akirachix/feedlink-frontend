import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InventoryModals from '../InventoryModals';
import { Listing } from '../../../utils/types';

jest.mock('../AddItem', () => {
  return ({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) => (
    <div data-testid="add-item-mock">
      <button onClick={onSuccess}>Mock Add Success</button>
      <button onClick={onCancel}>Mock Add Cancel</button>
    </div>
  );
});

jest.mock('../Csv', () => {
  return ({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) => (
    <div data-testid="csv-mock">
      <button onClick={onSuccess}>Mock CSV Success</button>
      <button onClick={onCancel}>Mock CSV Cancel</button>
    </div>
  );
});

interface InventoryDetailFormProps {
  selectedItem: Listing | null;
  editError: string | null;
  editLoading: boolean;
  handleUpdate: () => void;
  openDeleteConfirmModal: () => void;
  closeDetailModal: () => void;
}

jest.mock('../InventoryDetailForm', () => {
  return ({
    selectedItem,
    editError,
    editLoading,
    handleUpdate,
    openDeleteConfirmModal,
    closeDetailModal,
  }: InventoryDetailFormProps) => (
    <div data-testid="detail-form-mock">
      <p>Editing: {selectedItem?.product_type || 'N/A'}</p>
      {editError && <p role="alert">{editError}</p>}
      <button onClick={handleUpdate} disabled={editLoading}>
        {editLoading ? 'Saving...' : 'Save'}
      </button>
      <button onClick={openDeleteConfirmModal}>Delete</button>
      <button onClick={closeDetailModal}>Close</button>
    </div>
  );
});

const mockListing: Listing = {
  listing_id: 1,
  product_type: 'edible',
  quantity: '10',
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
  title: 'Fresh Apples',
};

describe('InventoryModals', () => {
  const mockCloseModal = jest.fn();
  const mockSetModalContent = jest.fn();
  const mockOpenModal = jest.fn();
  const mockHandleDetailChange = jest.fn();
  const mockHandleUpdate = jest.fn();
  const mockConfirmDelete = jest.fn();
  const mockRefresh = jest.fn();
  const mockOnSuccess = jest.fn();

  const defaultProps = {
    modalContent: null as string | null,
    closeModal: mockCloseModal,
    setModalContent: mockSetModalContent,
    openModal: mockOpenModal,
    selectedItem: null as Listing | null,
    editError: null as string | null,
    editLoading: false,
    handleDetailChange: mockHandleDetailChange, 
    handleUpdate: mockHandleUpdate,
    confirmDelete: mockConfirmDelete,
    refresh: mockRefresh,
    onSuccess: mockOnSuccess,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when modalContent is null', () => {
    const { container } = render(<InventoryModals {...defaultProps} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders upload method modal and switches to manual/csv', () => {
    render(<InventoryModals {...defaultProps} modalContent="uploadMethod" />);

    expect(screen.getByText('Choose upload method')).toBeInTheDocument();
    const manualBtn = screen.getByText('Manually');
    const csvBtn = screen.getByText('CSV file');

    fireEvent.click(manualBtn);
    expect(mockSetModalContent).toHaveBeenCalledWith('manual');

    fireEvent.click(csvBtn);
    expect(mockSetModalContent).toHaveBeenCalledWith('csv');

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('renders manual upload modal with AddItem', () => {
    render(<InventoryModals {...defaultProps} modalContent="manual" />);

    expect(screen.getByTestId('add-item-mock')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Mock Add Success'));
    expect(mockOnSuccess).toHaveBeenCalledWith('Product uploaded successfully!');
    expect(mockCloseModal).toHaveBeenCalled();
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('renders CSV upload modal with Csv', () => {
    render(<InventoryModals {...defaultProps} modalContent="csv" />);

    expect(screen.getByTestId('csv-mock')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Mock CSV Success'));
    expect(mockOnSuccess).toHaveBeenCalledWith('Products uploaded successfully via CSV!');
    expect(mockCloseModal).toHaveBeenCalled();
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('renders detail modal with InventoryDetailForm when selectedItem exists', () => {
    render(
      <InventoryModals
        {...defaultProps}
        modalContent="detail"
        selectedItem={mockListing}
      />
    );

    expect(screen.getByTestId('detail-form-mock')).toBeInTheDocument();
    expect(screen.getByText('Editing: edible')).toBeInTheDocument();
  });

  it('renders nothing for detail modal when selectedItem is null', () => {
    const { container } = render(
      <InventoryModals {...defaultProps} modalContent="detail" selectedItem={null} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('opens confirmDelete modal from detail form', () => {
    render(
      <InventoryModals
        {...defaultProps}
        modalContent="detail"
        selectedItem={mockListing}
      />
    );

    fireEvent.click(screen.getByText('Delete'));
    expect(mockSetModalContent).toHaveBeenCalledWith('confirmDelete');
    expect(mockOpenModal).toHaveBeenCalled();
  });

  it('renders confirm delete modal with item name', () => {
    render(
      <InventoryModals
        {...defaultProps}
        modalContent="confirmDelete"
        selectedItem={mockListing}
      />
    );
  
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
  
    const paragraph = screen.getByText(/Are you sure/).closest('p');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph?.textContent).toMatch(/Are you sure you want to delete 'edible'\?/);
  
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockCloseModal).toHaveBeenCalled();
  
    fireEvent.click(screen.getByText('Delete'));
    expect(mockConfirmDelete).toHaveBeenCalled();
  });
});