import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { CardComponent } from '../../shared/components/card/card.component';

interface Notification {
  id: string;
  type: 'meta' | 'fluxo' | 'investimento' | 'sistema';
  priority: 'alta' | 'media' | 'baixa';
  title: string;
  message: string;
  date: Date;
  read: boolean;
  actionText?: string;
  actionLink?: string;
}

interface EducationContent {
  id: string;
  title: string;
  category: 'renda-fixa' | 'renda-variavel' | 'planejamento' | 'tributacao';
  duration: number; // em minutos
  difficulty: 'basico' | 'intermediario' | 'avancado';
  description: string;
  topics: string[];
  completed: boolean;
}

@Component({
  selector: 'app-notificacoes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IconComponent],
  template: `
    <div class="notifications-container">
      <main class="main-content">
        <header class="page-header animate-fade-in">
          <div class="header-content">
            <div class="page-title-section">
              <div>
                <h1>Centro de Notificações</h1>
                <p>Fique por dentro de tudo que acontece com suas finanças</p>
              </div>
            </div>
            <div class="header-actions">
              <button class="btn btn-ghost hover-scale focus-ring" (click)="markAllAsRead()">
                <span>Marcar Todas como Lidas</span>
              </button>
              <button class="btn btn-primary hover-glow focus-ring" (click)="openNotificationSettings()">
                <span>Configurações</span>
              </button>
            </div>
          </div>
        </header>
        
        <div class="page-content">
          <!-- Tabs Navigation -->
          <div class="tabs-container animate-fade-in">
            <div class="tabs-nav">
              <button 
                class="tab-btn" 
                [class.active]="activeTab === 'todas'"
                (click)="setActiveTab('todas')">
                <app-icon name="bell" size="18"></app-icon>
                <span>Todas</span>
                <span class="tab-badge">{{ notifications.length }}</span>
              </button>
              <button 
                class="tab-btn" 
                [class.active]="activeTab === 'metas'"
                (click)="setActiveTab('metas')">
                <app-icon name="target" size="18"></app-icon>
                <span>Metas</span>
                <span class="tab-badge">{{ getNotificationsByType('meta').length }}</span>
              </button>
              <button 
                class="tab-btn" 
                [class.active]="activeTab === 'fluxo'"
                (click)="setActiveTab('fluxo')">
                <app-icon name="chart-line" size="18"></app-icon>
                <span>Fluxo de Caixa</span>
                <span class="tab-badge">{{ getNotificationsByType('fluxo').length }}</span>
              </button>
              <button 
                class="tab-btn" 
                [class.active]="activeTab === 'educacao'"
                (click)="setActiveTab('educacao')">
                <app-icon name="academic-cap" size="18"></app-icon>
                <span>Educação</span>
                <span class="tab-badge education">{{ educationContent.length }}</span>
              </button>
            </div>
          </div>

          <!-- Notifications List -->
          <div class="content-section" *ngIf="activeTab !== 'educacao'">
            <div class="section-header">
              <h3>{{ getSectionTitle() }}</h3>
              <div class="section-meta">
                <span class="total-count">{{ getFilteredNotifications().length }} notificações</span>
                <div class="view-controls">
                  <button 
                    class="view-btn" 
                    [class.active]="viewMode === 'unread'"
                    (click)="setViewMode('unread')">
                    Não Lidas ({{ getUnreadCount() }})
                  </button>
                  <button 
                    class="view-btn" 
                    [class.active]="viewMode === 'all'"
                    (click)="setViewMode('all')">
                    Todas
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div class="empty-state" *ngIf="getFilteredNotifications().length === 0">
              <div class="empty-icon">
                <app-icon name="bell-slash" size="48"></app-icon>
              </div>
              <h3>Nenhuma notificação</h3>
              <p>{{ getEmptyStateMessage() }}</p>
            </div>

            <!-- Notifications Grid -->
            <div class="notifications-grid animate-fade-in" *ngIf="getFilteredNotifications().length > 0">
              <div 
                class="notification-card hover-lift" 
                *ngFor="let notification of getFilteredNotifications(); trackBy: trackNotificationById"
                [class]="getNotificationClasses(notification)"
                (click)="markAsRead(notification)">
                
                <div class="notification-header">
                  <div class="notification-icon" [class]="'type-' + notification.type + ' priority-' + notification.priority">
                    <app-icon [name]="getNotificationIcon(notification.type)" size="20"></app-icon>
                  </div>
                  
                  <div class="notification-meta">
                    <div class="notification-type">{{ getNotificationTypeLabel(notification.type) }}</div>
                    <div class="notification-date">{{ formatDate(notification.date) }}</div>
                  </div>
                  
                  <div class="notification-actions">
                    <div class="priority-indicator" [class]="'priority-' + notification.priority">
                      <span>{{ notification.priority.toUpperCase() }}</span>
                    </div>
                    <button class="dismiss-btn" (click)="dismissNotification(notification, $event)">
                      <app-icon name="x-mark" size="16"></app-icon>
                    </button>
                  </div>
                </div>
                
                <div class="notification-content">
                  <h4 class="notification-title">{{ notification.title }}</h4>
                  <p class="notification-message">{{ notification.message }}</p>
                  
                  <div class="notification-footer" *ngIf="notification.actionText">
                    <button class="action-btn btn btn-sm btn-primary">
                      {{ notification.actionText }}
                      <app-icon name="arrow-right" size="14"></app-icon>
                    </button>
                  </div>
                </div>
                
                <div class="read-indicator" *ngIf="!notification.read"></div>
              </div>
            </div>
          </div>

          <!-- Education Content Section -->
          <div class="content-section education-section" *ngIf="activeTab === 'educacao'">
            <div class="section-header">
              <h3>Centro de Educação Financeira</h3>
              <div class="section-meta">
                <span class="total-count">{{ educationContent.length }} conteúdos disponíveis</span>
                <div class="filter-controls">
                  <select class="filter-select" [(ngModel)]="educationFilter" (change)="onEducationFilterChange()">
                    <option value="todos">Todas as categorias</option>
                    <option value="renda-fixa">Renda Fixa</option>
                    <option value="renda-variavel">Renda Variável</option>
                    <option value="planejamento">Planejamento</option>
                    <option value="tributacao">Tributação</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Education Progress -->
            <div class="education-progress animate-fade-in">
              <div class="progress-card">
                <div class="progress-header">
                  <div class="progress-icon">
                    <app-icon name="trophy" size="24"></app-icon>
                  </div>
                  <div class="progress-info">
                    <h4>Seu Progresso</h4>
                    <p>{{ getCompletedContentCount() }} de {{ educationContent.length }} conteúdos concluídos</p>
                  </div>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="getProgressPercentage()"></div>
                </div>
                <div class="progress-stats">
                  <div class="stat">
                    <span class="stat-value">{{ getProgressPercentage() }}%</span>
                    <span class="stat-label">Concluído</span>
                  </div>
                  <div class="stat">
                    <span class="stat-value">{{ getTotalStudyTime() }}min</span>
                    <span class="stat-label">Tempo de estudo</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Education Content Grid -->
            <div class="education-grid animate-fade-in">
              <div 
                class="education-card hover-lift" 
                *ngFor="let content of getFilteredEducationContent(); trackBy: trackEducationById"
                [class.completed]="content.completed"
                (click)="openEducationContent(content)">
                
                <div class="education-header">
                  <div class="education-category" [class]="'category-' + content.category">
                    <span>{{ getEducationCategoryLabel(content.category) }}</span>
                  </div>
                  <div class="education-meta">
                    <div class="difficulty" [class]="'difficulty-' + content.difficulty">
                      {{ getDifficultyLabel(content.difficulty) }}
                    </div>
                    <div class="duration">
                      <app-icon name="clock" size="14"></app-icon>
                      <span>{{ content.duration }}min</span>
                    </div>
                  </div>
                </div>
                
                <div class="education-content">
                  <h4 class="education-title">{{ content.title }}</h4>
                  <p class="education-description">{{ content.description }}</p>
                  
                  <div class="education-topics">
                    <div class="topic-tag" *ngFor="let topic of content.topics.slice(0, 3)">{{ topic }}</div>
                    <div class="topic-more" *ngIf="content.topics.length > 3">+{{ content.topics.length - 3 }}</div>
                  </div>
                </div>
                
                <div class="education-footer">
                  <button class="learn-btn" [class.completed]="content.completed">
                    <app-icon [name]="content.completed ? 'check-circle' : 'play'" size="16"></app-icon>
                    <span>{{ content.completed ? 'Revisitar' : 'Começar' }}</span>
                  </button>
                </div>
                
                <div class="completion-indicator" *ngIf="content.completed">
                  <app-icon name="check-circle" size="24"></app-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    /* Notifications container styles */
    .notifications-container {
      height: 100vh;
      background: var(--bg-tertiary);
      overflow: hidden;
    }
    
    .main-content {
      overflow-y: auto;
      height: 100vh;
      background: var(--bg-tertiary);
    }
    
    .page-header {
      background: var(--bg-primary);
      border-bottom: 1px solid var(--border-primary);
      padding: var(--space-8) var(--space-8);
      flex-shrink: 0;
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .page-title-section {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }
    
    .page-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      background: var(--accent-blue-light);
      border-radius: var(--radius-xl);
      flex-shrink: 0;
    }
    
    .page-title-section h1 {
      color: var(--text-primary);
      font-size: 1.875rem;
      font-weight: 700;
      margin-bottom: var(--space-1);
      letter-spacing: -0.025em;
    }
    
    .page-title-section p {
      color: var(--text-secondary);
      margin: 0;
      font-size: 1rem;
    }
    
    .header-actions {
      display: flex;
      gap: var(--space-3);
    }
    
    .page-content {
      padding: var(--space-8);
      flex: 1;
      min-height: 0;
    }
    
    /* Tabs */
    .tabs-container {
      margin-bottom: var(--space-6);
    }
    
    .tabs-nav {
      display: flex;
      gap: var(--space-1);
      background: var(--bg-primary);
      padding: var(--space-2);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-primary);
      box-shadow: var(--shadow-sm);
    }
    
    .tab-btn {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-4);
      background: transparent;
      border: none;
      border-radius: var(--radius-lg);
      color: var(--text-secondary);
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    
    .tab-btn:hover {
      background: var(--bg-secondary);
      color: var(--text-primary);
    }
    
    .tab-btn.active {
      background: var(--accent-blue);
      color: var(--text-inverse);
      box-shadow: var(--shadow-sm);
    }
    
    .tab-badge {
      background: var(--bg-secondary);
      color: var(--text-secondary);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      min-width: 20px;
      text-align: center;
    }
    
    .tab-btn.active .tab-badge {
      background: rgba(255, 255, 255, 0.2);
      color: var(--text-inverse);
    }
    
    .tab-badge.education {
      background: var(--accent-green-light);
      color: var(--accent-green);
    }
    
    .tab-btn.active .tab-badge.education {
      background: rgba(255, 255, 255, 0.2);
      color: var(--text-inverse);
    }
    
    /* Sections */
    .content-section {
      margin-bottom: var(--space-8);
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-6);
    }
    
    .section-header h3 {
      color: var(--text-primary);
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }
    
    .section-meta {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }
    
    .total-count {
      color: var(--text-tertiary);
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .view-controls {
      display: flex;
      gap: var(--space-1);
      background: var(--bg-secondary);
      padding: var(--space-1);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-primary);
    }
    
    .view-btn {
      padding: var(--space-2) var(--space-3);
      background: transparent;
      border: none;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .view-btn.active {
      background: var(--accent-blue);
      color: var(--text-inverse);
      box-shadow: var(--shadow-sm);
    }
    
    .filter-controls {
      display: flex;
      gap: var(--space-3);
    }
    
    .filter-select {
      padding: var(--space-2) var(--space-3);
      border: 1px solid var(--border-secondary);
      border-radius: var(--radius-lg);
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: 0.875rem;
      min-width: 160px;
    }
    
    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-12);
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-primary);
      text-align: center;
    }
    
    .empty-icon {
      width: 80px;
      height: 80px;
      background: var(--bg-secondary);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--space-4);
      color: var(--text-tertiary);
    }
    
    .empty-state h3 {
      color: var(--text-primary);
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: var(--space-2);
    }
    
    .empty-state p {
      color: var(--text-secondary);
      margin: 0;
    }
    
    /* Notifications Grid */
    .notifications-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: var(--space-4);
    }
    
    .notification-card {
      background: var(--bg-primary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    
    .notification-card:hover {
      box-shadow: var(--shadow-md);
      border-color: var(--border-secondary);
    }
    
    .notification-card.unread {
      border-left: 4px solid var(--accent-blue);
      background: var(--accent-blue-light);
    }
    
    .notification-card.priority-alta {
      border-left: 4px solid var(--accent-red);
    }
    
    .notification-card.priority-alta.unread {
      background: var(--accent-red-light);
    }
    
    .notification-header {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
      margin-bottom: var(--space-4);
    }
    
    .notification-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-lg);
      flex-shrink: 0;
    }
    
    .notification-icon.type-meta {
      background: var(--accent-green-light);
      color: var(--accent-green);
    }
    
    .notification-icon.type-fluxo {
      background: var(--accent-orange-light);
      color: var(--accent-orange);
    }
    
    .notification-icon.type-investimento {
      background: var(--accent-blue-light);
      color: var(--accent-blue);
    }
    
    .notification-icon.type-sistema {
      background: var(--bg-secondary);
      color: var(--text-secondary);
    }
    
    .notification-meta {
      flex: 1;
    }
    
    .notification-type {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.025em;
      margin-bottom: var(--space-1);
    }
    
    .notification-date {
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }
    
    .notification-actions {
      display: flex;
      align-items: flex-start;
      gap: var(--space-2);
    }
    
    .priority-indicator {
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-md);
      font-size: 0.625rem;
      font-weight: 600;
      letter-spacing: 0.05em;
    }
    
    .priority-indicator.priority-alta {
      background: var(--accent-red);
      color: var(--text-inverse);
    }
    
    .priority-indicator.priority-media {
      background: var(--accent-orange);
      color: var(--text-inverse);
    }
    
    .priority-indicator.priority-baixa {
      background: var(--bg-secondary);
      color: var(--text-secondary);
    }
    
    .dismiss-btn {
      background: none;
      border: none;
      color: var(--text-tertiary);
      cursor: pointer;
      padding: var(--space-1);
      border-radius: var(--radius-md);
      transition: all 0.2s ease;
    }
    
    .dismiss-btn:hover {
      background: var(--bg-secondary);
      color: var(--text-primary);
    }
    
    .notification-content {
      margin-bottom: var(--space-4);
    }
    
    .notification-title {
      color: var(--text-primary);
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: var(--space-2);
      line-height: 1.4;
    }
    
    .notification-message {
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.6;
      font-size: 0.875rem;
    }
    
    .notification-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    
    .action-btn {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: 0.875rem;
    }
    
    .read-indicator {
      position: absolute;
      top: var(--space-4);
      right: var(--space-4);
      width: 12px;
      height: 12px;
      background: var(--accent-blue);
      border-radius: var(--radius-full);
      border: 2px solid var(--bg-primary);
    }
    
    /* Education Section */
    .education-section {
      margin-top: var(--space-6);
    }
    
    .education-progress {
      margin-bottom: var(--space-6);
    }
    
    .progress-card {
      background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      color: var(--text-inverse);
      position: relative;
      overflow: hidden;
    }
    
    .progress-header {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      margin-bottom: var(--space-4);
    }
    
    .progress-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-lg);
      color: var(--text-inverse);
    }
    
    .progress-info h4 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: var(--space-1);
    }
    
    .progress-info p {
      opacity: 0.8;
      margin: 0;
    }
    
    .progress-bar {
      background: rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-full);
      height: 8px;
      margin-bottom: var(--space-4);
      overflow: hidden;
    }
    
    .progress-fill {
      background: var(--text-inverse);
      height: 100%;
      border-radius: var(--radius-full);
      transition: width 0.5s ease;
    }
    
    .progress-stats {
      display: flex;
      gap: var(--space-6);
    }
    
    .stat {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }
    
    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
    }
    
    .stat-label {
      font-size: 0.875rem;
      opacity: 0.8;
    }
    
    /* Education Grid */
    .education-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: var(--space-6);
    }
    
    .education-card {
      background: var(--bg-primary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    
    .education-card:hover {
      box-shadow: var(--shadow-lg);
      border-color: var(--accent-blue);
    }
    
    .education-card.completed {
      border-color: var(--accent-green);
      background: var(--accent-green-light);
    }
    
    .education-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-4);
    }
    
    .education-category {
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }
    
    .education-category.category-renda-fixa {
      background: var(--accent-blue-light);
      color: var(--accent-blue);
    }
    
    .education-category.category-renda-variavel {
      background: var(--accent-orange-light);
      color: var(--accent-orange);
    }
    
    .education-category.category-planejamento {
      background: var(--accent-green-light);
      color: var(--accent-green);
    }
    
    .education-category.category-tributacao {
      background: var(--accent-red-light);
      color: var(--accent-red);
    }
    
    .education-meta {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      align-items: flex-end;
    }
    
    .difficulty {
      font-size: 0.75rem;
      font-weight: 500;
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-md);
    }
    
    .difficulty.difficulty-basico {
      background: var(--accent-green-light);
      color: var(--accent-green);
    }
    
    .difficulty.difficulty-intermediario {
      background: var(--accent-orange-light);
      color: var(--accent-orange);
    }
    
    .difficulty.difficulty-avancado {
      background: var(--accent-red-light);
      color: var(--accent-red);
    }
    
    .duration {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      color: var(--text-tertiary);
      font-size: 0.75rem;
    }
    
    .education-content {
      margin-bottom: var(--space-6);
    }
    
    .education-title {
      color: var(--text-primary);
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: var(--space-2);
      line-height: 1.4;
    }
    
    .education-description {
      color: var(--text-secondary);
      margin: 0 0 var(--space-4) 0;
      line-height: 1.6;
      font-size: 0.875rem;
    }
    
    .education-topics {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }
    
    .topic-tag {
      background: var(--bg-secondary);
      color: var(--text-secondary);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-md);
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    .topic-more {
      background: var(--accent-blue-light);
      color: var(--accent-blue);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-md);
      font-size: 0.75rem;
      font-weight: 600;
    }
    
    .education-footer {
      display: flex;
      justify-content: flex-end;
    }
    
    .learn-btn {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      background: var(--accent-blue);
      color: var(--text-inverse);
      border: none;
      border-radius: var(--radius-lg);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .learn-btn:hover {
      background: var(--accent-blue-dark);
      transform: translateY(-1px);
    }
    
    .learn-btn.completed {
      background: var(--accent-green);
    }
    
    .learn-btn.completed:hover {
      background: var(--accent-green-dark);
    }
    
    .completion-indicator {
      position: absolute;
      top: var(--space-4);
      right: var(--space-4);
      color: var(--accent-green);
      background: var(--bg-primary);
      border-radius: var(--radius-full);
      padding: var(--space-1);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .header-content {
        flex-direction: column;
        gap: var(--space-4);
        align-items: flex-start;
      }
      
      .section-header {
        flex-direction: column;
        gap: var(--space-4);
        align-items: flex-start;
      }
      
      .notifications-grid {
        grid-template-columns: 1fr;
      }
      
      .education-grid {
        grid-template-columns: 1fr;
      }
      
      .tabs-nav {
        flex-wrap: wrap;
      }
      
      .page-content {
        padding: var(--space-6);
      }
    }

    @media (max-width: 640px) {
      .page-header {
        padding: var(--space-6);
      }
      
      .page-title-section {
        flex-direction: column;
        gap: var(--space-3);
        text-align: center;
      }
      
      .header-actions {
        width: 100%;
        flex-direction: column;
      }
      
      .page-content {
        padding: var(--space-4);
      }
      
      .tabs-nav {
        flex-direction: column;
      }
      
      .view-controls {
        width: 100%;
        justify-content: center;
      }
      
      .progress-stats {
        justify-content: center;
      }
      
      .education-meta {
        align-items: flex-start;
      }
    }
  `]
})
export class NotificacoesComponent implements OnInit {
  activeTab = 'todas';
  viewMode = 'all';
  educationFilter = 'todos';
  
