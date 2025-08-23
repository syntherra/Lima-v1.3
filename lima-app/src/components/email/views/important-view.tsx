'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Star, Archive, Trash2, MoreHorizontal } from 'lucide-react';

interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  isRead: boolean;
  isImportant: boolean;
}

const mockImportantEmails: Email[] = [
  {
    id: '1',
    sender: 'CEO',
    subject: 'Quarterly Review Meeting',
    preview: 'Please prepare your department reports for the upcoming quarterly review...',
    time: '2 hours ago',
    isRead: false,
    isImportant: true,
  },
  {
    id: '2',
    sender: 'HR Department',
    subject: 'Policy Update - Remote Work',
    preview: 'Important changes to our remote work policy effective immediately...',
    time: '1 day ago',
    isRead: true,
    isImportant: true,
  },
];

export function ImportantView() {
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  const handleEmailSelect = (emailId: string) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmails.length === mockImportantEmails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(mockImportantEmails.map(email => email.id));
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <Checkbox
            checked={selectedEmails.length === mockImportantEmails.length}
            onCheckedChange={handleSelectAll}
            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          />
          <h1 className="text-xl font-semibold text-gray-900">Important</h1>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            {mockImportantEmails.length}
          </Badge>
        </div>
        
        {selectedEmails.length > 0 && (
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Archive className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-auto">
        {mockImportantEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Star className="h-12 w-12 mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No important emails</h3>
            <p className="text-sm text-center max-w-sm">
              Important emails will appear here when you mark them with a star.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {mockImportantEmails.map((email) => (
              <div
                key={email.id}
                className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${
                  selectedEmails.includes(email.id) ? 'bg-blue-50' : ''
                } ${
                  !email.isRead ? 'bg-blue-50/30' : ''
                }`}
                onClick={() => handleEmailSelect(email.id)}
              >
                <Checkbox
                  checked={selectedEmails.includes(email.id)}
                  onCheckedChange={() => handleEmailSelect(email.id)}
                  className="mr-3 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  onClick={(e) => e.stopPropagation()}
                />
                
                <Star className="h-4 w-4 mr-3 text-orange-500 fill-orange-500" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm ${
                      !email.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                    }`}>
                      {email.sender}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {email.time}
                    </span>
                  </div>
                  
                  <div className={`text-sm mb-1 ${
                    !email.isRead ? 'font-medium text-gray-900' : 'text-gray-700'
                  }`}>
                    {email.subject}
                  </div>
                  
                  <div className="text-sm text-gray-500 truncate">
                    {email.preview}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}