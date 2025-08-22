'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAuth } from '@/components/providers/auth-provider';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  User,
  MoreHorizontal,
  CheckSquare,
  Clock,
  AlertCircle,
  Flag,
  Users,
  Tag
} from 'lucide-react';
import { cn } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input, Avatar, AvatarFallback, Tabs, TabsList, TabsTrigger, TabsContent, Progress } from '@/components/ui';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: {
    name: string;
    avatar: string;
  };
  dueDate: string;
  tags: string[];
  comments: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  tasks: Task[];
  team: Array<{
    name: string;
    avatar: string;
  }>;
}

export default function ProjectsPage() {
  const { user } = useAuth();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [selectedProject, setSelectedProject] = useState('1');

  // Demo projects and tasks
  const projects: Project[] = [
    {
      id: '1',
      name: 'Q1 Growth Campaign',
      description: 'Launch comprehensive outreach campaign targeting SaaS executives',
      progress: 75,
      team: [
        { name: 'Sarah J', avatar: 'SJ' },
        { name: 'Mike R', avatar: 'MR' },
        { name: 'Emma W', avatar: 'EW' }
      ],
      tasks: [
        {
          id: '1',
          title: 'Research target companies',
          description: 'Identify 500 SaaS companies with 50-200 employees for outreach campaign',
          status: 'done',
          priority: 'high',
          assignee: { name: 'Sarah Johnson', avatar: 'SJ' },
          dueDate: '2024-01-15',
          tags: ['research', 'targeting'],
          comments: 3
        },
        {
          id: '2',
          title: 'Create email templates',
          description: 'Design 5 personalized email templates for different personas',
          status: 'done',
          priority: 'high',
          assignee: { name: 'Mike Rodriguez', avatar: 'MR' },
          dueDate: '2024-01-18',
          tags: ['content', 'templates'],
          comments: 7
        },
        {
          id: '3',
          title: 'Set up AI personalization',
          description: 'Configure Lima AI to personalize emails based on company data and recent news',
          status: 'in-progress',
          priority: 'high',
          assignee: { name: 'Emma Wilson', avatar: 'EW' },
          dueDate: '2024-01-22',
          tags: ['ai', 'automation'],
          comments: 2
        },
        {
          id: '4',
          title: 'Launch campaign batch 1',
          description: 'Send first 100 emails and monitor response rates',
          status: 'in-progress',
          priority: 'medium',
          assignee: { name: 'Sarah Johnson', avatar: 'SJ' },
          dueDate: '2024-01-25',
          tags: ['campaign', 'launch'],
          comments: 1
        },
        {
          id: '5',
          title: 'A/B test subject lines',
          description: 'Test 3 different subject line approaches to optimize open rates',
          status: 'review',
          priority: 'medium',
          assignee: { name: 'Mike Rodriguez', avatar: 'MR' },
          dueDate: '2024-01-28',
          tags: ['testing', 'optimization'],
          comments: 5
        },
        {
          id: '6',
          title: 'Analyze campaign metrics',
          description: 'Review open rates, reply rates, and meeting bookings from first batch',
          status: 'todo',
          priority: 'low',
          assignee: { name: 'Emma Wilson', avatar: 'EW' },
          dueDate: '2024-01-30',
          tags: ['analytics', 'reporting'],
          comments: 0
        },
        {
          id: '7',
          title: 'Follow-up sequence setup',
          description: 'Create automated follow-up sequence for non-responders',
          status: 'todo',
          priority: 'medium',
          assignee: { name: 'Sarah Johnson', avatar: 'SJ' },
          dueDate: '2024-02-02',
          tags: ['automation', 'follow-up'],
          comments: 0
        }
      ]
    },
    {
      id: '2',
      name: 'CRM Integration',
      description: 'Integrate Lima with major CRM platforms',
      progress: 45,
      team: [
        { name: 'Alex T', avatar: 'AT' },
        { name: 'Lisa M', avatar: 'LM' }
      ],
      tasks: [
        {
          id: '8',
          title: 'Salesforce integration',
          description: 'Build two-way sync with Salesforce CRM',
          status: 'in-progress',
          priority: 'high',
          assignee: { name: 'Alex Thompson', avatar: 'AT' },
          dueDate: '2024-02-15',
          tags: ['integration', 'salesforce'],
          comments: 4
        },
        {
          id: '9',
          title: 'HubSpot connector',
          description: 'Develop HubSpot integration for contact management',
          status: 'todo',
          priority: 'high',
          assignee: { name: 'Lisa Martinez', avatar: 'LM' },
          dueDate: '2024-02-20',
          tags: ['integration', 'hubspot'],
          comments: 2
        }
      ]
    }
  ];

  const currentProject = projects.find(p => p.id === selectedProject) || projects[0];
  
  const columns = [
    { id: 'todo', title: 'To Do', color: 'gray' },
    { id: 'in-progress', title: 'In Progress', color: 'blue' },
    { id: 'review', title: 'Review', color: 'yellow' },
    { id: 'done', title: 'Done', color: 'green' }
  ];

  const getTasksByStatus = (status: string) => {
    return currentProject.tasks.filter(task => task.status === status);
  };

  return (
    <DashboardLayout>
      <div className="lima-h-full flex flex-col">
        {/* Header */}
        <div className="border-b bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-600 mt-1">
                Manage campaigns and track progress
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Tabs value={view} onValueChange={(value) => setView(value as 'kanban' | 'list')}>
                <TabsList>
                  <TabsTrigger value="kanban">Kanban</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </div>
          </div>
        </div>

        {/* Project Selector */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-4">
            {projects.map((project) => (
              <Card
                key={project.id}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-md',
                  selectedProject === project.id ? 'ring-2 ring-blue-500' : ''
                )}
                onClick={() => setSelectedProject(project.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {project.name}
                    </h3>
                    <span className="text-sm text-gray-600">
                      {project.progress}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {project.team.map((member, index) => (
                        <Avatar key={index} className="w-6 h-6 border-2 border-white">
                          <AvatarFallback className="text-xs">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <Progress value={project.progress} className="w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <Tabs value={view} className="h-full">
            <TabsContent value="kanban" className="h-full">
              <div className="grid grid-cols-4 gap-6 h-full">
                {columns.map((column) => (
                  <div key={column.id} className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {column.title}
                      </h3>
                      <Badge variant="secondary">
                        {getTasksByStatus(column.id).length}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3 flex-1">
                      {getTasksByStatus(column.id).map((task) => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                      
                      <Button 
                        variant="outline" 
                        className="w-full h-auto p-3 border-dashed text-gray-500 hover:text-gray-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add task
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="list">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Tasks ({currentProject.tasks.length})
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="search"
                          placeholder="Search tasks..."
                          className="pl-10 w-64"
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Task</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Priority</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Assignee</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Due Date</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentProject.tasks.map((task) => (
                          <tr key={task.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {task.title}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {task.description}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <StatusBadge status={task.status} />
                            </td>
                            <td className="py-3 px-4">
                              <PriorityBadge priority={task.priority} />
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs">
                                    {task.assignee.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{task.assignee.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm">{task.dueDate}</span>
                            </td>
                            <td className="py-3 px-4">
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <PriorityBadge priority={task.priority} />
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
        
        <h4 className="text-sm font-semibold text-gray-900 mb-2">
          {task.title}
        </h4>
        
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs">
                {task.assignee.avatar}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-600">{task.assignee.name}</span>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Calendar className="h-3 w-3" />
            {task.dueDate}
          </div>
        </div>
        
        {task.comments > 0 && (
          <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
            <Users className="h-3 w-3 text-gray-600" />
            <span className="text-xs text-gray-600">
              {task.comments} comments
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: Task['status'] }) {
  const statusConfig = {
    'todo': { label: 'To Do', class: 'bg-gray-100 text-gray-700' },
    'in-progress': { label: 'In Progress', class: 'bg-blue-100 text-blue-700' },
    'review': { label: 'Review', class: 'bg-yellow-100 text-yellow-700' },
    'done': { label: 'Done', class: 'bg-green-100 text-green-700' }
  };

  return (
    <Badge className={statusConfig[status].class}>
      {statusConfig[status].label}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: Task['priority'] }) {
  const priorityConfig = {
    low: { icon: Flag, class: 'text-green-500', bgClass: 'bg-green-100 text-green-700' },
    medium: { icon: AlertCircle, class: 'text-yellow-500', bgClass: 'bg-yellow-100 text-yellow-700' },
    high: { icon: AlertCircle, class: 'text-red-500', bgClass: 'bg-red-100 text-red-700' }
  };

  const { icon: Icon, class: iconClass, bgClass } = priorityConfig[priority];

  return (
    <Badge className={`flex items-center gap-1 ${bgClass}`}>
      <Icon className={`h-3 w-3 ${iconClass}`} />
      <span className="text-xs capitalize">{priority}</span>
    </Badge>
  );
}