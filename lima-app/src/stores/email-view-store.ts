import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Email view types
export type EmailView = 
  | 'inbox' 
  | 'sent' 
  | 'drafts' 
  | 'starred' 
  | 'important' 
  | 'archive' 
  | 'spam' 
  | 'trash' 
  | 'compose' 
  | 'settings';

// Email state interface
interface EmailViewState {
  // Current active view
  activeView: EmailView;
  
  // Previous view for navigation history
  previousView: EmailView | null;
  
  // Loading states for smooth transitions
  isTransitioning: boolean;
  
  // Compose modal state
  isComposeOpen: boolean;
  
  // Email selection state
  selectedEmails: string[];
  
  // Search and filter state
  searchTerm: string;
  filters: {
    unread?: boolean;
    starred?: boolean;
    important?: boolean;
    hasAttachments?: boolean;
  };
  
  // Actions
  setActiveView: (view: EmailView) => void;
  setTransitioning: (isTransitioning: boolean) => void;
  openCompose: () => void;
  closeCompose: () => void;
  toggleCompose: () => void;
  setSelectedEmails: (emails: string[]) => void;
  addSelectedEmail: (emailId: string) => void;
  removeSelectedEmail: (emailId: string) => void;
  clearSelectedEmails: () => void;
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Partial<EmailViewState['filters']>) => void;
  resetFilters: () => void;
  goBack: () => void;
}

// Create the email view store
export const useEmailViewStore = create<EmailViewState>()(
  persist(
    (set, get) => ({
      // Initial state
      activeView: 'inbox',
      previousView: null,
      isTransitioning: false,
      isComposeOpen: false,
      selectedEmails: [],
      searchTerm: '',
      filters: {},
      
      // Actions
      setActiveView: (view: EmailView) => {
        const currentView = get().activeView;
        if (currentView === view) return;
        
        set({
          previousView: currentView,
          activeView: view,
          isTransitioning: true,
          // Clear selections when changing views
          selectedEmails: [],
        });
        
        // Auto-clear transitioning state after animation
        setTimeout(() => {
          set({ isTransitioning: false });
        }, 300);
      },
      
      setTransitioning: (isTransitioning: boolean) => {
        set({ isTransitioning });
      },
      
      openCompose: () => {
        set({ 
          isComposeOpen: true,
          activeView: 'compose',
          previousView: get().activeView !== 'compose' ? get().activeView : get().previousView
        });
      },
      
      closeCompose: () => {
        const { previousView } = get();
        set({ 
          isComposeOpen: false,
          activeView: previousView || 'inbox',
          previousView: null
        });
      },
      
      toggleCompose: () => {
        const { isComposeOpen } = get();
        if (isComposeOpen) {
          get().closeCompose();
        } else {
          get().openCompose();
        }
      },
      
      setSelectedEmails: (emails: string[]) => {
        set({ selectedEmails: emails });
      },
      
      addSelectedEmail: (emailId: string) => {
        const { selectedEmails } = get();
        if (!selectedEmails.includes(emailId)) {
          set({ selectedEmails: [...selectedEmails, emailId] });
        }
      },
      
      removeSelectedEmail: (emailId: string) => {
        const { selectedEmails } = get();
        set({ selectedEmails: selectedEmails.filter(id => id !== emailId) });
      },
      
      clearSelectedEmails: () => {
        set({ selectedEmails: [] });
      },
      
      setSearchTerm: (term: string) => {
        set({ searchTerm: term });
      },
      
      setFilters: (newFilters: Partial<EmailViewState['filters']>) => {
        const { filters } = get();
        set({ filters: { ...filters, ...newFilters } });
      },
      
      resetFilters: () => {
        set({ filters: {}, searchTerm: '' });
      },
      
      goBack: () => {
        const { previousView } = get();
        if (previousView) {
          set({
            activeView: previousView,
            previousView: null
          });
        }
      },
    }),
    {
      name: 'email-view-storage',
      partialize: (state) => ({
        activeView: state.activeView,
        filters: state.filters,
        searchTerm: state.searchTerm,
      }),
    }
  )
);

// Convenience hooks for specific parts of the state
export const useActiveEmailView = () => useEmailViewStore(state => state.activeView);
export const useEmailTransition = () => useEmailViewStore(state => state.isTransitioning);

// Stable selector functions to prevent SSR issues
const composeSelector = (state: EmailViewState) => ({
  isOpen: state.isComposeOpen,
  open: state.openCompose,
  close: state.closeCompose,
  toggle: state.toggleCompose,
});

const selectionSelector = (state: EmailViewState) => ({
  selectedEmails: state.selectedEmails,
  setSelected: state.setSelectedEmails,
  addSelected: state.addSelectedEmail,
  removeSelected: state.removeSelectedEmail,
  clearSelected: state.clearSelectedEmails,
});

const searchSelector = (state: EmailViewState) => ({
  searchTerm: state.searchTerm,
  filters: state.filters,
  setSearchTerm: state.setSearchTerm,
  setFilters: state.setFilters,
  resetFilters: state.resetFilters,
});

// Simple convenience hooks without memoization to avoid SSR issues
export const useEmailCompose = () => {
  const isOpen = useEmailViewStore(state => state.isComposeOpen);
  const open = useEmailViewStore(state => state.openCompose);
  const close = useEmailViewStore(state => state.closeCompose);
  const toggle = useEmailViewStore(state => state.toggleCompose);
  
  return { isOpen, open, close, toggle };
};

export const useEmailSelection = () => {
  const selectedEmails = useEmailViewStore(state => state.selectedEmails);
  const setSelected = useEmailViewStore(state => state.setSelectedEmails);
  const addSelected = useEmailViewStore(state => state.addSelectedEmail);
  const removeSelected = useEmailViewStore(state => state.removeSelectedEmail);
  const clearSelected = useEmailViewStore(state => state.clearSelectedEmails);
  
  return { selectedEmails, setSelected, addSelected, removeSelected, clearSelected };
};

export const useEmailSearch = () => {
  const searchTerm = useEmailViewStore(state => state.searchTerm);
  const filters = useEmailViewStore(state => state.filters);
  const setSearchTerm = useEmailViewStore(state => state.setSearchTerm);
  const setFilters = useEmailViewStore(state => state.setFilters);
  const resetFilters = useEmailViewStore(state => state.resetFilters);
  
  return { searchTerm, filters, setSearchTerm, setFilters, resetFilters };
};