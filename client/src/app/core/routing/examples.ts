/**
 * Example demonstrating type-safe routing benefits
 * This file shows how the new routing system prevents common errors
 */

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ROUTES, NavigationService, TypeSafeNavigation } from '@/app/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- ✅ Type-safe routing - will autocomplete and validate -->
    <a [routerLink]="routes.DASHBOARD">Dashboard</a>
    <a [routerLink]="routes.PRICING">Pricing</a>
    
    <!-- ❌ This would cause a compilation error: -->
    <!-- <a [routerLink]="routes.INVALID_ROUTE">Invalid</a> -->
    
    <!-- ✅ Conditional routing with type safety -->
    <a [routerLink]="isAuthenticated ? routes.DASHBOARD : routes.HOME">
      {{ isAuthenticated ? 'Dashboard' : 'Home' }}
    </a>
  `
})
export class ExampleComponent {
  // ✅ Expose routes for template use
  readonly routes = ROUTES;
  isAuthenticated = false;

  constructor(private navigationService: NavigationService) {}

  // ✅ Type-safe navigation methods
  navigateToUserArea() {
    if (this.isAuthenticated) {
      // ✅ Compile-time validated route
      this.navigationService.navigateToDashboard();
      
      // ✅ Or using generic method with type checking
      this.navigationService.navigateToRoute('DASHBOARD');
      
      // ❌ This would cause a compilation error:
      // this.navigationService.navigateToRoute('INVALID_ROUTE');
    } else {
      this.navigationService.navigateToHome();
    }
  }

  // ✅ Type-safe route building
  buildDynamicRoute() {
    const dashboardRoute = TypeSafeNavigation.link('DASHBOARD');
    // dashboardRoute is guaranteed to be a valid AppRoute type
    
    // ✅ Route validation
    const userInput = '/dashboard';
    if (TypeSafeNavigation.isValidRoute(userInput)) {
      // userInput is now typed as AppRoute
      console.log('Valid route:', userInput);
    }
  }
}

// ✅ Benefits demonstrated:

// 1. AUTOCOMPLETE SUPPORT
//    - IDE will show available routes when typing routes.
//    - No more guessing route names

// 2. COMPILE-TIME VALIDATION  
//    - Typos in route names cause compilation errors
//    - Invalid routes are caught before runtime

// 3. REFACTORING SAFETY
//    - Changing a route in ROUTES config updates everywhere
//    - Find all usages works perfectly

// 4. SELF-DOCUMENTING CODE
//    - Route metadata provides clear documentation
//    - TypeScript types show available options

// 5. CONSISTENT PATTERNS
//    - Same approach across all components
//    - No mixing of string literals and constants
