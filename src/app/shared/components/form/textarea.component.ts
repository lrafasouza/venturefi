import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule, IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ],
  template: `
    <div class="textarea-group" [class.has-error]="hasError" [class.disabled]="disabled">
      <label *ngIf="label" class="textarea-label" [for]="textareaId">
        {{ label }}
        <span *ngIf="required" class="required">*</span>
      </label>
      
      <div class="textarea-wrapper">
        <textarea
          [id]="textareaId"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [rows]="rows"
          [attr.maxlength]="maxLength"
          [value]="value"
          class="textarea-field"
          [class]="textareaClass"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          (keydown)="onKeyDown($event)"
        ></textarea>
        
        <!-- Character Counter -->
        <div *ngIf="showCounter" class="character-counter" [class.warning]="isNearLimit" [class.error]="isOverLimit">
          {{ currentLength }}{{ maxLength ? '/' + maxLength : '' }}
        </div>
        
        <!-- Error Icon -->
        <div *ngIf="hasError" class="textarea-icon">
          <app-icon name="exclamation-triangle" size="16" className="icon-error"></app-icon>
        </div>
      </div>
      
      <!-- Help Text or Error Message -->
      <div *ngIf="helpText || errorMessage" class="textarea-message">
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
    .textarea-group {
      position: relative;
      margin-bottom: var(--space-4);
    }
    
    .textarea-label {
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
    
    .textarea-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
    }
    
    .textarea-field {
      width: 100%;
      min-height: 120px;
      padding: var(--space-4);
      border: 2px solid var(--border-primary);
      border-radius: var(--radius-lg);
      font-size: 0.875rem;
      font-family: 'Inter', sans-serif;
      color: var(--text-primary);
      background: var(--bg-primary);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      outline: none;
      resize: vertical;
      line-height: 1.5;
    }
    
    .textarea-field::placeholder {
      color: var(--text-placeholder);
      font-weight: 400;
    }
    
    .textarea-field:focus {
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      background: var(--bg-primary);
    }
    
    .textarea-field:hover:not(:focus):not(:disabled) {
      border-color: var(--border-secondary);
    }
    
    .character-counter {
      position: absolute;
      bottom: var(--space-2);
      right: var(--space-3);
      font-size: 0.75rem;
      color: var(--text-tertiary);
      background: var(--bg-primary);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-sm);
      font-weight: 500;
      transition: color 0.2s ease;
    }
    
    .character-counter.warning {
      color: var(--accent-orange);
    }
    
    .character-counter.error {
      color: var(--accent-red);
      font-weight: 600;
    }
    
    .textarea-icon {
      position: absolute;
      top: var(--space-3);
      right: var(--space-3);
      color: var(--accent-red);
      pointer-events: none;
    }
    
    .textarea-message {
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
    .has-error .textarea-field {
      border-color: var(--accent-red);
      background: var(--accent-red-light);
      padding-top: var(--space-4);
      padding-right: var(--space-12);
    }
    
    .has-error .textarea-field:focus {
      border-color: var(--accent-red);
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .has-error .textarea-label {
      color: var(--accent-red);
    }
    
    .has-error .character-counter {
      bottom: var(--space-8);
    }
    
    /* Disabled State */
    .disabled .textarea-field {
      background: var(--bg-tertiary);
      color: var(--text-tertiary);
      cursor: not-allowed;
      border-color: var(--border-primary);
      resize: none;
    }
    
    .disabled .textarea-label {
      color: var(--text-tertiary);
    }
    
    /* Size Variants */
    .textarea-field.small {
      min-height: 80px;
      padding: var(--space-3);
      font-size: 0.75rem;
    }
    
    .textarea-field.large {
      min-height: 160px;
      padding: var(--space-5);
      font-size: 1rem;
    }
    
    /* Auto-resize */
    .textarea-field.auto-resize {
      resize: none;
      overflow: hidden;
    }
    
    /* Animation */
    .textarea-group {
      animation: fadeInUp 0.3s ease-out;
    }
    
    /* Custom scrollbar */
    .textarea-field::-webkit-scrollbar {
      width: 8px;
    }
    
    .textarea-field::-webkit-scrollbar-track {
      background: var(--bg-secondary);
      border-radius: var(--radius-sm);
    }
    
    .textarea-field::-webkit-scrollbar-thumb {
      background: var(--border-secondary);
      border-radius: var(--radius-sm);
    }
    
    .textarea-field::-webkit-scrollbar-thumb:hover {
      background: var(--text-tertiary);
    }
  `]
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() rows: number = 4;
  @Input() maxLength?: number;
  @Input() showCounter: boolean = false;
  @Input() autoResize: boolean = false;
  @Input() helpText: string = '';
  @Input() errorMessage: string = '';
  @Input() textareaClass: string = '';
  
  @Output() textareaChange = new EventEmitter<string>();
  @Output() textareaFocus = new EventEmitter<void>();
  @Output() textareaBlur = new EventEmitter<void>();
  
  value: string = '';
  textareaId: string = `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  get hasError(): boolean {
    return !!this.errorMessage;
  }
  
  get currentLength(): number {
    return this.value ? this.value.length : 0;
  }
  
  get isNearLimit(): boolean {
    if (!this.maxLength) return false;
    return this.currentLength >= this.maxLength * 0.8;
  }
  
  get isOverLimit(): boolean {
    if (!this.maxLength) return false;
    return this.currentLength > this.maxLength;
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
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    
    // Auto-resize functionality
    if (this.autoResize) {
      target.style.height = 'auto';
      target.style.height = target.scrollHeight + 'px';
    }
    
    this.onChange(this.value);
    this.textareaChange.emit(this.value);
  }
  
  onFocus(): void {
    this.textareaFocus.emit();
  }
  
  onBlur(): void {
    this.onTouched();
    this.textareaBlur.emit();
  }
  
  onKeyDown(event: KeyboardEvent): void {
    // Allow tab indentation
    if (event.key === 'Tab') {
      event.preventDefault();
      const target = event.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      // Insert tab character
      target.value = target.value.substring(0, start) + '\t' + target.value.substring(end);
      target.selectionStart = target.selectionEnd = start + 1;
      
      // Trigger input event
      const inputEvent = new Event('input', { bubbles: true });
      target.dispatchEvent(inputEvent);
    }
  }
}