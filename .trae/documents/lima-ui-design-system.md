# Lima AI Growth Operating System - UI/UX Design System

## 1. Design Philosophy

### Core Principles
- **Minimal Complexity**: Clean, uncluttered interfaces that reduce cognitive load
- **Data-First**: Visual hierarchy that emphasizes metrics, insights, and actionable information
- **AI-Transparent**: Clear distinction between user actions and AI-generated content
- **Professional Efficiency**: Streamlined workflows for high-frequency B2B tasks
- **Contextual Intelligence**: Adaptive interfaces that surface relevant information

### Brand Personality
- **Intelligent**: Sophisticated yet approachable AI-powered experience
- **Reliable**: Consistent, predictable interactions that build trust
- **Progressive**: Modern design language reflecting cutting-edge technology
- **Results-Driven**: Every element supports conversion and growth objectives

## 2. Modern Color System

### Primary Palette
```css
/* Brand Identity */
--lima-primary-50: #EFF6FF;
--lima-primary-100: #DBEAFE;
--lima-primary-500: #3B82F6;  /* Primary Blue */
--lima-primary-600: #2563EB;  /* Primary Dark */
--lima-primary-700: #1D4ED8;
--lima-primary-900: #1E3A8A;

/* Success & Growth */
--lima-success-50: #ECFDF5;
--lima-success-100: #D1FAE5;
--lima-success-500: #10B981;  /* Growth Green */
--lima-success-600: #059669;
--lima-success-700: #047857;

/* AI & Intelligence */
--lima-ai-50: #F5F3FF;
--lima-ai-100: #EDE9FE;
--lima-ai-500: #8B5CF6;       /* AI Purple */
--lima-ai-600: #7C3AED;
--lima-ai-700: #6D28D9;

/* Warning & Attention */
--lima-warning-50: #FFFBEB;
--lima-warning-100: #FEF3C7;
--lima-warning-500: #F59E0B;  /* Amber */
--lima-warning-600: #D97706;

/* Error & Critical */
--lima-error-50: #FEF2F2;
--lima-error-100: #FEE2E2;
--lima-error-500: #EF4444;    /* Red */
--lima-error-600: #DC2626;
```

### Neutral System
```css
/* Background Hierarchy */
--lima-bg-primary: #FFFFFF;     /* Main backgrounds */
--lima-bg-secondary: #F8FAFC;   /* Page backgrounds */
--lima-bg-tertiary: #F1F5F9;    /* Section backgrounds */
--lima-bg-elevated: #FFFFFF;    /* Cards, modals */
--lima-bg-overlay: rgba(15, 23, 42, 0.8); /* Modal overlays */

/* Text Hierarchy */
--lima-text-primary: #0F172A;   /* Headlines, primary text */
--lima-text-secondary: #475569; /* Body text, descriptions */
--lima-text-tertiary: #64748B;  /* Captions, metadata */
--lima-text-quaternary: #94A3B8; /* Placeholders, disabled */
--lima-text-inverse: #FFFFFF;   /* Text on dark backgrounds */

/* Border System */
--lima-border-primary: #E2E8F0;   /* Default borders */
--lima-border-secondary: #CBD5E1; /* Emphasized borders */
--lima-border-focus: #3B82F6;     /* Focus states */
--lima-border-error: #EF4444;     /* Error states */
```

## 3. Typography System

### Font Stack
```css
/* Primary Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;

/* Monospace for Code/Data */
font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace;
```

### Type Scale
```css
/* Display Text - Hero sections, major headings */
.text-display-2xl { font-size: 4.5rem; font-weight: 800; line-height: 1; letter-spacing: -0.025em; }
.text-display-xl { font-size: 3.75rem; font-weight: 800; line-height: 1; letter-spacing: -0.025em; }
.text-display-lg { font-size: 3rem; font-weight: 700; line-height: 1.1; letter-spacing: -0.025em; }
.text-display-md { font-size: 2.25rem; font-weight: 700; line-height: 1.2; letter-spacing: -0.025em; }
.text-display-sm { font-size: 1.875rem; font-weight: 600; line-height: 1.3; }

/* Heading Text - Section titles, card headers */
.text-heading-xl { font-size: 1.5rem; font-weight: 600; line-height: 1.4; }
.text-heading-lg { font-size: 1.25rem; font-weight: 600; line-height: 1.4; }
.text-heading-md { font-size: 1.125rem; font-weight: 500; line-height: 1.4; }
.text-heading-sm { font-size: 1rem; font-weight: 500; line-height: 1.5; }

/* Body Text - Content, descriptions */
.text-body-xl { font-size: 1.25rem; font-weight: 400; line-height: 1.6; }
.text-body-lg { font-size: 1.125rem; font-weight: 400; line-height: 1.6; }
.text-body-md { font-size: 1rem; font-weight: 400; line-height: 1.6; }
.text-body-sm { font-size: 0.875rem; font-weight: 400; line-height: 1.5; }
.text-body-xs { font-size: 0.75rem; font-weight: 400; line-height: 1.5; }

/* Label Text - UI elements, form labels */
.text-label-lg { font-size: 0.875rem; font-weight: 500; line-height: 1.4; }
.text-label-md { font-size: 0.75rem; font-weight: 500; line-height: 1.4; }
.text-label-sm { font-size: 0.6875rem; font-weight: 500; line-height: 1.4; text-transform: uppercase; letter-spacing: 0.05em; }
```

