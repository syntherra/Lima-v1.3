# Lima AI Growth Operating System - States Design System

## Overview
Lima is a unified AI-powered growth operating system that combines multiple business tools into a single, state-based interface. The system features a dynamic 3-section sidebar that adapts its contextual menu based on the selected Lima state.

## Design Analysis from Figma

### Layout Structure
- **Container**: 1440x1024px with 32px border-radius and dark background (#252525)
- **Sidebar**: Fixed width, dark theme (#252525), 3-section vertical layout
- **Main Dashboard**: Flexible width, white background (#ffffff), 32px border-radius
- **Gap**: 32px between sidebar and main content

### Sidebar Structure (3 Sections)

#### 1. Top Section - Logo & Branding
- **Component**: `frame1`
- **Height**: 90px fixed
- **Content**: Lima logo (69x25px) + "AI Powered Growth OS" tagline
- **Styling**: White bottom border, 29px top/28px bottom padding
- **Typography**: Inter font, 14px, white color (#ffffff)

#### 2. Middle Section - Contextual Menu
- **Component**: `frame2`
- **Layout**: Flexible height (flex-grow: 1)
- **Content**: Dynamic menu items based on selected Lima state
- **Item Styling**: 
  - Background: Semi-transparent white (#ffffff0d)
  - Border-radius: 12px
  - Height: 38px
  - Padding: 10px 22px
  - Icon: 24x24px
  - Gap: 10px between icon and text

#### 3. Bottom Section - Lima States Switcher
- **Component**: `frame3`
- **Layout**: Fixed height with white top border
- **Content**: 5 Lima states (Mail, Growth OS, CRM, Calendar, Tasks)
- **Active State Styling**: Orange background (#ff6200)
- **Inactive State Styling**: Semi-transparent white (#ffffff0d)
- **Separator**: Decorative element (`frame13`) between middle and bottom sections

## Lima States Definition

### 1. Mail State
**Icon**: Email/Inbox icon
**Purpose**: Email management and communication
**Contextual Menu Items**:
- Inbox (primary)
- Sent
- Drafts
- Deleted Items
- Spam/Junk
- Folders
- Pinned
- Archive
- Templates
- Signatures

### 2. Growth OS State
**Icon**: Growth/Analytics icon
**Purpose**: Business growth analytics and insights
**Contextual Menu Items**:
- Dashboard
- Analytics
- Reports
- Metrics
- Goals
- Campaigns
- A/B Tests
- Conversion Funnels
- Customer Journey
- Growth Experiments

### 3. CRM State
**Icon**: People/Contacts icon
**Purpose**: Customer relationship management
**Contextual Menu Items**:
- Contacts
- Companies
- Deals
- Pipeline
- Activities
- Notes
- Follow-ups
- Lead Scoring
- Segments
- Import/Export

### 4. Calendar State
**Icon**: Calendar icon
**Purpose**: Schedule and time management
**Contextual Menu Items**:
- Today
- Week View
- Month View
- Agenda
- Events
- Meetings
- Reminders
- Recurring Events
- Time Blocks
- Availability

### 5. Tasks State
**Icon**: Task/Checklist icon
**Purpose**: Task and project management
**Contextual Menu Items**:
- My Tasks
- Projects
- Assigned to Me
- Due Today
- Overdue
- Completed
- Templates
- Priorities
- Labels
- Time Tracking

## Main Dashboard Pages

### Mail Dashboard
- Email list view with preview pane
- Compose email interface
- Email thread view
- Search and filter functionality
- Email analytics and insights

### Growth OS Dashboard
- Key metrics overview cards
- Growth charts and visualizations
- Campaign performance tracking
- Conversion rate analytics
- Goal progress indicators

### CRM Dashboard
- Contact/company overview
- Deal pipeline visualization
- Activity timeline
- Lead scoring dashboard
- Relationship mapping

### Calendar Dashboard
- Calendar grid view
- Upcoming events list
- Meeting scheduler
- Time zone management
- Calendar integrations

### Tasks Dashboard
- Task kanban board
- Project timeline view
- Task priority matrix
- Progress tracking
- Team collaboration tools

## State Management Architecture

### State Structure
```typescript
interface LimaState {
  id: 'mail' | 'growth-os' | 'crm' | 'calendar' | 'tasks';
  name: string;
  icon: string;
  menuItems: MenuItem[];
  defaultRoute: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  badge?: number;
  isActive?: boolean;
}
```

### Navigation Flow
1. User clicks on Lima state in bottom section
2. System updates active state
3. Middle section menu items dynamically update
4. Main dashboard content switches to corresponding page
5. URL routing updates to reflect current state and page

## Design Tokens

### Colors
- **Primary Background**: #252525 (Dark)
- **Secondary Background**: #ffffff (White)
- **Active State**: #ff6200 (Orange)
- **Menu Item Background**: #ffffff0d (Semi-transparent white)
- **Text Color**: #ffffff (White)
- **Border Color**: #ffffff (White)

### Typography
- **Font Family**: Inter
- **Font Size**: 14px
- **Line Height**: 17px
- **Letter Spacing**: 0

### Spacing
- **Container Padding**: 32px
- **Section Gap**: 14px
- **Menu Item Padding**: 10px 22px
- **Icon Size**: 24x24px
- **Border Radius**: 12px (menu items), 32px (containers)

### Layout
- **Sidebar Width**: Fixed (approximately 220px)
- **Menu Item Height**: 38px
- **Logo Section Height**: 90px
- **Icon-Text Gap**: 10px

## Implementation Notes

1. **Responsive Design**: Sidebar should collapse on mobile devices
2. **State Persistence**: Remember user's last selected state
3. **Smooth Transitions**: Animate state changes and menu updates
4. **Accessibility**: Proper ARIA labels and keyboard navigation
5. **Performance**: Lazy load dashboard content for inactive states
6. **Theming**: Support for light/dark theme switching
7. **Customization**: Allow users to reorder menu items and states

This design system provides a comprehensive foundation for implementing Lima's state-based navigation with dynamic contextual menus and corresponding dashboard experiences.