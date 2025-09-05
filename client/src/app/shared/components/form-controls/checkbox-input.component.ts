import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseInputComponent, BaseInputConfig } from './base-input.component';

export interface CheckboxInputConfig extends BaseInputConfig {
  checkboxLabel?: string;
  indeterminate?: boolean;
  labelPosition?: 'left' | 'right';
  checkboxSize?: 'small' | 'medium' | 'large';
}

@Component({
  selector: 'app-checkbox-input',
  standalone: true,
  imports: [CommonModule, BaseInputComponent],
  template: `
    <app-base-input 
      [config]="config" 
      [control]="control" 
      [inputId]="inputId">
      
      <div class="checkbox-wrapper" [class]="checkboxClasses">
        <!-- Checkbox positioned left -->
        <div class="checkbox-container" *ngIf="config.labelPosition !== 'right'">
          <input
            [id]="inputId"
            type="checkbox"
            [checked]="value"
            [disabled]="disabled || config.disabled"
            [indeterminate]="config.indeterminate"
            class="checkbox-input"
            (change)="onCheckboxChange($event)"
            (blur)="onInputBlur()"
          />
          <div class="checkbox-visual">
            <!-- Checkmark -->
            <svg *ngIf="value && !config.indeterminate" class="checkmark" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
            
            <!-- Indeterminate mark -->
            <div *ngIf="config.indeterminate" class="indeterminate-mark"></div>
          </div>
        </div>

        <!-- Checkbox Label -->
        <label 
          [for]="inputId" 
          class="checkbox-label"
          *ngIf="config.checkboxLabel">
          {{ config.checkboxLabel }}
        </label>

        <!-- Checkbox positioned right -->
        <div class="checkbox-container" *ngIf="config.labelPosition === 'right'">
          <input
            [id]="inputId"
            type="checkbox"
            [checked]="value"
            [disabled]="disabled || config.disabled"
            [indeterminate]="config.indeterminate"
            class="checkbox-input"
            (change)="onCheckboxChange($event)"
            (blur)="onInputBlur()"
          />
          <div class="checkbox-visual">
            <!-- Checkmark -->
            <svg *ngIf="value && !config.indeterminate" class="checkmark" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
            
            <!-- Indeterminate mark -->
            <div *ngIf="config.indeterminate" class="indeterminate-mark"></div>
          </div>
        </div>
      </div>
    </app-base-input>
  `,
  styleUrl: './checkbox-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxInputComponent),
      multi: true
    }
  ]
})
export class CheckboxInputComponent extends BaseInputComponent implements ControlValueAccessor {
  @Input() override config: CheckboxInputConfig = {};

  get checkboxClasses(): string {
    const classes = ['checkbox-input-wrapper'];
    
    if (this.config.checkboxSize) classes.push(`size-${this.config.checkboxSize}`);
    if (this.config.labelPosition === 'right') classes.push('label-right');
    if (this.disabled || this.config.disabled) classes.push('disabled');
    if (this.value) classes.push('checked');
    if (this.config.indeterminate) classes.push('indeterminate');
    
    return classes.join(' ');
  }

  onCheckboxChange(event: any): void {
    const checked = event.target.checked;
    super.onInputChange(checked);
  }

  override writeValue(value: any): void {
    // Ensure boolean value
    this.value = !!value;
  }
}
