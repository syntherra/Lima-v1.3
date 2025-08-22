'use client';

import React from 'react';
import { LimaSidebar } from '@/components/layout/lima-sidebar';
import { ProfileDropdown } from '@/components/layout/profile-dropdown';
import { Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-950">
      {/* Lima Sidebar - Full Height */}
      <LimaSidebar />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Dark Top Navigation Bar */}
        <div className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
          {/* Left side - Breadcrumbs */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Dashboard</span>
            <span className="text-sm text-gray-600">/</span>
            <span className="text-sm text-white font-medium">Inbox</span>
          </div>
          
          {/* Right side - Search, Notifications, User */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search..."
                className="pl-10 w-64 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
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