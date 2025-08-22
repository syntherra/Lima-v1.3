'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Settings, 
  Palette, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/auth-provider';

interface ProfileDropdownProps {
  className?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  divider?: boolean;
}

export function ProfileDropdown({ className = '' }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { signOut } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Handle sign out with proper error handling and loading states
  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      setIsOpen(false);
      
      // Call the signOut function from AuthProvider
      await signOut();
      
      // Redirect to sign in page after successful sign out
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error signing out:', error);
      // You could add a toast notification here for better UX
      // For now, we'll just log the error and still redirect
      router.push('/auth/signin');
    } finally {
      setIsSigningOut(false);
    }
  };

  const menuItems: MenuItem[] = [
    {
      id: 'profile',
      label: 'View Profile',
      icon: User,
      action: () => {
        router.push('/profile');
        setIsOpen(false);
      }
    },
    {
      id: 'settings',
      label: 'Account Settings',
      icon: Settings,
      action: () => {
        router.push('/settings');
        setIsOpen(false);
      }
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: Palette,
      action: () => {
        router.push('/preferences');
        setIsOpen(false);
      }
    },
    {
      id: 'billing',
      label: 'Billing & Subscription',
      icon: CreditCard,
      action: () => {
        router.push('/billing');
        setIsOpen(false);
      }
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: HelpCircle,
      action: () => {
        router.push('/help');
        setIsOpen(false);
      }
    },
    {
      id: 'logout',
      label: 'Sign Out',
      icon: LogOut,
      divider: true,
      action: async () => {
        await handleSignOut();
      }
    }
  ];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Profile Button */}
      <Button 
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Profile menu"
      >
        <User className="h-4 w-4" />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="py-2">
            {menuItems.map((item, index) => (
              <React.Fragment key={item.id}>
                {item.divider && index > 0 && (
                  <div className="my-1 border-t border-gray-700" />
                )}
                <button
                  onClick={item.action}
                  disabled={item.id === 'logout' && isSigningOut}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-150 text-left ${
                    item.id === 'logout' && isSigningOut ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  role="menuitem"
                >
                  {item.id === 'logout' && isSigningOut ? (
                    <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
                  ) : (
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span>{item.id === 'logout' && isSigningOut ? 'Signing out...' : item.label}</span>
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}