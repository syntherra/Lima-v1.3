-- Lima AI Growth OS - Initial Database Schema
-- Migration: 001_create_core_schema.sql

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    company TEXT,
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email accounts table
CREATE TABLE email_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email_address TEXT NOT NULL,
    provider TEXT NOT NULL CHECK (provider IN ('gmail', 'outlook', 'imap')),
    access_token TEXT,
    refresh_token TEXT,
    is_connected BOOLEAN DEFAULT true,
    last_synced TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, email_address)
);

-- Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT UNIQUE,
    size TEXT,
    industry TEXT,
    sub_industry TEXT,
    location TEXT,
    funding_stage TEXT,
    tech_stack JSONB,
    linkedin_url TEXT,
    last_enriched_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contacts table
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    role TEXT,
    linkedin_url TEXT,
    confidence_score NUMERIC(5,2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
    status TEXT DEFAULT 'prospect' CHECK (status IN ('prospect', 'engaged', 'customer', 'invalid', 'unsubscribed')),
    source TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'cold' CHECK (type IN ('cold', 'warm', 'nurture')),
    target_profile JSONB,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign contacts junction table
CREATE TABLE campaign_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'opened', 'replied', 'bounced', 'unsubscribed', 'escalated')),
    last_action_at TIMESTAMPTZ,
    sequence_step INTEGER DEFAULT 1,
    next_follow_up_at TIMESTAMPTZ,
    sent_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(campaign_id, contact_id)
);

-- Emails table
CREATE TABLE emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_contact_id UUID REFERENCES contacts(id),
    to_contact_id UUID REFERENCES contacts(id),
    campaign_id UUID REFERENCES campaigns(id),
    subject TEXT NOT NULL,
    body_html TEXT,
    body_text TEXT,
    sent_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    replied_at TIMESTAMPTZ,
    bounced_at TIMESTAMPTZ,
    is_from_ai BOOLEAN DEFAULT false,
    thread_id TEXT,
    direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    headers JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id),
    summary TEXT,
    intent TEXT,
    escalated_to_user_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'done')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'waiting', 'blocked', 'completed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date DATE,
    assigned_to TEXT DEFAULT 'user' CHECK (assigned_to IN ('user', 'lima')),
    created_by TEXT DEFAULT 'user' CHECK (created_by IN ('user', 'ai')),
    source_email_id UUID REFERENCES emails(id),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task updates audit table
CREATE TABLE task_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    by TEXT NOT NULL CHECK (by IN ('user', 'ai')),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- User voice profiles table
CREATE TABLE user_voice_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tone TEXT,
    greeting_style TEXT,
    sign_off TEXT,
    punctuation_style TEXT,
    common_phrases JSONB,
    avg_sentence_length INTEGER,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Org intel maps table
CREATE TABLE org_intel_maps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    data JSONB,
    last_calculated TIMESTAMPTZ,
    confidence_score NUMERIC(3,2) CHECK (confidence_score >= 0.00 AND confidence_score <= 1.00)
);

-- Analytics snapshots table
CREATE TABLE analytics_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    metric TEXT NOT NULL,
    value NUMERIC NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(date, user_id, metric)
);

-- AI insights table
CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    insight_type TEXT NOT NULL,
    message TEXT NOT NULL,
    confidence NUMERIC(3,2) NOT NULL CHECK (confidence >= 0.00 AND confidence <= 1.00),
    triggered_at TIMESTAMPTZ NOT NULL,
    is_dismissed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI actions log table
CREATE TABLE ai_actions_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    target_email TEXT,
    reason TEXT,
    confidence NUMERIC(3,2) CHECK (confidence >= 0.00 AND confidence <= 1.00),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);