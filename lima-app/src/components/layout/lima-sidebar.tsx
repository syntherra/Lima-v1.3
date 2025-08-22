'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useLimaStatesStore, useActiveState, useCurrentState, useActiveMenuItems, useLimaStatesActions } from '@/stores/lima-states-store';
import { LIMA_STATES_ARRAY, LIMA_STATES } from '@/constants/lima-states';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface LimaSidebarProps {
  className?: string;
}

export function LimaSidebar({ className }: LimaSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isSidebarCollapsed = useLimaStatesStore(state => state.isSidebarCollapsed);
  const activeState = useActiveState();
  const currentState = useCurrentState();
  const activeMenuItems = useActiveMenuItems();
  const activeMenuItem = useLimaStatesStore(state => state.activeMenuItem);
  const { setActiveState, setActiveMenuItem, toggleSidebar, navigateToState } = useLimaStatesActions();

  // Auto-detect active state and menu item based on current pathname
  useEffect(() => {
    // Find the matching state and menu item based on current pathname
    for (const [stateId, state] of Object.entries(LIMA_STATES)) {
      for (const menuItem of state.menuItems) {
        if (pathname === menuItem.route) {
          // Only update if different from current state
          if (activeState !== stateId) {
            setActiveState(stateId as any);
          }
          // Only update if different from current menu item
          if (activeMenuItem !== menuItem.id) {
            setActiveMenuItem(menuItem.id);
          }
          return;
        }
      }
    }
  }, [pathname, activeState, activeMenuItem, setActiveState, setActiveMenuItem]);

  const handleStateChange = (stateId: string) => {
    setActiveState(stateId as any);
    const newState = LIMA_STATES_ARRAY.find(s => s.id === stateId);
    if (newState) {
      router.push(newState.defaultRoute);
    }
  };

  const handleMenuItemClick = (itemId: string) => {
    setActiveMenuItem(itemId);
    const menuItem = activeMenuItems.find(item => item.id === itemId);
    if (menuItem) {
      router.push(menuItem.route);
    }
  };

  return (
    <TooltipProvider>
      <div className={cn(
        'flex h-full flex-col border-r border-gray-800 bg-gray-900 transition-all duration-300',
        isSidebarCollapsed ? 'w-16' : 'w-64',
        className
      )}>
        {/* Top Section - Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-800">
          {!isSidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white font-bold text-sm">
                L
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Lima</span>
                <span className="text-xs text-gray-400">AI Powered Growth OS</span>
              </div>
            </div>
          )}
          
          {isSidebarCollapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white font-bold text-sm mx-auto">
              L
            </div>
          )}
          
          {!isSidebarCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Collapse/Expand Button for Collapsed State */}
        {isSidebarCollapsed && (
          <div className="flex justify-center py-2 border-b border-gray-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Middle Section - Contextual Menu */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-2">
              {!isSidebarCollapsed && (
                <div className="mb-2">
                  <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {currentState.name}
                  </h3>
                </div>
              )}
              
              <nav className="space-y-1">
                {activeMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeMenuItem === item.id;
                  
                  const menuButton = (
                    <Button
                      key={item.id}
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        isSidebarCollapsed ? 'h-10 w-10 p-0' : 'h-9 px-2',
                        isActive 
                          ? 'bg-gray-800 text-white border border-gray-700' 
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      )}
                      onClick={() => handleMenuItemClick(item.id)}
                    >
                      <Icon className={cn(
                        'h-4 w-4 flex-shrink-0',
                        isSidebarCollapsed ? 'mx-auto' : 'mr-2'
                      )} />
                      {!isSidebarCollapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && item.badge > 0 && (
                            <Badge 
                              variant="secondary" 
                              className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs bg-orange-500 text-white"
                            >
                              {item.badge > 99 ? '99+' : item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Button>
                  );

                  if (isSidebarCollapsed) {
                    return (
                      <Tooltip key={item.id}>
                        <TooltipTrigger asChild>
                          {menuButton}
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700">
                          <div className="flex flex-col">
                            <span className="font-medium">{item.label}</span>
                            {item.description && (
                              <span className="text-xs text-gray-400">{item.description}</span>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return menuButton;
                })}
              </nav>
            </div>
          </ScrollArea>
        </div>

        <Separator className="bg-gray-800" />

        {/* Bottom Section - Lima States */}
        <div className="p-2 border-t border-gray-800">
          {!isSidebarCollapsed && (
            <div className="mb-2">
              <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Lima States
              </h3>
            </div>
          )}
          
          <div className="space-y-1">
            {LIMA_STATES_ARRAY.map((state) => {
              const Icon = state.icon;
              const isActive = activeState === state.id;
              
              const stateButton = (
                <Button
                  key={state.id}
                  variant={isActive ? 'primary' : 'ghost'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    isSidebarCollapsed ? 'h-10 w-10 p-0' : 'h-9 px-2',
                    isActive 
                      ? 'bg-orange-500 text-white hover:bg-orange-600' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  )}
                  onClick={() => handleStateChange(state.id)}
                >
                  <Icon className={cn(
                    'h-4 w-4 flex-shrink-0',
                    isSidebarCollapsed ? 'mx-auto' : 'mr-2'
                  )} />
                  {!isSidebarCollapsed && (
                    <span className="flex-1 truncate">{state.name}</span>
                  )}
                </Button>
              );

              if (isSidebarCollapsed) {
                return (
                  <Tooltip key={state.id}>
                    <TooltipTrigger asChild>
                      {stateButton}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700">
                      <div className="flex flex-col">
                        <span className="font-medium">{state.name}</span>
                        <span className="text-xs text-gray-400">{state.description}</span>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return stateButton;
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}