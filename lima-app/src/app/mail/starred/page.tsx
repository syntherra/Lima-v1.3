import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { UnifiedEmailLayout } from '@/components/email/unified-email-layout';

export default function StarredPage() {
  return (
    <DashboardLayout>
      <UnifiedEmailLayout />
    </DashboardLayout>
  );
}