import { Component, Input, forwardRef, signal, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseInputComponent, BaseInputConfig } from './base-input.component';

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectInputConfig extends BaseInputConfig {
  options: SelectOption[];
  multiple?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  noOptionsText?: string;
  loadingText?: string;
  clearable?: boolean;
  maxHeight?: string;
}

@Component({
  selector: 'app-select-input',
  standalone: true,
  imports: [CommonModule, BaseInputComponent, FormsModule],
  template: `
    <app-base-input 
      [config]="config" 
      [control]="control" 
      [inputId]="inputId">
      
      <div class="select-wrapper" [class.open]="isOpen()">
        <!-- Select Display -->
        <div 
          class="select-display"
          [tabindex]="disabled || config.disabled ? -1 : 0"
          (click)="toggleDropdown()"
          (keydown)="onKeyDown($event)"
          role="combobox"
          [attr.aria-expanded]="isOpen()"
          [attr.aria-haspopup]="'listbox'"
          [attr.aria-labelledby]="config.label">
          
          <!-- Selected Value Display -->
          <div class="selected-value" *ngIf="!config.multiple && selectedOption">
            {{ selectedOption.label }}
          </div>
          
          <!-- Multiple Selected Values -->
          <div class="selected-values" *ngIf="config.multiple && selectedOptions.length > 0">
            <span 
              *ngFor="let option of selectedOptions" 
              class="selected-tag">
              {{ option.label }}
              <button 
                type="button"
                class="remove-tag"
                (click)="removeOption($event, option)"
                [attr.aria-label]="'Remove ' + option.label">
                ×
              </button>
            </span>
          </div>
          
          <!-- Placeholder -->
          <div class="placeholder" *ngIf="!hasSelection">
            {{ config.placeholder || 'Select an option' }}
          </div>

          <!-- Clear Button -->
          <button
            *ngIf="config.clearable && hasSelection"
            type="button"
            class="input-button clear-button"
            (click)="clearSelection($event)"
            [attr.aria-label]="'Clear selection'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <!-- Dropdown Arrow -->
          <div class="dropdown-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </div>
        </div>

        <!-- Dropdown -->
        <div class="select-dropdown" *ngIf="isOpen()" [style.max-height]="config.maxHeight || '200px'">
          <!-- Search Input -->
          <div class="search-container" *ngIf="config.searchable">
            <input
              type="text"
              class="search-input"
              [placeholder]="config.searchPlaceholder || 'Search options...'"
              [(ngModel)]="searchTerm"
              (input)="filterOptions()"
              (keydown)="onSearchKeyDown($event)"
            />
          </div>

          <!-- Options List -->
          <div class="options-list" role="listbox">
            <div *ngIf="filteredOptions.length === 0" class="no-options">
              {{ config.noOptionsText || 'No options available' }}
            </div>
            
            <div
              *ngFor="let option of filteredOptions; trackBy: trackByValue"
              class="select-option"
              [class.selected]="isSelected(option)"
              [class.disabled]="option.disabled"
              [attr.role]="'option'"
              [attr.aria-selected]="isSelected(option)"
              (click)="selectOption(option)"
              (mouseenter)="hoveredIndex = getOptionIndex(option)">
              {{ option.label }}
              
              <!-- Checkmark for selected options -->
              <div class="option-checkmark" *ngIf="isSelected(option)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </app-base-input>
  `,
  styleUrl: './select-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectInputComponent),
      multi: true
    }
  ]
})
export class SelectInputComponent extends BaseInputComponent implements ControlValueAccessor, OnInit {
  @Input() override config: SelectInputConfig = { options: [] };
  
  isOpen = signal(false);
  searchTerm = '';
  filteredOptions: SelectOption[] = [];
  hoveredIndex = -1;

  ngOnInit() {
    this.filterOptions();
  }

  get selectedOption(): SelectOption | null {
    if (this.config.multiple) return null;
    return this.config.options.find(option => option.value === this.value) || null;
  }

  get selectedOptions(): SelectOption[] {
    if (!this.config.multiple) return [];
    const selectedValues = Array.isArray(this.value) ? this.value : [];
    return this.config.options.filter(option => selectedValues.includes(option.value));
  }

  get hasSelection(): boolean {
    if (this.config.multiple) {
      return Array.isArray(this.value) && this.value.length > 0;
    }
    return this.value !== null && this.value !== undefined && this.value !== '';
  }

  toggleDropdown(): void {
    if (this.disabled || this.config.disabled) return;
    this.isOpen.update(value => !value);
    
    if (this.isOpen()) {
      this.filterOptions();
    }
  }

  selectOption(option: SelectOption): void {
    if (option.disabled) return;

    if (this.config.multiple) {
      const currentValues = Array.isArray(this.value) ? [...this.value] : [];
      const index = currentValues.indexOf(option.value);
      
      if (index > -1) {
        currentValues.splice(index, 1);
      } else {
        currentValues.push(option.value);
      }
      
      super.onInputChange(currentValues);
    } else {
      super.onInputChange(option.value);
      this.isOpen.set(false);
    }
  }

  removeOption(event: Event, option: SelectOption): void {
    event.stopPropagation();
    
    if (this.config.multiple && Array.isArray(this.value)) {
      const currentValues = [...this.value];
      const index = currentValues.indexOf(option.value);
      
      if (index > -1) {
        currentValues.splice(index, 1);
        super.onInputChange(currentValues);
      }
    }
  }

  clearSelection(event: Event): void {
    event.stopPropagation();
    super.onInputChange(this.config.multiple ? [] : null);
  }

  isSelected(option: SelectOption): boolean {
    if (this.config.multiple) {
      return Array.isArray(this.value) && this.value.includes(option.value);
    }
    return this.value === option.value;
  }

  filterOptions(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredOptions = this.config.options.filter(option =>
      option.label.toLowerCase().includes(term)
    );
  }

  getOptionIndex(option: SelectOption): number {
    return this.filteredOptions.indexOf(option);
  }

  trackByValue(index: number, option: SelectOption): any {
    return option.value;
  }

  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleDropdown();
        break;
      case 'Escape':
        this.isOpen.set(false);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.isOpen.set(true);
        } else {
          this.navigateOptions(1);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.isOpen()) {
          this.navigateOptions(-1);
        }
        break;
    }
  }

  onSearchKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.isOpen.set(false);
    }
  }

  private navigateOptions(direction: number): void {
    const maxIndex = this.filteredOptions.length - 1;
    this.hoveredIndex = Math.max(0, Math.min(maxIndex, this.hoveredIndex + direction));
    
    if (this.hoveredIndex >= 0 && this.hoveredIndex <= maxIndex) {
      const option = this.filteredOptions[this.hoveredIndex];
      if (!option.disabled) {
        this.selectOption(option);
      }
    }
  }
}
