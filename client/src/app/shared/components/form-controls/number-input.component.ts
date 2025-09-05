import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseInputComponent, BaseInputConfig } from './base-input.component';

export interface NumberInputConfig extends BaseInputConfig {
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  showSpinButtons?: boolean;
  currency?: string;
  prefix?: string;
  suffix?: string;
  allowNegative?: boolean;
  thousandsSeparator?: boolean;
}

@Component({
  selector: 'app-number-input',
  standalone: true,
  imports: [CommonModule, BaseInputComponent],
  template: `
    <app-base-input 
      [config]="config" 
      [control]="control" 
      [inputId]="inputId">
      
      <div class="input-wrapper number-input">
        <!-- Prefix -->
        <span class="input-prefix" *ngIf="config.prefix || config.currency">
          {{ config.currency || config.prefix }}
        </span>

        <!-- Decrease Button -->
        <button
          *ngIf="config.showSpinButtons"
          type="button"
          class="input-button spin-button decrease"
          (click)="decrease()"
          [disabled]="disabled || config.disabled || (config.min !== undefined && numericValue <= config.min)"
          [attr.aria-label]="'Decrease ' + (config.label || 'value')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>

        <!-- Input Field -->
        <input
          [id]="inputId"
          type="text"
          [value]="displayValue"
          [placeholder]="config.placeholder || '0'"
          [disabled]="disabled || config.disabled"
          [readonly]="config.readonly"
          class="form-input number-field"
          (input)="onInputChange($event)"
          (blur)="onInputBlur()"
          (keydown)="onKeyDown($event)"
        />

        <!-- Increase Button -->
        <button
          *ngIf="config.showSpinButtons"
          type="button"
          class="input-button spin-button increase"
          (click)="increase()"
          [disabled]="disabled || config.disabled || (config.max !== undefined && numericValue >= config.max)"
          [attr.aria-label]="'Increase ' + (config.label || 'value')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>

        <!-- Suffix -->
        <span class="input-suffix" *ngIf="config.suffix">
          {{ config.suffix }}
        </span>
      </div>
    </app-base-input>
  `,
  styleUrl: './number-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true
    }
  ]
})
export class NumberInputComponent extends BaseInputComponent implements ControlValueAccessor {
  @Input() override config: NumberInputConfig = {};

  get numericValue(): number {
    return typeof this.value === 'number' ? this.value : parseFloat(this.value) || 0;
  }

  get displayValue(): string {
    if (this.value === null || this.value === undefined || this.value === '') {
      return '';
    }

    let num = this.numericValue;
    
    // Apply precision
    if (this.config.precision !== undefined) {
      num = parseFloat(num.toFixed(this.config.precision));
    }

    let formatted = num.toString();

    // Add thousands separator
    if (this.config.thousandsSeparator && Math.abs(num) >= 1000) {
      formatted = num.toLocaleString('en-US', {
        minimumFractionDigits: this.config.precision || 0,
        maximumFractionDigits: this.config.precision || 2
      });
    }

    return formatted;
  }

  override onInputChange(event: any): void {
    const inputValue = event.target.value;
    
    // Remove non-numeric characters except decimal point, minus sign, and separators
    let cleaned = inputValue.replace(/[^\d.-]/g, '');
    
    // Handle negative numbers
    if (!this.config.allowNegative) {
      cleaned = cleaned.replace(/-/g, '');
    }

    // Parse the cleaned value
    let numericValue = parseFloat(cleaned);
    
    if (isNaN(numericValue)) {
      numericValue = 0;
    }

    // Apply min/max constraints
    if (this.config.min !== undefined && numericValue < this.config.min) {
      numericValue = this.config.min;
    }
    if (this.config.max !== undefined && numericValue > this.config.max) {
      numericValue = this.config.max;
    }

    super.onInputChange(numericValue);
  }

  onKeyDown(event: KeyboardEvent): void {
    // Allow navigation keys
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End'
    ];

    if (allowedKeys.includes(event.key)) {
      // Handle arrow keys for increment/decrement
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.increase();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.decrease();
      }
      return;
    }

    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (event.ctrlKey && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) {
      return;
    }

    // Allow decimal point
    if (event.key === '.' && this.config.precision !== 0) {
      const currentValue = (event.target as HTMLInputElement).value;
      if (currentValue.includes('.')) {
        event.preventDefault();
      }
      return;
    }

    // Allow minus sign at the beginning
    if (event.key === '-' && this.config.allowNegative) {
      const currentValue = (event.target as HTMLInputElement).value;
      const caretPosition = (event.target as HTMLInputElement).selectionStart || 0;
      if (caretPosition !== 0 || currentValue.includes('-')) {
        event.preventDefault();
      }
      return;
    }

    // Only allow numbers
    if (!/\d/.test(event.key)) {
      event.preventDefault();
    }
  }

  increase(): void {
    const step = this.config.step || 1;
    const newValue = this.numericValue + step;
    
    if (this.config.max === undefined || newValue <= this.config.max) {
      super.onInputChange(newValue);
    }
  }

  decrease(): void {
    const step = this.config.step || 1;
    const newValue = this.numericValue - step;
    
    if (this.config.min === undefined || newValue >= this.config.min) {
      super.onInputChange(newValue);
    }
  }
}
