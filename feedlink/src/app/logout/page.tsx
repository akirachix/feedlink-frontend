'use client';

import { useRouter } from 'next/navigation';

export default function SignOutConfirmationPage() {
  const router = useRouter();

  const handleYes = () => {
    router.push('/signin?role=producer');
  };

  const handleNo = () => {
    router.back(); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--primary-color)]  p-4">
      <div className="bg-white rounded-2xl p-19 shadow-lg max-w-lg w-full text-center">
        <h2 className="text-xl font-semibold mb-4">Confirm Sign Out</h2>
        <p className="text-gray-700 mb-8 text-lg">Are you sure you want to sign out?</p>
        
        <div className="flex justify-center space-x-6 ml-[-10px]">
        <button
            onClick={handleYes}
       
            className="px-11 py-3 bg-white  border border-green-800
             text-green-800 rounded-md hover:bg-[var(--secondary-color)] transition text-lg font-medium"
          >
            Yes
          </button>
          <button
            onClick={handleNo}
            className="px-11 py-3 border  bg-green-800 border-green-800 text-white rounded-md hover:bg-[var(--secondary-color)] transition text-lg font-medium"
          >
       
            No
          </button>
        </div>
      </div>
    </div>
  );
}