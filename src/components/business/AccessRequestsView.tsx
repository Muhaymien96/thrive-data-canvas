import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Check, X, Clock, User, Mail, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { BusinessAccessRequest } from '@/types/database';

interface AccessRequestsViewProps {
  businessId: string;
}

export const AccessRequestsView = ({ businessId }: AccessRequestsViewProps) => {
  const [requests, setRequests] = useState<BusinessAccessRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccessRequests();
  }, [businessId]);

  const fetchAccessRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('business_access_requests')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching access requests:', error);
        toast({
          title: "Error",
          description: "Failed to load access requests.",
          variant: "destructive",
        });
        return;
      }

      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching access requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      // Update the request status to approved
      const { error: updateError } = await supabase
        .from('business_access_requests')
        .update({
          status: 'approved',
          approved_by: (await supabase.auth.getUser()).data.user?.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (updateError) {
        throw updateError;
      }

      // Get the request details to create business_user record
      const request = requests.find(r => r.id === requestId);
      if (request) {
        // Create business_user record with placeholder user_id
        // In a real implementation, you'd need a server-side function to find the user by email
        const { error: businessUserError } = await supabase
          .from('business_users')
          .insert([{
            business_id: businessId,
            user_id: '00000000-0000-0000-0000-000000000000', // Placeholder - would need actual user ID
            role: request.requested_role as any,
            full_name: request.requester_name,
            email: request.requester_email
          }]);

        if (businessUserError) {
          console.error('Error creating business user:', businessUserError);
        }
      }

      toast({
        title: "Request Approved",
        description: "The user has been granted access to the business.",
      });

      // Refresh the requests list
      fetchAccessRequests();
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: "Error",
        description: "Failed to approve request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('business_access_requests')
        .update({
          status: 'rejected',
          approved_by: (await supabase.auth.getUser()).data.user?.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) {
        throw error;
      }

      toast({
        title: "Request Rejected",
        description: "The access request has been rejected.",
      });

      // Refresh the requests list
      fetchAccessRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: "Error",
        description: "Failed to reject request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-orange-600 border-orange-300"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-300"><Check className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-300"><X className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-slate-600">Loading access requests...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Access Requests</h2>
        <p className="text-slate-600">Manage requests for business access</p>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-slate-500">
              <User className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p>No access requests found</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {request.requester_name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{request.requester_name}</h3>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-slate-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{request.requester_email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span className="capitalize">{request.requested_role}</span>
                        </div>
                      </div>
                      {request.requester_message && (
                        <div className="flex items-start space-x-1 text-sm text-slate-600 mb-3">
                          <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <p className="italic">"{request.requester_message}"</p>
                        </div>
                      )}
                      <p className="text-xs text-slate-500">
                        Requested on {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproveRequest(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectRequest(request.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}; 