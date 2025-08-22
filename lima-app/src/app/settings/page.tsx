'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';
import { 
  User, 
  Mail, 
  Bell, 
  Shield, 
  CreditCard, 
  Zap,
  Save,
  Upload,
  Eye,
  EyeOff,
  Globe,
  Bot,
  Calendar,
  Database,
  Key,
  Trash2
} from 'lucide-react';
import { cn } from '@/utils';

interface SettingsSection {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    profile: {
      name: user?.user_metadata?.name || '',
      email: user?.email || '',
      company: 'Lima Technologies',
      role: 'CEO',
      timezone: 'America/New_York',
      language: 'en'
    },
    notifications: {
      emailNewLeads: true,
      emailCampaignUpdates: true,
      emailWeeklyReport: true,
      pushReplies: true,
      pushMeetings: true,
      smsUrgent: false
    },
    ai: {
      personalityTone: 'professional',
      autoReply: false,
      autoFollowUp: true,
      creativityLevel: 'balanced',
      includePersonalization: true,
      useCompanyNews: true
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 60,
      ipWhitelist: '',
      apiKeyRotation: 30
    },
    billing: {
      plan: 'Pro',
      billingCycle: 'monthly',
      seats: 5,
      usage: {
        emails: 1250,
        limit: 2000
      }
    },
    integrations: {
      salesforce: { connected: true, lastSync: '2024-01-20T10:30:00Z' },
      hubspot: { connected: false, lastSync: null },
      slack: { connected: true, lastSync: '2024-01-20T09:15:00Z' },
      zapier: { connected: false, lastSync: null }
    }
  });

  const sections: SettingsSection[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'ai', label: 'AI Settings', icon: Bot },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'integrations', label: 'Integrations', icon: Zap }
  ];

  const handleSave = async (section: string) => {
    try {
      // In a real app, this would save to the backend
      success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully`);
    } catch (err) {
      error('Failed to save settings');
    }
  };

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <DashboardLayout>
      <div className="lima-h-full flex">
        {/* Settings Sidebar */}
        <div className="w-64 lima-sidebar border-r border-gray-200">
          <div className="p-6">
            <h1 className="lima-text-2xl lima-text-primary mb-6">Settings</h1>
            <nav>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'lima-nav-item lima-w-full',
                    activeSection === section.id
                      ? 'lima-nav-item-active'
                      : 'lima-nav-item-inactive'
                  )}
                >
                  <section.icon className={cn(
                    'h-5 w-5',
                    activeSection === section.id ? 'lima-text-blue' : ''
                  )} />
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {activeSection === 'profile' && (
              <div className="max-w-2xl">
                <div className="lima-flex-between mb-6">
                  <h2 className="lima-text-2xl lima-text-primary">Profile Settings</h2>
                  <button 
                    onClick={() => handleSave('profile')}
                    className="lima-btn lima-btn-primary"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>

                <div className="lima-card">
                  <div className="lima-card-content space-y-6">
                    {/* Avatar */}
                    <div className="lima-flex items-center gap-6">
                      <div className="w-20 h-20 rounded-full bg-gray-200 lima-flex items-center justify-center">
                        <span className="lima-text-2xl font-bold text-gray-700">
                          {settings.profile.name[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <button className="lima-btn lima-btn-secondary">
                          <Upload className="h-4 w-4" />
                          Upload Photo
                        </button>
                        <p className="lima-text-sm lima-text-secondary mt-1">
                          JPG, PNG or GIF. Max 2MB
                        </p>
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="lima-grid lima-grid-2 gap-4">
                      <div>
                        <label className="lima-label">Full Name</label>
                        <input
                          type="text"
                          value={settings.profile.name}
                          onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                          className="lima-input"
                        />
                      </div>
                      <div>
                        <label className="lima-label">Email</label>
                        <input
                          type="email"
                          value={settings.profile.email}
                          onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                          className="lima-input"
                        />
                      </div>
                      <div>
                        <label className="lima-label">Company</label>
                        <input
                          type="text"
                          value={settings.profile.company}
                          onChange={(e) => updateSetting('profile', 'company', e.target.value)}
                          className="lima-input"
                        />
                      </div>
                      <div>
                        <label className="lima-label">Role</label>
                        <input
                          type="text"
                          value={settings.profile.role}
                          onChange={(e) => updateSetting('profile', 'role', e.target.value)}
                          className="lima-input"
                        />
                      </div>
                      <div>
                        <label className="lima-label">Timezone</label>
                        <select
                          value={settings.profile.timezone}
                          onChange={(e) => updateSetting('profile', 'timezone', e.target.value)}
                          className="lima-input"
                        >
                          <option value="America/New_York">Eastern Time (EST)</option>
                          <option value="America/Chicago">Central Time (CST)</option>
                          <option value="America/Denver">Mountain Time (MST)</option>
                          <option value="America/Los_Angeles">Pacific Time (PST)</option>
                          <option value="Europe/London">GMT</option>
                        </select>
                      </div>
                      <div>
                        <label className="lima-label">Language</label>
                        <select
                          value={settings.profile.language}
                          onChange={(e) => updateSetting('profile', 'language', e.target.value)}
                          className="lima-input"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="max-w-2xl">
                <div className="lima-flex-between mb-6">
                  <h2 className="lima-text-2xl lima-text-primary">Notification Preferences</h2>
                  <button 
                    onClick={() => handleSave('notifications')}
                    className="lima-btn lima-btn-primary"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="lima-card">
                    <div className="lima-card-header">
                      <h3 className="lima-text-lg lima-text-primary">Email Notifications</h3>
                    </div>
                    <div className="lima-card-content space-y-4">
                      <ToggleSetting
                        label="New leads and replies"
                        description="Get notified when new leads respond to your campaigns"
                        checked={settings.notifications.emailNewLeads}
                        onChange={(checked) => updateSetting('notifications', 'emailNewLeads', checked)}
                      />
                      <ToggleSetting
                        label="Campaign updates"
                        description="Receive updates on campaign performance and milestones"
                        checked={settings.notifications.emailCampaignUpdates}
                        onChange={(checked) => updateSetting('notifications', 'emailCampaignUpdates', checked)}
                      />
                      <ToggleSetting
                        label="Weekly reports"
                        description="Weekly summary of your outreach performance"
                        checked={settings.notifications.emailWeeklyReport}
                        onChange={(checked) => updateSetting('notifications', 'emailWeeklyReport', checked)}
                      />
                    </div>
                  </div>

                  <div className="lima-card">
                    <div className="lima-card-header">
                      <h3 className="lima-text-lg lima-text-primary">Push Notifications</h3>
                    </div>
                    <div className="lima-card-content space-y-4">
                      <ToggleSetting
                        label="New replies"
                        description="Instant notifications for new prospect replies"
                        checked={settings.notifications.pushReplies}
                        onChange={(checked) => updateSetting('notifications', 'pushReplies', checked)}
                      />
                      <ToggleSetting
                        label="Meeting bookings"
                        description="Get notified when prospects book meetings"
                        checked={settings.notifications.pushMeetings}
                        onChange={(checked) => updateSetting('notifications', 'pushMeetings', checked)}
                      />
                      <ToggleSetting
                        label="SMS for urgent items"
                        description="SMS notifications for high-priority items only"
                        checked={settings.notifications.smsUrgent}
                        onChange={(checked) => updateSetting('notifications', 'smsUrgent', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'ai' && (
              <div className="max-w-2xl">
                <div className="lima-flex-between mb-6">
                  <h2 className="lima-text-2xl lima-text-primary">AI Configuration</h2>
                  <button 
                    onClick={() => handleSave('ai')}
                    className="lima-btn lima-btn-primary"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="lima-card">
                    <div className="lima-card-header">
                      <h3 className="lima-text-lg lima-text-primary">Writing Style</h3>
                    </div>
                    <div className="lima-card-content space-y-4">
                      <div>
                        <label className="lima-label">Personality Tone</label>
                        <select
                          value={settings.ai.personalityTone}
                          onChange={(e) => updateSetting('ai', 'personalityTone', e.target.value)}
                          className="lima-input"
                        >
                          <option value="professional">Professional</option>
                          <option value="friendly">Friendly</option>
                          <option value="casual">Casual</option>
                          <option value="formal">Formal</option>
                        </select>
                      </div>

                      <div>
                        <label className="lima-label">Creativity Level</label>
                        <select
                          value={settings.ai.creativityLevel}
                          onChange={(e) => updateSetting('ai', 'creativityLevel', e.target.value)}
                          className="lima-input"
                        >
                          <option value="conservative">Conservative</option>
                          <option value="balanced">Balanced</option>
                          <option value="creative">Creative</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="lima-card">
                    <div className="lima-card-header">
                      <h3 className="lima-text-lg lima-text-primary">Automation</h3>
                    </div>
                    <div className="lima-card-content space-y-4">
                      <ToggleSetting
                        label="Auto-reply to simple questions"
                        description="Let AI handle basic inquiries automatically"
                        checked={settings.ai.autoReply}
                        onChange={(checked) => updateSetting('ai', 'autoReply', checked)}
                      />
                      <ToggleSetting
                        label="Auto follow-up sequences"
                        description="Automatically send follow-up emails to non-responders"
                        checked={settings.ai.autoFollowUp}
                        onChange={(checked) => updateSetting('ai', 'autoFollowUp', checked)}
                      />
                      <ToggleSetting
                        label="Include personalization"
                        description="Use company and prospect data for personalized messages"
                        checked={settings.ai.includePersonalization}
                        onChange={(checked) => updateSetting('ai', 'includePersonalization', checked)}
                      />
                      <ToggleSetting
                        label="Use recent company news"
                        description="Reference recent news and developments about prospect companies"
                        checked={settings.ai.useCompanyNews}
                        onChange={(checked) => updateSetting('ai', 'useCompanyNews', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'billing' && (
              <div className="max-w-2xl">
                <h2 className="lima-text-2xl lima-text-primary mb-6">Billing & Usage</h2>

                <div className="space-y-6">
                  <div className="lima-card">
                    <div className="lima-card-header">
                      <h3 className="lima-text-lg lima-text-primary">Current Plan</h3>
                    </div>
                    <div className="lima-card-content">
                      <div className="lima-flex-between mb-4">
                        <div>
                          <div className="lima-text-2xl font-bold lima-text-primary">Pro Plan</div>
                          <div className="lima-text-base lima-text-secondary">$99/month • 5 seats</div>
                        </div>
                        <button className="lima-btn lima-btn-secondary">
                          Upgrade Plan
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="lima-flex-between mb-2">
                            <span className="lima-text-sm lima-text-primary">Email Volume</span>
                            <span className="lima-text-sm lima-text-secondary">
                              {settings.billing.usage.emails} / {settings.billing.usage.limit}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(settings.billing.usage.emails / settings.billing.usage.limit) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lima-card">
                    <div className="lima-card-header">
                      <h3 className="lima-text-lg lima-text-primary">Payment Method</h3>
                    </div>
                    <div className="lima-card-content">
                      <div className="lima-flex-between">
                        <div className="lima-flex items-center gap-3">
                          <CreditCard className="h-8 w-8 lima-text-secondary" />
                          <div>
                            <div className="lima-text-sm font-medium">•••• •••• •••• 4242</div>
                            <div className="lima-text-xs lima-text-secondary">Expires 12/25</div>
                          </div>
                        </div>
                        <button className="lima-btn lima-btn-secondary">
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

interface ToggleSettingProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleSetting({ label, description, checked, onChange }: ToggleSettingProps) {
  return (
    <div className="lima-flex-between">
      <div className="flex-1">
        <div className="lima-text-sm font-medium lima-text-primary">{label}</div>
        <div className="lima-text-xs lima-text-secondary">{description}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
          checked ? 'bg-blue-500' : 'bg-gray-200'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
}