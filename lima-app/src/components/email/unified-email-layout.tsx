'use client';

import React from 'react';
import { useEmailViewStore, EmailView } from '@/stores/email-view-store';
import { InboxView } from './views/inbox-view';
import { SentView } from './views/sent-view';
import { DraftsView } from './views/drafts-view';
import { ComposeView } from './views/compose-view';

// Placeholder components for views not yet implemented
const StarredView = () => (
  <div className="flex items-center justify-center h-full bg-white">
    <div className="text-center text-gray-600">
      <div className="text-lg mb-2 text-gray-900">Starred View</div>
      <div className="text-sm">Your starred emails will appear here</div>
    </div>
  </div>
);

const ImportantView = () => (
  <div className="flex items-center justify-center h-full bg-white">
    <div className="text-center text-gray-600">
      <div className="text-lg mb-2 text-gray-900">Important View</div>
      <div className="text-sm">Your important emails will appear here</div>
    </div>
  </div>
);

const ArchiveView = () => (
  <div className="flex items-center justify-center h-full bg-white">
    <div className="text-center text-gray-600">
      <div className="text-lg mb-2 text-gray-900">Archive View</div>
      <div className="text-sm">Your archived emails will appear here</div>
    </div>
  </div>
);

const SpamView = () => (
  <div className="flex items-center justify-center h-full bg-white">
    <div className="text-center text-gray-600">
      <div className="text-lg mb-2 text-gray-900">Spam View</div>
      <div className="text-sm">Spam emails will appear here</div>
    </div>
  </div>
);

const TrashView = () => (
  <div className="flex items-center justify-center h-full bg-white">
    <div className="text-center text-gray-600">
      <div className="text-lg mb-2 text-gray-900">Trash View</div>
      <div className="text-sm">Deleted emails will appear here</div>
    </div>
  </div>
);

const SettingsView = () => (
  <div className="flex items-center justify-center h-full bg-white">
    <div className="text-center text-gray-600">
      <div className="text-lg mb-2 text-gray-900">Email Settings</div>
      <div className="text-sm">Configure your email preferences and Gmail integration</div>
    </div>
  </div>
);

export function UnifiedEmailLayout() {
  const { activeView, isTransitioning, setActiveView } = useEmailViewStore();

  const renderActiveView = () => {
    switch (activeView) {
      case 'inbox':
        return <InboxView />;
      case 'sent':
        return <SentView />;
      case 'drafts':
        return <DraftsView />;
      case 'starred':
        return <StarredView />;
      case 'important':
        return <ImportantView />;
      case 'archive':
        return <ArchiveView />;
      case 'spam':
        return <SpamView />;
      case 'trash':
        return <TrashView />;
      case 'compose':
        return <ComposeView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <InboxView />;
    }
  };

  return (
    <div className="h-full bg-white">
      {/* Main Content Area with smooth transitions */}
      <div className="h-full relative">
        <div className="absolute inset-0 transition-all duration-300 ease-in-out transform">
          {renderActiveView()}
        </div>
      </div>
    </div>
  );
}

export default UnifiedEmailLayout;