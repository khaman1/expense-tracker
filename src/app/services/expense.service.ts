import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Expense } from '../models/expense.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private expenses = new BehaviorSubject<Expense[]>([]);
  private readonly STORAGE_KEY = 'expenses';

  constructor() {
    this.loadExpenses();
    // Add sample data if no expenses exist
    if (this.expenses.value.length === 0) {
      this.addSampleData();
    }
  }

  private loadExpenses(): void {
    const storedExpenses = localStorage.getItem(this.STORAGE_KEY);
    if (storedExpenses) {
      const expenses = JSON.parse(storedExpenses);
      // Convert string dates back to Date objects
      const parsedExpenses = expenses.map((expense: any) => ({
        ...expense,
        date: new Date(expense.date),
      }));
      this.expenses.next(parsedExpenses);
    }
  }

  private addSampleData(): void {
    const today = new Date();
    const sampleExpenses: Omit<Expense, 'id'>[] = [
      {
        description: 'Grocery Shopping',
        amount: 156.78,
        category: 'food',
        date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000), // Yesterday
        notes: 'Weekly groceries from Whole Foods',
      },
      {
        description: 'Electric Bill',
        amount: 89.99,
        category: 'utilities',
        date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        notes: 'Monthly electricity payment',
      },
      {
        description: 'Movie Night',
        amount: 45.5,
        category: 'entertainment',
        date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        notes: 'Cinema tickets and snacks',
      },
      {
        description: 'Gas',
        amount: 52.3,
        category: 'transport',
        date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        description: 'Internet Bill',
        amount: 79.99,
        category: 'utilities',
        date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        notes: 'Monthly internet subscription',
      },
      {
        description: 'Restaurant Dinner',
        amount: 98.45,
        category: 'food',
        date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        notes: 'Dinner with family',
      },
      {
        description: 'Bus Pass',
        amount: 65.0,
        category: 'transport',
        date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        notes: 'Weekly transit pass',
      },
      {
        description: 'Concert Tickets',
        amount: 150.0,
        category: 'entertainment',
        date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        notes: 'Rock concert tickets',
      },
      {
        description: 'Office Supplies',
        amount: 34.99,
        category: 'other',
        date: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        notes: 'Notebooks and pens',
      },
      {
        description: 'Water Bill',
        amount: 45.67,
        category: 'utilities',
        date: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      },
      {
        description: 'Coffee Shop',
        amount: 12.5,
        category: 'food',
        date: today, // Today
        notes: 'Morning coffee and pastry',
      },
      {
        description: 'Gym Membership',
        amount: 75.0,
        category: 'other',
        date: today, // Today
        notes: 'Monthly fitness subscription',
      },
      {
        description: 'Taxi Ride',
        amount: 28.75,
        category: 'transport',
        date: today, // Today
        notes: 'Late night ride home',
      },
      {
        description: 'Phone Bill',
        amount: 65.99,
        category: 'utilities',
        date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        notes: 'Monthly mobile plan',
      },
      {
        description: 'Pizza Delivery',
        amount: 32.5,
        category: 'food',
        date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000), // Yesterday
      },
      {
        description: 'Video Game',
        amount: 59.99,
        category: 'entertainment',
        date: new Date('2024-02-08'),
        notes: 'New release game',
      },
      {
        description: 'Car Wash',
        amount: 25.0,
        category: 'transport',
        date: new Date('2024-02-05'),
      },
      {
        description: 'Streaming Service',
        amount: 15.99,
        category: 'entertainment',
        date: new Date('2024-02-01'),
        notes: 'Monthly Netflix subscription',
      },
      {
        description: 'Haircut',
        amount: 45.0,
        category: 'other',
        date: new Date('2024-02-09'),
      },
      {
        description: 'Lunch Meeting',
        amount: 42.75,
        category: 'food',
        date: new Date('2024-02-07'),
        notes: 'Business lunch with clients',
      },
    ];

    sampleExpenses.forEach((expense) => this.addExpense(expense));
  }

  private saveExpenses(expenses: Expense[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(expenses));
    this.expenses.next(expenses);
  }

  getExpenses(): Observable<Expense[]> {
    return this.expenses.asObservable();
  }

  getExpenseById(id: string): Expense | undefined {
    return this.expenses.value.find((expense) => expense.id === id);
  }

  addExpense(expense: Omit<Expense, 'id'>): void {
    const newExpense = {
      ...expense,
      id: crypto.randomUUID(),
    };
    const currentExpenses = this.expenses.value;
    this.saveExpenses([...currentExpenses, newExpense]);
  }

  updateExpense(updatedExpense: Expense): void {
    const currentExpenses = this.expenses.value;
    const updatedExpenses = currentExpenses.map((expense) =>
      expense.id === updatedExpense.id ? updatedExpense : expense
    );
    this.saveExpenses(updatedExpenses);
  }

  deleteExpense(id: string): void {
    const currentExpenses = this.expenses.value;
    const filteredExpenses = currentExpenses.filter(
      (expense) => expense.id !== id
    );
    this.saveExpenses(filteredExpenses);
  }

  clearAllExpenses(): void {
    this.saveExpenses([]);
  }
}
