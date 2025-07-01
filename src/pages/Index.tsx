import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { AdminDashboard } from '@/components/AdminDashboard';
import { BusinessSelector } from '@/components/business/BusinessSelector';
import { UserRoleSelector } from '@/components/auth/UserRoleSelector';
import { OrganizationForm } from '@/components/business/OrganizationForm';
import { OrganizationSelector } from '@/components/business/OrganizationSelector';
import { InviteCodeForm } from '@/components/business/InviteCodeForm';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import type { Business, Organization } from '@/types/database';

type OnboardingStep = 'role_select' | 'create_org' | 'enter_invite' | 'select_organization' | 'select_business';

const Index = () => {
  const { 
    user, 
    isLoading, 
    accessibleBusinesses, 
    currentBusinessUser,
    currentOrganization,
    organizationUsers
  } = useAuth();
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('role_select');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Function to refresh organization data
  const refreshOrganizationData = async () => {
    if (!user) return;
    
    setIsRefreshing(true);
    try {
      // Force reload the page to refresh all auth state
      window.location.reload();
    } catch (error) {
      console.error('Error refreshing organization data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Debug logging
  console.log('Index component state:', {
    user: user?.email,
    isLoading,
    accessibleBusinessesCount: accessibleBusinesses.length,
    selectedBusiness: selectedBusiness?.name,
    currentBusinessUser: currentBusinessUser?.business_id,
    currentOrganization: currentOrganization?.name,
    currentOrganizationOwnerId: currentOrganization?.owner_id,
    organizationUsersCount: organizationUsers.length,
    onboardingStep,
    shouldShowOnboarding: !currentOrganization && organizationUsers.length === 0,
    organizationUsers: organizationUsers.map(ou => ({ role: ou.role, org_id: ou.organization_id }))
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  // If user has organization but no business selected, show business selector
  if (currentOrganization && !selectedBusiness) {
    return (
      <BusinessSelector 
        onBusinessSelected={(business) => {
          console.log('Business selected:', business.name);
          setSelectedBusiness(business);
        }}
      />
    );
  }

  // If user is authenticated but not part of any organization, show onboarding flow
  if (!currentOrganization && organizationUsers.length === 0) {
    switch (onboardingStep) {
      case 'role_select':
        return (
          <div>
            <UserRoleSelector 
              onRoleSelect={(role) => {
                if (role === 'owner') {
                  console.log('User selected owner role, moving to organization selection');
                  setOnboardingStep('select_organization');
                } else {
                  console.log('User selected non-owner role, moving to enter_invite step');
                  setOnboardingStep('enter_invite');
                }
              }}
            />
            {/* Add refresh option at the bottom */}
            <div className="fixed bottom-4 right-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshOrganizationData}
                disabled={isRefreshing}
                className="text-slate-500 hover:text-slate-700"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh State'}
              </Button>
            </div>
          </div>
        );
      
      case 'select_organization':
        return (
          <OrganizationSelector 
            onOrganizationSelected={(organization: Organization) => {
              console.log('Organization selected:', organization);
              setOnboardingStep('select_business');
            }}
          />
        );
      
      case 'create_org':
        return (
          <OrganizationForm 
            onOrganizationCreated={(organization: Organization) => {
              console.log('Organization created callback triggered:', organization);
              // Only proceed if we have a valid organization
              if (organization && organization.id) {
                console.log('Valid organization received, moving to select_business step');
                setOnboardingStep('select_business');
                // Force a small delay to ensure state updates
                setTimeout(() => {
                  console.log('Current organization after creation:', currentOrganization);
                  console.log('Organization users after creation:', organizationUsers);
                }, 500);
              } else {
                console.error('Organization creation callback received invalid data:', organization);
              }
            }}
            onSkip={() => {
              console.log('User chose to skip organization creation, moving to organization selection');
              setOnboardingStep('select_organization');
            }}
          />
        );
      
      case 'enter_invite':
        return (
          <InviteCodeForm 
            onInviteAccepted={() => {
              console.log('Invite accepted, moving to select_business step');
              setOnboardingStep('select_business');
            }}
          />
        );
      
      case 'select_business':
      default:
        console.log('Rendering BusinessSelector with currentOrganization:', currentOrganization);
        return (
          <BusinessSelector 
            onBusinessSelected={(business) => {
              console.log('Business selected:', business.name);
              setSelectedBusiness(business);
            }}
          />
        );
    }
  }

  // If user is authenticated but no business is selected, show business selector
  if (!selectedBusiness) {
    return (
      <BusinessSelector 
        onBusinessSelected={(business) => {
          console.log('Business selected:', business.name);
          setSelectedBusiness(business);
        }}
      />
    );
  }

  // If business is selected, show the dashboard
  return <AdminDashboard selectedBusiness={selectedBusiness} />;
};

export default Index;
