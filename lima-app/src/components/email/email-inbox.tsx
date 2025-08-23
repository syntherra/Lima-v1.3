'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Archive, Trash2, Star, Reply, Forward, MoreHorizontal, Paperclip, Calendar, User, Mail, Send, X, Plus, ChevronDown, ChevronRight, Inbox, Clock, Tag, AlertCircle, CheckCircle2, Circle, RefreshCw, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Email, EmailCategory, EmailListState, EmailThread } from '@/types/email';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';
import ComposeEmailModal from './compose-email-modal';

// Using Email interface from types/email.ts

interface EmailInboxProps {
  className?: string;
}

export default function EmailInbox({ className }: EmailInboxProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [emailState, setEmailState] = useState<EmailListState>({
    emails: [],
    threads: [],
    selectedEmailId: undefined,
    selectedThreadId: undefined,
    isLoading: true,
    hasMore: true,
    currentPage: 1,
    totalCount: 0,
    viewMode: 'list',
    sortBy: 'date',
    sortOrder: 'desc',
    filters: {},
    searchQuery: undefined
  });
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EmailCategory | 'all'>('all');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [replyEmail, setReplyEmail] = useState<Email | null>(null);

  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadEmails();
    }
  }, [user]);

  const handleCompose = () => {
    setIsComposeOpen(true);
  };

  const handleReply = (email: Email) => {
    setReplyEmail(email);
    setIsComposeOpen(true);
  };

  const handleEmailAction = (action: string, emailId: string) => {
    setEmailState(prevState => ({
      ...prevState,
      emails: prevState.emails.map(email => {
        if (email.id === emailId) {
          switch (action) {
            case 'star':
              return { ...email, isStarred: !email.isStarred };
            case 'read':
              return { ...email, isRead: true };
            case 'unread':
              return { ...email, isRead: false };
            case 'important':
              return { ...email, isImportant: !email.isImportant };
            case 'archive':
              return { ...email, folder: 'archive' };
            case 'delete':
              return { ...email, isDeleted: true, folder: 'trash' };
            default:
              return email;
          }
        }
        return email;
      })
    }));
    
    // Update selected email if it was modified
    if (selectedEmail?.id === emailId) {
      setSelectedEmail(prevSelected => {
        if (!prevSelected) return null;
        switch (action) {
          case 'star':
            return { ...prevSelected, isStarred: !prevSelected.isStarred };
          case 'read':
            return { ...prevSelected, isRead: true };
          case 'unread':
            return { ...prevSelected, isRead: false };
          case 'important':
            return { ...prevSelected, isImportant: !prevSelected.isImportant };
          case 'archive':
            return { ...prevSelected, folder: 'archive' };
          case 'delete':
            return { ...prevSelected, isDeleted: true, folder: 'trash' };
          default:
            return prevSelected;
        }
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      toast({ title: 'Emails refreshed', description: 'Your inbox has been updated.' });
    }, 1000);
  };

  const getCategoryCount = (category: EmailCategory | 'all') => {
    if (category === 'all') return emailState.emails.length;
    return emailState.emails.filter(email => email.category === category).length;
  };

  const getUnreadCount = (category: EmailCategory | 'all') => {
    const categoryEmails = category === 'all' 
      ? emailState.emails 
      : emailState.emails.filter(email => email.category === category);
    return categoryEmails.filter(email => !email.isRead).length;
  };

  const loadEmails = async () => {
    try {
      setEmailState(prev => ({ ...prev, isLoading: true }));
      
      // Mock email data with enhanced structure
      const mockEmails: Email[] = [
        {
          id: '1',
          threadId: 'thread-1',
          from: { name: 'Sarah Johnson', email: 'sarah@company.com' },
          to: [{ name: 'You', email: user?.email || 'you@lima.com' }],
          cc: [],
          bcc: [],
          subject: 'Q4 Marketing Strategy Review',
          body: 'Hi there! I wanted to share the latest updates on our Q4 marketing strategy. We\'ve made significant progress on the campaign objectives and I\'d love to get your feedback on the proposed timeline. The team has been working hard to ensure we meet all our targets for the quarter. Please let me know your thoughts when you have a chance to review.',
          htmlBody: '<p>Hi there!</p><p>I wanted to share the latest updates on our Q4 marketing strategy...</p>',
          attachments: [{
            id: 'att-1',
            name: 'Q4-Strategy.pdf',
            size: 2048000,
            type: 'application/pdf'
          }],
          isRead: false,
          isStarred: true,
          isImportant: true,
          isDraft: false,
          isSpam: false,
          isDeleted: false,
          labels: ['work', 'important'],
          folder: 'inbox',
          category: 'primary',
          receivedAt: new Date('2024-01-15T10:30:00Z'),
          messageId: 'msg-1',
          priority: 'high'
        },
        {
          id: '2',
          threadId: 'thread-2',
          from: { name: 'Mike Rodriguez', email: 'mike.rodriguez@company.com' },
          to: [{ name: 'You', email: user?.email || 'you@lima.com' }],
          cc: [],
          bcc: [],
          subject: 'Weekly Team Sync - Action Items',
          body: 'Thanks everyone for the productive meeting today. Here are the key action items we discussed and the timeline for completion.',
          htmlBody: '<p>Thanks everyone for the productive meeting today.</p>',
          attachments: [{
            id: 'att-2',
            name: 'Meeting-Notes.docx',
            size: 1024000,
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          }],
          isRead: true,
          isStarred: true,
          isImportant: false,
          isDraft: false,
          isSpam: false,
          isDeleted: false,
          labels: ['work', 'meetings'],
          folder: 'inbox',
          category: 'primary',
          receivedAt: new Date('2024-01-15T08:30:00Z'),
          messageId: 'msg-2',
          priority: 'normal'
        },
        {
          id: '3',
          threadId: 'thread-3',
          from: { name: 'LinkedIn', email: 'notifications@linkedin.com' },
          to: [{ name: 'You', email: user?.email || 'you@lima.com' }],
          cc: [],
          bcc: [],
          subject: 'You have 5 new connection requests',
          body: 'Check out who wants to connect with you on LinkedIn.',
          htmlBody: '<p>Check out who wants to connect with you on LinkedIn.</p>',
          attachments: [],
          isRead: false,
          isStarred: false,
          isImportant: false,
          isDraft: false,
          isSpam: false,
          isDeleted: false,
          labels: ['social'],
          folder: 'inbox',
          category: 'social',
          receivedAt: new Date('2024-01-15T07:15:00Z'),
          messageId: 'msg-3',
          priority: 'low'
        },
        {
          id: '4',
          threadId: 'thread-4',
          from: { name: 'Amazon', email: 'no-reply@amazon.com' },
          to: [{ name: 'You', email: user?.email || 'you@lima.com' }],
          cc: [],
          bcc: [],
          subject: 'Your order has been shipped!',
          body: 'Great news! Your recent order has been shipped and is on its way.',
          htmlBody: '<p>Great news! Your recent order has been shipped and is on its way.</p>',
          attachments: [],
          isRead: true,
          isStarred: false,
          isImportant: false,
          isDraft: false,
          isSpam: false,
          isDeleted: false,
          labels: ['shopping'],
          folder: 'inbox',
          category: 'promotions',
          receivedAt: new Date('2024-01-14T16:20:00Z'),
          messageId: 'msg-4',
          priority: 'normal'
        },
        {
          id: '5',
          threadId: 'thread-5',
          from: { name: 'GitHub', email: 'noreply@github.com' },
          to: [{ name: 'You', email: user?.email || 'you@lima.com' }],
          cc: [],
          bcc: [],
          subject: 'Security alert: New sign-in from Windows',
          body: 'We detected a new sign-in to your GitHub account from a Windows device.',
          htmlBody: '<p>We detected a new sign-in to your GitHub account from a Windows device.</p>',
          attachments: [],
          isRead: false,
          isStarred: false,
          isImportant: true,
          isDraft: false,
          isSpam: false,
          isDeleted: false,
          labels: ['security'],
          folder: 'inbox',
          category: 'updates',
          receivedAt: new Date('2024-01-14T14:45:00Z'),
          messageId: 'msg-5',
          priority: 'high'
        }
      ];

      setEmailState(prev => ({
        ...prev,
        emails: mockEmails,
        totalCount: mockEmails.length,
        isLoading: false
      }));
      setSelectedEmail(mockEmails[0]);
    } catch (err) {
      error('Failed to load emails');
    } finally {
      setEmailState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const filteredEmails = emailState.emails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.from.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.from.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.body.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || email.category === selectedCategory;
    
    const matchesFilters = (!emailState.filters.unread || !email.isRead) &&
                          (!emailState.filters.starred || email.isStarred) &&
                          (!emailState.filters.hasAttachment || email.attachments.length > 0) &&
                          (!emailState.filters.important || email.isImportant);
    
    return matchesSearch && matchesCategory && matchesFilters;
  });

  // Filter counts are now handled by the filters state object

  if (emailState.isLoading) {
    return (
      <div className={cn('flex items-center justify-center h-64', className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={cn('h-full flex flex-col', className)}>

       {/* Category Tabs */}
       <div className="border-b border-gray-200 bg-white">
         <div className="flex items-center justify-between px-6 py-3">
           <div className="flex space-x-1">
             {(['all', 'primary', 'social', 'promotions', 'updates'] as const).map((category) => {
               const count = getCategoryCount(category);
               const unreadCount = getUnreadCount(category);
               return (
                 <Button
                   key={category}
                   variant={selectedCategory === category ? 'default' : 'ghost'}
                   size="sm"
                   onClick={() => setSelectedCategory(category)}
                   className={cn(
                     'relative',
                     selectedCategory === category 
                       ? 'bg-orange-500 text-white hover:bg-orange-600' 
                       : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                   )}
                 >
                   {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                   <span className="ml-1 text-xs opacity-75">({count})</span>
                   {unreadCount > 0 && (
                     <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                       {unreadCount}
                     </span>
                   )}
                 </Button>
               );
             })}
           </div>
           
           <div className="flex items-center space-x-2">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
               <Input
                 placeholder="Search emails..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-10 w-64 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
               />
             </div>
             
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
                   <Filter className="h-4 w-4 mr-2" />
                   Filter
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-48">
                 <DropdownMenuCheckboxItem
                   checked={emailState.filters.unread || false}
                   onCheckedChange={(checked) => setEmailState(prev => ({ ...prev, filters: { ...prev.filters, unread: checked } }))}
                 >
                   Unread only
                 </DropdownMenuCheckboxItem>
                 <DropdownMenuCheckboxItem
                   checked={emailState.filters.starred || false}
                   onCheckedChange={(checked) => setEmailState(prev => ({ ...prev, filters: { ...prev.filters, starred: checked } }))}
                 >
                   Starred only
                 </DropdownMenuCheckboxItem>
                 <DropdownMenuCheckboxItem
                   checked={emailState.filters.hasAttachment || false}
                   onCheckedChange={(checked) => setEmailState(prev => ({ ...prev, filters: { ...prev.filters, hasAttachment: checked } }))}
                 >
                   Has attachments
                 </DropdownMenuCheckboxItem>
                 <DropdownMenuSeparator />
                 <DropdownMenuCheckboxItem
                   checked={emailState.filters.important || false}
                   onCheckedChange={(checked) => setEmailState(prev => ({ ...prev, filters: { ...prev.filters, important: checked } }))}
                 >
                   Important
                 </DropdownMenuCheckboxItem>
               </DropdownMenuContent>
             </DropdownMenu>
           </div>
         </div>
       </div>
 
       <div className="flex-1 flex bg-white">
        {/* Compose Modal */}
        <ComposeEmailModal
          isOpen={isComposeOpen}
          onClose={() => {
            setIsComposeOpen(false);
            setReplyEmail(null);
          }}
          replyTo={replyEmail ? {
            email: replyEmail.from,
            subject: replyEmail.subject,
            threadId: replyEmail.threadId,
          } : undefined}
        />
      {/* Email List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* List Header with Bulk Actions */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedEmails.length === filteredEmails.length && filteredEmails.length > 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedEmails(filteredEmails.map(e => e.id));
                  } else {
                    setSelectedEmails([]);
                  }
                }}
              />
              <span className="text-sm text-gray-600">
                {selectedEmails.length > 0 ? `${selectedEmails.length} selected` : `${filteredEmails.length} emails`}
              </span>
            </div>
            
            {selectedEmails.length > 0 && (
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    selectedEmails.forEach(id => handleEmailAction('read', id));
                    setSelectedEmails([]);
                  }}
                  className="h-8 px-2"
                >
                  <Mail className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    selectedEmails.forEach(id => handleEmailAction('star', id));
                    setSelectedEmails([]);
                  }}
                  className="h-8 px-2"
                >
                  <Star className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    selectedEmails.forEach(id => handleEmailAction('archive', id));
                    setSelectedEmails([]);
                  }}
                  className="h-8 px-2"
                >
                  <Archive className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    selectedEmails.forEach(id => handleEmailAction('delete', id));
                    setSelectedEmails([]);
                  }}
                  className="h-8 px-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {emailState.isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : filteredEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <Inbox className="h-8 w-8 mb-2" />
              <p>No emails found</p>
              {searchTerm && (
                <p className="text-sm mt-1">Try adjusting your search or filters</p>
              )}
            </div>
          ) : (
            filteredEmails.map((email) => (
              <EmailListItem
                key={email.id}
                email={email}
                isSelected={selectedEmail?.id === email.id}
                isChecked={selectedEmails.includes(email.id)}
                onClick={() => setSelectedEmail(email)}
                onCheck={(checked) => {
                  if (checked) {
                    setSelectedEmails(prev => [...prev, email.id]);
                  } else {
                    setSelectedEmails(prev => prev.filter(id => id !== email.id));
                  }
                }}
                onAction={handleEmailAction}
              />
            ))
          )}
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
    </div>
  );
}

