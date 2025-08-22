import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Folder, Mail } from 'lucide-react';

export default function MailFoldersPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Folder className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Folders</h1>
            <p className="text-gray-600 dark:text-gray-400">Organize emails in folders</p>
          </div>
        </div>
        
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-4 bg-blue-500/10 rounded-full mb-4">
              <Mail className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Email Folders
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Create and manage custom folders to organize your emails efficiently.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}