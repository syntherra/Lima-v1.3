'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';
import { cn } from '@/utils';
import { 
  Mail, 
  Search, 
  Filter, 
  Star, 
  Archive, 
  MoreHorizontal, 
  Reply, 
  Forward, 
  User, 
  Building2, 
  Tag, 
  Clock,
  Send,
  Paperclip,
  Smile
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Avatar, AvatarFallback, Tabs, TabsList, TabsTrigger, TabsContent, Textarea } from '@/components/ui'

interface EmailThread {
  id: string;
  sender: {
    name: string;
    email: string;
    company: string;
  };
  subject: string;
  preview: string;
  timestamp: string;
  status: 'unread' | 'read' | 'replied' | 'starred';
  priority: 'high' | 'medium' | 'low';
  tags: string[];
  messages: Array<{
    id: string;
    from: string;
    to: string;
    content: string;
    timestamp: string;
    isAI: boolean;
  }>;
}

export default function InboxPage() {
  const { user } = useAuth();
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'replied' | 'starred'>('all');

  // Demo email threads
  const emailThreads: EmailThread[] = [
    {
      id: '1',
      sender: {
        name: 'Sarah Johnson',
        email: 'sarah@techcorp.com',
        company: 'TechCorp Solutions'
      },
      subject: 'Q4 Partnership Proposal',
      preview: 'Hi there! I wanted to reach out regarding a potential partnership opportunity for Q4. Our team has been following your work and we believe there could be great synergy...',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'unread',
      priority: 'high',
      tags: ['partnership', 'q4', 'proposal'],
      messages: [
        {
          id: 'm1',
          from: 'Sarah Johnson',
          to: 'team@lima.ai',
          content: 'Hi there!\n\nI wanted to reach out regarding a potential partnership opportunity for Q4. Our team has been following your work and we believe there could be great synergy between our companies.\n\nWould you be available for a call this week to discuss further?\n\nBest regards,\nSarah',
          timestamp: '2024-01-15T10:30:00Z',
          isAI: false
        },
        {
          id: 'm2',
          from: 'Lima AI',
          to: 'sarah@techcorp.com',
          content: 'Hi Sarah,\n\nThank you for reaching out! We\'re always interested in exploring strategic partnerships that can create mutual value.\n\nI\'ve reviewed TechCorp\'s recent initiatives and I believe there are indeed several areas where we could collaborate effectively, particularly in the AI-driven growth optimization space.\n\nI\'ve scheduled a preliminary call for Thursday at 2 PM EST. Please let me know if this works for your schedule.\n\nLooking forward to our conversation!\n\nBest,\nLima AI Assistant',
          timestamp: '2024-01-15T14:45:00Z',
          isAI: true
        }
      ]
    },
    {
      id: '2',
      sender: {
        name: 'Michael Rodriguez',
        email: 'michael@growthlab.co',
        company: 'GrowthLab'
      },
      subject: 'Follow-up: Demo Request',
      preview: 'Hi! Following up on our conversation last week about scheduling a demo of Lima\'s platform...',
      timestamp: '2024-01-14T16:45:00Z',
      status: 'replied',
      priority: 'medium',
      tags: ['demo', 'follow-up'],
      messages: [
        {
          id: 'm3',
          from: 'Michael Rodriguez',
          to: 'team@lima.ai',
          content: 'Hi!\n\nFollowing up on our conversation last week about scheduling a demo of Lima\'s platform. Our team is very interested in seeing how it could help us automate our outreach process.\n\nWould next Tuesday work for a 30-minute demo?\n\nThanks,\nMichael',
          timestamp: '2024-01-14T16:45:00Z',
          isAI: false
        },
        {
          id: 'm4',
          from: 'Lima AI',
          to: 'michael@growthlab.co',
          content: 'Hi Michael,\n\nAbsolutely! Tuesday works perfectly for our demo session.\n\nI\'ve prepared a customized demonstration focusing on automated outreach workflows that would be particularly relevant for GrowthLab\'s use case. The demo will cover:\n\n• AI-powered lead qualification\n• Personalized email sequences\n• Performance analytics and optimization\n\nI\'ll send you a calendar invite shortly. Looking forward to showing you how Lima can accelerate your growth!\n\nBest regards,\nLima AI',
          timestamp: '2024-01-14T18:20:00Z',
          isAI: true
        }
      ]
    },
    {
      id: '3',
      sender: {
        name: 'Emily Chen',
        email: 'emily.chen@innovatetech.com',
        company: 'InnovateTech'
      },
      subject: 'Integration Questions - API Documentation',
      preview: 'Hello! I\'m the lead developer at InnovateTech and I have some questions about integrating Lima\'s API with our existing CRM system...',
      timestamp: '2024-01-13T09:15:00Z',
      status: 'starred',
      priority: 'high',
      tags: ['technical', 'api', 'integration'],
      messages: [
        {
          id: 'm5',
          from: 'Emily Chen',
          to: 'support@lima.ai',
          content: 'Hello!\n\nI\'m the lead developer at InnovateTech and I have some questions about integrating Lima\'s API with our existing CRM system.\n\nSpecifically, I need to understand:\n1. Rate limits for API calls\n2. Webhook configuration for real-time updates\n3. Data synchronization best practices\n\nCould someone from your technical team provide guidance?\n\nThanks,\nEmily Chen\nLead Developer, InnovateTech',
          timestamp: '2024-01-13T09:15:00Z',
          isAI: false
        }
      ]
    },
    {
      id: '4',
      sender: {
        name: 'David Park',
        email: 'david@scalestartup.io',
        company: 'ScaleStartup'
      },
      subject: 'Pricing Discussion - Enterprise Plan',
      preview: 'Hi Lima team! We\'re a fast-growing startup and we\'re interested in your enterprise plan. Could we discuss custom pricing options...',
      timestamp: '2024-01-12T14:30:00Z',
      status: 'replied',
      priority: 'high',
      tags: ['pricing', 'enterprise', 'startup'],
      messages: [
        {
          id: 'm6',
          from: 'David Park',
          to: 'sales@lima.ai',
          content: 'Hi Lima team!\n\nWe\'re a fast-growing startup (50+ employees) and we\'re interested in your enterprise plan. Could we discuss custom pricing options for our use case?\n\nWe\'re looking to onboard our entire sales team (~15 people) and would need advanced analytics and custom integrations.\n\nWhen would be a good time for a pricing discussion?\n\nBest,\nDavid Park\nCOO, ScaleStartup',
          timestamp: '2024-01-12T14:30:00Z',
          isAI: false
        },
        {
          id: 'm7',
          from: 'Lima AI',
          to: 'david@scalestartup.io',
          content: 'Hi David,\n\nThank you for your interest in Lima\'s enterprise solution!\n\nFor a team of your size with advanced requirements, we can definitely create a custom package that fits your needs and budget. Our enterprise plan includes:\n\n• Unlimited AI-powered outreach\n• Advanced analytics dashboard\n• Custom CRM integrations\n• Dedicated customer success manager\n• Priority support\n\nI\'d love to schedule a call to understand your specific requirements and provide a tailored proposal. Are you available for a 30-minute call this Friday?\n\nBest regards,\nLima AI Sales Team',
          timestamp: '2024-01-12T16:45:00Z',
          isAI: true
        }
      ]
    },
    {
      id: '5',
      sender: {
        name: 'Lisa Thompson',
        email: 'lisa@marketingpro.com',
        company: 'MarketingPro Agency'
      },
      subject: 'Campaign Performance Review',
      preview: 'Hi! I wanted to share the results from our first month using Lima. The results have been incredible - 340% increase in qualified leads...',
      timestamp: '2024-01-11T11:20:00Z',
      status: 'read',
      priority: 'medium',
      tags: ['success-story', 'results', 'testimonial'],
      messages: [
        {
          id: 'm8',
          from: 'Lisa Thompson',
          to: 'team@lima.ai',
          content: 'Hi Lima team!\n\nI wanted to share the results from our first month using Lima. The results have been incredible:\n\n• 340% increase in qualified leads\n• 85% reduction in manual outreach time\n• 23% improvement in response rates\n\nOur clients are thrilled with the personalized approach Lima enables. We\'d love to discuss expanding our usage and potentially becoming a case study.\n\nThanks for building such an amazing platform!\n\nBest,\nLisa Thompson\nFounder, MarketingPro Agency',
          timestamp: '2024-01-11T11:20:00Z',
          isAI: false
        }
      ]
    }
  ];

  const filteredThreads = emailThreads.filter(thread => {
    if (filter === 'all') return true;
    return thread.status === filter;
  });

  const selectedThreadData = emailThreads.find(t => t.id === selectedThread);

  return (
    <DashboardLayout>
      <div className="h-full flex">
        {/* Email List Sidebar */}
        <div className="w-96 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Inbox</h1>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search conversations..."
                className="pl-10"
              />
            </div>

            {/* Filter Tabs */}
            <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="replied">Replied</TabsTrigger>
                <TabsTrigger value="starred">Starred</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Email Threads */}
          <div className="flex-1 overflow-y-auto">
            {filteredThreads.map((thread) => (
              <Card
                key={thread.id}
                className={cn(
                  'rounded-none border-x-0 border-t-0 cursor-pointer transition-colors hover:bg-gray-50',
                  selectedThread === thread.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : '',
                  thread.status === 'unread' ? 'bg-gray-25' : ''
                )}
                onClick={() => setSelectedThread(thread.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gray-200 text-gray-700">
                          {thread.sender.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className={cn(
                          'text-sm',
                          thread.status === 'unread' ? 'font-semibold text-gray-900' : 'text-gray-900'
                        )}>
                          {thread.sender.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {thread.sender.company}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {thread.status === 'starred' && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      <PriorityIndicator priority={thread.priority} />
                    </div>
                  </div>
                  
                  <div className={cn(
                    'text-sm mb-2',
                    thread.status === 'unread' ? 'font-medium text-gray-900' : 'text-gray-900'
                  )}>
                    {thread.subject}
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {thread.preview}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {thread.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(thread.timestamp)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Email Content */}
        <div className="flex-1 flex flex-col">
          {selectedThreadData ? (
            <>
              {/* Thread Header */}
              <Card className="rounded-none border-x-0 border-t-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <CardTitle className="text-xl text-gray-900 mb-1">
                        {selectedThreadData.subject}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{selectedThreadData.sender.name}</span>
                        <span>•</span>
                        <Building2 className="h-4 w-4" />
                        <span>{selectedThreadData.sender.company}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {selectedThreadData.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
              </Card>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {selectedThreadData.messages.map((message) => (
                    <Card key={message.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className={cn(
                                message.isAI ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
                              )}>
                                {message.isAI ? 'AI' : message.from[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {message.isAI ? 'Lima AI' : message.from}
                              </div>
                              <div className="text-xs text-gray-500">
                                to {message.to}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(message.timestamp)}
                          </div>
                        </div>
                        <div className="text-sm text-gray-900 whitespace-pre-line">
                          {message.content}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Reply Box */}
              <Card className="rounded-none border-x-0 border-b-0">
                <CardContent className="p-6">
                  <div className="flex gap-3 mb-4">
                    <Button>
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                    <Button variant="outline">
                      <Forward className="h-4 w-4 mr-2" />
                      Forward
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <Textarea 
                      placeholder="Type your reply..."
                      className="min-h-[100px] resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Smile className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button>
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="lima-empty-state">
              <Mail className="h-16 w-16 lima-text-muted mb-4 mx-auto" />
              <h3 className="lima-text-xl lima-text-primary mb-2">Select a conversation</h3>
              <p className="lima-text-base lima-text-secondary">
                Choose a conversation from the sidebar to view messages and reply.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function PriorityIndicator({ priority }: { priority: 'high' | 'medium' | 'low' }) {
  const colors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  };

  return (
    <div className={`w-2 h-2 rounded-full ${colors[priority]}`} />
  );
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
  
  // Handle future dates
  if (diffInSeconds < 0) {
    const absDiff = Math.abs(diffInSeconds);
    if (absDiff < 60) return 'In a moment';
    if (absDiff < 3600) return `In ${Math.floor(absDiff / 60)}m`;
    if (absDiff < 86400) return `In ${Math.floor(absDiff / 3600)}h`;
    return `In ${Math.floor(absDiff / 86400)}d`;
  }
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}