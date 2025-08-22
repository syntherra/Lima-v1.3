# Lima Page and Menu States Map

This document provides a comprehensive mapping of all Lima states, their menu items, and corresponding pages/routes. It serves as a complete reference guide for understanding the navigation structure and page organization.

## Overview

The Lima application uses a state-based navigation system with 5 main states, each containing contextual menu items that map to specific pages and routes.

## State-to-Menu-to-Page Mapping

### 1. Mail State

**State ID:** `mail`  
**Default Route:** `/mail/inbox`  
**Icon:** `Mail`

| Menu Item | Route | Component | Description |
|-----------|-------|-----------|-------------|
| Inbox | `/mail/inbox` | `EmailInbox` | Main inbox view with email list |
| Sent | `/mail/sent` | `EmailSent` | Sent emails view |
| Drafts | `/mail/drafts` | `EmailDrafts` | Draft emails view |
| Trash | `/mail/trash` | `EmailTrash` | Deleted emails view |
| Archive | `/mail/archive` | `EmailArchive` | Archived emails view |
| Spam | `/mail/spam` | `EmailSpam` | Spam/junk emails view |
| Important | `/mail/important` | `EmailImportant` | Important emails view |
| Starred | `/mail/starred` | `EmailStarred` | Starred emails view |

### 2. Growth OS State

**State ID:** `growth-os`  
**Default Route:** `/growth-os/dashboard`  
**Icon:** `TrendingUp`

| Menu Item | Route | Component | Description |
|-----------|-------|-----------|-------------|
| Dashboard | `/growth-os/dashboard` | `GrowthDashboard` | Main growth metrics dashboard |
| Analytics | `/growth-os/analytics` | `GrowthAnalytics` | Detailed analytics and insights |
| Campaigns | `/growth-os/campaigns` | `GrowthCampaigns` | Marketing campaigns management |
| A/B Tests | `/growth-os/ab-tests` | `ABTests` | A/B testing management |
| Funnels | `/growth-os/funnels` | `GrowthFunnels` | Conversion funnel analysis |
| Cohorts | `/growth-os/cohorts` | `GrowthCohorts` | User cohort analysis |
| Reports | `/growth-os/reports` | `GrowthReports` | Growth reports and exports |

### 3. CRM State

**State ID:** `crm`  
**Default Route:** `/crm/contacts`  
**Icon:** `Users`

| Menu Item | Route | Component | Description |
|-----------|-------|-----------|-------------|
| Contacts | `/crm/contacts` | `CRMContacts` | Contact management |
| Companies | `/crm/companies` | `CRMCompanies` | Company/account management |
| Deals | `/crm/deals` | `CRMDeals` | Sales pipeline and deals |
| Activities | `/crm/activities` | `CRMActivities` | Activity tracking and logs |
| Reports | `/crm/reports` | `CRMReports` | CRM analytics and reports |
| Settings | `/crm/settings` | `CRMSettings` | CRM configuration |

### 4. Calendar State

**State ID:** `calendar`  
**Default Route:** `/calendar/month`  
**Icon:** `Calendar`

| Menu Item | Route | Component | Description |
|-----------|-------|-----------|-------------|
| Month View | `/calendar/month` | `CalendarMonth` | Monthly calendar view |
| Week View | `/calendar/week` | `CalendarWeek` | Weekly calendar view |
| Day View | `/calendar/day` | `CalendarDay` | Daily calendar view |
| Agenda | `/calendar/agenda` | `CalendarAgenda` | List view of upcoming events |
| Events | `/calendar/events` | `CalendarEvents` | Event management |
| Reminders | `/calendar/reminders` | `CalendarReminders` | Reminder management |

### 5. Tasks State

**State ID:** `tasks`  
**Default Route:** `/tasks/today`  
**Icon:** `CheckSquare`

| Menu Item | Route | Component | Description |
|-----------|-------|-----------|-------------|
| Today | `/tasks/today` | `TasksToday` | Today's tasks |
| Upcoming | `/tasks/upcoming` | `TasksUpcoming` | Upcoming tasks |
| Completed | `/tasks/completed` | `TasksCompleted` | Completed tasks |
| Projects | `/tasks/projects` | `TasksProjects` | Project-based task organization |
| Labels | `/tasks/labels` | `TasksLabels` | Label-based task organization |
| Archive | `/tasks/archive` | `TasksArchive` | Archived tasks |

## Complete Route Mapping

### Authentication Routes
```
/auth/signin          → SignIn component
/auth/signup          → SignUp component
/auth/forgot-password → ForgotPassword component
/auth/reset-password  → ResetPassword component
```

### Main Application Routes
```
/                     → Redirects to /mail/inbox (if authenticated)
/mail/*               → Mail state routes (see Mail State table)
/growth-os/*          → Growth OS state routes (see Growth OS State table)
/crm/*                → CRM state routes (see CRM State table)
/calendar/*           → Calendar state routes (see Calendar State table)
/tasks/*              → Tasks state routes (see Tasks State table)
```

