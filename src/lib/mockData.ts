
import { faker } from '@faker-js/faker';
import type { 
  Transaction, 
  Business, 
  BusinessWithAll, 
  Customer, 
  Supplier, 
  Employee, 
  Invoice,
  Event,
  ComplianceData,
  ComplianceDocument,
  ComplianceRequirement,
  ComplianceDeadline,
  Product,
  StockMovement
} from '@/types/transaction';

// Generate mock transactions
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-12-20',
    business: 'Fish',
    type: 'sale',
    amount: 2500,
    description: 'Fresh salmon fillets',
    customer: 'Ocean Restaurant',
    paymentMethod: 'yoco',
    paymentStatus: 'paid',
    invoiceGenerated: true,
    invoiceNumber: 'INV-2024-001'
  },
  {
    id: '2',
    date: '2024-12-19',
    business: 'Honey',
    type: 'sale',
    amount: 850,
    description: 'Raw honey jars',
    customer: 'Health Store Co',
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    dueDate: '2024-12-25'
  },
  {
    id: '3',
    date: '2024-12-18',
    business: 'Mushrooms',
    type: 'sale',
    amount: 1200,
    description: 'Organic mushroom mix',
    customer: 'Farm Fresh Market',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'partial',
    amountPaid: 600,
    dueDate: '2024-12-22'
  },
  {
    id: '4',
    date: '2024-12-17',
    business: 'Fish',
    type: 'expense',
    amount: 500,
    description: 'Ice and packaging',
    customer: 'Cold Storage Ltd',
    paymentMethod: 'card',
    paymentStatus: 'paid'
  },
  {
    id: '5',
    date: '2024-12-16',
    business: 'Honey',
    type: 'sale',
    amount: 1800,
    description: 'Premium honey collection',
    customer: 'Gourmet Foods Inc',
    paymentMethod: 'yoco',
    paymentStatus: 'overdue',
    dueDate: '2024-12-20'
  }
];

// Generate mock customers
export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Ocean Restaurant',
    email: 'orders@oceanrestaurant.com',
    phone: '+27 21 123 4567',
    address: '123 Main St, Cape Town',
    business: 'Fish',
    totalSpent: 15000,
    lastPurchase: '2024-12-20',
    invoicePreference: 'email',
    paymentTerms: 30,
    totalPurchases: 25000,
    outstandingBalance: 2500,
    creditLimit: 10000,
    tags: ['VIP', 'Restaurant', 'Regular']
  },
  {
    id: '2',
    name: 'Health Store Co',
    email: 'buyer@healthstore.co.za',
    phone: '+27 11 987 6543',
    address: '456 Oak Ave, Johannesburg',
    business: 'Honey',
    totalSpent: 8500,
    lastPurchase: '2024-12-19',
    invoicePreference: 'both',
    paymentTerms: 14,
    totalPurchases: 12000,
    outstandingBalance: 850,
    creditLimit: 5000,
    tags: ['Retail', 'Health']
  },
  {
    id: '3',
    name: 'Farm Fresh Market',
    email: 'purchasing@farmfresh.co.za',
    phone: '+27 31 555 1234',
    address: '789 Pine Rd, Durban',
    business: 'Mushrooms',
    totalSpent: 12000,
    lastPurchase: '2024-12-18',
    invoicePreference: 'email',
    paymentTerms: 21,
    totalPurchases: 18000,
    outstandingBalance: 600,
    creditLimit: 8000,
    tags: ['Wholesale', 'Market']
  }
];

// Generate mock suppliers
export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Ocean Fresh Seafood',
    email: 'supply@oceanfresh.co.za',
    phone: '+27 21 111 2222',
    address: '100 Harbor View, Cape Town',
    business: 'Fish',
    category: 'Seafood Supplier',
    totalSpent: 45000,
    rating: 4.8,
    lastOrder: '2024-12-15'
  },
  {
    id: '2',
    name: 'Golden Hive Apiaries',
    email: 'info@goldenhive.com',
    phone: '+27 12 333 4444',
    address: '200 Bee Farm Rd, Pretoria',
    business: 'Honey',
    category: 'Honey Producer',
    totalSpent: 28000,
    rating: 4.9,
    lastOrder: '2024-12-10'
  }
];

// Generate mock employees
export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@fishbusiness.com',
    phone: '+27 21 555 0001',
    business: 'Fish',
    position: 'Sales Manager',
    hourlyRate: 150,
    salary: 25000,
    startDate: '2023-01-15',
    status: 'active',
    paymentMethod: 'bank_transfer',
    bankDetails: {
      accountNumber: '1234567890',
      bankName: 'Standard Bank',
      branchCode: '051001'
    }
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@honeybusiness.com',
    phone: '+27 11 555 0002',
    business: 'Honey',
    position: 'Production Lead',
    hourlyRate: 120,
    startDate: '2023-03-20',
    status: 'active',
    paymentMethod: 'bank_transfer'
  }
];

