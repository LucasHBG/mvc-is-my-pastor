import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUser$: Observable<User | null>;
  user: User | null = null;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  accounts = [
    {
      id: 1,
      name: 'Main Business Account',
      balance: 12450.30,
      currency: 'EUR',
      iban: 'FR76 1234 5678 9012 3456 78'
    },
    {
      id: 2,
      name: 'Savings Account',
      balance: 5200.00,
      currency: 'EUR',
      iban: 'FR76 9876 5432 1098 7654 32'
    }
  ];

  recentTransactions = [
    {
      id: 1,
      description: 'Payment to Supplier A',
      amount: -850.00,
      date: new Date('2025-09-04'),
      status: 'completed'
    },
    {
      id: 2,
      description: 'Client Payment Received',
      amount: 2500.00,
      date: new Date('2025-09-03'),
      status: 'completed'
    },
    {
      id: 3,
      description: 'Office Rent',
      amount: -1200.00,
      date: new Date('2025-09-01'),
      status: 'completed'
    },
    {
      id: 4,
      description: 'Software Subscription',
      amount: -99.00,
      date: new Date('2025-08-30'),
      status: 'pending'
    }
  ];

  quickActions = [
    { title: 'Send Money', icon: '💸', route: '/transfer' },
    { title: 'Request Payment', icon: '📨', route: '/request' },
    { title: 'Add Card', icon: '💳', route: '/cards' },
    { title: 'View Reports', icon: '📊', route: '/reports' }
  ];

  ngOnInit() {
    this.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
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
