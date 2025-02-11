import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { AnalyticsComponent } from './analytics.component';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense.model';
import { NgxEchartsModule } from 'ngx-echarts';

describe('AnalyticsComponent', () => {
  let component: AnalyticsComponent;
  let fixture: ComponentFixture<AnalyticsComponent>;
  let expenseService: jasmine.SpyObj<ExpenseService>;
  let mockExpenses$: BehaviorSubject<Expense[]>;

  const mockExpenses: Expense[] = [
    {
      id: '1',
      description: 'Grocery Shopping',
      amount: 100.0,
      category: 'food',
      date: new Date(),
      notes: 'Weekly groceries',
    },
    {
      id: '2',
      description: 'Electric Bill',
      amount: 150.0,
      category: 'utilities',
      date: new Date(),
      notes: 'Monthly bill',
    },
    {
      id: '3',
      description: 'Movie Tickets',
      amount: 50.0,
      category: 'entertainment',
      date: new Date(),
      notes: 'Weekend movie',
    },
  ];

  beforeEach(async () => {
    mockExpenses$ = new BehaviorSubject<Expense[]>(mockExpenses);
    expenseService = jasmine.createSpyObj('ExpenseService', ['getExpenses']);
    expenseService.getExpenses.and.returnValue(mockExpenses$.asObservable());

    await TestBed.configureTestingModule({
      imports: [
        AnalyticsComponent,
        NgxEchartsModule.forRoot({ echarts: () => import('echarts') }),
      ],
      providers: [{ provide: ExpenseService, useValue: expenseService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default time range', () => {
    expect(component.selectedRange).toBe('1D');
    expect(component.timeRanges).toEqual(['1D', '1W']);
  });

  it('should load expenses on init', () => {
    expect(expenseService.getExpenses).toHaveBeenCalled();
    expect(component.expenses.length).toBe(mockExpenses.length);
  });

  it('should calculate category totals correctly', () => {
    // Force update to ensure calculations are done
    component.setTimeRange('1D');

    const categoryTotals = component.categoryTotals;
    expect(categoryTotals.length).toBe(3); // We have 3 different categories in mock data

    // Find food category total
    const foodTotal = categoryTotals.find((ct) => ct.category === 'food');
    expect(foodTotal?.total).toBe(100.0);

    // Find utilities category total
    const utilitiesTotal = categoryTotals.find(
      (ct) => ct.category === 'utilities'
    );
    expect(utilitiesTotal?.total).toBe(150.0);

    // Find entertainment category total
    const entertainmentTotal = categoryTotals.find(
      (ct) => ct.category === 'entertainment'
    );
    expect(entertainmentTotal?.total).toBe(50.0);
  });

  it('should update time range and recalculate totals', () => {
    const spy = spyOn<any>(component, 'updateCharts').and.callThrough();

    component.setTimeRange('1W');

    expect(component.selectedRange).toBe('1W');
    expect(spy).toHaveBeenCalled();
  });

  it('should return correct category color class', () => {
    expect(component.getCategoryColorClass('food')).toContain('bg-green-500');
    expect(component.getCategoryColorClass('transport')).toContain(
      'bg-blue-500'
    );
    expect(component.getCategoryColorClass('utilities')).toContain(
      'bg-amber-500'
    );
    expect(component.getCategoryColorClass('entertainment')).toContain(
      'bg-purple-500'
    );
    expect(component.getCategoryColorClass('other')).toContain('bg-gray-500');
  });

  it('should filter expenses by time range correctly', () => {
    // Create expenses with different dates
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 8);

    const mixedDateExpenses: Expense[] = [
      {
        id: '1',
        description: 'Today Expense',
        amount: 100,
        category: 'food',
        date: today,
      },
      {
        id: '2',
        description: 'Yesterday Expense',
        amount: 200,
        category: 'utilities',
        date: yesterday,
      },
      {
        id: '3',
        description: 'Last Week Expense',
        amount: 300,
        category: 'entertainment',
        date: lastWeek,
      },
    ];

    mockExpenses$.next(mixedDateExpenses);
    fixture.detectChanges();

    // Test 1D filter
    component.setTimeRange('1D');
    expect(
      component.categoryTotals.reduce((acc, curr) => acc + curr.total, 0)
    ).toBe(100); // Only today's expense

    // Test 1W filter
    component.setTimeRange('1W');
    expect(
      component.categoryTotals.reduce((acc, curr) => acc + curr.total, 0)
    ).toBe(300); // Today's and yesterday's expenses
  });

  it('should update pie chart options when data changes', () => {
    component.setTimeRange('1D');

    // Check if pie chart options are properly set
    expect(component.pieChartOption.series).toBeTruthy();
    expect(Array.isArray(component.pieChartOption.series)).toBeTrue();

    const series = component.pieChartOption.series as any[];
    expect(series[0].type).toBe('pie');
    expect(series[0].data.length).toBeGreaterThan(0);
  });

  it('should handle empty expenses gracefully', () => {
    mockExpenses$.next([]);
    fixture.detectChanges();

    expect(component.categoryTotals.length).toBe(0);
    expect(component.pieChartOption.series).toBeTruthy();

    const series = component.pieChartOption.series as any[];
    expect(series[0].data.length).toBe(0);
  });
});
