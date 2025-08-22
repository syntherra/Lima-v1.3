'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Menu,
  Bell,
  Search,
  Settings,
  LogOut,
  User,
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <Badge 
                  variant="destructive" 
                  size="sm" 
                  className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[300px] bg-card border border-border rounded-lg shadow-lg p-2 z-50"
                sideOffset={5}
              >
                <div className="px-3 py-2 border-b border-border">
                  <h3 className="font-semibold text-sm text-foreground">Notifications</h3>
                </div>
                <div className="py-2">
                  <div className="px-3 py-2 hover:bg-accent rounded-md cursor-pointer">
                    <p className="text-sm font-medium text-foreground">New lead assigned</p>
                    <p className="text-xs text-muted-foreground">John Smith from TechCorp</p>
                  </div>
                  <div className="px-3 py-2 hover:bg-accent rounded-md cursor-pointer">
                    <p className="text-sm font-medium text-foreground">Campaign completed</p>
                    <p className="text-xs text-muted-foreground">Q4 Email Campaign finished</p>
                  </div>
                  <div className="px-3 py-2 hover:bg-accent rounded-md cursor-pointer">
                    <p className="text-sm font-medium text-foreground">AI insight available</p>
                    <p className="text-xs text-muted-foreground">New optimization suggestions</p>
                  </div>
                </div>
                <DropdownMenu.Separator className="h-px bg-border my-1" />
                <div className="px-3 py-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    View all notifications
                  </Button>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {/* User Menu */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost" className="p-1 h-auto">
                <Avatar size="sm">
                  <AvatarImage src="/avatars/user.jpg" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[200px] bg-card border border-border rounded-lg shadow-lg p-2 z-50"
                sideOffset={5}
                align="end"
              >
                <div className="px-3 py-2 border-b border-border">
                  <p className="font-medium text-sm text-foreground">John Doe</p>
                  <p className="text-xs text-muted-foreground">john@company.com</p>
                </div>
                <div className="py-2">
                  <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md cursor-pointer outline-none">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md cursor-pointer outline-none">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenu.Item>
                </div>
                <DropdownMenu.Separator className="h-px bg-border my-1" />
                <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm text-destructive hover:bg-accent rounded-md cursor-pointer outline-none">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
}