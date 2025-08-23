'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Mail, 
  User, 
  Save,
  Eye,
  Lock
} from 'lucide-react';

export function SettingsView() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    desktopNotifications: false,
    soundNotifications: true,
    autoMarkAsRead: false,
    showPreview: true,
    darkMode: false,
    compactView: false,
    signature: 'Best regards,\nJohn Doe',
    displayName: 'John Doe',
    emailAddress: 'john.doe@company.com',
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // Handle save logic here
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <Settings className="h-5 w-5 text-gray-600" />
          <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        </div>
        
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl space-y-8">
          
          {/* Account Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-medium text-gray-900">Account</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={settings.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  className="border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emailAddress">Email Address</Label>
                <Input
                  id="emailAddress"
                  value={settings.emailAddress}
                  onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                  className="border-gray-300"
                  disabled
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Notifications */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications for new emails</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={() => handleToggle('emailNotifications')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Desktop Notifications</Label>
                  <p className="text-sm text-gray-500">Show desktop notifications</p>
                </div>
                <Switch
                  checked={settings.desktopNotifications}
                  onCheckedChange={() => handleToggle('desktopNotifications')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Sound Notifications</Label>
                  <p className="text-sm text-gray-500">Play sound for new emails</p>
                </div>
                <Switch
                  checked={settings.soundNotifications}
                  onCheckedChange={() => handleToggle('soundNotifications')}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Email Behavior */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-medium text-gray-900">Email Behavior</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto Mark as Read</Label>
                  <p className="text-sm text-gray-500">Automatically mark emails as read when opened</p>
                </div>
                <Switch
                  checked={settings.autoMarkAsRead}
                  onCheckedChange={() => handleToggle('autoMarkAsRead')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Show Email Preview</Label>
                  <p className="text-sm text-gray-500">Display email preview in the list</p>
                </div>
                <Switch
                  checked={settings.showPreview}
                  onCheckedChange={() => handleToggle('showPreview')}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Appearance */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-medium text-gray-900">Appearance</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-gray-500">Use dark theme</p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={() => handleToggle('darkMode')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Compact View</Label>
                  <p className="text-sm text-gray-500">Show more emails in less space</p>
                </div>
                <Switch
                  checked={settings.compactView}
                  onCheckedChange={() => handleToggle('compactView')}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Email Signature */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-medium text-gray-900">Email Signature</h2>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signature">Signature</Label>
              <textarea
                id="signature"
                value={settings.signature}
                onChange={(e) => handleInputChange('signature', e.target.value)}
                className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email signature..."
              />
            </div>
          </div>

          <Separator />

          {/* Privacy & Security */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-medium text-gray-900">Privacy & Security</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Lock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Two-Factor Authentication</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                <p className="text-sm text-blue-700">
                  Your account is protected with two-factor authentication.
                </p>
              </div>
              
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}