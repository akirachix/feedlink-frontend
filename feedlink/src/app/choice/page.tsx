'use client';
import Image from 'next/image';

export default function ChoiceScreen() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[var(--primary-color)] flex items-center justify-center">
      <Image
        src="/images/supermarket.jpeg"
        alt="Grocery-store shelves"
        fill
        style={{ objectFit: 'cover' }}
        priority
      />
      <div className="absolute inset-0 bg-[var(--primary-color)] opacity-45 z-10"></div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="flex justify-center ml-30 mb-10">
          <Image
            src="/images/logo.svg"
            alt="FeedLink Logo"
            width={500}
            height={100}
            className="drop-shadow-lg"
          />
        </div>

        <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
          Welcome to FeedLink
        </h1>

        <p className="text-white text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
          Showcase your products directly to buyers and recyclers.<br />
          Reduce waste. Increase sales.
        </p>

        <div className="flex flex-col sm:flex-row gap-15 justify-center items-center ">
          <button
            className="bg-[var(--secondary-color)] text-white hover:bg-white hover:text-[var(--secondary-color)] w-50 font-bold py-4 px-12 rounded-lg shadow-lg transition transform hover:scale-105"
            onClick={() => window.location.href = '/signin?role=admin'}
          >
            Admin
          </button>

          <button
            className="bg-white hover:bg-[var(--secondary-color)] text-[var(--secondary-color)] hover:text-white w-50 font-bold py-4 px-12 rounded-lg border-2 border-[var(--secondary-color)] shadow-lg transition transform hover:scale-105"
            onClick={() => window.location.href = '/signin?role=producer'}
          >
            Producer
          </button>
        </div>
      </div>
    </div>
  );
}