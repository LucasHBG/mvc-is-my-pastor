import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./landing/landing.component').then(m => m.LandingComponent)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'pricing', 
    loadComponent: () => import('./pricing/pricing.component').then(m => m.PricingComponent)
  },
  { 
    path: 'signup', 
    loadComponent: () => import('./signup/signup.component').then(m => m.SignupComponent)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
