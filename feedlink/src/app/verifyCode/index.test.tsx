import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import VerifyCodePage from './page';
import * as nextRouter from 'next/navigation';
jest.mock('../hooks/useVerifyCode', () => ({
  useVerifyCode: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));
describe('VerifyCodePage', () => {
  const pushMock = jest.fn();
  const { useVerifyCode } = require('../hooks/useVerifyCode');
  beforeEach(() => {
    jest.clearAllMocks();
    (nextRouter.useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
    (useVerifyCode as jest.Mock).mockReturnValue({
      verify: jest.fn(),
      loading: false,
      error: '',
      success: false,
    });
  });
  it('renders loading state initially when email is null', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    render(<VerifyCodePage />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });
  it('renders input fields and buttons, and allows typing code', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue("semhal@gmail.com");
    render(<VerifyCodePage />);
    const emailText = screen.getByText(/Enter the code sent to/i);
    expect(emailText).toHaveTextContent("semhal@gmail.com");
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(4);
    fireEvent.change(inputs[0], { target: { value: '1' } });
    expect(inputs[0]).toHaveValue('1');
  });
  it('calls verify function on Confirm click', () => {
    const verifyMock = jest.fn();
    (useVerifyCode as jest.Mock).mockReturnValue({
      verify: verifyMock,
      loading: false,
      error: '',
      success: false,
    });
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue("semhal@gmail.com");
    render(<VerifyCodePage />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '1' } });
    fireEvent.change(inputs[1], { target: { value: '2' } });
    fireEvent.change(inputs[2], { target: { value: '3' } });
    fireEvent.change(inputs[3], { target: { value: '4' } });
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    expect(verifyMock).toHaveBeenCalledWith("semhal@gmail.com", '1234');
  });
  it('disables buttons and shows correct loading text when loading', () => {
    (useVerifyCode as jest.Mock).mockReturnValue({
      verify: jest.fn(),
      loading: true,
      error: '',
      success: false,
    });
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue("semhal@gmail.com");
    render(<VerifyCodePage />);
    expect(screen.getByText(/Checking.../i)).toBeInTheDocument();
    expect(screen.getByText(/Cancel/i).closest('button')).toBeDisabled();
  });
})