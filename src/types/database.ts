
// Database types matching Supabase schema
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      businesses: {
        Row: {
          id: string;
          name: string;
          type: string;
          description: string | null;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          description?: string | null;
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          description?: string | null;
          owner_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          address: string | null;
          business_id: string;
          total_spent: number;
          last_purchase: string | null;
          invoice_preference: string;
          payment_terms: number;
          total_purchases: number;
          outstanding_balance: number;
          credit_limit: number;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          date: string;
          business_id: string;
          type: string;
          amount: number;
          description: string | null;
          customer_name: string | null;
          payment_method: string | null;
          payment_status: string;
          due_date: string | null;
          amount_paid: number | null;
          invoice_number: string | null;
          invoice_generated: boolean;
          invoice_date: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          business_id: string;
          category: string | null;
          price: number;
          cost: number;
          current_stock: number;
          unit: string | null;
          description: string | null;
          supplier_name: string | null;
          min_stock_level: number;
          max_stock: number | null;
          markup_percentage: number | null;
          expiry_date: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}
