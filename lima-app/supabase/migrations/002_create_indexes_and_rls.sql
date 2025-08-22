-- Lima AI Growth OS - Indexes and RLS Policies
-- Migration: 002_create_indexes_and_rls.sql

-- Performance Indexes
CREATE INDEX idx_emails_thread_id ON emails(thread_id);
CREATE INDEX idx_emails_sent_at ON emails(sent_at);
CREATE INDEX idx_emails_campaign_id ON emails(campaign_id);
CREATE INDEX idx_campaign_contacts_status ON campaign_contacts(status);
CREATE INDEX idx_campaign_contacts_next_followup ON campaign_contacts(next_follow_up_at) WHERE next_follow_up_at IS NOT NULL;
CREATE INDEX idx_tasks_due_date ON tasks(due_date) WHERE due_date IS NOT NULL;
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_conversations_contact ON conversations(contact_id);
CREATE INDEX idx_analytics_user_date ON analytics_snapshots(user_id, date);
CREATE INDEX idx_contacts_email ON contacts(email) WHERE email IS NOT NULL;
CREATE INDEX idx_companies_domain ON companies(domain) WHERE domain IS NOT NULL;
CREATE INDEX idx_email_accounts_user ON email_accounts(user_id);
CREATE INDEX idx_campaigns_user_status ON campaigns(user_id, status);

-- Text search indexes
CREATE INDEX idx_companies_name_trgm ON companies USING gin(name gin_trgm_ops);
CREATE INDEX idx_contacts_name_trgm ON contacts USING gin((first_name || ' ' || last_name) gin_trgm_ops);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_voice_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_intel_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_actions_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for user-owned tables
CREATE POLICY "Users can manage own email accounts" ON email_accounts FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own campaigns" ON campaigns FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own projects" ON projects FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own voice profile" ON user_voice_profiles FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own org intel" ON org_intel_maps FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can view own analytics" ON analytics_snapshots FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can view own insights" ON ai_insights FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can view own AI actions" ON ai_actions_log FOR ALL USING (user_id = auth.uid());

-- RLS Policies for companies (accessible to all authenticated users for contact discovery)
CREATE POLICY "Authenticated users can view companies" ON companies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create companies" ON companies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update companies" ON companies FOR UPDATE TO authenticated USING (true);

-- RLS Policies for contacts (accessible through company relationship)
CREATE POLICY "Users can view contacts" ON contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create contacts" ON contacts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update contacts" ON contacts FOR UPDATE TO authenticated USING (true);

-- RLS Policies for campaign_contacts (through campaign ownership)
CREATE POLICY "Users can manage campaign contacts" ON campaign_contacts FOR ALL USING (
    EXISTS (SELECT 1 FROM campaigns WHERE campaigns.id = campaign_id AND campaigns.user_id = auth.uid())
);

-- RLS Policies for emails (through contact/campaign relationship)
CREATE POLICY "Users can view emails" ON emails FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM campaigns 
        WHERE campaigns.id = emails.campaign_id 
        AND campaigns.user_id = auth.uid()
    ) OR 
    EXISTS (
        SELECT 1 FROM contacts c1 
        JOIN campaign_contacts cc ON c1.id = cc.contact_id
        JOIN campaigns camp ON cc.campaign_id = camp.id
        WHERE (c1.id = emails.from_contact_id OR c1.id = emails.to_contact_id)
        AND camp.user_id = auth.uid()
    )
);

CREATE POLICY "Users can create emails" ON emails FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM campaigns 
        WHERE campaigns.id = emails.campaign_id 
        AND campaigns.user_id = auth.uid()
    )
);

CREATE POLICY "Users can update emails" ON emails FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM campaigns 
        WHERE campaigns.id = emails.campaign_id 
        AND campaigns.user_id = auth.uid()
    )
);

-- RLS Policies for conversations (through contact/campaign relationship)
CREATE POLICY "Users can manage conversations" ON conversations FOR ALL USING (
    EXISTS (
        SELECT 1 FROM campaigns 
        WHERE campaigns.id = conversations.campaign_id 
        AND campaigns.user_id = auth.uid()
    ) OR
    EXISTS (
        SELECT 1 FROM contacts c
        JOIN campaign_contacts cc ON c.id = cc.contact_id
        JOIN campaigns camp ON cc.campaign_id = camp.id
        WHERE c.id = conversations.contact_id
        AND camp.user_id = auth.uid()
    )
);

-- RLS Policies for tasks (through project ownership)
CREATE POLICY "Users can manage tasks" ON tasks FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_id AND projects.user_id = auth.uid())
);

-- RLS Policies for task_updates (through task ownership)
CREATE POLICY "Users can view task updates" ON task_updates FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM tasks t
        JOIN projects p ON t.project_id = p.id
        WHERE t.id = task_updates.task_id
        AND p.user_id = auth.uid()
    )
);

CREATE POLICY "Users can create task updates" ON task_updates FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM tasks t
        JOIN projects p ON t.project_id = p.id
        WHERE t.id = task_updates.task_id
        AND p.user_id = auth.uid()
    )
);