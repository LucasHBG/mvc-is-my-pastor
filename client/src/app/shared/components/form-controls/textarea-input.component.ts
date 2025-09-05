import { Component, Input, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseInputComponent, BaseInputConfig } from './base-input.component';

export interface TextareaInputConfig extends BaseInputConfig {
  rows?: number;
  cols?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  maxLength?: number;
  showCharCount?: boolean;
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
  onEnter?: () => void;
}

@Component({
  selector: 'app-textarea-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="textarea-wrapper" [class]="containerClasses">
      <!-- Label -->
      <label *ngIf="config.label" [for]="config.id" class="input-label">
        {{ config.label }}
        <span *ngIf="config.required" class="required-indicator">*</span>
      </label>

      <!-- Textarea Container -->
      <div class="textarea-container" [class.has-error]="hasError" [class.focused]="isFocused">
        <textarea
          [id]="config.id"
          [name]="config.name || config.id"
          [placeholder]="config.placeholder"
          [disabled]="config.disabled"
          [readonly]="config.readonly"
          [required]="config.required"
          [rows]="textareaConfig.rows || 4"
          [cols]="textareaConfig.cols"
          [attr.maxlength]="textareaConfig.maxLength"
          [attr.aria-label]="config.ariaLabel"
          [attr.aria-describedby]="config.ariaDescribedBy"
          [value]="value || ''"
          (input)="onInput($event)"
          (focus)="onFocus()"
          (blur)="onBlur($event)"
          (keydown)="onKeyDown($event)"
          class="textarea-input"
          [style.resize]="textareaConfig.resize || 'vertical'"
          #textareaElement>
        </textarea>

        <!-- Auto-resize functionality -->
        <div *ngIf="textareaConfig.autoResize" class="resize-helper" [innerHTML]="value + '&nbsp;'"></div>
      </div>

      <!-- Character Count -->
      <div *ngIf="textareaConfig.showCharCount" class="char-count">
        {{ (value || '').length }}{{ textareaConfig.maxLength ? '/' + textareaConfig.maxLength : '' }}
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
  styleUrl: './textarea-input.component.scss'
})
export class TextareaInputComponent extends BaseInputComponent implements AfterViewInit {
  @Input() override config: TextareaInputConfig = {};
  isFocused = false;

  constructor(private elementRef: ElementRef) {
    super();
  }

  get textareaConfig(): TextareaInputConfig {
    return this.config as TextareaInputConfig;
  }

  override get containerClasses(): string {
    const baseClasses = super.containerClasses;
    const sizeClass = this.textareaConfig.autoResize ? 'auto-resize' : '';
    
    return `${baseClasses} ${sizeClass}`.trim();
  }

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    let value = target.value;

    // Handle max length manually if needed (for better UX)
    if (this.textareaConfig.maxLength && value.length > this.textareaConfig.maxLength) {
      value = value.substring(0, this.textareaConfig.maxLength);
      target.value = value;
    }

    this.onInputChange(value);
    this.handleAutoResize(target);
  }

  onKeyDown(event: KeyboardEvent): void {
    // Handle tab behavior - allow tab insertion if configured
    if (event.key === 'Tab' && !event.shiftKey && !event.ctrlKey) {
      // Let browser handle tab navigation by default
      // Override this behavior if needed
    }

    // Handle enter behavior
    if (event.key === 'Enter' && event.ctrlKey && this.textareaConfig.onEnter) {
      event.preventDefault();
      this.textareaConfig.onEnter();
    }
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(event: FocusEvent): void {
    this.isFocused = false;
    this.onInputBlur();
  }

  private handleAutoResize(textarea: HTMLTextAreaElement): void {
    if (!this.textareaConfig.autoResize) return;

    const minRows = this.textareaConfig.minRows || 2;
    const maxRows = this.textareaConfig.maxRows || 10;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';
    
    // Calculate the number of rows needed
    const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight) || 20;
    const padding = parseInt(window.getComputedStyle(textarea).paddingTop) * 2 || 16;
    const border = parseInt(window.getComputedStyle(textarea).borderTopWidth) * 2 || 2;
    
    const minHeight = (minRows * lineHeight) + padding + border;
    const maxHeight = (maxRows * lineHeight) + padding + border;
    const scrollHeight = textarea.scrollHeight;

    let newHeight = Math.max(minHeight, scrollHeight);
    newHeight = Math.min(newHeight, maxHeight);

    textarea.style.height = `${newHeight}px`;
  }

  ngAfterViewInit(): void {
    // Initialize auto-resize if enabled
    if (this.textareaConfig.autoResize) {
      const textarea = this.elementRef.nativeElement.querySelector('.textarea-input') as HTMLTextAreaElement;
      if (textarea) {
        setTimeout(() => this.handleAutoResize(textarea), 0);
      }
    }
  }

  override writeValue(value: any): void {
    super.writeValue(value);
    
    // Handle auto-resize when value is set programmatically
    if (this.textareaConfig.autoResize) {
      setTimeout(() => {
        const textarea = this.elementRef.nativeElement.querySelector('.textarea-input') as HTMLTextAreaElement;
        if (textarea) {
          this.handleAutoResize(textarea);
        }
      }, 0);
    }
  }
}
