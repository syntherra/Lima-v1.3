# Lima AI Growth Operating System - Technical Architecture

## System Architecture Overview

Lima is built as a React-based single-page application with state-driven navigation and dynamic UI components. The architecture follows a modular approach with clear separation of concerns.

## Technology Stack

### Frontend Framework
- **React 18** with TypeScript
- **Vite** for build tooling and development server
- **React Router** for client-side routing
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

### UI Component Library
- **Radix UI** for accessible primitives
- **Custom component system** following design tokens
- **Responsive design** with mobile-first approach

## Project Structure

```
src/
├── components/
│   ├── ui/                    # Base UI components
│   ├── layout/               # Layout components
│   ├── sidebar/              # Sidebar-specific components
│   └── dashboard/            # Dashboard components
├── pages/                    # Page components for each state
│   ├── mail/
│   ├── growth-os/
│   ├── crm/
│   ├── calendar/
│   └── tasks/
├── hooks/                    # Custom React hooks
├── stores/                   # Zustand stores
├── types/                    # TypeScript type definitions
├── utils/                    # Utility functions
└── constants/                # Application constants
```

## Core Components Architecture

### 1. Layout System

#### DashboardLayout
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Main layout wrapper with sidebar and content area
```

#### Sidebar Component
```typescript
interface SidebarProps {
  currentState: LimaStateId;
  onStateChange: (state: LimaStateId) => void;
}

// Three-section sidebar:
// - LogoSection
// - ContextualMenu
// - StatesSwitcher
```

### 2. State Management

#### Lima States Store
```typescript
interface LimaStatesStore {
  // Current active state
  activeState: LimaStateId;
  
  // State definitions
  states: Record<LimaStateId, LimaState>;
  
  // Actions
  setActiveState: (state: LimaStateId) => void;
  getActiveMenuItems: () => MenuItem[];
  getCurrentState: () => LimaState;
}
```

#### Navigation Store
```typescript
interface NavigationStore {
  // Current active menu item
  activeMenuItem: string;
  
  // Navigation history
  history: NavigationHistoryItem[];
  
  // Actions
  setActiveMenuItem: (itemId: string) => void;
  navigateToMenuItem: (itemId: string) => void;
  goBack: () => void;
}
```

### 3. Routing System

#### Route Structure
```typescript
// URL pattern: /[state]/[page]
// Examples:
// /mail/inbox
// /growth-os/dashboard
// /crm/contacts
// /calendar/today
// /tasks/my-tasks
```

#### Route Configuration
```typescript
const routes = {
  mail: {
    inbox: '/mail/inbox',
    sent: '/mail/sent',
    drafts: '/mail/drafts',
    // ...
  },
  'growth-os': {
    dashboard: '/growth-os/dashboard',
    analytics: '/growth-os/analytics',
    // ...
  },
  // ... other states
};
```

## Data Models

### Lima State Definition
```typescript
interface LimaState {
  id: LimaStateId;
  name: string;
  icon: LucideIcon;
  color: string;
  menuItems: MenuItem[];
  defaultRoute: string;
  description: string;
}

type LimaStateId = 'mail' | 'growth-os' | 'crm' | 'calendar' | 'tasks';
```

### Menu Item Definition
```typescript
interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  route: string;
  badge?: number;
  isActive?: boolean;
  description?: string;
  shortcut?: string;
}
```

### Dashboard Page Props
```typescript
interface DashboardPageProps {
  state: LimaStateId;
  menuItem: string;
  data?: any;
}
```

## Component Implementation Details

### 1. Sidebar Sections

#### Logo Section (Top)
```typescript
const LogoSection: React.FC = () => {
  return (
    <div className="sidebar-logo-section">
      <img src="/lima-logo.svg" alt="Lima" className="logo" />
      <span className="tagline">AI Powered Growth OS</span>
    </div>
  );
};
```

#### Contextual Menu (Middle)
```typescript
interface ContextualMenuProps {
  menuItems: MenuItem[];
  activeItem: string;
  onItemClick: (itemId: string) => void;
}

const ContextualMenu: React.FC<ContextualMenuProps> = ({
  menuItems,
  activeItem,
  onItemClick
}) => {
  return (
    <div className="contextual-menu">
      {menuItems.map((item) => (
        <MenuItem
          key={item.id}
          item={item}
          isActive={item.id === activeItem}
          onClick={() => onItemClick(item.id)}
        />
      ))}
    </div>
  );
};
```

#### States Switcher (Bottom)
```typescript
interface StatesSwitcherProps {
  states: LimaState[];
  activeState: LimaStateId;
  onStateChange: (state: LimaStateId) => void;
}