interface EmailListItemProps {
  email: Email;
  isSelected: boolean;
  isChecked: boolean;
  onClick: () => void;
  onCheck: (checked: boolean) => void;
  onAction?: (action: string, emailId: string) => void;
}

function EmailListItem({ email, isSelected, isChecked, onClick, onCheck, onAction }: EmailListItemProps) {
  const handleAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    onAction?.(action, email.id);
  };

  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCheck(!isChecked);
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors group',
        isSelected && 'bg-blue-50 border-blue-200',
        !email.isRead && 'bg-white'
      )}
    >
      <div className="flex items-start space-x-3">
        <div className="flex items-center pt-1">
          <Checkbox
            checked={isChecked}
            onCheckedChange={onCheck}
            onClick={handleCheckboxChange}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <span className={cn(
                'font-medium text-sm truncate',
                !email.isRead ? 'text-gray-900' : 'text-gray-600'
              )}>
                {email.from.name || email.from.email}
              </span>
              {!email.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
              )}
              {email.isImportant && (
                <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
              )}
              {email.attachments && email.attachments.length > 0 && (
                <Paperclip className="h-3 w-3 text-gray-400 flex-shrink-0" />
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => handleAction(e, 'star')}
                className={cn(
                  'p-1 rounded hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100',
                  email.isStarred && 'opacity-100',
                  email.isStarred ? 'text-yellow-500' : 'text-gray-400'
                )}
              >
                <Star className="h-4 w-4" fill={email.isStarred ? 'currentColor' : 'none'} />
              </button>
              <span className="text-xs text-gray-400">
                {formatTime(email.receivedAt)}
              </span>
            </div>
          </div>
          
          <h3 className={cn(
            'text-sm truncate mb-1',
            !email.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'
          )}>
            {email.subject}
          </h3>
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 truncate flex-1">
              {email.body}
            </p>
            
            {email.category && email.category !== 'primary' && (
              <Badge 
                variant="secondary" 
                className={cn(
                  'text-xs ml-2 flex-shrink-0',
                  email.category === 'social' && 'bg-blue-100 text-blue-700',
                  email.category === 'promotions' && 'bg-green-100 text-green-700',
                  email.category === 'updates' && 'bg-purple-100 text-purple-700'
                )}
              >
                {email.category}
              </Badge>
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
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h1 className="text-xl font-semibold text-gray-900">
                {email.subject}
              </h1>
              {email.isImportant && (
                <Badge variant="destructive" className="bg-red-100 text-red-800">
                  Important
                </Badge>
              )}
              {email.category && email.category !== 'primary' && (
                <Badge 
                  variant="secondary" 
                  className={cn(
                    email.category === 'social' && 'bg-blue-100 text-blue-700',
                    email.category === 'promotions' && 'bg-green-100 text-green-700',
                    email.category === 'updates' && 'bg-purple-100 text-purple-700'
                  )}
                >
                  {email.category}
                </Badge>
              )}
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span><strong>From:</strong> {email.from.name ? `${email.from.name} <${email.from.email}>` : email.from.email}</span>
                <span>{formatTime(email.receivedAt)}</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span><strong>To:</strong> {email.to.map(addr => addr.name ? `${addr.name} <${addr.email}>` : addr.email).join(', ')}</span>
              </div>
              
              {email.cc && email.cc.length > 0 && (
                <div className="flex items-center space-x-4">
                  <span><strong>CC:</strong> {email.cc.map(addr => addr.name ? `${addr.name} <${addr.email}>` : addr.email).join(', ')}</span>
                </div>
              )}
              
              {email.attachments && email.attachments.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Paperclip className="h-4 w-4" />
                  <span><strong>Attachments:</strong> {email.attachments.length} file{email.attachments.length > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEmailAction('star', email.id)}
              className={email.isStarred ? 'text-yellow-500 border-yellow-300' : ''}
            >
              <Star className="h-4 w-4" fill={email.isStarred ? 'currentColor' : 'none'} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEmailAction('important', email.id)}
              className={email.isImportant ? 'text-red-500 border-red-300' : ''}
            >
              <AlertCircle className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleEmailAction('archive', email.id)}>
              <Archive className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleEmailAction('delete', email.id)} className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Email Body */}
      <div className="flex-1 p-6 overflow-y-auto bg-white">
        {email.attachments && email.attachments.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Attachments</h3>
            <div className="space-y-2">
              {email.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <Paperclip className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{attachment.name}</span>
                  <span className="text-gray-500">({attachment.size})</span>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-blue-600 hover:text-blue-700">
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="prose max-w-none">
          {email.htmlBody ? (
            <div dangerouslySetInnerHTML={{ __html: email.htmlBody }} />
          ) : (
            <p className="whitespace-pre-wrap text-gray-900 leading-relaxed">{email.body}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <Button variant="default" size="sm">
            <Reply className="h-4 w-4 mr-2" />
            Reply
          </Button>
          <Button variant="outline" size="sm">
            <Forward className="h-4 w-4 mr-2" />
            Forward
          </Button>
          <Button variant="outline" size="sm">
            <Bot className="h-4 w-4 mr-2" />
            AI Assist
          </Button>
          <div className="flex-1" />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleEmailAction(email.isRead ? 'unread' : 'read', email.id)}
          >
            {email.isRead ? 'Mark Unread' : 'Mark Read'}
          </Button>
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