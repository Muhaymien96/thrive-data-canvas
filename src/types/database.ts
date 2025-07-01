import type { Database } from '@/integrations/supabase/types';

// Re-export the Database type
export type { Database };

// Export all database table types
export type Customer = Database['public']['Tables']['customers']['Row'];
export type Business = Database['public']['Tables']['businesses']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Employee = Database['public']['Tables']['employees']['Row'];
export type Supplier = Database['public']['Tables']['suppliers']['Row'];
export type BusinessUser = Database['public']['Tables']['business_users']['Row'];
export type BusinessAccessRequest = Database['public']['Tables']['business_access_requests']['Row'];
export type Organization = Database['public']['Tables']['organizations']['Row'];
export type OrganizationUser = Database['public']['Tables']['organization_users']['Row'];
export type Invite = Database['public']['Tables']['invites']['Row'];

// Additional types for UI components
export type BusinessWithAll = Business | 'All';

// Types for forms and inserts
export type CustomerInsert = Database['public']['Tables']['customers']['Insert'];
export type BusinessInsert = Database['public']['Tables']['businesses']['Insert'];
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type EmployeeInsert = Database['public']['Tables']['employees']['Insert'];
export type SupplierInsert = Database['public']['Tables']['suppliers']['Insert'];

// Extended supplier payment details type compatible with Supabase Json
export interface SupplierPaymentDetails {
  bank_name?: string;
  account_number?: string;
  account_holder?: string;
  swift_code?: string;
  reference?: string;
  [key: string]: any; // Make it compatible with Json type
}

// Extended Product type with supplier information and variants
export interface ProductWithSupplier extends Product {
  supplier?: Supplier;
  variants?: ProductWithSupplier[];
  parent_product?: ProductWithSupplier;
}

// Product variant types
export type ProductType = 'standalone' | 'parent' | 'variant' | 'bulk';

export interface ProductVariantData {
  type?: ProductType; // Made optional since it's not stored in the database
  variant_type?: string;
  variant_value?: string;
  sku?: string;
  is_bulk_item?: boolean;
  conversion_factor?: number;
  parent_product_id?: string;
}

// New database types
export interface ComplianceItem {
  id: string;
  business_id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'overdue';
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  business_id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location?: string;
  type: 'meeting' | 'delivery' | 'inspection' | 'maintenance' | 'market';
  status: 'upcoming' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  product_id: string;
  business_id: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  reference?: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id?: string;
  customer_name: string;
  business_id: string;
  issue_date: string;
  due_date?: string;
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at: string;
  updated_at: string;
}

// Dashboard data types
export interface DashboardData {
  currentRevenue: number;
  previousRevenue: number;
  businessData: Array<{
    name: string;
    revenue: number;
    transactions: number;
  }>;
  topBusiness: {
    name: string;
    revenue: number;
    transactions: number;
  };
  recentTransactions: Transaction[];
}

export type UserRole = 'owner' | 'admin' | 'employee';

export interface BusinessWithDetails extends Business {
  business_users?: BusinessUser[];
  organization?: Organization;
}
