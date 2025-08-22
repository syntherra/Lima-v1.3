'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  X,
  Home,
  Users,
  Mail,
  Megaphone,
  FolderOpen,
  Settings,
  Bot,
  BarChart3,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
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

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-ai-500 to-ai-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">Lima</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {/* Main Navigation */}
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                    onClick={() => {
                      // Close mobile sidebar when navigating
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <Separator className="my-4" />

            {/* AI Features */}
            <div className="space-y-1">
              <div className="px-3 py-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    AI Features
                  </span>
                  <Badge variant="ai" size="sm">
                    New
                  </Badge>
                </div>
              </div>
              {aiFeatures.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-ai-100 text-ai-700 dark:bg-ai-900 dark:text-ai-300'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                    onClick={() => {
                      // Close mobile sidebar when navigating
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <Separator className="my-4" />

            {/* Settings */}
            <Link
              href="/settings"
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                pathname === '/settings'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
              onClick={() => {
                // Close mobile sidebar when navigating
                if (window.innerWidth < 1024) {
                  onClose();
                }
              }}
            >
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </Link>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3">
              <Avatar size="md">
                <AvatarImage src="/avatars/user.jpg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  John Doe
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  john@company.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}