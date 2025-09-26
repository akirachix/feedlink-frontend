'use client';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUpPage from './page';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('next/image', () => {
  const MockImage = ({
    src,
    alt,
    fill,
    width,
    height,
    ...props
  }: React.ComponentProps<'img'> & { fill?: boolean }) => {
    if (fill) {
      return <div data-testid="fill-image" {...props} />;
    }
    return <img src={src} alt={alt} width={width} height={height} {...props} />;
  };

  MockImage.displayName = 'MockImage';
  return {
    __esModule: true,
    default: MockImage,
  };
});

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

jest.mock('../hooks/useFetchSignupUser', () => ({
  __esModule: true,
  default: () => ({
    signup: jest.fn().mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      token: 'fake-jwt-token',
    }),
    loading: false,
    error: null,
  }),
}));

describe('SignUpPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
  });

  it('renders without crashing', () => {
    render(<SignUpPage />);
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter email/i)).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    render(<SignUpPage />);

    const passwordInput = screen.getByPlaceholderText(/Create password/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/Confirm password/i);

    const passwordToggle = screen.getAllByLabelText(/Show password/i)[0];
    const confirmPasswordToggle = screen.getAllByLabelText(/Show password/i)[1];

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(passwordToggle);
    expect(passwordInput).toHaveAttribute('type', 'text');

    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    fireEvent.click(confirmPasswordToggle);
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
  });

  it('handles successful signup and redirects', async () => {
    render(<SignUpPage />);

    fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Till Number/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: 'Nairobi' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass123' } });
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'pass123' } });

    fireEvent.click(screen.getByRole('button', { name: /Create account/i }));

    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify({ id: 1, email: 'user@example.com', token: 'fake-jwt-token' })
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', 'fake-jwt-token');
      expect(mockPush).toHaveBeenCalledWith('/signin');
    });
  });
});