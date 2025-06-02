export type Business = 'Fish' | 'Honey' | 'Mushrooms';

export interface Transaction {
  id: number;
  date: string;
  business: 'Fish' | 'Honey' | 'Mushrooms';
  type: 'cash' | 'yoco' | 'credit';
  amount: number;
  customer: string;
  paymentStatus: 'paid' | 'partial' | 'pending';
  amountPaid?: number;
  dueDate?: string;
}

export interface Supplier {
  id: number;
  name: string;
  productType: string;
  lastOrderDate: string;
  contactEmail: string;
  phone: string;
  outstandingBalance: number;
  creditTerms: number; // days
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  totalPurchases: number;
  lastPurchase: string;
  tags: string[];
  outstandingBalance: number;
  creditLimit: number;
}

export interface OutstandingPayment {
  id: number;
  type: 'receivable' | 'payable';
  counterparty: string;
  amount: number;
  dueDate: string;
  daysPastDue: number;
  business: 'Fish' | 'Honey' | 'Mushrooms';
  description: string;
}

export interface SupplierTransaction {
  id: number;
  date: string;
  business: 'Fish' | 'Honey' | 'Mushrooms';
  type: 'purchase' | 'payment';
  amount: number;
  description: string;
  status: 'completed' | 'pending';
  invoiceNumber?: string;
}

export interface Product {
  id: number;
  name: string;
  business: 'Fish' | 'Honey' | 'Mushrooms';
  category: string;
  unit: string; // kg, L, box, etc.
  costPrice: number; // what we paid for it
  sellingPrice: number; // what we sell it for
  markupPercentage: number;
  currentStock: number;
  minStockLevel: number;
  supplier: string;
  lastRestocked: string;
  expiryDate?: string;
}

export interface StockMovement {
  id: number;
  productId: number;
  type: 'purchase' | 'sale' | 'adjustment';
  quantity: number;
  unitCost?: number;
  unitPrice?: number;
  date: string;
  reference: string; // transaction ID, purchase order, etc.
  notes?: string;
}

