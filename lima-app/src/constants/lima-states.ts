import {
  Mail,
  Inbox,
  Send,
  FileText,
  Trash2,
  Shield,
  Folder,
  Pin,
  Archive,
  PenTool,
  TrendingUp,
  BarChart3,
  LineChart,
  FileBarChart,
  Activity,
  Target,
  Megaphone,
  TestTube,
  Filter,
  Route,
  Beaker,
  Users,
  User,
  Building,
  DollarSign,
  GitBranch,
  StickyNote,
  Clock,
  Star,
  Tags,
  Download,
  Calendar,
  CalendarDays,
  CalendarRange,
  List,
  CalendarCheck,
  Video,
  Bell,
  Repeat,
  Square,
  CheckCircle,
  CheckSquare,
  FolderOpen,
  UserCheck,
  AlertCircle,
  Edit3,
  Settings,
  Flag,
  Tag,
  Timer,
} from 'lucide-react';
import { LimaState, LimaStateId } from '@/types/lima-states';

// Mail State Configuration
const mailState: LimaState = {
  id: 'mail',
  name: 'Mail',
  icon: Mail,
  color: '#3b82f6',
  defaultRoute: '/mail/inbox',
  description: 'Email management and communication',
  menuItems: [
    { id: 'compose', label: 'Compose', icon: Edit3, route: '/mail/compose', description: 'Compose new email' },
    { id: 'inbox', label: 'Inbox', icon: Inbox, route: '/mail/inbox', description: 'View incoming emails' },
    { id: 'sent', label: 'Sent', icon: Send, route: '/mail/sent', description: 'View sent emails' },
    { id: 'drafts', label: 'Drafts', icon: FileText, route: '/mail/drafts', description: 'View draft emails' },
    { id: 'starred', label: 'Starred', icon: Star, route: '/mail/starred', description: 'View starred emails' },
    { id: 'important', label: 'Important', icon: Flag, route: '/mail/important', description: 'View important emails' },
    { id: 'archive', label: 'Archive', icon: Archive, route: '/mail/archive', description: 'View archived emails' },
    { id: 'spam', label: 'Spam', icon: Shield, route: '/mail/spam', description: 'View spam emails' },
    { id: 'trash', label: 'Trash', icon: Trash2, route: '/mail/trash', description: 'View deleted emails' },
    { id: 'settings', label: 'Settings', icon: Settings, route: '/mail/settings', description: 'Email settings and Gmail pairing' }
  ]
};

// Growth OS State Configuration
const growthOsState: LimaState = {
  id: 'growth-os',
  name: 'Growth OS',
  icon: TrendingUp,
  color: '#10b981',
  defaultRoute: '/growth-os/dashboard',
  description: 'Business growth analytics and insights',
  menuItems: [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, route: '/growth-os/dashboard', description: 'Growth overview dashboard' },
    { id: 'analytics', label: 'Analytics', icon: LineChart, route: '/growth-os/analytics', description: 'Detailed analytics' },
    { id: 'reports', label: 'Reports', icon: FileBarChart, route: '/growth-os/reports', description: 'Growth reports' },
    { id: 'metrics', label: 'Metrics', icon: Activity, route: '/growth-os/metrics', description: 'Key performance metrics' },
    { id: 'goals', label: 'Goals', icon: Target, route: '/growth-os/goals', description: 'Growth goals and targets' },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone, route: '/growth-os/campaigns', description: 'Marketing campaigns' },
    { id: 'ab-tests', label: 'A/B Tests', icon: TestTube, route: '/growth-os/ab-tests', description: 'A/B testing experiments' },
    { id: 'funnels', label: 'Conversion Funnels', icon: Filter, route: '/growth-os/funnels', description: 'Conversion funnel analysis' },
    { id: 'journey', label: 'Customer Journey', icon: Route, route: '/growth-os/journey', description: 'Customer journey mapping' },
    { id: 'experiments', label: 'Growth Experiments', icon: Beaker, route: '/growth-os/experiments', description: 'Growth experiments' }
  ]
};