// Generate mock events
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Rosebank Market',
    name: 'Rosebank Market',
    description: 'Weekend farmers market',
    date: '2024-12-21',
    time: '08:00',
    location: 'Rosebank Mall, Johannesburg',
    business: 'Honey',
    type: 'market',
    status: 'upcoming',
    totalRevenue: 3500,
    marketCost: 200
  },
  {
    id: '2',
    title: 'V&A Waterfront Market',
    name: 'V&A Waterfront Market',
    description: 'Tourist market at waterfront',
    date: '2024-12-22',
    time: '09:00',
    location: 'V&A Waterfront, Cape Town',
    business: 'Fish',
    type: 'market',
    status: 'upcoming',
    totalRevenue: 4200,
    marketCost: 350
  },
  {
    id: '3',
    title: 'Organic Food Festival',
    name: 'Organic Food Festival',
    description: 'Annual organic food festival',
    date: '2024-12-15',
    time: '10:00',
    location: 'Delta Park, Johannesburg',
    business: 'Mushrooms',
    type: 'market',
    status: 'completed',
    totalRevenue: 2800,
    marketCost: 150
  }
];

// Generate mock products
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Fresh Salmon',
    business: 'Fish',
    category: 'Seafood',
    price: 120,
    cost: 80,
    stock: 25,
    currentStock: 25,
    unit: 'kg',
    description: 'Fresh Atlantic salmon fillets',
    supplier: 'Ocean Fresh Seafood',
    minStock: 10,
    minStockLevel: 10,
    maxStock: 50,
    markupPercentage: 50,
    expiryDate: '2024-12-25'
  },
  {
    id: '2',
    name: 'Raw Honey',
    business: 'Honey',
    category: 'Natural Products',
    price: 45,
    cost: 25,
    stock: 120,
    currentStock: 120,
    unit: 'jar',
    description: 'Pure raw honey 500g jar',
    supplier: 'Golden Hive Apiaries',
    minStock: 20,
    minStockLevel: 20,
    maxStock: 200,
    markupPercentage: 80
  },
  {
    id: '3',
    name: 'Shiitake Mushrooms',
    business: 'Mushrooms',
    category: 'Vegetables',
    price: 35,
    cost: 18,
    stock: 45,
    currentStock: 45,
    unit: 'kg',
    description: 'Fresh shiitake mushrooms',
    supplier: 'Mushroom Farms Ltd',
    minStock: 15,
    minStockLevel: 15,
    maxStock: 100,
    markupPercentage: 94.4
  }
];

// Generate mock stock movements
export const mockStockMovements: StockMovement[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Fresh Salmon',
    type: 'in',
    quantity: 50,
    date: '2024-12-15',
    reason: 'Purchase order',
    reference: 'PO-001'
  },
  {
    id: '2',
    productId: '1',
    productName: 'Fresh Salmon',
    type: 'out',
    quantity: 25,
    date: '2024-12-20',
    reason: 'Sale to Ocean Restaurant',
    reference: 'INV-2024-001'
  },
  {
    id: '3',
    productId: '2',
    productName: 'Raw Honey',
    type: 'in',
    quantity: 100,
    date: '2024-12-10',
    reason: 'Production batch',
    reference: 'PROD-001'
  }
];

// Generate mock invoices
export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    customerId: '1',
    customerName: 'Ocean Restaurant',
    customerEmail: 'orders@oceanrestaurant.com',
    business: 'Fish',
    issueDate: '2024-12-20',
    dueDate: '2024-12-27',
    items: [
      {
        id: '1',
        description: 'Fresh Salmon Fillets',
        quantity: 10,
        unitPrice: 120,
        total: 1200
      }
    ],
    subtotal: 1200,
    tax: 180,
    total: 1380,
    status: 'paid',
    paymentMethod: 'yoco',
    transactionId: '1'
  }
];

// Helper functions for product calculations
export const calculateMarkup = (cost: number, price: number): number => {
  return ((price - cost) / cost) * 100;
};

export const calculateSellingPrice = (cost: number, markupPercentage: number): number => {
  return cost * (1 + markupPercentage / 100);
};

// Helper function to get stock movements
export const getStockMovements = (productId?: string): StockMovement[] => {
  if (productId) {
    return mockStockMovements.filter(movement => movement.productId === productId);
  }
  return mockStockMovements;
};

// Business metrics calculation
export const getBusinessMetrics = (business: Business) => {
  const businessTransactions = mockTransactions.filter(t => t.business === business);
  const salesTransactions = businessTransactions.filter(t => t.type === 'sale');
  const expenseTransactions = businessTransactions.filter(t => t.type === 'expense');
  
  const totalRevenue = salesTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const transactionCount = businessTransactions.length;
  const averageTransactionValue = transactionCount > 0 ? totalRevenue / salesTransactions.length : 0;
  
  // Get recent transactions for this business
  const recentTransactions = businessTransactions.slice(0, 5);
  
  return {
    totalRevenue,
    totalSales: totalRevenue, // Alias for compatibility
    totalExpenses,
    netProfit,
    transactionCount,
    averageTransactionValue,
    averageTransaction: averageTransactionValue, // Alias for compatibility
    recentTransactions
  };
};

