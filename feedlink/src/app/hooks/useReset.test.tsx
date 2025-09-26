import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';
import { useResetPassword } from "./useResetPassword";
import * as fetchModule from "../utils/fetchResetPassword";
import { useRouter } from "next/navigation";

jest.mock("../utils/fetchResetPassword");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

function HookWrapper() {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    message,
    handleResetPassword,
  } = useResetPassword();

  return (
    <div>
      <input
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        data-testid="password"
      />
      <input
        placeholder="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        data-testid="confirmPassword"
      />
      <button onClick={handleResetPassword}>Reset Password</button>
      {error && <span role="alert">{error}</span>}
      {message && <span role="status">{message}</span>}
    </div>
  );
}

describe("useResetPassword", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("shows error if password is too short", async () => {
    render(<HookWrapper />);
    const user = userEvent.setup();
    await user.type(screen.getByTestId("password"), "short");
    await user.type(screen.getByTestId("confirmPassword"), "short");
    await user.click(screen.getByText("Reset Password"));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /at least 8 characters/i
    );
  });

  it("shows error if passwords do not match", async () => {
    render(<HookWrapper />);
    const user = userEvent.setup();
    await user.type(screen.getByTestId("password"), "password123");
    await user.type(screen.getByTestId("confirmPassword"), "different123");
    await user.click(screen.getByText("Reset Password"));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /passwords do not match/i
    );
  });

  it("resets password successfully and redirects", async () => {
    const res = { detail: "Password reset successful" };
    (fetchModule.resetPasswordApi as jest.Mock).mockResolvedValue(res);
    render(<HookWrapper />);
    const user = userEvent.setup();
    await user.type(screen.getByTestId("password"), "newpassword");
    await user.type(screen.getByTestId("confirmPassword"), "newpassword");
    await user.click(screen.getByText("Reset Password"));


    expect(fetchModule.resetPasswordApi).toHaveBeenCalledWith("newpassword", "newpassword");

    expect(await screen.findByRole("status")).toHaveTextContent(
      /password reset successful/i
    );

    await new Promise((r) => setTimeout(r, 1600));
    expect(mockPush).toHaveBeenCalledWith("/Success");
  });

  it("shows error message on API error", async () => {
    const res = { detail: "Some error occurred" };
    (fetchModule.resetPasswordApi as jest.Mock).mockResolvedValue(res);
    render(<HookWrapper />);
    const user = userEvent.setup();
    await user.type(screen.getByTestId("password"), "newpassword");
    await user.type(screen.getByTestId("confirmPassword"), "newpassword");
    await user.click(screen.getByText("Reset Password"));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /some error occurred/i
    );
  });

  it("shows error message on thrown error", async () => {
    const errorMessage = "Network error";
    (fetchModule.resetPasswordApi as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );
    render(<HookWrapper />);
    const user = userEvent.setup();
    await user.type(screen.getByTestId("password"), "newpassword");
    await user.type(screen.getByTestId("confirmPassword"), "newpassword");
    await user.click(screen.getByText("Reset Password"));
    expect(await screen.findByRole("alert")).toHaveTextContent(errorMessage);
  });
});