// CRM State Configuration
const crmState: LimaState = {
  id: 'crm',
  name: 'CRM',
  icon: Users,
  color: '#8b5cf6',
  defaultRoute: '/crm/contacts',
  description: 'Customer relationship management',
  menuItems: [
    { id: 'contacts', label: 'Contacts', icon: User, route: '/crm/contacts', description: 'Manage contacts' },
    { id: 'companies', label: 'Companies', icon: Building, route: '/crm/companies', description: 'Manage companies' },
    { id: 'deals', label: 'Deals', icon: DollarSign, route: '/crm/deals', description: 'Manage deals and opportunities' },
    { id: 'pipeline', label: 'Pipeline', icon: GitBranch, route: '/crm/pipeline', description: 'Sales pipeline view' },
    { id: 'activities', label: 'Activities', icon: Activity, route: '/crm/activities', description: 'Track activities' },
    { id: 'notes', label: 'Notes', icon: StickyNote, route: '/crm/notes', description: 'Customer notes' },
    { id: 'follow-ups', label: 'Follow-ups', icon: Clock, route: '/crm/follow-ups', description: 'Follow-up reminders' },
    { id: 'lead-scoring', label: 'Lead Scoring', icon: Star, route: '/crm/lead-scoring', description: 'Lead scoring system' },
    { id: 'segments', label: 'Segments', icon: Tags, route: '/crm/segments', description: 'Customer segments' },
    { id: 'import-export', label: 'Import/Export', icon: Download, route: '/crm/import-export', description: 'Data import/export' }
  ]
};

// Calendar State Configuration
const calendarState: LimaState = {
  id: 'calendar',
  name: 'Calendar',
  icon: Calendar,
  color: '#f59e0b',
  defaultRoute: '/calendar/today',
  description: 'Schedule and time management',
  menuItems: [
    { id: 'today', label: 'Today', icon: CalendarDays, route: '/calendar/today', description: 'Today\'s schedule' },
    { id: 'week', label: 'Week View', icon: CalendarRange, route: '/calendar/week', description: 'Weekly calendar view' },
    { id: 'month', label: 'Month View', icon: Calendar, route: '/calendar/month', description: 'Monthly calendar view' },
    { id: 'agenda', label: 'Agenda', icon: List, route: '/calendar/agenda', description: 'Agenda view' },
    { id: 'events', label: 'Events', icon: CalendarCheck, route: '/calendar/events', description: 'Manage events' },
    { id: 'meetings', label: 'Meetings', icon: Video, route: '/calendar/meetings', description: 'Meeting management' },
    { id: 'reminders', label: 'Reminders', icon: Bell, route: '/calendar/reminders', description: 'Set reminders' },
    { id: 'recurring', label: 'Recurring Events', icon: Repeat, route: '/calendar/recurring', description: 'Recurring events' },
    { id: 'time-blocks', label: 'Time Blocks', icon: Square, route: '/calendar/time-blocks', description: 'Time blocking' },
    { id: 'availability', label: 'Availability', icon: CheckCircle, route: '/calendar/availability', description: 'Manage availability' }
  ]
};

// Tasks State Configuration
const tasksState: LimaState = {
  id: 'tasks',
  name: 'Tasks',
  icon: CheckSquare,
  color: '#ef4444',
  defaultRoute: '/tasks/my-tasks',
  description: 'Task and project management',
  menuItems: [
    { id: 'my-tasks', label: 'My Tasks', icon: User, route: '/tasks/my-tasks', description: 'Personal tasks' },
    { id: 'projects', label: 'Projects', icon: FolderOpen, route: '/tasks/projects', description: 'Project management' },
    { id: 'assigned', label: 'Assigned to Me', icon: UserCheck, route: '/tasks/assigned', description: 'Tasks assigned to me' },
    { id: 'due-today', label: 'Due Today', icon: Clock, route: '/tasks/due-today', description: 'Tasks due today' },
    { id: 'overdue', label: 'Overdue', icon: AlertCircle, route: '/tasks/overdue', description: 'Overdue tasks' },
    { id: 'completed', label: 'Completed', icon: CheckCircle, route: '/tasks/completed', description: 'Completed tasks' },
    { id: 'templates', label: 'Templates', icon: FileText, route: '/tasks/templates', description: 'Task templates' },
    { id: 'priorities', label: 'Priorities', icon: Flag, route: '/tasks/priorities', description: 'Priority management' },
    { id: 'labels', label: 'Labels', icon: Tag, route: '/tasks/labels', description: 'Task labels' },
    { id: 'time-tracking', label: 'Time Tracking', icon: Timer, route: '/tasks/time-tracking', description: 'Track time spent' }
  ]
};

// Export all states
export const LIMA_STATES: Record<LimaStateId, LimaState> = {
  mail: mailState,
  'growth-os': growthOsState,
  crm: crmState,
  calendar: calendarState,
  tasks: tasksState,
};

// Export states array for iteration
export const LIMA_STATES_ARRAY: LimaState[] = Object.values(LIMA_STATES);

// Default state
export const DEFAULT_LIMA_STATE: LimaStateId = 'mail';

// State colors for theming
export const STATE_COLORS = {
  mail: '#3b82f6',
  'growth-os': '#10b981',
  crm: '#8b5cf6',
  calendar: '#f59e0b',
  tasks: '#ef4444',
} as const;