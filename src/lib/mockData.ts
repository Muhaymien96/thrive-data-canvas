
import { faker } from '@faker-js/faker';
import type { PaymentMethod, TransactionType, Business, BusinessWithAll, Transaction, YocoTransaction, Employee, Invoice, InvoiceItem, Customer, Supplier } from '@/types/transaction';

// Mock data generator functions
const generateTransaction = (id: string): Transaction => ({
  id,
  date: faker.date.past().toISOString().split('T')[0],
  business: faker.helpers.arrayElement(['Fish', 'Honey', 'Mushrooms']),
  type: faker.helpers.arrayElement(['sale', 'refund', 'expense', 'employee_cost']),
  amount: faker.number.float({ min: 10, max: 1000, precision: 0.01 }),
  description: faker.lorem.sentence(),
  customer: faker.person.fullName(),
  paymentMethod: faker.helpers.arrayElement(['card', 'cash', 'yoco', 'bank_transfer']),
  yocoTransactionId: faker.string.uuid(),
  yocoFee: faker.number.float({ min: 1, max: 50, precision: 0.01 }),
  yocoNetAmount: faker.number.float({ min: 10, max: 1000, precision: 0.01 }),
  yocoCardType: faker.helpers.arrayElement(['Visa', 'Mastercard']),
  yocoReference: faker.string.alphanumeric(10),
  cashReceived: faker.number.float({ min: 10, max: 1000, precision: 0.01 }),
  cashChange: faker.number.float({ min: 0, max: 10, precision: 0.01 }),
  employeeId: faker.string.uuid(),
  employeeName: faker.person.fullName(),
  costType: faker.helpers.arrayElement(['salary', 'wages', 'benefits', 'bonus', 'overtime']),
  hoursWorked: faker.number.float({ min: 1, max: 40, precision: 0.5 }),
  hourlyRate: faker.number.float({ min: 10, max: 50, precision: 0.01 }),
  invoiceNumber: faker.string.alphanumeric(8),
  invoiceGenerated: faker.datatype.boolean(),
  invoiceDate: faker.date.past().toISOString().split('T')[0],
  paymentStatus: faker.helpers.arrayElement(['paid', 'pending', 'overdue']),
  dueDate: faker.date.future().toISOString().split('T')[0],
  amountPaid: faker.number.float({ min: 0, max: 1000, precision: 0.01 }),
});

const generateYocoTransaction = (id: string): YocoTransaction => ({
  'Transaction ID': faker.string.uuid(),
  'Transaction Date': faker.date.past().toISOString().split('T')[0],
  'Amount': faker.number.float({ min: 10, max: 1000, precision: 0.01 }).toString(),
  'Processing Fee': faker.number.float({ min: 1, max: 50, precision: 0.01 }).toString(),
  'Net Amount': faker.number.float({ min: 10, max: 1000, precision: 0.01 }).toString(),
  'Card Type': faker.helpers.arrayElement(['Visa', 'Mastercard']),
  'Settlement Date': faker.date.future().toISOString().split('T')[0],
  'Reference': faker.string.alphanumeric(10),
});

const generateEmployee = (id: string): Employee => ({
  id,
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  business: faker.helpers.arrayElement(['Fish', 'Honey', 'Mushrooms']),
  position: faker.person.jobTitle(),
  hourlyRate: faker.number.float({ min: 15, max: 60, precision: 0.01 }),
  salary: faker.number.float({ min: 30000, max: 120000, precision: 0.01 }),
  startDate: faker.date.past().toISOString().split('T')[0],
  status: faker.helpers.arrayElement(['active', 'inactive']),
  paymentMethod: faker.helpers.arrayElement(['bank_transfer', 'cash', 'check']),
  bankDetails: {
    accountNumber: faker.finance.accountNumber(),
    bankName: faker.finance.iban(),
    branchCode: faker.string.numeric(6),
  },
});

const generateInvoiceItem = (id: string): InvoiceItem => ({
  id,
  description: faker.commerce.productName(),
  quantity: faker.number.int({ min: 1, max: 10 }),
  unitPrice: faker.number.float({ min: 10, max: 200, precision: 0.01 }),
  total: faker.number.float({ min: 10, max: 2000, precision: 0.01 }),
});

