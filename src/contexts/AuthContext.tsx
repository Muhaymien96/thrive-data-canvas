import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { AuthContext } from '@/types/auth';
import type { BusinessUser, Business } from '@/types/database';
import type { Organization, OrganizationUser } from '@/types/database';
import type { Invite } from '@/types/database';

const AuthContextObj = createContext<AuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [businessUsers, setBusinessUsers] = useState<BusinessUser[]>([]);
  const [currentBusinessUser, setCurrentBusinessUser] = useState<BusinessUser | null>(null);
  const [accessibleBusinesses, setAccessibleBusinesses] = useState<Business[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  
  // Custom setter for current organization that also refreshes related data
  const setCurrentOrganizationWithRefresh = async (organization: Organization | null) => {
    console.log('Setting current organization with refresh:', organization?.name);
    setCurrentOrganization(organization);
    
    if (organization && user) {
      // Refresh organization users when organization is set
      await fetchUserOrganizations(user.id);
      await fetchUserBusinesses(user.id);
    }
  };
  const [organizationUsers, setOrganizationUsers] = useState<OrganizationUser[]>([]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        if (session?.user) {
          await fetchUserOrganizations(session.user.id);
          await fetchUserBusinesses(session.user.id);
        } else {
          setBusinessUsers([]);
          setCurrentBusinessUser(null);
          setAccessibleBusinesses([]);
          setCurrentOrganization(null);
          setOrganizationUsers([]);
        }

        // Show toast notifications for auth events
        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have been successfully signed out.",
          });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      if (session?.user) {
        fetchUserOrganizations(session.user.id);
        fetchUserBusinesses(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserOrganizations = async (userId: string) => {
    try {
      console.log('AuthContext: Fetching organizations for user:', userId);
      
      // Check current auth state
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      console.log('AuthContext: Current authenticated user:', currentUser?.id);
      
      // First try to fetch via organization_users (this works better with RLS)
      const { data: orgUsersData, error: orgUsersError } = await supabase
        .from('organization_users')
        .select(`
          *,
          organizations (*)
        `)
        .eq('user_id', userId);

      if (orgUsersError) {
        console.error('AuthContext: Error fetching organization users:', orgUsersError);
        
        // Fallback: Try direct organizations query
        const { data: directOrgs, error: directError } = await supabase
          .from('organizations')
          .select('*')
          .eq('owner_id', userId);

        if (directError) {
          console.error('AuthContext: Error with direct organizations query:', directError);
          return;
        }

        if (directOrgs && directOrgs.length > 0) {
          console.log('AuthContext: Found organizations via direct query:', directOrgs);
          // Create fake organization_users structure for consistency
          const fakeOrgUsers = directOrgs.map(org => ({
            id: crypto.randomUUID(),
            organization_id: org.id,
            user_id: userId,
            role: 'owner',
            created_at: org.created_at,
            updated_at: org.updated_at,
            organizations: org
          }));
          setOrganizationUsers(fakeOrgUsers);
          
          if (!currentOrganization) {
            setCurrentOrganization(directOrgs[0]);
          }
        }
        return;
      }

      console.log('AuthContext: Found organization users data:', orgUsersData);
      setOrganizationUsers(orgUsersData || []);
      
      // Set current organization if not already set
      if (!currentOrganization && orgUsersData && orgUsersData.length > 0) {
        setCurrentOrganization(orgUsersData[0].organizations);
      }
    } catch (error) {
      console.error('AuthContext: Error in fetchUserOrganizations:', error);
    }
  };

  const createOrganization = async (name: string) => {
    console.log('createOrganization called with name:', name);
    console.log('Current user state:', user);
    
    if (!user) {
      console.error('createOrganization failed: User not authenticated');
      throw new Error('Not authenticated');
    }

    try {
      console.log('Making request to create organization...');
      // Call the MCP server endpoint
      const response = await fetch('http://localhost:8080/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          owner_id: user.id
        })
      });

      console.log('Got response:', response.status);
      let data;
      try {
        const text = await response.text();
        console.log('Response text:', text);
        data = text ? JSON.parse(text) : null;
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        // If MCP server fails, fallback to direct Supabase creation
        console.log('MCP server failed, trying direct Supabase creation...');
        
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .insert([{
            name: name.trim(),
            owner_id: user.id
          }])
          .select()
          .single();

        if (orgError) {
          console.error('Supabase organization creation failed:', orgError);
          throw new Error(orgError.message || 'Failed to create organization');
        }

        // Create organization_user record
        const { error: orgUserError } = await supabase
          .from('organization_users')
          .insert([{
            organization_id: orgData.id,
            user_id: user.id,
            role: 'owner'
          }]);

        if (orgUserError) {
          console.error('Failed to create organization_user record:', orgUserError);
          throw new Error('Failed to set up organization permissions');
        }

        data = { organization: orgData };
      }

      if (!data?.organization) {
        console.error('Invalid response data:', data);
        throw new Error('Invalid response data from server');
      }

      console.log('Organization created:', data.organization);

      // Set the current organization
      console.log('Setting current organization...');
      setCurrentOrganization(data.organization);

      // Create the organization user record in state immediately
      const newOrgUser = {
        id: crypto.randomUUID(),
        organization_id: data.organization.id,
        user_id: user.id,
        role: 'owner' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        organizations: data.organization
      };
      
      setOrganizationUsers([newOrgUser]);

      // Refresh organization data in the background
      console.log('Refreshing organization data...');
      setTimeout(async () => {
        await fetchUserOrganizations(user.id);
      }, 100);

      return data.organization;
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  };

  const inviteToOrganization = async (email: string, role: 'admin' | 'employee') => {
    if (!user || !currentOrganization) throw new Error('Not authenticated or no organization selected');

    // Generate invite code
    const { data: inviteCode, error: codeError } = await supabase.rpc('generate_invite_code');
    if (codeError) throw codeError;

    // Create invite record
    const { data: invite, error: inviteError } = await supabase
      .from('invites')
      .insert({
        organization_id: currentOrganization.id,
        email: email.toLowerCase(),
        role,
        invite_code: inviteCode,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        created_by: user.id
      })
      .select()
      .single();

    if (inviteError) throw inviteError;

    // TODO: Send email via Resend
    // This would be implemented in a server-side function

    return invite;
  };

  const validateInviteCode = async (inviteCode: string) => {
    const { data: invite, error } = await supabase
      .from('invites')
      .select('*')
      .eq('invite_code', inviteCode.trim())
      .is('used_at', null)
      .single();

    if (error || !invite) {
      throw new Error('Invalid or expired invite code');
    }

    if (new Date(invite.expires_at) < new Date()) {
      throw new Error('This invite code has expired');
    }

    return invite;
  };

  const acceptInvite = async (invite: Invite) => {
    if (!user) throw new Error('Not authenticated');

    // Create organization_user record
    const { error: orgUserError } = await supabase
      .from('organization_users')
      .insert([{
        organization_id: invite.organization_id,
        user_id: user.id,
        role: invite.role
      }]);

    if (orgUserError) throw orgUserError;

    // Mark invite as used
    const { error: updateError } = await supabase
      .from('invites')
      .update({
        used_at: new Date().toISOString(),
        used_by: user.id
      })
      .eq('id', invite.id);

    if (updateError) throw updateError;

    // Refresh organization data
    await fetchUserOrganizations(user.id);
  };

  const fetchUserBusinesses = async (userId: string) => {
    try {
      // Fetch business_users with business details
      const { data: businessUsersData, error: businessUsersError } = await supabase
        .from('business_users')
        .select(`
          *,
          businesses (
            id,
            name,
            type,
            description,
            owner_id,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', userId);

      if (businessUsersError) {
        console.error('Error fetching business users:', businessUsersError);
        return;
      }

      // Also fetch businesses where user is owner
      const { data: ownedBusinesses, error: ownedError } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', userId);

      if (ownedError) {
        console.error('Error fetching owned businesses:', ownedError);
        return;
      }

      // Combine and deduplicate businesses
      const businessUsersWithBusinesses = businessUsersData || [];
      
      // Add business_user records for owned businesses if they don't exist
      for (const business of ownedBusinesses || []) {
        const existingBusinessUser = businessUsersWithBusinesses.find(
          bu => bu.business_id === business.id
        );
        
        if (!existingBusinessUser) {
          // Create business_user record for owned business
          const { data: newBusinessUser, error: createError } = await supabase
            .from('business_users')
            .insert([{
              business_id: business.id,
              user_id: userId,
              role: 'owner',
              full_name: user?.user_metadata?.full_name || null,
              email: user?.email || null
            }])
            .select()
            .single();

          if (!createError && newBusinessUser) {
            businessUsersWithBusinesses.push({
              ...newBusinessUser,
              businesses: business
            });
          }
        }
      }

      // Extract all accessible businesses from business users
      const allAccessibleBusinesses = businessUsersWithBusinesses
        .map(bu => bu.businesses)
        .filter(Boolean);

      setBusinessUsers(businessUsersWithBusinesses);
      setAccessibleBusinesses(allAccessibleBusinesses);
      
      // Allow access even without a business
      if (businessUsersWithBusinesses.length > 0) {
        setCurrentBusinessUser(businessUsersWithBusinesses[0]);
      } else {
        // Set null but don't block access
        setCurrentBusinessUser(null);
      }
    } catch (error) {
      console.error('Error in fetchUserBusinesses:', error);
      // Don't block access on error
      setCurrentBusinessUser(null);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      
      let errorMessage = 'Login failed. Please try again.';
      if (error.message === 'Email not confirmed') {
        errorMessage = 'Please check your email and click the confirmation link before signing in.';
      } else if (error.message === 'Invalid login credentials') {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    }
    
    return true;
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        }
      }
    });
    
    setIsLoading(false);
    
    if (error) {
      console.error('Sign up error:', error);
      
      let errorMessage = error.message;
      if (error.message.includes('already registered')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      }
      
      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { success: false, error: error.message };
    }
    
    toast({
      title: "Account Created!",
      description: "Please check your email for a confirmation link to complete your registration.",
    });
    
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const createBusiness = async (businessData: { 
    name: string; 
    type: string; 
    description?: string;
    organization_id: string;
  }) => {
    console.log('createBusiness called with:', businessData);
    if (!user) throw new Error('Not authenticated');

    try {
      console.log('Creating business in database...');
      // Create the business
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .insert([{
          name: businessData.name,
          type: businessData.type,
          description: businessData.description || '',
          owner_id: user.id,
          organization_id: businessData.organization_id
        }])
        .select()
        .single();

      if (businessError) {
        console.error('Error creating business:', businessError);
        throw businessError;
      }

      console.log('Business created successfully:', business);

      // Try to create business_user record using RPC first, with fallback to direct insert
      console.log('Creating business_user record...');
      let businessUser;
      let businessUserError;

      try {
        const { data: businessUserData, error: rpcError } = await supabase
          .rpc('create_business_user', {
            p_business_id: business.id,
            p_user_id: user.id,
            p_role: 'owner',
            p_full_name: user.user_metadata?.full_name || null,
            p_email: user.email || null
          });

        if (rpcError) {
          console.log('RPC function failed, trying direct insert:', rpcError);
          throw rpcError;
        }

        businessUser = businessUserData;
        console.log('Business user created via RPC:', businessUser);
      } catch (rpcError) {
        console.log('RPC failed, using direct insert fallback...');
        // Fallback to direct insert
        const { data: directBusinessUser, error: directError } = await supabase
          .from('business_users')
          .insert([{
            business_id: business.id,
            user_id: user.id,
            role: 'owner',
            full_name: user.user_metadata?.full_name || null,
            email: user.email || null
          }])
          .select()
          .single();

        if (directError) {
          console.error('Direct insert also failed:', directError);
          businessUserError = directError;
        } else {
          businessUser = directBusinessUser;
          console.log('Business user created via direct insert:', businessUser);
        }
      }

      if (businessUserError) {
        console.error('Error creating business user:', businessUserError);
        throw businessUserError;
      }

      // Refresh business data
      console.log('Refreshing business data...');
      await fetchUserBusinesses(user.id);

      return { business, businessUser };
    } catch (error) {
      console.error('Error in createBusiness:', error);
      throw error;
    }
  };

  const requestBusinessAccess = async (businessId: string, requestData: {
    requesterName: string;
    requesterEmail: string;
    requesterMessage?: string;
    requestedRole: string;
  }) => {
    if (!user) throw new Error('Not authenticated');

    // Check if user already has access to this business
    const hasAccess = businessUsers.some(bu => bu.business_id === businessId);
    if (hasAccess) {
      throw new Error('You already have access to this business');
    }

    // Check if there's already a pending request
    const { data: existingRequest, error: checkError } = await supabase
      .from('business_access_requests')
      .select('*')
      .eq('business_id', businessId)
      .eq('requester_email', requestData.requesterEmail)
      .eq('status', 'pending')
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error checking existing request:', checkError);
      throw checkError;
    }

    if (existingRequest) {
      throw new Error('You already have a pending request for this business');
    }

    // Create the access request
    const { data: accessRequest, error: requestError } = await supabase
      .from('business_access_requests')
      .insert([{
        business_id: businessId,
        requester_email: requestData.requesterEmail,
        requester_name: requestData.requesterName,
        requester_message: requestData.requesterMessage || null,
        requested_role: requestData.requestedRole,
        status: 'pending'
      }])
      .select()
      .single();

    if (requestError) {
      console.error('Error creating access request:', requestError);
      throw requestError;
    }

    return accessRequest;
  };

  const inviteUserToBusiness = async (businessId: string, email: string, role: 'admin' | 'employee' = 'employee') => {
    if (!user) throw new Error('Not authenticated');

    // Check if user has access to this business
    const hasAccess = businessUsers.some(bu => bu.business_id === businessId);
    if (!hasAccess) {
      throw new Error('You do not have access to this business');
    }

    // For now, we'll create a placeholder business_user record
    // In a real implementation, you'd need to handle user lookup differently
    // or use a server-side function to find users by email
    const { data: businessUser, error: businessUserError } = await supabase
      .from('business_users')
      .insert([{
        business_id: businessId,
        user_id: '00000000-0000-0000-0000-000000000000', // Placeholder - would need actual user ID
        role,
        full_name: null,
        email: email
      }])
      .select()
      .single();

    if (businessUserError) {
      console.error('Error inviting user:', businessUserError);
      throw businessUserError;
    }

    return businessUser;
  };

  return (
    <AuthContextObj.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading,
      signUp,
      businessUsers,
      currentBusinessUser,
      setCurrentBusinessUser,
      accessibleBusinesses,
      createBusiness,
      requestBusinessAccess,
      inviteUserToBusiness,
      currentOrganization,
          setCurrentOrganization: setCurrentOrganizationWithRefresh,
    organizationUsers,
    createOrganization,
      inviteToOrganization,
      validateInviteCode,
      acceptInvite
    }}>
      {children}
    </AuthContextObj.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContextObj);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
