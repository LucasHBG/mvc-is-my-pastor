import { Directive, Input, HostBinding } from '@angular/core';
import { ROUTES, AppRoute } from './routes.config';

/**
 * Type-safe router link directive
 * This directive ensures that only valid routes from our ROUTES config can be used
 */
@Directive({
  selector: '[appRouterLink]',
  standalone: true
})
export class TypeSafeRouterLinkDirective {
  private _route: AppRoute = ROUTES.HOME;

  @Input() set appRouterLink(route: AppRoute) {
    this._route = route;
  }

  @HostBinding('attr.routerLink')
  get routerLink(): AppRoute {
    return this._route;
  }
}

/**
 * Type-safe navigation helper
 * Provides compile-time type checking for navigation
 */
export class TypeSafeNavigation {
  /**
   * Create a router link with type safety
   * @param routeKey - Key from ROUTES object
   * @returns The route path
   */
  static link(routeKey: keyof typeof ROUTES): AppRoute {
    return ROUTES[routeKey];
  }

  /**
   * Validate if a string is a valid route
   * @param route - Route to validate
   * @returns True if valid, false otherwise
   */
  static isValidRoute(route: string): route is AppRoute {
    return Object.values(ROUTES).includes(route as AppRoute);
  }

  /**
   * Get all available routes
   * @returns Array of all available routes
   */
  static getAllRoutes(): AppRoute[] {
    return Object.values(ROUTES);
  }

  /**
   * Get route key by path
   * @param path - Route path
   * @returns Route key or undefined if not found
   */
  static getRouteKey(path: AppRoute): keyof typeof ROUTES | undefined {
    const entry = Object.entries(ROUTES).find(([, value]) => value === path);
    return entry ? (entry[0] as keyof typeof ROUTES) : undefined;
  }
}
