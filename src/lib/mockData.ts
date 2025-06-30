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

// Mock data arrays
export const mockTransactions: Transaction[] = Array.from({ length: 50 }, (_, i) => generateTransaction(faker.string.uuid()));
export const mockYocoTransactions: YocoTransaction[] = Array.from({ length: 20 }, (_, i) => generateYocoTransaction(faker.string.uuid()));
export const mockEmployees: Employee[] = Array.from({ length: 10 }, (_, i) => generateEmployee(faker.string.uuid()));
export const mockInvoices: Invoice[] = Array.from({ length: 30 }, (_, i) => generateInvoice(faker.string.uuid()));
export const mockCustomers: Customer[] = Array.from({ length: 25 }, (_, i) => generateCustomer(faker.string.uuid()));
export const mockSuppliers: Supplier[] = Array.from({ length: 15 }, (_, i) => generateSupplier(faker.string.uuid()));

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

export const mockProducts = [
  {
    id: '1',
    name: 'Fresh Salmon',
    price: 450.00,
    business: 'Fish',
    category: 'Seafood',
    stock: 25,
  },
  {
    id: '2',
    name: 'Tuna Steaks',
    price: 380.00,
    business: 'Fish',
    category: 'Seafood',
    stock: 15,
  },
  {
    id: '3',
    name: 'Raw Honey',
    price: 120.00,
    business: 'Honey',
    category: 'Natural',
    stock: 50,
  },
  {
    id: '4',
    name: 'Honeycomb',
    price: 85.00,
    business: 'Honey',
    category: 'Natural',
    stock: 30,
  },
  {
    id: '5',
    name: 'Shiitake Mushrooms',
    price: 65.00,
    business: 'Mushrooms',
    category: 'Fresh',
    stock: 40,
  },
  {
    id: '6',
    name: 'Oyster Mushrooms',
    price: 55.00,
    business: 'Mushrooms',
    category: 'Fresh',
    stock: 35,
  },
];
