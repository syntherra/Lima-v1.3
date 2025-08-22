// Core database types matching the Lima schema design

export interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface EmailAccount {
  id: string;
  user_id: string;
  email_address: string;
  provider: 'gmail' | 'outlook' | 'imap';
  access_token?: string;
  refresh_token?: string;
  is_connected: boolean;
  last_synced?: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  domain?: string;
  size?: string;
  industry?: string;
  sub_industry?: string;
  location?: string;
  funding_stage?: string;
  tech_stack?: Record<string, any>;
  linkedin_url?: string;
  last_enriched_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  company_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  role?: string;
  linkedin_url?: string;
  confidence_score?: number;
  status: 'prospect' | 'engaged' | 'customer' | 'invalid' | 'unsubscribed';
  source?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  company?: Company;
}

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  type: 'cold' | 'warm' | 'nurture';
  target_profile?: Record<string, any>;
  status: 'draft' | 'active' | 'paused' | 'completed';
  started_at?: string;
  ended_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignContact {
  id: string;
  campaign_id: string;
  contact_id: string;
  status: 'queued' | 'sent' | 'opened' | 'replied' | 'bounced' | 'unsubscribed' | 'escalated';
  last_action_at?: string;
  sequence_step: number;
  next_follow_up_at?: string;
  sent_count: number;
  created_at: string;
  updated_at: string;
  
  // Relations
  campaign?: Campaign;
  contact?: Contact;
}

export interface Email {
  id: string;
  from_contact_id?: string;
  to_contact_id?: string;
  campaign_id?: string;
  subject: string;
  body_html?: string;
  body_text?: string;
  sent_at?: string;
  opened_at?: string;
  clicked_at?: string;
  replied_at?: string;
  bounced_at?: string;
  is_from_ai: boolean;
  thread_id?: string;
  direction: 'inbound' | 'outbound';
  headers?: Record<string, any>;
  created_at: string;
  
  // Relations
  from_contact?: Contact;
  to_contact?: Contact;
  campaign?: Campaign;
}

export interface Conversation {
  id: string;
  contact_id: string;
  campaign_id?: string;
  summary?: string;
  intent?: string;
  escalated_to_user_at?: string;
  closed_at?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  contact?: Contact;
  campaign?: Campaign;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  status: 'active' | 'paused' | 'done';
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'waiting' | 'blocked' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  assigned_to: 'user' | 'lima';
  created_by: 'user' | 'ai';
  source_email_id?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  project?: Project;
  source_email?: Email;
}

export interface TaskUpdate {
  id: string;
  task_id: string;
  action: string;
  by: 'user' | 'ai';
  timestamp: string;
  
  // Relations
  task?: Task;
}

export interface UserVoiceProfile {
  id: string;
  user_id: string;
  tone?: string;
  greeting_style?: string;
  sign_off?: string;
  punctuation_style?: string;
  common_phrases?: Record<string, any>;
  avg_sentence_length?: number;
  last_updated: string;
}

export interface OrgIntelMap {
  id: string;
  user_id: string;
  data?: Record<string, any>;
  last_calculated?: string;
  confidence_score?: number;
}

export interface AnalyticsSnapshot {
  id: string;
  date: string;
  user_id: string;
  metric: string;
  value: number;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface AIInsight {
  id: string;
  user_id: string;
  insight_type: string;
  message: string;
  confidence: number;
  triggered_at: string;
  is_dismissed: boolean;
  created_at: string;
}

export interface AIActionLog {
  id: string;
  user_id: string;
  type: string;
  target_email?: string;
  reason?: string;
  confidence?: number;
  timestamp: string;
}