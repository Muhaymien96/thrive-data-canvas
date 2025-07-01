import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface InviteCodeFormProps {
  onInviteAccepted: () => void;
}

export const InviteCodeForm = ({ onInviteAccepted }: InviteCodeFormProps) => {
  const [inviteCode, setInviteCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter an invite code.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Find and validate the invite
      const { data: invite, error: inviteError } = await supabase
        .from('invites')
        .select('*')
        .eq('invite_code', inviteCode.trim())
        .is('used_at', null)
        .single();

      if (inviteError || !invite) {
        throw new Error('Invalid or expired invite code');
      }

      // Check if invite is expired
      if (new Date(invite.expires_at) < new Date()) {
        throw new Error('This invite code has expired');
      }

      // Create organization_user record
      const { error: orgUserError } = await supabase
        .from('organization_users')
        .insert([{
          organization_id: invite.organization_id,
          user_id: user.user.id,
          role: invite.role
        }]);

      if (orgUserError) throw orgUserError;

      // Mark invite as used
      const { error: updateError } = await supabase
        .from('invites')
        .update({
          used_at: new Date().toISOString(),
          used_by: user.user.id
        })
        .eq('id', invite.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "You have successfully joined the organization!",
      });

      onInviteAccepted();
    } catch (error: any) {
      console.error('Error processing invite:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process invite code. Please try again.",
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
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Enter Invite Code</CardTitle>
          <p className="text-sm text-slate-600 mt-2">
            Enter the invite code you received to join an organization
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inviteCode">Invite Code *</Label>
              <Input
                id="inviteCode"
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="Enter your invite code"
                className="text-center tracking-widest uppercase"
                maxLength={8}
                required
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
                  Verifying...
                </>
              ) : (
                <>
                  Join Organization
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 