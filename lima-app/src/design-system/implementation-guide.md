# Lima Design System Implementation Guide

## Overview

This guide explains how to implement and use the Lima Design System throughout the application. The design system is inspired by modern B2B dashboards and optimized for CRM, email outreach, and AI-powered business growth tools.

## Setup Instructions

### 1. Import the Design System

Add the design system CSS to your main application:

```tsx
// In src/app/globals.css or src/app/layout.tsx
import '@/design-system/lima-design-system.css';
```

### 2. Use TypeScript Utilities

Import design utilities in your components:

```tsx
import { LimaDesignUtils, LimaPatterns } from '@/design-system/theme';
```

## Component Implementation Examples

### 1. Dashboard Layout

```tsx
// src/components/layout/dashboard-layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lima-dashboard">
      {/* Sidebar */}
      <aside className="lima-sidebar">
        <div className="lima-logo">
          <span>Lima</span>
        </div>
        <nav className="lima-nav">
          <a href="/dashboard" className="lima-nav-item active">
            <DashboardIcon className="lima-nav-icon" />
            Dashboard
          </a>
          <a href="/inbox" className="lima-nav-item">
            <MailIcon className="lima-nav-icon" />
            Inbox
          </a>
          <a href="/crm" className="lima-nav-item">
            <UsersIcon className="lima-nav-icon" />
            CRM
          </a>
          <a href="/campaigns" className="lima-nav-item">
            <TargetIcon className="lima-nav-icon" />
            Campaigns
          </a>
          <a href="/projects" className="lima-nav-item">
            <FolderIcon className="lima-nav-icon" />
            Projects
          </a>
          <a href="/settings" className="lima-nav-item">
            <SettingsIcon className="lima-nav-icon" />
            Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lima-content-main">
        {children}
      </main>
    </div>
  );
}
```

### 2. Metric Cards

```tsx
// src/components/dashboard/metric-card.tsx
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'positive' | 'negative';
  };
  icon?: React.ReactNode;
}

export function MetricCard({ title, value, change, icon }: MetricCardProps) {
  return (
    <div className="lima-metric-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="lima-metric-label">{title}</h3>
        {icon && <div className="text-white opacity-75">{icon}</div>}
      </div>
      
      <div className="lima-metric-value">{value}</div>
      
      {change && (
        <div className={`lima-metric-change ${change.trend}`}>
          <TrendingUpIcon className="w-4 h-4" />
          {change.value > 0 ? '+' : ''}{change.value}%
        </div>
      )}
    </div>
  );
}

// Usage
<div className="lima-metrics-row">
  <MetricCard
    title="Emails Sent"
    value="142"
    change={{ value: 12.5, trend: 'positive' }}
    icon={<MailIcon />}
  />
  <MetricCard
    title="Reply Rate"
    value="23.4%"
    change={{ value: 8.2, trend: 'positive' }}
    icon={<TrendingUpIcon />}
  />
</div>
```

### 3. CRM Contact Cards

```tsx
// src/components/crm/contact-card.tsx
interface ContactCardProps {
  contact: {
    id: string;
    name: string;
    email: string;
    company: string;
    avatar?: string;
    status: 'prospect' | 'engaged' | 'customer';
    lastActivity: string;
    pipelineStage: string;
  };
}

export function ContactCard({ contact }: ContactCardProps) {
  const cardClasses = LimaDesignUtils.getCardClasses('interactive');
  const statusBadgeClasses = LimaDesignUtils.getBadgeClasses(
    contact.status === 'customer' ? 'success' : 
    contact.status === 'engaged' ? 'warning' : 'primary'
  );

  return (
    <div className={cardClasses}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={LimaDesignUtils.getAvatarClasses('md')}>
          {contact.avatar ? (
            <img src={contact.avatar} alt={contact.name} />
          ) : (
            contact.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-heading-sm">{contact.name}</h3>
          <p className="text-body-sm text-muted">{contact.company}</p>
        </div>
        <div className={statusBadgeClasses}>
          {contact.status}
        </div>
      </div>

      {/* Contact Details */}
      <div className="space-y-2 mb-4">
        <p className="text-body-sm">{contact.email}</p>
        <p className="text-body-sm text-muted">Pipeline: {contact.pipelineStage}</p>
        <p className="text-label-sm text-muted">Last activity: {contact.lastActivity}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className={LimaDesignUtils.getButtonClasses('primary', 'sm')}>
          Contact
        </button>
        <button className={LimaDesignUtils.getButtonClasses('secondary', 'sm')}>
          View Details
        </button>
      </div>
    </div>
  );
}
```

### 4. Campaign Performance Cards

```tsx
// src/components/campaigns/campaign-card.tsx
interface CampaignCardProps {
  campaign: {
    id: string;
    name: string;
    type: 'cold' | 'warm' | 'nurture';
    status: 'draft' | 'active' | 'paused' | 'completed';
    metrics: {
      emailsSent: number;
      openRate: number;
      replyRate: number;
      totalContacts: number;
    };
    progress: {
      current: number;
      total: number;
    };
  };
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const progressPercentage = LimaDesignUtils.calculateProgress(
    campaign.progress.current,
    campaign.progress.total
  );

  const statusClasses = LimaPatterns.campaign.campaignStatus[campaign.status];

  return (
    <div className="lima-card lima-card-elevated">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-heading-md">{campaign.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`lima-badge lima-badge-${campaign.type === 'cold' ? 'primary' : campaign.type === 'warm' ? 'warning' : 'ai'}`}>
              {campaign.type}
            </span>
            <span className={statusClasses}>
              {campaign.status}
            </span>
          </div>
        </div>
        <button className={LimaDesignUtils.getButtonClasses('ai', 'sm')}>
          AI Optimize
        </button>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-body-sm mb-2">
          <span>Progress</span>
          <span>{campaign.progress.current}/{campaign.progress.total} contacts</span>
        </div>
        <div className="lima-progress">
          <div 
            className="lima-progress-bar" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-heading-lg text-primary">{campaign.metrics.emailsSent}</div>
          <div className="text-label-sm text-muted">Sent</div>
        </div>
        <div className="text-center">
          <div className="text-heading-lg text-success">{campaign.metrics.openRate}%</div>
          <div className="text-label-sm text-muted">Open Rate</div>
        </div>
        <div className="text-center">
          <div className="text-heading-lg text-warning">{campaign.metrics.replyRate}%</div>
          <div className="text-label-sm text-muted">Reply Rate</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className={LimaDesignUtils.getButtonClasses('primary', 'sm')}>
          View Details
        </button>
        <button className={LimaDesignUtils.getButtonClasses('secondary', 'sm')}>
          Edit Campaign
        </button>
      </div>
    </div>
  );
}
```

