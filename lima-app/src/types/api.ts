// API and external service types

export interface DeepSeekAPIRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface DeepSeekAPIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface GmailOAuthTokens {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}

export interface OutlookOAuthTokens {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  }>;
  location?: string;
  hangoutLink?: string;
}

export interface HunterEmailFinderResponse {
  data: {
    first_name: string;
    last_name: string;
    email: string;
    score: number;
    domain: string;
    accept_all: boolean;
    block: boolean;
    sources: Array<{
      domain: string;
      uri: string;
      extracted_on: string;
      last_seen_on: string;
      still_on_page: boolean;
    }>;
  };
  meta: {
    params: {
      first_name: string;
      last_name: string;
      domain: string;
    };
  };
}

export interface ApolloPersonSearch {
  people: Array<{
    id: string;
    first_name: string;
    last_name: string;
    name: string;
    linkedin_url: string;
    title: string;
    email: string;
    organization: {
      id: string;
      name: string;
      website_url: string;
      blog_url: string;
      angellist_url: string;
      linkedin_url: string;
      twitter_url: string;
      facebook_url: string;
    };
  }>;
}

export interface CrunchbaseCompanyData {
  uuid: string;
  name: string;
  short_description: string;
  profile_image_url: string;
  domain: string;
  homepage_url: string;
  country_code: string;
  state_code: string;
  city: string;
  address: string;
  postal_code: string;
  phone: string;
  email: string;
  facebook_url: string;
  linkedin_url: string;
  twitter_url: string;
  logo_url: string;
  aliases: string[];
  company_type: string;
  contact_email: string;
  ipo_status: string;
  legal_name: string;
  num_employees_enum: string;
  operating_status: string;
  founded_on: string;
  funding_stage: string;
  funding_total: {
    value_usd: number;
    currency: string;
    value: number;
  };
}

export interface ResendEmailRequest {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  reply_to?: string | string[];
  tags?: Array<{
    name: string;
    value: string;
  }>;
  headers?: Record<string, string>;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    content_type?: string;
    disposition?: 'attachment' | 'inline';
  }>;
}

export interface ResendEmailResponse {
  id: string;
  from: string;
  to: string[];
  created_at: string;
}

export interface EmailValidationResult {
  email: string;
  valid: boolean;
  reason?: string;
  disposable: boolean;
  webmail: boolean;
  mx_found: boolean;
  smtp_check: boolean;
}

// Campaign and outreach types
export interface TargetProfile {
  industry?: string;
  sub_industry?: string;
  location?: string;
  company_size?: string;
  target_role?: string;
  funding_stage?: string;
  tech_stack?: string[];
  keywords?: string[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body_html: string;
  body_text: string;
  variables: string[];
  sequence_step: number;
  delay_days: number;
}

export interface CampaignMetrics {
  emails_sent: number;
  emails_opened: number;
  emails_replied: number;
  meetings_booked: number;
  contacts_added: number;
  open_rate: number;
  reply_rate: number;
  conversion_rate: number;
  bounce_rate: number;
  unsubscribe_rate: number;
}

// Voice profile and style mirror types
export interface StyleAnalysis {
  tone: 'formal' | 'casual' | 'friendly' | 'professional' | 'enthusiastic';
  greeting_style: 'hi' | 'hello' | 'hey' | 'greetings' | 'good_morning';
  sign_off: 'best' | 'thanks' | 'regards' | 'talk_soon' | 'cheers';
  punctuation_style: 'minimal' | 'standard' | 'heavy';
  avg_sentence_length: number;
  common_phrases: string[];
  response_length: 'brief' | 'medium' | 'detailed';
  formality_score: number;
  enthusiasm_score: number;
}

// AI processing types
export interface TaskExtractionResult {
  has_tasks: boolean;
  tasks: Array<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    due_date?: string;
    assigned_to: 'user' | 'lima';
    confidence: number;
  }>;
  confidence: number;
}

export interface EmailIntentClassification {
  intent: 'question' | 'request' | 'meeting' | 'follow_up' | 'objection' | 'positive' | 'neutral';
  sentiment: 'positive' | 'neutral' | 'negative';
  urgency: 'low' | 'medium' | 'high';
  confidence: number;
  key_phrases: string[];
}

export interface OrgIntelData {
  contacts: Record<string, {
    responsibilities: string[];
    team: string;
    confidence: number;
  }>;
  teams: Record<string, {
    members: string[];
    responsibilities: string[];
  }>;
  reporting_lines: Record<string, string>;
  last_updated: string;
}