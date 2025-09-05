import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '@/app/core/services/auth.service';
import { NavigationService } from '@/app/core/routing/navigation.service';
import { ROUTES } from '@/app/core/routing/routes.config';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isAuthenticated$: Observable<boolean>;
  currentUser$: Observable<User | null>;
  
  // Expose routes to template for type safety
  readonly routes = ROUTES;

  constructor(
    private authService: AuthService,
    private navigationService: NavigationService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit() {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.navigationService.navigateToHome();
  }
}
