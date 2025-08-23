'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { LimaSidebar } from '@/components/layout/lima-sidebar';
import { ProfileDropdown } from '@/components/layout/profile-dropdown';
import { Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Function to generate breadcrumbs based on pathname
function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length === 0) {
    return [{ label: 'Dashboard', isActive: true }];
  }
  
  const breadcrumbs = [{ label: 'Dashboard', isActive: false }];
  
  // Handle mail routes
  if (segments[0] === 'mail') {
    if (segments.length === 1) {
      breadcrumbs.push({ label: 'Mail', isActive: true });
    } else {
      breadcrumbs.push({ label: 'Mail', isActive: false });
      const mailSection = segments[1];
      const sectionLabel = mailSection.charAt(0).toUpperCase() + mailSection.slice(1);
      breadcrumbs.push({ label: sectionLabel, isActive: true });
    }
  }
  // Handle other routes
  else {
    segments.forEach((segment, index) => {
      const isLast = index === segments.length - 1;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
      breadcrumbs.push({ label, isActive: isLast });
    });
  }
  
  return breadcrumbs;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);
  return (
    <div className="h-screen flex overflow-hidden bg-gray-900">
      {/* Lima Sidebar - Full Height */}
      <LimaSidebar />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <div className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
          {/* Left side - Breadcrumbs */}
          <div className="flex items-center space-x-2">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="text-sm text-gray-500">/</span>}
                <span className={`text-sm ${
                  crumb.isActive 
                    ? 'text-white font-medium' 
                    : 'text-gray-300'
                }`}>
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </div>
          
          {/* Right side - Search, Notifications, User */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search..."
                className="pl-10 w-64 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
              />
            </div>
            
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Bell className="h-4 w-4" />
            </Button>
            
            {/* User Profile Dropdown */}
            <ProfileDropdown />
          </div>
        </div>
        
        {/* Page content */}
        <main className="flex-1 overflow-hidden bg-gray-900">
          {/* Floating white dashboard container with responsive spacing */}
          <div className="h-full" style={{ margin: '20px', marginTop: '20px' }}>
            <div className="bg-white dark:bg-white rounded-2xl shadow-2xl shadow-black/20 p-8 overflow-y-auto scrollbar-hide" style={{ height: 'calc(100vh - 96px)' }}>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}