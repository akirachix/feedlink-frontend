"use client";
import { useState } from "react";
import useForgotPassword from "../hooks/useForgotPassword";

export default function ForgetPasswordPage() {
  const { sendResetEmail, loading, error, success } = useForgotPassword();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendResetEmail(email);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: 'url("/images/Rectangle.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[var(--primary-color)] opacity-40 z-10"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white rounded-lg shadow-md p-14 flex flex-col gap-8 w-[600px]"
      >
        <h1 className="text-center text-orange-500 font-semibold text-4xl mb-6">
          Forget Password
        </h1>
        <label htmlFor="email" className="text-[var(--primary-color)] font-semibold text-lg">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="p-4 rounded-md border border-[var(--primary-color)] text-[var(--primary-color)] placeholder-green-800 text-lg  f focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 cursor-pointer text-white py-4 rounded-md font-semibold hover:bg-orange-400 text-xl flex justify-center items-center"
        >
          {loading ? "Loading..." : "Confirm"}
        </button>

        {error && <p className="text-red-500 mt-3 text-center text-lg">{error}</p>}
        {success && (
          <p className="text-green-900 mt-3 text-center text-lg">
            OTP has been sent to this email
          </p>
        )}
      </form>
    </div>
  );
}
