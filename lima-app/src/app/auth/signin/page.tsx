'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new unified auth page
    router.replace('/auth');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#121827] flex items-center justify-center">
      <div className="text-white">Redirecting...</div>
    </div>
  );
}