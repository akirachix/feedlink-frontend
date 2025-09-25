'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLogin } from '../hooks/useFetchSigninUser';
import { User } from '../utils/type';

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showChoice, setShowChoice] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  const { handleLogin, loading } = useLogin();

  useEffect(() => {
  if (typeof window !== 'undefined') {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as User;
        if (parsedUser.email && parsedUser.role) {
          setUser(parsedUser);
        } else {
          throw new Error("User missing required fields");
        }
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
        console.log("Bad user data:", savedUser);
        localStorage.removeItem('user');
      }
    }
  }
  setIsLoading(false);
}, []);

  useEffect(() => {
  if (user && role) {
    if (user.role !== role) {
      localStorage.removeItem('user');
      setUser(null);
      window.location.reload();
      return;
    }
  }

  if (user) {
    if (user.role === 'admin') {
      router.push('/admin-dashboard');
    } else if (user.role === 'producer') {
      router.push('/dashboard');
    }
  }
}, [user, role, router]); 

  const skipChoice = searchParams.get("skipChoice") === "true";
  useEffect(() => {
    if (role === "producer") {
      setShowChoice(!skipChoice);
    }
  }, [role, skipChoice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError('');

    const result = await handleLogin(email, password);


if (result && result.token && result.email) {
  const userData: User = {
    id: Number(result.user_id),
    first_name: result.first_name || "",
    last_name: result.last_name || "",
    email: result.email,
    role: "producer", 
  };

  setUser(userData);
  localStorage.setItem("user", JSON.stringify(userData));

  if (userData.role === "admin") {
    router.push("/admin-dashboard");
  } else if (userData.role === "producer") {
    router.push("/dashboard");
  } else {
    router.push("/");
  }
} else {
  setError("Login failed. Please check your email and password.");
}
  };

  const handleProducerChoice = (isNew: boolean) => {
    if (isNew) {
      router.push('/signup');
    } else {
      setShowChoice(false);
    }
  };

  const renderProducerChoice = () => (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold text-white">Welcome, Producer!</h2>
      <p className="text-gray-300">Do you already have a FeedLink account?</p>
      <div className="space-y-4">
        <button
          onClick={() => handleProducerChoice(false)}
          className="w-full py-3 bg-[var(--secondary-color)] text-white font-bold rounded-lg hover:bg-opacity-90 cursor-pointer transition"
        >
          Yes, Sign In
        </button>
        <button
          onClick={() => handleProducerChoice(true)}
          className="w-full py-3 bg-white text-[var(--secondary-color)] border border-[var(--secondary-color)] font-bold rounded-lg cursor-pointer hover:bg-gray-50 transition"
        >
          No, Create Account
        </button>
      </div>
    </div>
  );

  const renderSignInForm = (showSignupLink: boolean = false) => (
    <>
      <h1 className="text-4xl font-bold text-[var(--secondary-color)]">Sign In</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-black text-sm">{error}</p>}

        <div>
          <label htmlFor="email" className="block text-white text-lg mb-1">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)]"
            required
          />
        </div>

        <div className="relative">
          <label htmlFor="password" className="block text-white text-lg mb-1">
            Password:
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] pr-12"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                <path
                  d="M3 17l14-14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="text-right text-sm text-gray-300">
          <a href="/forgetPassword" className="hover:underline">Forgot your password?</a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[var(--secondary-color)] text-white hover:bg-white hover:text-[var(--secondary-color)] font-bold rounded-lg transition duration-200 cursor-pointer  disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {showSignupLink && (
        <p className="text-center text-sm text-gray-300 mt-4">
          Don't have an account?{' '}
          <a href="/signup" className="text-[var(--secondary-color)] text-sm font-bold hover:underline">
            Create Account
          </a>
        </p>
      )}
    </>
  );

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
        <div className="absolute inset-0 bg-[var(--primary-color)] opacity-35 z-10"></div>

        <div className="relative z-20 flex flex-col items-center justify-center h-full p-8 text-white">
          <div className="w-full max-w-[600px] min-h-[500px] bg-opacity-70 backdrop-blur-sm rounded-lg p-8 shadow-xl flex flex-col justify-center">
            <h1 className="text-5xl font-bold text-[var(--secondary-color)] mb-4">Welcome back!!</h1>

            {isLoading ? (
              <p className="text-lg text-gray-200 mb-6">Loading...</p>
            ) : (
              <>
                {user ? (
                  <>
                    <p className="text-lg text-gray-200 mb-2">
                      {user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user.first_name || "Valued User"}!
                    </p>
                  </>
                ) : (
                  <p className="text-lg text-gray-200 mb-6">Please sign in to continue</p>
                )}
              </>
            )}

            <h2 className="text-2xl font-bold text-white mb-4">
              Building a sustainable food ecosystem for everyone.
            </h2>
          </div>
        </div>
      </div>

      <div className="w-1/2 bg-[var(--primary-color)] flex flex-col items-center justify-center p-10 text-white">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mr-12 mb-12">
            <Image
              src="/images/logo.svg"
              alt="FeedLink Logo"
              width={400}
              height={70}
              className="mx-auto"
            />
          </div>

          {role === "admin" && renderSignInForm(false)}
          {role === "producer" && (
            <>
              {showChoice ? renderProducerChoice() : renderSignInForm(true)}
            </>
          )}
          {!role && renderSignInForm(true)}
        </div>
      </div>
    </div>
  );
}