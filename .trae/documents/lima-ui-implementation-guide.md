# Lima UI System Implementation Guide

## 1. Implementation Overview

This guide provides step-by-step instructions for implementing the modern, minimal, and intuitive UI system for Lima AI Growth Operating System. The implementation focuses on rebuilding the existing UI components with improved design patterns, better accessibility, and enhanced user experience.

## 2. Technology Stack Updates

### Current Stack Analysis
- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, Headless UI
- **Icons**: Lucide React
- **State Management**: Zustand
- **Database**: Supabase

### Recommended Additions
```json
{
  "dependencies": {
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-badge": "^1.0.4",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "framer-motion": "^10.16.16",
    "react-hook-form": "^7.48.2",
    "@hookform/resolvers": "^3.3.2",
    "zod": "^3.22.4",
    "recharts": "^2.8.0",
    "cmdk": "^0.2.0"
  },
  "devDependencies": {
    "@storybook/react": "^7.6.3",
    "chromatic": "^8.0.0"
  }
}
```

## 3. File Structure Reorganization

### New Component Architecture
```
src/
├── components/
│   ├── ui/                     # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── progress.tsx
│   │   ├── separator.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   └── index.ts
│   ├── layout/                 # Layout components
│   │   ├── dashboard-layout.tsx
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── navigation.tsx
│   │   └── mobile-nav.tsx
│   ├── dashboard/              # Dashboard-specific components
│   │   ├── metric-card.tsx
│   │   ├── growth-pulse.tsx
│   │   ├── ai-activity-feed.tsx
│   │   ├── insights-panel.tsx
│   │   └── performance-chart.tsx
│   ├── crm/                    # CRM-specific components
│   │   ├── company-card.tsx
│   │   ├── contact-card.tsx
│   │   ├── relationship-map.tsx
│   │   ├── crm-filters.tsx
│   │   └── crm-table.tsx
│   ├── email/                  # Email-specific components
│   │   ├── email-list.tsx
│   │   ├── email-thread.tsx
│   │   ├── compose-modal.tsx
│   │   ├── ai-assistant.tsx
│   │   └── email-filters.tsx
│   ├── campaigns/              # Campaign-specific components
│   │   ├── campaign-builder.tsx
│   │   ├── target-selector.tsx
│   │   ├── template-editor.tsx
│   │   └── campaign-analytics.tsx
│   └── common/                 # Shared components
│       ├── loading-states.tsx
│       ├── empty-states.tsx
│       ├── error-boundary.tsx
│       ├── search-bar.tsx
│       └── data-table.tsx
├── styles/
│   ├── globals.css
│   ├── components.css
│   └── utilities.css
└── lib/
    ├── utils.ts
    ├── cn.ts
    └── animations.ts
```

## 4. Core UI Components Implementation

### Button Component
```typescript
// src/components/ui/button.tsx
import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-lima-primary-500 text-white hover:bg-lima-primary-600 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-lima-primary-500',
        secondary: 'bg-white text-lima-text-primary border border-lima-border-primary hover:bg-lima-bg-secondary hover:border-lima-border-secondary',
        ai: 'bg-gradient-to-r from-lima-ai-500 to-lima-ai-600 text-white hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-lima-ai-500',
        success: 'bg-lima-success-500 text-white hover:bg-lima-success-600 hover:-translate-y-0.5 hover:shadow-lg',
        destructive: 'bg-lima-error-500 text-white hover:bg-lima-error-600 hover:-translate-y-0.5 hover:shadow-lg',
        outline: 'border border-lima-border-primary bg-transparent hover:bg-lima-bg-secondary',
        ghost: 'hover:bg-lima-bg-secondary hover:text-lima-text-primary',
        link: 'text-lima-primary-500 underline-offset-4 hover:underline'
      },
      size: {
        xs: 'h-8 px-3 text-xs',
        sm: 'h-9 px-4 text-sm',
        md: 'h-10 px-5 text-sm',
        lg: 'h-11 px-6 text-base',
        xl: 'h-12 px-8 text-lg'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

### Card Component
```typescript
// src/components/ui/card.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-xl border bg-lima-bg-elevated text-lima-text-primary shadow-sm transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-lima-border-primary hover:border-lima-border-secondary hover:shadow-md',
        elevated: 'border-lima-border-primary shadow-lg hover:shadow-xl',
        metric: 'bg-gradient-to-br from-lima-primary-500 to-lima-primary-600 text-white border-none shadow-lg',
        ai: 'bg-gradient-to-br from-lima-ai-50 to-lima-ai-100 border-lima-ai-200',
        success: 'bg-gradient-to-br from-lima-success-50 to-lima-success-100 border-lima-success-200',
        warning: 'bg-gradient-to-br from-lima-warning-50 to-lima-warning-100 border-lima-warning-200'
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
      }
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md'
    }
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-6', className)}
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
    className={cn('text-heading-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-body-sm text-lima-text-secondary', className)
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-6', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
};
```

### Input Component
```typescript
// src/components/ui/input.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex w-full rounded-lg border bg-white px-4 py-2.5 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-lima-text-quaternary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-lima-border-primary focus-visible:border-lima-border-focus focus-visible:ring-lima-primary-500/20',
        error: 'border-lima-border-error focus-visible:border-lima-border-error focus-visible:ring-lima-error-500/20',
        success: 'border-lima-success-500 focus-visible:border-lima-success-500 focus-visible:ring-lima-success-500/20'
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-5 text-base'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input, inputVariants };
```

## 5. Layout Components Implementation

### Modern Dashboard Layout
```typescript
// src/components/layout/dashboard-layout.tsx
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { MobileNav } from './mobile-nav';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-lima-bg-secondary">
      {/* Mobile Navigation */}
      <MobileNav 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      
      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:h-screen">
        {/* Sidebar */}
        <div className="flex w-80 flex-col">
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header user={user} />
          <main className={cn('flex-1 overflow-y-auto p-8', className)}>
            {children}
          </main>
        </div>
      </div>
      
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <Header user={user} onMenuClick={() => setSidebarOpen(true)} />
        <main className={cn('p-4', className)}>
          {children}
        </main>
      </div>
    </div>
  );
}
```

### Enhanced Sidebar
```typescript
// src/components/layout/sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Mail, 
  Target, 
  FolderKanban,
  Settings,
  Bot,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'CRM', href: '/crm', icon: Users },
  { name: 'Inbox', href: '/inbox', icon: Mail, badge: '3' },
  { name: 'Campaigns', href: '/campaigns', icon: Target },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
];