export interface Invoice {
  id: string;
  transactionId: number;
  customerName: string;
  customerEmail?: string;
  business: 'Fish' | 'Honey' | 'Mushrooms';
  date: string;
  dueDate?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

export interface InvoiceItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Event {
  id: number;
  name: string;
  location: string;
  date: string;
  business: Business;
  marketCost: number;
  totalRevenue: number;
  notes?: string;
  startTime?: string;
  endTime?: string;
}

export const mockTransactions: Transaction[] = [
  { id: 1, date: '2025-06-01', business: 'Honey', type: 'yoco', amount: 1500, customer: 'Farmers Market', paymentStatus: 'paid' },
  { id: 2, date: '2025-06-01', business: 'Fish', type: 'cash', amount: 2500, customer: 'Ocean Fresh Restaurant', paymentStatus: 'paid' },
  { id: 3, date: '2025-05-31', business: 'Mushrooms', type: 'credit', amount: 800, customer: 'Green Grocers', paymentStatus: 'pending', dueDate: '2025-06-15' },
  { id: 4, date: '2025-05-31', business: 'Honey', type: 'cash', amount: 750, customer: 'Local Bakery', paymentStatus: 'paid' },
  { id: 5, date: '2025-05-30', business: 'Fish', type: 'yoco', amount: 3200, customer: 'Seafood Bistro', paymentStatus: 'paid' },
  { id: 6, date: '2025-05-30', business: 'Mushrooms', type: 'credit', amount: 1200, customer: 'Farm to Table Co', paymentStatus: 'partial', amountPaid: 800, dueDate: '2025-06-10' },
  { id: 7, date: '2025-05-29', business: 'Honey', type: 'credit', amount: 950, customer: 'Health Food Store', paymentStatus: 'pending', dueDate: '2025-06-05' },
  { id: 8, date: '2025-05-29', business: 'Fish', type: 'cash', amount: 1800, customer: 'Harbor Grill', paymentStatus: 'paid' },
  { id: 9, date: '2025-05-28', business: 'Mushrooms', type: 'yoco', amount: 600, customer: 'Organic Market', paymentStatus: 'paid' },
  { id: 10, date: '2025-05-28', business: 'Honey', type: 'yoco', amount: 1100, customer: 'Artisan Foods', paymentStatus: 'paid' },
  { id: 11, date: '2025-05-25', business: 'Fish', type: 'credit', amount: 2500, customer: 'Atlantic Fisheries', paymentStatus: 'pending', dueDate: '2025-06-25' },
  { id: 12, date: '2025-05-22', business: 'Mushrooms', type: 'credit', amount: 1800, customer: 'Forest Floor Farms', paymentStatus: 'pending', dueDate: '2025-06-12' },
  { id: 13, date: '2025-05-20', business: 'Honey', type: 'cash', amount: 850, customer: 'Golden Hive Apiaries', paymentStatus: 'paid' },
];

export const mockSuppliers: Supplier[] = [
  {
    id: 1,
    name: 'Atlantic Fisheries',
    productType: 'Fresh Fish',
    lastOrderDate: '2025-05-25',
    contactEmail: 'orders@atlanticfish.com',
    phone: '+1-555-0123',
    outstandingBalance: 2500,
    creditTerms: 30
  },
  {
    id: 2,
    name: 'Golden Hive Apiaries',
    productType: 'Raw Honey',
    lastOrderDate: '2025-05-20',
    contactEmail: 'supply@goldenhive.com',
    phone: '+1-555-0124',
    outstandingBalance: 0,
    creditTerms: 15
  },
  {
    id: 3,
    name: 'Forest Floor Farms',
    productType: 'Organic Mushrooms',
    lastOrderDate: '2025-05-22',
    contactEmail: 'wholesale@forestfloor.com',
    phone: '+1-555-0125',
    outstandingBalance: 1800,
    creditTerms: 21
  }
];

export const mockCustomers: Customer[] = [
  {
    id: 1,
    name: 'Farmers Market',
    email: 'coordinator@farmersmarket.com',
    totalPurchases: 12500,
    lastPurchase: '2025-06-01',
    tags: ['Frequent Buyer', 'Wholesale'],
    outstandingBalance: 0,
    creditLimit: 5000
  },
  {
    id: 2,
    name: 'Ocean Fresh Restaurant',
    email: 'chef@oceanfresh.com',
    totalPurchases: 8900,
    lastPurchase: '2025-06-01',
    tags: ['Restaurant', 'Premium'],
    outstandingBalance: 0,
    creditLimit: 3000
  },
  {
    id: 3,
    name: 'Green Grocers',
    email: 'purchasing@greengrocers.com',
    totalPurchases: 5600,
    lastPurchase: '2025-05-31',
    tags: ['Retail', 'Organic'],
    outstandingBalance: 800,
    creditLimit: 2000
  },
  {
    id: 4,
    name: 'Health Food Store',
    email: 'orders@healthfood.com',
    totalPurchases: 3200,
    lastPurchase: '2025-05-29',
    tags: ['Retail'],
    outstandingBalance: 950,
    creditLimit: 1500
  },
  {
    id: 5,
    name: 'Farm to Table Co',
    email: 'procurement@farmtotable.com',
    totalPurchases: 4100,
    lastPurchase: '2025-05-30',
    tags: ['Wholesale', 'Organic'],
    outstandingBalance: 400,
    creditLimit: 2500
  }
];

export const mockOutstandingPayments: OutstandingPayment[] = [
  {
    id: 1,
    type: 'receivable',
    counterparty: 'Green Grocers',
    amount: 800,
    dueDate: '2025-06-15',
    daysPastDue: 0,
    business: 'Mushrooms',
    description: 'Invoice #1001 - Organic Mushroom Order'
  },
  {
    id: 2,
    type: 'receivable',
    counterparty: 'Health Food Store',
    amount: 950,
    dueDate: '2025-06-05',
    daysPastDue: 0,
    business: 'Honey',
    description: 'Invoice #1002 - Raw Honey Supply'
  },
  {
    id: 3,
    type: 'receivable',
    counterparty: 'Farm to Table Co',
    amount: 400,
    dueDate: '2025-06-10',
    daysPastDue: 0,
    business: 'Mushrooms',
    description: 'Invoice #1003 - Remaining Balance'
  },
  {
    id: 4,
    type: 'payable',
    counterparty: 'Atlantic Fisheries',
    amount: 2500,
    dueDate: '2025-06-25',
    daysPastDue: 0,
    business: 'Fish',
    description: 'Purchase Order #2001 - Fresh Fish Supply'
  },
  {
    id: 5,
    type: 'payable',
    counterparty: 'Forest Floor Farms',
    amount: 1800,
    dueDate: '2025-06-12',
    daysPastDue: 0,
    business: 'Mushrooms',
    description: 'Purchase Order #2002 - Mushroom Stock'
  }
];

export const mockSupplierTransactions: SupplierTransaction[] = [
  {
    id: 1,
    date: '2025-05-25',
    business: 'Fish',
    type: 'purchase',
    amount: 2500,
    description: 'Fresh Fish Supply - 50kg Premium Catch',
    status: 'pending',
    invoiceNumber: 'INV-2025-001'
  },
  {
    id: 2,
    date: '2025-05-20',
    business: 'Honey',
    type: 'purchase',
    amount: 850,
    description: 'Raw Honey Supply - 25L Premium Grade',
    status: 'completed',
    invoiceNumber: 'INV-2025-002'
  },
  {
    id: 3,
    date: '2025-05-22',
    business: 'Mushrooms',
    type: 'purchase',
    amount: 1800,
    description: 'Organic Mushroom Variety Pack - 40kg',
    status: 'pending',
    invoiceNumber: 'INV-2025-003'
  },
  {
    id: 4,
    date: '2025-05-15',
    business: 'Fish',
    type: 'payment',
    amount: 2200,
    description: 'Payment for previous fish order',
    status: 'completed'
  },
  {
    id: 5,
    date: '2025-05-18',
    business: 'Honey',
    type: 'payment',
    amount: 750,
    description: 'Payment for honey supply',
    status: 'completed'
  },
  {
    id: 6,
    date: '2025-05-12',
    business: 'Mushrooms',
    type: 'payment',
    amount: 1600,
    description: 'Payment for mushroom order',
    status: 'completed'
  },
  {
    id: 7,
    date: '2025-05-10',
    business: 'Fish',
    type: 'purchase',
    amount: 3000,
    description: 'Premium Seafood Selection - 60kg',
    status: 'completed',
    invoiceNumber: 'INV-2025-004'
  },
  {
    id: 8,
    date: '2025-05-08',
    business: 'Honey',
    type: 'purchase',
    amount: 920,
    description: 'Wildflower Honey - 30L',
    status: 'completed',
    invoiceNumber: 'INV-2025-005'
  }
];

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Fresh Salmon',
    business: 'Fish',
    category: 'Premium Fish',
    unit: 'kg',
    costPrice: 45,
    sellingPrice: 65,
    markupPercentage: 44.4,
    currentStock: 25,
    minStockLevel: 10,
    supplier: 'Atlantic Fisheries',
    lastRestocked: '2025-05-25',
    expiryDate: '2025-06-05'
  },
  {
    id: 2,
    name: 'Fresh Tuna',
    business: 'Fish',
    category: 'Premium Fish',
    unit: 'kg',
    costPrice: 55,
    sellingPrice: 80,
    markupPercentage: 45.5,
    currentStock: 15,
    minStockLevel: 8,
    supplier: 'Atlantic Fisheries',
    lastRestocked: '2025-05-25',
    expiryDate: '2025-06-08'
  },
  {
    id: 3,
    name: 'Wildflower Honey',
    business: 'Honey',
    category: 'Raw Honey',
    unit: 'L',
    costPrice: 28,
    sellingPrice: 45,
    markupPercentage: 60.7,
    currentStock: 50,
    minStockLevel: 15,
    supplier: 'Golden Hive Apiaries',
    lastRestocked: '2025-05-20'
  },
  {
    id: 4,
    name: 'Manuka Honey',
    business: 'Honey',
    category: 'Premium Honey',
    unit: 'L',
    costPrice: 85,
    sellingPrice: 135,
    markupPercentage: 58.8,
    currentStock: 20,
    minStockLevel: 5,
    supplier: 'Golden Hive Apiaries',
    lastRestocked: '2025-05-20'
  },
  {
    id: 5,
    name: 'Shiitake Mushrooms',
    business: 'Mushrooms',
    category: 'Exotic Mushrooms',
    unit: 'kg',
    costPrice: 35,
    sellingPrice: 55,
    markupPercentage: 57.1,
    currentStock: 12,
    minStockLevel: 5,
    supplier: 'Forest Floor Farms',
    lastRestocked: '2025-05-22',
    expiryDate: '2025-06-15'
  },
  {
    id: 6,
    name: 'Oyster Mushrooms',
    business: 'Mushrooms',
    category: 'Fresh Mushrooms',
    unit: 'kg',
    costPrice: 25,
    sellingPrice: 40,
    markupPercentage: 60,
    currentStock: 18,
    minStockLevel: 8,
    supplier: 'Forest Floor Farms',
    lastRestocked: '2025-05-22',
    expiryDate: '2025-06-12'
  }
];

