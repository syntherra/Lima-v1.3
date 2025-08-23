'use client';

import React from 'react';
import { Search, Filter, MoreHorizontal, Edit3, Trash2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEmailSelection, useEmailSearch, useEmailViewStore } from '@/stores/email-view-store';

// Mock draft email data
const mockDraftEmails = [
  {
    id: 'draft-1',
    to: 'marketing@company.com',
    subject: 'Q1 Marketing Campaign Strategy',
    preview: 'Hi Marketing Team, I wanted to discuss our upcoming Q1 marketing campaign strategy. I have some ideas for...',
    lastModified: '2 hours ago',
    hasAttachments: false,
    isComplete: false,
  },
  {
    id: 'draft-2',
    to: '',
    subject: '',
    preview: 'Dear [Recipient], I hope this email finds you well. I am writing to...',
    lastModified: '1 day ago',
    hasAttachments: true,
    isComplete: false,
  },
  {
    id: 'draft-3',
    to: 'support@vendor.com',
    subject: 'Technical Support Request - Integration Issues',
    preview: 'Hello Support Team, We are experiencing some integration issues with your API. The specific error we are encountering...',
    lastModified: '3 days ago',
    hasAttachments: true,
    isComplete: true,
  },
];

interface DraftEmailItemProps {
  email: typeof mockDraftEmails[0];
  isSelected: boolean;
  onSelect: (emailId: string) => void;
  onEdit: (emailId: string) => void;
}

const DraftEmailItem: React.FC<DraftEmailItemProps> = ({ email, isSelected, onSelect, onEdit }) => {
  const getCompletionStatus = () => {
    if (!email.to || !email.subject) {
      return { label: 'Incomplete', color: 'text-red-600 bg-red-100 border-red-200' };
    }
    if (email.isComplete) {
      return { label: 'Ready to send', color: 'text-green-600 bg-green-100 border-green-200' };
    }
    return { label: 'In progress', color: 'text-yellow-600 bg-yellow-100 border-yellow-200' };
  };
  
  const status = getCompletionStatus();
  
  return (
    <div
      className={`flex items-center gap-3 p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-50 border-blue-200' : ''
      }`}
      onClick={() => onSelect(email.id)}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onSelect(email.id)}
        onClick={(e) => e.stopPropagation()}
      />
      
      <button
        className="p-1 hover:bg-gray-100 rounded transition-colors text-blue-600"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(email.id);
        }}
        title="Edit draft"
      >
        <Edit3 className="w-4 h-4" />
      </button>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              {email.to ? `To: ${email.to}` : 'No recipient'}
            </span>
            <Badge variant="secondary" className={`text-xs ${status.color}`}>
              {status.label}
            </Badge>
            {email.hasAttachments && (
              <div className="w-3 h-3 bg-gray-400 rounded-sm" title="Has attachments" />
            )}
          </div>
          <span className="text-xs text-gray-600">{email.lastModified}</span>
        </div>
        
        <div className="text-sm mb-1 font-medium text-gray-900">
          {email.subject || 'No subject'}
        </div>
        
        <div className="text-xs text-gray-600 truncate">
          {email.preview}
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {email.isComplete && (
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-green-600 hover:bg-green-100"
            onClick={(e) => {
              e.stopPropagation();
              // Handle send draft
            }}
            title="Send draft"
          >
            <Send className="w-4 h-4" />
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border-gray-200">
            <DropdownMenuItem 
              className="text-gray-700 hover:bg-gray-100"
              onClick={() => onEdit(email.id)}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            {email.isComplete && (
              <DropdownMenuItem className="text-green-600 hover:bg-gray-100">
                <Send className="w-4 h-4 mr-2" />
                Send
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-red-600 hover:bg-gray-100">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export const DraftsView: React.FC = () => {
  const { selectedEmails, addSelected, removeSelected, clearSelected } = useEmailSelection();
  const { searchTerm, setSearchTerm } = useEmailSearch();
  const { setActiveView } = useEmailViewStore();
  
  const handleEmailSelect = (emailId: string) => {
    if (selectedEmails.includes(emailId)) {
      removeSelected(emailId);
    } else {
      addSelected(emailId);
    }
  };
  
  const handleEditDraft = (emailId: string) => {
    // In a real app, this would load the draft data into the compose view
    setActiveView('compose');
  };
  
  const handleSelectAll = () => {
    if (selectedEmails.length === mockDraftEmails.length) {
      clearSelected();
    } else {
      mockDraftEmails.forEach(email => addSelected(email.id));
    }
  };
  
  const filteredEmails = mockDraftEmails.filter(email => {
    if (searchTerm && !email.subject.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !email.to.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });
  
  const incompleteDrafts = filteredEmails.filter(email => !email.to || !email.subject);
  const readyDrafts = filteredEmails.filter(email => email.isComplete);
  
  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in-0 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900">Drafts</h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-600 border-yellow-200">
              {filteredEmails.length} drafts
            </Badge>
            {readyDrafts.length > 0 && (
              <Badge variant="secondary" className="bg-green-100 text-green-600 border-green-200">
                {readyDrafts.length} ready
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setActiveView('compose')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            New Draft
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border-gray-200">
              <DropdownMenuItem className="text-gray-700 hover:bg-gray-100">
                <Checkbox className="mr-2" />
                Ready to send
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-700 hover:bg-gray-100">
                <Checkbox className="mr-2" />
                Incomplete
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-700 hover:bg-gray-100">
                <Checkbox className="mr-2" />
                With attachments
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search drafts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          />
        </div>
      </div>
      
      {/* Bulk Actions */}
      {selectedEmails.length > 0 && (
        <div className="flex items-center gap-2 p-4 bg-blue-50 border-b border-gray-200">
          <Checkbox
            checked={selectedEmails.length === mockDraftEmails.length}
            indeterminate={selectedEmails.length > 0 && selectedEmails.length < mockDraftEmails.length}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-gray-700">
            {selectedEmails.length} selected
          </span>
          <div className="flex items-center gap-1 ml-4">
            <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}
      
      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {filteredEmails.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <div className="text-lg mb-2">No drafts found</div>
              <div className="text-sm mb-4">Try adjusting your search</div>
              <Button 
                onClick={() => setActiveView('compose')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Create New Draft
              </Button>
            </div>
          </div>
        ) : (
          <div className="group">
            {filteredEmails.map((email) => (
              <DraftEmailItem
                key={email.id}
                email={email}
                isSelected={selectedEmails.includes(email.id)}
                onSelect={handleEmailSelect}
                onEdit={handleEditDraft}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};