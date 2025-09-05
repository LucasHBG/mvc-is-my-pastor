import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROUTES } from '@/app/core/routing/routes.config';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent {
  // Expose routes to template for type safety
  readonly routes = ROUTES;
}
