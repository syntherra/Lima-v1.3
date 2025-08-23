'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ComposeView } from '@/components/email/views/compose-view';

export default function ComposePage() {
  return (
    <DashboardLayout>
      <ComposeView />
    </DashboardLayout>
  );
}