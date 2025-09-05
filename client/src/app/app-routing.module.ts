import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { ROUTES } from './core/routing/routes.config';

const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./features/public/landing/landing.component').then(m => m.LandingComponent)
  },
  { 
    path: ROUTES.DASHBOARD.substring(1), // Remove leading slash for route definition
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: ROUTES.TRANSACTIONS.substring(1), // Remove leading slash for route definition
    loadComponent: () => import('./features/transactions/transactions.component').then(m => m.TransactionsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: ROUTES.PRICING.substring(1), // Remove leading slash for route definition
    loadComponent: () => import('./features/public/pricing/pricing.component').then(m => m.PricingComponent)
  },
  { 
    path: ROUTES.SIGNUP.substring(1), // Remove leading slash for route definition
    loadComponent: () => import('./features/public/signup/signup.component').then(m => m.SignupComponent)
  },
  // Legacy routes for backward compatibility
  { path: 'dashboard', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
