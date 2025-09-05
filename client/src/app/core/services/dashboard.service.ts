import { Injectable } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { AccountService } from './account.service';
import { TransactionService } from './transaction.service';
import { AuthService } from './auth.service';

export interface QuickAction {
  title: string;
  icon: string;
  route: string;
  description?: string;
}

export interface DashboardData {
  totalBalance: number;
  accountCount: number;
  recentTransactionsCount: number;
  pendingTransactionsCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private quickActions: QuickAction[] = [
    { 
      title: 'Send Money', 
      icon: '💸', 
      route: '/app/transfer',
      description: 'Transfer money to another account'
    },
    { 
      title: 'Request Payment', 
      icon: '📨', 
      route: '/app/request',
      description: 'Send a payment request'
    },
    { 
      title: 'Add Card', 
      icon: '💳', 
      route: '/app/cards',
      description: 'Order a new payment card'
    },
    { 
      title: 'View Reports', 
      icon: '📊', 
      route: '/app/reports',
      description: 'Access financial reports'
    }
  ];

  constructor(
    private accountService: AccountService,
    private transactionService: TransactionService,
    private authService: AuthService
  ) {}

  getDashboardData(): Observable<DashboardData> {
    return combineLatest([
      this.accountService.accounts$,
      this.transactionService.transactions$
    ]).pipe(
      map(([accounts, transactions]) => {
        const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
        const accountCount = accounts.length;
        const recentTransactionsCount = transactions.length;
        const pendingTransactionsCount = transactions.filter(t => t.status === 'pending').length;

        return {
          totalBalance,
          accountCount,
          recentTransactionsCount,
          pendingTransactionsCount
        };
      })
    );
  }

  getQuickActions(): QuickAction[] {
    return this.quickActions;
  }

  formatCurrency(amount: number, currency: string = 'EUR'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'failed': return 'status-failed';
      default: return '';
    }
  }
}
