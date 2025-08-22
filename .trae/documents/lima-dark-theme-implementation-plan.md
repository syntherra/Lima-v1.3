# Lima Dark Theme Implementation Plan

## 1. Implementation Overview

This document provides a detailed implementation plan for integrating the dark theme design language analyzed from the reference dashboard into Lima's existing UI system.

## 2. Technical Architecture Updates

### 2.1 Theme System Architecture

```typescript
// types/theme.ts
export interface ThemeConfig {
  mode: 'light' | 'dark';
  sidebar: {
    collapsed: boolean;
    width: {
      expanded: number;
      collapsed: number;
    };
  };
  colors: {
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    card: {
      background: string;
      border: string;
    };
    text: {
      primary: string;
      secondary: string;
    };
  };
}

// stores/theme-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  isDark: boolean;
  sidebarCollapsed: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setTheme: (isDark: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(persist(
  (set) => ({
    isDark: false,
    sidebarCollapsed: false,
    toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    setTheme: (isDark) => set({ isDark }),
    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  }),
  {
    name: 'lima-theme-storage',
  }
));
```

### 2.2 Updated Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        'dark-primary': '#0a0a0a',
        'dark-secondary': '#1a1a1a',
        'dark-tertiary': '#2a2a2a',
        'dark-card': '#ffffff',
        'dark-card-alt': '#1e1e1e',
        
        // Lima brand colors (dark-optimized)
        'ai': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        
        // Status colors (dark-optimized)
        'success-dark': '#10b981',
        'warning-dark': '#f59e0b',
        'error-dark': '#ef4444',
        'info-dark': '#3b82f6',
      },
      
      animation: {
        'sidebar-expand': 'sidebarExpand 300ms ease-in-out',
        'sidebar-collapse': 'sidebarCollapse 300ms ease-in-out',
        'theme-transition': 'themeTransition 200ms ease-in-out',
      },
      
      keyframes: {
        sidebarExpand: {
          '0%': { width: '64px' },
          '100%': { width: '280px' },
        },
        sidebarCollapse: {
          '0%': { width: '280px' },
          '100%': { width: '64px' },
        },
        themeTransition: {
          '0%': { opacity: '0.8' },
          '100%': { opacity: '1' },
        },
      },
      
      boxShadow: {
        'dark-card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'dark-elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
```

## 3. Component Implementation Updates

### 3.1 Enhanced DashboardLayout Component

```typescript
// components/layout/dashboard-layout.tsx
'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/stores/theme-store';
import {
  Home, Users, Mail, Megaphone, FolderOpen, BarChart3,
  Bot, Zap, Settings, Menu, X, Search, Bell,
  Moon, Sun, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
  const { isDark, sidebarCollapsed, toggleTheme, toggleSidebar } = useThemeStore();
  const pathname = usePathname();

  // Apply theme class to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className={cn(
      'h-screen flex overflow-hidden transition-colors duration-200',
      isDark ? 'bg-dark-primary' : 'bg-background'
    )}>
      {/* Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out lg:static lg:inset-0',
        'border-r border-opacity-20',
        isDark ? 'bg-dark-secondary border-white' : 'bg-card border-border',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}>
        <div className="flex flex-col h-full">
          {/* Logo & Collapse Toggle */}
          <div className={cn(
            'flex items-center justify-between h-16 px-4 border-b border-opacity-20',
            isDark ? 'border-white' : 'border-border'
          )}>
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-ai-500 to-ai-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className={cn(
                  'text-xl font-bold',
                  isDark ? 'text-white' : 'text-foreground'
                )}>Lima</span>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className={cn(
                'transition-colors',
                isDark ? 'text-white hover:bg-white/10' : 'text-foreground hover:bg-accent'
              )}
            >
              {sidebarCollapsed ? 
                <ChevronRight className="w-4 h-4" /> : 
                <ChevronLeft className="w-4 h-4" />
              }
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            {/* Main Navigation */}
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                      'group relative',
                      isActive
                        ? 'bg-ai-500 text-white shadow-lg'
                        : isDark
                        ? 'text-gray-300 hover:text-white hover:bg-white/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                      sidebarCollapsed && 'justify-center'
                    )}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <item.icon className={cn(
                      'w-5 h-5 transition-colors',
                      sidebarCollapsed ? '' : 'mr-3'
                    )} />
                    {!sidebarCollapsed && item.name}
                    
                    {/* Tooltip for collapsed state */}
                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>

            {!sidebarCollapsed && <Separator className={cn(
              'my-4',
              isDark ? 'bg-white/20' : 'bg-border'
            )} />}

            {/* AI Features */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <span className={cn(
                      'text-xs font-semibold uppercase tracking-wider',
                      isDark ? 'text-gray-400' : 'text-muted-foreground'
                    )}>
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
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                      'group relative',
                      isActive
                        ? 'bg-ai-100 text-ai-700 dark:bg-ai-900 dark:text-ai-300'
                        : isDark
                        ? 'text-gray-300 hover:text-white hover:bg-white/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                      sidebarCollapsed && 'justify-center'
                    )}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <item.icon className={cn(
                      'w-5 h-5 transition-colors',
                      sidebarCollapsed ? '' : 'mr-3'
                    )} />
                    {!sidebarCollapsed && item.name}
                    
                    {/* Tooltip for collapsed state */}
                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>

            {!sidebarCollapsed && <Separator className={cn(
              'my-4',
              isDark ? 'bg-white/20' : 'bg-border'
            )} />}

            {/* Settings */}
            <Link
              href="/settings"
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                'group relative',
                pathname === '/settings'
                  ? 'bg-ai-500 text-white'
                  : isDark
                  ? 'text-gray-300 hover:text-white hover:bg-white/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                sidebarCollapsed && 'justify-center'
              )}
              title={sidebarCollapsed ? 'Settings' : undefined}
            >
              <Settings className={cn(
                'w-5 h-5 transition-colors',
                sidebarCollapsed ? '' : 'mr-3'
              )} />
              {!sidebarCollapsed && 'Settings'}
              
              {/* Tooltip for collapsed state */}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  Settings
                </div>
              )}
            </Link>
          </nav>

          {/* User Profile */}
          {!sidebarCollapsed && (
            <div className={cn(
              'p-4 border-t border-opacity-20',
              isDark ? 'border-white' : 'border-border'
            )}>
              <div className="flex items-center space-x-3">
                <Avatar size="md">
                  <AvatarImage src="/avatars/user.jpg" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm font-medium truncate',
                    isDark ? 'text-white' : 'text-foreground'
                  )}>
                    John Doe
                  </p>
                  <p className={cn(
                    'text-xs truncate',
                    isDark ? 'text-gray-400' : 'text-muted-foreground'
                  )}>
                    john@company.com
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={cn(
          'border-b border-opacity-20 px-6 py-4',
          isDark ? 'bg-dark-secondary border-white' : 'bg-card border-border'
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className={cn(
                  'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4',
                  isDark ? 'text-gray-400' : 'text-muted-foreground'
                )} />
                <input
                  type="text"
                  placeholder="Search..."
                  className={cn(
                    'pl-10 pr-4 py-2 w-64 text-sm rounded-lg border transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-ai-500 focus:border-transparent',
                    isDark
                      ? 'bg-dark-tertiary border-white/20 text-white placeholder-gray-400'
                      : 'bg-background border-input text-foreground'
                  )}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className={cn(
                  'transition-colors',
                  isDark ? 'text-white hover:bg-white/10' : 'text-foreground hover:bg-accent'
                )}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'relative transition-colors',
                  isDark ? 'text-white hover:bg-white/10' : 'text-foreground hover:bg-accent'
                )}
              >
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

        {/* Page content */}
        <main className={cn(
          'flex-1 overflow-y-auto p-6 transition-colors duration-200',
          isDark ? 'bg-dark-primary' : 'bg-background'
        )}>
          <div className="animate-theme-transition">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
