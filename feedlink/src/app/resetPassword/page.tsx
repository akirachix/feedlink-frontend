'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useResetPassword } from '../hooks/useResetPassword';
import { FiEye, FiEyeOff } from 'react-icons/fi'; 

function PasswordInput({
  label,
  id,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative mb-6">
      <label htmlFor={id} className="block text-left text-xl mb-2 text-gray-700 font-semibold">
        {label}
      </label>
      <input
        id={id}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-3 rounded-lg border border-gray-300 text-lg  placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 pr-12"
      />
      <button
        type="button"
        onClick={() => setShowPassword((show) => !show)}
        className="absolute right-3 top-[50px] text-gray-700 hover:text-gray-800"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {showPassword ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
}

export default function ResetPasswordPage() {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    message,
    handleResetPassword,
  } = useResetPassword();

  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (message && message.toLowerCase().includes('password reset successfu')) {
      router.push('/signin');
    }
  }, [message, router]);


  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (confirmPassword && value !== confirmPassword) {
      setFormError('Passwords do not match.');
    } else {
      setFormError(null);
    }
  };

 
  const onConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (password && password !== value) {
      setFormError('Passwords do not match.');
    } else {
      setFormError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formError) {
  
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    await handleResetPassword();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: 'url("/images/Rectangle.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-[var(--primary-color)] opacity-45 z-10"></div>
      <div className="relative z-20 bg-white rounded-lg shadow-md p-14 w-[600px] flex flex-col items-center">
        <h1 className="text-5xl font-bold text-[var(--secondary-color)] mb-8">Reset Password</h1>
        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          <PasswordInput
            label="Password:"
            id="password"
            placeholder="Create password"
            value={password}
            onChange={onPasswordChange}
            required
          />
          <PasswordInput
            label="Confirm password:"
            id="confirm"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            required
            
          />
          <button
            type="submit"
            className="bg-orange-400 text-white cursor-pointer font-semibold py-4 rounded-lg w-full hover:bg-orange-500 transition text-xl"
          >
            Confirm
          </button>
          {(formError || error) && (
            <p className="text-red-500 mt-4">{formError || error}</p>
          )}
          {message && <p className="text-[var(--primary-color)] mt-4">{message}</p>}
        </form>
      </div>
    </div>
  );
}
