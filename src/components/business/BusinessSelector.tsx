import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Users, Crown, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { BusinessForm } from './BusinessForm';
import { BusinessAccessRequest } from './BusinessAccessRequest';
import type { Business } from '@/types/database';

interface BusinessSelectorProps {
  onBusinessSelected: (business: Business) => void;
}

export const BusinessSelector = ({ onBusinessSelected }: BusinessSelectorProps) => {
  const { 
    accessibleBusinesses, 
    businessUsers, 
    currentOrganization,
    organizationUsers,
    user
  } = useAuth();
  const [showBusinessForm, setShowBusinessForm] = React.useState(false);
  const [showAccessRequest, setShowAccessRequest] = React.useState(false);
  const [selectedBusinessForAccess, setSelectedBusinessForAccess] = React.useState<Business | null>(null);

  // Debug logging
  console.log('BusinessSelector state:', {
    accessibleBusinessesCount: accessibleBusinesses.length,
    businessUsersCount: businessUsers.length,
    accessibleBusinesses: accessibleBusinesses.map(b => ({ id: b.id, name: b.name })),
    businessUsers: businessUsers.map(bu => ({ business_id: bu.business_id, role: bu.role })),
    currentOrganization: currentOrganization?.name,
    organizationUsersCount: organizationUsers.length,
    currentOrganizationOwnerId: currentOrganization?.owner_id,
    currentUserId: user?.id
  });

  const handleBusinessSelect = (business: Business) => {
    console.log('Attempting to select business:', business.name, business.id);
    
    // Check if user has access to this business by looking through businessUsers
    const hasAccess = businessUsers.some(bu => bu.business_id === business.id);
    
    console.log('Has access:', hasAccess, 'Business users:', businessUsers.map(bu => bu.business_id));
    
    if (hasAccess) {
      console.log('Calling onBusinessSelected for:', business.name);
      onBusinessSelected(business);
    } else {
      console.log('User does not have access, showing access request form');
      setSelectedBusinessForAccess(business);
      setShowAccessRequest(true);
    }
  };

  // Check if user can create businesses in the current organization
  // More resilient check: if user is the owner of the organization OR has admin/owner role in organization_users
  const canCreateBusiness = currentOrganization && (
    // Direct owner check
    currentOrganization.owner_id === user?.id ||
    // Role-based check
    organizationUsers.some(
      ou => ou.organization_id === currentOrganization.id && ['owner', 'admin'].includes(ou.role)
    )
  );

  console.log('Can create business:', canCreateBusiness, {
    hasCurrentOrg: Boolean(currentOrganization),
    isDirectOwner: currentOrganization?.owner_id === user?.id,
    hasOwnerRole: organizationUsers.some(ou => ou.organization_id === currentOrganization?.id && ['owner', 'admin'].includes(ou.role))
  });

  if (showBusinessForm) {
    return (
      <BusinessForm 
        onBusinessCreated={(business) => {
          console.log('Business created:', business.name);
          setShowBusinessForm(false);
          onBusinessSelected(business);
        }}
        onCancel={() => setShowBusinessForm(false)}
      />
    );
  }

  if (showAccessRequest && selectedBusinessForAccess) {
    return (
      <BusinessAccessRequest 
        business={selectedBusinessForAccess}
        onBack={() => {
          setShowAccessRequest(false);
          setSelectedBusinessForAccess(null);
        }}
        onRequestSubmitted={() => {
          setShowAccessRequest(false);
          setSelectedBusinessForAccess(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to VentureHub</h1>
          <p className="text-slate-600">
            {currentOrganization ? (
              <>
                Select a business in <strong>{currentOrganization.name}</strong> or create a new one
              </>
            ) : (
              'Select a business to continue'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Business Card */}
          {canCreateBusiness && (
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-dashed border-2 border-slate-300 hover:border-blue-400"
              onClick={() => setShowBusinessForm(true)}
            >
              <CardContent className="flex flex-col items-center justify-center h-48 p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Create New Business</h3>
                <p className="text-sm text-slate-600 text-center">
                  Start managing a new business operation
                </p>
              </CardContent>
            </Card>
          )}

          {/* Show message if no create option and no businesses */}
          {!canCreateBusiness && accessibleBusinesses.length === 0 && currentOrganization && (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center h-48 p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mb-4">
                  <Building2 className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Setting Up Your Organization</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Your organization <strong>{currentOrganization.name}</strong> is being set up. 
                  {currentOrganization.owner_id === user?.id && (
                    <span> As the owner, you should be able to create businesses shortly.</span>
                  )}
                </p>
                <Button 
                  onClick={() => setShowBusinessForm(true)}
                  variant="outline"
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Try Creating Business
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Existing Businesses */}
          {accessibleBusinesses.map((business) => {
            const hasAccess = businessUsers.some(bu => bu.business_id === business.id);
            const businessUser = businessUsers.find(bu => bu.business_id === business.id);
            
            return (
              <Card 
                key={business.id}
                className={`cursor-pointer hover:shadow-lg transition-shadow ${!hasAccess ? 'border-orange-200 bg-orange-50' : ''}`}
                onClick={() => handleBusinessSelect(business)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {hasAccess ? (
                        <Building2 className="h-5 w-5 text-slate-600" />
                      ) : (
                        <Lock className="h-5 w-5 text-orange-600" />
                      )}
                      <CardTitle className="text-lg">{business.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {business.type}
                      </Badge>
                      {!hasAccess && (
                        <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                          Request Access
                        </Badge>
                      )}
                    </div>
                  </div>
                  {hasAccess && businessUser && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {businessUser.role === 'owner' ? (
                          <Crown className="h-3 w-3 mr-1" />
                        ) : (
                          <Users className="h-3 w-3 mr-1" />
                        )}
                        {businessUser.role}
                      </Badge>
                    </div>
                  )}
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 