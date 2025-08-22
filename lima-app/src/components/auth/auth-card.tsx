'use client';

import { ReactNode } from 'react';

interface AuthCardProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 lg:p-8">
      <div className="w-full max-w-lg">
        {/* Floating White Card - Made larger */}
        <div className="bg-white rounded-2xl shadow-2xl p-10 lg:p-14 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-600 text-sm lg:text-base">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {children}
            
            {/* Terms and Privacy - Moved inside the card */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-gray-500 text-xs leading-relaxed">
                By continuing, you agree to Lima's{' '}
                <a href="#" className="text-orange-500 hover:text-orange-600 underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-orange-500 hover:text-orange-600 underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}