### Settings and Profile Routes
```
/settings/profile     → ProfileSettings component
/settings/account     → AccountSettings component
/settings/preferences → PreferencesSettings component
/settings/billing     → BillingSettings component
/settings/team        → TeamSettings component
```

### API Routes
```
/api/auth/*           → Authentication endpoints
/api/mail/*           → Email-related endpoints
/api/crm/*            → CRM data endpoints
/api/tasks/*          → Task management endpoints
/api/calendar/*       → Calendar events endpoints
/api/growth-os/*      → Growth analytics endpoints
/api/dashboard/*      → Dashboard metrics endpoints
/api/ai/*             → AI-powered features endpoints
```

## Navigation Flow Diagrams

### State Transition Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Mail     │◄──►│  Growth OS  │◄──►│     CRM     │
│   (mail)    │    │(growth-os)  │    │   (crm)     │
└─────────────┘    └─────────────┘    └─────────────┘
       ▲                   ▲                   ▲
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Calendar   │◄──►│    Tasks    │◄──►│  Settings   │
│ (calendar)  │    │  (tasks)    │    │ (settings)  │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Menu Item Hierarchy
```
Lima Sidebar
├── Logo Section
├── Contextual Menu (Dynamic based on active state)
│   ├── State-specific menu items
│   └── Quick actions
└── Lima States Section
    ├── Mail
    ├── Growth OS
    ├── CRM
    ├── Calendar
    └── Tasks
```

### Page Component Architecture
```
App Layout
├── DashboardLayout
│   ├── LimaSidebar
│   │   ├── Logo
│   │   ├── Contextual Menu
│   │   └── Lima States
│   └── Main Content Area
│       └── Page Component (based on route)
└── Providers
    ├── AuthProvider
    ├── ThemeProvider
    ├── ToastProvider
    └── RealtimeProvider
```

## Default Routes and Fallback Behavior

### Default State Behavior
- **Initial State:** Mail (`mail`)
- **Default Route:** `/mail/inbox`
- **Unauthenticated Redirect:** `/auth/signin`
- **Post-Login Redirect:** `/mail/inbox`

### Fallback Routes
```
/                     → /mail/inbox (if authenticated)
/mail                 → /mail/inbox
/growth-os            → /growth-os/dashboard
/crm                  → /crm/contacts
/calendar             → /calendar/month
/tasks                → /tasks/today
/settings             → /settings/profile
```

### Error Handling
```
404 Not Found         → Custom 404 page
403 Forbidden         → Redirect to /auth/signin
500 Server Error      → Custom error page
```

## State Management Integration

### Zustand Store Structure
```typescript
interface LimaStatesStore {
  // Current active state
  activeState: LimaStateId
  
  // Current active menu item within the state
  activeMenuItem: string
  
  // Navigation functions
  setActiveState: (state: LimaStateId) => void
  setActiveMenuItem: (menuItem: string) => void
  navigateToState: (state: LimaStateId, menuItem?: string) => void
}
```

### Route-State Synchronization
- **Automatic Detection:** `usePathname()` hook detects current route
- **State Updates:** Route changes automatically update active state and menu item
- **Navigation:** State changes trigger route navigation via Next.js router

## Cross-State Functionality

### Shared Components
- **Search:** Global search across all states
- **Notifications:** Real-time notifications system
- **User Menu:** Profile and settings access
- **Theme Toggle:** Dark/light mode switching

### Shared Data
- **User Profile:** Accessible from all states
- **Organization Data:** Shared across CRM and Growth OS
- **Calendar Events:** Integrated with Tasks and CRM
- **Email Integration:** Connected to CRM activities

### Inter-State Navigation
- **Quick Actions:** Jump between related items across states
- **Context Switching:** Maintain context when switching states
- **Deep Linking:** Direct links to specific items in any state

## Development Guidelines

### Adding New Menu Items
1. Update `LIMA_STATES` constant in `src/constants/lima-states.ts`
2. Create corresponding page component
3. Add route in appropriate directory under `src/app/`
4. Update type definitions in `src/types/lima-states.ts`

### Adding New States
1. Define new state in `LIMA_STATES` constant
2. Create state directory under `src/app/`
3. Implement default route and menu items
4. Update sidebar navigation logic
5. Add state-specific components and pages

### Route Protection
- All main application routes require authentication
- Middleware handles authentication checks
- Unauthenticated users redirected to sign-in
- Role-based access control for sensitive features

## Summary

This mapping provides a complete reference for the Lima application's navigation structure. The system is designed for:

- **Scalability:** Easy addition of new states and menu items
- **Consistency:** Uniform navigation patterns across all states
- **User Experience:** Intuitive state-based organization
- **Developer Experience:** Clear separation of concerns and predictable routing

For implementation details, refer to the `lima-states-architecture.md` document.