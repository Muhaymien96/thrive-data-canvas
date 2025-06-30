
import type { Database } from '@/integrations/supabase/types';

// Export all database table types
export type Customer = Database['public']['Tables']['customers']['Row'];
export type Business = Database['public']['Tables']['businesses']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Employee = Database['public']['Tables']['employees']['Row'];
export type Supplier = Database['public']['Tables']['suppliers']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

// Additional types for UI components
export type BusinessWithAll = Business | 'All';

// Types for forms and inserts
export type CustomerInsert = Database['public']['Tables']['customers']['Insert'];
export type BusinessInsert = Database['public']['Tables']['businesses']['Insert'];
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type EmployeeInsert = Database['public']['Tables']['employees']['Insert'];
export type SupplierInsert = Database['public']['Tables']['suppliers']['Insert'];

// Stock movement type (will be added to database later)
export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  date: string;
  reason: string;
  reference?: string;
}

// Invoice types (will be added to database later)
export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  businessId: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Event types (will be added to database later)
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  businessId: string;
  type: 'meeting' | 'delivery' | 'inspection' | 'maintenance' | 'market';
  status: 'upcoming' | 'completed' | 'cancelled';
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
