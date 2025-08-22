'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';
import {
  Target,
  Plus,
  Edit,
  Play,
  Pause,
  BarChart,
  Users,
  Mail,
  Bot,
  User,
  ArrowRight,
  Settings
} from 'lucide-react';
import { cn } from '@/utils';

interface Campaign {
  id: string;
  name: string;
  type: 'cold' | 'warm' | 'nurture';
  status: 'draft' | 'active' | 'paused' | 'completed';
  target_profile: {
    industry?: string;
    location?: string;
    company_size?: string;
    role?: string;
  };
  stats: {
    contacts_found: number;
    emails_sent: number;
    open_rate: number;
    reply_rate: number;
  };
  created_at: string;
}

interface CampaignBuilderProps {
  className?: string;
}

export default function CampaignBuilder({ className }: CampaignBuilderProps) {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      loadCampaigns();
    }
  }, [user]);

  const loadCampaigns = async () => {
    try {
      // Mock campaigns - would fetch from API
      const mockCampaigns: Campaign[] = [
        {
          id: '1',
          name: 'SaaS CTOs Outreach',
          type: 'cold',
          status: 'active',
          target_profile: {
            industry: 'SaaS',
            location: 'United States',
            company_size: '50-200',
            role: 'CTO',
          },
          stats: {
            contacts_found: 247,
            emails_sent: 156,
            open_rate: 34.2,
            reply_rate: 12.8,
          },
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        },
        {
          id: '2',
          name: 'Fintech Startup Founders',
          type: 'warm',
          status: 'paused',
          target_profile: {
            industry: 'Fintech',
            location: 'New York',
            company_size: '10-50',
            role: 'Founder',
          },
          stats: {
            contacts_found: 89,
            emails_sent: 45,
            open_rate: 42.1,
            reply_rate: 18.2,
          },
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
        },
      ];

      setCampaigns(mockCampaigns);
    } catch (err) {
      error('Failed to load campaigns');
    }
  };

  const handleStatusChange = async (campaignId: string, newStatus: 'active' | 'paused') => {
    try {
      // Mock API call
      setCampaigns(campaigns.map(c => 
        c.id === campaignId ? { ...c, status: newStatus } : c
      ));
      success(`Campaign ${newStatus === 'active' ? 'started' : 'paused'}`);
    } catch (err) {
      error('Failed to update campaign status');
    }
  };

  if (showBuilder) {
    return (
      <CampaignBuilderWizard 
        onClose={() => setShowBuilder(false)}
        onSave={(campaign) => {
          setCampaigns([...campaigns, campaign]);
          setShowBuilder(false);
          success('Campaign created successfully');
        }}
      />
    );
  }

  return (
    <div className={cn('h-full flex flex-col', className)}>
      {/* Header */}
      <div className="lima-header">
        <div className="lima-container">
          <div className="lima-flex-between">
            <div>
              <h1 className="lima-text-3xl lima-text-primary">Campaigns</h1>
              <p className="lima-text-base lima-text-secondary" style={{marginTop: 'var(--lima-space-2)'}}>
                Create autonomous outreach campaigns powered by AI
              </p>
            </div>
            <button
              onClick={() => setShowBuilder(true)}
              className="lima-btn lima-btn-primary"
            >
              <Plus className="h-5 w-5" />
              <span>New Campaign</span>
            </button>
          </div>
        </div>
      </div>

      {/* Campaigns Display */}
      <div className="flex-1 overflow-auto" style={{padding: 'var(--lima-space-8) var(--lima-space-6)'}}>
        {campaigns.length === 0 ? (
          <div className="lima-empty-state">
            <div className="w-16 h-16 rounded-xl lima-flex" style={{background: 'var(--lima-primary)', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--lima-space-6)'}}>
              <Target className="h-8 w-8 lima-text-white" />
            </div>
            <h3 className="lima-text-2xl lima-text-primary" style={{marginBottom: 'var(--lima-space-3)', textAlign: 'center'}}>No campaigns yet</h3>
            <p className="lima-text-base lima-text-secondary" style={{marginBottom: 'var(--lima-space-8)', textAlign: 'center', maxWidth: '32rem', margin: '0 auto'}}>
              Create your first autonomous outreach campaign to start finding and engaging prospects with AI-powered personalization.
            </p>
            <div style={{textAlign: 'center'}}>
              <button
                onClick={() => setShowBuilder(true)}
                className="lima-btn lima-btn-primary"
              >
                <Plus className="h-5 w-5" />
                <span>Create Campaign</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="lima-grid lima-grid-3">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onStatusChange={(newStatus) => handleStatusChange(campaign.id, newStatus)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface CampaignCardProps {
  campaign: Campaign;
  onStatusChange: (status: 'active' | 'paused') => void;
}

function CampaignCard({ campaign, onStatusChange }: CampaignCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'lima-tag lima-tag-success';
      case 'paused': return 'lima-tag lima-tag-warning';
      case 'draft': return 'lima-tag lima-tag-neutral';
      case 'completed': return 'lima-tag lima-tag-accent';
      default: return 'lima-tag lima-tag-neutral';
    }
  };

  const getTypeGradient = (type: string) => {
    switch (type) {
      case 'cold': return 'var(--lima-primary)';
      case 'warm': return 'var(--lima-success)';
      case 'nurture': return 'var(--lima-warning)';
      default: return 'var(--lima-primary)';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cold': return <Mail className="h-4 w-4" />;
      case 'warm': return <User className="h-4 w-4" />;
      case 'nurture': return <Bot className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="lima-card">
      <div className="lima-card-content">
        {/* Header */}
        <div className="lima-flex-between" style={{marginBottom: 'var(--lima-space-6)'}}>
          <div className="lima-flex" style={{alignItems: 'center'}}>
            <div className="p-3 rounded-xl" style={{background: getTypeGradient(campaign.type), marginRight: 'var(--lima-space-4)'}}>
              {getTypeIcon(campaign.type)}
            </div>
            <div>
              <h3 className="lima-text-lg lima-text-primary">{campaign.name}</h3>
              <span className={getStatusColor(campaign.status)}>
                {campaign.status}
              </span>
            </div>
          </div>
          <div className="lima-flex">
            {campaign.status === 'active' ? (
              <button
                onClick={() => onStatusChange('paused')}
                className="lima-btn lima-btn-ghost"
              >
                <Pause className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => onStatusChange('active')}
                className="lima-btn lima-btn-ghost"
              >
                <Play className="h-4 w-4" />
              </button>
            )}
            <button className="lima-btn lima-btn-ghost">
              <Edit className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Target Profile */}
        <div style={{marginBottom: 'var(--lima-space-6)'}}>
          <div className="lima-text-sm lima-text-primary" style={{marginBottom: 'var(--lima-space-2)'}}>
            <strong>Target:</strong> {campaign.target_profile.role} at {campaign.target_profile.industry} companies
          </div>
          <div className="lima-text-xs lima-text-secondary">
            <strong>Location:</strong> {campaign.target_profile.location} • <strong>Size:</strong> {campaign.target_profile.company_size} employees
          </div>
        </div>

        {/* Metrics */}
        <div className="lima-grid lima-grid-2" style={{marginBottom: 'var(--lima-space-6)'}}>
          <div className="text-center">
            <div className="lima-text-metric lima-text-blue">{campaign.stats.contacts_found}</div>
            <div className="lima-text-xs lima-text-secondary">Contacts Found</div>
          </div>
          <div className="text-center">
            <div className="lima-text-metric" style={{color: 'var(--lima-success)'}}>{campaign.stats.emails_sent}</div>
            <div className="lima-text-xs lima-text-secondary">Emails Sent</div>
          </div>
        </div>

        <div className="lima-grid lima-grid-2" style={{marginBottom: 'var(--lima-space-6)'}}>
          <div className="text-center">
            <div className="lima-text-base lima-text-primary" style={{fontWeight: 'var(--lima-weight-semibold)'}}>{campaign.stats.open_rate}%</div>
            <div className="lima-text-xs lima-text-secondary">Open Rate</div>
          </div>
          <div className="text-center">
            <div className="lima-text-base lima-text-primary" style={{fontWeight: 'var(--lima-weight-semibold)'}}>{campaign.stats.reply_rate}%</div>
            <div className="lima-text-xs lima-text-secondary">Reply Rate</div>
          </div>
        </div>

        <button className="lima-btn lima-btn-secondary lima-w-full">
          <BarChart className="h-4 w-4" />
          <span>View Analytics</span>
        </button>
      </div>
    </div>
  );
}

interface CampaignBuilderWizardProps {
  onClose: () => void;
  onSave: (campaign: Campaign) => void;
}

function CampaignBuilderWizard({ onClose, onSave }: CampaignBuilderWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: 'cold' as 'cold' | 'warm' | 'nurture',
    target_profile: {
      industry: '',
      location: '',
      company_size: '',
      role: '',
    },
  });

  const handleSave = () => {
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      status: 'draft',
      target_profile: formData.target_profile,
      stats: {
        contacts_found: 0,
        emails_sent: 0,
        open_rate: 0,
        reply_rate: 0,
      },
      created_at: new Date().toISOString(),
    };

    onSave(newCampaign);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Create Campaign</h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., SaaS CTOs Outreach"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Type
              </label>
              <div className="grid grid-cols-3 gap-4">
                {(['cold', 'warm', 'nurture'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormData({ ...formData, type })}
                    className={cn(
                      'p-4 border rounded-lg text-center transition-colors',
                      formData.type === type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    )}
                  >
                    <div className="font-medium capitalize">{type}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {type === 'cold' && 'New prospects'}
                      {type === 'warm' && 'Existing connections'}
                      {type === 'nurture' && 'Follow-up sequences'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Target Profile</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={formData.target_profile.industry}
                    onChange={(e) => setFormData({
                      ...formData,
                      target_profile: { ...formData.target_profile, industry: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., SaaS, Fintech"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={formData.target_profile.role}
                    onChange={(e) => setFormData({
                      ...formData,
                      target_profile: { ...formData.target_profile, role: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., CTO, VP Engineering"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.target_profile.location}
                    onChange={(e) => setFormData({
                      ...formData,
                      target_profile: { ...formData.target_profile, location: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., United States, California"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size
                  </label>
                  <select
                    value={formData.target_profile.company_size}
                    onChange={(e) => setFormData({
                      ...formData,
                      target_profile: { ...formData.target_profile, company_size: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name || !formData.target_profile.industry}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}