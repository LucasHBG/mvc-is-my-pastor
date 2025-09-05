import { Component, Input, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseInputComponent, BaseInputConfig } from './base-input.component';

export interface FileInputConfig extends BaseInputConfig {
  accept?: string;
  multiple?: boolean;
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  allowedTypes?: string[];
  showPreview?: boolean;
  dragDrop?: boolean;
  uploadText?: string;
  browseText?: string;
  dropText?: string;
  replaceText?: string;
  removeText?: string;
}

export interface FileInfo {
  file: File;
  preview?: string;
  error?: string;
  id: string;
}

@Component({
  selector: 'app-file-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="file-wrapper" [class]="containerClasses">
      <!-- Label -->
      <label *ngIf="config.label" class="input-label">
        {{ config.label }}
        <span *ngIf="config.required" class="required-indicator">*</span>
      </label>

      <!-- File Input Container -->
      <div 
        class="file-input-container"
        [class.drag-over]="isDragOver"
        [class.has-files]="selectedFiles.length > 0"
        [class.disabled]="config.disabled"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="triggerFileInput()">
        
        <!-- Hidden file input -->
        <input
          type="file"
          [id]="config.id"
          [name]="config.name || config.id"
          [accept]="fileConfig.accept"
          [multiple]="fileConfig.multiple"
          [disabled]="config.disabled"
          [required]="config.required"
          (change)="onFileChange($event)"
          class="file-input-hidden"
          #fileInput>

        <!-- Upload Area -->
        <div class="upload-area" *ngIf="selectedFiles.length === 0">
          <div class="upload-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7,10 12,15 17,10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </div>
          
          <div class="upload-text">
            <p class="primary-text">
              {{ fileConfig.uploadText || (fileConfig.dragDrop ? 'Drop files here or click to browse' : 'Click to browse files') }}
            </p>
            <p class="secondary-text" *ngIf="fileConfig.accept || fileConfig.maxFileSize">
              <span *ngIf="fileConfig.accept">{{ getAcceptText() }}</span>
              <span *ngIf="fileConfig.accept && fileConfig.maxFileSize"> • </span>
              <span *ngIf="fileConfig.maxFileSize">Max {{ formatFileSize(fileConfig.maxFileSize) }}</span>
            </p>
          </div>

          <button type="button" class="browse-button" *ngIf="!fileConfig.dragDrop">
            {{ fileConfig.browseText || 'Browse Files' }}
          </button>
        </div>

        <!-- Selected Files -->
        <div class="selected-files" *ngIf="selectedFiles.length > 0">
          <div 
            *ngFor="let fileInfo of selectedFiles; let i = index" 
            class="file-item"
            [class.error]="fileInfo.error">
            
            <!-- File Preview -->
            <div class="file-preview" *ngIf="fileConfig.showPreview && fileInfo.preview">
              <img [src]="fileInfo.preview" [alt]="fileInfo.file.name" class="preview-image">
            </div>

            <!-- File Icon -->
            <div class="file-icon" *ngIf="!fileConfig.showPreview || !fileInfo.preview">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"></path>
              </svg>
            </div>

            <!-- File Info -->
            <div class="file-info">
              <span class="file-name">{{ fileInfo.file.name }}</span>
              <span class="file-size">{{ formatFileSize(fileInfo.file.size) }}</span>
              <span class="file-error" *ngIf="fileInfo.error">{{ fileInfo.error }}</span>
            </div>

            <!-- Remove Button -->
            <button 
              type="button" 
              class="remove-button"
              (click)="removeFile(i, $event)"
              [attr.aria-label]="'Remove ' + fileInfo.file.name">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Add More Button -->
          <button 
            type="button" 
            class="add-more-button"
            *ngIf="fileConfig.multiple && (!fileConfig.maxFiles || selectedFiles.length < fileConfig.maxFiles)"
            (click)="triggerFileInput()">
            + Add More Files
          </button>
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
  styleUrl: './file-input.component.scss'
})
export class FileInputComponent extends BaseInputComponent {
  @Input() override config: FileInputConfig = {};
  
  selectedFiles: FileInfo[] = [];
  isDragOver = false;
  private dragCounter = 0;

  constructor(private elementRef: ElementRef) {
    super();
  }

  get fileConfig(): FileInputConfig {
    return this.config as FileInputConfig;
  }

  override get containerClasses(): string {
    const baseClasses = super.containerClasses;
    const dragDropClass = this.fileConfig.dragDrop !== false ? 'drag-drop' : '';
    const previewClass = this.fileConfig.showPreview ? 'show-preview' : '';
    
    return `${baseClasses} ${dragDropClass} ${previewClass}`.trim();
  }

