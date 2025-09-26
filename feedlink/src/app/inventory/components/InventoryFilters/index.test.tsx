import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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
    const { getByPlaceholderText, getByText, getByTitle } = render(<InventoryFilters {...defaultProps} />);
    expect(getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(getByText('Select category')).toBeInTheDocument();
    expect(getByText('All status')).toBeInTheDocument();
    expect(getByTitle('Filter by upload date')).toBeInTheDocument();
    expect(getByText('Upload')).toBeInTheDocument();
  });

  it('updates search term when typing', () => {
    const { getByPlaceholderText } = render(<InventoryFilters {...defaultProps} />);
    const input = getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'apples' } });
    expect(mockSetSearchTerm).toHaveBeenCalledWith('apples');
  });

  it('opens and selects a category from CustomSelect', async () => {
    const { getByText, findByText } = render(<InventoryFilters {...defaultProps} />);
    fireEvent.click(getByText('Select category'));
    const option = await findByText('Fruits');
    fireEvent.click(option);
    expect(mockSetCategoryFilter).toHaveBeenCalledWith('Fruits');
  });

  it('opens and selects a status from CustomSelect', async () => {
    const { getByText, findByText } = render(<InventoryFilters {...defaultProps} />);
    fireEvent.click(getByText('All status'));
    const option = await findByText('Expired');
    fireEvent.click(option);
    expect(mockSetStatusFilter).toHaveBeenCalledWith('expired');
  });

  it('updates upload date when date is selected', () => {
    const { getByTitle } = render(<InventoryFilters {...defaultProps} />);
    const dateInput = getByTitle('Filter by upload date');
    fireEvent.change(dateInput, { target: { value: '2024-06-15' } });
    expect(mockSetUploadDateFilter).toHaveBeenCalledWith('2024-06-15');
  });

  it('calls onUploadClick when Upload button is clicked', () => {
    const { getByText } = render(<InventoryFilters {...defaultProps} />);
    fireEvent.click(getByText('Upload'));
    expect(mockOnUploadClick).toHaveBeenCalled();
  });

  it('closes CustomSelect when clicking outside', async () => {
    const { getByText, findByText, queryByText } = render(<InventoryFilters {...defaultProps} />);
    fireEvent.click(getByText('Select category'));
    await findByText('Fruits');
    fireEvent.mouseDown(document.body);
    expect(queryByText('Fruits')).not.toBeInTheDocument();
  });
});