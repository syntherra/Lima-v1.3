'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';
import { 
  Play, 
  Pause, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  TrendingUp,
  Users,
  Mail,
  Target,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Button, 
  Input, 
  Badge, 
  Progress,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Avatar,
  AvatarFallback
} from '@/components/ui';
import { cn } from '@/utils';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  type: 'email' | 'linkedin' | 'multi-channel';
  targetAudience: string;
  totalContacts: number;
  contacted: number;
  replied: number;
  interested: number;
  openRate: number;
  replyRate: number;
  interestRate: number;
  createdAt: Date;
  lastActivity: Date;
  budget: number;
  spent: number;
}

interface CampaignMetrics {
  totalCampaigns: number;
  activeCampaigns: number;
  totalContacts: number;
  avgOpenRate: number;
  avgReplyRate: number;
  totalRevenue: number;
}

export default function CampaignsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Demo data
  const metrics: CampaignMetrics = {
    totalCampaigns: 12,
    activeCampaigns: 8,
    totalContacts: 2847,
    avgOpenRate: 68.5,
    avgReplyRate: 24.3,
    totalRevenue: 145600
  };

  const campaigns: Campaign[] = [
    {
      id: '1',
      name: 'SaaS Startup Outreach Q1',
      status: 'active',
      type: 'email',
      targetAudience: 'SaaS Founders & CTOs',
      totalContacts: 450,
      contacted: 387,
      replied: 94,
      interested: 23,
      openRate: 72.4,
      replyRate: 24.3,
      interestRate: 6.1,
      createdAt: new Date('2024-01-15'),
      lastActivity: new Date('2024-01-20'),
      budget: 15000,
      spent: 8750
    },
    {
      id: '2',
      name: 'Enterprise Sales Directors',
      status: 'active',
      type: 'multi-channel',
      targetAudience: 'Enterprise Sales Leaders',
      totalContacts: 280,
      contacted: 245,
      replied: 67,
      interested: 18,
      openRate: 69.8,
      replyRate: 27.3,
      interestRate: 7.3,
      createdAt: new Date('2024-01-10'),
      lastActivity: new Date('2024-01-19'),
      budget: 12000,
      spent: 7200
    },
    {
      id: '3',
      name: 'Marketing Automation Users',
      status: 'paused',
      type: 'email',
      targetAudience: 'Marketing Directors',
      totalContacts: 320,
      contacted: 298,
      replied: 71,
      interested: 15,
      openRate: 65.2,
      replyRate: 23.8,
      interestRate: 5.0,
      createdAt: new Date('2024-01-05'),
      lastActivity: new Date('2024-01-18'),
      budget: 10000,
      spent: 9300
    },
    {
      id: '4',
      name: 'E-commerce Platform Owners',
      status: 'completed',
      type: 'linkedin',
      targetAudience: 'E-commerce Entrepreneurs',
      totalContacts: 180,
      contacted: 180,
      replied: 42,
      interested: 12,
      openRate: 78.9,
      replyRate: 23.3,
      interestRate: 6.7,
      createdAt: new Date('2023-12-20'),
      lastActivity: new Date('2024-01-15'),
      budget: 8000,
      spent: 8000
    },
    {
      id: '5',
      name: 'FinTech Decision Makers',
      status: 'draft',
      type: 'multi-channel',
      targetAudience: 'FinTech Executives',
      totalContacts: 150,
      contacted: 0,
      replied: 0,
      interested: 0,
      openRate: 0,
      replyRate: 0,
      interestRate: 0,
      createdAt: new Date('2024-01-18'),
      lastActivity: new Date('2024-01-18'),
      budget: 20000,
      spent: 0
    }
  ];

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.targetAudience.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Campaign['type']) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'linkedin': return <Users className="h-4 w-4" />;
      case 'multi-channel': return <Target className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
            <p className="text-gray-600 mt-1">
              Manage your autonomous outreach campaigns and track performance
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">All Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                      <p className="text-3xl font-bold text-gray-900">{metrics.totalCampaigns}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-600 font-medium">{metrics.activeCampaigns} active</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                      <p className="text-3xl font-bold text-gray-900">{metrics.totalContacts.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600 font-medium">+12% this month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Open Rate</p>
                      <p className="text-3xl font-bold text-gray-900">{metrics.avgOpenRate}%</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Eye className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={metrics.avgOpenRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Reply Rate</p>
                      <p className="text-3xl font-bold text-gray-900">{metrics.avgReplyRate}%</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Mail className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={metrics.avgReplyRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Campaigns */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.slice(0, 3).map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getTypeIcon(campaign.type)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                          <p className="text-sm text-gray-600">{campaign.targetAudience}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {campaign.contacted}/{campaign.totalContacts} contacted
                          </p>
                          <p className="text-sm text-gray-600">{campaign.replyRate}% reply rate</p>
                        </div>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search campaigns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter: {statusFilter === 'all' ? 'All Status' : statusFilter}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Campaigns List */}
            <div className="space-y-4">
              {filteredCampaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 rounded-lg">
                          {getTypeIcon(campaign.type)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                          <p className="text-gray-600">{campaign.targetAudience}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                      <div>
                        <p className="text-sm text-gray-600">Contacts</p>
                        <p className="text-2xl font-bold text-gray-900">{campaign.totalContacts}</p>
                        <p className="text-sm text-gray-500">{campaign.contacted} contacted</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Open Rate</p>
                        <p className="text-2xl font-bold text-gray-900">{campaign.openRate}%</p>
                        <Progress value={campaign.openRate} className="h-2 mt-1" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Reply Rate</p>
                        <p className="text-2xl font-bold text-gray-900">{campaign.replyRate}%</p>
                        <Progress value={campaign.replyRate} className="h-2 mt-1" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Budget</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(campaign.budget)}</p>
                        <p className="text-sm text-gray-500">{formatCurrency(campaign.spent)} spent</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Created {formatDate(campaign.createdAt)}</span>
                        <span>•</span>
                        <span>Last activity {formatDate(campaign.lastActivity)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {campaign.status === 'active' ? (
                          <Button variant="outline" size="sm">
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </Button>
                        ) : campaign.status === 'paused' ? (
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                          </Button>
                        ) : null}
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Analytics Coming Soon</h3>
                  <p className="text-gray-600">
                    Detailed performance charts, A/B testing results, and ROI analysis will be available here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}