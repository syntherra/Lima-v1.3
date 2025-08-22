'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Menu,
  X,
  Home,
  Users,
  Mail,
  Megaphone,
  FolderOpen,
  Settings,
  Bell,
  Search,
  Bot,
  BarChart3,
  Zap,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useThemeStore } from '@/stores/theme-store';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'CRM', href: '/crm', icon: Users },
  { name: 'Inbox', href: '/inbox', icon: Mail },
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

const aiFeatures = [
  { name: 'AI Assistant', href: '/ai-assistant', icon: Bot },
  { name: 'Automation', href: '/automation', icon: Zap },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { isDark, isSidebarCollapsed, toggleTheme, toggleSidebar } = useThemeStore();

  // Apply theme class to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="h-screen flex overflow-hidden bg-dark-bg">
      {/* Mobile sidebar overlay */}
      {!isSidebarCollapsed && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={toggleSidebar}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-sidebar-bg border-r border-dark-border transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-lg',
          isSidebarCollapsed ? 'w-16' : 'w-64',
          'lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-dark-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-ai-500 to-ai-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              {!isSidebarCollapsed && (
                <span className="text-xl font-bold text-dark-text">Lima</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex text-dark-text hover:bg-dark-border"
              onClick={toggleSidebar}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto">
            {/* Main Navigation */}
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <div key={item.name} className="relative group">
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors relative',
                        isActive
                          ? 'bg-ai-600 text-white'
                          : 'text-dark-text-muted hover:text-dark-text hover:bg-dark-border'
                      )}
                    >
                      <item.icon className={cn('w-5 h-5', isSidebarCollapsed ? 'mx-auto' : 'mr-3')} />
                      {!isSidebarCollapsed && item.name}
                    </Link>
                    {/* Tooltip for collapsed state */}
                    {isSidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                        {item.name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!isSidebarCollapsed && <Separator className="my-4 bg-dark-border" />}

            {/* AI Features */}
            <div className="space-y-1">
              {!isSidebarCollapsed && (
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-dark-text-muted uppercase tracking-wider">
                      AI Features
                    </span>
                    <Badge variant="ai" size="sm">
                      New
                    </Badge>
                  </div>
                </div>
              )}
              {aiFeatures.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <div key={item.name} className="relative group">
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                        isActive
                          ? 'bg-ai-600 text-white'
                          : 'text-dark-text-muted hover:text-dark-text hover:bg-dark-border'
                      )}
                    >
                      <item.icon className={cn('w-5 h-5', isSidebarCollapsed ? 'mx-auto' : 'mr-3')} />
                      {!isSidebarCollapsed && item.name}
                    </Link>
                    {/* Tooltip for collapsed state */}
                    {isSidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                        {item.name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!isSidebarCollapsed && <Separator className="my-4 bg-dark-border" />}

            {/* Settings */}
            <div className="relative group">
              <Link
                href="/settings"
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  pathname === '/settings'
                    ? 'bg-ai-600 text-white'
                    : 'text-dark-text-muted hover:text-dark-text hover:bg-dark-border'
                )}
              >
                <Settings className={cn('w-5 h-5', isSidebarCollapsed ? 'mx-auto' : 'mr-3')} />
                {!isSidebarCollapsed && 'Settings'}
              </Link>
              {/* Tooltip for collapsed state */}
              {isSidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  Settings
                </div>
              )}
            </div>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-dark-border">
            <div className={cn('flex items-center', isSidebarCollapsed ? 'justify-center' : 'space-x-3')}>
              <Avatar size="md">
                <AvatarImage src="/avatars/user.jpg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              {!isSidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark-text truncate">
                    John Doe
                  </p>
                  <p className="text-xs text-dark-text-muted truncate">
                    john@company.com
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-sidebar-bg border-b border-dark-border px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-dark-text hover:bg-dark-border"
                onClick={toggleSidebar}
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-text-muted" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 text-sm bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ai-500 focus:border-transparent text-dark-text placeholder-dark-text-muted"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-dark-text hover:bg-dark-border"
                onClick={toggleTheme}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative text-dark-text hover:bg-dark-border">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              </Button>

              {/* User Menu */}
              <Avatar size="sm">
                <AvatarImage src="/avatars/user.jpg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page content with dark background wrapper */}
        <main className="flex-1 overflow-y-auto bg-main-bg p-6">
          <div className="max-w-7xl mx-auto bg-content-bg rounded-xl shadow-sm p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}