## 4. Spacing & Layout System

### Spacing Scale (8px base unit)
```css
--space-0: 0;
--space-px: 1px;
--space-0-5: 0.125rem;  /* 2px */
--space-1: 0.25rem;     /* 4px */
--space-1-5: 0.375rem;  /* 6px */
--space-2: 0.5rem;      /* 8px */
--space-2-5: 0.625rem;  /* 10px */
--space-3: 0.75rem;     /* 12px */
--space-3-5: 0.875rem;  /* 14px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-7: 1.75rem;     /* 28px */
--space-8: 2rem;        /* 32px */
--space-10: 2.5rem;     /* 40px */
--space-12: 3rem;       /* 48px */
--space-16: 4rem;       /* 64px */
--space-20: 5rem;       /* 80px */
--space-24: 6rem;       /* 96px */
```

### Layout Grid System
```css
/* Container Sizes */
.container-sm { max-width: 640px; }
.container-md { max-width: 768px; }
.container-lg { max-width: 1024px; }
.container-xl { max-width: 1280px; }
.container-2xl { max-width: 1536px; }

/* Grid Templates */
.grid-dashboard { display: grid; grid-template-columns: 280px 1fr; min-height: 100vh; }
.grid-content { display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--space-6); }
.grid-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-4); }
.grid-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-6); }
```

## 5. Component Library Specifications

### Button System
```css
/* Base Button */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
  text-decoration: none;
}

/* Size Variants */
.btn-xs { padding: 0.375rem 0.75rem; font-size: 0.75rem; }
.btn-sm { padding: 0.5rem 1rem; font-size: 0.875rem; }
.btn-md { padding: 0.625rem 1.25rem; font-size: 0.875rem; }
.btn-lg { padding: 0.75rem 1.5rem; font-size: 1rem; }
.btn-xl { padding: 1rem 2rem; font-size: 1.125rem; }

/* Style Variants */
.btn-primary {
  background: var(--lima-primary-500);
  color: white;
}
.btn-primary:hover {
  background: var(--lima-primary-600);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: white;
  color: var(--lima-text-primary);
  border: 1px solid var(--lima-border-primary);
}
.btn-secondary:hover {
  background: var(--lima-bg-secondary);
  border-color: var(--lima-border-secondary);
}

.btn-ai {
  background: linear-gradient(135deg, var(--lima-ai-500) 0%, var(--lima-ai-600) 100%);
  color: white;
}
.btn-ai:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}
```

### Card System
```css
/* Base Card */
.card {
  background: var(--lima-bg-elevated);
  border-radius: 12px;
  border: 1px solid var(--lima-border-primary);
  overflow: hidden;
  transition: all 0.2s ease;
}

.card:hover {
  border-color: var(--lima-border-secondary);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Card Variants */
.card-elevated {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.card-metric {
  background: linear-gradient(135deg, var(--lima-primary-500) 0%, var(--lima-primary-600) 100%);
  color: white;
  border: none;
}

.card-ai {
  background: linear-gradient(135deg, var(--lima-ai-50) 0%, var(--lima-ai-100) 100%);
  border-color: var(--lima-ai-200);
}
```

### Input System
```css
/* Base Input */
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--lima-border-primary);
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: white;
}

.input:focus {
  outline: none;
  border-color: var(--lima-border-focus);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input:error {
  border-color: var(--lima-border-error);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Input Sizes */
.input-sm { padding: 0.5rem 0.75rem; font-size: 0.75rem; }
.input-lg { padding: 1rem 1.25rem; font-size: 1rem; }
```

## 6. Layout Patterns

### Dashboard Layout
```css
.dashboard-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
  background: var(--lima-bg-secondary);
}

.dashboard-sidebar {
  background: white;
  border-right: 1px solid var(--lima-border-primary);
  padding: var(--space-6);
}

.dashboard-main {
  padding: var(--space-8);
  overflow-y: auto;
}

.dashboard-header {
  margin-bottom: var(--space-8);
}

.dashboard-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}
```

### CRM Layout
```css
.crm-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  height: 100vh;
}

.crm-sidebar {
  background: white;
  border-right: 1px solid var(--lima-border-primary);
  overflow-y: auto;
}

.crm-main {
  background: var(--lima-bg-secondary);
  padding: var(--space-6);
  overflow-y: auto;
}

.crm-list {
  display: grid;
  gap: var(--space-4);
}

.crm-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-6);
}
```

