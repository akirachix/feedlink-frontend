import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InventoryPagination from '../InventoryPagination';

describe('InventoryPagination', () => {
  const mockSetPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when pageCount is 0', () => {
    const { container } = render(
      <InventoryPagination page={1} pageCount={0} setPage={mockSetPage} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('does not render when pageCount is 1', () => {
    const { container } = render(
      <InventoryPagination page={1} pageCount={1} setPage={mockSetPage} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders pagination when pageCount is greater than 1', () => {
    render(<InventoryPagination page={1} pageCount={3} setPage={mockSetPage} />);

    
    expect(screen.getByText('<')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('>')).toBeInTheDocument();
  });

  it('highlights the current page', () => {
    render(<InventoryPagination page={2} pageCount={3} setPage={mockSetPage} />);

    const currentPageBtn = screen.getByText('2');
    expect(currentPageBtn).toHaveClass('bg-[#234B06]');
    expect(currentPageBtn).toHaveClass('text-white');

    const otherPageBtn = screen.getByText('1');
    expect(otherPageBtn).not.toHaveClass('bg-[#234B06]');
    expect(otherPageBtn).toHaveClass('hover:bg-[#f0f5eb]');
  });

  it('disables "previous" button on first page', () => {
    render(<InventoryPagination page={1} pageCount={3} setPage={mockSetPage} />);

    const prevBtn = screen.getByText('<');
    expect(prevBtn).toBeDisabled();
  });

  it('enables "previous" button when not on first page', () => {
    render(<InventoryPagination page={2} pageCount={3} setPage={mockSetPage} />);

    const prevBtn = screen.getByText('<');
    expect(prevBtn).not.toBeDisabled();
    fireEvent.click(prevBtn);
    expect(mockSetPage).toHaveBeenCalledWith(1);
  });

  it('disables "next" button on last page', () => {
    render(<InventoryPagination page={3} pageCount={3} setPage={mockSetPage} />);

    const nextBtn = screen.getByText('>');
    expect(nextBtn).toBeDisabled();
  });

  it('enables "next" button when not on last page', () => {
    render(<InventoryPagination page={2} pageCount={3} setPage={mockSetPage} />);

    const nextBtn = screen.getByText('>');
    expect(nextBtn).not.toBeDisabled();
    fireEvent.click(nextBtn);
    expect(mockSetPage).toHaveBeenCalledWith(3);
  });

  it('calls setPage when a page number is clicked', () => {
    render(<InventoryPagination page={1} pageCount={5} setPage={mockSetPage} />);

    const page3Btn = screen.getByText('3');
    fireEvent.click(page3Btn);
    expect(mockSetPage).toHaveBeenCalledWith(3);
  });

  it('does not allow page to go below 1', () => {
    render(<InventoryPagination page={1} pageCount={3} setPage={mockSetPage} />);

    const prevBtn = screen.getByText('<');
    fireEvent.click(prevBtn); 
    expect(mockSetPage).not.toHaveBeenCalled(); 
  });

  it('does not allow page to exceed pageCount', () => {
    render(<InventoryPagination page={3} pageCount={3} setPage={mockSetPage} />);

    const nextBtn = screen.getByText('>');
    fireEvent.click(nextBtn);
    expect(mockSetPage).not.toHaveBeenCalled();
  });
});