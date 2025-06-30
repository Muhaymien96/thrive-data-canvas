
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      businesses: {
        Row: Business;
        Insert: Omit<Business, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Business, 'id' | 'created_at' | 'updated_at'>>;
      };
      customers: {
        Row: Customer;
        Insert: Omit<Customer, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at'>>;
      };
      suppliers: {
        Row: Supplier;
        Insert: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Supplier, 'id' | 'created_at' | 'updated_at'>>;
      };
      employees: {
        Row: Employee;
        Insert: Omit<Employee, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Employee, 'id' | 'created_at' | 'updated_at'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
      };
      transactions: {
        Row: Transaction;
        Insert: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Transaction, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  name: string;
  type: 'Fish' | 'Honey' | 'Mushrooms';
  description?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  business_id: string;
  total_spent: number;
  last_purchase?: string;
  invoice_preference: 'email' | 'print' | 'both';
  payment_terms: number;
  total_purchases: number;
  outstanding_balance: number;
  credit_limit: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  business_id: string;
  category?: string;
  total_spent: number;
  rating: number;
  last_order?: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  business_id: string;
  position?: string;
  hourly_rate?: number;
  salary?: number;
  start_date?: string;
  status: 'active' | 'inactive';
  payment_method: 'bank_transfer' | 'cash' | 'check';
  bank_details?: any;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  business_id: string;
  category?: string;
  price: number;
  cost: number;
  current_stock: number;
  unit?: string;
  description?: string;
  supplier_name?: string;
  min_stock_level: number;
  max_stock?: number;
  markup_percentage?: number;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  date: string;
  business_id: string;
  type: 'sale' | 'refund' | 'expense' | 'employee_cost';
  amount: number;
  description?: string;
  customer_name?: string;
  payment_method?: 'card' | 'cash' | 'yoco' | 'bank_transfer';
  payment_status: 'paid' | 'pending' | 'overdue' | 'partial';
  due_date?: string;
  amount_paid?: number;
  invoice_number?: string;
  invoice_generated: boolean;
  invoice_date?: string;
  yoco_transaction_id?: string;
  yoco_fee?: number;
  yoco_net_amount?: number;
  yoco_card_type?: string;
  yoco_reference?: string;
  cash_received?: number;
  cash_change?: number;
  employee_id?: string;
  employee_name?: string;
  cost_type?: 'salary' | 'wages' | 'benefits' | 'bonus' | 'overtime';
  hours_worked?: number;
  hourly_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  product_id: string;
  business_id: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  date: string;
  reason?: string;
  reference?: string;
  created_at: string;
  updated_at: string;
}
