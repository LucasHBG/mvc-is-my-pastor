import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuickAction, DashboardService } from '../../../../core/services/dashboard.service';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quick-actions.component.html',
  styleUrl: './quick-actions.component.scss'
})
export class QuickActionsComponent implements OnInit {
  quickActions: QuickAction[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.quickActions = this.dashboardService.getQuickActions();
  }
}
