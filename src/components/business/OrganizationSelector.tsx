import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Crown, Users, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { OrganizationForm } from './OrganizationForm';
import type { Organization } from '@/types/database';

interface OrganizationSelectorProps {
  onOrganizationSelected: (organization: Organization) => void;
}

interface OrganizationWithRole extends Organization {
  userRole?: string;
}

export const OrganizationSelector = ({ onOrganizationSelected }: OrganizationSelectorProps) => {
  const { user, setCurrentOrganization } = useAuth();
  const [organizations, setOrganizations] = useState<OrganizationWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Debug utility function
  const debugOrganizations = async () => {
    if (!user) {
      console.log('No user available for debugging');
      return;
    }

    console.log('=== COMPREHENSIVE DEBUG: Organization Query Test ===');
    console.log('User ID:', user.id);

    try {
      // 1. Test auth state
      const { data: { user: authUser } } = await supabase.auth.getUser();
      console.log('Auth user:', authUser?.id);
      console.log('Auth user matches:', authUser?.id === user.id);

      // 2. Test MCP Server endpoints (bypass RLS)
      console.log('\n=== MCP SERVER QUERIES (NO RLS) ===');
      
      try {
        const mcpOrgsResponse = await fetch('http://localhost:3100/organizations');
        const mcpOrgsData = await mcpOrgsResponse.json();
        console.log('MCP Organizations:', mcpOrgsData);
        
        const mcpOrgUsersResponse = await fetch('http://localhost:3100/organization-users');
        const mcpOrgUsersData = await mcpOrgUsersResponse.json();
        console.log('MCP Organization Users:', mcpOrgUsersData);
        
        // Filter MCP data for current user
        const userOrgs = mcpOrgsData.organizations?.filter(org => org.owner_id === user.id) || [];
        const userOrgUsers = mcpOrgUsersData.organization_users?.filter(ou => ou.user_id === user.id) || [];
        
        console.log('USER SPECIFIC DATA:');
        console.log('- Organizations owned by user:', userOrgs);
        console.log('- Organization users for user:', userOrgUsers);
        
      } catch (mcpError) {
        console.error('MCP Server error:', mcpError);
        console.log('Make sure MCP server is running on http://localhost:3100');
      }

      // 3. Test direct Supabase queries (with RLS)
      console.log('\n=== SUPABASE QUERIES (WITH RLS) ===');
      
      const { data: directOrgs, error: directError } = await supabase
        .from('organizations')
        .select('*')
        .eq('owner_id', user.id);
      console.log('Direct orgs result:', { directOrgs, directError, count: directOrgs?.length || 0 });

      const { data: orgUsers, error: orgUsersError } = await supabase
        .from('organization_users')
        .select('*, organizations(*)')
        .eq('user_id', user.id);
      console.log('Org users result:', { orgUsers, orgUsersError, count: orgUsers?.length || 0 });

      // 4. Test unfiltered queries (shows if RLS is blocking everything)
      console.log('\n=== UNFILTERED QUERIES (RLS TEST) ===');
      
      const { data: allOrgs, error: allOrgsError } = await supabase
        .from('organizations')
        .select('*');
      console.log('All orgs result:', { count: allOrgs?.length || 0, error: allOrgsError });

      const { data: allOrgUsers, error: allOrgUsersError } = await supabase
        .from('organization_users')
        .select('*');
      console.log('All org users result:', { count: allOrgUsers?.length || 0, error: allOrgUsersError });

    } catch (error) {
      console.error('Debug error:', error);
    }
  };

  // Expose debug function to window for manual testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).debugOrganizations = debugOrganizations;
      console.log('Debug function exposed: window.debugOrganizations()');
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      console.log('OrganizationSelector: User detected, fetching organizations for:', user.id);
      fetchUserOrganizations();
      
      // Set a timeout to stop loading after 5 seconds
      const timeout = setTimeout(() => {
        console.log('Loading timeout reached after 5 seconds, stopping loading state');
        setLoadingTimeout(true);
        setIsLoading(false);
      }, 5000);

      return () => clearTimeout(timeout);
    } else {
      console.log('OrganizationSelector: No user detected');
      setIsLoading(false);
    }
  }, [user]);

  const fetchUserOrganizations = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      console.log('Fetching via MCP server...');
      
      // Query MCP server (bypasses RLS)
      const orgsResponse = await fetch('http://localhost:3100/organizations');
      const orgsData = await orgsResponse.json();
      
      const orgUsersResponse = await fetch('http://localhost:3100/organization-users');
      const orgUsersData = await orgUsersResponse.json();
      
      // Filter for current user
      const userOrgs = orgsData.organizations?.filter(org => org.owner_id === user.id) || [];
      const userOrgUsers = orgUsersData.organization_users?.filter(ou => ou.user_id === user.id) || [];
      
      // Combine data
      const allOrgs: OrganizationWithRole[] = [];
      
      // Add owned organizations
      userOrgs.forEach(org => {
        allOrgs.push({ ...org, userRole: 'owner' });
      });
      
      // Add member organizations (if not already included)
      for (const orgUser of userOrgUsers) {
        const orgResponse = await fetch(`http://localhost:3100/organizations/${orgUser.organization_id}`);
        const orgData = await orgResponse.json();
        
        if (orgData.organization && !allOrgs.find(o => o.id === orgData.organization.id)) {
          allOrgs.push({ ...orgData.organization, userRole: orgUser.role });
        }
      }
      
      console.log('Organizations found via MCP:', allOrgs);
      setOrganizations(allOrgs);
      
    } catch (error) {
      console.error('MCP fetch error:', error);
      setOrganizations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrganizationSelect = async (organization: OrganizationWithRole) => {
    console.log('Organization selected:', organization);
    await setCurrentOrganization(organization);
    onOrganizationSelected(organization);
  };

  if (showCreateForm) {
    return (
      <OrganizationForm 
        onOrganizationCreated={async (organization) => {
          console.log('New organization created:', organization);
          setShowCreateForm(false);
          await setCurrentOrganization(organization);
          onOrganizationSelected(organization);
        }}
        onSkip={() => setShowCreateForm(false)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your organizations...</p>
          <div className="mt-4 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                console.log('User clicked skip loading, proceeding to create organization');
                setShowCreateForm(true);
              }}
              className="text-slate-500 hover:text-slate-700 block mx-auto"
            >
              Skip and Create New Organization
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log('Manual fetch triggered by user');
                fetchUserOrganizations();
              }}
              className="block mx-auto"
            >
              Retry Fetch Organizations
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={debugOrganizations}
              className="text-blue-600 hover:text-blue-800 block mx-auto"
            >
              Debug Queries (Check Console)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Select Your Organization</h1>
          <p className="text-slate-600">
            Choose an organization to manage businesses, or create a new one
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Organization Card */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-dashed border-2 border-slate-300 hover:border-blue-400"
            onClick={() => setShowCreateForm(true)}
          >
            <CardContent className="flex flex-col items-center justify-center h-48 p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Create New Organization</h3>
              <p className="text-sm text-slate-600 text-center">
                Set up a new organization to manage businesses
              </p>
            </CardContent>
          </Card>

          {/* Existing Organizations */}
          {organizations.map((organization) => (
            <Card 
              key={organization.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleOrganizationSelect(organization)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-slate-600" />
                    <CardTitle className="text-lg">{organization.name}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs capitalize">
                      {organization.userRole === 'owner' ? (
                        <Crown className="h-3 w-3 mr-1" />
                      ) : (
                        <Users className="h-3 w-3 mr-1" />
                      )}
                      {organization.userRole}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-slate-600">
                  Created {new Date(organization.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}

          {/* Show message if no organizations found */}
          {organizations.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center h-48 p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mb-4">
                  <Building2 className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {loadingTimeout ? 'Loading Issues Detected' : 'No Organizations Found'}
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  {loadingTimeout 
                    ? 'We had trouble loading your organizations. You can create a new one or try refreshing.'
                    : 'You don\'t have access to any organizations yet. Create your first organization to get started.'
                  }
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Organization
                  </Button>
                  {loadingTimeout && (
                    <Button 
                      onClick={() => {
                        console.log('User clicked refresh, reloading organizations');
                        setLoadingTimeout(false);
                        setIsLoading(true);
                        fetchUserOrganizations();
                      }}
                      variant="ghost"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}; 