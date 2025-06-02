
export interface Transaction {
  id: number;
  date: string;
  business: 'Fish' | 'Honey' | 'Mushrooms';
  type: 'cash' | 'yoco' | 'credit';
  amount: number;
  customer: string;
}

export interface Supplier {
  id: number;
  name: string;
  productType: string;
  lastOrderDate: string;
  contactEmail: string;
  phone: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  totalPurchases: number;
  lastPurchase: string;
  tags: string[];
}

export const mockTransactions: Transaction[] = [
  { id: 1, date: '2025-06-01', business: 'Honey', type: 'yoco', amount: 1500, customer: 'Farmers Market' },
  { id: 2, date: '2025-06-01', business: 'Fish', type: 'cash', amount: 2500, customer: 'Ocean Fresh Restaurant' },
  { id: 3, date: '2025-05-31', business: 'Mushrooms', type: 'credit', amount: 800, customer: 'Green Grocers' },
  { id: 4, date: '2025-05-31', business: 'Honey', type: 'cash', amount: 750, customer: 'Local Bakery' },
  { id: 5, date: '2025-05-30', business: 'Fish', type: 'yoco', amount: 3200, customer: 'Seafood Bistro' },
  { id: 6, date: '2025-05-30', business: 'Mushrooms', type: 'yoco', amount: 1200, customer: 'Farm to Table Co' },
  { id: 7, date: '2025-05-29', business: 'Honey', type: 'credit', amount: 950, customer: 'Health Food Store' },
  { id: 8, date: '2025-05-29', business: 'Fish', type: 'cash', amount: 1800, customer: 'Harbor Grill' },
  { id: 9, date: '2025-05-28', business: 'Mushrooms', type: 'yoco', amount: 600, customer: 'Organic Market' },
  { id: 10, date: '2025-05-28', business: 'Honey', type: 'yoco', amount: 1100, customer: 'Artisan Foods' },
];

export const mockSuppliers: Supplier[] = [
  {
    id: 1,
    name: 'Atlantic Fisheries',
    productType: 'Fresh Fish',
    lastOrderDate: '2025-05-25',
    contactEmail: 'orders@atlanticfish.com',
    phone: '+1-555-0123'
  },
  {
    id: 2,
    name: 'Golden Hive Apiaries',
    productType: 'Raw Honey',
    lastOrderDate: '2025-05-20',
    contactEmail: 'supply@goldenhive.com',
    phone: '+1-555-0124'
  },
  {
    id: 3,
    name: 'Forest Floor Farms',
    productType: 'Organic Mushrooms',
    lastOrderDate: '2025-05-22',
    contactEmail: 'wholesale@forestfloor.com',
    phone: '+1-555-0125'
  }
];

export const mockCustomers: Customer[] = [
  {
    id: 1,
    name: 'Farmers Market',
    email: 'coordinator@farmersmarket.com',
    totalPurchases: 12500,
    lastPurchase: '2025-06-01',
    tags: ['Frequent Buyer', 'Wholesale']
  },
  {
    id: 2,
    name: 'Ocean Fresh Restaurant',
    email: 'chef@oceanfresh.com',
    totalPurchases: 8900,
    lastPurchase: '2025-06-01',
    tags: ['Restaurant', 'Premium']
  },
  {
    id: 3,
    name: 'Green Grocers',
    email: 'purchasing@greengrocers.com',
    totalPurchases: 5600,
    lastPurchase: '2025-05-31',
    tags: ['Retail', 'Organic']
  }
];

// Utility functions for data analysis
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
