import { Component, Input, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseInputComponent, BaseInputConfig } from './base-input.component';

export interface PasswordInputConfig extends BaseInputConfig {
  autocomplete?: string;
  minLength?: number;
  maxLength?: number;
  showToggle?: boolean;
  showStrengthIndicator?: boolean;
  strengthRequirements?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  };
}

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [CommonModule, BaseInputComponent],
  template: `
    <app-base-input 
      [config]="config" 
      [control]="control" 
      [inputId]="inputId">
      
      <div class="input-wrapper">
        <!-- Input Field -->
        <input
          [id]="inputId"
          [type]="showPassword() ? 'text' : 'password'"
          [value]="value"
          [placeholder]="config.placeholder || 'Enter password'"
          [disabled]="disabled || config.disabled"
          [readonly]="config.readonly"
          [autocomplete]="config.autocomplete || 'current-password'"
          [attr.minlength]="config.minLength"
          [attr.maxlength]="config.maxLength"
          class="form-input"
          (input)="onInputChange($event)"
          (blur)="onInputBlur()"
        />

        <!-- Password Toggle Button -->
        <button
          *ngIf="config.showToggle !== false"
          type="button"
          class="input-button password-toggle"
          (click)="togglePasswordVisibility()"
          [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'">
          
          <!-- Eye Open Icon -->
          <svg *ngIf="!showPassword()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          
          <!-- Eye Closed Icon -->
          <svg *ngIf="showPassword()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        </button>
      </div>

      <!-- Password Strength Indicator -->
      <div *ngIf="config.showStrengthIndicator && value" class="password-strength">
        <div class="strength-bar">
          <div 
            class="strength-fill" 
            [class]="'strength-' + passwordStrength.level"
            [style.width.%]="passwordStrength.percentage">
          </div>
        </div>
        <div class="strength-text">
          <span [class]="'strength-' + passwordStrength.level">
            {{ passwordStrength.text }}
          </span>
        </div>
      </div>

      <!-- Password Requirements -->
      <div *ngIf="config.strengthRequirements && value && !hasValidPassword" class="password-requirements">
        <div class="requirements-title">Password must contain:</div>
        <ul class="requirements-list">
          <li 
            *ngIf="config.strengthRequirements.minLength"
            [class.met]="hasMinLength"
            class="requirement-item">
            At least {{ config.strengthRequirements.minLength }} characters
          </li>
          <li 
            *ngIf="config.strengthRequirements.requireUppercase"
            [class.met]="hasUppercase"
            class="requirement-item">
            One uppercase letter
          </li>
          <li 
            *ngIf="config.strengthRequirements.requireLowercase"
            [class.met]="hasLowercase"
            class="requirement-item">
            One lowercase letter
          </li>
          <li 
            *ngIf="config.strengthRequirements.requireNumbers"
            [class.met]="hasNumbers"
            class="requirement-item">
            One number
          </li>
          <li 
            *ngIf="config.strengthRequirements.requireSpecialChars"
            [class.met]="hasSpecialChars"
            class="requirement-item">
            One special character
          </li>
        </ul>
      </div>
    </app-base-input>
  `,
  styleUrl: './password-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true
    }
  ]
})
export class PasswordInputComponent extends BaseInputComponent implements ControlValueAccessor {
  @Input() override config: PasswordInputConfig = {};
  
  showPassword = signal(false);

  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }

  override onInputChange(event: any): void {
    const value = event.target.value;
    super.onInputChange(value);
  }

  get passwordStrength(): { level: string; percentage: number; text: string } {
    if (!this.value) return { level: 'none', percentage: 0, text: '' };
    
    let score = 0;
    const password = this.value;
    
    // Length check
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;
    
    // Character type checks
    if (/[a-z]/.test(password)) score += 20;
    if (/[A-Z]/.test(password)) score += 20;
    if (/\d/.test(password)) score += 20;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20;
    
    // Complexity bonus
    if (password.length >= 16) score += 10;
    
    let level = 'weak';
    let text = 'Weak';
    
    if (score >= 80) {
      level = 'strong';
      text = 'Strong';
    } else if (score >= 60) {
      level = 'medium';
      text = 'Medium';
    } else if (score >= 40) {
      level = 'fair';
      text = 'Fair';
    }
    
    return { level, percentage: Math.min(score, 100), text };
  }

  get hasMinLength(): boolean {
    return this.value?.length >= (this.config.strengthRequirements?.minLength || 8);
  }

  get hasUppercase(): boolean {
    return /[A-Z]/.test(this.value || '');
  }

  get hasLowercase(): boolean {
    return /[a-z]/.test(this.value || '');
  }

  get hasNumbers(): boolean {
    return /\d/.test(this.value || '');
  }

  get hasSpecialChars(): boolean {
    return /[!@#$%^&*(),.?":{}|<>]/.test(this.value || '');
  }

  get hasValidPassword(): boolean {
    const reqs = this.config.strengthRequirements;
    if (!reqs) return true;
    
    return (!reqs.minLength || this.hasMinLength) &&
           (!reqs.requireUppercase || this.hasUppercase) &&
           (!reqs.requireLowercase || this.hasLowercase) &&
           (!reqs.requireNumbers || this.hasNumbers) &&
           (!reqs.requireSpecialChars || this.hasSpecialChars);
  }
}
