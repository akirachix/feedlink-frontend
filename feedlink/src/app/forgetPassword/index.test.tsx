import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ForgetPasswordPage from "../forgetPassword/page";
import useForgotPassword from "../hooks/useForgotPassword";
jest.mock("../hooks/useForgotPassword");
describe("ForgetPasswordPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders form elements correctly", () => {
    (useForgotPassword as jest.Mock).mockReturnValue({
      sendResetEmail: jest.fn(),
      loading: false,
      error: "",
      success: false,
    });
    render(<ForgetPasswordPage />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Confirm/i })).toBeInTheDocument();
  });
  it("disables input and button while loading", () => {
    (useForgotPassword as jest.Mock).mockReturnValue({
      sendResetEmail: jest.fn(),
      loading: true,
      error: "",
      success: false,
    });
    render(<ForgetPasswordPage />);
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });
  it("shows error message", () => {
    (useForgotPassword as jest.Mock).mockReturnValue({
      sendResetEmail: jest.fn(),
      loading: false,
      error: "Invalid email",
      success: false,
    });
    render(<ForgetPasswordPage />);
    expect(screen.getByText(/Invalid email/i)).toBeInTheDocument();
  });
  it("shows success message", () => {
    (useForgotPassword as jest.Mock).mockReturnValue({
      sendResetEmail: jest.fn(),
      loading: false,
      error: "",
      success: true,
    });
    render(<ForgetPasswordPage />);
    expect(screen.getByText(/OTP has been sent to this email/i)).toBeInTheDocument();
  });
  it("calls sendResetEmail with the input email on form submit", () => {
    const sendResetEmailMock = jest.fn();
    (useForgotPassword as jest.Mock).mockReturnValue({
      sendResetEmail: sendResetEmailMock,
      loading: false,
      error: "",
      success: false,
    });
    render(<ForgetPasswordPage />);
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: "semhal@gmail.com" },
    });
    const form = screen.getByRole("button", { name: /Confirm/i }).closest("form");
    fireEvent.submit(form!);
    expect(sendResetEmailMock).toHaveBeenCalledWith("semhal@gmail.com");
  });
});