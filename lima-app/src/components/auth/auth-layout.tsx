import { ReactNode } from 'react';
import { PromotionalArea } from './promotional-area';
import { AuthCard } from './auth-card';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#121827] flex px-[100px]">
      {/* Left Side - Promotional Area */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5">
        <PromotionalArea />
      </div>

      {/* Right Side - Auth Card */}
      <div className="w-full lg:w-1/2 xl:w-2/5">
        <AuthCard title={title} subtitle={subtitle}>
          {children}
        </AuthCard>
      </div>
    </div>
  );
}