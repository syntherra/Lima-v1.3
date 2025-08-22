# Lima States System Architecture

## Overview

The Lima States System is a sophisticated navigation and state management architecture that powers the Lima AI Growth Operating System. It provides a dynamic, context-aware sidebar navigation system that adapts to different business workflows (Mail, Growth OS, CRM, Calendar, Tasks) with contextual menu items and seamless routing.

## Core Architecture Components

### 1. State Configuration Structure

The system is built around five core Lima states, each representing a distinct business workflow:

```typescript
// Located in: src/constants/lima-states.ts
export type LimaStateId = 'mail' | 'growth-os' | 'crm' | 'calendar' | 'tasks';

export interface LimaState {
  id: LimaStateId;
  name: string;
  icon: LucideIcon;
  color: string;
  defaultRoute: string;
  description: string;
  menuItems: MenuItem[];
}

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
```

### 2. Lima States Configuration

#### Mail State
- **Purpose**: Email management and communication
- **Default Route**: `/mail/inbox`
- **Menu Items**: Inbox, Sent, Drafts, Deleted Items, Spam, Folders, Pinned, Archive, Templates, Signatures
- **Color Theme**: `#3b82f6` (Blue)

#### Growth OS State
- **Purpose**: Marketing automation and growth analytics
- **Default Route**: `/growth-os/dashboard`
- **Menu Items**: Dashboard, Analytics, Goals, Reports, Metrics, Campaigns, A/B Tests, Funnels, Customer Journey, Growth Experiments
- **Color Theme**: `#10b981` (Green)

#### CRM State
- **Purpose**: Customer relationship management
- **Default Route**: `/crm/contacts`
- **Menu Items**: Contacts, Companies, Deals, Pipeline, Activities, Notes, Follow-ups, Lead Scoring, Segments, Import/Export
- **Color Theme**: `#8b5cf6` (Purple)

#### Calendar State
- **Purpose**: Schedule and time management
- **Default Route**: `/calendar/today`
- **Menu Items**: Today, Week, Month, Agenda, Events, Meetings, Reminders, Recurring Events, Time Blocks, Availability
- **Color Theme**: `#f59e0b` (Amber)

#### Tasks State
- **Purpose**: Task and project management
- **Default Route**: `/tasks/my-tasks`
- **Menu Items**: My Tasks, Assigned, Projects, Due Today, Overdue, Completed, Templates, Priorities, Labels, Time Tracking
- **Color Theme**: `#ef4444` (Red)

## State Management Architecture

### Zustand Store Implementation

The system uses Zustand for state management with persistence:

```typescript
// Located in: src/stores/lima-states-store.ts
interface ExtendedLimaStatesStore extends LimaStatesStore {
  // Core state
  activeState: LimaStateId;
  states: Record<LimaStateId, LimaState>;
  activeMenuItem: string;
  
  // Navigation features
  navigationHistory: NavigationHistoryItem[];
  isSidebarCollapsed: boolean;
  
  // Actions
  setActiveState: (state: LimaStateId) => void;
  setActiveMenuItem: (itemId: string) => void;
  navigateToState: (stateId: LimaStateId, menuItemId?: string) => void;
  toggleSidebar: () => void;
  goBack: () => void;
}
```

### Key Store Features

1. **Persistence**: State persists across browser sessions
2. **Navigation History**: Tracks user navigation for back functionality
3. **Automatic State Validation**: Ensures valid menu items are selected
4. **Sidebar Collapse**: Manages sidebar visibility state

## Navigation and Routing Logic

### Route-Based State Detection

The system automatically detects the current route and sets the appropriate active state and menu item:

```typescript
// Located in: src/components/layout/lima-sidebar.tsx
useEffect(() => {
  // Find matching state and menu item based on current pathname
  for (const state of LIMA_STATES_ARRAY) {
    const matchingMenuItem = state.menuItems.find(item => 
      pathname === item.route || pathname.startsWith(item.route + '/')
    );
    
    if (matchingMenuItem) {
      if (activeState !== state.id) {
        setActiveState(state.id);
      }
      if (activeMenuItem !== matchingMenuItem.id) {
        setActiveMenuItem(matchingMenuItem.id);
      }
      break;
    }
  }
}, [pathname, activeState, activeMenuItem, setActiveState, setActiveMenuItem]);
```

### Navigation Handlers

1. **State Change Handler**: Switches between Lima states and navigates to default route
2. **Menu Item Handler**: Navigates to specific menu item routes within a state
3. **Programmatic Navigation**: `navigateToState()` function for code-driven navigation

## Dashboard Display Engine

### Layout Architecture

The dashboard uses a consistent layout structure across all states:

