import { Component, Input, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface BaseInputConfig {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled';
  customClass?: string;
  showRequiredIndicator?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

@Component({
  selector: 'app-base-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="form-group" [class]="containerClasses">
      <!-- Label -->
      <label 
        *ngIf="config.label" 
        [for]="inputId"
        class="form-label"
        [class.required]="config.required && config.showRequiredIndicator !== false">
        {{ config.label }}
        <span class="required-indicator" *ngIf="config.required && config.showRequiredIndicator !== false">*</span>
      </label>

      <!-- Input Container -->
      <div class="input-container" [class]="inputContainerClasses">
        <ng-content></ng-content>
      </div>

      <!-- Helper Text -->
      <div class="helper-text" *ngIf="config.helpText && !hasError">
        {{ config.helpText }}
      </div>

      <!-- Error Messages -->
      <div class="error-message" *ngIf="hasError && control?.touched">
        <span class="error-icon">⚠️</span>
        <span class="error-text">{{ errorMessage }}</span>
      </div>
    </div>
  `,
  styleUrl: './base-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BaseInputComponent),
      multi: true
    }
  ]
})
export class BaseInputComponent implements ControlValueAccessor {
  @Input() config: BaseInputConfig = {};
  @Input() control: FormControl | null = null;
  @Input() inputId: string = `input-${Math.random().toString(36).substr(2, 9)}`;

  protected value: any = '';
  protected disabled = false;

  private onChange = (value: any) => {};
  private onTouched = () => {};

  get containerClasses(): string {
    const classes = ['form-input-wrapper'];
    
    if (this.config.size) classes.push(`size-${this.config.size}`);
    if (this.config.variant) classes.push(`variant-${this.config.variant}`);
    if (this.config.customClass) classes.push(this.config.customClass);
    if (this.hasError) classes.push('has-error');
    if (this.disabled || this.config.disabled) classes.push('disabled');
    if (this.config.readonly) classes.push('readonly');
    
    return classes.join(' ');
  }

  get inputContainerClasses(): string {
    const classes = ['input-container'];
    
    if (this.hasError) classes.push('error');
    if (this.disabled || this.config.disabled) classes.push('disabled');
    
    return classes.join(' ');
  }

  get hasError(): boolean {
    return !!(this.control?.errors && this.control?.touched);
  }

  get errorMessage(): string {
    if (!this.control?.errors) return '';
    
    const errors = this.control.errors;
    
    if (errors['required']) return `${this.config.label || 'This field'} is required`;
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength']) return `Maximum length is ${errors['maxlength'].requiredLength} characters`;
    if (errors['pattern']) return 'Please enter a valid format';
    if (errors['min']) return `Minimum value is ${errors['min'].min}`;
    if (errors['max']) return `Maximum value is ${errors['max'].max}`;
    
    // Custom error messages
    if (errors['passwordStrength']) return 'Password must meet strength requirements';
    if (errors['passwordMismatch']) return 'Passwords do not match';
    
    return 'Invalid input';
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected onInputChange(value: any): void {
    this.value = value;
    this.onChange(value);
  }

  protected onInputBlur(): void {
    this.onTouched();
  }
}
