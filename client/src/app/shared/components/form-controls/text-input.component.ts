import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseInputComponent, BaseInputConfig } from './base-input.component';

export interface TextInputConfig extends BaseInputConfig {
  type?: 'text' | 'email' | 'tel' | 'url' | 'search';
  autocomplete?: string;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  leftIcon?: string;
  rightIcon?: string;
  clearable?: boolean;
}

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, BaseInputComponent],
  template: `
    <app-base-input 
      [config]="config" 
      [control]="control" 
      [inputId]="inputId">
      
      <div class="input-wrapper">
        <!-- Left Icon -->
        <div class="input-icon left" *ngIf="config.leftIcon">
          <span [innerHTML]="config.leftIcon"></span>
        </div>

        <!-- Input Field -->
        <input
          [id]="inputId"
          [type]="config.type || 'text'"
          [value]="value"
          [placeholder]="config.placeholder || ''"
          [disabled]="disabled || config.disabled"
          [readonly]="config.readonly"
          [autocomplete]="config.autocomplete || 'off'"
          [pattern]="config.pattern"
          [attr.minlength]="config.minLength"
          [attr.maxlength]="config.maxLength"
          class="form-input"
          (input)="onInputChange($event)"
          (blur)="onInputBlur()"
          (focus)="onInputFocus()"
        />

        <!-- Clear Button -->
        <button
          *ngIf="config.clearable && value && !disabled && !config.disabled"
          type="button"
          class="input-button clear-button"
          (click)="clearInput()"
          [attr.aria-label]="'Clear ' + (config.label || 'input')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- Right Icon -->
        <div class="input-icon right" *ngIf="config.rightIcon && !config.clearable">
          <span [innerHTML]="config.rightIcon"></span>
        </div>
      </div>
    </app-base-input>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true
    }
  ]
})
export class TextInputComponent extends BaseInputComponent implements ControlValueAccessor {
  @Input() override config: TextInputConfig = {};

  clearInput(): void {
    this.onInputChange({ target: { value: '' } });
  }

  override onInputChange(event: any): void {
    const value = event.target.value;
    super.onInputChange(value);
  }

  onInputFocus(): void {
    // Optional: Add focus handling logic
  }
}
