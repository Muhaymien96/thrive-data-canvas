import type { BusinessUser, Business, Organization, OrganizationUser, Invite } from './database';

export type UserRole = 'owner' | 'admin' | 'employee';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthContext {
  user: any | null; // Using Supabase User type
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  businessUsers: BusinessUser[];
  currentBusinessUser: BusinessUser | null;
  setCurrentBusinessUser: (user: BusinessUser | null) => void;
  accessibleBusinesses: Business[];
  createBusiness: (businessData: { 
    name: string; 
    type: string; 
    description?: string;
    organization_id: string;
  }) => Promise<{ business: Business; businessUser: BusinessUser }>;
  requestBusinessAccess: (businessId: string, requestData: {
    requesterName: string;
    requesterEmail: string;
    requesterMessage?: string;
    requestedRole: string;
  }) => Promise<any>;
  inviteUserToBusiness: (businessId: string, email: string, role?: 'admin' | 'employee') => Promise<BusinessUser>;
  // Organization management
  currentOrganization: Organization | null;
  setCurrentOrganization: (organization: Organization | null) => void;
  organizationUsers: OrganizationUser[];
  createOrganization: (name: string) => Promise<Organization>;
  inviteToOrganization: (email: string, role: 'admin' | 'employee') => Promise<Invite>;
  validateInviteCode: (inviteCode: string) => Promise<Invite>;
  acceptInvite: (invite: Invite) => Promise<void>;
}