const generateInvoice = (id: string): Invoice => {
  const items = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => generateInvoiceItem(faker.string.uuid()));
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  return {
    id,
    invoiceNumber: faker.string.alphanumeric(8),
    customerId: faker.string.uuid(),
    customerName: faker.person.fullName(),
    customerEmail: faker.internet.email(),
    business: faker.helpers.arrayElement(['Fish', 'Honey', 'Mushrooms']),
    issueDate: faker.date.past().toISOString().split('T')[0],
    dueDate: faker.date.future().toISOString().split('T')[0],
    items,
    subtotal,
    tax,
    total,
    status: faker.helpers.arrayElement(['draft', 'sent', 'paid', 'overdue']),
    paymentMethod: faker.helpers.arrayElement(['card', 'cash', 'yoco', 'bank_transfer']),
    notes: faker.lorem.sentence(),
  };
};

const generateCustomer = (id: string): Customer => ({
  id,
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  address: faker.location.streetAddress(),
  business: faker.helpers.arrayElement(['Fish', 'Honey', 'Mushrooms']),
  totalSpent: faker.number.float({ min: 500, max: 5000, precision: 0.01 }),
  lastPurchase: faker.date.past().toISOString().split('T')[0],
  invoicePreference: faker.helpers.arrayElement(['email', 'print', 'both']),
  paymentTerms: faker.number.int({ min: 7, max: 60 }),
  totalPurchases: faker.number.int({ min: 1, max: 50 }),
  outstandingBalance: faker.number.float({ min: 0, max: 1000, precision: 0.01 }),
  creditLimit: faker.number.float({ min: 1000, max: 10000, precision: 0.01 }),
  tags: faker.helpers.arrayElements(['VIP', 'Regular', 'New', 'Bulk'], { min: 0, max: 2 }),
});

const generateSupplier = (id: string): Supplier => ({
  id,
  name: faker.company.name(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  address: faker.location.streetAddress(),
  business: faker.helpers.arrayElement(['Fish', 'Honey', 'Mushrooms']),
  category: faker.commerce.department(),
  totalSpent: faker.number.float({ min: 1000, max: 10000, precision: 0.01 }),
  rating: faker.number.int({ min: 1, max: 5 }),
  lastOrder: faker.date.past().toISOString().split('T')[0],
});

// Product type definition
export interface Product {
  id: string;
  name: string;
  price: number;
  business: string;
  category: string;
  stock: number;
  costPrice?: number;
  markup?: number;
}

// Mock data arrays
export const mockTransactions: Transaction[] = Array.from({ length: 50 }, (_, i) => generateTransaction(faker.string.uuid()));
export const mockYocoTransactions: YocoTransaction[] = Array.from({ length: 20 }, (_, i) => generateYocoTransaction(faker.string.uuid()));
export const mockEmployees: Employee[] = Array.from({ length: 10 }, (_, i) => generateEmployee(faker.string.uuid()));
export const mockInvoices: Invoice[] = Array.from({ length: 30 }, (_, i) => generateInvoice(faker.string.uuid()));
export const mockCustomers: Customer[] = Array.from({ length: 25 }, (_, i) => generateCustomer(faker.string.uuid()));
export const mockSuppliers: Supplier[] = Array.from({ length: 15 }, (_, i) => generateSupplier(faker.string.uuid()));

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Fresh Salmon',
    price: 450.00,
    business: 'Fish',
    category: 'Seafood',
    stock: 25,
    costPrice: 300.00,
    markup: 50,
  },
  {
    id: '2',
    name: 'Tuna Steaks',
    price: 380.00,
    business: 'Fish',
    category: 'Seafood',
    stock: 15,
    costPrice: 250.00,
    markup: 52,
  },
  {
    id: '3',
    name: 'Raw Honey',
    price: 120.00,
    business: 'Honey',
    category: 'Natural',
    stock: 50,
    costPrice: 80.00,
    markup: 50,
  },
  {
    id: '4',
    name: 'Honeycomb',
    price: 85.00,
    business: 'Honey',
    category: 'Natural',
    stock: 30,
    costPrice: 55.00,
    markup: 55,
  },
  {
    id: '5',
    name: 'Shiitake Mushrooms',
    price: 65.00,
    business: 'Mushrooms',
    category: 'Fresh',
    stock: 40,
    costPrice: 40.00,
    markup: 63,
  },
  {
    id: '6',
    name: 'Oyster Mushrooms',
    price: 55.00,
    business: 'Mushrooms',
    category: 'Fresh',
    stock: 35,
    costPrice: 35.00,
    markup: 57,
  },
];

// Helper functions to filter data
export const getTransactionsByBusiness = (business: BusinessWithAll): Transaction[] => {
  if (business === 'All') {
    return mockTransactions;
  }
  return mockTransactions.filter(transaction => transaction.business === business);
};

