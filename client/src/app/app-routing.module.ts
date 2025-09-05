import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./features/public/landing/landing.component').then(m => m.LandingComponent)
  },
  { 
    path: 'app/dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'pricing', 
    loadComponent: () => import('./features/public/pricing/pricing.component').then(m => m.PricingComponent)
  },
  { 
    path: 'signup', 
    loadComponent: () => import('./features/public/signup/signup.component').then(m => m.SignupComponent)
  },
  // Legacy routes for backward compatibility
  { path: 'dashboard', redirectTo: '/app/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
