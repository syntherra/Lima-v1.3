'use client';

import Image from "next/image";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Only redirect if we're actually on the home page
        if (window.location.pathname === '/') {
          router.push('/mail/inbox');
        }
      } else {
        router.push('/auth/signin');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-sm text-gray-600">
          Loading Lima...
        </p>
      </div>
    </div>
  );
}
