import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InventoryFilters from './index';

describe('InventoryFilters', () => {
  const mockSetSearchTerm = jest.fn();
  const mockSetCategoryFilter = jest.fn();
  const mockSetStatusFilter = jest.fn();
  const mockSetUploadDateFilter = jest.fn();
  const mockOnUploadClick = jest.fn();

  const defaultProps = {
    searchTerm: '',
    setSearchTerm: mockSetSearchTerm,
    categoryFilter: '',
    setCategoryFilter: mockSetCategoryFilter,
    statusFilter: 'All',
    setStatusFilter: mockSetStatusFilter,
    uploadDateFilter: '',
    setUploadDateFilter: mockSetUploadDateFilter,
    categoryOptions: ['Fruits', 'Vegetables', 'Dairy'],
    onUploadClick: mockOnUploadClick,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all filter controls', () => {
    render(<InventoryFilters {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByText('Select category')).toBeInTheDocument();
    expect(screen.getByText('All status')).toBeInTheDocument();
    expect(screen.getByTitle('Filter by upload date')).toBeInTheDocument();
    expect(screen.getByText('Upload')).toBeInTheDocument();
  });

  it('updates search term when typing', () => {
    render(<InventoryFilters {...defaultProps} />);
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'apples' } });
    expect(mockSetSearchTerm).toHaveBeenCalledWith('apples');
  });

  it('opens and selects a category from CustomSelect', async () => {
    render(<InventoryFilters {...defaultProps} />);
    fireEvent.click(screen.getByText('Select category'));
    const option = await screen.findByText('Fruits');
    fireEvent.click(option);
    expect(mockSetCategoryFilter).toHaveBeenCalledWith('Fruits');
  });

  it('opens and selects a status from CustomSelect', async () => {
    render(<InventoryFilters {...defaultProps} />);
    fireEvent.click(screen.getByText('All status'));
    const option = await screen.findByText('Expired');
    fireEvent.click(option);
    expect(mockSetStatusFilter).toHaveBeenCalledWith('expired');
  });

  
  it('updates upload date when date is selected', () => {
    render(<InventoryFilters {...defaultProps} />);
    const dateInput = screen.getByTitle('Filter by upload date');
    fireEvent.change(dateInput, { target: { value: '2024-06-15' } });
    expect(mockSetUploadDateFilter).toHaveBeenCalledWith('2024-06-15');
  });

  it('calls onUploadClick when Upload button is clicked', () => {
    render(<InventoryFilters {...defaultProps} />);
    fireEvent.click(screen.getByText('Upload'));
    expect(mockOnUploadClick).toHaveBeenCalled();
  });

  it('closes CustomSelect when clicking outside', async () => {
    const { container } = render(<InventoryFilters {...defaultProps} />);
    fireEvent.click(screen.getByText('Select category'));
    await screen.findByText('Fruits');
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('Fruits')).not.toBeInTheDocument();
  });
});