const aiFeatures = [
  { name: 'AI Assistant', href: '/ai', icon: Bot, badge: 'New' },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white border-r border-lima-border-primary">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-lima-primary-500 to-lima-primary-600" />
          <span className="text-xl font-bold text-lima-text-primary">Lima</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start h-11 px-4',
                    isActive && 'bg-lima-primary-50 text-lima-primary-700 border-lima-primary-200'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            );
          })}
        </div>
        
        {/* AI Features Section */}
        <div className="pt-6">
          <h3 className="px-4 text-xs font-semibold text-lima-text-tertiary uppercase tracking-wider mb-2">
            AI Features
          </h3>
          <div className="space-y-1">
            {aiFeatures.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? 'ai' : 'ghost'}
                    className={cn(
                      'w-full justify-start h-11 px-4',
                      isActive && 'bg-lima-ai-50 text-lima-ai-700 border-lima-ai-200'
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                    {item.badge && (
                      <Badge variant="ai" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      
      {/* Settings */}
      <div className="p-4 border-t border-lima-border-primary">
        <Link href="/settings">
          <Button variant="ghost" className="w-full justify-start h-11 px-4">
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Button>
        </Link>
      </div>
    </div>
  );
}
```

## 6. Dashboard Components Implementation

### Metric Card Component
```typescript
// src/components/dashboard/metric-card.tsx
import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  variant?: 'default' | 'metric' | 'ai' | 'success';
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  variant = 'default',
  className
}: MetricCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  return (
    <Card variant={variant} className={cn('relative overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className={cn(
              'text-sm font-medium',
              variant === 'metric' ? 'text-white/80' : 'text-lima-text-secondary'
            )}>
              {title}
            </p>
            <p className={cn(
              'text-3xl font-bold',
              variant === 'metric' ? 'text-white' : 'text-lima-text-primary'
            )}>
              {value}
            </p>
            {change !== undefined && (
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={isPositive ? 'success' : isNegative ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {isPositive && <TrendingUp className="w-3 h-3 mr-1" />}
                  {isNegative && <TrendingDown className="w-3 h-3 mr-1" />}
                  {Math.abs(change)}%
                </Badge>
                {changeLabel && (
                  <span className={cn(
                    'text-xs',
                    variant === 'metric' ? 'text-white/60' : 'text-lima-text-tertiary'
                  )}>
                    {changeLabel}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className={cn(
            'p-3 rounded-xl',
            variant === 'metric' 
              ? 'bg-white/20' 
              : 'bg-lima-bg-secondary'
          )}>
            <Icon className={cn(
              'h-6 w-6',
              variant === 'metric' ? 'text-white' : 'text-lima-text-secondary'
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

## 7. Tailwind Configuration Updates

### Enhanced tailwind.config.js
```javascript
// tailwind.config.js
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        lima: {
          primary: {
            50: '#EFF6FF',
            100: '#DBEAFE',
            500: '#3B82F6',
            600: '#2563EB',
            700: '#1D4ED8',
            900: '#1E3A8A',
          },
          success: {
            50: '#ECFDF5',
            100: '#D1FAE5',
            500: '#10B981',
            600: '#059669',
            700: '#047857',
          },
          ai: {
            50: '#F5F3FF',
            100: '#EDE9FE',
            200: '#DDD6FE',
            500: '#8B5CF6',
            600: '#7C3AED',
            700: '#6D28D9',
          },
          warning: {
            50: '#FFFBEB',
            100: '#FEF3C7',
            500: '#F59E0B',
            600: '#D97706',
          },
          error: {
            50: '#FEF2F2',
            100: '#FEE2E2',
            500: '#EF4444',
            600: '#DC2626',
          },
          bg: {
            primary: '#FFFFFF',
            secondary: '#F8FAFC',
            tertiary: '#F1F5F9',
            elevated: '#FFFFFF',
          },
          text: {
            primary: '#0F172A',
            secondary: '#475569',
            tertiary: '#64748B',
            quaternary: '#94A3B8',
            inverse: '#FFFFFF',
          },
          border: {
            primary: '#E2E8F0',
            secondary: '#CBD5E1',
            focus: '#3B82F6',
            error: '#EF4444',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        mono: ['JetBrains Mono', ...fontFamily.mono],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
        'display-xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
        'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
        'display-sm': ['1.875rem', { lineHeight: '1.3' }],
        'heading-xl': ['1.5rem', { lineHeight: '1.4' }],
        'heading-lg': ['1.25rem', { lineHeight: '1.4' }],
        'heading-md': ['1.125rem', { lineHeight: '1.4' }],
        'heading-sm': ['1rem', { lineHeight: '1.5' }],
        'body-xl': ['1.25rem', { lineHeight: '1.6' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body-md': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'body-xs': ['0.75rem', { lineHeight: '1.5' }],
        'label-lg': ['0.875rem', { lineHeight: '1.4' }],
        'label-md': ['0.75rem', { lineHeight: '1.4' }],
        'label-sm': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.05em', textTransform: 'uppercase' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

## 8. Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
1. **Setup & Configuration**
   - Install new dependencies
   - Update Tailwind configuration
   - Create base utility functions

2. **Core UI Components**
   - Button, Card, Input components
   - Badge, Avatar, Progress components
   - Toast notification system

### Phase 2: Layout & Navigation (Week 3-4)
1. **Layout Components**
   - Enhanced dashboard layout
   - Modern sidebar with AI features section
   - Responsive header and mobile navigation

2. **Navigation System**
   - Active state management
   - Breadcrumb navigation
   - Command palette (search)

### Phase 3: Dashboard Rebuild (Week 5-6)
1. **Dashboard Components**
   - Metric cards with animations
   - Growth pulse visualization
   - AI activity feed
   - Predictive insights panel

2. **Data Visualization**
   - Performance charts
   - Progress indicators
   - Trend visualizations

### Phase 4: Feature Pages (Week 7-10)
1. **CRM Interface**
   - Company and contact cards
   - Advanced filtering system
   - Relationship mapping
   - Bulk operations

2. **Email Interface**
   - Modern inbox layout
   - Thread view improvements
   - AI assistant integration
   - Compose modal enhancement

3. **Campaign Builder**
   - Step-by-step wizard
   - Target audience selector
   - Template editor
   - Performance analytics

### Phase 5: Polish & Optimization (Week 11-12)
1. **Accessibility**
   - ARIA labels and roles
   - Keyboard navigation
   - Screen reader support
   - Color contrast validation

2. **Performance**
   - Component lazy loading
   - Image optimization
   - Bundle size optimization
   - Loading state improvements

## 9. Testing Strategy

### Component Testing
```typescript
// Example test for Button component
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with correct variant styles', () => {
    render(<Button variant="primary">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-lima-primary-500');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Visual Regression Testing
- Storybook for component documentation
- Chromatic for visual testing
- Percy for cross-browser testing

## 10. Migration Strategy

### Gradual Migration Approach
1. **Component-by-Component**: Replace existing components one at a time
2. **Feature Flags**: Use feature flags to toggle between old and new UI
3. **A/B Testing**: Test new components with subset of users
4. **Rollback Plan**: Maintain ability to revert to previous version

### Data Migration
- No database changes required
- CSS class updates in existing components
- Component prop updates for new API

This implementation guide provides a comprehensive roadmap for rebuilding Lima's UI system with modern, minimal, and intuitive design principles. The phased approach ensures minimal disruption while delivering significant improvements to user experience.