```typescript
// Located in: src/components/layout/dashboard-layout.tsx
export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-950">
      <LimaSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-hidden bg-gray-900">
          <div className="h-full" style={{ margin: '20px' }}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 overflow-y-auto" 
                 style={{ height: 'calc(100vh - 40px)' }}>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
```

### Page Structure Pattern

Each route follows a consistent pattern:

```typescript
// Example: src/app/mail/inbox/page.tsx
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import EmailInbox from '@/components/email/email-inbox';

export default function MailInboxPage() {
  return (
    <DashboardLayout>
      <EmailInbox />
    </DashboardLayout>
  );
}
```

### Content Display Logic

1. **Route-Based Rendering**: Next.js App Router handles route-to-component mapping
2. **Consistent Layout**: All pages use `DashboardLayout` wrapper
3. **State-Aware Components**: Components can access current state via Zustand store
4. **Dynamic Content**: Page content changes based on active state and menu item

## Sidebar Component Architecture

### Three-Section Layout

1. **Logo Section**: Lima branding and collapse toggle
2. **Contextual Menu**: Dynamic menu items based on active state
3. **Lima States**: State switcher buttons at bottom

### Dynamic Menu Rendering

```typescript
// Menu items are rendered dynamically based on active state
const activeMenuItems = useActiveMenuItems();

activeMenuItems.map((item) => {
  const isActive = activeMenuItem === item.id;
  const Icon = item.icon;
  
  return (
    <Button
      key={item.id}
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-3 h-10 px-3",
        isActive && "bg-gray-800 text-white"
      )}
      onClick={() => handleMenuItemClick(item.id)}
    >
      <Icon className="h-4 w-4" />
      {!isSidebarCollapsed && (
        <span className="text-sm font-medium">{item.label}</span>
      )}
    </Button>
  );
})
```

## File Structure and Organization

