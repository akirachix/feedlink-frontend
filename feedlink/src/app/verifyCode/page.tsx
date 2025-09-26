"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useVerifyCode } from '../hooks/useVerifyCode';

export default function VerifyCodePage() {
  const [code, setCode] = useState(['', '', '', '']);
  const [email, setEmail] = useState<string | null>(null);
  const { verify, loading, error, success } = useVerifyCode();
  const [cancelLoading, setCancelLoading] = useState(false);
  const router = useRouter();

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const setInputRef = (element: HTMLInputElement | null, index: number) => {
    inputsRef.current[index] = element;
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('forgotEmail');
    if (!savedEmail) {
      router.push('/forgetPassword');
      return;
    }
    setEmail(savedEmail);
  }, [router]);

  useEffect(() => {
    if (success) {
      router.push('/resetPassword');
    }
  }, [success, router]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newCode = [...code];
      if (code[index]) {
        newCode[index] = '';
        setCode(newCode);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        newCode[index - 1] = '';
        setCode(newCode);
      }
    }
  };

  const handleSubmit = () => {
    if (!email) {
      alert('No email found. Please request OTP again.');
      return;
    }
    if (loading || cancelLoading) {   
      return; 
    }
    verify(email, code.join(''));
  };

  const handleResend = async () => {
    if (!loading) {
      setCancelLoading(true);
      await new Promise((r) => setTimeout(r, 1000));
      router.push('/forgetPassword');
      setCancelLoading(false);
    }
  };

  if (email === null) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: 'url("/images/Rectangle.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      <div className="absolute inset-0 bg-[var(--primary-color)] opacity-45 z-10" />
      <div className="relative z-20 bg-white rounded-lg shadow-md p-14 w-[600px] flex flex-col gap-8 text-center">
        <h1 className="text-5xl font-bold text-[var(--secondary-color)]">Verification Code</h1>
        <p className="text-gray-800">
          Enter the code sent to <span className="font-semibold">{email}</span>
        </p>

        <div className="flex justify-center gap-8">
          {code.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              maxLength={1}
              className="w-14 h-14 text-center text-2xl rounded border border-gray-500 focus:border-orange-400 focus:outline-none font-bold text-gray-900"
              inputMode="numeric"
              autoComplete="one-time-code"
              ref={(el) => setInputRef(el, idx)}
            />
          ))}
        </div>

        <div className="flex justify-center gap-6">
          <button
             type="button"
            onClick={handleSubmit}
            disabled={loading ||  cancelLoading}
            className="bg-orange-400 cursor-pointer text-white px-8 py-3 rounded hover:bg-orange-500 transition disabled:opacity-50"
          >
            {loading ? "Checking..." : "Confirm"}
          </button>

          <button
            onClick={handleResend}
            disabled={ cancelLoading || loading}
            className="border cursor-pointer border-orange-400 text-orange-400 px-8 py-3 rounded hover:bg-orange-50 transition"
          >
            { cancelLoading ? "Canceling..." : "Cancel"}
          </button>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-[var(--primary-color)]">Code verified successfully!</p>}
      </div>
    </div>
  );
}


