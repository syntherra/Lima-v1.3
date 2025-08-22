'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';
import {
  Network,
  Users,
  Building2,
  GitBranch,
  Mail,
  Search,
  RefreshCw,
  Eye,
  TrendingUp,
  ArrowRight,
  User,
  Crown,
  Target
} from 'lucide-react';
import { cn } from '@/utils';

interface OrganizationMap {
  id: string;
  company_name: string;
  domain: string;
  total_contacts: number;
  departments: Department[];
  decision_makers: Contact[];
}

interface Department {
  id: string;
  name: string;
  head: Contact | null;
  contact_count: number;
  avg_response_rate: number;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  title: string;
  department: string;
  seniority_level: 'c_suite' | 'vp' | 'director' | 'manager';
  influence_score: number;
  response_rate: number;
}

export default function OrgIntel() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [orgMaps, setOrgMaps] = useState<OrganizationMap[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<OrganizationMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'hierarchy' | 'routing'>('overview');

  useEffect(() => {
    if (user) {
      loadOrganizations();
    }
  }, [user]);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      // Mock data
      const mockOrgs: OrganizationMap[] = [
        {
          id: '1',
          company_name: 'TechFlow Solutions',
          domain: 'techflow.com',
          total_contacts: 23,
          departments: [
            {
              id: 'dept-1',
              name: 'Engineering',
              head: {
                id: 'contact-1',
                name: 'Sarah Chen',
                email: 'sarah.chen@techflow.com',
                title: 'VP of Engineering',
                department: 'Engineering',
                seniority_level: 'vp',
                influence_score: 9.2,
                response_rate: 0.78,
              },
              contact_count: 8,
              avg_response_rate: 0.65,
            },
            {
              id: 'dept-2',
              name: 'Sales',
              head: {
                id: 'contact-2',
                name: 'Michael Rodriguez',
                email: 'mike.rodriguez@techflow.com',
                title: 'Head of Sales',
                department: 'Sales',
                seniority_level: 'director',
                influence_score: 8.7,
                response_rate: 0.82,
              },
              contact_count: 5,
              avg_response_rate: 0.71,
            },
          ],
          decision_makers: [
            {
              id: 'contact-4',
              name: 'David Kim',
              email: 'david.kim@techflow.com',
              title: 'CEO',
              department: 'Executive',
              seniority_level: 'c_suite',
              influence_score: 10.0,
              response_rate: 0.45,
            },
          ],
        },
      ];
      
      setOrgMaps(mockOrgs);
      if (mockOrgs.length > 0) {
        setSelectedOrg(mockOrgs[0]);
      }
    } catch (err) {
      error('Failed to load organization maps');
    } finally {
      setLoading(false);
    }
  };

  const analyzeOrganization = async () => {
    try {
      setAnalyzing(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      success('Organization structure analyzed and updated');
      loadOrganizations();
    } catch (err) {
      error('Failed to analyze organization');
    } finally {
      setAnalyzing(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'hierarchy', label: 'Hierarchy', icon: GitBranch },
    { id: 'routing', label: 'Email Routing', icon: Mail },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Network className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Org Intel</h1>
              <p className="text-gray-600">Organizational intelligence and smart email routing</p>
            </div>
          </div>
          <button
            onClick={analyzeOrganization}
            disabled={analyzing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={cn('h-4 w-4', analyzing && 'animate-spin')} />
            <span>{analyzing ? 'Analyzing...' : 'Refresh Intel'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Organizations Sidebar */}
        <div className="col-span-4">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Organizations</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {orgMaps.map((org) => (
                <div
                  key={org.id}
                  onClick={() => setSelectedOrg(org)}
                  className={cn(
                    'p-4 cursor-pointer hover:bg-gray-50 transition-colors',
                    selectedOrg?.id === org.id && 'bg-blue-50 border-r-2 border-blue-500'
                  )}
                >
                  <h4 className="font-medium text-gray-900">{org.company_name}</h4>
                  <p className="text-sm text-gray-500">{org.domain}</p>
                  <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{org.total_contacts} contacts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-8">
          {selectedOrg ? (
            <>
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                          'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Organization Stats */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Stats</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Contacts</span>
                        <span className="text-xl font-bold text-gray-900">{selectedOrg.total_contacts}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Departments</span>
                        <span className="text-xl font-bold text-gray-900">{selectedOrg.departments.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Decision Makers</span>
                        <span className="text-xl font-bold text-gray-900">{selectedOrg.decision_makers.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Department Breakdown */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Breakdown</h3>
                    <div className="space-y-3">
                      {selectedOrg.departments.map((dept) => (
                        <div key={dept.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{dept.name}</div>
                            <div className="text-sm text-gray-500">{dept.contact_count} members</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {Math.round(dept.avg_response_rate * 100)}%
                            </div>
                            <div className="text-xs text-gray-500">response rate</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key People */}
                  <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Key People</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[...selectedOrg.decision_makers, ...selectedOrg.departments.map(d => d.head)].filter(Boolean).map((contact) => (
                        <div key={contact!.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                              {contact!.seniority_level === 'c_suite' && <Crown className="h-4 w-4 text-yellow-600" />}
                              {contact!.seniority_level === 'vp' && <Target className="h-4 w-4 text-purple-600" />}
                              {contact!.seniority_level === 'director' && <User className="h-4 w-4 text-blue-600" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">{contact!.name}</h4>
                              <p className="text-sm text-gray-500 truncate">{contact!.title}</p>
                              <p className="text-xs text-gray-400">{contact!.department}</p>
                              <div className="mt-2 flex items-center space-x-2 text-xs">
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                                  {Math.round(contact!.response_rate * 100)}% response
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'hierarchy' && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Organization Hierarchy</h3>
                  
                  {/* Decision Makers */}
                  {selectedOrg.decision_makers.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center space-x-2">
                        <Crown className="h-4 w-4 text-yellow-600" />
                        <span>Executive Level</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedOrg.decision_makers.map((contact) => (
                          <div key={contact.id} className="p-4 border border-gray-200 rounded-lg">
                            <h5 className="font-medium text-gray-900">{contact.name}</h5>
                            <p className="text-sm text-gray-500">{contact.title}</p>
                            <p className="text-xs text-gray-400">{contact.email}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Departments */}
                  <div className="space-y-6">
                    {selectedOrg.departments.map((dept) => (
                      <div key={dept.id} className="border-l-4 border-blue-200 pl-4">
                        <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-blue-600" />
                          <span>{dept.name} Department</span>
                          <span className="text-sm text-gray-500">({dept.contact_count} members)</span>
                        </h4>
                        
                        {dept.head && (
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-2">Department Head:</p>
                            <h5 className="font-medium text-gray-900">{dept.head.name}</h5>
                            <p className="text-sm text-gray-500">{dept.head.title}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'routing' && (
                <div className="space-y-6">
                  {/* Routing Strategy */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Routing Strategy</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-medium text-gray-900">Response Rate</h4>
                        <p className="text-sm text-gray-600">Route through contacts with highest response rates</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-medium text-gray-900">Relationships</h4>
                        <p className="text-sm text-gray-600">Leverage existing relationships and warm connections</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-medium text-gray-900">Decision Influence</h4>
                        <p className="text-sm text-gray-600">Prioritize contacts with decision-making authority</p>
                      </div>
                    </div>
                  </div>

                  {/* Routing Insights */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Routing Insights</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Optimal Entry Point</span>
                        </div>
                        <p className="text-sm text-green-700">
                          Michael Rodriguez (Sales) has highest influence score and response rate
                        </p>
                      </div>
                      
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <ArrowRight className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Recommended Path</span>
                        </div>
                        <p className="text-sm text-blue-700">
                          Sales → Executive routing shows 3x higher success rate than direct CEO outreach
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Select an organization to view intelligence</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}