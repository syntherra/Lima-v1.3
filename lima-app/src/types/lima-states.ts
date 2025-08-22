import { LucideIcon } from 'lucide-react';

export type LimaStateId = 'mail' | 'growth-os' | 'crm' | 'calendar' | 'tasks';

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  route: string;
  badge?: number;
  isActive?: boolean;
  description?: string;
  shortcut?: string;
}

export interface LimaState {
  id: LimaStateId;
  name: string;
  icon: LucideIcon;
  color: string;
  menuItems: MenuItem[];
  defaultRoute: string;
  description: string;
}

export interface LimaStatesStore {
  // Current active state
  activeState: LimaStateId;
  
  // State definitions
  states: Record<LimaStateId, LimaState>;
  
  // Current active menu item
  activeMenuItem: string;
  
  // Actions
  setActiveState: (state: LimaStateId) => void;
  setActiveMenuItem: (itemId: string) => void;
  getActiveMenuItems: () => MenuItem[];
  getCurrentState: () => LimaState;
  navigateToState: (stateId: LimaStateId, menuItemId?: string) => void;
}

export interface NavigationHistoryItem {
  state: LimaStateId;
  menuItem: string;
  route: string;
  timestamp: number;
}