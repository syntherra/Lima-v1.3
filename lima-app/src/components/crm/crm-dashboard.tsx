'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';
import {
  Building2,
  Users,
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Star,
  TrendingUp,
  MoreHorizontal,
  Globe,
  Calendar,
  Target
} from 'lucide-react';
import { cn } from '@/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Company {
  id: string;
  name: string;
  domain: string;
  size: string;
  industry: string;
  location: string;
  funding_stage: string;
  contact_count: number;
  last_contact: string;
  engagement_score: number;
}

interface Contact {
  id: string;
  company_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: 'prospect' | 'engaged' | 'customer' | 'invalid' | 'unsubscribed';
  confidence_score: number;
  last_contact: string;
  company?: Company;
}

interface CRMDashboardProps {
  className?: string;
}

export default function CRMDashboard({ className }: CRMDashboardProps) {
  const { user } = useAuth();
  const { error } = useToast();
  const [activeTab, setActiveTab] = useState<'companies' | 'contacts'>('companies');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    if (user) {
      loadCRMData();
    }
  }, [user]);

  const loadCRMData = async () => {
    try {
      setLoading(true);
      
      // Mock data - would fetch from API
      const mockCompanies: Company[] = [
        {
          id: '1',
          name: 'TechFlow Solutions',
          domain: 'techflow.com',
          size: '50-200',
          industry: 'SaaS',
          location: 'San Francisco, CA',
          funding_stage: 'Series B',
          contact_count: 5,
          last_contact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          engagement_score: 85,
        },
        {
          id: '2',
          name: 'DataCorp Analytics',
          domain: 'datacorp.com',
          size: '200-500',
          industry: 'Data Analytics',
          location: 'New York, NY',
          funding_stage: 'Series A',
          contact_count: 8,
          last_contact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
          engagement_score: 72,
        },
        {
          id: '3',
          name: 'CloudPlatform Inc',
          domain: 'cloudplatform.io',
          size: '500-1000',
          industry: 'Cloud Infrastructure',
          location: 'Seattle, WA',
          funding_stage: 'Series C',
          contact_count: 12,
          last_contact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
          engagement_score: 91,
        },
        {
          id: '4',
          name: 'FinanceFlow Pro',
          domain: 'financeflow.pro',
          size: '20-50',
          industry: 'FinTech',
          location: 'Austin, TX',
          funding_stage: 'Seed',
          contact_count: 3,
          last_contact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
          engagement_score: 68,
        },
        {
          id: '5',
          name: 'GreenTech Innovations',
          domain: 'greentech.io',
          size: '100-200',
          industry: 'CleanTech',
          location: 'Portland, OR',
          funding_stage: 'Series A',
          contact_count: 6,
          last_contact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
          engagement_score: 79,
        },
        {
          id: '6',
          name: 'MediaStream Networks',
          domain: 'mediastream.net',
          size: '1000+',
          industry: 'Media & Entertainment',
          location: 'Los Angeles, CA',
          funding_stage: 'IPO',
          contact_count: 15,
          last_contact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
          engagement_score: 94,
        },
      ];

      const mockContacts: Contact[] = [
        {
          id: '1',
          company_id: '1',
          first_name: 'Sarah',
          last_name: 'Chen',
          email: 'sarah.chen@techflow.com',
          role: 'VP of Engineering',
          status: 'engaged',
          confidence_score: 95,
          last_contact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          company: mockCompanies[0],
        },
        {
          id: '2',
          company_id: '2',
          first_name: 'Mike',
          last_name: 'Johnson',
          email: 'mike.johnson@datacorp.com',
          role: 'CTO',
          status: 'prospect',
          confidence_score: 88,
          last_contact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
          company: mockCompanies[1],
        },
        {
          id: '3',
          company_id: '3',
          first_name: 'Alex',
          last_name: 'Rodriguez',
          email: 'alex.rodriguez@cloudplatform.io',
          role: 'Head of Growth',
          status: 'customer',
          confidence_score: 92,
          last_contact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
          company: mockCompanies[2],
        },
        {
          id: '4',
          company_id: '1',
          first_name: 'David',
          last_name: 'Kim',
          email: 'david.kim@techflow.com',
          role: 'Product Manager',
          status: 'engaged',
          confidence_score: 87,
          last_contact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
          company: mockCompanies[0],
        },
        {
          id: '5',
          company_id: '4',
          first_name: 'Emily',
          last_name: 'Watson',
          email: 'emily.watson@financeflow.pro',
          role: 'CEO',
          status: 'prospect',
          confidence_score: 91,
          last_contact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
          company: mockCompanies[3],
        },
        {
          id: '6',
          company_id: '5',
          first_name: 'James',
          last_name: 'Green',
          email: 'james.green@greentech.io',
          role: 'Head of Operations',
          status: 'engaged',
          confidence_score: 83,
          last_contact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
          company: mockCompanies[4],
        },
        {
          id: '7',
          company_id: '6',
          first_name: 'Lisa',
          last_name: 'Martinez',
          email: 'lisa.martinez@mediastream.net',
          role: 'VP of Technology',
          status: 'customer',
          confidence_score: 96,
          last_contact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
          company: mockCompanies[5],
        },
        {
          id: '8',
          company_id: '2',
          first_name: 'Robert',
          last_name: 'Taylor',
          email: 'robert.taylor@datacorp.com',
          role: 'Data Scientist',
          status: 'prospect',
          confidence_score: 79,
          last_contact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
          company: mockCompanies[1],
        },
        {
          id: '9',
          company_id: '4',
          first_name: 'Maria',
          last_name: 'Lopez',
          email: 'maria.lopez@financeflow.pro',
          role: 'Head of Marketing',
          status: 'engaged',
          confidence_score: 85,
          last_contact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
          company: mockCompanies[3],
        },
        {
          id: '10',
          company_id: '3',
          first_name: 'Kevin',
          last_name: 'Brown',
          email: 'kevin.brown@cloudplatform.io',
          role: 'Solutions Architect',
          status: 'customer',
          confidence_score: 89,
          last_contact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          company: mockCompanies[2],
        },
      ];

      setCompanies(mockCompanies);
      setContacts(mockContacts);
    } catch (err) {
      error('Failed to load CRM data');
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.domain.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      `${contact.first_name} ${contact.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' ||
                         contact.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={cn('h-full flex flex-col p-6 space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-3xl font-bold text-foreground">CRM Intelligence</h1>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'companies' | 'contacts')} className="w-auto">
            <TabsList>
              <TabsTrigger value="companies" className="flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span>Companies ({companies.length})</span>
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Contacts ({contacts.length})</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add {activeTab === 'companies' ? 'Company' : 'Contact'}</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {activeTab === 'contacts' && (
              <div className="flex items-center space-x-2">
                {['all', 'prospect', 'engaged', 'customer'].map((filter) => (
                  <Button
                    key={filter}
                    variant={selectedFilter === filter ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedFilter(filter)}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="companies" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Company
              </Button>
            </div>
            <CompaniesTable companies={filteredCompanies} />
          </TabsContent>
          <TabsContent value="contacts" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
                <Button variant="outline" className="flex items-center space-x-2">
                   <Filter className="h-4 w-4" />
                   <span>Filter: {selectedFilter === 'all' ? 'All Status' : selectedFilter}</span>
                 </Button>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
            <ContactsTable contacts={filteredContacts} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
   );
}

interface CompaniesTableProps {
  companies: Company[];
}

function CompaniesTable({ companies }: CompaniesTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Company
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Industry
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Size
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Contacts
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Engagement
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Last Contact
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company, index) => (
                <tr key={company.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{company.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Globe className="h-3 w-3 mr-1" />
                          {company.domain}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-foreground">{company.industry}</div>
                    <div className="text-sm text-muted-foreground">{company.funding_stage}</div>
                  </td>
                  <td className="p-4 font-medium text-foreground">
                    {company.size}
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary">{company.contact_count}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-foreground">{company.engagement_score}%</span>
                      <Progress value={company.engagement_score} className="w-16" />
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {formatTimeAgo(company.last_contact)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

interface ContactsTableProps {
  contacts: Contact[];
}

function ContactsTable({ contacts }: ContactsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'prospect': return 'secondary';
      case 'engaged': return 'default';
      case 'customer': return 'default';
      case 'invalid': return 'destructive';
      case 'unsubscribed': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Contact
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Company
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Role
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Confidence
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Last Contact
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {contact.first_name[0]}{contact.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">
                          {contact.first_name} {contact.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {contact.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-foreground">{contact.company?.name}</div>
                    <div className="text-sm text-muted-foreground">{contact.company?.domain}</div>
                  </td>
                  <td className="p-4 font-medium text-foreground">
                    {contact.role}
                  </td>
                  <td className="p-4">
                    <Badge variant={getStatusColor(contact.status)}>
                      {contact.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-foreground">{contact.confidence_score}%</span>
                      <Progress value={contact.confidence_score} className="w-16" />
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {formatTimeAgo(contact.last_contact)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-1">
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInDays = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return `${Math.floor(diffInDays / 30)} months ago`;
}