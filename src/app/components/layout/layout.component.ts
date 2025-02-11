import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <!-- Navigation -->
      <nav class="border-b border-gray-200 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 justify-between">
            <div class="flex">
              <div class="flex flex-shrink-0 items-center">
                <h1 class="text-xl font-bold text-indigo-600">
                  ExpenseTracker
                </h1>
              </div>
              <div class="ml-6 flex space-x-8">
                <a
                  routerLink="/expenses"
                  routerLinkActive="border-indigo-500 text-gray-900"
                  [routerLinkActiveOptions]="{ exact: true }"
                  class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors duration-200"
                >
                  Expenses
                </a>
                <a
                  routerLink="/analytics"
                  routerLinkActive="border-indigo-500 text-gray-900"
                  class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors duration-200"
                >
                  Analytics
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Page Content -->
      <router-outlet></router-outlet>
    </div>
  `,
})
export class LayoutComponent {}
