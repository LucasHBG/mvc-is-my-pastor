# Google Sign-In Setup Instructions

## Setting up Google Sign-In for your Angular application

### 1. Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API

### 2. Create OAuth 2.0 credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Choose **Web application**
4. Add authorized JavaScript origins:
   - `http://localhost:4200`
   - `http://localhost:4201`
   - Your production domain
5. Copy the Client ID

### 3. Update the Application
1. Open `src/app/signup/signup.component.ts`
2. Replace `'YOUR_GOOGLE_CLIENT_ID'` with your actual Google Client ID
3. The line should look like:
   ```typescript
   client_id: 'your-actual-client-id.apps.googleusercontent.com'
   ```

### 4. Test the Integration
1. Navigate to `/signup` in your application
2. Click the "Continue with Google" button
3. Complete the Google sign-in flow