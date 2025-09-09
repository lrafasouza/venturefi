import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IconComponent } from '../icon/icon.component';
import { ModalService, ModalConfig, ModalResult } from '../../services/modal.service';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea' | 'date' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: any; label: string }[];
  value?: any;
}

@Component({
  selector: 'app-dynamic-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IconComponent],
  template: `
    <div class="modal-overlay" *ngFor="let modal of activeModals" [class.show]="modal.isOpen">
      <div class="modal-container" [class]="'modal-size-' + (modal.size || 'medium')" (click)="$event.stopPropagation()">
        
        <!-- Modal Header -->
        <div class="modal-header" [class]="'modal-header-' + (modal.type || 'info')">
          <div class="modal-title-section">
            <div class="modal-icon" *ngIf="modal.icon">
              <app-icon [name]="modal.icon" size="24"></app-icon>
            </div>
            <div class="modal-title-content">
              <h2 class="modal-title">{{ modal.title }}</h2>
              <p class="modal-subtitle" *ngIf="modal.subtitle">{{ modal.subtitle }}</p>
            </div>
          </div>
          <button class="modal-close" (click)="closeModal(modal.id, { action: 'close' })" *ngIf="modal.closable !== false">
            <app-icon name="x-mark" size="20"></app-icon>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <!-- Mensagem simples -->
          <p class="modal-message" *ngIf="modal.message">{{ modal.message }}</p>

          <!-- Formulário dinâmico para transação/meta -->
          <form [formGroup]="dynamicForm" *ngIf="modal.data?.fields" class="dynamic-form">
            <div class="form-grid">
              <div class="form-field" *ngFor="let field of modal.data.fields" [class]="'field-' + field.type">
                <label class="form-label" [class.required]="field.required">
                  {{ field.label }}
                  <span class="required-asterisk" *ngIf="field.required">*</span>
                </label>

                <!-- Text/Number/Email/Password/Date inputs -->
                <input 
                  *ngIf="['text', 'number', 'email', 'password', 'date'].includes(field.type)"
                  class="form-input"
                  [type]="field.type"
                  [formControlName]="field.name"
                  [placeholder]="field.placeholder"
                  [min]="field.min"
                  [max]="field.max"
                  [step]="field.step">

                <!-- Textarea -->
                <textarea 
                  *ngIf="field.type === 'textarea'"
                  class="form-textarea"
                  [formControlName]="field.name"
                  [placeholder]="field.placeholder"
                  rows="3">
                </textarea>

                <!-- Select -->
                <select 
                  *ngIf="field.type === 'select'"
                  class="form-select"
                  [formControlName]="field.name">
                  <option value="">Selecione...</option>
                  <option *ngFor="let option of field.options" [value]="option.value">
                    {{ option.label }}
                  </option>
                </select>

                <!-- Checkbox -->
                <label *ngIf="field.type === 'checkbox'" class="form-checkbox">
                  <input type="checkbox" [formControlName]="field.name">
                  <span class="checkbox-label">{{ field.placeholder }}</span>
                </label>

                <!-- Validation errors -->
                <div class="form-error" *ngIf="dynamicForm.get(field.name)?.errors && dynamicForm.get(field.name)?.touched">
                  <span *ngIf="dynamicForm.get(field.name)?.errors?.['required']">
                    {{ field.label }} é obrigatório
                  </span>
                  <span *ngIf="dynamicForm.get(field.name)?.errors?.['min']">
                    Valor mínimo: {{ field.min }}
                  </span>
                  <span *ngIf="dynamicForm.get(field.name)?.errors?.['email']">
                    Email inválido
                  </span>
                </div>
              </div>
            </div>
          </form>

          <!-- Premium Modal Content -->
          <div class="premium-content" *ngIf="modal.data?.type === 'premium'">
            <div class="premium-features">
              <h3>Recursos Premium</h3>
              <ul class="features-list">
                <li *ngFor="let feature of modal.data.features">
                  <app-icon name="check-circle" size="16" class="feature-check"></app-icon>
                  {{ feature }}
                </li>
              </ul>
            </div>

            <div class="premium-plans" *ngIf="modal.data.plans?.length">
              <h3>Escolha seu plano</h3>
              <div class="plans-grid">
                <div class="plan-card" *ngFor="let plan of modal.data.plans" 
                     [class.popular]="plan.popular"
                     (click)="selectPlan(plan)">
                  <div class="plan-header">
                    <div class="plan-badge" *ngIf="plan.popular">Mais Popular</div>
                    <h4>{{ plan.name }}</h4>
                    <div class="plan-price">
                      <span class="currency">R$</span>
                      <span class="amount">{{ plan.price }}</span>
                      <span class="period">/ {{ plan.period }}</span>
                    </div>
                    <div class="plan-discount" *ngIf="plan.discount">{{ plan.discount }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer" *ngIf="modal.showFooter">
          <button 
            class="btn btn-outline" 
            (click)="closeModal(modal.id, { action: 'cancel' })"
            *ngIf="modal.cancelLabel">
            {{ modal.cancelLabel }}
          </button>
          <button 
            class="btn btn-primary" 
            (click)="confirmModal(modal)"
            [disabled]="modal.data?.fields && dynamicForm.invalid">
            {{ modal.confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s ease;
      padding: var(--space-4);
    }

    .modal-overlay.show {
      opacity: 1;
      pointer-events: all;
    }

    .modal-container {
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      border: 1px solid var(--border-primary);
      max-height: 90vh;
      overflow-y: auto;
      transform: scale(0.95);
      transition: transform 0.3s ease;
      position: relative;
    }

    .modal-overlay.show .modal-container {
      transform: scale(1);
    }

    .modal-size-small {
      width: 100%;
      max-width: 400px;
    }

    .modal-size-medium {
      width: 100%;
      max-width: 600px;
    }

    .modal-size-large {
      width: 100%;
      max-width: 800px;
    }

    .modal-size-xlarge {
      width: 100%;
      max-width: 1000px;
    }

    .modal-size-fullscreen {
      width: 95vw;
      height: 95vh;
      max-width: none;
      max-height: none;
    }

    .modal-header {
      padding: var(--space-6);
      border-bottom: 1px solid var(--border-primary);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .modal-header-success {
      border-bottom-color: var(--accent-green);
      background: var(--accent-green-light);
    }

    .modal-header-error {
      border-bottom-color: var(--accent-red);
      background: var(--accent-red-light);
    }

    .modal-header-warning {
      border-bottom-color: var(--accent-orange);
      background: var(--accent-orange-light);
    }

    .modal-title-section {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
      flex: 1;
    }

    .modal-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: var(--accent-blue-light);
      color: var(--accent-blue);
      border-radius: var(--radius-lg);
      flex-shrink: 0;
    }

    .modal-title-content {
      flex: 1;
    }

    .modal-title {
      color: var(--text-primary);
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
      line-height: 1.3;
    }

    .modal-subtitle {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin: var(--space-1) 0 0 0;
      line-height: 1.4;
    }

    .modal-close {
      background: none;
      border: none;
      color: var(--text-tertiary);
      cursor: pointer;
      padding: var(--space-2);
      border-radius: var(--radius-md);
      transition: all 0.2s ease;

      &:hover {
        background: var(--bg-secondary);
        color: var(--text-primary);
      }
    }

    .modal-body {
      padding: var(--space-6);
      max-height: 60vh;
      overflow-y: auto;
    }

    .modal-message {
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
    }

    .dynamic-form {
      margin-top: var(--space-4);
    }

    .form-grid {
      display: grid;
      gap: var(--space-4);
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .form-label {
      color: var(--text-primary);
      font-weight: 500;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }

    .required-asterisk {
      color: var(--accent-red);
    }

    .form-input,
    .form-select,
    .form-textarea {
      padding: var(--space-3);
      border: 1px solid var(--border-secondary);
      border-radius: var(--radius-lg);
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: 0.875rem;
      transition: all 0.2s ease;

      &:focus {
        outline: none;
        border-color: var(--accent-blue);
        box-shadow: 0 0 0 3px var(--accent-blue-light);
      }

      &::placeholder {
        color: var(--text-placeholder);
      }
    }

    .form-checkbox {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      cursor: pointer;
      font-size: 0.875rem;
    }

    .form-error {
      color: var(--accent-red);
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }

    .premium-content {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .features-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: var(--space-3);
    }

    .features-list li {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--text-secondary);
    }

    .feature-check {
      color: var(--accent-green);
    }

    .plans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-4);
    }

    .plan-card {
      border: 2px solid var(--border-primary);
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;

      &:hover {
        border-color: var(--accent-blue);
        box-shadow: var(--shadow-md);
      }

      &.popular {
        border-color: var(--accent-blue);
        background: var(--accent-blue-light);
      }
    }

    .plan-badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--accent-blue);
      color: var(--text-inverse);
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .plan-header h4 {
      margin: 0 0 var(--space-2) 0;
      color: var(--text-primary);
    }

    .plan-price {
      display: flex;
      align-items: baseline;
      gap: var(--space-1);
      margin: var(--space-2) 0;
    }

    .currency {
      font-size: 1rem;
      color: var(--text-secondary);
    }

    .amount {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .period {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .plan-discount {
      background: var(--accent-green-light);
      color: var(--accent-green);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-md);
      font-size: 0.75rem;
      font-weight: 600;
      display: inline-block;
      margin-top: var(--space-2);
    }

    .modal-footer {
      padding: var(--space-6);
      border-top: 1px solid var(--border-primary);
      display: flex;
      gap: var(--space-3);
      justify-content: flex-end;
      background: var(--bg-secondary);
    }

    @media (max-width: 640px) {
      .modal-container {
        margin: var(--space-4);
        max-height: calc(100vh - 2rem);
      }

      .plans-grid {
        grid-template-columns: 1fr;
      }

      .modal-footer {
        flex-direction: column-reverse;
      }
    }
  `]
})
export class DynamicModalComponent implements OnInit, OnDestroy {
  activeModals: any[] = [];
  dynamicForm!: FormGroup;
  selectedPlan: any = null;
  private subscription = new Subscription();

