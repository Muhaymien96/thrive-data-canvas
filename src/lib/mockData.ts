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
