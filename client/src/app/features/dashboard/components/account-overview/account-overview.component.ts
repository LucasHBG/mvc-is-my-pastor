import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Account, AccountService } from '@/app/core/services/account.service';
import { DashboardService } from '@/app/core/services/dashboard.service';

@Component({
  selector: 'app-account-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-overview.component.html',
  styleUrl: './account-overview.component.scss'
})
export class AccountOverviewComponent implements OnInit {
  accounts$: Observable<Account[]>;

  constructor(
    private accountService: AccountService,
    private dashboardService: DashboardService
  ) {
    this.accounts$ = this.accountService.getAccounts();
  }

  ngOnInit(): void {}

  formatCurrency(amount: number): string {
    return this.dashboardService.formatCurrency(amount);
  }
}
