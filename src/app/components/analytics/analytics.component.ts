import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense.model';
import type { EChartsOption, PieSeriesOption } from 'echarts';

type TimeRange = '1D' | '1W';

interface CategoryTotal {
  category: string;
  total: number;
  percentage: number;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent implements OnInit {
  timeRanges: TimeRange[] = ['1D', '1W'];
  selectedRange: TimeRange = '1D';
  expenses: Expense[] = [];
  categoryTotals: CategoryTotal[] = [];
  chartInitOpts = {
    renderer: 'canvas',
  };

  private readonly defaultPieSeries: PieSeriesOption = {
    name: 'Expenses by Category',
    type: 'pie',
    radius: ['40%', '70%'],
    center: ['60%', '50%'],
    avoidLabelOverlap: false,
    itemStyle: {
      borderRadius: 10,
      borderColor: '#fff',
      borderWidth: 2,
    },
    label: {
      show: true,
      position: 'outside',
      formatter: '{b}: ${c} ({d}%)',
      fontSize: 12,
    },
    emphasis: {
      label: {
        show: true,
        fontSize: 14,
        fontWeight: 'bold',
      },
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
      },
    },
    labelLine: {
      show: true,
      length: 15,
      length2: 10,
    },
    data: [],
  };

  pieChartOption: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const value = Number(params.value).toFixed(2);
        const percent = Number(params.percent).toFixed(2);
        return `${params.name}<br/>$${value} (${percent}%)`;
      },
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center',
    },
    series: [this.defaultPieSeries],
  };

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.expenseService.getExpenses().subscribe({
      next: (expenses) => {
        this.expenses = expenses.map((expense) => ({
          ...expense,
          date: new Date(expense.date),
        }));
        this.updateCharts();
      },
      error: (error) => {
        console.error('Error loading expenses:', error);
      },
    });
  }

  setTimeRange(range: TimeRange): void {
    this.selectedRange = range;
    this.updateCharts();
  }

  private updateCharts(): void {
    const filteredExpenses = this.filterExpensesByTimeRange();
    this.calculateCategoryTotals(filteredExpenses);
    this.updatePieChartOptions();
  }

  private filterExpensesByTimeRange(): Expense[] {
    const now = new Date();
    const startDate = new Date();

    switch (this.selectedRange) {
      case '1D':
        startDate.setHours(0, 0, 0, 0);
        break;
      case '1W':
        startDate.setDate(now.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        break;
    }

    return this.expenses.filter(
      (expense) => expense.date >= startDate && expense.date <= now
    );
  }

  private calculateCategoryTotals(expenses: Expense[]): void {
    const categoryMap = new Map<string, number>();
    let total = 0;

    expenses.forEach((expense) => {
      const currentTotal = categoryMap.get(expense.category) || 0;
      const newTotal = currentTotal + expense.amount;
      categoryMap.set(expense.category, newTotal);
      total += expense.amount;
    });

    this.categoryTotals = Array.from(categoryMap.entries())
      .map(([category, categoryTotal]) => ({
        category,
        total: categoryTotal,
        percentage: total > 0 ? (categoryTotal / total) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }

  private updatePieChartOptions(): void {
    if (this.categoryTotals.length === 0) {
      this.pieChartOption = {
        ...this.pieChartOption,
        series: [
          {
            ...this.defaultPieSeries,
            data: [],
          },
        ],
      };
      return;
    }

    const chartData = this.categoryTotals.map((category) => ({
      name: category.category,
      value: Number(category.total.toFixed(2)),
      itemStyle: {
        color: this.getCategoryColor(category.category),
      },
    }));

    this.pieChartOption = {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const value = Number(params.value).toFixed(2);
          const percent = Number(params.percent).toFixed(2);
          return `${params.name}<br/>$${value} (${percent}%)`;
        },
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'center',
      },
      series: [
        {
          ...this.defaultPieSeries,
          data: chartData,
        },
      ],
    };
  }

  getCategoryColorClass(category: string): string {
    const baseClasses = 'bg-opacity-10 border border-opacity-20 ';
    switch (category) {
      case 'food':
        return baseClasses + 'bg-green-500 border-green-600';
      case 'transport':
        return baseClasses + 'bg-blue-500 border-blue-600';
      case 'utilities':
        return baseClasses + 'bg-amber-500 border-amber-600';
      case 'entertainment':
        return baseClasses + 'bg-purple-500 border-purple-600';
      default:
        return baseClasses + 'bg-gray-500 border-gray-600';
    }
  }

  private getCategoryColor(category: string): string {
    switch (category) {
      case 'food':
        return '#22c55e';
      case 'transport':
        return '#3b82f6';
      case 'utilities':
        return '#f59e0b';
      case 'entertainment':
        return '#a855f7';
      default:
        return '#6b7280';
    }
  }
}