export const getInvoicesByBusiness = (business: BusinessWithAll): Invoice[] => {
  if (business === 'All') {
    return mockInvoices;
  }
  return mockInvoices.filter(invoice => invoice.business === business);
};

export const getEmployeesByBusiness = (business: BusinessWithAll): Employee[] => {
  if (business === 'All') {
    return mockEmployees;
  }
  return mockEmployees.filter(employee => employee.business === business);
};

export const getCustomersByBusiness = (business: BusinessWithAll): Customer[] => {
   if (business === 'All') {
    return mockCustomers;
  }
  return mockCustomers.filter(customer => customer.business === business);
};

export const getSuppliersByBusiness = (business: BusinessWithAll): Supplier[] => {
  if (business === 'All') {
   return mockSuppliers;
 }
 return mockSuppliers.filter(supplier => supplier.business === business);
};

export const getProductsByBusiness = (business: BusinessWithAll): Product[] => {
  if (business === 'All') {
    return mockProducts;
  }
  return mockProducts.filter(product => product.business === business);
};

// Business metrics and analytics functions
export const getBusinessMetrics = (business: BusinessWithAll) => {
  const transactions = getTransactionsByBusiness(business);
  const revenue = transactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense' || t.type === 'employee_cost')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalRevenue: revenue,
    totalExpenses: expenses,
    netProfit: revenue - expenses,
    transactionCount: transactions.length,
    averageTransactionValue: revenue / transactions.filter(t => t.type === 'sale').length || 0,
  };
};

export const getMonthlyRevenue = (business: BusinessWithAll, months: number = 12) => {
  const transactions = getTransactionsByBusiness(business);
  const monthlyData: { month: string; revenue: number; expenses: number }[] = [];
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
    
    const monthTransactions = transactions.filter(t => t.date.startsWith(monthKey));
    const revenue = monthTransactions
      .filter(t => t.type === 'sale')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthTransactions
      .filter(t => t.type === 'expense' || t.type === 'employee_cost')
      .reduce((sum, t) => sum + t.amount, 0);
    
    monthlyData.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      revenue,
      expenses,
    });
  }
  
  return monthlyData;
};

// Stock and inventory functions
export const getStockMovements = (productId?: string) => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: faker.string.uuid(),
    productId: productId || faker.helpers.arrayElement(mockProducts).id,
    productName: faker.helpers.arrayElement(mockProducts).name,
    type: faker.helpers.arrayElement(['in', 'out', 'adjustment']),
    quantity: faker.number.int({ min: 1, max: 20 }),
    date: faker.date.past().toISOString().split('T')[0],
    reason: faker.lorem.sentence(),
    reference: faker.string.alphanumeric(8),
  }));
};

// Events and compliance functions
export const getEventsByBusiness = (business: BusinessWithAll) => {
  return Array.from({ length: 10 }, (_, i) => ({
    id: faker.string.uuid(),
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    date: faker.date.future().toISOString().split('T')[0],
    time: faker.date.future().toTimeString().slice(0, 5),
    business: business === 'All' ? faker.helpers.arrayElement(['Fish', 'Honey', 'Mushrooms']) : business,
    type: faker.helpers.arrayElement(['meeting', 'delivery', 'inspection', 'maintenance']),
    status: faker.helpers.arrayElement(['upcoming', 'completed', 'cancelled']),
  }));
};

export const getComplianceData = (business: BusinessWithAll) => {
  return Array.from({ length: 15 }, (_, i) => ({
    id: faker.string.uuid(),
    documentName: faker.lorem.words(2),
    type: faker.helpers.arrayElement(['license', 'certificate', 'permit', 'inspection']),
    business: business === 'All' ? faker.helpers.arrayElement(['Fish', 'Honey', 'Mushrooms']) : business,
    issueDate: faker.date.past().toISOString().split('T')[0],
    expiryDate: faker.date.future().toISOString().split('T')[0],
    status: faker.helpers.arrayElement(['valid', 'expiring', 'expired']),
    authority: faker.company.name(),
  }));
};

// Product calculation utilities
export const calculateMarkup = (costPrice: number, sellingPrice: number): number => {
  if (costPrice === 0) return 0;
  return ((sellingPrice - costPrice) / costPrice) * 100;
};

export const calculateSellingPrice = (costPrice: number, markup: number): number => {
  return costPrice * (1 + markup / 100);
};

// Export Customer type for external use
export type { Customer };
