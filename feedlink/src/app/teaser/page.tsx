'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Teaser() {
  const [isLeaving, setIsLeaving] = useState(false);
  const [isChoiceVisible, setIsChoiceVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);

      setTimeout(() => {
        setIsChoiceVisible(true);

        setTimeout(() => {
          router.push('/choice');
        }, 500);
      }, 50);
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[var(--primary-color)]">
      {isLeaving && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          <div
            className={`w-full h-full transition-transform duration-500 ease-out transform ${
              isChoiceVisible ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
           
          </div>
        </div>
      )}

      <div
        className={`absolute inset-0 transition-transform duration-500 ease-in transform ${
          isLeaving ? 'translate-x-[-100vw]' : 'translate-x-0'
        }`}
      >
        <Image
          src="/images/teaser.png"
          alt="Teaser with phone and groceries"
          fill
          style={{ objectFit: 'cover' }}
          priority
          className="z-0"
        />
        <div className="absolute inset-0 bg-[var(--primary-color)] opacity-10 z-10"></div>
      </div>
    </div>
  );
}