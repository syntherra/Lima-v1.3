'use client';

import React from 'react';
import { Search, Filter, MoreHorizontal, Archive, Trash2, Reply } from 'lucide-react';
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
import { useEmailSelection, useEmailSearch } from '@/stores/email-view-store';

// Mock sent email data
const mockSentEmails = [
  {
    id: 'sent-1',
    to: 'team@company.com',
    subject: 'Weekly Team Update - Project Status',
    preview: 'Hi everyone, I wanted to share our progress on the current projects and highlight some key achievements from this week...',
    time: '4:15 PM',
    hasAttachments: true,
    status: 'delivered' as const,
  },
  {
    id: 'sent-2',
    to: 'client@external.com',
    subject: 'Re: Contract Amendment Request',
    preview: 'Thank you for your email regarding the contract amendment. I have reviewed the proposed changes with our legal team...',
    time: '2:45 PM',
    hasAttachments: false,
    status: 'read' as const,
  },
  {
    id: 'sent-3',
    to: 'hr@company.com',
    subject: 'Vacation Request - December 2024',
    preview: 'I would like to request vacation time from December 23rd to January 2nd. I have coordinated with my team to ensure...',
    time: '10:30 AM',
    hasAttachments: false,
    status: 'delivered' as const,
  },
];

interface SentEmailItemProps {
  email: typeof mockSentEmails[0];
  isSelected: boolean;
  onSelect: (emailId: string) => void;
}

const SentEmailItem: React.FC<SentEmailItemProps> = ({ email, isSelected, onSelect }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'read':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'delivered':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };
  
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
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              To: {email.to}
            </span>
            <Badge variant="secondary" className={`text-xs ${getStatusColor(email.status)}`}>
              {email.status}
            </Badge>
            {email.hasAttachments && (
              <div className="w-3 h-3 bg-gray-400 rounded-sm" title="Has attachments" />
            )}
          </div>
          <span className="text-xs text-gray-600">{email.time}</span>
        </div>
        
        <div className="text-sm mb-1 font-medium text-gray-900">
          {email.subject}
        </div>
        
        <div className="text-xs text-gray-600 truncate">
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
            <Reply className="w-4 h-4 mr-2" />
            Forward
          </DropdownMenuItem>
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

export const SentView: React.FC = () => {
  const { selectedEmails, addSelected, removeSelected, clearSelected } = useEmailSelection();
  const { searchTerm, setSearchTerm } = useEmailSearch();
  
  const handleEmailSelect = (emailId: string) => {
    if (selectedEmails.includes(emailId)) {
      removeSelected(emailId);
    } else {
      addSelected(emailId);
    }
  };
  
  const handleSelectAll = () => {
    if (selectedEmails.length === mockSentEmails.length) {
      clearSelected();
    } else {
      mockSentEmails.forEach(email => addSelected(email.id));
    }
  };
  
  const filteredEmails = mockSentEmails.filter(email => {
    if (searchTerm && !email.subject.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !email.to.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });
  
  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in-0 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900">Sent</h1>
          <Badge variant="secondary" className="bg-green-100 text-green-600 border-green-200">
            {filteredEmails.length} emails
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
              <DropdownMenuItem className="text-gray-700 hover:bg-gray-100">
                <Checkbox className="mr-2" />
                Read receipts
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-700 hover:bg-gray-100">
                <Checkbox className="mr-2" />
                With attachments
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-700 hover:bg-gray-100">
                <Checkbox className="mr-2" />
                Last 7 days
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
            placeholder="Search sent emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>
      
      {/* Bulk Actions */}
      {selectedEmails.length > 0 && (
        <div className="flex items-center gap-2 p-4 bg-gray-50 border-b border-gray-200">
          <Checkbox
            checked={selectedEmails.length === mockSentEmails.length}
            indeterminate={selectedEmails.length > 0 && selectedEmails.length < mockSentEmails.length}
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
          <div className="flex items-center justify-center h-64 text-gray-600">
            <div className="text-center">
              <div className="text-lg mb-2">No sent emails found</div>
              <div className="text-sm">Try adjusting your search</div>
            </div>
          </div>
        ) : (
          <div className="group">
            {filteredEmails.map((email) => (
              <SentEmailItem
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