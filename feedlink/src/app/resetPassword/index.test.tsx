import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"; 
import ResetPasswordPage from "./page";
import * as useResetPasswordHook from "../hooks/useResetPassword";
import * as nextRouter from "next/navigation";
jest.mock("../hooks/useResetPassword");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
describe("ResetPasswordPage", () => {
  const pushMock = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    (nextRouter.useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });
  it("renders correctly with inputs and button", () => {
    (useResetPasswordHook.useResetPassword as jest.Mock).mockReturnValue({
      password: "",
      setPassword: jest.fn(),
      confirmPassword: "",
      setConfirmPassword: jest.fn(),
      error: "",
      message: "",
      handleResetPassword: jest.fn(),
    });
    render(<ResetPasswordPage />);
    expect(screen.getByLabelText("Password:")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Confirm$/ })).toBeInTheDocument();
  });
  it("shows error message if passwords do not match on submit", async () => {
  const handleResetPassword = jest.fn();
  (useResetPasswordHook.useResetPassword as jest.Mock).mockReturnValue({
    password: "pass1",
    setPassword: jest.fn(),
    confirmPassword: "pass2",
    setConfirmPassword: jest.fn(),
    error: "Passwords do not match",
    message: "",
    handleResetPassword,
  });

  render(<ResetPasswordPage />);

  const form = screen.getByRole("button", { name: /^Confirm$/ }).closest("form");
  expect(form).toBeTruthy();

  fireEvent.submit(form!);

  await waitFor(() => {
    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
  });

  expect(handleResetPassword).not.toHaveBeenCalled();
});
  it("calls handleResetPassword if passwords match", async () => {
    const handleResetPassword = jest.fn();
    (useResetPasswordHook.useResetPassword as jest.Mock).mockReturnValue({
      password: "password",
      setPassword: jest.fn(),
      confirmPassword: "password",
      setConfirmPassword: jest.fn(),
      error: "",
      message: "",
      handleResetPassword,
    });
    render(<ResetPasswordPage />);
    const form = screen.getByRole("button", { name: /^Confirm$/ }).closest("form");
    expect(form).toBeTruthy();
    fireEvent.submit(form!);
    await waitFor(() => {
      expect(handleResetPassword).toHaveBeenCalled();
    });
  });
  it("redirects upon successful message", () => {
    (useResetPasswordHook.useResetPassword as jest.Mock).mockReturnValue({
      password: "",
      setPassword: jest.fn(),
      confirmPassword: "",
      setConfirmPassword: jest.fn(),
      error: "",
      message: "Password reset successful",
      handleResetPassword: jest.fn(),
    });
    render(<ResetPasswordPage />);
    expect(pushMock).toHaveBeenCalledWith("/Success");
  });
});