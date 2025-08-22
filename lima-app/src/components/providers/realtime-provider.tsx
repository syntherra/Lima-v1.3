'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './auth-provider';
import { useToast } from './toast-provider';

interface RealtimeContextType {
  isConnected: boolean;
  connectionState: 'connecting' | 'connected' | 'disconnected' | 'error';
  subscribeToEmails: () => void;
  subscribeToTasks: () => void;
  subscribeToContacts: () => void;
  subscribeToAnalytics: () => void;
  unsubscribeAll: () => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

interface RealtimeProviderProps {
  children: React.ReactNode;
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      initializeRealtimeConnection();
    } else {
      unsubscribeAll();
    }

    return () => {
      unsubscribeAll();
    };
  }, [user]);

  const initializeRealtimeConnection = async () => {
    try {
      setConnectionState('connecting');
      
      // Subscribe to basic updates
      subscribeToEmails();
      subscribeToTasks();
      subscribeToContacts();
      
      setIsConnected(true);
      setConnectionState('connected');
      
    } catch (err) {
      console.error('Failed to initialize realtime connection:', err);
      setConnectionState('error');
      error('Failed to establish realtime connection');
    }
  };

  const subscribeToEmails = () => {
    if (!user) return;

    const emailSubscription = supabase
      .channel('emails')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emails',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Email update:', payload);
          handleEmailUpdate(payload);
        }
      )
      .subscribe();

    setSubscriptions(prev => [...prev, emailSubscription]);
  };

  const subscribeToTasks = () => {
    if (!user) return;

    const taskSubscription = supabase
      .channel('tasks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
        },
        (payload) => {
          console.log('Task update:', payload);
          handleTaskUpdate(payload);
        }
      )
      .subscribe();

    setSubscriptions(prev => [...prev, taskSubscription]);
  };

  const subscribeToContacts = () => {
    if (!user) return;

    const contactSubscription = supabase
      .channel('contacts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contacts',
        },
        (payload) => {
          console.log('Contact update:', payload);
          handleContactUpdate(payload);
        }
      )
      .subscribe();

    setSubscriptions(prev => [...prev, contactSubscription]);
  };

  const subscribeToAnalytics = () => {
    if (!user) return;

    const analyticsSubscription = supabase
      .channel('analytics')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'analytics_snapshots',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Analytics update:', payload);
          handleAnalyticsUpdate(payload);
        }
      )
      .subscribe();

    setSubscriptions(prev => [...prev, analyticsSubscription]);
  };

  const unsubscribeAll = () => {
    subscriptions.forEach(subscription => {
      supabase.removeChannel(subscription);
    });
    setSubscriptions([]);
    setIsConnected(false);
    setConnectionState('disconnected');
  };

  const handleEmailUpdate = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    switch (eventType) {
      case 'INSERT':
        if (newRecord.is_from_ai) {
          success('AI sent a new email', newRecord.subject);
        } else {
          // New email received
          dispatchCustomEvent('email:received', newRecord);
        }
        break;
      case 'UPDATE':
        if (oldRecord.is_read === false && newRecord.is_read === true) {
          dispatchCustomEvent('email:read', newRecord);
        }
        break;
    }
  };

  const handleTaskUpdate = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    switch (eventType) {
      case 'INSERT':
        if (newRecord.extracted_from_email) {
          success('AI extracted a new task', newRecord.title);
        }
        dispatchCustomEvent('task:created', newRecord);
        break;
      case 'UPDATE':
        if (oldRecord.status !== newRecord.status) {
          if (newRecord.status === 'completed') {
            success('Task completed', newRecord.title);
          }
          dispatchCustomEvent('task:status_changed', newRecord);
        }
        break;
    }
  };

  const handleContactUpdate = (payload: any) => {
    const { eventType, new: newRecord } = payload;
    
    switch (eventType) {
      case 'INSERT':
        dispatchCustomEvent('contact:created', newRecord);
        break;
      case 'UPDATE':
        dispatchCustomEvent('contact:updated', newRecord);
        break;
    }
  };

  const handleAnalyticsUpdate = (payload: any) => {
    const { eventType, new: newRecord } = payload;
    
    if (eventType === 'INSERT' || eventType === 'UPDATE') {
      dispatchCustomEvent('analytics:updated', newRecord);
    }
  };

  const dispatchCustomEvent = (eventName: string, data: any) => {
    window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
  };

  const contextValue: RealtimeContextType = {
    isConnected,
    connectionState,
    subscribeToEmails,
    subscribeToTasks,
    subscribeToContacts,
    subscribeToAnalytics,
    unsubscribeAll,
  };

  return (
    <RealtimeContext.Provider value={contextValue}>
      {children}
      {/* Connection Status Indicator */}
      <RealtimeStatusIndicator 
        connectionState={connectionState}
        isConnected={isConnected}
      />
    </RealtimeContext.Provider>
  );
}

interface RealtimeStatusIndicatorProps {
  connectionState: 'connecting' | 'connected' | 'disconnected' | 'error';
  isConnected: boolean;
}

function RealtimeStatusIndicator({ connectionState, isConnected }: RealtimeStatusIndicatorProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (connectionState === 'connecting' || connectionState === 'error') {
      setShow(true);
    } else if (connectionState === 'connected') {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [connectionState]);

  if (!show) return null;

  const getStatusConfig = () => {
    switch (connectionState) {
      case 'connecting':
        return {
          color: 'bg-yellow-500',
          text: 'Connecting to real-time updates...',
          icon: '⚡',
        };
      case 'connected':
        return {
          color: 'bg-green-500',
          text: 'Real-time updates connected',
          icon: '✅',
        };
      case 'error':
        return {
          color: 'bg-red-500',
          text: 'Real-time connection failed',
          icon: '❌',
        };
      default:
        return {
          color: 'bg-gray-500',
          text: 'Real-time updates disconnected',
          icon: '🔌',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`${config.color} text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-up`}>
        <span>{config.icon}</span>
        <span className="text-sm font-medium">{config.text}</span>
      </div>
    </div>
  );
}