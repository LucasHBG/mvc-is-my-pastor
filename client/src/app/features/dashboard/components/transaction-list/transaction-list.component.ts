import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Transaction, TransactionService } from '../../../../core/services/transaction.service';
import { DashboardService } from '../../../../core/services/dashboard.service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss'
})
export class TransactionListComponent implements OnInit {
  recentTransactions$: Observable<Transaction[]>;

  constructor(
    private transactionService: TransactionService,
    private dashboardService: DashboardService
  ) {
    this.recentTransactions$ = this.transactionService.getRecentTransactions(5);
  }

  ngOnInit(): void {}

  formatCurrency(amount: number): string {
    return this.dashboardService.formatCurrency(amount);
  }

  getStatusClass(status: string): string {
    return this.dashboardService.getStatusClass(status);
  }
}