export const mockStockMovements: StockMovement[] = [
  {
    id: 1,
    productId: 1,
    type: 'purchase',
    quantity: 50,
    unitCost: 45,
    date: '2025-05-25',
    reference: 'PO-2025-001',
    notes: 'Fresh delivery from Atlantic Fisheries'
  },
  {
    id: 2,
    productId: 1,
    type: 'sale',
    quantity: 25,
    unitPrice: 65,
    date: '2025-06-01',
    reference: 'TXN-001',
    notes: 'Sale to Ocean Fresh Restaurant'
  },
  {
    id: 3,
    productId: 3,
    type: 'purchase',
    quantity: 75,
    unitCost: 28,
    date: '2025-05-20',
    reference: 'PO-2025-002',
    notes: 'Honey delivery from Golden Hive'
  },
  {
    id: 4,
    productId: 3,
    type: 'sale',
    quantity: 25,
    unitPrice: 45,
    date: '2025-06-01',
    reference: 'TXN-002',
    notes: 'Sale to Farmers Market'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: 'INV-2025-001',
    transactionId: 1,
    customerName: 'Farmers Market',
    customerEmail: 'coordinator@farmersmarket.com',
    business: 'Honey',
    date: '2025-06-01',
    dueDate: '2025-06-15',
    items: [
      {
        productId: 3,
        productName: 'Wildflower Honey',
        quantity: 25,
        unitPrice: 45,
        total: 1125
      }
    ],
    subtotal: 1125,
    tax: 168.75,
    total: 1293.75,
    status: 'paid'
  },
  {
    id: 'INV-2025-002',
    transactionId: 2,
    customerName: 'Ocean Fresh Restaurant',
    customerEmail: 'chef@oceanfresh.com',
    business: 'Fish',
    date: '2025-06-01',
    items: [
      {
        productId: 1,
        productName: 'Fresh Salmon',
        quantity: 25,
        unitPrice: 65,
        total: 1625
      }
    ],
    subtotal: 1625,
    tax: 243.75,
    total: 1868.75,
    status: 'paid'
  }
];

