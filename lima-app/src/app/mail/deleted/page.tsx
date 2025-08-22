import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Trash2, Mail } from 'lucide-react';

export default function MailDeletedPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Trash2 className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Deleted Items</h1>
            <p className="text-gray-600 dark:text-gray-400">View deleted emails</p>
          </div>
        </div>
        
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-4 bg-blue-500/10 rounded-full mb-4">
              <Mail className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Deleted Items
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Your deleted emails will appear here. Recover important messages or permanently delete them.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}