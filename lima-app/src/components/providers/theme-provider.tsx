'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/stores/theme-store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    setMounted(true);
    
    // Initialize theme from localStorage or system preference
    try {
      const savedTheme = localStorage.getItem('lima-theme-storage');
      if (savedTheme) {
        const parsed = JSON.parse(savedTheme);
        if (parsed.theme && parsed.theme !== theme) {
          setTheme(parsed.theme);
        }
      } else {
        // Use system preference if no saved theme
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setTheme(systemTheme);
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
      // Fallback to system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Apply current theme to document
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [mounted, theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a theme
      const hasManualTheme = localStorage.getItem('lima-theme-storage');
      if (!hasManualTheme) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted, setTheme]);

  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}