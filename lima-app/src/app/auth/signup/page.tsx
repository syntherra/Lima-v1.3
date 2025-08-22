'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const { error, success } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      error('Please fill in all required fields');
      return false;
    }

    if (formData.password.length < 6) {
      error('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      error('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signUpWithEmail(
        formData.email,
        formData.password,
        {
          name: formData.name,
          company: formData.company || undefined,
        }
      );
      success('Account created successfully!', 'Please check your email to verify your account.');
    } catch (err: any) {
      error('Sign up failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      error('Google sign up failed', err.message);
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
            Create your Lima account
          </h2>
          <p className="lima-text-body lima-text-secondary text-center">
            Start scaling your B2B outreach today
          </p>
        </div>

        <form className="lima-form" onSubmit={handleEmailSignUp}>
          <div className="lima-form-group">
            <div>
              <label htmlFor="name" className="lima-label">
                Full name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="lima-input"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="lima-label">
                Email address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="lima-input"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="company" className="lima-label">
                Company
              </label>
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                value={formData.company}
                onChange={handleChange}
                className="lima-input"
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <label htmlFor="password" className="lima-label">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="lima-input"
                placeholder="Create a password (min. 6 characters)"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="lima-label">
                Confirm password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="lima-input"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="lima-btn lima-btn-primary w-full"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="lima-divider">
            <span className="lima-divider-text">Or continue with</span>
          </div>

          <div>
            <button
              type="button"
              onClick={handleGoogleSignUp}
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
              {loading ? 'Signing up...' : 'Sign up with Google'}
            </button>
          </div>

          <div className="text-center">
            <span className="lima-text-body lima-text-secondary">
              Already have an account?{' '}
              <Link href="/auth/signin" className="lima-link">
                Sign in
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}