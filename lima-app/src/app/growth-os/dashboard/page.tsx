'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  TrendingUp, 
  Mail, 
  Users, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Zap,
  DollarSign,
  Eye,
  MousePointer,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';

interface DashboardMetrics {
  growth_pulse: {
    emails_sent: number;
    replies_received: number;
    meetings_booked: number;
    escalations: number;
    revenue: number;
    trend_percentage: number;
  };
  campaign_performance: {
    open_rate: number;
    reply_rate: number;
    conversion_rate: number;
    click_rate: number;
  };
  ai_activity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
    status: 'success' | 'pending' | 'error';
  }>;
  insights: Array<{
    id: string;
    message: string;
    type: string;
    confidence: number;
    priority: 'high' | 'medium' | 'low';
  }>;
  recent_contacts: Array<{
    id: string;
    name: string;
    company: string;
    email: string;
    status: 'hot' | 'warm' | 'cold';
    last_contact: string;
    avatar?: string;
  }>;
  upcoming_tasks: Array<{
    id: string;
    title: string;
    due_date: string;
    priority: 'high' | 'medium' | 'low';
    type: 'email' | 'call' | 'meeting' | 'follow-up';
  }>;
}

// Helper function to format time ago
function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}

export default function GrowthOSDashboardPage() {
  const { user } = useAuth();
  const { error } = useToast();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, this would fetch from API
      // For now, we'll use mock data
      const mockMetrics: DashboardMetrics = {
        growth_pulse: {
          emails_sent: 1247,
          replies_received: 189,
          meetings_booked: 23,
          escalations: 12,
          revenue: 45600,
          trend_percentage: 18.5,
        },
        campaign_performance: {
          open_rate: 42.8,
          reply_rate: 15.2,
          conversion_rate: 4.7,
          click_rate: 8.9,
        },
        ai_activity: [
          {
            id: '1',
            type: 'email_sent',
            message: 'Lima sent personalized email to Sarah Chen at TechFlow',
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            status: 'success',
          },
          {
            id: '2',
            type: 'meeting_scheduled',
            message: 'Scheduled demo call with Mike Johnson from DataCorp',
            timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
            status: 'success',
          },
          {
            id: '3',
            type: 'lead_qualified',
            message: 'Qualified lead: Alex Rodriguez - Enterprise prospect',
            timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            status: 'success',
          },
          {
            id: '4',
            type: 'follow_up',
            message: 'AI suggested follow-up for Jennifer Kim at StartupXYZ',
            timestamp: new Date(Date.now() - 1000 * 60 * 67).toISOString(),
            status: 'pending',
          },
        ],
        insights: [
          {
            id: '1',
            message: 'Your reply rate increased 23% this week. Your personalized subject lines are performing exceptionally well.',
            type: 'optimization',
            confidence: 0.94,
            priority: 'high',
          },
          {
            id: '2',
            message: 'Sarah at TechFlow opened your email 6 times. High engagement - perfect time for a follow-up call.',
            type: 'engagement',
            confidence: 0.89,
            priority: 'high',
          },
          {
            id: '3',
            message: 'Tuesday 2-4 PM shows highest email open rates for your audience. Consider scheduling sends accordingly.',
            type: 'timing',
            confidence: 0.76,
            priority: 'medium',
          },
        ],
        recent_contacts: [
          {
            id: '1',
            name: 'Sarah Chen',
            company: 'TechFlow Solutions',
            email: 'sarah@techflow.com',
            status: 'hot',
            last_contact: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          },
          {
            id: '2',
            name: 'Mike Johnson',
            company: 'DataCorp Inc',
            email: 'mike@datacorp.com',
            status: 'warm',
            last_contact: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
          },
          {
            id: '3',
            name: 'Jennifer Kim',
            company: 'StartupXYZ',
            email: 'jen@startupxyz.com',
            status: 'warm',
            last_contact: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          },
          {
            id: '4',
            name: 'Alex Rodriguez',
            company: 'Enterprise Solutions',
            email: 'alex@enterprise.com',
            status: 'cold',
            last_contact: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
          },
        ],
        upcoming_tasks: [
          {
            id: '1',
            title: 'Follow up with Sarah Chen - Demo feedback',
            due_date: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
            priority: 'high',
            type: 'call',
          },
          {
            id: '2',
            title: 'Send case study to Mike Johnson',
            due_date: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
            priority: 'high',
            type: 'email',
          },
          {
            id: '3',
            title: 'Quarterly business review with TechFlow',
            due_date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
            priority: 'medium',
            type: 'meeting',
          },
          {
            id: '4',
            title: 'Research Enterprise Solutions company',
            due_date: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
            priority: 'low',
            type: 'follow-up',
          },
        ],
      };

      setMetrics(mockMetrics);
    } catch (err) {
      error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!metrics) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your growth operations today.
          </p>
        </div>

        {/* Growth Pulse Metrics */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Growth Pulse Metrics</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${metrics.growth_pulse.revenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +{metrics.growth_pulse.trend_percentage}%
                  </span>
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.growth_pulse.emails_sent.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +{metrics.growth_pulse.trend_percentage}%
                  </span>
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Replies Received</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.growth_pulse.replies_received}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +{metrics.growth_pulse.trend_percentage}%
                  </span>
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Meetings Booked</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.growth_pulse.meetings_booked}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +{metrics.growth_pulse.trend_percentage}%
                  </span>
                  from last month
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Campaign Performance */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>
                Your email campaign metrics for this month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center">
                      <Eye className="h-4 w-4 mr-2 text-blue-500" />
                      Open Rate
                    </span>
                    <span className="text-sm font-bold">{metrics.campaign_performance.open_rate}%</span>
                  </div>
                  <Progress value={metrics.campaign_performance.open_rate} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center">
                      <MousePointer className="h-4 w-4 mr-2 text-green-500" />
                      Click Rate
                    </span>
                    <span className="text-sm font-bold">{metrics.campaign_performance.click_rate}%</span>
                  </div>
                  <Progress value={metrics.campaign_performance.click_rate} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-purple-500" />
                      Reply Rate
                    </span>
                    <span className="text-sm font-bold">{metrics.campaign_performance.reply_rate}%</span>
                  </div>
                  <Progress value={metrics.campaign_performance.reply_rate} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center">
                      <Target className="h-4 w-4 mr-2 text-orange-500" />
                      Conversion Rate
                    </span>
                    <span className="text-sm font-bold">{metrics.campaign_performance.conversion_rate}%</span>
                  </div>
                  <Progress value={metrics.campaign_performance.conversion_rate} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Contacts */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Contacts</CardTitle>
              <CardDescription>
                Latest prospects and their engagement status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.recent_contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center space-x-4">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.company}</p>
                    </div>
                    <Badge 
                      variant={contact.status === 'hot' ? 'destructive' : contact.status === 'warm' ? 'default' : 'secondary'}
                      size="sm"
                    >
                      {contact.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* AI Activity and Upcoming Tasks */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* AI Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-purple-500" />
                Recent AI Activity
              </CardTitle>
              <CardDescription>
                Latest automated actions and AI-driven insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.ai_activity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`mt-1 h-2 w-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' : 
                      activity.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.message}
                      </p>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs text-muted-foreground">
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                        <Badge 
                          variant={activity.status === 'success' ? 'success' : activity.status === 'pending' ? 'warning' : 'destructive'}
                          size="sm"
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                Upcoming Tasks
              </CardTitle>
              <CardDescription>
                Your scheduled follow-ups and action items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.upcoming_tasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {task.type === 'email' && <Mail className="h-4 w-4 text-blue-500" />}
                      {task.type === 'call' && <Phone className="h-4 w-4 text-green-500" />}
                      {task.type === 'meeting' && <Calendar className="h-4 w-4 text-purple-500" />}
                      {task.type === 'follow-up' && <CheckCircle className="h-4 w-4 text-orange-500" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Due {formatTimeAgo(task.due_date)}
                      </p>
                    </div>
                    <Badge 
                      variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                      size="sm"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              AI Insights
            </CardTitle>
            <CardDescription>
              AI-powered recommendations to optimize your growth operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.insights.map((insight) => (
                <div key={insight.id} className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    {insight.priority === 'high' && <AlertCircle className="h-4 w-4 text-red-500" />}
                    {insight.priority === 'medium' && <Zap className="h-4 w-4 text-yellow-500" />}
                    {insight.priority === 'low' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium leading-relaxed">
                      {insight.message}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={insight.priority === 'high' ? 'destructive' : insight.priority === 'medium' ? 'default' : 'secondary'}
                        size="sm"
                      >
                        {insight.priority} priority
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(insight.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}