// Monthly revenue calculation
export const getMonthlyRevenue = (business: BusinessWithAll): number => {
  if (business === 'All') {
    return mockTransactions
      .filter(t => t.type === 'sale')
      .reduce((sum, t) => sum + t.amount, 0);
  }
  
  return mockTransactions
    .filter(t => t.business === business && t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);
};

// Events by business
export const getEventsByBusiness = (business: BusinessWithAll): Event[] => {
  if (business === 'All') {
    return mockEvents;
  }
  return mockEvents.filter(event => event.business === business);
};

// Compliance data
export const getComplianceData = (business: BusinessWithAll): ComplianceData => {
  const allDocuments: ComplianceDocument[] = [
    {
      id: '1',
      name: 'Food Handler License',
      documentName: 'Food Handler License',
      category: 'Food Safety',
      type: 'license',
      business: 'Fish',
      issueDate: '2024-01-15',
      expiryDate: '2025-01-15',
      dueDate: '2025-01-15',
      status: 'valid',
      authority: 'Department of Health'
    },
    {
      id: '2',
      name: 'Organic Certification',
      documentName: 'Organic Certification',
      category: 'Quality Assurance',
      type: 'certificate',
      business: 'Honey',
      issueDate: '2024-03-01',
      expiryDate: '2025-03-01',
      dueDate: '2025-03-01',
      status: 'expiring',
      authority: 'Organic Standards Board'
    },
    {
      id: '3',
      name: 'Health Inspection',
      documentName: 'Health Inspection',
      category: 'Safety',
      type: 'inspection',
      business: 'Mushrooms',
      issueDate: '2024-11-01',
      expiryDate: '2024-12-01',
      dueDate: '2024-12-01',
      status: 'overdue',
      authority: 'Municipal Health Services'
    }
  ];

  const requirements: ComplianceRequirement[] = [
    {
      id: '1',
      title: 'Annual Food Safety Training',
      description: 'Complete mandatory food safety training for all staff',
      dueDate: '2024-12-31',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Equipment Safety Check',
      description: 'Annual safety inspection of all processing equipment',
      dueDate: '2024-12-25',
      status: 'completed'
    }
  ];

  const upcomingDeadlines: ComplianceDeadline[] = [
    {
      id: '1',
      title: 'License Renewal',
      description: 'Food handler license renewal due',
      date: '2025-01-15',
      daysLeft: 26
    },
    {
      id: '2',
      title: 'Safety Training',
      description: 'Annual safety training deadline',
      date: '2024-12-31',
      daysLeft: 11
    }
  ];

  const documents = business === 'All' ? allDocuments : allDocuments.filter(doc => doc.business === business);
  const completed = documents.filter(doc => doc.status === 'valid' || doc.status === 'completed').length;
  const pending = documents.filter(doc => doc.status === 'pending' || doc.status === 'expiring').length;
  const overdue = documents.filter(doc => doc.status === 'overdue' || doc.status === 'expired').length;
  const overallProgress = documents.length > 0 ? Math.round((completed / documents.length) * 100) : 0;

  return {
    documents,
    requirements,
    upcomingDeadlines,
    completed,
    pending,
    overdue,
    overallProgress
  };
};

// Helper function to get customer by name
export const getCustomerByName = (name: string): Customer | undefined => {
  return mockCustomers.find(customer => customer.name === name);
};

// Helper function to get product by ID
export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

// Helper function to get all products by business
export const getProductsByBusiness = (business: BusinessWithAll): Product[] => {
  if (business === 'All') {
    return mockProducts;
  }
  return mockProducts.filter(product => product.business === business);
};

// Helper function to get customers by business
export const getCustomersByBusiness = (business: BusinessWithAll): Customer[] => {
  if (business === 'All') {
    return mockCustomers;
  }
  return mockCustomers.filter(customer => customer.business === business);
};

// Helper function to get suppliers by business
export const getSuppliersByBusiness = (business: BusinessWithAll): Supplier[] => {
  if (business === 'All') {
    return mockSuppliers;
  }
  return mockSuppliers.filter(supplier => supplier.business === business);
};

// Helper function to get employees by business
export const getEmployeesByBusiness = (business: BusinessWithAll): Employee[] => {
  if (business === 'All') {
    return mockEmployees;
  }
  return mockEmployees.filter(employee => employee.business === business);
};

// Helper function to get invoices by business
export const getInvoicesByBusiness = (business: BusinessWithAll): Invoice[] => {
  if (business === 'All') {
    return mockInvoices;
  }
  return mockInvoices.filter(invoice => invoice.business === business);
};
