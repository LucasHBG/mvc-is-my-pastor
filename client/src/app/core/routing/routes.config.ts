/**
 * Type-safe routing configuration for the application
 * This file defines all available routes and provides type safety for navigation
 */

// Define all possible route paths as a const object for type safety
export const ROUTES = {
  // Public routes
  HOME: '/',
  PRICING: '/pricing',
  SIGNUP: '/signup',
  
  // Protected routes
  DASHBOARD: '/dashboard',
  TRANSACTIONS: '/transactions',
  
  // Dashboard sub-routes (for future use)
  TRANSFER: '/dashboard/transfer',
  REQUEST: '/dashboard/request',
  CARDS: '/dashboard/cards',
  REPORTS: '/dashboard/reports',
} as const;

// Create a type from the route values for type checking
export type AppRoute = typeof ROUTES[keyof typeof ROUTES];

// Route configuration interface for better organization
export interface RouteConfig {
  readonly path: AppRoute;
  readonly title?: string;
  readonly requiresAuth?: boolean;
  readonly description?: string;
}

// Define route metadata for better route management
export const ROUTE_CONFIG: Record<keyof typeof ROUTES, RouteConfig> = {
  HOME: {
    path: ROUTES.HOME,
    title: 'Home',
    requiresAuth: false,
    description: 'Landing page'
  },
  PRICING: {
    path: ROUTES.PRICING,
    title: 'Pricing',
    requiresAuth: false,
    description: 'Pricing information'
  },
  SIGNUP: {
    path: ROUTES.SIGNUP,
    title: 'Sign Up',
    requiresAuth: false,
    description: 'User registration'
  },
  DASHBOARD: {
    path: ROUTES.DASHBOARD,
    title: 'Dashboard',
    requiresAuth: true,
    description: 'User dashboard'
  },
  TRANSACTIONS: {
    path: ROUTES.TRANSACTIONS,
    title: 'Transactions',
    requiresAuth: true,
    description: 'View and manage transactions'
  },
  TRANSFER: {
    path: ROUTES.TRANSFER,
    title: 'Transfer Money',
    requiresAuth: true,
    description: 'Send money to another account'
  },
  REQUEST: {
    path: ROUTES.REQUEST,
    title: 'Request Payment',
    requiresAuth: true,
    description: 'Request payment from someone'
  },
  CARDS: {
    path: ROUTES.CARDS,
    title: 'Cards',
    requiresAuth: true,
    description: 'Manage payment cards'
  },
  REPORTS: {
    path: ROUTES.REPORTS,
    title: 'Reports',
    requiresAuth: true,
    description: 'Financial reports and analytics'
  }
} as const;

// Helper function to get route by key with type safety
export function getRoute(routeKey: keyof typeof ROUTES): AppRoute {
  return ROUTES[routeKey];
}

// Helper function to get route config
export function getRouteConfig(routeKey: keyof typeof ROUTES): RouteConfig {
  return ROUTE_CONFIG[routeKey];
}

// Utility to check if a route requires authentication
export function isProtectedRoute(route: AppRoute): boolean {
  const config = Object.values(ROUTE_CONFIG).find(config => config.path === route);
  return config?.requiresAuth ?? false;
}
