import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense.model';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { AddExpenseModalComponent } from '../add-expense-modal/add-expense-modal.component';

type SortColumn = 'date' | 'description' | 'category' | 'amount';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    AddExpenseModalComponent,
    ConfirmationDialogComponent,
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div class="py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center mb-8">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                Expense Dashboard
              </h1>
              <p class="mt-2 text-sm text-gray-600">
                Manage and track your expenses efficiently
              </p>
            </div>
            <div class="flex space-x-4">
              <button
                (click)="onAddExpense()"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <svg
                  class="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Expense
              </button>
              <button
                *ngIf="selectedExpenses.size > 0"
                (click)="onDeleteSelected()"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <svg
                  class="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Selected ({{ selectedExpenses.size }})
              </button>
            </div>
          </div>

          <div
            class="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
          >
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr class="bg-gray-50">
                    <th scope="col" class="w-12 pl-6 py-4">
                      <input
                        type="checkbox"
                        [checked]="isAllSelected"
                        (change)="toggleAllSelection()"
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
                      />
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer group"
                      (click)="onSort('date')"
                    >
                      <div class="flex items-center">
                        Date @if (sortColumn === 'date') {
                        <svg
                          class="ml-2 h-4 w-4 text-gray-500"
                          [class.rotate-180]="sortDirection === 'desc'"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                        } @else {
                        <svg
                          class="ml-2 h-4 w-4 text-gray-300 opacity-0 group-hover:opacity-100"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                        }
                      </div>
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer group"
                      (click)="onSort('description')"
                    >
                      <div class="flex items-center">
                        Description @if (sortColumn === 'description') {
                        <svg
                          class="ml-2 h-4 w-4 text-gray-500"
                          [class.rotate-180]="sortDirection === 'desc'"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                        } @else {
                        <svg
                          class="ml-2 h-4 w-4 text-gray-300 opacity-0 group-hover:opacity-100"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                        }
                      </div>
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer group"
                      (click)="onSort('category')"
                    >
                      <div class="flex items-center">
                        Category @if (sortColumn === 'category') {
                        <svg
                          class="ml-2 h-4 w-4 text-gray-500"
                          [class.rotate-180]="sortDirection === 'desc'"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                        } @else {
                        <svg
                          class="ml-2 h-4 w-4 text-gray-300 opacity-0 group-hover:opacity-100"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                        }
                      </div>
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer group"
                      (click)="onSort('amount')"
                    >
                      <div class="flex items-center">
                        Amount @if (sortColumn === 'amount') {
                        <svg
                          class="ml-2 h-4 w-4 text-gray-500"
                          [class.rotate-180]="sortDirection === 'desc'"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                        } @else {
                        <svg
                          class="ml-2 h-4 w-4 text-gray-300 opacity-0 group-hover:opacity-100"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                        }
                      </div>
                    </th>
                    <th scope="col" class="relative px-6 py-4">
                      <span class="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  @for (expense of expenses; track expense.id) {
                  <tr
                    [class.bg-indigo-50]="selectedExpenses.has(expense.id)"
                    class="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td class="pl-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        [checked]="selectedExpenses.has(expense.id)"
                        (change)="toggleExpenseSelection(expense.id)"
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
                      />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-sm font-medium text-gray-900">
                        {{ expense.date | date : 'MMM d, y' }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm font-bold text-gray-900">
                        {{ expense.description }}
                      </div>
                      @if (expense.notes) {
                      <div
                        class="text-sm text-gray-500 mt-0.5 line-clamp-1 font-light"
                      >
                        {{ expense.notes }}
                      </div>
                      }
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                        [ngClass]="{
                          'bg-green-100 text-green-800 ring-1 ring-green-600/20':
                            expense.category === 'food',
                          'bg-blue-100 text-blue-800 ring-1 ring-blue-600/20':
                            expense.category === 'transport',
                          'bg-amber-100 text-amber-800 ring-1 ring-amber-600/20':
                            expense.category === 'utilities',
                          'bg-purple-100 text-purple-800 ring-1 ring-purple-600/20':
                            expense.category === 'entertainment',
                          'bg-gray-100 text-gray-800 ring-1 ring-gray-600/20':
                            expense.category === 'other'
                        }"
                      >
                        {{ expense.category }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-sm font-medium text-gray-900">
                        {{ '$' + expense.amount.toFixed(2) }}
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                    >
                      <button
                        (click)="onEditExpense(expense.id)"
                        class="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        (click)="onDeleteExpense(expense.id)"
                        class="text-red-600 hover:text-red-900 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  } @empty {
                  <tr>
                    <td
                      colspan="6"
                      class="px-6 py-12 text-center text-gray-500 bg-gray-50"
                    >
                      <svg
                        class="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1"
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <h3 class="mt-2 text-sm font-medium text-gray-900">
                        No expenses found
                      </h3>
                      <p class="mt-1 text-sm text-gray-500">
                        Get started by creating a new expense.
                      </p>
                      <div class="mt-6">
                        <button
                          (click)="onAddExpense()"
                          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <svg
                            class="-ml-1 mr-2 h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          New Expense
                        </button>
                      </div>
                    </td>
                  </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  expenses: Expense[] = [];
  selectedExpenses = new Set<string>();
  sortColumn: SortColumn = 'date';
  sortDirection: SortDirection = 'desc';

  get isAllSelected(): boolean {
    return (
      this.expenses.length > 0 &&
      this.selectedExpenses.size === this.expenses.length
    );
  }

  constructor(
    private expenseService: ExpenseService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.expenseService.getExpenses().subscribe((expenses: Expense[]) => {
      this.expenses = this.sortExpenses(expenses);
    });
  }

  onSort(column: SortColumn): void {
    if (this.sortColumn === column) {
      // Toggle direction if same column
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // New column, default to ascending
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.expenses = this.sortExpenses([...this.expenses]);
  }

  private sortExpenses(expenses: Expense[]): Expense[] {
    return expenses.sort((a, b) => {
      let comparison = 0;

      switch (this.sortColumn) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'description':
          comparison = a.description.localeCompare(b.description);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  toggleExpenseSelection(id: string): void {
    if (this.selectedExpenses.has(id)) {
      this.selectedExpenses.delete(id);
    } else {
      this.selectedExpenses.add(id);
    }
  }

  toggleAllSelection(): void {
    if (this.isAllSelected) {
      this.selectedExpenses.clear();
    } else {
      this.expenses.forEach((expense) => this.selectedExpenses.add(expense.id));
    }
  }

  onAddExpense(): void {
    const dialogRef = this.dialog.open(AddExpenseModalComponent);

    dialogRef.afterClosed().subscribe((result?: Omit<Expense, 'id'>) => {
      if (result) {
        this.expenseService.addExpense(result);
      }
    });
  }

  onEditExpense(id: string): void {
    this.router.navigate(['/expenses/edit', id]);
  }

  onDeleteExpense(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe((result?: boolean) => {
      if (result) {
        this.expenseService.deleteExpense(id);
        this.selectedExpenses.delete(id);
      }
    });
  }

  onDeleteSelected(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Selected Expenses',
        message: `Are you sure you want to delete ${this.selectedExpenses.size} selected expenses? This action cannot be undone.`,
      },
    });

    dialogRef.afterClosed().subscribe((result?: boolean) => {
      if (result) {
        this.selectedExpenses.forEach((id) => {
          this.expenseService.deleteExpense(id);
        });
        this.selectedExpenses.clear();
      }
    });
  }
}
