'use client';

import React from 'react';
import { Search, Filter, MoreHorizontal, Star, Archive, Trash2 } from 'lucide-react';
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
import { useEmailViewStore, useEmailSelection, useEmailSearch } from '@/stores/email-view-store';

// Mock email data - in real app this would come from API
const mockEmails = [
  {
    id: '1',
    from: 'john.doe@company.com',
    subject: 'Q4 Budget Review Meeting',
    preview: 'Hi team, I wanted to schedule our quarterly budget review meeting for next week. Please let me know your availability...',
    time: '2:30 PM',
    isRead: false,
    isStarred: true,
    isImportant: true,
    hasAttachments: true,
  },
  {
    id: '2',
    from: 'sarah.wilson@client.com',
    subject: 'Project Proposal Feedback',
    preview: 'Thank you for sending the project proposal. I have reviewed it with my team and we have some feedback to share...',
    time: '1:15 PM',
    isRead: true,
    isStarred: false,
    isImportant: false,
    hasAttachments: false,
  },
  {
    id: '3',
    from: 'notifications@github.com',
    subject: 'Pull Request #247 merged',
    preview: 'Your pull request "Add email client functionality" has been successfully merged into the main branch...',
    time: '11:45 AM',
    isRead: true,
    isStarred: false,
    isImportant: false,
    hasAttachments: false,
  },
];

interface EmailItemProps {
  email: typeof mockEmails[0];
  isSelected: boolean;
  onSelect: (emailId: string) => void;
}

const EmailItem: React.FC<EmailItemProps> = ({ email, isSelected, onSelect }) => {
  return (
    <div
      className={`flex items-center gap-3 p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${
        !email.isRead ? 'bg-blue-50' : ''
      } ${isSelected ? 'bg-blue-100 border-blue-300' : ''}`}
      onClick={() => onSelect(email.id)}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onSelect(email.id)}
        onClick={(e) => e.stopPropagation()}
      />
      
      <button
        className={`p-1 hover:bg-gray-200 rounded transition-colors ${
          email.isStarred ? 'text-yellow-500' : 'text-gray-400'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          // Handle star toggle
        }}
      >
        <Star className="w-4 h-4" fill={email.isStarred ? 'currentColor' : 'none'} />
      </button>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className={`text-sm ${!email.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
              {email.from}
            </span>
            {email.isImportant && (
              <Badge variant="secondary" className="text-xs bg-red-100 text-red-600 border-red-200">
                Important
              </Badge>
            )}
            {email.hasAttachments && (
              <div className="w-3 h-3 bg-gray-400 rounded-sm" title="Has attachments" />
            )}
          </div>
          <span className="text-xs text-gray-500">{email.time}</span>
        </div>
        
        <div className={`text-sm mb-1 ${!email.isRead ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
          {email.subject}
        </div>
        
        <div className="text-xs text-gray-500 truncate">
          {email.preview}
        </div>
      </div>
      
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
          <DropdownMenuItem className="text-gray-700 hover:bg-gray-100">
            <Archive className="w-4 h-4 mr-2" />
            Archive
          </DropdownMenuItem>
          <DropdownMenuItem className="text-gray-700 hover:bg-gray-100">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const InboxView: React.FC = () => {
  const { selectedEmails, addSelected, removeSelected, clearSelected } = useEmailSelection();
  const { searchTerm, setSearchTerm, filters, setFilters } = useEmailSearch();
  const checkboxRef = React.useRef<HTMLButtonElement>(null);
  
  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = selectedEmails.length > 0 && selectedEmails.length < mockEmails.length;
    }
  }, [selectedEmails.length]);
  
  const handleEmailSelect = (emailId: string) => {
    if (selectedEmails.includes(emailId)) {
      removeSelected(emailId);
    } else {
      addSelected(emailId);
    }
  };
  
  const handleSelectAll = () => {
    if (selectedEmails.length === mockEmails.length) {
      clearSelected();
    } else {
      mockEmails.forEach(email => addSelected(email.id));
    }
  };
  
  const filteredEmails = mockEmails.filter(email => {
    if (searchTerm && !email.subject.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !email.from.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filters.unread && email.isRead) return false;
    if (filters.starred && !email.isStarred) return false;
    if (filters.important && !email.isImportant) return false;
    if (filters.hasAttachments && !email.hasAttachments) return false;
    return true;
  });
  
  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in-0 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900">Inbox</h1>
          <Badge variant="secondary" className="bg-blue-100 text-blue-600 border-blue-200">
            {filteredEmails.filter(e => !e.isRead).length} unread
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border-gray-200">
              <DropdownMenuItem 
                className="text-gray-700 hover:bg-gray-100"
                onClick={() => setFilters({ unread: !filters.unread })}
              >
                <Checkbox checked={filters.unread} className="mr-2" />
                Unread only
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-gray-700 hover:bg-gray-100"
                onClick={() => setFilters({ starred: !filters.starred })}
              >
                <Checkbox checked={filters.starred} className="mr-2" />
                Starred only
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-gray-700 hover:bg-gray-100"
                onClick={() => setFilters({ important: !filters.important })}
              >
                <Checkbox checked={filters.important} className="mr-2" />
                Important only
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
            placeholder="Search emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>
      
      {/* Bulk Actions */}
      {selectedEmails.length > 0 && (
        <div className="flex items-center gap-2 p-4 bg-blue-50 border-b border-gray-200">
          <Checkbox
            ref={checkboxRef}
            checked={selectedEmails.length === mockEmails.length}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-gray-700">
            {selectedEmails.length} selected
          </span>
          <div className="flex items-center gap-1 ml-4">
            <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-gray-100">
              <Archive className="w-4 h-4 mr-1" />
              Archive
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-gray-100">
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
              <div className="text-lg mb-2">No emails found</div>
              <div className="text-sm">Try adjusting your search or filters</div>
            </div>
          </div>
        ) : (
          <div className="group">
            {filteredEmails.map((email) => (
              <EmailItem
                key={email.id}
                email={email}
                isSelected={selectedEmails.includes(email.id)}
                onSelect={handleEmailSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};