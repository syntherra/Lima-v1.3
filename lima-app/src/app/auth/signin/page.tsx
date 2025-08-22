'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, signInWithGoogle, user, loading: authLoading } = useAuth();
  const { error, success } = useToast();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      console.log('User already logged in, redirecting to dashboard');
      window.location.href = '/dashboard';
    }
  }, [user, authLoading]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      success('Successfully signed in!');
      
      // Single redirect after successful login
      console.log('Redirecting to dashboard after successful login');
      window.location.href = '/dashboard';
    } catch (err: any) {
      error('Sign in failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      error('Google sign in failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lima-auth-layout">
      <div className="lima-auth-container">
        <div className="lima-auth-header">
          <div className="lima-logo-auth">
            <span className="lima-logo-text">L</span>
          </div>
          <h2 className="lima-text-h2 lima-text-primary text-center">
            Sign in to Lima
          </h2>
          <p className="lima-text-body lima-text-secondary text-center">
            Scale your B2B outreach with AI-powered automation
          </p>
        </div>

        <form className="lima-form" onSubmit={handleEmailSignIn}>
          <div className="lima-form-group">
            <div>
              <label htmlFor="email" className="lima-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="lima-input"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="lima-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="lima-input"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="lima-btn lima-btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="lima-divider">
            <span className="lima-divider-text">Or continue with</span>
          </div>

          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="lima-btn lima-btn-secondary w-full flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>

          <div className="text-center">
            <span className="lima-text-body lima-text-secondary">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="lima-link">
                Sign up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}