'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSignup from '../hooks/useFetchSignupUser';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    tillNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    tillNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
    email: '',
  });

  const { signup, loading, error: signupError } = useSignup();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'password') {
      if (value.length < 6) {
        setFormErrors((prev) => ({ ...prev, password: 'Password must be at least 6 characters' }));
      } else if (formData.confirmPassword && value !== formData.confirmPassword) {
        setFormErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setFormErrors((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      }
    }

    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        setFormErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setFormErrors((prev) => ({ ...prev, confirmPassword: '' }));
      }
    }

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) {
        setFormErrors((prev) => ({ ...prev, email: 'Email is required' }));
      } else if (!emailRegex.test(value)) {
        setFormErrors((prev) => ({ ...prev, email: 'Please enter a valid email' }));
      } else {
        setFormErrors((prev) => ({ ...prev, email: '' }));
      }
    }

    if (name === 'tillNumber') {
      if (value.length > 6) {
        setFormErrors((prev) => ({ ...prev, tillNumber: 'Till number must be 6 characters or less' }));
      } else if (!value.trim()) {
        setFormErrors((prev) => ({ ...prev, tillNumber: 'Till number is required' }));
      } else {
        setFormErrors((prev) => ({ ...prev, tillNumber: '' }));
      }
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setFormErrors({
    firstName: '',
    lastName: '',
    tillNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
    email: '',
  });

  let hasError = false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formData.firstName.trim()) {
  setFormErrors(prev => ({ ...prev, firstName: 'First name is required' }));
  hasError = true;
}
if (!formData.lastName.trim()) {
  setFormErrors(prev => ({ ...prev, lastName: 'Last name is required' }));
  hasError = true;
}
  if (!formData.email.trim()) {
    setFormErrors((prev) => ({ ...prev, email: 'Email is required' }));
    hasError = true;
  } else if (!emailRegex.test(formData.email)) {
    setFormErrors((prev) => ({ ...prev, email: 'Please enter a valid email' }));
    hasError = true;
  }

  if (!formData.tillNumber.trim()) {
    setFormErrors((prev) => ({ ...prev, tillNumber: 'Till number is required' }));
    hasError = true;
  } else if (formData.tillNumber.length > 6) {
    setFormErrors((prev) => ({ ...prev, tillNumber: 'Till number must be 6 characters or less' }));
    hasError = true;
  }

  if (!formData.address.trim()) {
    setFormErrors((prev) => ({ ...prev, address: 'Address is required' }));
    hasError = true;
  }

  if (formData.password !== formData.confirmPassword) {
    setFormErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    hasError = true;
  }

  if (formData.password.length < 6) {
    setFormErrors((prev) => ({ ...prev, password: 'Password must be at least 6 characters' }));
    hasError = true;
  }

  if (hasError) return;

  const result = await signup({
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email,
    password: formData.password,
    till_number: formData.tillNumber,
    address: formData.address,
  });

  if (result?.id && result?.email) {
    localStorage.setItem("user", JSON.stringify(result));
    if (result.token) localStorage.setItem("accessToken", result.token);
    router.push("/signin");
  }
};

  return (
    <div className="flex h-screen w-full">
      <div className="w-1/2 relative">
        <Image
          src="/images/veggies.jpg"
          alt="Fresh food background"
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
          className="z-0"
        />
        <div className="absolute inset-0 bg-[var(--primary-color)] opacity-42 z-10"></div>

        <div className="relative z-20 flex flex-col items-center justify-center h-full p-8 text-white">
          <div className="w-full max-w-[600px] min-h-[500px] flex flex-col justify-center bg-opacity-50 backdrop-blur-sm   rounded-lg p-10 shadow-xl ">
            <div className="text-center mb-3 ml-15">
              <Image
                src="/images/logo.svg"
                alt="FeedLink Logo"
                width={300}
                height={70}
                className="mx-auto"
              />
            </div>
            <p className="text-medium text-gray-200 font-medium text-center w-full">
              Create your account, let's save our planet together.
            </p>
            <h2 className="text-2xl font-bold text-white mb-4 text-center leading-tight">
              Building a sustainable food ecosystem for everyone.
            </h2>
          </div>
        </div>
      </div>

      <div className="w-1/2 bg-[var(--primary-color)] flex flex-col items-center justify-center p-10 text-white">
        <div className="w-full max-w-md space-y-6">
          <h1 className="text-4xl font-bold text-[var(--secondary-color)]">Sign Up</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {signupError && <p className="text-gray text-[12px] mb-4">{signupError}</p>}

            <div>
              <label htmlFor="firstName" className="block text-white text-lg mb-1">
                First name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)]"
                required
              />
              {formErrors.firstName && <p className="text-orange-500 text-[15px] mt-1">{formErrors.firstName}</p>}

            </div>

            <div>
              <label htmlFor="lastName" className="block text-white text-lg mb-1">
                Last name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)]"
                required
              />
              {formErrors.lastName && <p className="text-orange-500 text-[15px] mt-1">{formErrors.lastName}</p>}
              
            </div>

            <div>
              <label htmlFor="email" className="block text-white text-lg mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)]"
                required
              />
              {formErrors.email && <p className="text-orange-500 text-[15px] mt-1">{formErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="tillNumber" className="block text-white text-lg mb-1">
                Till Number
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                id="tillNumber"
                name="tillNumber"
                value={formData.tillNumber}
                onChange={handleChange}
                placeholder="Enter your tillnumber"
                className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)]"
                required
                maxLength={6} 
              />
              {formErrors.tillNumber && <p className="text-orange-500 text-[15] mt-1">{formErrors.tillNumber}</p>}
            </div>

            <div>
              <label htmlFor="address" className="block text-white text-lg mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your city or address"
                className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)]"
                required
              />
              {formErrors.address && <p className="text-orange-500 text-[15px] mt-1">{formErrors.address}</p>}
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-white text-lg mb-1">
                Password:
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                    <path d="M3 17l14-14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                )}
              </button>
              {formErrors.password && <p className="text-orange-500 text-[15px] mt-1">{formErrors.password}</p>}
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-white text-lg mb-1">
                Confirm password
              </label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                    <path d="M3 17l14-14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                )}
              </button>
              {formErrors.confirmPassword && <p className="text-orange-500 text-[15px] mt-1">{formErrors.confirmPassword}</p>}
            </div> 

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--secondary-color)] hover:bg-white hover:text-[var(--secondary-color)] text-white font-bold rounded-lg transition duration-200 disabled:opacity-70 cursor-pointer"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-300 mt-4">
            Already have an account?{' '}
           <a href="/signin?role=producer&skipChoice=true" className="text-[var(--secondary-color)] font-bold hover:underline">
  Sign In
</a>
          </p>
        </div>
      </div>
    </div>
  );
}