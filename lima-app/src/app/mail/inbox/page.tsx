import { DashboardLayout } from '@/components/layout/dashboard-layout';
import EmailInbox from '@/components/email/email-inbox';

export default function MailInboxPage() {
  return (
    <DashboardLayout>
      <EmailInbox />
    </DashboardLayout>
  );
}