import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Mail, User, MessageSquare, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import type { Business } from '@/types/database';

interface BusinessAccessRequestProps {
  business: Business;
  onBack: () => void;
  onRequestSubmitted: () => void;
}

export const BusinessAccessRequest = ({ business, onBack, onRequestSubmitted }: BusinessAccessRequestProps) => {
  const { user, requestBusinessAccess } = useAuth();
  const [formData, setFormData] = useState({
    requesterName: user?.user_metadata?.full_name || '',
    requesterEmail: user?.email || '',
    requesterMessage: '',
    requestedRole: 'employee'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.requesterName.trim() || !formData.requesterEmail.trim()) {
      toast({
        title: "Error",
        description: "Please fill in your name and email.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await requestBusinessAccess(business.id, formData);
      
      toast({
        title: "Request Submitted",
        description: "Your access request has been sent to the business owner. You'll be notified when it's approved.",
      });
      onRequestSubmitted();
    } catch (error: any) {
      console.error('Error submitting access request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit access request. Please try again.",
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
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4 mx-auto">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Request Access</CardTitle>
            <p className="text-sm text-slate-600">
              Request access to <strong>{business.name}</strong>
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requesterName">Your Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="requesterName"
                    type="text"
                    value={formData.requesterName}
                    onChange={(e) => handleInputChange('requesterName', e.target.value)}
                    placeholder="Enter your full name"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="requesterEmail">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="requesterEmail"
                    type="email"
                    value={formData.requesterEmail}
                    onChange={(e) => handleInputChange('requesterEmail', e.target.value)}
                    placeholder="Enter your email address"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="requestedRole">Requested Role</Label>
                <Select
                  value={formData.requestedRole}
                  onValueChange={(value) => handleInputChange('requestedRole', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="requesterMessage">Message (Optional)</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Textarea
                    id="requesterMessage"
                    value={formData.requesterMessage}
                    onChange={(e) => handleInputChange('requesterMessage', e.target.value)}
                    placeholder="Tell the business owner why you need access..."
                    className="pl-10"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 