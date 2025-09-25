import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import SignOutConfirmationPage from '@/app/logout/page';

const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

describe('SignOutConfirmationPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders confirmation message and buttons', () => {
    render(<SignOutConfirmationPage />);
    expect(screen.getByText('Confirm Sign Out')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to sign out?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /yes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /no/i })).toBeInTheDocument();
  });

  it('navigates to /signin when clicking "Yes"', async () => {
    render(<SignOutConfirmationPage />);
    fireEvent.click(screen.getByRole('button', { name: /yes/i }));
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/signin'));
  });

  it('navigates back when clicking "No"', async () => {
    render(<SignOutConfirmationPage />);
    fireEvent.click(screen.getByRole('button', { name: /no/i }));
    await waitFor(() => expect(mockBack).toHaveBeenCalled());
  });

  it('has correct styling classes', () => {
    render(<SignOutConfirmationPage />);

 
    const heading = screen.getByText('Confirm Sign Out');
    const card = heading.closest('div'); 
    const container = card?.parentElement; 

    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('flex items-center justify-center min-h-screen bg-[var(--primary-color)] p-4');
    expect(card).toHaveClass('bg-white rounded-2xl p-10 shadow-lg max-w-lg w-full text-center');

    const yesBtn = screen.getByRole('button', { name: /yes/i });
    const noBtn = screen.getByRole('button', { name: /no/i });
    expect(yesBtn).toHaveClass('px-8 py-3 bg-green-800 text-white rounded-md hover:bg-green-700 transition text-lg font-medium');
    expect(noBtn).toHaveClass('px-8 py-3 border border-green-800 text-green-800 rounded-md hover:bg-green-50 transition text-lg font-medium');
  });
});