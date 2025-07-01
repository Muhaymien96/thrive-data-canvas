import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Plus } from 'lucide-react';
import { BusinessOnboarding } from '@/components/business/BusinessOnboarding';
import { useAuth } from '@/contexts/AuthContext';
import type { Business } from '@/types/database';

interface WelcomeDashboardProps {
  onBusinessCreated?: (business: Business) => void;
}

export const WelcomeDashboard = ({ onBusinessCreated }: WelcomeDashboardProps) => {
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const { createBusiness } = useAuth();

  const handleBusinessCreated = async (businessData: { name: string; type: string; description?: string }) => {
    try {
      const result = await createBusiness(businessData);
      setShowBusinessForm(false);
      
      // If a business was created and we have an onBusinessCreated callback, call it
      if (result?.business && onBusinessCreated) {
        onBusinessCreated(result.business);
      }
    } catch (error) {
      console.error('Error creating business:', error);
    }
  };

  if (showBusinessForm) {
    return (
      <BusinessOnboarding 
        onBusinessCreated={handleBusinessCreated}
        onCancel={() => setShowBusinessForm(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Welcome to VentureHub</CardTitle>
          <p className="text-sm text-slate-600 mt-2">
            Get started by creating your first business
          </p>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => setShowBusinessForm(true)}
            className="w-full flex items-center justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Business
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}; 