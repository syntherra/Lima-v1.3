import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LimaStatesStore, LimaStateId, MenuItem, LimaState, NavigationHistoryItem } from '@/types/lima-states';
import { LIMA_STATES, DEFAULT_LIMA_STATE } from '@/constants/lima-states';

interface ExtendedLimaStatesStore extends LimaStatesStore {
  // Navigation history
  navigationHistory: NavigationHistoryItem[];
  
  // Sidebar state
  isSidebarCollapsed: boolean;
  
  // Additional actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  addToHistory: (item: NavigationHistoryItem) => void;
  clearHistory: () => void;
  goBack: () => void;
  
  // Menu item management
  updateMenuItemBadge: (stateId: LimaStateId, itemId: string, badge?: number) => void;
  
  // Initialization
  initialize: () => void;
}

export const useLimaStatesStore = create<ExtendedLimaStatesStore>()(persist(
  (set, get) => ({
    // Initial state
    activeState: DEFAULT_LIMA_STATE,
    states: LIMA_STATES,
    activeMenuItem: LIMA_STATES[DEFAULT_LIMA_STATE].menuItems[0]?.id || '',
    navigationHistory: [],
    isSidebarCollapsed: false,

    // Core actions
    setActiveState: (state: LimaStateId) => {
      const currentState = get().states[state];
      if (!currentState) return;

      const defaultMenuItem = currentState.menuItems[0]?.id || '';
      
      // Add to history
      const historyItem: NavigationHistoryItem = {
        state,
        menuItem: defaultMenuItem,
        route: currentState.defaultRoute,
        timestamp: Date.now(),
      };

      set({
        activeState: state,
        activeMenuItem: defaultMenuItem,
      });

      get().addToHistory(historyItem);
    },

    setActiveMenuItem: (itemId: string) => {
      const currentState = get().getCurrentState();
      const menuItem = currentState.menuItems.find(item => item.id === itemId);
      
      if (menuItem) {
        const historyItem: NavigationHistoryItem = {
          state: get().activeState,
          menuItem: itemId,
          route: menuItem.route,
          timestamp: Date.now(),
        };

        set({ activeMenuItem: itemId });
        get().addToHistory(historyItem);
      }
    },

    getActiveMenuItems: () => {
      const { activeState, states } = get();
      return states[activeState]?.menuItems || [];
    },

    getCurrentState: () => {
      const { activeState, states } = get();
      return states[activeState];
    },

    navigateToState: (stateId: LimaStateId, menuItemId?: string) => {
      const targetState = get().states[stateId];
      if (!targetState) return;

      const targetMenuItem = menuItemId 
        ? targetState.menuItems.find(item => item.id === menuItemId)
        : targetState.menuItems[0];

      if (!targetMenuItem) return;

      const historyItem: NavigationHistoryItem = {
        state: stateId,
        menuItem: targetMenuItem.id,
        route: targetMenuItem.route,
        timestamp: Date.now(),
      };

      set({
        activeState: stateId,
        activeMenuItem: targetMenuItem.id,
      });

      get().addToHistory(historyItem);
    },

    // Sidebar management
    toggleSidebar: () => {
      set(state => ({ isSidebarCollapsed: !state.isSidebarCollapsed }));
    },

    setSidebarCollapsed: (collapsed: boolean) => {
      set({ isSidebarCollapsed: collapsed });
    },

    // History management
    addToHistory: (item: NavigationHistoryItem) => {
      set(state => {
        const newHistory = [...state.navigationHistory, item];
        // Keep only last 50 items
        if (newHistory.length > 50) {
          newHistory.splice(0, newHistory.length - 50);
        }
        return { navigationHistory: newHistory };
      });
    },

    clearHistory: () => {
      set({ navigationHistory: [] });
    },

    goBack: () => {
      const { navigationHistory } = get();
      if (navigationHistory.length < 2) return;

      // Get the previous item (second to last)
      const previousItem = navigationHistory[navigationHistory.length - 2];
      
      // Remove the last two items from history to avoid infinite loop
      const newHistory = navigationHistory.slice(0, -2);
      
      set({
        activeState: previousItem.state,
        activeMenuItem: previousItem.menuItem,
        navigationHistory: newHistory,
      });
    },

    // Menu item management
    updateMenuItemBadge: (stateId: LimaStateId, itemId: string, badge?: number) => {
      set(state => {
        const updatedStates = { ...state.states };
        const targetState = updatedStates[stateId];
        
        if (targetState) {
          const updatedMenuItems = targetState.menuItems.map(item => 
            item.id === itemId ? { ...item, badge } : item
          );
          
          updatedStates[stateId] = {
            ...targetState,
            menuItems: updatedMenuItems,
          };
        }
        
        return { states: updatedStates };
      });
    },

    // Initialization
    initialize: () => {
      const { activeState, states } = get();
      
      // Ensure we have a valid active state
      if (!states[activeState]) {
        get().setActiveState(DEFAULT_LIMA_STATE);
        return;
      }

      // Ensure we have a valid active menu item
      const currentState = states[activeState];
      const { activeMenuItem } = get();
      
      if (!currentState.menuItems.find(item => item.id === activeMenuItem)) {
        const defaultMenuItem = currentState.menuItems[0]?.id || '';
        set({ activeMenuItem: defaultMenuItem });
      }
    },
  }),
  {
    name: 'lima-states-storage',
    partialize: (state) => ({
      activeState: state.activeState,
      activeMenuItem: state.activeMenuItem,
      isSidebarCollapsed: state.isSidebarCollapsed,
      // Don't persist navigation history as it's session-specific
    }),
  }
));

