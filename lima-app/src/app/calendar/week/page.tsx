import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Calendar, CalendarDays } from 'lucide-react';

export default function CalendarWeekPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Calendar className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Week</h1>
            <p className="text-gray-600 dark:text-gray-400">Weekly view</p>
          </div>
        </div>
        
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-4 bg-blue-500/10 rounded-full mb-4">
              <CalendarDays className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Weekly View
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              View your schedule for the entire week with a comprehensive overview of all events.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}