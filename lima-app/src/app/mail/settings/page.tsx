'use client';

import { UnifiedEmailLayout } from '@/components/email/unified-email-layout';
import { SettingsView } from '@/components/email/views/settings-view';

export default function SettingsPage() {
  return (
    <UnifiedEmailLayout>
      <SettingsView />
    </UnifiedEmailLayout>
  );
}