import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  template: `
    <div class="select-group" [class.has-error]="hasError" [class.disabled]="disabled">
      <label *ngIf="label" class="select-label" [for]="selectId">
        {{ label }}
        <span *ngIf="required" class="required">*</span>
      </label>
      
      <div class="select-wrapper" [class.is-open]="isOpen">
        <div class="select-trigger" 
             [class.has-value]="hasValue"
             (click)="toggleDropdown()"
             [attr.tabindex]="disabled ? -1 : 0"
             (keydown)="onKeyDown($event)">
          
          <span class="select-value" [class.placeholder]="!hasValue">
            {{ displayValue || placeholder }}
          </span>
          
          <div class="select-icons">
            <app-icon 
              *ngIf="hasError" 
              name="exclamation-triangle" 
              size="16"
              className="icon-error select-icon"
            ></app-icon>
            <app-icon 
              name="chevron-down" 
              size="16"
              className="select-chevron"
              [class.rotated]="isOpen"
            ></app-icon>
          </div>
        </div>
        
        <!-- Dropdown -->
        <div class="select-dropdown" *ngIf="isOpen" [@slideInOut]>
          <div class="select-search" *ngIf="searchable">
            <input
              type="text"
              placeholder="Buscar..."
              class="search-input"
              [(ngModel)]="searchTerm"
              (input)="onSearch($event)"
            />
          </div>
          
          <div class="select-options" #optionsContainer>
            <div *ngIf="filteredOptions.length === 0" class="select-empty">
              <app-icon name="magnifying-glass" size="20"></app-icon>
              <span>Nenhuma opção encontrada</span>
            </div>
            
            <div 
              *ngFor="let option of filteredOptions; let i = index" 
              class="select-option"
              [class.selected]="isSelected(option)"
              [class.highlighted]="highlightedIndex === i"
              [class.disabled]="option.disabled"
              (click)="selectOption(option)"
              (mouseenter)="highlightedIndex = i"
            >
              <span class="option-label">{{ option.label }}</span>
              <app-icon 
                *ngIf="isSelected(option)" 
                name="check" 
                size="16"
                className="option-check"
              ></app-icon>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Help Text or Error Message -->
      <div *ngIf="helpText || errorMessage" class="select-message">
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
  animations: [
    // You would add Angular animations here
  ],
  styles: [`
    .select-group {
      position: relative;
      margin-bottom: var(--space-4);
    }
    
    .select-label {
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
    
    .select-wrapper {
      position: relative;
    }
    
    .select-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: var(--space-3) var(--space-4);
      border: 2px solid var(--border-primary);
      border-radius: var(--radius-lg);
      background: var(--bg-primary);
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      outline: none;
    }
    
    .select-trigger:hover:not(.disabled) {
      border-color: var(--border-secondary);
    }
    
    .select-trigger:focus,
    .is-open .select-trigger {
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .select-value {
      font-size: 0.875rem;
      color: var(--text-primary);
      font-weight: 500;
      flex: 1;
      text-align: left;
    }
    
    .select-value.placeholder {
      color: var(--text-placeholder);
      font-weight: 400;
    }
    
    .select-icons {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-left: var(--space-2);
    }
    
    .select-chevron {
      color: var(--text-tertiary);
      transition: transform 0.2s ease;
    }
    
    .select-chevron.rotated {
      transform: rotate(180deg);
    }
    
    .select-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 1000;
      background: var(--bg-primary);
      border: 1px solid var(--border-secondary);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      margin-top: var(--space-1);
      overflow: hidden;
      animation: fadeInUp 0.2s ease-out;
    }
    
    .select-search {
      padding: var(--space-3);
      border-bottom: 1px solid var(--border-primary);
      background: var(--bg-secondary);
    }
    
    .search-input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid var(--border-secondary);
      border-radius: 6px;
      font-size: 0.875rem;
    }
    
    .select-options {
      max-height: 240px;
      overflow-y: auto;
    }
    
    .select-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-8) var(--space-4);
      color: var(--text-tertiary);
      font-size: 0.875rem;
    }
    
    .select-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-3) var(--space-4);
      cursor: pointer;
      transition: all 0.2s ease;
      border-bottom: 1px solid var(--border-primary);
    }
    
    .select-option:last-child {
      border-bottom: none;
    }
    
    .select-option:hover,
    .select-option.highlighted {
      background: var(--accent-blue-light);
    }
    
    .select-option.selected {
      background: var(--accent-blue);
      color: var(--text-inverse);
    }
    
    .select-option.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: transparent !important;
    }
    
    .option-label {
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .option-check {
      color: var(--text-inverse);
    }
    
    .select-message {
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
    .has-error .select-trigger {
      border-color: var(--accent-red);
      background: var(--accent-red-light);
    }
    
    .has-error .select-trigger:focus {
      border-color: var(--accent-red);
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .has-error .select-label {
      color: var(--accent-red);
    }
    
    /* Disabled State */
    .disabled .select-trigger {
      background: var(--bg-tertiary);
      color: var(--text-tertiary);
      cursor: not-allowed;
      border-color: var(--border-primary);
    }
    
    .disabled .select-label {
      color: var(--text-tertiary);
    }
    
    /* Custom scrollbar for options */
    .select-options::-webkit-scrollbar {
      width: 6px;
    }
    
    .select-options::-webkit-scrollbar-track {
      background: var(--bg-secondary);
    }
    
    .select-options::-webkit-scrollbar-thumb {
      background: var(--border-secondary);
      border-radius: 3px;
    }
    
    .select-options::-webkit-scrollbar-thumb:hover {
      background: var(--text-tertiary);
    }
  `]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'Selecione...';
  @Input() options: SelectOption[] = [];
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() searchable: boolean = false;
  @Input() helpText: string = '';
  @Input() errorMessage: string = '';
  
  @Output() selectionChange = new EventEmitter<SelectOption | null>();
  
  value: any = null;
  isOpen: boolean = false;
  searchTerm: string = '';
  highlightedIndex: number = -1;
  selectId: string = `select-${Math.random().toString(36).substr(2, 9)}`;
  
  get hasError(): boolean {
    return !!this.errorMessage;
  }
  
  get hasValue(): boolean {
    return this.value !== null && this.value !== undefined && this.value !== '';
  }
  
  get displayValue(): string {
    if (!this.hasValue) return '';
    const option = this.options.find(opt => opt.value === this.value);
    return option ? option.label : String(this.value);
  }
  
  get filteredOptions(): SelectOption[] {
    if (!this.searchable || !this.searchTerm) {
      return this.options;
    }
    return this.options.filter(option =>
      option.label.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  
  private onChange = (value: any) => {};
  private onTouched = () => {};
  
  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.value = value;
  }
  
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  
  toggleDropdown(): void {
    if (this.disabled) return;
    
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.searchTerm = '';
      this.highlightedIndex = -1;
    }
  }
  
  selectOption(option: SelectOption): void {
    if (option.disabled) return;
    
    this.value = option.value;
    this.onChange(this.value);
    this.selectionChange.emit(option);
    this.isOpen = false;
    this.onTouched();
  }
  
  isSelected(option: SelectOption): boolean {
    return this.value === option.value;
  }
  
  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.highlightedIndex = -1;
  }
  
  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;
    
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.isOpen) {
          this.toggleDropdown();
        } else if (this.highlightedIndex >= 0) {
          this.selectOption(this.filteredOptions[this.highlightedIndex]);
        }
        break;
      case 'Escape':
        this.isOpen = false;
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.toggleDropdown();
        } else {
          this.highlightedIndex = Math.min(
            this.highlightedIndex + 1,
            this.filteredOptions.length - 1
          );
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.isOpen) {
          this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
        }
        break;
    }
  }
}