  notifications: Notification[] = [
    {
      id: '1',
      type: 'meta',
      priority: 'alta',
      title: 'Meta "Casa Própria" está atrasada',
      message: 'Você está R$ 2.500 abaixo do esperado para este mês. Que tal revisar seu orçamento?',
      date: new Date('2025-08-25'),
      read: false,
      actionText: 'Ver Meta',
      actionLink: '/platform/dream-pursuit'
    },
    {
      id: '2',
      type: 'fluxo',
      priority: 'media',
      title: 'Gastos altos com alimentação',
      message: 'Seus gastos com alimentação aumentaram 35% em relação ao mês passado.',
      date: new Date('2025-08-24'),
      read: false,
      actionText: 'Ver Análise'
    },
    {
      id: '3',
      type: 'investimento',
      priority: 'baixa',
      title: 'Nova oportunidade de renda fixa',
      message: 'CDB Premium com 110% do CDI disponível. Prazo de 2 anos.',
      date: new Date('2025-08-23'),
      read: true,
      actionText: 'Simular'
    },
    {
      id: '4',
      type: 'meta',
      priority: 'media',
      title: 'Parabéns! Meta "Reserva de Emergência" atingida',
      message: 'Você conseguiu atingir 100% da sua reserva de emergência. Continue assim!',
      date: new Date('2025-08-22'),
      read: true,
      actionText: 'Celebrar'
    },
    {
      id: '5',
      type: 'fluxo',
      priority: 'alta',
      title: 'Projeção de saldo negativo',
      message: 'Com os gastos atuais, seu saldo pode ficar negativo até o dia 30.',
      date: new Date('2025-08-21'),
      read: false,
      actionText: 'Ver Projeção'
    },
    {
      id: '6',
      type: 'sistema',
      priority: 'baixa',
      title: 'Atualização disponível',
      message: 'Nova versão do VentureFi com melhorias na segurança está disponível.',
      date: new Date('2025-08-20'),
      read: true
    }
  ];
  
