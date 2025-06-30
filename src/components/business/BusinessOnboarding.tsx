
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Plus } from 'lucide-react';
import { useCreateBusiness } from '@/hooks/useSupabaseData';
import { toast } from '@/hooks/use-toast';

interface BusinessOnboardingProps {
  onBusinessCreated: () => void;
}

export const BusinessOnboarding = ({ onBusinessCreated }: BusinessOnboardingProps) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createBusinessMutation = useCreateBusiness();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.type.trim()) {
      toast({
        title: "Error",
        description: "Please fill in the business name and type.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createBusinessMutation.mutateAsync(formData);
      toast({
        title: "Success",
        description: "Your business has been created successfully!",
      });
      onBusinessCreated();
    } catch (error) {
      console.error('Error creating business:', error);
      toast({
        title: "Error",
        description: "Failed to create business. Please try again.",
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
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Welcome to VentureHub</CardTitle>
          <p className="text-sm text-slate-600 mt-2">
            Let's get started by creating your first business
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
              <Input
                id="type"
                type="text"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                placeholder="e.g., Retail, Restaurant, Services"
                required
              />
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