  triggerFileInput(): void {
    if (this.config.disabled) return;
    
    const fileInput = this.elementRef.nativeElement.querySelector('.file-input-hidden') as HTMLInputElement;
    fileInput?.click();
  }

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  onDragOver(event: DragEvent): void {
    if (!this.fileConfig.dragDrop || this.config.disabled) return;
    
    event.preventDefault();
    this.dragCounter++;
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    if (!this.fileConfig.dragDrop || this.config.disabled) return;
    
    event.preventDefault();
    this.dragCounter--;
    
    if (this.dragCounter === 0) {
      this.isDragOver = false;
    }
  }

  onDrop(event: DragEvent): void {
    if (!this.fileConfig.dragDrop || this.config.disabled) return;
    
    event.preventDefault();
    this.isDragOver = false;
    this.dragCounter = 0;
    
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  private handleFiles(files: File[]): void {
    const newFiles: FileInfo[] = [];
    
    for (const file of files) {
      // Check if we've reached max files limit
      if (this.fileConfig.maxFiles && 
          (this.selectedFiles.length + newFiles.length) >= this.fileConfig.maxFiles) {
        break;
      }

      const fileInfo: FileInfo = {
        file,
        id: this.generateFileId(),
        error: this.validateFile(file)
      };

      // Generate preview for images
      if (this.fileConfig.showPreview && file.type.startsWith('image/') && !fileInfo.error) {
        this.generatePreview(file, fileInfo);
      }

      newFiles.push(fileInfo);
    }

    if (!this.fileConfig.multiple) {
      this.selectedFiles = newFiles.slice(0, 1);
    } else {
      this.selectedFiles = [...this.selectedFiles, ...newFiles];
    }

    this.updateFormValue();
  }

  private validateFile(file: File): string | undefined {
    // Check file size
    if (this.fileConfig.maxFileSize && file.size > this.fileConfig.maxFileSize) {
      return `File size exceeds ${this.formatFileSize(this.fileConfig.maxFileSize)}`;
    }

    // Check allowed types
    if (this.fileConfig.allowedTypes && this.fileConfig.allowedTypes.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const mimeType = file.type.toLowerCase();
      
      const isAllowed = this.fileConfig.allowedTypes.some(type => 
        type.startsWith('.') ? type.substring(1) === fileExtension :
        type.includes('/') ? mimeType === type.toLowerCase() :
        mimeType.startsWith(type.toLowerCase() + '/')
      );

      if (!isAllowed) {
        return `File type not allowed. Allowed: ${this.fileConfig.allowedTypes.join(', ')}`;
      }
    }

    return undefined;
  }

  private generatePreview(file: File, fileInfo: FileInfo): void {
    const reader = new FileReader();
    reader.onload = () => {
      fileInfo.preview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  private generateFileId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  removeFile(index: number, event: Event): void {
    event.stopPropagation();
    this.selectedFiles.splice(index, 1);
    this.updateFormValue();
  }

  private updateFormValue(): void {
    const files = this.selectedFiles.map(fileInfo => fileInfo.file);
    const value = this.fileConfig.multiple ? files : (files[0] || null);
    this.onInputChange(value);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  getAcceptText(): string {
    if (!this.fileConfig.accept) return '';
    
    const types = this.fileConfig.accept.split(',').map(type => type.trim());
    const extensions = types.filter(type => type.startsWith('.')).map(type => type.toUpperCase());
    const mimeTypes = types.filter(type => !type.startsWith('.'));
    
    const parts: string[] = [];
    
    if (mimeTypes.some(type => type.startsWith('image/'))) {
      parts.push('Images');
    }
    if (mimeTypes.some(type => type.startsWith('video/'))) {
      parts.push('Videos');
    }
    if (mimeTypes.some(type => type.startsWith('audio/'))) {
      parts.push('Audio');
    }
    if (extensions.length > 0) {
      parts.push(extensions.join(', '));
    }
    
    return parts.join(', ') || 'Allowed files';
  }

  override writeValue(value: any): void {
    // Handle programmatic value setting
    if (!value) {
      this.selectedFiles = [];
    } else if (Array.isArray(value)) {
      // Handle multiple files
      this.selectedFiles = value.map(file => ({
        file,
        id: this.generateFileId()
      }));
    } else if (value instanceof File) {
      // Handle single file
      this.selectedFiles = [{
        file: value,
        id: this.generateFileId()
      }];
    }

    super.writeValue(value);
  }
}
