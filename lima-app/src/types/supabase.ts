// Generated Supabase types for Lima database schema

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          company: string | null;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          company?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          company?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      email_accounts: {
        Row: {
          id: string;
          user_id: string;
          email_address: string;
          provider: 'gmail' | 'outlook' | 'imap';
          access_token: string | null;
          refresh_token: string | null;
          is_connected: boolean;
          last_synced: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email_address: string;
          provider: 'gmail' | 'outlook' | 'imap';
          access_token?: string | null;
          refresh_token?: string | null;
          is_connected?: boolean;
          last_synced?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email_address?: string;
          provider?: 'gmail' | 'outlook' | 'imap';
          access_token?: string | null;
          refresh_token?: string | null;
          is_connected?: boolean;
          last_synced?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      companies: {
        Row: {
          id: string;
          name: string;
          domain: string | null;
          size: string | null;
          industry: string | null;
          sub_industry: string | null;
          location: string | null;
          funding_stage: string | null;
          tech_stack: Record<string, any> | null;
          linkedin_url: string | null;
          last_enriched_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          domain?: string | null;
          size?: string | null;
          industry?: string | null;
          sub_industry?: string | null;
          location?: string | null;
          funding_stage?: string | null;
          tech_stack?: Record<string, any> | null;
          linkedin_url?: string | null;
          last_enriched_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          domain?: string | null;
          size?: string | null;
          industry?: string | null;
          sub_industry?: string | null;
          location?: string | null;
          funding_stage?: string | null;
          tech_stack?: Record<string, any> | null;
          linkedin_url?: string | null;
          last_enriched_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          company_id: string;
          first_name: string;
          last_name: string;
          email: string | null;
          role: string | null;
          linkedin_url: string | null;
          confidence_score: number | null;
          status: 'prospect' | 'engaged' | 'customer' | 'invalid' | 'unsubscribed';
          source: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          first_name: string;
          last_name: string;
          email?: string | null;
          role?: string | null;
          linkedin_url?: string | null;
          confidence_score?: number | null;
          status?: 'prospect' | 'engaged' | 'customer' | 'invalid' | 'unsubscribed';
          source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          first_name?: string;
          last_name?: string;
          email?: string | null;
          role?: string | null;
          linkedin_url?: string | null;
          confidence_score?: number | null;
          status?: 'prospect' | 'engaged' | 'customer' | 'invalid' | 'unsubscribed';
          source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      campaigns: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'cold' | 'warm' | 'nurture';
          target_profile: Record<string, any> | null;
          status: 'draft' | 'active' | 'paused' | 'completed';
          started_at: string | null;
          ended_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type?: 'cold' | 'warm' | 'nurture';
          target_profile?: Record<string, any> | null;
          status?: 'draft' | 'active' | 'paused' | 'completed';
          started_at?: string | null;
          ended_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: 'cold' | 'warm' | 'nurture';
          target_profile?: Record<string, any> | null;
          status?: 'draft' | 'active' | 'paused' | 'completed';
          started_at?: string | null;
          ended_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      campaign_contacts: {
        Row: {
          id: string;
          campaign_id: string;
          contact_id: string;
          status: 'queued' | 'sent' | 'opened' | 'replied' | 'bounced' | 'unsubscribed' | 'escalated';
          last_action_at: string | null;
          sequence_step: number;
          next_follow_up_at: string | null;
          sent_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          contact_id: string;
          status?: 'queued' | 'sent' | 'opened' | 'replied' | 'bounced' | 'unsubscribed' | 'escalated';
          last_action_at?: string | null;
          sequence_step?: number;
          next_follow_up_at?: string | null;
          sent_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          contact_id?: string;
          status?: 'queued' | 'sent' | 'opened' | 'replied' | 'bounced' | 'unsubscribed' | 'escalated';
          last_action_at?: string | null;
          sequence_step?: number;
          next_follow_up_at?: string | null;
          sent_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      emails: {
        Row: {
          id: string;
          from_contact_id: string | null;
          to_contact_id: string | null;
          campaign_id: string | null;
          subject: string;
          body_html: string | null;
          body_text: string | null;
          sent_at: string | null;
          opened_at: string | null;
          clicked_at: string | null;
          replied_at: string | null;
          bounced_at: string | null;
          is_from_ai: boolean;
          thread_id: string | null;
          direction: 'inbound' | 'outbound';
          headers: Record<string, any> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          from_contact_id?: string | null;
          to_contact_id?: string | null;
          campaign_id?: string | null;
          subject: string;
          body_html?: string | null;
          body_text?: string | null;
          sent_at?: string | null;
          opened_at?: string | null;
          clicked_at?: string | null;
          replied_at?: string | null;
          bounced_at?: string | null;
          is_from_ai?: boolean;
          thread_id?: string | null;
          direction: 'inbound' | 'outbound';
          headers?: Record<string, any> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          from_contact_id?: string | null;
          to_contact_id?: string | null;
          campaign_id?: string | null;
          subject?: string;
          body_html?: string | null;
          body_text?: string | null;
          sent_at?: string | null;
          opened_at?: string | null;
          clicked_at?: string | null;
          replied_at?: string | null;
          bounced_at?: string | null;
          is_from_ai?: boolean;
          thread_id?: string | null;
          direction?: 'inbound' | 'outbound';
          headers?: Record<string, any> | null;
          created_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          contact_id: string;
          campaign_id: string | null;
          summary: string | null;
          intent: string | null;
          escalated_to_user_at: string | null;
          closed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          contact_id: string;
          campaign_id?: string | null;
          summary?: string | null;
          intent?: string | null;
          escalated_to_user_at?: string | null;
          closed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          contact_id?: string;
          campaign_id?: string | null;
          summary?: string | null;
          intent?: string | null;
          escalated_to_user_at?: string | null;
          closed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          status: 'active' | 'paused' | 'done';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          status?: 'active' | 'paused' | 'done';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          status?: 'active' | 'paused' | 'done';
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          status: 'pending' | 'in_progress' | 'waiting' | 'blocked' | 'completed';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          due_date: string | null;
          assigned_to: 'user' | 'lima';
          created_by: 'user' | 'ai';
          source_email_id: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          status?: 'pending' | 'in_progress' | 'waiting' | 'blocked' | 'completed';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          due_date?: string | null;
          assigned_to?: 'user' | 'lima';
          created_by?: 'user' | 'ai';
          source_email_id?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          description?: string | null;
          status?: 'pending' | 'in_progress' | 'waiting' | 'blocked' | 'completed';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          due_date?: string | null;
          assigned_to?: 'user' | 'lima';
          created_by?: 'user' | 'ai';
          source_email_id?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      task_updates: {
        Row: {
          id: string;
          task_id: string;
          action: string;
          by: 'user' | 'ai';
          timestamp: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          action: string;
          by: 'user' | 'ai';
          timestamp?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          action?: string;
          by?: 'user' | 'ai';
          timestamp?: string;
        };
      };
      user_voice_profiles: {
        Row: {
          id: string;
          user_id: string;
          tone: string | null;
          greeting_style: string | null;
          sign_off: string | null;
          punctuation_style: string | null;
          common_phrases: Record<string, any> | null;
          avg_sentence_length: number | null;
          last_updated: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tone?: string | null;
          greeting_style?: string | null;
          sign_off?: string | null;
          punctuation_style?: string | null;
          common_phrases?: Record<string, any> | null;
          avg_sentence_length?: number | null;
          last_updated?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tone?: string | null;
          greeting_style?: string | null;
          sign_off?: string | null;
          punctuation_style?: string | null;
          common_phrases?: Record<string, any> | null;
          avg_sentence_length?: number | null;
          last_updated?: string;
        };
      };
      org_intel_maps: {
        Row: {
          id: string;
          user_id: string;
          data: Record<string, any> | null;
          last_calculated: string | null;
          confidence_score: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          data?: Record<string, any> | null;
          last_calculated?: string | null;
          confidence_score?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          data?: Record<string, any> | null;
          last_calculated?: string | null;
          confidence_score?: number | null;
        };
      };
      analytics_snapshots: {
        Row: {
          id: string;
          date: string;
          user_id: string;
          metric: string;
          value: number;
          metadata: Record<string, any> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          user_id: string;
          metric: string;
          value: number;
          metadata?: Record<string, any> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          user_id?: string;
          metric?: string;
          value?: number;
          metadata?: Record<string, any> | null;
          created_at?: string;
        };
      };
      ai_insights: {
        Row: {
          id: string;
          user_id: string;
          insight_type: string;
          message: string;
          confidence: number;
          triggered_at: string;
          is_dismissed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          insight_type: string;
          message: string;
          confidence: number;
          triggered_at: string;
          is_dismissed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          insight_type?: string;
          message?: string;
          confidence?: number;
          triggered_at?: string;
          is_dismissed?: boolean;
          created_at?: string;
        };
      };
      ai_actions_log: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          target_email: string | null;
          reason: string | null;
          confidence: number | null;
          timestamp: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          target_email?: string | null;
          reason?: string | null;
          confidence?: number | null;
          timestamp?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          target_email?: string | null;
          reason?: string | null;
          confidence?: number | null;
          timestamp?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}