'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { AuthLayout } from '@/components/auth/auth-layout';
import { SignInForm, SignUpForm } from '@/components/auth/auth-forms';
import { useAuth } from '@/components/providers/auth-provider';

type AuthMode = 'signin' | 'signup';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);

  // Get initial mode from URL params
  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'signup') {
      setMode('signup');
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const validateSignUpForm = (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (!data.email.trim()) {
      toast.error('Please enter your email address');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (data.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSignIn = async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email.trim(), password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.message?.includes('Invalid login credentials')) {
        toast.error('Invalid email or password');
      } else {
        toast.error(error.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (!validateSignUpForm(data)) {
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(
        data.email.trim(),
        data.password
      );

      toast.success('Account created successfully! Please check your email to verify your account.');
      setMode('signin');
    } catch (error: any) {
      console.error('Sign up error:', error);
      if (error.message?.includes('User already registered')) {
        toast.error('An account with this email already exists');
      } else {
        toast.error(error.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error('Google auth error:', error);
      toast.error(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    // Update URL without page reload
    const url = new URL(window.location.href);
    if (newMode === 'signup') {
      url.searchParams.set('mode', 'signup');
    } else {
      url.searchParams.delete('mode');
    }
    window.history.replaceState({}, '', url.toString());
  };

  const title = mode === 'signin' ? 'Welcome back' : 'Create your account';
  const subtitle = mode === 'signin' 
    ? 'Sign in to your Lima account to continue' 
    : 'Join Lima and transform your email outreach';

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      <div className="space-y-6">
        {mode === 'signin' ? (
          <SignInForm onSubmit={handleSignIn} onGoogleSignIn={handleGoogleAuth} loading={loading} />
        ) : (
          <SignUpForm onSubmit={handleSignUp} onGoogleSignUp={handleGoogleAuth} loading={loading} />
        )}
        
        {/* Mode Switch */}
        <div className="text-center pt-4 border-t border-gray-200">
          <span className="text-gray-600 text-sm">
            {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-orange-500 hover:text-orange-600 font-medium transition-colors duration-200 underline"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </span>
        </div>
      </div>
    </AuthLayout>
  );
}