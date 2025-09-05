# Angular Frontend - MVC is My Pastor

This is the Angular frontend application for the MVC is My Pastor financial management platform, inspired by Qonto's design and functionality.

## Project Overview

A modern Angular 17 application featuring:
- **Standalone components** architecture
- **Dark theme** design inspired by Qonto
- **Google OAuth** authentication
- **SCSS** styling with modern CSS custom properties
- **Reactive forms** with validation
- **RxJS** state management
- **Route guards** for authentication

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Install dependencies:**
   ```bash
   make install
   # or: npm install
   ```

2. **Set up environment files:**
   ```bash
   make setup-env
   # This creates environment files from templates
   ```

3. **Configure Google OAuth:**
   - Edit `src/environments/environment.ts`
   - Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Google Client ID
   - See `GOOGLE_SIGNIN_SETUP.md` for detailed instructions

4. **Start development server:**
   ```bash
   make dev
   # or: ng serve
   ```

   Navigate to `http://localhost:4200/`

## Development Commands

### Using Makefile (Recommended)
```bash
make dev          # Start development server
make build        # Build for production
make build-dev    # Build for development  
make test         # Run tests
make lint         # Run linter
make clean        # Clean build artifacts
make security-check # Check for credential leaks
make help         # Show all available commands
```

### Traditional Angular CLI
```bash
ng serve          # Development server
ng build          # Production build
ng test           # Run unit tests
ng lint           # Run linter
ng generate component <name>  # Generate component
```

## Project Structure

```
src/
├── app/
│   ├── guards/           # Route guards (AuthGuard)
│   ├── services/         # Services (AuthService)
│   ├── landing/          # Public landing page
│   ├── signup/           # User registration
│   ├── dashboard/        # Protected dashboard
│   ├── pricing/          # Pricing page
│   └── header/           # Global navigation
├── environments/         # Environment configurations
├── assets/              # Static assets
└── styles.scss          # Global styles
```

## Authentication Flow

- **Public routes**: `/`, `/pricing`, `/signup`
- **Protected routes**: `/dashboard`, `/home`
- **Authentication**: Google OAuth + local storage persistence
- **Route protection**: `AuthGuard` for protected routes

## Styling

- **SCSS** with CSS custom properties
- **Dark theme** design system
- **Responsive** mobile-first approach
- **Component-level** styling with BEM methodology

## Environment Setup

The project uses a secure environment file strategy:
- Template files are committed (`*.template.ts`)
- Actual environment files are gitignored for security
- See `ENVIRONMENT_SETUP.md` for detailed configuration

## Security

- Environment files with credentials are gitignored
- Pre-commit security checks available
- Google Client ID stored in environment variables
- See `ENVIRONMENT_SECURITY.md` for security guidelines

## Further Help

- **Angular CLI**: `ng help` or [Angular CLI Reference](https://angular.io/cli)
- **Project Documentation**: Check `*.md` files in this directory
- **Issue Reporting**: Use GitHub issues for bugs and feature requests
