
export interface Transaction {
  id: string;
  business: 'Fish' | 'Honey' | 'Mushrooms';
  type: 'cash' | 'yoco' | 'credit';
  date: string;
  amount: number;
  customer: string;
  paymentStatus?: 'paid' | 'partial' | 'pending';
  
  // Yoco-specific fields
  transactionId?: string;
  processingFee?: number;
  netAmount?: number;
  cardType?: string;
  settlementDate?: string;
  source?: 'manual' | 'yoco_import' | 'csv_import';
}

export interface YocoTransaction {
  'Transaction Date': string;
  'Transaction Time': string;
  'Transaction ID': string;
  'Amount': string;
  'Processing Fee': string;
  'Net Amount': string;
  'Card Type': string;
  'Settlement Date': string;
  'Reference': string;
}
