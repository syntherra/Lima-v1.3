'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Trash2, RotateCcw, X } from 'lucide-react';

interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  deletedAt: string;
}

const mockTrashEmails: Email[] = [
  {
    id: '1',
    sender: 'Newsletter',
    subject: 'Weekly Updates',
    preview: 'Check out what happened this week in our community...',
    time: '3 days ago',
    deletedAt: '2 days ago',
  },
  {
    id: '2',
    sender: 'Social Media',
    subject: 'You have new notifications',
    preview: 'Someone liked your post and 5 other notifications...',
    time: '1 week ago',
    deletedAt: '5 days ago',
  },
];

export function TrashView() {
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  const handleEmailSelect = (emailId: string) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmails.length === mockTrashEmails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(mockTrashEmails.map(email => email.id));
    }
  };

  const handleRestore = () => {
    // Handle restore logic
    console.log('Restoring emails:', selectedEmails);
    setSelectedEmails([]);
  };

  const handlePermanentDelete = () => {
    // Handle permanent delete logic
    console.log('Permanently deleting emails:', selectedEmails);
    setSelectedEmails([]);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <Checkbox
            checked={selectedEmails.length === mockTrashEmails.length}
            onCheckedChange={handleSelectAll}
            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          />
          <h1 className="text-xl font-semibold text-gray-900">Trash</h1>
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            {mockTrashEmails.length}
          </Badge>
        </div>
        
        {selectedEmails.length > 0 && (
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleRestore}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Restore
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handlePermanentDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-1" />
              Delete Forever
            </Button>
          </div>
        )}
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-auto">
        {mockTrashEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Trash2 className="h-12 w-12 mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Trash is empty</h3>
            <p className="text-sm text-center max-w-sm">
              Deleted emails will appear here. Items in trash are automatically deleted after 30 days.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {mockTrashEmails.map((email) => (
              <div
                key={email.id}
                className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${
                  selectedEmails.includes(email.id) ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleEmailSelect(email.id)}
              >
                <Checkbox
                  checked={selectedEmails.includes(email.id)}
                  onCheckedChange={() => handleEmailSelect(email.id)}
                  className="mr-3 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  onClick={(e) => e.stopPropagation()}
                />
                
                <Trash2 className="h-4 w-4 mr-3 text-red-400" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-600">
                      {email.sender}
                    </span>
                    <div className="flex flex-col items-end text-xs text-gray-400">
                      <span>Deleted {email.deletedAt}</span>
                      <span>Originally {email.time}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-1">
                    {email.subject}
                  </div>
                  
                  <div className="text-sm text-gray-400 truncate">
                    {email.preview}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      {mockTrashEmails.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Items in trash are automatically deleted after 30 days
          </p>
        </div>
      )}
    </div>
  );
}