  educationContent: EducationContent[] = [
    {
      id: '1',
      title: 'Fundamentos da Renda Fixa',
      category: 'renda-fixa',
      duration: 8,
      difficulty: 'basico',
      description: 'Aprenda os conceitos básicos de investimentos em renda fixa e como eles podem proteger seu capital.',
      topics: ['CDB', 'Tesouro Direto', 'LCI/LCA', 'Liquidez'],
      completed: true
    },
    {
      id: '2',
      title: 'Diversificação de Investimentos',
      category: 'renda-variavel',
      duration: 12,
      difficulty: 'intermediario',
      description: 'Entenda como diversificar seus investimentos para reduzir riscos e potencializar retornos.',
      topics: ['Ações', 'FIIs', 'Diversificação', 'Alocação'],
      completed: false
    },
    {
      id: '3',
      title: 'Planejamento de Aposentadoria',
      category: 'planejamento',
      duration: 15,
      difficulty: 'avancado',
      description: 'Estratégias avançadas para construir uma reserva sólida para sua aposentadoria.',
      topics: ['PGBL', 'VGBL', 'Previdência', 'Contribuição', 'Tributação'],
      completed: false
    },
    {
      id: '4',
      title: 'Impostos sobre Investimentos',
      category: 'tributacao',
      duration: 10,
      difficulty: 'intermediario',
      description: 'Como calcular e otimizar os impostos sobre seus investimentos.',
      topics: ['IR', 'Come-cotas', 'Isenção', 'Declaração'],
      completed: false
    },
    {
      id: '5',
      title: 'Orçamento Pessoal Efetivo',
      category: 'planejamento',
      duration: 6,
      difficulty: 'basico',
      description: 'Técnicas práticas para criar e manter um orçamento pessoal que funciona.',
      topics: ['50-30-20', 'Gastos fixos', 'Variáveis', 'Controle'],
      completed: true
    }
  ];

