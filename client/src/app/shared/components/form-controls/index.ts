// Form Controls Index - Export all form control components and interfaces

// Base component
export { BaseInputComponent, BaseInputConfig } from './base-input.component';

// Text input
export { TextInputComponent, TextInputConfig } from './text-input.component';

// Password input
export { PasswordInputComponent, PasswordInputConfig } from './password-input.component';

// Number input
export { NumberInputComponent, NumberInputConfig } from './number-input.component';

// Select input
export { SelectInputComponent, SelectInputConfig, SelectOption } from './select-input.component';

// Checkbox input
export { CheckboxInputComponent, CheckboxInputConfig } from './checkbox-input.component';

// Textarea input
export { TextareaInputComponent, TextareaInputConfig } from './textarea-input.component';

// Radio input
export { RadioInputComponent, RadioInputConfig, RadioOption } from './radio-input.component';

// File input
export { FileInputComponent, FileInputConfig, FileInfo } from './file-input.component';

// Import types for internal use
import type { TextInputConfig } from './text-input.component';
import type { PasswordInputConfig } from './password-input.component';
import type { NumberInputConfig } from './number-input.component';
import type { SelectInputConfig } from './select-input.component';
import type { CheckboxInputConfig } from './checkbox-input.component';
import type { TextareaInputConfig } from './textarea-input.component';
import type { RadioInputConfig } from './radio-input.component';
import type { FileInputConfig } from './file-input.component';

// Type definitions for configurations
export type FormControlConfig = 
  | TextInputConfig
  | PasswordInputConfig
  | NumberInputConfig
  | SelectInputConfig
  | CheckboxInputConfig
  | TextareaInputConfig
  | RadioInputConfig
  | FileInputConfig;
