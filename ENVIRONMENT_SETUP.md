# Google Sign-In Configuration

## Environment Setup (Secure Method)

The Google Client ID is configured using environment variables that are **NOT committed to the repository**.

### Initial Setup

1. **Create environment files from templates:**
   ```bash
   # Using Makefile (Recommended)
   make setup-env
   
   # Or manually copy template files
   cp src/environments/environment.template.ts src/environments/environment.ts
   cp src/environments/environment.prod.template.ts src/environments/environment.prod.ts
   ```

2. **Get your Google Client ID:**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google Identity API
   - Go to "Credentials" and create an OAuth 2.0 Client ID
   - Set the authorized JavaScript origins (e.g., `http://localhost:4200` for development)

### Development Environment

1. **Configure the development environment:**
   - Open `src/environments/environment.ts` (created from template)
   - Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Google Client ID:
   ```typescript
   export const environment = {
     production: false,
     googleClientId: 'your-actual-google-client-id.googleusercontent.com'
   };
   ```

### Production Environment

1. **Configure the production environment:**
   - Open `src/environments/environment.prod.ts` (created from template)
   - Replace `YOUR_PRODUCTION_GOOGLE_CLIENT_ID_HERE` with your production Google Client ID:
   ```typescript
   export const environment = {
     production: true,
     googleClientId: 'your-production-google-client-id.googleusercontent.com'
   };
   ```

2. **Note:** You may need separate Google Client IDs for development and production domains.

## File Structure

```
src/environments/
├── environment.ts          # Development configuration
└── environment.prod.ts     # Production configuration
```

The Angular build process automatically replaces `environment.ts` with `environment.prod.ts` when building for production:
```bash
# Using Makefile (Recommended)
make build

# Traditional Angular CLI
ng build --configuration production
```

## Usage in Components

The environment variable is imported and used in the signup component:

```typescript
import { environment } from '../../environments/environment';

// Used in Google Sign-In initialization
google.accounts.id.initialize({
  client_id: environment.googleClientId,
  callback: this.handleGoogleSignIn.bind(this)
});
```

## Additional Environment Variables

You can add more environment-specific configurations to these files as needed:

```typescript
export const environment = {
  production: false,
  googleClientId: 'your-google-client-id',
  apiUrl: 'http://localhost:3000/api',
  version: '1.0.0'
};
```
