
import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordApi } from "../utils/fetchResetPassword";

export function useResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleResetPassword = async () => {
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await resetPasswordApi(password,confirmPassword);
      if (response.detail && response.detail.toLowerCase().includes("password reset successful")) {
        setMessage(response.detail);
        setTimeout(() => router.push("/Success"), 1500);
      } else {
        setError(response.detail || "Error resetting password.");
      }
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    message,
    handleResetPassword,
  };
}
