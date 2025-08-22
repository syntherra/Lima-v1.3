'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((title: string, description?: string) => {
    addToast({ title, description, type: 'success' });
  }, [addToast]);

  const error = useCallback((title: string, description?: string) => {
    addToast({ title, description, type: 'error' });
  }, [addToast]);

  const warning = useCallback((title: string, description?: string) => {
    addToast({ title, description, type: 'warning' });
  }, [addToast]);

  const info = useCallback((title: string, description?: string) => {
    addToast({ title, description, type: 'info' });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{
      toasts,
      addToast,
      removeToast,
      success,
      error,
      warning,
      info,
    }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`max-w-md p-4 rounded-lg shadow-lg border transition-all ${
                toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                toast.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{toast.title}</div>
                  {toast.description && (
                    <div className="text-sm mt-1 opacity-75">{toast.description}</div>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="ml-4 text-lg leading-none opacity-50 hover:opacity-75"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};