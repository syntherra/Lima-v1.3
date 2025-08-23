'use client';

import { UnifiedEmailLayout } from '@/components/email/unified-email-layout';
import { TrashView } from '@/components/email/views/trash-view';

export default function TrashPage() {
  return (
    <UnifiedEmailLayout>
      <TrashView />
    </UnifiedEmailLayout>
  );
}