### Email Inbox Layout
```css
.inbox-layout {
  display: grid;
  grid-template-columns: 320px 1fr 400px;
  height: 100vh;
}

.inbox-list {
  background: white;
  border-right: 1px solid var(--lima-border-primary);
  overflow-y: auto;
}

.inbox-content {
  background: white;
  border-right: 1px solid var(--lima-border-primary);
  overflow-y: auto;
}

.inbox-sidebar {
  background: var(--lima-bg-secondary);
  padding: var(--space-6);
  overflow-y: auto;
}
```

## 7. User Experience Flows

### Navigation Hierarchy
1. **Primary Navigation**: Dashboard, CRM, Inbox, Campaigns, Projects
2. **Secondary Navigation**: Filters, views, actions within each section
3. **Contextual Actions**: Quick actions, AI suggestions, bulk operations

### Information Architecture
```
Dashboard
├── Growth Pulse (Metrics Overview)
├── Campaign Performance
├── AI Activity Feed
└── Predictive Insights

CRM
├── Companies View
│   ├── List View
│   ├── Grid View
│   └── Company Details
└── Contacts View
    ├── List View
    ├── Grid View
    └── Contact Details

Inbox
├── Email List
├── Email Content
└── AI Assistant Panel

Campaigns
├── Campaign List
├── Campaign Builder
├── Target Definition
└── Performance Analytics
```

### Interaction Patterns
- **Progressive Disclosure**: Show essential information first, details on demand
- **Contextual Actions**: Actions appear based on user context and selection
- **Bulk Operations**: Multi-select with batch actions for efficiency
- **Real-time Updates**: Live data updates without page refresh
- **AI Transparency**: Clear indicators for AI-generated content and suggestions

## 8. AI-Specific Design Elements

### AI Content Indicators
```css
.ai-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  background: var(--lima-ai-100);
  color: var(--lima-ai-700);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.ai-generated {
  border-left: 3px solid var(--lima-ai-500);
  background: var(--lima-ai-50);
}

.ai-suggestion {
  background: linear-gradient(90deg, var(--lima-ai-50) 0%, transparent 100%);
  border: 1px solid var(--lima-ai-200);
  border-radius: 8px;
}
```

### Loading States
```css
.ai-thinking {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--lima-ai-600);
  font-style: italic;
}

.ai-thinking::before {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid var(--lima-ai-200);
  border-top: 2px solid var(--lima-ai-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

## 9. Accessibility Guidelines

### Color Contrast
- **AA Standard**: Minimum 4.5:1 contrast ratio for normal text
- **AAA Standard**: 7:1 contrast ratio for important content
- **Color Independence**: Never rely solely on color to convey information

### Keyboard Navigation
- **Tab Order**: Logical, predictable tab sequence
- **Focus Indicators**: Visible focus states for all interactive elements
- **Keyboard Shortcuts**: Common shortcuts for power users

### Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy, landmarks, lists
- **ARIA Labels**: Descriptive labels for complex interactions
- **Live Regions**: Announce dynamic content changes

### Responsive Design
```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

## 10. Mobile Responsiveness Strategy

### Breakpoint Strategy
- **Mobile**: 320px - 767px (Stack vertically, simplified navigation)
- **Tablet**: 768px - 1023px (Hybrid layout, collapsible sidebar)
- **Desktop**: 1024px+ (Full layout with all features)

### Mobile-Specific Patterns
- **Bottom Navigation**: Primary actions accessible via thumb
- **Swipe Gestures**: Swipe to archive, delete, or navigate
- **Touch Targets**: Minimum 44px touch targets
- **Simplified Forms**: Single-column layouts, larger inputs

### Progressive Enhancement
1. **Core Functionality**: Works on all devices
2. **Enhanced Experience**: Additional features on larger screens
3. **Advanced Features**: Full desktop experience with all capabilities

## 11. Animation & Micro-interactions

### Transition System
```css
/* Easing Functions */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);

/* Duration Scale */
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;
```

### Micro-interactions
- **Hover States**: Subtle elevation and color changes
- **Loading States**: Skeleton screens and progress indicators
- **Success States**: Checkmarks and positive feedback
- **Error States**: Shake animations and clear error messages

## 12. Implementation Guidelines

### CSS Architecture
- **Utility-First**: Tailwind CSS for rapid development
- **Component Classes**: Custom classes for complex components
- **CSS Custom Properties**: For theming and dynamic values
- **Mobile-First**: Responsive design from smallest screen up

### Component Development
- **Atomic Design**: Atoms → Molecules → Organisms → Templates
- **Composition**: Flexible, composable component APIs
- **Accessibility**: Built-in accessibility features
- **Testing**: Visual regression testing for UI consistency

This design system provides a comprehensive foundation for building Lima's modern, minimal, and intuitive user interface. Each component and pattern is designed to support the AI-powered growth operating system while maintaining professional aesthetics and optimal user experience.