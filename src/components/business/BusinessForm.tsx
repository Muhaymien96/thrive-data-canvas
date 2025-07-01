import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Plus, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import type { Business } from '@/types/database';

interface BusinessFormProps {
  onBusinessCreated: (business: Business) => void;
  onCancel?: () => void;
}

const businessTypes = [
  'Agriculture',
  'Food & Beverage', 
  'Technology',
  'Manufacturing',
  'Retail',
  'Services',
  'Healthcare',
  'Education',
  'Finance',
  'Real Estate',
  'Transportation',
  'Other'
];

export const BusinessForm = ({ onBusinessCreated, onCancel }: BusinessFormProps) => {
  const { createBusiness, currentOrganization } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('BusinessForm: Form submitted with data:', formData);
    console.log('BusinessForm: Current organization:', currentOrganization);
    
    if (!formData.name.trim() || !formData.type.trim()) {
      toast({
        title: "Error",
        description: "Please fill in the business name and type.",
        variant: "destructive",
      });
      return;
    }

    if (!currentOrganization) {
      toast({
        title: "Error",
        description: "No organization selected. Please create or join an organization first.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Create a timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Business creation timed out after 30 seconds')), 30000);
    });
    
    try {
      console.log('BusinessForm: Starting business creation...');
      
      const result = await Promise.race([
        createBusiness({
          ...formData,
          organization_id: currentOrganization.id
        }),
        timeoutPromise
      ]) as { business: Business; businessUser: any };
      
      console.log('BusinessForm: Business creation successful:', result);
      
      toast({
        title: "Success",
        description: "Your business has been created successfully!",
      });

      onBusinessCreated(result.business);
    } catch (error) {
      console.error('BusinessForm: Error creating business:', error);
      
      let errorMessage = "Failed to create business. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          errorMessage = "Business creation is taking too long. Please check your connection and try again.";
        } else if (error.message.includes('permission')) {
          errorMessage = "You don't have permission to create businesses in this organization.";
        } else {
          errorMessage = `Failed to create business: ${error.message}`;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="absolute top-4 left-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Create Your Business</CardTitle>
          <p className="text-sm text-slate-600 mt-2">
            Let's set up your business profile to get started
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your business name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Business Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of your business"
                rows={3}
              />
            </div>
            
            <Button
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating Business...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Business
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
