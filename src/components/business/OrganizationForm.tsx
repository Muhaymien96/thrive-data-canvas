import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Plus, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Organization } from '@/types/database';

interface OrganizationFormProps {
  onOrganizationCreated: (organization: Organization) => void;
  onSkip?: () => void;
}

export const OrganizationForm = ({ onOrganizationCreated, onSkip }: OrganizationFormProps) => {
  const { createOrganization, user } = useAuth();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Organization form submitted with name:', name);
    console.log('Current user:', user);
    
    if (!name.trim()) {
      console.log('Organization name is empty');
      toast({
        title: "Error",
        description: "Please enter an organization name.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    console.log('Starting organization creation...');
    
    try {
      if (!user) {
        throw new Error('User is not authenticated');
      }

      console.log('Calling createOrganization with name:', name.trim());
      const organization = await createOrganization(name.trim());
      console.log('Organization created successfully:', organization);

      toast({
        title: "Success",
        description: "Your organization has been created successfully!",
      });

      console.log('Calling onOrganizationCreated callback with:', organization);
      onOrganizationCreated(organization);
    } catch (error) {
      console.error('Detailed error creating organization:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined,
        user: user?.id,
        organizationName: name.trim()
      });
      
      toast({
        title: "Error",
        description: error instanceof Error 
          ? `Failed to create organization: ${error.message}`
          : "Failed to create organization. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Create Your Organization</CardTitle>
          <p className="text-sm text-slate-600 mt-2">
            Set up your organization to start managing your businesses
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  console.log('Organization name changed:', e.target.value);
                  setName(e.target.value);
                }}
                placeholder="Enter your organization name"
                required
              />
            </div>
            
            <Button
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
              onClick={() => console.log('Create organization button clicked')}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating Organization...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Organization
                </>
              )}
            </Button>

            {onSkip && (
              <div className="text-center mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-3">
                  Already have an organization? If the system isn't detecting it properly:
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onSkip}
                  className="text-slate-600 hover:text-slate-900"
                >
                  Skip to Business Selection
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 