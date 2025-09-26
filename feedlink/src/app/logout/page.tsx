'use client';
import { useRouter } from 'next/navigation';

export default function SignOutConfirmationPage() {
  const router = useRouter();

  const handleYes = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken'); 
    router.push('/signin?role=producer');
  };

  const handleNo = () => {
    router.back();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--primary-color)] p-4">
      <div className="bg-white rounded-2xl p-8 h-70 shadow-lg max-w-lg w-full text-center">
        <h2 className="text-2xl font-semibold text-[var(--secondary-color)] mt-5 mb-4">
          Confirm Sign Out
        </h2>
        <p className="text-gray-700 mb-8 text-lg">
          Are you sure you want to sign out?
        </p>
        <div className="flex justify-center space-x-6">
          <button
            onClick={handleYes}
            className="px-6 py-3 bg-white border border-[var(--secondary-color)] text-[var(--secondary-color)] rounded-md hover:bg-[var(--secondary-color)] hover:text-white cursor-pointer transition text-lg font-medium"
          >
            Yes
          </button>
          <button
            onClick={handleNo}
            className="px-6 py-3 bg-[var(--secondary-color)] border border-[var(--secondary-color)] text-white rounded-md hover:bg-white hover:text-[var(--secondary-color)] cursor-pointer transition text-lg font-medium"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}