import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddItem from './index';

jest.mock('../../../hooks/useFetchProducers', () => ({
  useProducers: () => ({
    producers: [
      { id: 1, first_name: 'Alice', last_name: 'Smith', email: 'alice@example.com' },
      { id: 2, first_name: null, last_name: null, email: 'bob@example.com' },
    ],
    loadingProducers: false,
    producerError: null,
  }),
}));

jest.mock('../../../hooks/useFetchAddListings', () => ({
  useAddListing: () => ({
    addListing: jest.fn().mockResolvedValue({}),
    loading: false,
    error: '',
  }),
}));

describe('AddItem', () => {
  it('renders and calls onCancel', () => {
    const mockOnCancel = jest.fn();
    render(<AddItem onSuccess={jest.fn()} onCancel={mockOnCancel} />);

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('displays producer options', () => {
    render(<AddItem onSuccess={jest.fn()} onCancel={jest.fn()} />);

    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
  });
});