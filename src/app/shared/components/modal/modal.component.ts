import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

export type ModalSize = 'small' | 'medium' | 'large' | 'xlarge' | 'fullscreen';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="modal-overlay" 
         *ngIf="isOpen"
         [@fadeIn]
         (click)="onOverlayClick($event)">
      <div class="modal-container" 
           [class]="'modal-' + size"
           [@slideIn]
           #modalContainer>
        
        <!-- Modal Header -->
        <div class="modal-header" *ngIf="showHeader">
          <div class="modal-title-section">
            <div *ngIf="icon" class="modal-icon" [class]="iconType">
              <app-icon [name]="icon" size="20"></app-icon>
            </div>
            <div>
              <h3 class="modal-title">{{ title }}</h3>
              <p *ngIf="subtitle" class="modal-subtitle">{{ subtitle }}</p>
            </div>
          </div>
          
          <button class="modal-close-btn" 
                  (click)="close()"
                  [disabled]="!closable">
            <app-icon name="x-mark" size="20"></app-icon>
          </button>
        </div>
        
        <!-- Modal Body -->
        <div class="modal-body" [class.scrollable]="scrollable">
          <ng-content></ng-content>
        </div>
        
        <!-- Modal Footer -->
        <div class="modal-footer" *ngIf="showFooter">
          <ng-content select="[slot=footer]"></ng-content>
          
          <!-- Default Footer Actions -->
          <div *ngIf="!hasFooterContent" class="modal-actions">
            <button *ngIf="showCancelButton" 
                    class="btn btn-outline"
                    (click)="cancel()"
                    [disabled]="loading">
              {{ cancelLabel }}
            </button>
            <button *ngIf="showConfirmButton" 
                    class="btn btn-primary"
                    [class.btn-loading]="loading"
                    (click)="confirm()"
                    [disabled]="loading">
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  animations: [
    // You would add Angular animations here
  ],
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--surface-overlay);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: var(--space-4);
      backdrop-filter: blur(4px);
    }
    
    .modal-container {
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      border: 1px solid var(--border-primary);
      max-height: 90vh;
      width: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
      animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    /* Modal Sizes */
    .modal-small {
      max-width: 400px;
    }
    
    .modal-medium {
      max-width: 600px;
    }
    
    .modal-large {
      max-width: 800px;
    }
    
    .modal-xlarge {
      max-width: 1200px;
    }
    
    .modal-fullscreen {
      max-width: none;
      max-height: none;
      height: 100vh;
      width: 100vw;
      border-radius: 0;
      margin: 0;
    }
    
    /* Modal Header */
    .modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: var(--space-6);
      border-bottom: 1px solid var(--border-primary);
      background: var(--bg-secondary);
      border-radius: var(--radius-xl) var(--radius-xl) 0 0;
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
      width: 40px;
      height: 40px;
      border-radius: var(--radius-lg);
      flex-shrink: 0;
    }
    
    .modal-icon.success {
      background: var(--accent-green-light);
      color: var(--accent-green);
    }
    
    .modal-icon.warning {
      background: var(--accent-orange-light);
      color: var(--accent-orange);
    }
    
    .modal-icon.error {
      background: var(--accent-red-light);
      color: var(--accent-red);
    }
    
    .modal-icon.info {
      background: var(--accent-blue-light);
      color: var(--accent-blue);
    }
    
    .modal-icon.default {
      background: var(--bg-tertiary);
      color: var(--text-secondary);
    }
    
    .modal-title {
      color: var(--text-primary);
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0 0 var(--space-1) 0;
      line-height: 1.2;
    }
    
    .modal-subtitle {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin: 0;
      line-height: 1.4;
    }
    
    .modal-close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: transparent;
      border: 1px solid var(--border-secondary);
      border-radius: var(--radius-lg);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }
    
    .modal-close-btn:hover:not(:disabled) {
      background: var(--bg-tertiary);
      color: var(--text-primary);
      border-color: var(--border-primary);
    }
    
    .modal-close-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    /* Modal Body */
    .modal-body {
      flex: 1;
      padding: var(--space-6);
      overflow: hidden;
    }
    
    .modal-body.scrollable {
      overflow-y: auto;
    }
    
    .modal-body.scrollable::-webkit-scrollbar {
      width: 8px;
    }
    
    .modal-body.scrollable::-webkit-scrollbar-track {
      background: var(--bg-secondary);
      border-radius: var(--radius-sm);
    }
    
    .modal-body.scrollable::-webkit-scrollbar-thumb {
      background: var(--border-secondary);
      border-radius: var(--radius-sm);
    }
    
    .modal-body.scrollable::-webkit-scrollbar-thumb:hover {
      background: var(--text-tertiary);
    }
    
    /* Modal Footer */
    .modal-footer {
      padding: var(--space-6);
      border-top: 1px solid var(--border-primary);
      background: var(--bg-secondary);
      border-radius: 0 0 var(--radius-xl) var(--radius-xl);
    }
    
    .modal-actions {
      display: flex;
      gap: var(--space-3);
      justify-content: flex-end;
    }
    
    /* Responsive Behavior */
    @media (max-width: 768px) {
      .modal-overlay {
        padding: var(--space-2);
        align-items: flex-start;
        padding-top: var(--space-8);
      }
      
      .modal-container {
        max-height: calc(100vh - var(--space-16));
        width: 100%;
      }
      
      .modal-small,
      .modal-medium,
      .modal-large,
      .modal-xlarge {
        max-width: none;
      }
      
      .modal-header {
        padding: var(--space-4);
        flex-direction: column;
        gap: var(--space-3);
        align-items: flex-start;
      }
      
      .modal-title-section {
        width: 100%;
      }
      
      .modal-close-btn {
        align-self: flex-end;
      }
      
      .modal-body {
        padding: var(--space-4);
      }
      
      .modal-footer {
        padding: var(--space-4);
      }
      
      .modal-actions {
        flex-direction: column-reverse;
      }
      
      .modal-actions .btn {
        width: 100%;
        justify-content: center;
      }
    }
    
    /* Loading State */
    .modal-container.loading {
      pointer-events: none;
    }
    
    .modal-container.loading::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-xl);
      z-index: 1;
    }
    
    /* High Contrast Mode */
    @media (prefers-contrast: high) {
      .modal-container {
        border: 2px solid var(--text-primary);
      }
      
      .modal-header,
      .modal-footer {
        border-color: var(--text-primary);
      }
    }
    
    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      .modal-container {
        animation: none;
      }
      
      @keyframes slideIn {
        from, to {
          opacity: 1;
          transform: none;
        }
      }
    }
  `]
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() size: ModalSize = 'medium';
  @Input() closable: boolean = true;
  @Input() showHeader: boolean = true;
  @Input() showFooter: boolean = false;
  @Input() scrollable: boolean = true;
  @Input() loading: boolean = false;
  @Input() icon: string = '';
  @Input() iconType: string = 'default';
  @Input() showCancelButton: boolean = true;
  @Input() showConfirmButton: boolean = true;
  @Input() cancelLabel: string = 'Cancelar';
  @Input() confirmLabel: string = 'Confirmar';
  @Input() closeOnOverlayClick: boolean = true;
  @Input() closeOnEscape: boolean = true;
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmModal = new EventEmitter<void>();
  @Output() cancelModal = new EventEmitter<void>();
  @Output() beforeClose = new EventEmitter<void>();
  @Output() afterClose = new EventEmitter<void>();
  
  @ViewChild('modalContainer', { static: false }) modalContainer!: ElementRef;
  
  hasFooterContent: boolean = false;
  
  ngOnInit(): void {
    // Check if there's custom footer content
    this.hasFooterContent = false; // This would be determined by checking ng-content
    
    // Prevent body scroll when modal is open
    if (this.isOpen) {
      document.body.style.overflow = 'hidden';
    }
  }
  
  ngOnDestroy(): void {
    // Restore body scroll
    document.body.style.overflow = '';
  }
  
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.isOpen && this.closeOnEscape && event.key === 'Escape' && this.closable) {
      event.preventDefault();
      this.close();
    }
  }
  
  onOverlayClick(event: Event): void {
    if (this.closeOnOverlayClick && this.closable && event.target === event.currentTarget) {
      this.close();
    }
  }
  
  close(): void {
    if (!this.closable || this.loading) return;
    
    this.beforeClose.emit();
    this.isOpen = false;
    this.closeModal.emit();
    
    // Restore body scroll
    setTimeout(() => {
      document.body.style.overflow = '';
      this.afterClose.emit();
    }, 300);
  }
  
  confirm(): void {
    if (this.loading) return;
    this.confirmModal.emit();
  }
  
  cancel(): void {
    if (this.loading) return;
    this.cancelModal.emit();
  }
  
  open(): void {
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
  }
}