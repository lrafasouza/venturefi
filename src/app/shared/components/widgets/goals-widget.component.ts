import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-goals-widget',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <div class="goals-widget">
      <div class="widget-header">
        <h3>{{ title }}</h3>
        <a routerLink="/platform/dream-pursuit" class="view-all-link">
          <app-icon name="arrow-right" size="16"></app-icon>
        </a>
      </div>
      <div class="goals-list">
        <div class="goal-item" *ngFor="let goal of data?.goals">
          <div class="goal-info">
            <div class="goal-icon">
              <app-icon name="target" size="20" className="icon-accent"></app-icon>
            </div>
            <div class="goal-details">
              <div class="goal-name">{{ goal.name }}</div>
              <div class="goal-progress-text">
                R$ {{ formatCurrency(goal.saved) }} / R$ {{ formatCurrency(goal.target) }}
              </div>
            </div>
          </div>
          <div class="goal-progress">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="goal.percentage"></div>
            </div>
            <div class="progress-percentage">{{ goal.percentage }}%</div>
          </div>
        </div>
      </div>
      <a routerLink="/platform/dream-pursuit" class="btn btn-success add-goal-btn">
        <app-icon name="plus" size="16"></app-icon>
        <span>Nova Meta</span>
      </a>
    </div>
  `,
  styles: [`
    .goals-widget {
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      border: 1px solid var(--border-primary);
      height: 100%;
      display: flex;
      flex-direction: column;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .goals-widget:hover {
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
      color: var(--text-primary);
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
    }
    
    .view-all-link {
      color: var(--accent-blue);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: var(--space-1);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-md);
      transition: all 0.2s ease;
    }
    
    .view-all-link:hover {
      background: var(--accent-blue-light);
      color: var(--accent-blue);
    }
    
    .goals-list {
      flex: 1;
      margin-bottom: var(--space-4);
    }
    
    .goal-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-4);
      padding: var(--space-3);
      border-radius: var(--radius-lg);
      background: var(--bg-secondary);
      transition: all 0.2s ease;
    }
    
    .goal-item:hover {
      background: var(--accent-blue-light);
    }
    
    .goal-info {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      flex: 1;
    }
    
    .goal-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: var(--accent-green-light);
      border-radius: var(--radius-lg);
    }
    
    .goal-name {
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--space-1);
      font-size: 0.875rem;
    }
    
    .goal-progress-text {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    
    .goal-progress {
      min-width: 100px;
    }
    
    .progress-percentage {
      text-align: right;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--accent-green);
      margin-top: var(--space-1);
    }
    
    .add-goal-btn {
      width: 100%;
      justify-content: center;
    }
  `]
})
export class GoalsWidgetComponent {
  @Input() title: string = '';
  @Input() data: any = {};

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}