const StatesSwitcher: React.FC<StatesSwitcherProps> = ({
  states,
  activeState,
  onStateChange
}) => {
  return (
    <div className="states-switcher">
      {states.map((state) => (
        <StateButton
          key={state.id}
          state={state}
          isActive={state.id === activeState}
          onClick={() => onStateChange(state.id)}
        />
      ))}
    </div>
  );
};
```

### 2. Dashboard Content Area

#### Dynamic Page Renderer
```typescript
const DashboardContent: React.FC = () => {
  const { activeState } = useLimaStates();
  const { activeMenuItem } = useNavigation();
  
  const PageComponent = getPageComponent(activeState, activeMenuItem);
  
  return (
    <div className="dashboard-content">
      <Suspense fallback={<LoadingSpinner />}>
        <PageComponent />
      </Suspense>
    </div>
  );
};
```

## State Definitions

### Mail State Configuration
```typescript
const mailState: LimaState = {
  id: 'mail',
  name: 'Mail',
  icon: Mail,
  color: '#3b82f6',
  defaultRoute: '/mail/inbox',
  description: 'Email management and communication',
  menuItems: [
    { id: 'inbox', label: 'Inbox', icon: Inbox, route: '/mail/inbox' },
    { id: 'sent', label: 'Sent', icon: Send, route: '/mail/sent' },
    { id: 'drafts', label: 'Drafts', icon: FileText, route: '/mail/drafts' },
    { id: 'deleted', label: 'Deleted Items', icon: Trash2, route: '/mail/deleted' },
    { id: 'spam', label: 'Spam', icon: Shield, route: '/mail/spam' },
    { id: 'folders', label: 'Folders', icon: Folder, route: '/mail/folders' },
    { id: 'pinned', label: 'Pinned', icon: Pin, route: '/mail/pinned' },
    { id: 'archive', label: 'Archive', icon: Archive, route: '/mail/archive' },
    { id: 'templates', label: 'Templates', icon: FileTemplate, route: '/mail/templates' },
    { id: 'signatures', label: 'Signatures', icon: PenTool, route: '/mail/signatures' }
  ]
};
```

### Growth OS State Configuration
```typescript
const growthOsState: LimaState = {
  id: 'growth-os',
  name: 'Growth OS',
  icon: TrendingUp,
  color: '#10b981',
  defaultRoute: '/growth-os/dashboard',
  description: 'Business growth analytics and insights',
  menuItems: [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, route: '/growth-os/dashboard' },
    { id: 'analytics', label: 'Analytics', icon: LineChart, route: '/growth-os/analytics' },
    { id: 'reports', label: 'Reports', icon: FileBarChart, route: '/growth-os/reports' },
    { id: 'metrics', label: 'Metrics', icon: Activity, route: '/growth-os/metrics' },
    { id: 'goals', label: 'Goals', icon: Target, route: '/growth-os/goals' },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone, route: '/growth-os/campaigns' },
    { id: 'ab-tests', label: 'A/B Tests', icon: TestTube, route: '/growth-os/ab-tests' },
    { id: 'funnels', label: 'Conversion Funnels', icon: Filter, route: '/growth-os/funnels' },
    { id: 'journey', label: 'Customer Journey', icon: Route, route: '/growth-os/journey' },
    { id: 'experiments', label: 'Growth Experiments', icon: Beaker, route: '/growth-os/experiments' }
  ]
};
```

### CRM State Configuration
```typescript
const crmState: LimaState = {
  id: 'crm',
  name: 'CRM',
  icon: Users,
  color: '#8b5cf6',
  defaultRoute: '/crm/contacts',
  description: 'Customer relationship management',
  menuItems: [
    { id: 'contacts', label: 'Contacts', icon: User, route: '/crm/contacts' },
    { id: 'companies', label: 'Companies', icon: Building, route: '/crm/companies' },
    { id: 'deals', label: 'Deals', icon: DollarSign, route: '/crm/deals' },
    { id: 'pipeline', label: 'Pipeline', icon: GitBranch, route: '/crm/pipeline' },
    { id: 'activities', label: 'Activities', icon: Activity, route: '/crm/activities' },
    { id: 'notes', label: 'Notes', icon: StickyNote, route: '/crm/notes' },
    { id: 'follow-ups', label: 'Follow-ups', icon: Clock, route: '/crm/follow-ups' },
    { id: 'lead-scoring', label: 'Lead Scoring', icon: Star, route: '/crm/lead-scoring' },
    { id: 'segments', label: 'Segments', icon: Tags, route: '/crm/segments' },
    { id: 'import-export', label: 'Import/Export', icon: Download, route: '/crm/import-export' }
  ]
};
```

### Calendar State Configuration
```typescript
const calendarState: LimaState = {
  id: 'calendar',
  name: 'Calendar',
  icon: Calendar,
  color: '#f59e0b',
  defaultRoute: '/calendar/today',
  description: 'Schedule and time management',
  menuItems: [
    { id: 'today', label: 'Today', icon: CalendarDays, route: '/calendar/today' },
    { id: 'week', label: 'Week View', icon: CalendarRange, route: '/calendar/week' },
    { id: 'month', label: 'Month View', icon: Calendar, route: '/calendar/month' },
    { id: 'agenda', label: 'Agenda', icon: List, route: '/calendar/agenda' },
    { id: 'events', label: 'Events', icon: CalendarCheck, route: '/calendar/events' },
    { id: 'meetings', label: 'Meetings', icon: Video, route: '/calendar/meetings' },
    { id: 'reminders', label: 'Reminders', icon: Bell, route: '/calendar/reminders' },
    { id: 'recurring', label: 'Recurring Events', icon: Repeat, route: '/calendar/recurring' },
    { id: 'time-blocks', label: 'Time Blocks', icon: Square, route: '/calendar/time-blocks' },
    { id: 'availability', label: 'Availability', icon: CheckCircle, route: '/calendar/availability' }
  ]
};
```

### Tasks State Configuration
```typescript
const tasksState: LimaState = {
  id: 'tasks',
  name: 'Tasks',
  icon: CheckSquare,
  color: '#ef4444',
  defaultRoute: '/tasks/my-tasks',
  description: 'Task and project management',
  menuItems: [
    { id: 'my-tasks', label: 'My Tasks', icon: User, route: '/tasks/my-tasks' },
    { id: 'projects', label: 'Projects', icon: FolderOpen, route: '/tasks/projects' },
    { id: 'assigned', label: 'Assigned to Me', icon: UserCheck, route: '/tasks/assigned' },
    { id: 'due-today', label: 'Due Today', icon: Clock, route: '/tasks/due-today' },
    { id: 'overdue', label: 'Overdue', icon: AlertCircle, route: '/tasks/overdue' },
    { id: 'completed', label: 'Completed', icon: CheckCircle, route: '/tasks/completed' },
    { id: 'templates', label: 'Templates', icon: FileTemplate, route: '/tasks/templates' },
    { id: 'priorities', label: 'Priorities', icon: Flag, route: '/tasks/priorities' },
    { id: 'labels', label: 'Labels', icon: Tag, route: '/tasks/labels' },
    { id: 'time-tracking', label: 'Time Tracking', icon: Timer, route: '/tasks/time-tracking' }
  ]
};
```

## Performance Considerations

1. **Code Splitting**: Each state's pages are lazy-loaded
2. **State Persistence**: Use localStorage for user preferences
3. **Memoization**: Optimize re-renders with React.memo and useMemo
4. **Virtual Scrolling**: For large lists in CRM and Tasks
5. **Caching**: Implement data caching for frequently accessed content

## Accessibility Features

1. **Keyboard Navigation**: Full keyboard support for all interactions
2. **Screen Reader Support**: Proper ARIA labels and descriptions
3. **Focus Management**: Clear focus indicators and logical tab order
4. **Color Contrast**: WCAG AA compliant color combinations
5. **Reduced Motion**: Respect user's motion preferences

## Testing Strategy

1. **Unit Tests**: Component logic and state management
2. **Integration Tests**: State switching and navigation flows
3. **E2E Tests**: Complete user journeys across states
4. **Accessibility Tests**: Automated a11y testing
5. **Visual Regression Tests**: UI consistency across states

This technical architecture provides a solid foundation for implementing Lima's state-based navigation system with scalable, maintainable, and accessible code.