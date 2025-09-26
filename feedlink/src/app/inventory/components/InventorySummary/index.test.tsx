import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InventorySummary from './index';

describe('InventorySummary', () => {
  const defaultProps = {
    totalItems: 42,
    expiringSoonCount: 5,
    expiredCount: 3,
  };

  it('renders all three summary cards with correct values', () => {
    render(<InventorySummary {...defaultProps} />);

    expect(screen.getByText('Total items')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Across all categories')).toBeInTheDocument();

    expect(screen.getByText('Expiring soon')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Expiring within 3 days')).toBeInTheDocument();

    expect(screen.getByText('Expired items')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Recycled')).toBeInTheDocument();
  });

  it('displays zero values correctly', () => {
    render(
      <InventorySummary
        totalItems={0}
        expiringSoonCount={0}
        expiredCount={0}
      />
    );

    const zeroElements = screen.getAllByText('0');
    expect(zeroElements).toHaveLength(3);
  });

 
});