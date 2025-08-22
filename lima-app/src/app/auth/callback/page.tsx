'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          router.push('/auth/signin?error=callback_error');
          return;
        }

        if (data?.session) {
          // Successful authentication, redirect to dashboard
          router.push('/dashboard');
        } else {
          // No session, redirect to sign in
          router.push('/auth/signin');
        }
      } catch (error) {
        console.error('Unexpected auth callback error:', error);
        router.push('/auth/signin?error=unexpected_error');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-sm text-gray-600">
          Completing authentication...
        </p>
      </div>
    </div>
  );
}