  constructor() {}

  ngOnInit() {
    // Inicializar dados mockados
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  setViewMode(mode: string): void {
    this.viewMode = mode;
  }

  getSectionTitle(): string {
    switch (this.activeTab) {
      case 'todas': return 'Todas as Notificações';
      case 'metas': return 'Notificações de Metas';
      case 'fluxo': return 'Fluxo de Caixa';
      case 'investimento': return 'Investimentos';
      default: return 'Notificações';
    }
  }

  getNotificationsByType(type: string): Notification[] {
    return this.notifications.filter(n => n.type === type);
  }

  getFilteredNotifications(): Notification[] {
    let filtered = this.notifications;
    
    if (this.activeTab !== 'todas') {
      filtered = filtered.filter(n => n.type === this.activeTab);
    }
    
    if (this.viewMode === 'unread') {
      filtered = filtered.filter(n => !n.read);
    }
    
    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  getUnreadCount(): number {
    const filtered = this.activeTab === 'todas' 
      ? this.notifications 
      : this.notifications.filter(n => n.type === this.activeTab);
    return filtered.filter(n => !n.read).length;
  }

  getEmptyStateMessage(): string {
    if (this.viewMode === 'unread') {
      return 'Você não tem notificações não lidas.';
    }
    return `Nenhuma notificação encontrada para ${this.getSectionTitle().toLowerCase()}.`;
  }

  getNotificationClasses(notification: Notification): string {
    const classes = [];
    if (!notification.read) classes.push('unread');
    classes.push(`priority-${notification.priority}`);
    return classes.join(' ');
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'meta': return 'target';
      case 'fluxo': return 'chart-line';
      case 'investimento': return 'chart-pie';
      case 'sistema': return 'cog';
      default: return 'bell';
    }
  }

  getNotificationTypeLabel(type: string): string {
    switch (type) {
      case 'meta': return 'Metas';
      case 'fluxo': return 'Fluxo de Caixa';
      case 'investimento': return 'Investimentos';
      case 'sistema': return 'Sistema';
      default: return 'Geral';
    }
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    if (days < 7) return `${days} dias atrás`;
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  markAsRead(notification: Notification): void {
    notification.read = true;
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
  }

  dismissNotification(notification: Notification, event: Event): void {
    event.stopPropagation();
    const index = this.notifications.findIndex(n => n.id === notification.id);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }
  }

  trackNotificationById(index: number, notification: Notification): string {
    return notification.id;
  }

  openNotificationSettings(): void {
    console.log('Abrir configurações de notificações');
  }

  // Education methods
  onEducationFilterChange(): void {
    console.log('Filtro de educação alterado:', this.educationFilter);
  }

  getFilteredEducationContent(): EducationContent[] {
    if (this.educationFilter === 'todos') {
      return this.educationContent;
    }
    return this.educationContent.filter(content => content.category === this.educationFilter);
  }

  getCompletedContentCount(): number {
    return this.educationContent.filter(content => content.completed).length;
  }

  getProgressPercentage(): number {
    const completed = this.getCompletedContentCount();
    return Math.round((completed / this.educationContent.length) * 100);
  }

  getTotalStudyTime(): number {
    return this.educationContent
      .filter(content => content.completed)
      .reduce((total, content) => total + content.duration, 0);
  }

  getEducationCategoryLabel(category: string): string {
    switch (category) {
      case 'renda-fixa': return 'Renda Fixa';
      case 'renda-variavel': return 'Renda Variável';
      case 'planejamento': return 'Planejamento';
      case 'tributacao': return 'Tributação';
      default: return category;
    }
  }

  getDifficultyLabel(difficulty: string): string {
    switch (difficulty) {
      case 'basico': return 'Básico';
      case 'intermediario': return 'Intermediário';
      case 'avancado': return 'Avançado';
      default: return difficulty;
    }
  }

  openEducationContent(content: EducationContent): void {
    console.log('Abrir conteúdo educacional:', content);
    // Simular conclusão ao abrir
    if (!content.completed) {
      content.completed = true;
    }
  }

  trackEducationById(index: number, content: EducationContent): string {
    return content.id;
  }
}