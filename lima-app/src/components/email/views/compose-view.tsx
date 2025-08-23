'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Paperclip, Image, Smile } from 'lucide-react';

export function ComposeView() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [showCcBcc, setShowCcBcc] = useState(false);

  const handleSend = () => {
    // TODO: Implement send functionality
    console.log('Sending email:', { to, subject, message, cc, bcc });
  };

  const handleSaveDraft = () => {
    // TODO: Implement save draft functionality
    console.log('Saving draft:', { to, subject, message, cc, bcc });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">Compose Email</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-lg font-medium text-gray-800">
            New Message
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-4">
            {/* To Field */}
            <div className="space-y-2">
              <Label htmlFor="to" className="text-sm font-medium text-gray-700">
                To
              </Label>
              <Input
                id="to"
                type="email"
                placeholder="Enter recipient email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* CC/BCC Toggle */}
            {!showCcBcc && (
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCcBcc(true)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto"
                >
                  + Add CC/BCC
                </Button>
              </div>
            )}

            {/* CC Field */}
            {showCcBcc && (
              <div className="space-y-2">
                <Label htmlFor="cc" className="text-sm font-medium text-gray-700">
                  CC
                </Label>
                <Input
                  id="cc"
                  type="email"
                  placeholder="Enter CC recipients"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}

            {/* BCC Field */}
            {showCcBcc && (
              <div className="space-y-2">
                <Label htmlFor="bcc" className="text-sm font-medium text-gray-700">
                  BCC
                </Label>
                <Input
                  id="bcc"
                  type="email"
                  placeholder="Enter BCC recipients"
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Subject Field */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                Subject
              </Label>
              <Input
                id="subject"
                type="text"
                placeholder="Enter email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Write your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[400px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                >
                  <Paperclip className="h-4 w-4 mr-1" />
                  Attach
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                >
                  <Image className="h-4 w-4 mr-1" />
                  Image
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                >
                  <Smile className="h-4 w-4 mr-1" />
                  Emoji
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Save Draft
                </Button>
                <Button
                  type="button"
                  onClick={handleSend}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}