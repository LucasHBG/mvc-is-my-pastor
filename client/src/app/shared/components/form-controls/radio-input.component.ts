import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseInputComponent, BaseInputConfig } from './base-input.component';

export interface RadioOption {
  value: any;
  label: string;
  disabled?: boolean;
  description?: string;
}

export interface RadioInputConfig extends BaseInputConfig {
  options: RadioOption[];
  layout?: 'vertical' | 'horizontal' | 'grid';
  columns?: number;
  showDescriptions?: boolean;
}

@Component({
  selector: 'app-radio-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="radio-wrapper" [class]="containerClasses">
      <!-- Label -->
      <label *ngIf="config.label" class="input-label group-label">
        {{ config.label }}
        <span *ngIf="config.required" class="required-indicator">*</span>
      </label>

      <!-- Radio Group -->
      <div 
        class="radio-group" 
        [class.layout-horizontal]="radioConfig.layout === 'horizontal'"
        [class.layout-grid]="radioConfig.layout === 'grid'"
        [style.grid-template-columns]="radioConfig.layout === 'grid' ? 'repeat(' + (radioConfig.columns || 2) + ', 1fr)' : null"
        role="radiogroup"
        [attr.aria-labelledby]="config.id + '-label'"
        [attr.aria-describedby]="config.ariaDescribedBy">
        
        <div 
          *ngFor="let option of radioConfig.options; let i = index" 
          class="radio-option"
          [class.disabled]="option.disabled || config.disabled">
          
          <label class="radio-label" [for]="config.id + '-' + i">
            <div class="radio-container">
              <input
                type="radio"
                [id]="config.id + '-' + i"
                [name]="config.name || config.id"
                [value]="option.value"
                [disabled]="option.disabled || config.disabled"
                [required]="config.required"
                [checked]="value === option.value"
                (change)="onRadioChange(option.value)"
                (focus)="onFocus()"
                (blur)="onBlur($event)"
                class="radio-input"
                [attr.aria-describedby]="option.description ? config.id + '-desc-' + i : null">
              
              <div class="radio-visual">
                <div class="radio-dot"></div>
              </div>
            </div>

            <div class="radio-content">
              <span class="radio-text">{{ option.label }}</span>
              <span 
                *ngIf="option.description && radioConfig.showDescriptions" 
                class="radio-description"
                [id]="config.id + '-desc-' + i">
                {{ option.description }}
              </span>
            </div>
          </label>
        </div>
      </div>

      <!-- Help Text -->
      <div *ngIf="config.helpText && !hasError" class="help-text">
        {{ config.helpText }}
      </div>

      <!-- Error Message -->
      <div *ngIf="hasError" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styleUrl: './radio-input.component.scss'
})
export class RadioInputComponent extends BaseInputComponent {
  @Input() override config: RadioInputConfig = { options: [] };
  isFocused = false;

  get radioConfig(): RadioInputConfig {
    return this.config as RadioInputConfig;
  }

  override get containerClasses(): string {
    const baseClasses = super.containerClasses;
    const layoutClass = `layout-${this.radioConfig.layout || 'vertical'}`;
    const descriptionsClass = this.radioConfig.showDescriptions ? 'show-descriptions' : '';
    
    return `${baseClasses} ${layoutClass} ${descriptionsClass}`.trim();
  }

  onRadioChange(selectedValue: any): void {
    if (this.config.disabled) return;
    
    this.onInputChange(selectedValue);
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(event: FocusEvent): void {
    this.isFocused = false;
    this.onInputBlur();
  }

  override writeValue(value: any): void {
    // Ensure the value matches one of the available options
    const validOption = this.radioConfig.options.find(option => option.value === value);
    super.writeValue(validOption ? value : null);
  }
}
