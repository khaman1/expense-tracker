import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'app-add-expense-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  template: `
    <div class="p-6">
      <form #expenseForm="ngForm" (ngSubmit)="onSubmit(expenseForm)" novalidate>
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              Add New Expense
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Please fill in the expense details below
            </p>
          </div>

          <div>
            <label
              for="date"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Date</label
            >
            <div class="mt-2">
              <input
                type="date"
                id="date"
                name="date"
                [ngModel]="today | date : 'yyyy-MM-dd'"
                (ngModelChange)="expense.date = $event"
                required
                #dateInput="ngModel"
                class="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                [class.ring-red-300]="
                  dateInput.invalid &&
                  (dateInput.dirty || dateInput.touched || formSubmitted)
                "
              />
              @if (dateInput.invalid && (dateInput.dirty || dateInput.touched ||
              formSubmitted)) {
              <p class="mt-1 text-sm text-red-600">Date is required</p>
              }
            </div>
          </div>

          <div>
            <label
              for="description"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Description</label
            >
            <div class="mt-2">
              <input
                type="text"
                id="description"
                name="description"
                [(ngModel)]="expense.description"
                required
                minlength="3"
                #descInput="ngModel"
                class="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                [class.ring-red-300]="
                  descInput.invalid &&
                  (descInput.dirty || descInput.touched || formSubmitted)
                "
                placeholder="Enter expense description"
              />
              @if (descInput.invalid && (descInput.dirty || descInput.touched ||
              formSubmitted)) { @if (descInput.errors?.['required']) {
              <p class="mt-1 text-sm text-red-600">Description is required</p>
              } @else if (descInput.errors?.['minlength']) {
              <p class="mt-1 text-sm text-red-600">
                Description must be at least 3 characters
              </p>
              } }
            </div>
          </div>

          <div>
            <label
              for="category"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Category</label
            >
            <div class="mt-2">
              <select
                id="category"
                name="category"
                [(ngModel)]="expense.category"
                required
                #categoryInput="ngModel"
                class="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                [class.ring-red-300]="
                  categoryInput.invalid &&
                  (categoryInput.dirty ||
                    categoryInput.touched ||
                    formSubmitted)
                "
              >
                <option value="" disabled selected>Select a category</option>
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="utilities">Utilities</option>
                <option value="entertainment">Entertainment</option>
                <option value="other">Other</option>
              </select>
              @if (categoryInput.invalid && (categoryInput.dirty ||
              categoryInput.touched || formSubmitted)) {
              <p class="mt-1 text-sm text-red-600">Category is required</p>
              }
            </div>
          </div>

          <div>
            <label
              for="amount"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Amount</label
            >
            <div class="mt-2">
              <input
                type="number"
                id="amount"
                name="amount"
                [(ngModel)]="expense.amount"
                required
                min="0.01"
                step="0.01"
                #amountInput="ngModel"
                class="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                [class.ring-red-300]="
                  amountInput.invalid &&
                  (amountInput.dirty || amountInput.touched || formSubmitted)
                "
                placeholder="0.00"
              />
              @if (amountInput.invalid && (amountInput.dirty ||
              amountInput.touched || formSubmitted)) { @if
              (amountInput.errors?.['required']) {
              <p class="mt-1 text-sm text-red-600">Amount is required</p>
              } @else if (amountInput.errors?.['min']) {
              <p class="mt-1 text-sm text-red-600">
                Amount must be greater than 0
              </p>
              } }
            </div>
          </div>

          <div>
            <label
              for="notes"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Notes (Optional)</label
            >
            <div class="mt-2">
              <textarea
                id="notes"
                name="notes"
                [(ngModel)]="expense.notes"
                rows="3"
                class="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Add any additional notes"
              ></textarea>
            </div>
          </div>
        </div>

        <div
          class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
        >
          <button
            type="submit"
            class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create
          </button>
          <button
            type="button"
            (click)="dialogRef.close()"
            class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
})
export class AddExpenseModalComponent {
  expense: Partial<Expense> = {
    category: undefined,
  };
  formSubmitted = false;
  today = new Date();

  constructor(public dialogRef: MatDialogRef<AddExpenseModalComponent>) {}

  onSubmit(form: NgForm): void {
    this.formSubmitted = true;

    if (form.valid) {
      // Ensure we use today's date
      this.expense.date = this.today;
      this.dialogRef.close(this.expense);
    }
  }
}