```

### 3.2 Enhanced Card Component

```typescript
// components/ui/card.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/stores/theme-store';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'dark' | 'elevated';
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const { isDark } = useThemeStore();
  
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border transition-all duration-200',
        {
          'default': isDark
            ? 'bg-white text-gray-900 border-white/20 shadow-dark-card'
            : 'bg-card text-card-foreground border-border shadow-sm',
          'dark': 'bg-dark-card-alt text-white border-white/20 shadow-dark-card',
          'elevated': isDark
            ? 'bg-white text-gray-900 border-white/20 shadow-dark-elevated'
            : 'bg-card text-card-foreground border-border shadow-lg',
        }[variant],
        className
      )}
      {...props}
    />
  );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { isDark } = useThemeStore();
  
  return (
    <p
      ref={ref}
      className={cn(
        'text-sm',
        isDark ? 'text-gray-600' : 'text-muted-foreground',
        className
      )}
      {...props}
    />
  );
});
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

## 4. Implementation Steps

### Step 1: Theme Store Setup
1. Create the theme store with Zustand
2. Add persistence for user preferences
3. Implement theme and sidebar state management

### Step 2: Tailwind Configuration
1. Update tailwind.config.js with dark theme colors
2. Add custom animations and shadows
3. Configure dark mode class strategy

### Step 3: Layout Component Updates
1. Replace existing DashboardLayout with enhanced version
2. Add collapsible sidebar functionality
3. Implement theme toggle in header
4. Add tooltips for collapsed sidebar items

### Step 4: Component Library Updates
1. Update Card component with dark theme variants
2. Enhance Button, Input, and other UI components
3. Add theme-aware styling to all components

### Step 5: Page-Specific Updates
1. Update Dashboard page with new card styling
2. Adapt CRM, Inbox, and other pages
3. Ensure consistent dark theme across all pages

### Step 6: Testing & Polish
1. Test theme switching functionality
2. Verify responsive behavior
3. Check accessibility compliance
4. Add smooth transitions and animations

## 5. Migration Checklist

- [ ] Install and configure Zustand for theme management
- [ ] Update Tailwind configuration with dark theme colors
- [ ] Replace DashboardLayout component
- [ ] Update Card and other UI components
- [ ] Add theme toggle functionality
- [ ] Implement collapsible sidebar
- [ ] Update all page components
- [ ] Test responsive behavior
- [ ] Verify accessibility standards
- [ ] Add loading states and transitions

This implementation plan provides a comprehensive roadmap for integrating the dark theme design language while maintaining Lima's existing functionality and brand identity.