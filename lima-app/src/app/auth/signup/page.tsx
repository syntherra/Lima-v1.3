'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new unified auth page with signup mode
    router.replace('/auth?mode=signup');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#121827] flex items-center justify-center">
      <div className="text-white">Redirecting...</div>
    </div>
  );
}