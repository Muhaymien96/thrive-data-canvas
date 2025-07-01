export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      business_users: {
        Row: {
          business_id: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
          full_name: string | null
          avatar_url: string | null
          email: string | null
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
          full_name?: string | null
          avatar_url?: string | null
          email?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
          full_name?: string | null
          avatar_url?: string | null
          email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_users_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_access_requests: {
        Row: {
          id: string
          business_id: string
          requester_email: string
          requester_name: string | null
          requester_message: string | null
          requested_role: string
          status: string
          approved_by: string | null
          approved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          requester_email: string
          requester_name?: string | null
          requester_message?: string | null
          requested_role?: string
          status?: string
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          requester_email?: string
          requester_name?: string | null
          requester_message?: string | null
          requested_role?: string
          status?: string
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_access_requests_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_access_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          owner_id: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_id: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      compliance_items: {
        Row: {
          business_id: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_items_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          business_id: string
          created_at: string
          credit_limit: number | null
          email: string | null
          id: string
          invoice_preference: string | null
          last_purchase: string | null
          name: string
          outstanding_balance: number | null
          payment_terms: number | null
          phone: string | null
          tags: string[] | null
          total_purchases: number | null
          total_spent: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          business_id: string
          created_at?: string
          credit_limit?: number | null
          email?: string | null
          id?: string
          invoice_preference?: string | null
          last_purchase?: string | null
          name: string
          outstanding_balance?: number | null
          payment_terms?: number | null
          phone?: string | null
          tags?: string[] | null
          total_purchases?: number | null
          total_spent?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          business_id?: string
          created_at?: string
          credit_limit?: number | null
          email?: string | null
          id?: string
          invoice_preference?: string | null
          last_purchase?: string | null
          name?: string
          outstanding_balance?: number | null
          payment_terms?: number | null
          phone?: string | null
          tags?: string[] | null
          total_purchases?: number | null
          total_spent?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          bank_details: Json | null
          business_id: string
          created_at: string
          email: string | null
          hourly_rate: number | null
          id: string
          name: string
          payment_method: string | null
          phone: string | null
          position: string | null
          salary: number | null
          start_date: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          bank_details?: Json | null
          business_id: string
          created_at?: string
          email?: string | null
          hourly_rate?: number | null
          id?: string
          name: string
          payment_method?: string | null
          phone?: string | null
          position?: string | null
          salary?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          bank_details?: Json | null
          business_id?: string
          created_at?: string
          email?: string | null
          hourly_rate?: number | null
          id?: string
          name?: string
          payment_method?: string | null
          phone?: string | null
          position?: string | null
          salary?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      event_checklists: {
        Row: {
          business_id: string
          completed: boolean
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          event_id: string
          id: string
          priority: string
          title: string
          updated_at: string
        }
        Insert: {
          business_id: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          event_id: string
          id?: string
          priority?: string
          title: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          event_id?: string
          id?: string
          priority?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_checklists_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_checklists_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          business_id: string
          created_at: string
          date: string
          description: string | null
          id: string
          location: string | null
          status: string
          time: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          date: string
          description?: string | null
          id?: string
          location?: string | null
          status?: string
          time: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          location?: string | null
          status?: string
          time?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string
          quantity: number
          total: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          quantity?: number
          total?: number
          unit_price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number
          total?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          business_id: string
          created_at: string
          customer_id: string | null
          customer_name: string
          due_date: string | null
          id: string
          invoice_number: string
          issue_date: string
          status: string
          subtotal: number
          tax: number
          total: number
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          customer_id?: string | null
          customer_name: string
          due_date?: string | null
          id?: string
          invoice_number: string
          issue_date: string
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          customer_id?: string | null
          customer_name?: string
          due_date?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          business_id: string
          category: string | null
          conversion_factor: number | null
          cost: number
          created_at: string
          current_stock: number | null
          description: string | null
          expiry_date: string | null
          id: string
          is_bulk_item: boolean | null
          markup_percentage: number | null
          max_stock: number | null
          min_stock_level: number | null
          name: string
          parent_product_id: string | null
          price: number
          sku: string | null
          supplier_id: string | null
          supplier_name: string | null
          unit: string | null
          updated_at: string
          variant_type: string | null
          variant_value: string | null
        }
        Insert: {
          business_id: string
          category?: string | null
          conversion_factor?: number | null
          cost: number
          created_at?: string
          current_stock?: number | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          is_bulk_item?: boolean | null
          markup_percentage?: number | null
          max_stock?: number | null
          min_stock_level?: number | null
          name: string
          parent_product_id?: string | null
          price: number
          sku?: string | null
          supplier_id?: string | null
          supplier_name?: string | null
          unit?: string | null
          updated_at?: string
          variant_type?: string | null
          variant_value?: string | null
        }
        Update: {
          business_id?: string
          category?: string | null
          conversion_factor?: number | null
          cost?: number
          created_at?: string
          current_stock?: number | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          is_bulk_item?: boolean | null
          markup_percentage?: number | null
          max_stock?: number | null
          min_stock_level?: number | null
          name?: string
          parent_product_id?: string | null
          price?: number
          sku?: string | null
          supplier_id?: string | null
          supplier_name?: string | null
          unit?: string | null
          updated_at?: string
          variant_type?: string | null
          variant_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_parent_product_id_fkey"
            columns: ["parent_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          business_id: string
          created_at: string
          date: string
          id: string
          product_id: string
          quantity: number
          reason: string
          reference: string | null
          type: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          date?: string
          id?: string
          product_id: string
          quantity: number
          reason: string
          reference?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          date?: string
          id?: string
          product_id?: string
          quantity?: number
          reason?: string
          reference?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          business_id: string
          category: string | null
          created_at: string
          email: string | null
          id: string
          last_order: string | null
          last_payment_date: string | null
          name: string
          outstanding_balance: number | null
          payment_details: Json | null
          phone: string | null
          rating: number | null
          total_spent: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          business_id: string
          category?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_order?: string | null
          last_payment_date?: string | null
          name: string
          outstanding_balance?: number | null
          payment_details?: Json | null
          phone?: string | null
          rating?: number | null
          total_spent?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          business_id?: string
          category?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_order?: string | null
          last_payment_date?: string | null
          name?: string
          outstanding_balance?: number | null
          payment_details?: Json | null
          phone?: string | null
          rating?: number | null
          total_spent?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          amount_paid: number | null
          business_id: string
          cash_change: number | null
          cash_received: number | null
          cost_type: string | null
          created_at: string
          customer_id: string | null
          customer_name: string | null
          date: string
          description: string | null
          due_date: string | null
          employee_id: string | null
          employee_name: string | null
          hourly_rate: number | null
          hours_worked: number | null
          id: string
          invoice_date: string | null
          invoice_generated: boolean | null
          invoice_number: string | null
          payment_method: string | null
          payment_status: string | null
          supplier_id: string | null
          type: string
          updated_at: string
          yoco_card_type: string | null
          yoco_fee: number | null
          yoco_net_amount: number | null
          yoco_reference: string | null
          yoco_transaction_id: string | null
        }
        Insert: {
          amount: number
          amount_paid?: number | null
          business_id: string
          cash_change?: number | null
          cash_received?: number | null
          cost_type?: string | null
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          date: string
          description?: string | null
          due_date?: string | null
          employee_id?: string | null
          employee_name?: string | null
          hourly_rate?: number | null
          hours_worked?: number | null
          id?: string
          invoice_date?: string | null
          invoice_generated?: boolean | null
          invoice_number?: string | null
          payment_method?: string | null
          payment_status?: string | null
          supplier_id?: string | null
          type: string
          updated_at?: string
          yoco_card_type?: string | null
          yoco_fee?: number | null
          yoco_net_amount?: number | null
          yoco_reference?: string | null
          yoco_transaction_id?: string | null
        }
        Update: {
          amount?: number
          amount_paid?: number | null
          business_id?: string
          cash_change?: number | null
          cash_received?: number | null
          cost_type?: string | null
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          date?: string
          description?: string | null
          due_date?: string | null
          employee_id?: string | null
          employee_name?: string | null
          hourly_rate?: number | null
          hours_worked?: number | null
          id?: string
          invoice_date?: string | null
          invoice_generated?: boolean | null
          invoice_number?: string | null
          payment_method?: string | null
          payment_status?: string | null
          supplier_id?: string | null
          type?: string
          updated_at?: string
          yoco_card_type?: string | null
          yoco_fee?: number | null
          yoco_net_amount?: number | null
          yoco_reference?: string | null
          yoco_transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
          owner_id: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
          owner_id: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      organization_users: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      invites: {
        Row: {
          id: string
          organization_id: string
          email: string
          role: string
          invite_code: string
          expires_at: string
          created_at: string
          created_by: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          email: string
          role: string
          invite_code: string
          expires_at: string
          created_at?: string
          created_by: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          email?: string
          role?: string
          invite_code?: string
          expires_at?: string
          created_at?: string
          created_by?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invites_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invites_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invites_used_by_fkey"
            columns: ["used_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_self_supplier: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      user_has_business_access: {
        Args: {
          p_user_id: string
          p_business_id: string
        }
        Returns: boolean
      }
      create_business_user: {
        Args: {
          p_business_id: string
          p_user_id: string
          p_role: string
          p_full_name: string | null
          p_email: string | null
        }
        Returns: Json
      }
      create_organization_with_owner: {
        Args: {
          p_name: string
          p_owner_id: string
        }
        Returns: Json
      }
      generate_invite_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      user_role: "owner" | "admin" | "employee"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["owner", "admin", "employee"],
    },
  },
} as const
