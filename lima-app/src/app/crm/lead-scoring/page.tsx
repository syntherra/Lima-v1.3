import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Star, Contact } from 'lucide-react';

export default function CRMLeadScoringPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Star className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lead Scoring</h1>
            <p className="text-gray-600 dark:text-gray-400">Lead scoring system</p>
          </div>
        </div>
        
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-4 bg-purple-500/10 rounded-full mb-4">
              <Contact className="h-12 w-12 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Lead Scoring System
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Automatically score and prioritize leads based on their behavior and engagement levels.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}