// Selector hooks for better performance
export const useActiveState = () => useLimaStatesStore(state => state.activeState);
export const useActiveMenuItem = () => useLimaStatesStore(state => state.activeMenuItem);
export const useCurrentState = () => useLimaStatesStore(state => state.getCurrentState());
export const useActiveMenuItems = () => useLimaStatesStore(state => state.getActiveMenuItems());
export const useSidebarCollapsed = () => useLimaStatesStore(state => state.isSidebarCollapsed);
export const useNavigationHistory = () => useLimaStatesStore(state => state.navigationHistory);

// Individual action hooks to prevent infinite loops
export const useSetActiveState = () => useLimaStatesStore(state => state.setActiveState);
export const useSetActiveMenuItem = () => useLimaStatesStore(state => state.setActiveMenuItem);
export const useNavigateToState = () => useLimaStatesStore(state => state.navigateToState);
export const useToggleSidebar = () => useLimaStatesStore(state => state.toggleSidebar);
export const useSetSidebarCollapsed = () => useLimaStatesStore(state => state.setSidebarCollapsed);
export const useUpdateMenuItemBadge = () => useLimaStatesStore(state => state.updateMenuItemBadge);
export const useGoBack = () => useLimaStatesStore(state => state.goBack);
export const useClearHistory = () => useLimaStatesStore(state => state.clearHistory);
export const useInitialize = () => useLimaStatesStore(state => state.initialize);

// Create a stable actions object that won't change between renders
const createActionsSelector = () => {
  let cachedActions: any = null;
  
  return (state: ExtendedLimaStatesStore) => {
    if (!cachedActions) {
      cachedActions = {
        setActiveState: state.setActiveState,
        setActiveMenuItem: state.setActiveMenuItem,
        navigateToState: state.navigateToState,
        toggleSidebar: state.toggleSidebar,
        setSidebarCollapsed: state.setSidebarCollapsed,
        updateMenuItemBadge: state.updateMenuItemBadge,
        goBack: state.goBack,
        clearHistory: state.clearHistory,
        initialize: state.initialize,
      };
    }
    return cachedActions;
  };
};

const actionsSelector = createActionsSelector();

// Action hooks
export const useLimaStatesActions = () => useLimaStatesStore(actionsSelector);

export default useLimaStatesStore;