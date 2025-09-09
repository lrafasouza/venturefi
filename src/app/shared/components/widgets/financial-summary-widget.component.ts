import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-financial-summary-widget',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="financial-widget" [class]="'widget-' + data?.icon">
      <div class="widget-header">
        <h3>{{ title }}</h3>
        <div class="widget-icon">
          <app-icon [name]="data?.icon || 'wallet'" size="20" className="icon-primary"></app-icon>
        </div>
      </div>
      
      <div class="widget-value">
        R$ {{ formatCurrency(data?.value || 0) }}
      </div>
      
      <div class="widget-change" [class]="getChangeClass()">
        <app-icon 
          [name]="(data?.change || 0) >= 0 ? 'arrow-trending-up' : 'arrow-trending-down'" 
          size="16">
        </app-icon>
        <span>{{ formatChange(data?.change || 0) }}% este mês</span>
      </div>
    </div>
  `,
  styles: [`
    .financial-widget {
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      border: 1px solid var(--border-primary);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .financial-widget:hover {
      box-shadow: var(--shadow-md);
      border-color: var(--border-secondary);
    }
    
    .widget-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
    }
    
    .widget-header h3 {
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }
    
    .widget-icon {
      padding: var(--space-2);
      border-radius: var(--radius-lg);
      background: var(--accent-blue-light);
    }
    
    .widget-balance .widget-icon {
      background: var(--primary-100);
    }
    
    .widget-arrow-trending-up .widget-icon {
      background: var(--accent-green-light);
    }
    
    .widget-arrow-trending-down .widget-icon {
      background: var(--accent-orange-light);
    }
    
    .widget-target .widget-icon {
      background: var(--accent-purple-light);
    }
    
    .widget-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: var(--space-3);
      line-height: 1.2;
      letter-spacing: -0.025em;
    }
    
    .widget-change {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .widget-change.positive {
      color: var(--accent-green);
    }
    
    .widget-change.negative {
      color: var(--accent-red);
    }
    
    .widget-change.neutral {
      color: var(--text-tertiary);
    }
  `]
})
export class FinancialSummaryWidgetComponent {
  @Input() title: string = '';
  @Input() data: any = {};

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  formatChange(change: number): string {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}`;
  }

  getChangeClass(): string {
    const change = this.data?.change || 0;
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
  }
}