### 5. Email Thread Interface

```tsx
// src/components/email/email-thread.tsx
interface EmailThreadProps {
  thread: {
    id: string;
    subject: string;
    participants: Array<{
      name: string;
      email: string;
      avatar?: string;
    }>;
    lastMessage: {
      content: string;
      timestamp: string;
      from: string;
    };
    status: 'unread' | 'read' | 'replied' | 'ai_pending';
    priority: 'low' | 'medium' | 'high';
  };
}

export function EmailThread({ thread }: EmailThreadProps) {
  const priorityColor = thread.priority === 'high' ? 'error' : 
                       thread.priority === 'medium' ? 'warning' : 'primary';

  return (
    <div className={LimaPatterns.email.threadCard}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-heading-sm">{thread.subject}</h3>
          {thread.status === 'unread' && (
            <span className={LimaPatterns.email.unreadBadge}>New</span>
          )}
          {thread.status === 'ai_pending' && (
            <span className={LimaPatterns.email.aiGenerated}>AI Drafting</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={LimaDesignUtils.getBadgeClasses(priorityColor)}>
            {thread.priority} priority
          </span>
          <span className="text-label-sm text-muted">{thread.lastMessage.timestamp}</span>
        </div>
      </div>

      {/* Participants */}
      <div className="flex items-center gap-2 mb-3">
        <div className="lima-avatar-group">
          {thread.participants.slice(0, 3).map((participant, index) => (
            <div key={index} className={LimaDesignUtils.getAvatarClasses('sm')}>
              {participant.avatar ? (
                <img src={participant.avatar} alt={participant.name} />
              ) : (
                participant.name.charAt(0).toUpperCase()
              )}
            </div>
          ))}
          {thread.participants.length > 3 && (
            <div className={`${LimaDesignUtils.getAvatarClasses('sm')} bg-secondary`}>
              +{thread.participants.length - 3}
            </div>
          )}
        </div>
        <span className="text-body-sm text-muted">
          {thread.participants.map(p => p.name).join(', ')}
        </span>
      </div>

      {/* Last Message Preview */}
      <p className="text-body-sm text-secondary mb-4 line-clamp-2">
        {thread.lastMessage.content}
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <button className={LimaPatterns.email.replyButton}>
          Reply
        </button>
        <button className={LimaDesignUtils.getButtonClasses('ai', 'sm')}>
          AI Suggest
        </button>
        <button className={LimaDesignUtils.getButtonClasses('secondary', 'sm')}>
          Archive
        </button>
      </div>
    </div>
  );
}
```

### 6. Task Kanban Cards

```tsx
// src/components/projects/task-card.tsx
interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'in_progress' | 'waiting' | 'completed';
    assignee: 'user' | 'ai';
    dueDate?: string;
    labels: string[];
  };
}

export function TaskCard({ task }: TaskCardProps) {
  const priorityClasses = LimaPatterns.task.priority[task.priority];
  const assigneeClasses = LimaPatterns.task.assignee[task.assignee];

  return (
    <div className={LimaPatterns.task.kanbanCard}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-heading-sm">{task.title}</h3>
        <div className={assigneeClasses}>
          {task.assignee === 'ai' ? 'AI' : 'U'}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-body-sm text-secondary mb-3">{task.description}</p>
      )}

      {/* Labels */}
      {task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.labels.map((label, index) => (
            <span key={index} className={LimaDesignUtils.getBadgeClasses('neutral')}>
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className={priorityClasses}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="text-label-sm text-muted">
            Due: {task.dueDate}
          </span>
        )}
      </div>
    </div>
  );
}
```

## Best Practices

### 1. Component Composition
- Use design system utilities for consistent styling
- Compose complex components from basic design system elements
- Maintain semantic HTML structure

### 2. Color Usage
- Use semantic colors (success, warning, error) for status indicators
- Reserve AI purple for AI-specific features
- Use primary blue for main actions and branding

### 3. Typography
- Use heading classes for titles and section headers
- Use body classes for general content
- Use label classes for form labels and metadata

### 4. Spacing
- Follow the 4px grid system for consistent spacing
- Use spacing utilities for margins and padding
- Maintain visual rhythm throughout the interface

### 5. Interactive Elements
- Apply hover effects to interactive cards and buttons
- Use focus states for accessibility
- Provide clear visual feedback for user actions

## Customization

### Adding Custom Colors
```css
:root {
  --lima-custom-color: #YOUR_COLOR;
}

.custom-element {
  background: var(--lima-custom-color);
}
```

### Creating Custom Components
```tsx
// Follow the design system patterns
const customComponent = LimaDesignUtils.getCardClasses('elevated');
```

This design system ensures Lima maintains a professional, cohesive appearance while supporting the complex data visualization and interaction patterns required for B2B CRM and outreach tools.