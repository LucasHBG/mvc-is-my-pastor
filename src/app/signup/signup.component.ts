import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

declare const google: any;

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  signupForm: FormGroup;
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  isLoading = signal(false);

  constructor() {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]],
      newsletter: [false]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit() {
    this.loadGoogleSignIn();
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const hasUpperCase = /[A-Z]/.test(control.value);
    const hasLowerCase = /[a-z]/.test(control.value);
    const hasNumber = /\d/.test(control.value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(control.value);
    
    const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    
    if (!valid) {
      return { 
        passwordStrength: {
          hasUpperCase,
          hasLowerCase,
          hasNumber,
          hasSpecialChar
        }
      };
    }
    
    return null;
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    
    if (!password || !confirmPassword) return null;
    
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  loadGoogleSignIn() {
    if (typeof google === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.initializeGoogleSignIn();
      };
      document.head.appendChild(script);
    } else {
      this.initializeGoogleSignIn();
    }
  }

  initializeGoogleSignIn() {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: this.handleGoogleSignIn.bind(this)
    });
  }

  handleGoogleSignIn(response: any) {
    this.isLoading.set(true);
    
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    
    console.log('Google Sign-In successful:', payload);
    
    this.authService.loginWithGoogle(payload).subscribe({
      next: (success) => {
        this.isLoading.set(false);
        if (success) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Google sign-in failed:', error);
        alert('Google sign-in failed. Please try again.');
      }
    });
  }

  onGoogleSignIn() {
    google.accounts.id.prompt();
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading.set(true);
      
      const formData = this.signupForm.value;
      console.log('Form submitted:', formData);
      
      this.authService.signup(formData).subscribe({
        next: (success) => {
          this.isLoading.set(false);
          if (success) {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error('Signup failed:', error);
          alert('Signup failed. Please try again.');
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.signupForm.controls).forEach(key => {
      const control = this.signupForm.get(key);
      control?.markAsTouched();
    });
  }

  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }
  get acceptTerms() { return this.signupForm.get('acceptTerms'); }
  get newsletter() { return this.signupForm.get('newsletter'); }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getPasswordStrengthMessage(): string[] {
    const control = this.password;
    if (!control?.errors?.['passwordStrength']) return [];
    
    const errors = control.errors['passwordStrength'];
    const messages: string[] = [];
    
    if (!errors.hasUpperCase) messages.push('Add an uppercase letter');
    if (!errors.hasLowerCase) messages.push('Add a lowercase letter');
    if (!errors.hasNumber) messages.push('Add a number');
    if (!errors.hasSpecialChar) messages.push('Add a special character');
    
    return messages;
  }
}
