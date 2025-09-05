# Type-Safe Routing System

This documentation provides comprehensive instructions for implementing and using the type-safe routing system in this Angular application. The system ensures compile-time route validation and prevents routing errors through centralized route management.

## Architecture Overview

The type-safe routing system consists of three core components:

1. **Route Configuration** (`routes.config.ts`) - Centralized route definitions and metadata
2. **Navigation Service** (`navigation.service.ts`) - Type-safe navigation methods
3. **Type-Safe Utilities** (`type-safe-router.directive.ts`) - Additional type safety helpers

## Implementation Guide

### Route Definition

Define all application routes in `core/routing/routes.config.ts`:

```typescript
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  //... others
} as const;
```

### Template Integration

Implement type-safe routing in component templates:

```html
<a [routerLink]="routes.DASHBOARD">Dashboard</a>
<a [routerLink]="routes.PRICING">Pricing</a>
<a [routerLink]="routes.TRANSFER">Transfer Money</a>
```

### Component Navigation

Use the NavigationService for programmatic navigation:

```typescript
// Direct navigation methods
this.navigationService.navigateToDashboard();
this.navigationService.navigateToHome();

// Generic navigation with route key
this.navigationService.navigateToRoute('DASHBOARD');
```

### Component Configuration

Configure components to expose routes for template usage:

```typescript
import { ROUTES } from '@/app/core/routing/routes.config';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  readonly routes = ROUTES;
}
```

## Advanced Configuration

### Route Metadata

Configure detailed metadata for each route:

```typescript
export const ROUTE_CONFIG: Record<keyof typeof ROUTES, RouteConfig> = {
  DASHBOARD: {
    path: ROUTES.DASHBOARD,
    title: 'Dashboard',
    requiresAuth: true,
    description: 'User dashboard interface'
  },
  PRICING: {
    path: ROUTES.PRICING,
    title: 'Pricing',
    requiresAuth: false,
    description: 'Pricing information and plans'
  }
};
```

### Navigation Service Methods

The NavigationService provides comprehensive navigation capabilities:

```typescript
// Direct navigation methods
navigationService.navigateToHome();
navigationService.navigateToDashboard();
navigationService.navigateToPricing();

// Generic navigation with route key
navigationService.navigateToRoute('DASHBOARD');

// Navigation with additional parameters
navigationService.navigateToRoute('DASHBOARD', { 
  queryParams: { tab: 'overview' } 
});

// URL replacement without history entry
navigationService.replaceUrl('HOME');

// Utility methods
navigationService.isCurrentRoute('DASHBOARD');
navigationService.getCurrentRoute();
navigationService.navigateBack();
```

### Type-Safe Utilities

Additional utilities for advanced route management:

```typescript
import { TypeSafeNavigation } from '@/app/core/routing/type-safe-router.directive';

// Create links programmatically
const dashboardLink = TypeSafeNavigation.link('DASHBOARD');

// Validate route strings
const isValid = TypeSafeNavigation.isValidRoute('/dashboard');

// Retrieve all available routes
const allRoutes = TypeSafeNavigation.getAllRoutes();

// Get route key from path
const routeKey = TypeSafeNavigation.getRouteKey('/dashboard');
```

## Migration Instructions

### Converting String-based Routes

Follow these steps to convert existing string-based routes to the type-safe system:

1. **Update template bindings:**
   ```html
   <a [routerLink]="routes.DASHBOARD">Dashboard</a>
   ```

2. **Replace direct router navigation:**
   ```typescript
   this.navigationService.navigateToDashboard();
   ```

3. **Add routes property to components:**
   ```typescript
   export class MyComponent {
     readonly routes = ROUTES;
   }
   ```

## Adding New Routes

### Step-by-Step Process

1. **Define the route in ROUTES constant:**
   ```typescript
   export const ROUTES = {
     // ... existing routes
     NEW_FEATURE: '/new-feature',
   } as const;
   ```

2. **Add route configuration:**
   ```typescript
   export const ROUTE_CONFIG = {
     // ... existing configurations
     NEW_FEATURE: {
       path: ROUTES.NEW_FEATURE,
       title: 'New Feature',
       requiresAuth: true,
       description: 'Description of new feature functionality'
     }
   };
   ```

3. **Add navigation method (optional):**
   ```typescript
   navigateToNewFeature(extras?: NavigationExtras): Promise<boolean> {
     return this.navigateToRoute('NEW_FEATURE', extras);
   }
   ```

4. **Update Angular routing module:**
   ```typescript
   {
     path: ROUTES.NEW_FEATURE.substring(1),
     loadComponent: () => import('./features/new-feature/new-feature.component')
   }
   ```

## Development Standards

### Required Practices

1. Use the routes constant instead of string literals in all cases
2. Expose routes property in components for template usage
3. Use NavigationService instead of Router for programmatic navigation
4. Define route metadata for comprehensive documentation
5. Use descriptive route keys in UPPER_CASE format
6. Group related routes logically within the ROUTES object
