'use client';

import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  AlertTriangle, 
  Play, 
  Mail, 
  Bot,
  Calendar,
  User,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { cn } from '@/utils';

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

// Utility functions
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'in_progress':
      return <Play className="h-4 w-4 text-blue-600" />;
    case 'blocked':
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    default:
      return <Circle className="h-4 w-4 text-gray-400" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-50 border-green-200';
    case 'in_progress':
      return 'bg-blue-50 border-blue-200';
    case 'blocked':
      return 'bg-red-50 border-red-200';
    case 'pending':
      return 'bg-yellow-50 border-yellow-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'low':
      return 'text-green-600 bg-green-100';
    default:
      return 'text-gray-600 bg-gray-100';
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

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: (projectId: string) => void;
  projectId: string;
}

export default function TaskList({ tasks, onTaskUpdate, projectId }: TaskListProps) {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'all' | 'ai' | 'manual'>('all');





  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      // TODO: Implement API call to update task status
      console.log(`Updating task ${taskId} to status: ${newStatus}`);
      onTaskUpdate(projectId);
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (viewMode === 'ai') return task.extracted_from_email;
    if (viewMode === 'manual') return !task.extracted_from_email;
    return true;
  });

  const aiTasksCount = tasks.filter(t => t.extracted_from_email).length;
  const manualTasksCount = tasks.filter(t => !t.extracted_from_email).length;

  return (
    <div className="p-6">
      {/* View Mode Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('all')}
            className={cn(
              'px-3 py-2 text-sm rounded-md transition-colors',
              viewMode === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setViewMode('ai')}
            className={cn(
              'px-3 py-2 text-sm rounded-md transition-colors flex items-center space-x-1',
              viewMode === 'ai'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <Bot className="h-4 w-4" />
            <span>AI Extracted ({aiTasksCount})</span>
          </button>
          <button
            onClick={() => setViewMode('manual')}
            className={cn(
              'px-3 py-2 text-sm rounded-md transition-colors',
              viewMode === 'manual'
                ? 'bg-gray-100 text-gray-700'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            Manual ({manualTasksCount})
          </button>
        </div>

        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onStatusUpdate={updateTaskStatus}
            isSelected={selectedTasks.includes(task.id)}
            onSelect={() => {
              setSelectedTasks(prev =>
                prev.includes(task.id)
                  ? prev.filter(id => id !== task.id)
                  : [...prev, task.id]
              );
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface TaskItemProps {
  task: Task;
  onStatusUpdate: (taskId: string, status: string) => void;
  isSelected: boolean;
  onSelect: () => void;
}

function TaskItem({ task, onStatusUpdate, isSelected, onSelect }: TaskItemProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={cn(
        'border rounded-lg p-4 hover:shadow-sm transition-all duration-200',
        getStatusColor(task.status),
        isSelected && 'ring-2 ring-blue-500'
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start space-x-3">
        {/* Status Icon */}
        <button
          onClick={() => {
            const nextStatus = task.status === 'completed' 
              ? 'pending' 
              : task.status === 'pending' 
                ? 'in_progress' 
                : 'completed';
            onStatusUpdate(task.id, nextStatus);
          }}
          className="mt-1 hover:scale-110 transition-transform"
        >
          {getStatusIcon(task.status)}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className={cn(
                  'text-sm font-medium',
                  task.status === 'completed' 
                    ? 'text-gray-500 line-through' 
                    : 'text-gray-900'
                )}>
                  {task.title}
                </h3>
                
                {/* AI Badge */}
                {task.extracted_from_email && (
                  <div className="flex items-center space-x-1 bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                    <Bot className="h-3 w-3" />
                    <span>AI</span>
                    {task.ai_confidence_score && (
                      <span className="text-purple-600">
                        {Math.round(task.ai_confidence_score * 100)}%
                      </span>
                    )}
                  </div>
                )}

                {/* Priority Badge */}
                <span className={cn(
                  'px-2 py-1 rounded text-xs font-medium',
                  getPriorityColor(task.priority)
                )}>
                  {task.priority}
                </span>
              </div>

              <p className={cn(
                'text-sm mb-2',
                task.status === 'completed' 
                  ? 'text-gray-400' 
                  : 'text-gray-600'
              )}>
                {task.description}
              </p>

              {/* Meta Information */}
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                {task.due_date && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span className={cn(
                      new Date(task.due_date) < new Date() && task.status !== 'completed'
                        ? 'text-red-600 font-medium'
                        : ''
                    )}>
                      {formatDate(task.due_date)}
                    </span>
                  </div>
                )}
                
                {task.extracted_from_email && task.email_id && (
                  <div className="flex items-center space-x-1 text-purple-600">
                    <Mail className="h-3 w-3" />
                    <span>From email</span>
                  </div>
                )}

                {task.assigned_to && (
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{task.assigned_to}</span>
                  </div>
                )}

                <span>Created {formatDate(task.created_at)}</span>
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex items-center space-x-1 ml-4">
                <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-red-600 rounded">
                  <Trash2 className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}