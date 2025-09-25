"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPasswordApi } from "../utils/fetchForgotPassword";
export default function useForgotPassword() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const sendResetEmail = async (email: string) => {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const response = await forgotPasswordApi(email);
      if (response.detail && response.detail.toLowerCase().includes("otp sent")) {
        setMessage(response.detail);
        setSuccess(true);
        localStorage.setItem("forgotEmail", email);
        setTimeout(() => router.push("/verifyCode"), 1000);
      } else {
        setError(response.detail || "Error sending OTP.");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };
   return { sendResetEmail, loading, error, success, message };
}
