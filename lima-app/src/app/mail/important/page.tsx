'use client';

import { UnifiedEmailLayout } from '@/components/email/unified-email-layout';
import { ImportantView } from '@/components/email/views/important-view';

export default function ImportantPage() {
  return (
    <UnifiedEmailLayout>
      <ImportantView />
    </UnifiedEmailLayout>
  );
}