  constructor(
    private modalService: ModalService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.modalService.modals$.subscribe(modals => {
        this.activeModals = modals;
        if (modals.length > 0) {
          this.buildForm(modals[modals.length - 1]);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private buildForm(modal: any) {
    if (modal.data?.fields) {
      const formControls: any = {};
      
      modal.data.fields.forEach((field: FormField) => {
        const validators = [];
        if (field.required) {
          validators.push(Validators.required);
        }
        if (field.type === 'email') {
          validators.push(Validators.email);
        }
        if (field.min !== undefined) {
          validators.push(Validators.min(field.min));
        }
        
        formControls[field.name] = [field.value || '', validators];
      });
      
      this.dynamicForm = this.formBuilder.group(formControls);
    }
  }

  closeModal(modalId: string, result: ModalResult) {
    this.modalService.close(modalId, result);
  }

  confirmModal(modal: any) {
    let result: ModalResult = { action: 'confirm' };
    
    if (modal.data?.fields && this.dynamicForm) {
      if (this.dynamicForm.invalid) {
        this.dynamicForm.markAllAsTouched();
        return;
      }
      result.data = this.dynamicForm.value;
    } else if (modal.data?.type === 'premium' && this.selectedPlan) {
      result.data = this.selectedPlan;
    }
    
    // Chamar callback se existir
    if (modal.data?.onConfirm) {
      modal.data.onConfirm(result.data);
    }
    
    this.modalService.close(modal.id, result);
  }

  selectPlan(plan: any) {
    this.selectedPlan = plan;
  }
}