```
lima-app/
├── .gitignore
├── .prettierrc
├── README.md
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tailwind.config.js
├── tsconfig.json
├── verify-implementation.sh
├── lima-states-architecture.md   # This documentation file
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── supabase/
│   ├── config.toml
│   ├── config/
│   └── migrations/
│       ├── 001_create_core_schema.sql
│       ├── 002_create_indexes_and_rls.sql
│       └── 003_create_functions_and_triggers.sql
└── src/
    ├── middleware.ts
    ├── app/                      # Next.js App Router pages
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx            # Root layout
    │   ├── page.tsx              # Home page with auth redirect
    │   ├── api/                  # API routes
    │   │   ├── ai/
    │   │   │   ├── extract-tasks/
    │   │   │   │   └── route.ts
    │   │   │   ├── generate-email/
    │   │   │   │   └── route.ts
    │   │   │   └── insights/
    │   │   │       └── route.ts
    │   │   ├── crm/
    │   │   │   └── route.ts
    │   │   ├── dashboard/
    │   │   │   └── metrics/
    │   │   │       └── route.ts
    │   │   ├── email/
    │   │   │   ├── connect/
    │   │   │   │   └── route.ts
    │   │   │   └── sync/
    │   │   │       └── route.ts
    │   │   ├── org-intel/
    │   │   │   └── route.ts
    │   │   ├── projects/
    │   │   │   └── route.ts
    │   │   ├── style-mirror/
    │   │   │   └── route.ts
    │   │   └── tasks/
    │   │       └── route.ts
    │   ├── auth/                 # Authentication pages
    │   │   ├── callback/
    │   │   │   └── page.tsx
    │   │   ├── signin/
    │   │   │   └── page.tsx
    │   │   └── signup/
    │   │       └── page.tsx
    │   ├── calendar/             # Calendar state pages
    │   │   ├── agenda/
    │   │   │   └── page.tsx
    │   │   ├── availability/
    │   │   │   └── page.tsx
    │   │   ├── events/
    │   │   │   └── page.tsx
    │   │   ├── meetings/
    │   │   │   └── page.tsx
    │   │   ├── month/
    │   │   │   └── page.tsx
    │   │   ├── recurring/
    │   │   │   └── page.tsx
    │   │   ├── reminders/
    │   │   │   └── page.tsx
    │   │   ├── time-blocks/
    │   │   │   └── page.tsx
    │   │   ├── today/
    │   │   │   └── page.tsx
    │   │   └── week/
    │   │       └── page.tsx
    │   ├── campaigns/
    │   │   └── page.tsx
    │   ├── crm/                  # CRM state pages
    │   │   ├── page.tsx
    │   │   ├── activities/
    │   │   │   └── page.tsx
    │   │   ├── companies/
    │   │   │   └── page.tsx
    │   │   ├── contacts/
    │   │   │   └── page.tsx
    │   │   ├── deals/
    │   │   │   └── page.tsx
    │   │   ├── follow-ups/
    │   │   │   └── page.tsx
    │   │   ├── import-export/
    │   │   │   └── page.tsx
    │   │   ├── lead-scoring/
    │   │   │   └── page.tsx
    │   │   ├── notes/
    │   │   │   └── page.tsx
    │   │   ├── pipeline/
    │   │   │   └── page.tsx
    │   │   └── segments/
    │   │       └── page.tsx
    │   ├── dashboard/
    │   │   └── page.tsx
    │   ├── growth-os/            # Growth OS state pages
    │   │   ├── ab-tests/
    │   │   │   └── page.tsx
    │   │   ├── analytics/
    │   │   │   └── page.tsx
    │   │   ├── campaigns/
    │   │   │   └── page.tsx
    │   │   ├── dashboard/
    │   │   │   └── page.tsx
    │   │   ├── experiments/
    │   │   │   └── page.tsx
    │   │   ├── funnels/
    │   │   │   └── page.tsx
    │   │   ├── goals/
    │   │   │   └── page.tsx
    │   │   ├── journey/
    │   │   │   └── page.tsx
    │   │   ├── metrics/
    │   │   │   └── page.tsx
    │   │   └── reports/
    │   │       └── page.tsx
    │   ├── inbox/
    │   │   └── page.tsx
    │   ├── mail/                 # Mail state pages
    │   │   ├── archive/
    │   │   │   └── page.tsx
    │   │   ├── deleted/
    │   │   │   └── page.tsx
    │   │   ├── drafts/
    │   │   │   └── page.tsx
    │   │   ├── folders/
    │   │   │   └── page.tsx
    │   │   ├── inbox/
    │   │   │   └── page.tsx
    │   │   ├── pinned/
    │   │   │   └── page.tsx
    │   │   ├── sent/
    │   │   │   └── page.tsx
    │   │   ├── signatures/
    │   │   │   └── page.tsx
    │   │   ├── spam/
    │   │   │   └── page.tsx
    │   │   └── templates/
    │   │       └── page.tsx
    │   ├── projects/
    │   │   └── page.tsx
    │   ├── settings/
    │   │   ├── page.tsx
    │   │   ├── org-intel/
    │   │   │   └── page.tsx
    │   │   └── style-mirror/
    │   │       └── page.tsx
    │   └── tasks/                # Tasks state pages
    │       ├── assigned/
    │       │   └── page.tsx
    │       ├── completed/
    │       │   └── page.tsx
    │       ├── due-today/
    │       │   └── page.tsx
    │       ├── labels/
    │       │   └── page.tsx
    │       ├── my-tasks/
    │       │   └── page.tsx
    │       ├── overdue/
    │       │   └── page.tsx
    │       ├── priorities/
    │       │   └── page.tsx
    │       ├── projects/
    │       │   └── page.tsx
    │       ├── templates/
    │       │   └── page.tsx
    │       └── time-tracking/
    │           └── page.tsx
    ├── components/               # React components
    │   ├── campaigns/
    │   │   └── campaign-builder.tsx
    │   ├── crm/
    │   │   └── crm-dashboard.tsx
    │   ├── dashboard/            # (empty directory)
    │   ├── email/
    │   │   ├── compose-email-modal.tsx
    │   │   └── email-inbox.tsx
    │   ├── layout/
    │   │   ├── index.ts
    │   │   ├── dashboard-layout.tsx  # Main dashboard wrapper
    │   │   ├── header.tsx
    │   │   ├── lima-sidebar.tsx      # Lima states sidebar
    │   │   └── sidebar.tsx
    │   ├── org-intel/
    │   │   └── org-intel.tsx
    │   ├── projects/
    │   │   ├── create-project-modal.tsx
    │   │   ├── project-card.tsx
    │   │   ├── projects-manager.tsx
    │   │   └── task-list.tsx
    │   ├── providers/
    │   │   ├── auth-provider.tsx
    │   │   ├── realtime-provider.tsx
    │   │   ├── theme-provider.tsx
    │   │   └── toast-provider.tsx
    │   ├── style-mirror/
    │   │   └── style-mirror.tsx
    │   └── ui/                   # Reusable UI components
    │       ├── index.ts
    │       ├── avatar.tsx
    │       ├── badge.tsx
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── input.tsx
    │       ├── progress.tsx
    │       ├── scroll-area.tsx
    │       ├── separator.tsx
    │       ├── tabs.tsx
    │       ├── textarea.tsx
    │       └── tooltip.tsx
    ├── constants/
    │   └── lima-states.ts        # State configurations
    ├── design-system/
    │   ├── design-language.md
    │   ├── implementation-guide.md
    │   ├── lima-design-system.css
    │   └── theme.ts
    ├── hooks/                    # (empty directory)
    ├── lib/                      # Utility libraries
    │   ├── cn.ts
    │   ├── config.ts
    │   ├── supabase.ts
    │   ├── utils.ts
    │   ├── ai/
    │   │   └── deepseek-service.ts
    │   └── email/
    │       ├── email-service-factory.ts
    │       ├── gmail-service.ts
    │       └── outlook-service.ts
    ├── stores/                   # State management
    │   ├── lima-states-store.ts  # Zustand Lima states store
    │   └── theme-store.ts
    ├── types/                    # TypeScript definitions
    │   ├── api.ts
    │   ├── components.ts
    │   ├── database.ts
    │   ├── lima-states.ts        # Lima states interfaces
    │   └── supabase.ts
    └── utils/
        └── index.ts
```

