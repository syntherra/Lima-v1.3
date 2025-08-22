import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Filter, TrendingUp } from 'lucide-react';

export default function GrowthOSFunnelsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Filter className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Funnels</h1>
            <p className="text-gray-600 dark:text-gray-400">Conversion funnels</p>
          </div>
        </div>
        
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-4 bg-green-500/10 rounded-full mb-4">
              <TrendingUp className="h-12 w-12 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Conversion Funnels
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Analyze user journeys and optimize conversion funnels to improve your business outcomes.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}