export const mockEvents: Event[] = [
  {
    id: 1,
    name: 'Weekend Farmers Market',
    location: 'Central Park Market',
    date: '2024-06-01',
    business: 'Fish',
    marketCost: 150,
    totalRevenue: 850,
    notes: 'Great turnout, sold out of salmon',
    startTime: '08:00',
    endTime: '16:00',
  },
  {
    id: 2,
    name: 'Organic Market Day',
    location: 'Green Valley Mall',
    date: '2024-06-08',
    business: 'Honey',
    marketCost: 100,
    totalRevenue: 450,
    notes: 'New customers interested in raw honey',
    startTime: '09:00',
    endTime: '15:00',
  },
  {
    id: 3,
    name: 'Community Market',
    location: 'Town Square',
    date: '2024-06-15',
    business: 'Mushrooms',
    marketCost: 75,
    totalRevenue: 320,
    notes: 'Shiitake mushrooms were popular',
    startTime: '07:00',
    endTime: '14:00',
  },
  {
    id: 4,
    name: 'Holiday Market',
    location: 'Downtown Plaza',
    date: '2024-06-22',
    business: 'Fish',
    marketCost: 200,
    totalRevenue: 1200,
    notes: 'Best sales day so far',
    startTime: '08:30',
    endTime: '17:00',
  },
];