## Authentication and Route Protection

### Auth Flow

1. **Root Page**: Redirects authenticated users to `/mail/inbox`
2. **Unauthenticated**: Redirects to `/auth/signin`
3. **Protected Routes**: All Lima state routes require authentication

### Default Navigation

- **Initial State**: Mail (`mail`)
- **Default Route**: `/mail/inbox`
- **Fallback**: Authentication pages for unauthenticated users

## Dependencies

### Core Framework Dependencies

```json
{
  "next": "15.5.0",
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "typescript": "^5"
}
```

### State Management

```json
{
  "zustand": "^5.0.8"
}
```

### UI Components and Styling

```json
{
  "@radix-ui/react-accordion": "^1.2.12",
  "@radix-ui/react-avatar": "^1.1.10",
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-dropdown-menu": "^2.1.16",
  "@radix-ui/react-progress": "^1.1.7",
  "@radix-ui/react-scroll-area": "^1.2.10",
  "@radix-ui/react-select": "^2.2.6",
  "@radix-ui/react-separator": "^1.1.7",
  "@radix-ui/react-slot": "^1.2.3",
  "@radix-ui/react-tabs": "^1.1.13",
  "@radix-ui/react-toast": "^1.2.15",
  "@radix-ui/react-tooltip": "^1.2.8",
  "lucide-react": "^0.541.0",
  "tailwindcss": "^4",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.3.1",
  "tailwind-scrollbar-hide": "^4.0.0"
}
```

### Form Handling and Validation

```json
{
  "react-hook-form": "^7.62.0",
  "@hookform/resolvers": "^5.2.1",
  "zod": "^4.0.17"
}
```

### Backend and Database

```json
{
  "@supabase/auth-helpers-nextjs": "^0.10.0",
  "@supabase/ssr": "^0.7.0",
  "@supabase/supabase-js": "^2.56.0"
}
```

### Charts and Data Visualization

```json
{
  "recharts": "^3.1.2"
}
```

### Animation and Interactions

```json
{
  "framer-motion": "^12.23.12",
  "cmdk": "^1.1.1"
}
```

### Utilities and Helpers

```json
{
  "date-fns": "^4.1.0",
  "@headlessui/react": "^2.2.7"
}
```

### Email Integration

```json
{
  "googleapis": "^157.0.0",
  "nodemailer": "^7.0.5",
  "@types/nodemailer": "^7.0.1",
  "imap-simple": "^5.1.0"
}
```

### Development Dependencies

```json
{
  "@eslint/eslintrc": "^3",
  "@playwright/test": "^1.55.0",
  "@tailwindcss/postcss": "^4",
  "@testing-library/jest-dom": "^6.8.0",
  "@testing-library/react": "^16.3.0",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "15.5.0",
  "msw": "^2.10.5",
  "prettier": "^3.6.2"
}
```

## Key Features and Benefits

### 1. Dynamic Context Switching
- Seamless transitions between different business workflows
- Contextual menu items that adapt to the current state
- Persistent state across browser sessions

### 2. Intelligent Navigation
- Automatic route detection and state synchronization
- Navigation history with back functionality
- Programmatic navigation capabilities

### 3. Responsive Design
- Collapsible sidebar for different screen sizes
- Consistent layout across all states and pages
- Mobile-friendly navigation patterns

### 4. Developer Experience
- Type-safe state management with TypeScript
- Modular architecture for easy extension
- Clear separation of concerns
- Comprehensive error handling and validation

### 5. Performance Optimization
- Efficient state updates with Zustand
- Route-based code splitting with Next.js
- Optimized re-renders with selective subscriptions

## Extension and Customization

### Adding New States

1. Define new state in `lima-states.ts`
2. Add state ID to `LimaStateId` type
3. Create corresponding page routes in `app/` directory
4. Update store types if needed

### Adding Menu Items

1. Add new menu item to state configuration
2. Create corresponding page component
3. Add route in Next.js app directory
4. Update navigation logic if needed

### Customizing Themes

1. Update color values in state configurations
2. Modify Tailwind CSS classes in components
3. Adjust design system tokens as needed

This architecture provides a robust, scalable foundation for the Lima AI Growth Operating System, enabling seamless navigation between different business workflows while maintaining a consistent user experience and developer-friendly codebase.