import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';
import { NavigationService } from '@/app/core/routing/navigation.service';
import { ROUTES } from '@/app/core/routing/routes.config';
import { environment } from '@/environments/environment';

declare const google: any;

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent implements OnInit {
  private fb = inject(FormBuilder);
  private navigationService = inject(NavigationService);
  private authService = inject(AuthService);

  signinForm: FormGroup;
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  
  // Expose routes to template for type safety
  readonly routes = ROUTES;

  constructor() {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // Load Google Sign-In API if needed
    if (environment.googleClientId) {
      this.loadGoogleSignIn();
    }
  }

  togglePasswordVisibility() {
    this.showPassword.update(value => !value);
  }

  onSubmit() {
    if (this.signinForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const { email, password } = this.signinForm.value;

      // Mock authentication using AuthService login method
      this.authService.login(email, password).subscribe({
        next: (success) => {
          if (success) {
            this.navigationService.navigateToDashboard();
          } else {
            this.errorMessage.set('Invalid email or password');
          }
          this.isLoading.set(false);
        },
        error: (error) => {
          this.errorMessage.set('Login failed. Please try again.');
          this.isLoading.set(false);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private extractNameFromEmail(email: string): string {
    const namePart = email.split('@')[0];
    return namePart
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private markFormGroupTouched() {
    Object.keys(this.signinForm.controls).forEach(key => {
      const control = this.signinForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.signinForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.signinForm.get(fieldName);
    return !!(field?.touched && field?.errors);
  }

  // Google Sign-In methods
  private loadGoogleSignIn() {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: any) => this.handleGoogleSignIn(response)
      });

      google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular'
        }
      );
    }
  }

  private handleGoogleSignIn(response: any) {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const googleUser = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        avatar: payload.picture
      };

      this.authService.loginWithGoogle(payload).subscribe({
        next: (success) => {
          if (success) {
            this.navigationService.navigateToDashboard();
          } else {
            this.errorMessage.set('Google Sign-In failed. Please try again.');
          }
          this.isLoading.set(false);
        },
        error: (error) => {
          this.errorMessage.set('Google Sign-In failed. Please try again.');
          this.isLoading.set(false);
        }
      });
    } catch (error) {
      this.errorMessage.set('Google Sign-In failed. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  // Demo login method
  demoLogin() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const demoUser = {
      id: 'demo',
      name: 'Demo User',
      email: 'demo@qonto.com',
      avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=ffffff&color=000000'
    };

    this.authService.login('demo@qonto.com', 'demo123').subscribe({
      next: (success) => {
        if (success) {
          this.navigationService.navigateToDashboard();
        } else {
          this.errorMessage.set('Demo login failed. Please try again.');
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Demo login failed. Please try again.');
        this.isLoading.set(false);
      }
    });
  }
}