export const getMonthlyRevenue = (business?: string) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return mockTransactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      const matchesBusiness = !business || business === 'All' || t.business === business;
      const matchesMonth = transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
      return matchesBusiness && matchesMonth;
    })
    .reduce((sum, t) => sum + t.amount, 0);
};

export const getBusinessMetrics = (business: string) => {
  const businessTransactions = mockTransactions.filter(t => t.business === business);
  const totalSales = businessTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  return {
    totalSales,
    transactionCount: businessTransactions.length,
    averageTransaction: businessTransactions.length > 0 ? totalSales / businessTransactions.length : 0,
    recentTransactions: businessTransactions.slice(0, 5)
  };
};

export const getSupplierTransactions = (supplierName: string, business?: string) => {
  return mockSupplierTransactions.filter(transaction => {
    const matchesBusiness = !business || business === 'All' || transaction.business === business;
    return matchesBusiness;
  });
};

export const getSuppliersByBusiness = (business: string) => {
  if (business === 'All') return mockSuppliers;
  
  const businessToProductType = {
    'Fish': 'Fresh Fish',
    'Honey': 'Raw Honey',
    'Mushrooms': 'Organic Mushrooms'
  };
  
  return mockSuppliers.filter(supplier => 
    supplier.productType === businessToProductType[business as keyof typeof businessToProductType]
  );
};

export const getCustomersByBusiness = (business: string) => {
  if (business === 'All') return mockCustomers;
  
  const businessCustomers = mockTransactions
    .filter(transaction => transaction.business === business)
    .map(transaction => transaction.customer);
  
  return mockCustomers.filter(customer => 
    businessCustomers.includes(customer.name)
  );
};

export const getProductsByBusiness = (business: string) => {
  if (business === 'All') return mockProducts;
  return mockProducts.filter(product => product.business === business);
};

export const getStockMovements = (productId?: number, business?: string) => {
  return mockStockMovements.filter(movement => {
    const product = mockProducts.find(p => p.id === movement.productId);
    const matchesProduct = !productId || movement.productId === productId;
    const matchesBusiness = !business || business === 'All' || product?.business === business;
    return matchesProduct && matchesBusiness;
  });
};

export const getInvoicesByBusiness = (business: string) => {
  if (business === 'All') return mockInvoices;
  return mockInvoices.filter(invoice => invoice.business === business);
};

export const calculateMarkup = (costPrice: number, sellingPrice: number): number => {
  return ((sellingPrice - costPrice) / costPrice) * 100;
};

export const calculateSellingPrice = (costPrice: number, markupPercentage: number): number => {
  return costPrice * (1 + markupPercentage / 100);
};

export const getEventsByBusiness = (business: Business | 'All'): Event[] => {
  if (business === 'All') {
    return mockEvents;
  }
  return mockEvents.filter(event => event.business === business);
};
