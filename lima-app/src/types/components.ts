// Component and UI types

import { ReactNode } from 'react';
import { 
  User, 
  Contact, 
  Company, 
  Campaign, 
  Email, 
  Task, 
  Project,
  CampaignMetrics,
  EmailTemplate,
  TargetProfile 
} from './database';

// Layout and navigation types
export interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: string | number;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Dashboard types
export interface DashboardMetrics {
  growth_pulse: {
    emails_sent: number;
    replies_received: number;
    meetings_booked: number;
    escalations: number;
    trend_percentage: number;
  };
  campaign_performance: CampaignMetrics;
  lead_intelligence: {
    industry_distribution: Record<string, number>;
    region_distribution: Record<string, number>;
    role_distribution: Record<string, number>;
    engagement_scores: {
      high: number;
      medium: number;
      low: number;
    };
  };
  deliverability_health: {
    domain_reputation: number;
    bounce_rate: number;
    spam_complaint_rate: number;
    warm_up_progress: number;
  };
}

export interface AIInsightDisplay {
  id: string;
  type: 'optimization' | 'engagement' | 'escalation' | 'learning';
  message: string;
  confidence: number;
  action_available: boolean;
  action_label?: string;
  created_at: string;
}

// Email interface types
export interface EmailThread {
  id: string;
  subject: string;
  participants: Contact[];
  last_message_at: string;
  message_count: number;
  has_unread: boolean;
  ai_tags: string[];
  emails: Email[];
}

export interface ComposeEmailData {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body_html: string;
  body_text: string;
  template_id?: string;
  campaign_id?: string;
  reply_to_email_id?: string;
  send_mode: 'you' | 'agent';
}

export interface EmailFilter {
  status?: 'all' | 'unread' | 'ai_sent' | 'user_sent';
  date_range?: {
    start: string;
    end: string;
  };
  campaign_id?: string;
  contact_id?: string;
  has_tasks?: boolean;
}

// CRM types
export interface ContactFilter {
  status?: 'all' | 'prospect' | 'engaged' | 'customer';
  company_id?: string;
  campaign_id?: string;
  engagement_level?: 'high' | 'medium' | 'low';
  source?: string;
  search_query?: string;
}

export interface CompanyFilter {
  industry?: string;
  location?: string;
  size?: string;
  funding_stage?: string;
  has_contacts?: boolean;
  search_query?: string;
}

export interface RelationshipMap {
  contacts: Array<Contact & {
    x: number;
    y: number;
    connections: string[];
  }>;
  connections: Array<{
    from: string;
    to: string;
    type: 'referral' | 'colleague' | 'reports_to';
    strength: number;
  }>;
}

// Campaign types
export interface CampaignStep {
  step_number: number;
  template: EmailTemplate;
  delay_days: number;
  conditions?: {
    if_not_replied?: boolean;
    if_not_opened?: boolean;
    custom_condition?: string;
  };
}

export interface CampaignBuilder {
  basic_info: {
    name: string;
    type: 'cold' | 'warm' | 'nurture';
    description?: string;
  };
  target_profile: TargetProfile;
  templates: EmailTemplate[];
  sequence: CampaignStep[];
  settings: {
    daily_limit: number;
    send_mode: 'you' | 'agent';
    auto_follow_up: boolean;
    stop_on_reply: boolean;
    unsubscribe_link: boolean;
  };
}

// Project and task types
export interface TaskFilter {
  status?: 'all' | 'pending' | 'in_progress' | 'completed';
  priority?: 'all' | 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: 'all' | 'user' | 'lima';
  due_date?: 'overdue' | 'today' | 'this_week' | 'this_month';
  project_id?: string;
  has_source_email?: boolean;
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: Task['status'];
  tasks: Task[];
  task_count: number;
}

export interface TaskCard {
  task: Task;
  is_dragging?: boolean;
  is_editing?: boolean;
  show_details?: boolean;
}

// Settings types
export interface UserSettings {
  profile: {
    name: string;
    email: string;
    company: string;
    timezone: string;
    avatar_url?: string;
  };
  email_preferences: {
    signature: string;
    default_send_mode: 'you' | 'agent';
    auto_reply_enabled: boolean;
    ooo_mode_enabled: boolean;
  };
  ai_preferences: {
    voice_matching_enabled: boolean;
    task_extraction_enabled: boolean;
    insight_frequency: 'real_time' | 'daily' | 'weekly';
    auto_escalation_threshold: number;
  };
  notification_preferences: {
    email_notifications: boolean;
    browser_notifications: boolean;
    notification_types: string[];
  };
  integrations: {
    connected_email_accounts: string[];
    calendar_connected: boolean;
    third_party_services: Record<string, boolean>;
  };
}

// Modal and dialog types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
}

// Form types
export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  error?: string;
  help_text?: string;
  options?: Array<{ label: string; value: string }>;
}

// Table types
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  empty_message?: string;
  page_size?: number;
  sortable?: boolean;
  selectable?: boolean;
  on_row_click?: (row: T) => void;
  on_selection_change?: (selected: T[]) => void;
}

// Chart and analytics types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  label?: string;
}

export interface MetricCard {
  title: string;
  value: string | number;
  change?: {
    value: number;
    percentage: number;
    direction: 'up' | 'down' | 'neutral';
  };
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Loading and error states
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message: string;
  code?: string;
  retry?: () => void;
}

// Generic utility types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: Record<string, any>;
  };
  metadata?: Record<string, any>;
}