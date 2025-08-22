// Lima Design System - TypeScript Configuration
// This file provides type-safe access to design tokens and utility functions

export interface LimaTheme {
  colors: {
    primary: {
      50: string;
      100: string;
      500: string;
      600: string;
      700: string;
      900: string;
    };
    success: {
      50: string;
      500: string;
      600: string;
    };
    warning: {
      50: string;
      500: string;
    };
    error: {
      50: string;
      500: string;
    };
    ai: {
      50: string;
      500: string;
      600: string;
    };
    accent: {
      500: string;
      600: string;
    };
    neutral: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  };
  spacing: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    8: string;
    10: string;
    12: string;
    16: string;
    20: string;
    24: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontSizes: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeights: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
      extrabold: number;
    };
    lineHeights: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
}

export const limaTheme: LimaTheme = {
  colors: {
    primary: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      500: '#2563EB',
      600: '#1D4ED8',
      700: '#1E40AF',
      900: '#1E3A8A',
    },
    success: {
      50: '#ECFDF5',
      500: '#10B981',
      600: '#059669',
    },
    warning: {
      50: '#FFFBEB',
      500: '#F59E0B',
    },
    error: {
      50: '#FEF2F2',
      500: '#EF4444',
    },
    ai: {
      50: '#F5F3FF',
      500: '#8B5CF6',
      600: '#7C3AED',
    },
    accent: {
      500: '#FF6B35',
      600: '#E55A2B',
    },
    neutral: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
  },
  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 15px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 20px 25px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 25px 50px rgba(0, 0, 0, 0.25)',
  },
  typography: {
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
};

// Component variant types
export type ButtonVariant = 'primary' | 'secondary' | 'ai' | 'success' | 'warning' | 'error';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type BadgeVariant = 'success' | 'warning' | 'error' | 'ai' | 'primary' | 'neutral';
export type CardVariant = 'default' | 'elevated' | 'metric' | 'interactive';
export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

// Utility functions for design system
export class LimaDesignUtils {
  static getButtonClasses(variant: ButtonVariant, size: ButtonSize = 'md'): string {
    const baseClasses = 'lima-btn';
    const variantClasses = `lima-btn-${variant}`;
    const sizeClasses = size !== 'md' ? `lima-btn-${size}` : '';
    
    return [baseClasses, variantClasses, sizeClasses].filter(Boolean).join(' ');
  }

  static getBadgeClasses(variant: BadgeVariant): string {
    return `lima-badge lima-badge-${variant}`;
  }

  static getCardClasses(variant: CardVariant = 'default'): string {
    const baseClasses = 'lima-card';
    const variantClasses = variant !== 'default' ? `lima-card-${variant}` : '';
    
    return [baseClasses, variantClasses].filter(Boolean).join(' ');
  }

  static getAvatarClasses(size: AvatarSize = 'md'): string {
    return `lima-avatar lima-avatar-${size}`;
  }

  static getTextClasses(
    variant: 'display' | 'heading' | 'body' | 'label',
    size: 'sm' | 'md' | 'lg' | 'xl' = 'md'
  ): string {
    return `text-${variant}-${size}`;
  }

  // Progress calculation utility
  static calculateProgress(current: number, total: number): number {
    if (total === 0) return 0;
    return Math.min(Math.max((current / total) * 100, 0), 100);
  }

  // Color utilities
  static getStatusColor(status: string): string {
    const statusColorMap: Record<string, string> = {
      active: 'var(--lima-success)',
      pending: 'var(--lima-warning)',
      inactive: 'var(--lima-text-muted)',
      error: 'var(--lima-error)',
      ai: 'var(--lima-ai)',
      completed: 'var(--lima-success)',
      draft: 'var(--lima-text-muted)',
      sent: 'var(--lima-primary)',
      opened: 'var(--lima-warning)',
      replied: 'var(--lima-success)',
      bounced: 'var(--lima-error)',
    };
    
    return statusColorMap[status.toLowerCase()] || 'var(--lima-text-muted)';
  }

  // Animation utilities
  static getHoverTransform(intensity: 'subtle' | 'medium' | 'strong' = 'medium'): string {
    const transforms = {
      subtle: 'translateY(-1px)',
      medium: 'translateY(-2px)',
      strong: 'translateY(-4px)',
    };
    return transforms[intensity];
  }

  // Responsive breakpoint utilities
  static breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  };

  static mediaQuery(breakpoint: keyof typeof LimaDesignUtils.breakpoints): string {
    return `@media (min-width: ${LimaDesignUtils.breakpoints[breakpoint]})`;
  }
}

// Context-specific design patterns
export const LimaPatterns = {
  // CRM-specific patterns
  crm: {
    contactCard: 'lima-card lima-card-interactive',
    pipelineStage: 'lima-badge lima-badge-primary',
    urgentContact: 'lima-badge lima-badge-error',
    aiSuggestion: 'lima-badge lima-badge-ai',
  },
  
  // Campaign-specific patterns
  campaign: {
    activeCard: 'lima-card lima-card-elevated',
    performanceMetric: 'lima-metric-card',
    campaignStatus: {
      draft: 'lima-badge lima-badge-neutral',
      active: 'lima-badge lima-badge-success',
      paused: 'lima-badge lima-badge-warning',
      completed: 'lima-badge lima-badge-primary',
    },
  },
  
  // Email-specific patterns
  email: {
    threadCard: 'lima-card',
    unreadBadge: 'lima-badge lima-badge-primary',
    priorityHigh: 'lima-badge lima-badge-error',
    aiGenerated: 'lima-badge lima-badge-ai',
    replyButton: 'lima-btn lima-btn-primary lima-btn-sm',
  },
  
  // Task-specific patterns
  task: {
    kanbanCard: 'lima-card lima-card-interactive',
    priority: {
      low: 'lima-badge lima-badge-neutral',
      medium: 'lima-badge lima-badge-warning',
      high: 'lima-badge lima-badge-error',
      urgent: 'lima-badge lima-badge-error',
    },
    assignee: {
      user: 'lima-avatar lima-avatar-sm',
      ai: 'lima-avatar lima-avatar-sm bg-ai',
    },
  },
  
  // Dashboard-specific patterns
  dashboard: {
    metricCard: 'lima-metric-card',
    summaryCard: 'lima-card lima-card-elevated',
    chartContainer: 'lima-card',
    actionButton: 'lima-btn lima-btn-ai',
  },
};

// Export design system for global use
export default {
  theme: limaTheme,
  utils: LimaDesignUtils,
  patterns: LimaPatterns,
};