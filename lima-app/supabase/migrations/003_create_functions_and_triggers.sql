-- Lima AI Growth OS - Functions and Triggers
-- Migration: 003_create_functions_and_triggers.sql

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_accounts_updated_at BEFORE UPDATE ON email_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaign_contacts_updated_at BEFORE UPDATE ON campaign_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log task updates automatically
CREATE OR REPLACE FUNCTION log_task_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Log the update action
    INSERT INTO task_updates (task_id, action, by)
    VALUES (
        NEW.id,
        CASE 
            WHEN TG_OP = 'INSERT' THEN 'created'
            WHEN OLD.status != NEW.status THEN CONCAT('status_changed_to_', NEW.status)
            WHEN OLD.assigned_to != NEW.assigned_to THEN CONCAT('assigned_to_', NEW.assigned_to)
            WHEN OLD.priority != NEW.priority THEN CONCAT('priority_changed_to_', NEW.priority)
            ELSE 'updated'
        END,
        COALESCE(NEW.created_by, 'user')
    );
    
    -- Update completed_at when status changes to completed
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        NEW.completed_at = NOW();
    ELSIF NEW.status != 'completed' THEN
        NEW.completed_at = NULL;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply task update logging trigger
CREATE TRIGGER log_task_changes 
    AFTER INSERT OR UPDATE ON tasks 
    FOR EACH ROW EXECUTE FUNCTION log_task_update();

-- Function to update campaign contact status based on email events
CREATE OR REPLACE FUNCTION update_campaign_contact_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update campaign_contact status based on email events
    IF NEW.sent_at IS NOT NULL AND (OLD.sent_at IS NULL OR OLD.sent_at != NEW.sent_at) THEN
        UPDATE campaign_contacts 
        SET status = 'sent', 
            last_action_at = NEW.sent_at,
            sent_count = sent_count + 1
        WHERE campaign_id = NEW.campaign_id 
        AND contact_id = COALESCE(NEW.to_contact_id, NEW.from_contact_id);
    END IF;
    
    IF NEW.opened_at IS NOT NULL AND (OLD.opened_at IS NULL OR OLD.opened_at != NEW.opened_at) THEN
        UPDATE campaign_contacts 
        SET status = 'opened', 
            last_action_at = NEW.opened_at
        WHERE campaign_id = NEW.campaign_id 
        AND contact_id = COALESCE(NEW.to_contact_id, NEW.from_contact_id)
        AND status = 'sent';
    END IF;
    
    IF NEW.replied_at IS NOT NULL AND (OLD.replied_at IS NULL OR OLD.replied_at != NEW.replied_at) THEN
        UPDATE campaign_contacts 
        SET status = 'replied', 
            last_action_at = NEW.replied_at
        WHERE campaign_id = NEW.campaign_id 
        AND contact_id = COALESCE(NEW.from_contact_id, NEW.to_contact_id);
    END IF;
    
    IF NEW.bounced_at IS NOT NULL AND (OLD.bounced_at IS NULL OR OLD.bounced_at != NEW.bounced_at) THEN
        UPDATE campaign_contacts 
        SET status = 'bounced', 
            last_action_at = NEW.bounced_at
        WHERE campaign_id = NEW.campaign_id 
        AND contact_id = COALESCE(NEW.to_contact_id, NEW.from_contact_id);
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply email status update trigger
CREATE TRIGGER update_campaign_status_from_emails 
    AFTER INSERT OR UPDATE ON emails 
    FOR EACH ROW EXECUTE FUNCTION update_campaign_contact_status();

-- Function to auto-create user profile after auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger for auto-creating user profiles
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to search contacts by name (for auto-complete)
CREATE OR REPLACE FUNCTION search_contacts(search_term TEXT, user_id_param UUID)
RETURNS TABLE (
    id UUID,
    full_name TEXT,
    email TEXT,
    company_name TEXT,
    role TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        (c.first_name || ' ' || c.last_name) as full_name,
        c.email,
        comp.name as company_name,
        c.role
    FROM contacts c
    JOIN companies comp ON c.company_id = comp.id
    JOIN campaign_contacts cc ON c.id = cc.contact_id
    JOIN campaigns camp ON cc.campaign_id = camp.id
    WHERE camp.user_id = user_id_param
    AND (
        (c.first_name || ' ' || c.last_name) ILIKE '%' || search_term || '%'
        OR c.email ILIKE '%' || search_term || '%'
        OR comp.name ILIKE '%' || search_term || '%'
    )
    ORDER BY 
        CASE 
            WHEN (c.first_name || ' ' || c.last_name) ILIKE search_term || '%' THEN 1
            WHEN c.email ILIKE search_term || '%' THEN 2
            WHEN comp.name ILIKE search_term || '%' THEN 3
            ELSE 4
        END,
        (c.first_name || ' ' || c.last_name)
    LIMIT 10;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Function to get campaign analytics
CREATE OR REPLACE FUNCTION get_campaign_analytics(campaign_id_param UUID)
RETURNS TABLE (
    emails_sent BIGINT,
    emails_opened BIGINT,
    emails_replied BIGINT,
    contacts_added BIGINT,
    open_rate NUMERIC,
    reply_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(CASE WHEN e.sent_at IS NOT NULL THEN 1 END) as emails_sent,
        COUNT(CASE WHEN e.opened_at IS NOT NULL THEN 1 END) as emails_opened,
        COUNT(CASE WHEN e.replied_at IS NOT NULL THEN 1 END) as emails_replied,
        COUNT(DISTINCT cc.contact_id) as contacts_added,
        CASE 
            WHEN COUNT(CASE WHEN e.sent_at IS NOT NULL THEN 1 END) > 0 
            THEN ROUND(
                COUNT(CASE WHEN e.opened_at IS NOT NULL THEN 1 END)::NUMERIC / 
                COUNT(CASE WHEN e.sent_at IS NOT NULL THEN 1 END)::NUMERIC * 100, 2
            )
            ELSE 0 
        END as open_rate,
        CASE 
            WHEN COUNT(CASE WHEN e.sent_at IS NOT NULL THEN 1 END) > 0 
            THEN ROUND(
                COUNT(CASE WHEN e.replied_at IS NOT NULL THEN 1 END)::NUMERIC / 
                COUNT(CASE WHEN e.sent_at IS NOT NULL THEN 1 END)::NUMERIC * 100, 2
            )
            ELSE 0 
        END as reply_rate
    FROM campaign_contacts cc
    LEFT JOIN emails e ON e.campaign_id = cc.campaign_id 
        AND (e.to_contact_id = cc.contact_id OR e.from_contact_id = cc.contact_id)
    WHERE cc.campaign_id = campaign_id_param;
END;
$$ language 'plpgsql' SECURITY DEFINER;