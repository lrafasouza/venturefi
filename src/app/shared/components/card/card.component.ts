import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="card-container" 
         [class]="cardClasses"
         [style.animation-delay]="animationDelay"
         (click)="onCardClick()">
      
      <!-- Card Header -->
      <div class="card-header" *ngIf="showHeader">
        <div class="card-title-section">
          <div *ngIf="icon" class="card-icon" [class]="iconVariant">
            <app-icon [name]="icon" [size]="iconSize"></app-icon>
          </div>
          
          <div class="card-title-content">
            <h3 *ngIf="title" class="card-title">{{ title }}</h3>
            <p *ngIf="subtitle" class="card-subtitle">{{ subtitle }}</p>
          </div>
        </div>
        
        <div class="card-actions" *ngIf="showActions">
          <ng-content select="[slot=header-actions]"></ng-content>
        </div>
      </div>
      
      <!-- Card Body -->
      <div class="card-body" [class.padded]="padded">
        <ng-content></ng-content>
      </div>
      
      <!-- Card Footer -->
      <div class="card-footer" *ngIf="showFooter">
        <ng-content select="[slot=footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card-container {
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-primary);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      position: relative;
    }
    
    /* Card Variants */
    .card-container.elevated {
      box-shadow: var(--shadow-md);
    }
    
    .card-container.interactive {
      cursor: pointer;
    }
    
    .card-container.interactive:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
      border-color: var(--border-secondary);
    }
    
    .card-container.success {
      border-left: 4px solid var(--accent-green);
      background: linear-gradient(135deg, var(--bg-primary), var(--accent-green-light));
    }
    
    .card-container.warning {
      border-left: 4px solid var(--accent-orange);
      background: linear-gradient(135deg, var(--bg-primary), var(--accent-orange-light));
    }
    
    .card-container.error {
      border-left: 4px solid var(--accent-red);
      background: linear-gradient(135deg, var(--bg-primary), var(--accent-red-light));
    }
    
    .card-container.info {
      border-left: 4px solid var(--accent-blue);
      background: linear-gradient(135deg, var(--bg-primary), var(--accent-blue-light));
    }
    
    .card-container.compact {
      padding: 0;
    }
    
    .card-container.loading {
      position: relative;
      pointer-events: none;
    }
    
    .card-container.loading::after {
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
      z-index: 1;
    }
    
    /* Card Header */
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: var(--space-6);
      border-bottom: 1px solid var(--border-primary);
      background: var(--bg-secondary);
    }
    
    .card-title-section {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
      flex: 1;
    }
    
    .card-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      flex-shrink: 0;
    }
    
    .card-icon.primary {
      background: var(--accent-blue-light);
      color: var(--accent-blue);
    }
    
    .card-icon.success {
      background: var(--accent-green-light);
      color: var(--accent-green);
    }
    
    .card-icon.warning {
      background: var(--accent-orange-light);
      color: var(--accent-orange);
    }
    
    .card-icon.error {
      background: var(--accent-red-light);
      color: var(--accent-red);
    }
    
    .card-icon.secondary {
      background: var(--bg-tertiary);
      color: var(--text-secondary);
    }
    
    .card-title {
      color: var(--text-primary);
      font-size: 1.125rem;
      font-weight: 700;
      margin: 0 0 var(--space-1) 0;
      line-height: 1.3;
    }
    
    .card-subtitle {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin: 0;
      line-height: 1.4;
    }
    
    .card-actions {
      display: flex;
      gap: var(--space-2);
      flex-shrink: 0;
      margin-left: var(--space-3);
    }
    
    /* Card Body */
    .card-body {
      flex: 1;
    }
    
    .card-body.padded {
      padding: var(--space-6);
    }
    
    /* Card Footer */
    .card-footer {
      padding: var(--space-4) var(--space-6);
      border-top: 1px solid var(--border-primary);
      background: var(--bg-secondary);
    }
    
    /* Size Variants */
    .card-container.small .card-header,
    .card-container.small .card-body.padded,
    .card-container.small .card-footer {
      padding: var(--space-4);
    }
    
    .card-container.small .card-title {
      font-size: 1rem;
    }
    
    .card-container.small .card-icon {
      width: 36px;
      height: 36px;
    }
    
    .card-container.large .card-header,
    .card-container.large .card-body.padded,
    .card-container.large .card-footer {
      padding: var(--space-8);
    }
    
    .card-container.large .card-title {
      font-size: 1.5rem;
    }
    
    .card-container.large .card-icon {
      width: 56px;
      height: 56px;
    }
    
    /* Animation Variants */
    .card-container.animate-fade-in {
      animation: fadeInUp 0.5s ease-out forwards;
      opacity: 0;
      transform: translateY(20px);
    }
    
    .card-container.animate-scale {
      animation: fadeInScale 0.4s ease-out forwards;
      opacity: 0;
      transform: scale(0.95);
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .card-header {
        flex-direction: column;
        gap: var(--space-3);
        align-items: flex-start;
      }
      
      .card-title-section {
        width: 100%;
      }
      
      .card-actions {
        width: 100%;
        justify-content: flex-end;
        margin-left: 0;
      }
    }
    
    /* Dark Mode Support */
    @media (prefers-color-scheme: dark) {
      .card-container.success {
        background: linear-gradient(135deg, var(--bg-primary), rgba(16, 185, 129, 0.05));
      }
      
      .card-container.warning {
        background: linear-gradient(135deg, var(--bg-primary), rgba(245, 158, 11, 0.05));
      }
      
      .card-container.error {
        background: linear-gradient(135deg, var(--bg-primary), rgba(239, 68, 68, 0.05));
      }
      
      .card-container.info {
        background: linear-gradient(135deg, var(--bg-primary), rgba(59, 130, 246, 0.05));
      }
    }
  `]
})
export class CardComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() icon: string = '';
  @Input() iconSize: string = '20';
  @Input() iconVariant: string = 'primary';
  @Input() variant: string = ''; // success, warning, error, info
  @Input() size: string = 'medium'; // small, medium, large
  @Input() interactive: boolean = false;
  @Input() elevated: boolean = false;
  @Input() loading: boolean = false;
  @Input() padded: boolean = true;
  @Input() showHeader: boolean = false;
  @Input() showFooter: boolean = false;
  @Input() showActions: boolean = false;
  @Input() animation: string = ''; // fade-in, scale
  @Input() animationDelay: string = '0s';
  @Input() clickable: boolean = false;
  
  get cardClasses(): string {
    const classes = [];
    
    if (this.variant) classes.push(this.variant);
    if (this.size !== 'medium') classes.push(this.size);
    if (this.interactive || this.clickable) classes.push('interactive');
    if (this.elevated) classes.push('elevated');
    if (this.loading) classes.push('loading');
    if (this.animation) classes.push(`animate-${this.animation}`);
    
    return classes.join(' ');
  }
  
  onCardClick(): void {
    if (this.interactive || this.clickable) {
      // Emit click event or handle navigation
      console.log('Card clicked');
    }
  }
}