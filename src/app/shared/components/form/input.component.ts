import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="input-group" [class.has-error]="hasError" [class.disabled]="disabled">
      <label *ngIf="label" class="input-label" [for]="inputId">
        {{ label }}
        <span *ngIf="required" class="required">*</span>
      </label>
      
      <div class="input-wrapper" [class.has-icon-left]="iconLeft" [class.has-icon-right]="iconRight || hasError">
        <!-- Left Icon -->
        <div *ngIf="iconLeft" class="input-icon input-icon-left">
          <app-icon [name]="iconLeft" size="16"></app-icon>
        </div>
        
        <!-- Input Field -->
        <input
          [id]="inputId"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [value]="value"
          [class]="inputClass"
          class="input-field"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
        />
        
        <!-- Right Icon or Error Icon -->
        <div *ngIf="iconRight || hasError" class="input-icon input-icon-right">
          <app-icon 
            [name]="hasError ? 'exclamation-triangle' : iconRight" 
            size="16"
            [className]="hasError ? 'icon-error' : ''"
          ></app-icon>
        </div>
      </div>
      
      <!-- Help Text or Error Message -->
      <div *ngIf="helpText || errorMessage" class="input-message">
        <span *ngIf="hasError && errorMessage" class="error-message">
          <app-icon name="exclamation-triangle" size="14"></app-icon>
          {{ errorMessage }}
        </span>
        <span *ngIf="!hasError && helpText" class="help-message">
          {{ helpText }}
        </span>
      </div>
    </div>
  `,
  styles: [`
    .input-group {
      position: relative;
      margin-bottom: var(--space-4);
    }
    
    .input-label {
      display: block;
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--text-primary);
      margin-bottom: var(--space-2);
      transition: color 0.2s ease;
    }
    
    .required {
      color: var(--accent-red);
      margin-left: var(--space-1);
    }
    
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    
    .input-field {
      width: 100%;
      padding: var(--space-3) var(--space-4);
      border: 2px solid var(--border-primary);
      border-radius: var(--radius-lg);
      font-size: 0.875rem;
      font-family: 'Inter', sans-serif;
      color: var(--text-primary);
      background: var(--bg-primary);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      outline: none;
    }
    
    .input-field::placeholder {
      color: var(--text-placeholder);
      font-weight: 400;
    }
    
    .input-field:focus {
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      background: var(--bg-primary);
    }
    
    .input-field:hover:not(:focus):not(:disabled) {
      border-color: var(--border-secondary);
    }
    
    .has-icon-left .input-field {
      padding-left: var(--space-12);
    }
    
    .has-icon-right .input-field {
      padding-right: var(--space-12);
    }
    
    .input-icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-tertiary);
      pointer-events: none;
      z-index: 1;
    }
    
    .input-icon-left {
      left: var(--space-4);
    }
    
    .input-icon-right {
      right: var(--space-4);
    }
    
    .input-message {
      margin-top: var(--space-2);
      font-size: 0.75rem;
      line-height: 1.4;
    }
    
    .error-message {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      color: var(--accent-red);
      font-weight: 500;
    }
    
    .help-message {
      color: var(--text-tertiary);
    }
    
    /* Error State */
    .has-error .input-field {
      border-color: var(--accent-red);
      background: var(--accent-red-light);
    }
    
    .has-error .input-field:focus {
      border-color: var(--accent-red);
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .has-error .input-label {
      color: var(--accent-red);
    }
    
    /* Disabled State */
    .disabled .input-field {
      background: var(--bg-tertiary);
      color: var(--text-tertiary);
      cursor: not-allowed;
      border-color: var(--border-primary);
    }
    
    .disabled .input-label {
      color: var(--text-tertiary);
    }
    
    /* Size Variants */
    .input-field.small {
      padding: var(--space-2) var(--space-3);
      font-size: 0.75rem;
    }
    
    .input-field.large {
      padding: var(--space-4) var(--space-5);
      font-size: 1rem;
    }
    
    /* Animation */
    .input-group {
      animation: fadeInUp 0.3s ease-out;
    }
  `]
})
export class InputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() iconLeft: string = '';
  @Input() iconRight: string = '';
  @Input() helpText: string = '';
  @Input() errorMessage: string = '';
  @Input() inputClass: string = '';
  
  @Output() inputChange = new EventEmitter<string>();
  @Output() inputFocus = new EventEmitter<void>();
  @Output() inputBlur = new EventEmitter<void>();
  
  value: string = '';
  inputId: string = `input-${Math.random().toString(36).substr(2, 9)}`;
  
  get hasError(): boolean {
    return !!this.errorMessage;
  }
  
  private onChange = (value: string) => {};
  private onTouched = () => {};
  
  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }
  
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.inputChange.emit(this.value);
  }
  
  onFocus(): void {
    this.inputFocus.emit();
  }
  
  onBlur(): void {
    this.onTouched();
    this.inputBlur.emit();
  }
}