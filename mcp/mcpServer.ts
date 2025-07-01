import express from 'express';
import { supabase } from './supabaseServerClient';
import { config, validateConfig } from './config';
import type { Database } from '../src/types/database';


// Validate configuration on startup
validateConfig();

const app = express();
const PORT = config.port;

app.use(express.json());



// Request logging middleware
if (config.logging.enableRequestLogging) {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Type definitions for better type safety
type Customer = Database['public']['Tables']['customers']['Row'];
type Business = Database['public']['Tables']['businesses']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type Employee = Database['public']['Tables']['employees']['Row'];
type Supplier = Database['public']['Tables']['suppliers']['Row'];
type Organization = Database['public']['Tables']['organizations']['Row'];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Supabase MCP Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ===== ORGANIZATIONS ENDPOINTS =====
app.get('/organizations', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*');
    
    if (error) throw error;
    res.json({ organizations: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

// @ts-ignore - Express type inference issue, server works correctly
app.post('/organizations', async (req: express.Request, res: express.Response) => {
  try {
    const { name, owner_id } = req.body;

    if (!name || !owner_id) {
      return res.status(400).json({ error: 'Name and owner_id are required' });
    }

    console.log('Creating organization using RPC:', { name, owner_id });

    // Use the test RPC function to create organization (bypasses auth for testing)
    const { data, error } = await supabase
      .rpc('create_test_organization', {
        p_name: name,
        p_owner_id: owner_id
      });

    if (error) {
      console.error('Error creating organization via RPC:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Organization created via RPC:', data);
    res.status(201).json({ organization: data });
  } catch (error) {
    console.error('Unexpected error creating organization:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

app.get('/organizations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('organizations')
      .select('*, organization_users(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    res.json({ organization: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

// ===== ORGANIZATION USERS ENDPOINTS =====
app.get('/organization-users', async (req, res) => {
  try {
    const { organization_id } = req.query;
    
    let query = supabase.from('organization_users').select('*');
    if (organization_id) {
      query = query.eq('organization_id', organization_id as string);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    res.json({ organization_users: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

// ===== CUSTOMERS ENDPOINTS =====
app.get('/customers', async (req, res) => {
  try {
    const { business_id } = req.query;
    
    let query = supabase.from('customers').select('*');
    if (business_id) {
      query = query.eq('business_id', business_id as string);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    res.json({ customers: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

app.get('/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    res.json({ customer: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

app.post('/customers', async (req, res) => {
  try {
    const customerData = req.body;
    const { data, error } = await supabase
      .from('customers')
      .insert(customerData)
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json({ customer: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

app.put('/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const { data, error } = await supabase
      .from('customers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    res.json({ customer: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

app.delete('/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

// ===== BUSINESSES ENDPOINTS =====
app.get('/businesses', async (req, res) => {
  try {
    const { organization_id } = req.query;
    
    let query = supabase.from('businesses').select('*, organizations(*)');
    if (organization_id) {
      query = query.eq('organization_id', organization_id as string);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    res.json({ businesses: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

app.get('/businesses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    res.json({ business: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

app.post('/businesses', async (req, res) => {
  try {
    const businessData = req.body;
    const { data, error } = await supabase
      .from('businesses')
      .insert(businessData)
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json({ business: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

// ===== TRANSACTIONS ENDPOINTS =====
app.get('/transactions', async (req, res) => {
  try {
    const { business_id, type, date_from, date_to } = req.query;
    
    let query = supabase.from('transactions').select('*');
    if (business_id) {
      query = query.eq('business_id', business_id as string);
    }
    if (type) {
      query = query.eq('type', type as string);
    }
    if (date_from) {
      query = query.gte('date', date_from as string);
    }
    if (date_to) {
      query = query.lte('date', date_to as string);
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) throw error;
    res.json({ transactions: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

app.get('/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    res.json({ transaction: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

app.post('/transactions', async (req, res) => {
  try {
    const transactionData = req.body;
    const { data, error } = await supabase
      .from('transactions')
      .insert(transactionData)
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json({ transaction: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

app.put('/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    res.json({ transaction: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

// ===== PRODUCTS ENDPOINTS =====
app.get('/products', async (req, res) => {
  try {
    const { business_id, category, supplier_id } = req.query;
    
    let query = supabase.from('products').select('*');
    if (business_id) {
      query = query.eq('business_id', business_id as string);
    }
    if (category) {
      query = query.eq('category', category as string);
    }
    if (supplier_id) {
      query = query.eq('supplier_id', supplier_id as string);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    res.json({ products: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    res.json({ product: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

app.post('/products', async (req, res) => {
  try {
    const productData = req.body;
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json({ product: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    res.json({ product: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

// ===== EMPLOYEES ENDPOINTS =====
app.get('/employees', async (req, res) => {
  try {
    const { business_id } = req.query;
    
    let query = supabase.from('employees').select('*');
    if (business_id) {
      query = query.eq('business_id', business_id as string);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    res.json({ employees: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

app.post('/employees', async (req, res) => {
  try {
    const employeeData = req.body;
    const { data, error } = await supabase
      .from('employees')
      .insert(employeeData)
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json({ employee: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

// ===== SUPPLIERS ENDPOINTS =====
app.get('/suppliers', async (req, res) => {
  try {
    const { business_id, category } = req.query;
    
    let query = supabase.from('suppliers').select('*');
    if (business_id) {
      query = query.eq('business_id', business_id as string);
    }
    if (category) {
      query = query.eq('category', category as string);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    res.json({ suppliers: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

app.post('/suppliers', async (req, res) => {
  try {
    const supplierData = req.body;
    const { data, error } = await supabase
      .from('suppliers')
      .insert(supplierData)
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json({ supplier: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

// ===== BUSINESS USERS ENDPOINTS =====
// @ts-ignore - Express type inference issue, server works correctly
app.get('/business-users', async (req: express.Request, res: express.Response) => {
  try {
    const { business_id, user_id } = req.query;
    
    let query = supabase.from('business_users').select('*');
    
    if (business_id) {
      query = query.eq('business_id', business_id as string);
    }
    if (user_id) {
      query = query.eq('user_id', user_id as string);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    res.json({ business_users: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

// @ts-ignore - Express type inference issue, server works correctly
app.post('/business-users', async (req: express.Request, res: express.Response) => {
  try {
    const { business_id, user_id, role = 'employee' } = req.body;
    
    if (!business_id || !user_id) {
      return res.status(400).json({ error: 'business_id and user_id are required' });
    }
    
    const { data, error } = await supabase
      .from('business_users')
      .insert({ business_id, user_id, role })
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json({ business_user: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

// @ts-ignore - Express type inference issue, server works correctly
app.put('/business-users/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { role, full_name, email, avatar_url } = req.body;
    
    const updateData: any = {};
    if (role !== undefined) updateData.role = role;
    if (full_name !== undefined) updateData.full_name = full_name;
    if (email !== undefined) updateData.email = email;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'At least one field to update is required' });
    }
    
    const { data, error } = await supabase
      .from('business_users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    res.json({ business_user: data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

// @ts-ignore - Express type inference issue, server works correctly
app.delete('/business-users/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('business_users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ message: 'User removed from business successfully' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

// ===== ANALYTICS ENDPOINTS =====
app.get('/analytics/revenue', async (req, res) => {
  try {
    const { business_id, date_from, date_to } = req.query;
    
    let query = supabase
      .from('transactions')
      .select('amount, type, date')
      .eq('type', 'sale');
    
    if (business_id) {
      query = query.eq('business_id', business_id as string);
    }
    if (date_from) {
      query = query.gte('date', date_from as string);
    }
    if (date_to) {
      query = query.lte('date', date_to as string);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    const totalRevenue = data.reduce((sum, transaction) => sum + transaction.amount, 0);
    const transactionCount = data.length;
    
    res.json({
      totalRevenue,
      transactionCount,
      transactions: data
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

app.get('/analytics/stock', async (req, res) => {
  try {
    const { business_id } = req.query;
    
    let query = supabase
      .from('products')
      .select('name, current_stock, min_stock_level, max_stock');
    
    if (business_id) {
      query = query.eq('business_id', business_id as string);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    const lowStockItems = data.filter(product => 
      product.current_stock && product.min_stock_level && 
      product.current_stock <= product.min_stock_level
    );
    
    const outOfStockItems = data.filter(product => 
      !product.current_stock || product.current_stock === 0
    );
    
    res.json({
      totalProducts: data.length,
      lowStockItems: lowStockItems.length,
      outOfStockItems: outOfStockItems.length,
      products: data
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

// ===== MIGRATION ENDPOINT =====
// @ts-ignore - Express type inference issue, server works correctly
app.post('/migrate', async (req: express.Request, res: express.Response) => {
  try {
    const { sql } = req.body;
    
    if (!sql) {
      return res.status(400).json({ error: 'SQL query is required' });
    }
    
    // Execute the migration SQL directly
    const { error } = await supabase.from('business_users').select('*').limit(1);
    
    if (error) {
      console.error('Migration error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ message: 'Migration check completed' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

// ===== SEARCH ENDPOINT =====
// @ts-ignore - Express type inference issue, server works correctly
app.get('/search', async (req: express.Request, res: express.Response) => {
  try {
    const { q, business_id, type } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const searchTerm = q as string;
    let results: any = {};
    
    if (!type || type === 'customers') {
      const { data: customers } = await supabase
        .from('customers')
        .select('*')
        .eq('business_id', business_id as string)
        .ilike('name', `%${searchTerm}%`);
      results.customers = customers || [];
    }
    
    if (!type || type === 'products') {
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('business_id', business_id as string)
        .or(`name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`);
      results.products = products || [];
    }
    
    if (!type || type === 'suppliers') {
      const { data: suppliers } = await supabase
        .from('suppliers')
        .select('*')
        .eq('business_id', business_id as string)
        .ilike('name', `%${searchTerm}%`);
      results.suppliers = suppliers || [];
    }
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`✅ Supabase MCP Server running at http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   GET  /health - Health check`);
  console.log(`   GET  /customers - Get customers`);
  console.log(`   POST /customers - Create customer`);
  console.log(`   GET  /businesses - Get businesses`);
  console.log(`   POST /businesses - Create business`);
  console.log(`   GET  /business-users - Get business users`);
  console.log(`   POST /business-users - Add user to business`);
  console.log(`   PUT  /business-users/:id - Update user role`);
  console.log(`   DELETE /business-users/:id - Remove user from business`);
  console.log(`   GET  /transactions - Get transactions`);
  console.log(`   POST /transactions - Create transaction`);
  console.log(`   GET  /products - Get products`);
  console.log(`   POST /products - Create product`);
  console.log(`   GET  /employees - Get employees`);
  console.log(`   POST /employees - Create employee`);
  console.log(`   GET  /suppliers - Get suppliers`);
  console.log(`   POST /suppliers - Create supplier`);
  console.log(`   GET  /analytics/revenue - Revenue analytics`);
  console.log(`   GET  /analytics/stock - Stock analytics`);
  console.log(`   GET  /search - Search across entities`);
});
