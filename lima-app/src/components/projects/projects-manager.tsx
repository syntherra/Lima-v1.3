'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';
import ProjectCard from './project-card';
import TaskList from './task-list';
import CreateProjectModal from './create-project-modal';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Bot,
  Mail
} from 'lucide-react';
import { cn } from '@/utils';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  due_date?: string;
  progress_percentage: number;
  task_count: number;
  team_members: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  project_id: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  due_date?: string;
  extracted_from_email?: boolean;
  email_id?: string;
  ai_confidence_score?: number;
}

export default function ProjectsManager() {
  const { user } = useAuth();
  const { error, success } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [extractingTasks, setExtractingTasks] = useState(false);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  useEffect(() => {
    if (selectedProject) {
      loadTasks(selectedProject.id);
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'Q1 Sales Campaign',
          description: 'Comprehensive outreach campaign targeting enterprise clients',
          status: 'active',
          priority: 'high',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
          updated_at: new Date().toISOString(),
          due_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
          progress_percentage: 65,
          task_count: 12,
          team_members: 3,
        },
        {
          id: '2',
          name: 'Product Demo Series',
          description: 'Coordinating product demonstrations with qualified leads',
          status: 'active',
          priority: 'medium',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
          updated_at: new Date().toISOString(),
          due_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString(),
          progress_percentage: 40,
          task_count: 8,
          team_members: 2,
        },
        {
          id: '3',
          name: 'Partnership Discussions',
          description: 'Managing ongoing partnership conversations and negotiations',
          status: 'on_hold',
          priority: 'low',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(),
          updated_at: new Date().toISOString(),
          progress_percentage: 25,
          task_count: 5,
          team_members: 1,
        },
      ];

      setProjects(mockProjects);
      if (mockProjects.length > 0) {
        setSelectedProject(mockProjects[0]);
      }
    } catch (err) {
      error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async (projectId: string) => {
    try {
      // Mock tasks data
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Draft initial outreach emails',
          description: 'Create templates for cold outreach to enterprise prospects',
          status: 'completed',
          priority: 'high',
          project_id: projectId,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
          updated_at: new Date().toISOString(),
          due_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
        },
        {
          id: '2',
          title: 'Schedule follow-up call with TechFlow',
          description: 'Set up call to discuss partnership opportunity mentioned in their email',
          status: 'pending',
          priority: 'medium',
          project_id: projectId,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          updated_at: new Date().toISOString(),
          extracted_from_email: true,
          email_id: 'email-123',
          ai_confidence_score: 0.89,
          due_date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        },
        {
          id: '3',
          title: 'Prepare case study materials',
          description: 'Compile case studies for DataCorp meeting as requested in email',
          status: 'in_progress',
          priority: 'high',
          project_id: projectId,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          updated_at: new Date().toISOString(),
          extracted_from_email: true,
          email_id: 'email-124',
          ai_confidence_score: 0.92,
          due_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
        },
        {
          id: '4',
          title: 'Review contract terms',
          description: 'Analyze partnership agreement terms before next discussion',
          status: 'blocked',
          priority: 'medium',
          project_id: projectId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          due_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
        },
      ];

      setTasks(mockTasks);
    } catch (err) {
      error('Failed to load tasks');
    }
  };

  const extractTasksFromEmails = async () => {
    try {
      setExtractingTasks(true);
      
      // Simulate AI task extraction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newTasks: Task[] = [
        {
          id: Date.now().toString(),
          title: 'Send pricing information to ProTech Industries',
          description: 'They requested detailed pricing for enterprise plan in recent email',
          status: 'pending',
          priority: 'high',
          project_id: selectedProject?.id || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          extracted_from_email: true,
          email_id: 'email-new-1',
          ai_confidence_score: 0.94,
          due_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
        },
        {
          id: (Date.now() + 1).toString(),
          title: 'Book demo session with StartupCorp',
          description: 'CEO mentioned interest in scheduling a product demo this week',
          status: 'pending',
          priority: 'medium',
          project_id: selectedProject?.id || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          extracted_from_email: true,
          email_id: 'email-new-2',
          ai_confidence_score: 0.87,
          due_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
        },
      ];

      setTasks(prev => [...newTasks, ...prev]);
      success('Extracted 2 new tasks from recent emails');
    } catch (err) {
      error('Failed to extract tasks from emails');
    } finally {
      setExtractingTasks(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusFilters = [
    { id: 'all', label: 'All Projects', count: projects.length },
    { id: 'active', label: 'Active', count: projects.filter(p => p.status === 'active').length },
    { id: 'completed', label: 'Completed', count: projects.filter(p => p.status === 'completed').length },
    { id: 'on_hold', label: 'On Hold', count: projects.filter(p => p.status === 'on_hold').length },
  ];

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
    aiExtracted: tasks.filter(t => t.extracted_from_email).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-white">
      <CreateProjectModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onProjectCreated={loadProjects}
      />

      {/* Projects Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <div className="flex space-x-2">
              <button
                onClick={extractTasksFromEmails}
                disabled={extractingTasks}
                className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                <Bot className="h-4 w-4" />
                <span>{extractingTasks ? 'Extracting...' : 'AI Extract'}</span>
              </button>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>New</span>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setStatusFilter(filter.id)}
                className={cn(
                  'px-3 py-1 text-sm rounded-md transition-colors',
                  statusFilter === filter.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isSelected={selectedProject?.id === project.id}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      {/* Tasks Content */}
      <div className="flex-1 flex flex-col">
        {selectedProject ? (
          <>
            {/* Project Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedProject.name}</h2>
                  <p className="text-gray-600">{selectedProject.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Progress</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {selectedProject.progress_percentage}%
                    </div>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${selectedProject.progress_percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Task Stats */}
              <div className="grid grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{taskStats.total}</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
                  <div className="text-sm text-gray-500">Done</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</div>
                  <div className="text-sm text-gray-500">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{taskStats.pending}</div>
                  <div className="text-sm text-gray-500">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{taskStats.blocked}</div>
                  <div className="text-sm text-gray-500">Blocked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{taskStats.aiExtracted}</div>
                  <div className="text-sm text-gray-500">AI Found</div>
                </div>
              </div>
            </div>

            {/* Tasks List */}
            <div className="flex-1 overflow-y-auto">
              <TaskList
                tasks={tasks}
                onTaskUpdate={loadTasks}
                projectId={selectedProject.id}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Select a project to view tasks</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}