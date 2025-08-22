'use client';

import React, { useState } from 'react';
import { X, Send, Bot, User, Paperclip, Smile } from 'lucide-react';
import { useToast } from '@/components/providers/toast-provider';

interface ComposeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  replyTo?: {
    email: string;
    subject: string;
    threadId?: string;
  };
}

export default function ComposeEmailModal({ isOpen, onClose, replyTo }: ComposeEmailModalProps) {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    to: replyTo?.email || '',
    cc: '',
    bcc: '',
    subject: replyTo?.subject ? `Re: ${replyTo.subject}` : '',
    body: '',
  });
  const [sendMode, setSendMode] = useState<'you' | 'agent'>('you');
  const [loading, setSending] = useState(false);
  const [aiAssisting, setAiAssisting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAiAssist = async () => {
    if (!formData.to || !formData.subject) {
      error('Please fill in recipient and subject first');
      return;
    }

    setAiAssisting(true);
    try {
      // Mock AI assistance - would call actual API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiGeneratedBody = `Hi there,

I hope this email finds you well. I wanted to reach out regarding ${formData.subject.toLowerCase()}.

I believe there could be a great opportunity for us to collaborate. Our solution has helped similar companies achieve significant results, and I'd love to discuss how we might be able to help you as well.

Would you be available for a brief call this week to explore this further?

Best regards`;

      handleChange('body', aiGeneratedBody);
      success('AI has generated email content');
    } catch (err) {
      error('Failed to generate AI content');
    } finally {
      setAiAssisting(false);
    }
  };

  const handleSend = async () => {
    if (!formData.to || !formData.subject || !formData.body) {
      error('Please fill in all required fields');
      return;
    }

    setSending(true);
    try {
      // Mock send - would call actual API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      success(`Email sent via ${sendMode === 'you' ? 'your account' : 'Lima AI'}`);
      onClose();
      
      // Reset form
      setFormData({
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        body: '',
      });
    } catch (err) {
      error('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {replyTo ? 'Reply' : 'Compose Email'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Send Mode Toggle */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex space-x-3">
              <button
                onClick={() => setSendMode('you')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  sendMode === 'you'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <User className="h-4 w-4" />
                <span>You Mode</span>
              </button>
              <button
                onClick={() => setSendMode('agent')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  sendMode === 'agent'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Bot className="h-4 w-4" />
                <span>Agent Mode</span>
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {sendMode === 'you' 
                ? 'Email will be sent from your connected email account'
                : 'Email will be sent from Lima AI (lia@lima.ai) on your behalf'
              }
            </p>
          </div>

          {/* Form */}
          <div className="p-4 space-y-4">
            {/* To Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To *
              </label>
              <input
                type="email"
                value={formData.to}
                onChange={(e) => handleChange('to', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="recipient@example.com"
              />
            </div>

            {/* CC/BCC Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CC
                </label>
                <input
                  type="email"
                  value={formData.cc}
                  onChange={(e) => handleChange('cc', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="cc@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  BCC
                </label>
                <input
                  type="email"
                  value={formData.bcc}
                  onChange={(e) => handleChange('bcc', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="bcc@example.com"
                />
              </div>
            </div>

            {/* Subject Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Email subject"
              />
            </div>

            {/* Body Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Message *
                </label>
                <button
                  onClick={handleAiAssist}
                  disabled={aiAssisting}
                  className="flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700 disabled:opacity-50"
                >
                  <Bot className="h-4 w-4" />
                  <span>{aiAssisting ? 'Generating...' : 'AI Assist'}</span>
                </button>
              </div>
              <textarea
                value={formData.body}
                onChange={(e) => handleChange('body', e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Type your message here..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                <Paperclip className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                <Smile className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={loading || !formData.to || !formData.subject || !formData.body}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                <span>{loading ? 'Sending...' : 'Send'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}