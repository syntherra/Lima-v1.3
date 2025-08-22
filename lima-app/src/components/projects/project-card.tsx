'use client';

import React from 'react';
import { Calendar, Users, TrendingUp, Clock } from 'lucide-react';
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

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onClick: () => void;
}

export default function ProjectCard({ project, isSelected, onClick }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) return `${Math.abs(diffInDays)} days overdue`;
    if (diffInDays === 0) return 'Due today';
    if (diffInDays === 1) return 'Due tomorrow';
    return `Due in ${diffInDays} days`;
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors border-l-4',
        isSelected && 'bg-blue-50 border-blue-200',
        getPriorityColor(project.priority)
      )}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {project.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {project.description}
            </p>
          </div>
          <span
            className={cn(
              'ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
              getStatusColor(project.status)
            )}
          >
            {project.status.replace('_', ' ')}
          </span>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{project.progress_percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${project.progress_percentage}%` }}
            />
          </div>
        </div>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(project.due_date)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3" />
              <span>{project.task_count} tasks</span>
            </div>
          </div>
          {project.team_members > 0 && (
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{project.team_members}</span>
            </div>
          )}
        </div>

        {/* Due Date Alert */}
        {project.due_date && (
          (() => {
            const daysUntilDue = Math.ceil(
              (new Date(project.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );
            
            if (daysUntilDue <= 3 && daysUntilDue >= 0) {
              return (
                <div className="flex items-center space-x-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                  <Clock className="h-3 w-3" />
                  <span>Due soon</span>
                </div>
              );
            }
            
            if (daysUntilDue < 0) {
              return (
                <div className="flex items-center space-x-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                  <Clock className="h-3 w-3" />
                  <span>Overdue</span>
                </div>
              );
            }
            
            return null;
          })()
        )}
      </div>
    </div>
  );
}