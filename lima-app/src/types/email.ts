export interface EmailAddress {
  email: string;
  name?: string;
}

export interface EmailAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  content?: string;
}

export interface EmailThread {
  id: string;
  subject: string;
  participants: EmailAddress[];
  messageCount: number;
  lastMessageAt: Date;
  hasUnread: boolean;
  labels: string[];
}

export interface Email {
  id: string;
  threadId?: string;
  from: EmailAddress;
  to: EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  subject: string;
  body: string;
  htmlBody?: string;
  attachments: EmailAttachment[];
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  isDraft: boolean;
  isSpam: boolean;
  isDeleted: boolean;
  labels: string[];
  folder: string;
  category: EmailCategory;
  receivedAt: Date;
  sentAt?: Date;
  replyTo?: EmailAddress;
  inReplyTo?: string;
  references?: string[];
  messageId: string;
  priority: 'low' | 'normal' | 'high';
}

export type EmailCategory = 'primary' | 'social' | 'promotions' | 'updates' | 'forums';

export interface EmailFolder {
  id: string;
  name: string;
  type: 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam' | 'custom';
  unreadCount: number;
  totalCount: number;
  color?: string;
  icon?: string;
  parentId?: string;
  children?: EmailFolder[];
}

export interface EmailAccount {
  id: string;
  email: string;
  name: string;
  provider: 'gmail' | 'outlook' | 'yahoo' | 'imap' | 'exchange';
  isDefault: boolean;
  avatar?: string;
  signature?: string;
  folders: EmailFolder[];
  settings: EmailAccountSettings;
}

export interface EmailAccountSettings {
  autoReply: boolean;
  autoReplyMessage?: string;
  forwardingEnabled: boolean;
  forwardingAddress?: string;
  notificationsEnabled: boolean;
  syncFrequency: number; // minutes
  maxSyncDays: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  htmlBody?: string;
  category: 'reply' | 'forward' | 'compose' | 'signature';
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailFilter {
  id: string;
  name: string;
  conditions: EmailFilterCondition[];
  actions: EmailFilterAction[];
  isActive: boolean;
  priority: number;
}

export interface EmailFilterCondition {
  field: 'from' | 'to' | 'subject' | 'body' | 'attachment';
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'regex';
  value: string;
  caseSensitive: boolean;
}

export interface EmailFilterAction {
  type: 'move' | 'label' | 'star' | 'markRead' | 'delete' | 'forward';
  value?: string;
}

export interface EmailSearchQuery {
  query: string;
  from?: string;
  to?: string;
  subject?: string;
  hasAttachment?: boolean;
  isUnread?: boolean;
  isStarred?: boolean;
  folder?: string;
  category?: EmailCategory;
  dateFrom?: Date;
  dateTo?: Date;
  labels?: string[];
}

export interface EmailListState {
  emails: Email[];
  threads: EmailThread[];
  selectedEmailId?: string;
  selectedThreadId?: string;
  isLoading: boolean;
  error?: string;
  hasMore: boolean;
  currentPage: number;
  totalCount: number;
  viewMode: 'list' | 'thread';
  sortBy: 'date' | 'sender' | 'subject' | 'size';
  sortOrder: 'asc' | 'desc';
  filters: {
    category?: EmailCategory;
    isUnread?: boolean;
    isStarred?: boolean;
    hasAttachment?: boolean;
    folder?: string;
    labels?: string[];
  };
  searchQuery?: EmailSearchQuery;
}

export interface EmailComposeState {
  to: EmailAddress[];
  cc: EmailAddress[];
  bcc: EmailAddress[];
  subject: string;
  body: string;
  htmlBody?: string;
  attachments: EmailAttachment[];
  isDraft: boolean;
  isScheduled: boolean;
  scheduledAt?: Date;
  template?: EmailTemplate;
  replyToId?: string;
  forwardFromId?: string;
  priority: 'low' | 'normal' | 'high';
  requestReadReceipt: boolean;
  isConfidential: boolean;
}

export interface EmailStats {
  totalEmails: number;
  unreadEmails: number;
  todayEmails: number;
  weekEmails: number;
  monthEmails: number;
  storageUsed: number; // in bytes
  storageLimit: number; // in bytes
}