import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import SignOutConfirmationPage from './page';

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('SignOutConfirmationPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    localStorage.setItem('user', JSON.stringify({ id: '123' }));
    localStorage.setItem('authToken', 'fake-jwt-token');
  });

  it('renders confirmation message and buttons', () => {
    render(<SignOutConfirmationPage />);

    expect(screen.getByText('Confirm Sign Out')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to sign out?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /yes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /no/i })).toBeInTheDocument();
  });

  it('signs out and redirects to /signin?role=producer when "Yes" is clicked', async () => {
    render(<SignOutConfirmationPage />);

     
    const yesButton = screen.getByRole('button', { name: /yes/i });
    fireEvent.click(yesButton);

    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('authToken')).toBeNull();                 
    expect(mockPush).toHaveBeenCalledWith('/signin?role=producer');
  });

  it('navigates back when "No" is clicked', () => {
    render(<SignOutConfirmationPage />);

    const noButton = screen.getByRole('button', { name: /no/i });
    fireEvent.click(noButton);

    expect(mockBack).toHaveBeenCalled();
  });
});