'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';
import ComposeEmailModal from './compose-email-modal';
import {
  Mail,
  Search,
  Filter,
  Plus,
  Archive,
  Trash2,
  Star,
  Reply,
  Forward,
  MoreHorizontal,
  Clock,
  User,
  Bot
} from 'lucide-react';
import { cn } from '@/utils';

interface Email {
  id: string;
  subject: string;
  from: string;
  to: string;
  body_preview: string;
  sent_at: string;
  is_read: boolean;
  is_starred: boolean;
  is_from_ai: boolean;
  thread_id: string;
  has_attachments: boolean;
  labels: string[];
}

interface EmailInboxProps {
  className?: string;
}

export default function EmailInbox({ className }: EmailInboxProps) {
  const { user } = useAuth();
  const { error } = useToast();
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [composeModalOpen, setComposeModalOpen] = useState(false);
  const [replyEmail, setReplyEmail] = useState<Email | null>(null);

  useEffect(() => {
    if (user) {
      loadEmails();
    }
  }, [user]);

  const handleCompose = () => {
    setComposeModalOpen(true);
  };

  const handleReply = (email: Email) => {
    setReplyEmail(email);
    setComposeModalOpen(true);
  };

  const loadEmails = async () => {
    try {
      setLoading(true);
      
      // Mock data for now - would fetch from API
      const mockEmails: Email[] = [
        {
          id: '1',
          subject: 'Partnership Opportunity - TechFlow Integration',
          from: 'sarah.chen@techflow.com',
          to: user?.email || '',
          body_preview: 'Hi there, I saw your recent product launch and I think there could be a great partnership opportunity...',
          sent_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          is_read: false,
          is_starred: false,
          is_from_ai: false,
          thread_id: 'thread-1',
          has_attachments: false,
          labels: ['inbox', 'important'],
        },
        {
          id: '2',
          subject: 'Re: Case study request',
          from: 'mike.johnson@datacorp.com',
          to: user?.email || '',
          body_preview: 'Thanks for the follow-up! I would definitely be interested in seeing the case study you mentioned...',
          sent_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          is_read: true,
          is_starred: true,
          is_from_ai: false,
          thread_id: 'thread-2',
          has_attachments: true,
          labels: ['inbox'],
        },
        {
          id: '3',
          subject: 'AI Follow-up: DataCorp Integration',
          from: 'lia@lima.ai',
          to: 'alex.rodriguez@datacorp.com',
          body_preview: 'Following up on our previous conversation about integration possibilities. I wanted to share some relevant case studies...',
          sent_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          is_read: true,
          is_starred: false,
          is_from_ai: true,
          thread_id: 'thread-3',
          has_attachments: false,
          labels: ['sent', 'ai-generated'],
        },
      ];

      setEmails(mockEmails);
      setSelectedEmail(mockEmails[0]);
    } catch (err) {
      error('Failed to load emails');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.from.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' ||
                         (selectedFilter === 'unread' && !email.is_read) ||
                         (selectedFilter === 'starred' && email.is_starred) ||
                         (selectedFilter === 'ai' && email.is_from_ai);
    
    return matchesSearch && matchesFilter;
  });

  const filters = [
    { id: 'all', label: 'All', count: emails.length },
    { id: 'unread', label: 'Unread', count: emails.filter(e => !e.is_read).length },
    { id: 'starred', label: 'Starred', count: emails.filter(e => e.is_starred).length },
    { id: 'ai', label: 'AI Sent', count: emails.filter(e => e.is_from_ai).length },
  ];

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center h-64', className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={cn('h-full flex bg-white', className)}>
      {/* Compose Modal */}
      <ComposeEmailModal
        isOpen={composeModalOpen}
        onClose={() => {
          setComposeModalOpen(false);
          setReplyEmail(null);
        }}
        replyTo={replyEmail ? {
          email: replyEmail.from,
          subject: replyEmail.subject,
          threadId: replyEmail.thread_id,
        } : undefined}
      />
      {/* Email List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Search and Filter */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 mr-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleCompose}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Compose</span>
            </button>
          </div>
          
          <div className="flex space-x-1">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={cn(
                  'px-3 py-1 text-sm rounded-md transition-colors',
                  selectedFilter === filter.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {filteredEmails.map((email) => (
            <EmailListItem
              key={email.id}
              email={email}
              isSelected={selectedEmail?.id === email.id}
              onClick={() => setSelectedEmail(email)}
            />
          ))}
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 flex flex-col">
        {selectedEmail ? (
          <EmailContent 
            email={selectedEmail} 
            onReply={() => handleReply(selectedEmail)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Select an email to view</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface EmailListItemProps {
  email: Email;
  isSelected: boolean;
  onClick: () => void;
}

function EmailListItem({ email, isSelected, onClick }: EmailListItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors',
        isSelected && 'bg-blue-50 border-blue-200',
        !email.is_read && 'bg-blue-25'
      )}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {email.is_from_ai ? (
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-purple-600" />
            </div>
          ) : (
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className={cn(
              'text-sm truncate',
              !email.is_read ? 'font-semibold text-gray-900' : 'text-gray-700'
            )}>
              {email.from}
            </p>
            <div className="flex items-center space-x-1">
              {email.is_starred && <Star className="h-3 w-3 text-yellow-400 fill-current" />}
              {email.has_attachments && <div className="w-2 h-2 bg-gray-400 rounded-full" />}
            </div>
          </div>
          
          <p className={cn(
            'text-sm mb-1 truncate',
            !email.is_read ? 'font-medium text-gray-900' : 'text-gray-700'
          )}>
            {email.subject}
          </p>
          
          <p className="text-xs text-gray-500 truncate mb-2">
            {email.body_preview}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {formatTime(email.sent_at)}
            </span>
            {email.is_from_ai && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                AI
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface EmailContentProps {
  email: Email;
  onReply: () => void;
}

function EmailContent({ email, onReply }: EmailContentProps) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Email Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">{email.subject}</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
              <Archive className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
              <Trash2 className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            {email.is_from_ai ? (
              <div className="h-6 w-6 bg-purple-100 rounded-full flex items-center justify-center">
                <Bot className="h-3 w-3 text-purple-600" />
              </div>
            ) : (
              <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-gray-600" />
              </div>
            )}
            <span>{email.from}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{formatDateTime(email.sent_at)}</span>
          </div>
        </div>
      </div>

      {/* Email Body */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="prose max-w-none">
          <p>{email.body_preview}</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-3">
          <button 
            onClick={onReply}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Reply className="h-4 w-4" />
            <span>Reply</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            <Forward className="h-4 w-4" />
            <span>Forward</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            <Bot className="h-4 w-4" />
            <span>AI Assist</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function formatTime(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return time.toLocaleDateString();
}

function formatDateTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString();
}