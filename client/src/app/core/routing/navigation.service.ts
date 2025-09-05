import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ROUTES, AppRoute, getRoute } from './routes.config';

/**
 * Type-safe navigation service
 * Provides methods to navigate to routes with compile-time type checking
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  
  constructor(private router: Router) {}

  /**
   * Navigate to a route using the route key with type safety
   * @param routeKey - The key from ROUTES object
   * @param extras - Optional navigation extras
   */
  navigateToRoute(routeKey: keyof typeof ROUTES, extras?: NavigationExtras): Promise<boolean> {
    const route = getRoute(routeKey);
    return this.router.navigate([route], extras);
  }

  /**
   * Navigate to home page
   */
  navigateToHome(extras?: NavigationExtras): Promise<boolean> {
    return this.navigateToRoute('HOME', extras);
  }

  /**
   * Navigate to dashboard
   */
  navigateToDashboard(extras?: NavigationExtras): Promise<boolean> {
    return this.navigateToRoute('DASHBOARD', extras);
  }

  /**
   * Navigate to pricing page
   */
  navigateToPricing(extras?: NavigationExtras): Promise<boolean> {
    return this.navigateToRoute('PRICING', extras);
  }

  /**
   * Navigate to signup page
   */
  navigateToSignup(extras?: NavigationExtras): Promise<boolean> {
    return this.navigateToRoute('SIGNUP', extras);
  }

  /**
   * Navigate back in history
   */
  navigateBack(): void {
    window.history.back();
  }

  /**
   * Get the current route
   */
  getCurrentRoute(): string {
    return this.router.url;
  }

  /**
   * Check if current route matches the given route key
   */
  isCurrentRoute(routeKey: keyof typeof ROUTES): boolean {
    const route = getRoute(routeKey);
    return this.router.url === route;
  }

  /**
   * Navigate with URL replacement (no history entry)
   */
  replaceUrl(routeKey: keyof typeof ROUTES, extras?: NavigationExtras): Promise<boolean> {
    const route = getRoute(routeKey);
    return this.router.navigate([route], { replaceUrl: true, ...extras });
  }
}
