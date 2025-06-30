
export type PaymentMethod = 'card' | 'cash' | 'yoco' | 'bank_transfer';
export type TransactionType = 'sale' | 'refund' | 'expense' | 'employee_cost';
export type Business = 'Fish' | 'Honey' | 'Mushrooms';
export type BusinessWithAll = Business | 'All';

export interface Transaction {
  id: string;
  date: string;
  business: string;
  type: TransactionType;
  amount: number;
  description: string;
  customer: string;
  paymentMethod: PaymentMethod;
  
  // Yoco specific fields
  yocoTransactionId?: string;
  yocoFee?: number;
  yocoNetAmount?: number;
  yocoCardType?: string;
  yocoReference?: string;
  
  // Cash specific fields
  cashReceived?: number;
  cashChange?: number;
  
  // Employee cost specific fields
  employeeId?: string;
  employeeName?: string;
  costType?: 'salary' | 'wages' | 'benefits' | 'bonus' | 'overtime';
  hoursWorked?: number;
  hourlyRate?: number;
  
  // Invoice fields
  invoiceNumber?: string;
  invoiceGenerated?: boolean;
  invoiceDate?: string;
}

export interface YocoTransaction {
  'Transaction ID': string;
  'Transaction Date': string;
  'Amount': string;
  'Processing Fee': string;
  'Net Amount': string;
  'Card Type': string;
  'Settlement Date': string;
  'Reference': string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  business: string;
  position: string;
  hourlyRate: number;
  salary?: number;
  startDate: string;
  status: 'active' | 'inactive';
  paymentMethod: 'bank_transfer' | 'cash' | 'check';
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    branchCode: string;
  };
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  business: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  business: string;
  totalSpent: number;
  lastPurchase: string;
  invoicePreference: 'email' | 'print' | 'both';
  paymentTerms: number; // days
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  business: string;
  category: string;
  totalSpent: number;
  rating: number;
  lastOrder: string;
}
