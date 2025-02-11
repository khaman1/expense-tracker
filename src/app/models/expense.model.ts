export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: 'food' | 'transport' | 'utilities' | 'entertainment' | 'other';
  date: Date;
  notes?: string;
}
