import { DashboardLayout } from '@/components/layout/dashboard-layout';
import CRMDashboard from '@/components/crm/crm-dashboard';

export default function CRMPage() {
  return (
    <DashboardLayout>
      <div className="h-full">
        <CRMDashboard className="h-full" />
      </div>
    </DashboardLayout>
  );
}