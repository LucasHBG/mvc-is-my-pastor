import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Transaction, TransactionService } from '../../core/services/transaction.service';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit {
  transactions$: Observable<Transaction[]>;
  selectedFilter: 'all' | 'completed' | 'pending' | 'failed' = 'all';
  selectedCategory: string = 'all';

  constructor(
    private transactionService: TransactionService,
    private dashboardService: DashboardService
  ) {
    this.transactions$ = this.transactionService.transactions$;
  }

  ngOnInit(): void {}

  formatCurrency(amount: number): string {
    return this.dashboardService.formatCurrency(amount);
  }

  getStatusClass(status: string): string {
    return this.dashboardService.getStatusClass(status);
  }

  filterTransactions(filter: 'all' | 'completed' | 'pending' | 'failed'): void {
    this.selectedFilter = filter;
    if (filter === 'all') {
      this.transactions$ = this.transactionService.transactions$;
    } else {
      this.transactions$ = this.transactionService.getTransactionsByStatus(filter);
    }
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'all') {
      this.transactions$ = this.transactionService.transactions$;
    } else {
      this.transactions$ = this.transactionService.getTransactionsByCategory(category);
    }
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.filterByCategory(target.value);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getUniqueCategories(): string[] {
    // This would typically come from the service
    return ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare'];
  }
}
