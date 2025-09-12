import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService } from '../../shared/services/data.service';

interface Notification {
  id: string;
  type: 'meta' | 'fluxo' | 'investimento' | 'sistema' | 'educacao';
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
  category: 'renda-fixa' | 'renda-variavel' | 'planejamento' | 'tributacao' | 'criptomoedas' | 'empreendedorismo';
  duration: number;
  difficulty: 'basico' | 'intermediario' | 'avancado';
  description: string;
  topics: string[];
  completed: boolean;
  rating: number;
  students: number;
  instructor: string;
  thumbnail?: string;
  videoCount: number;
  certificated: boolean;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: string[];
  difficulty: 'basico' | 'intermediario' | 'avancado';
  totalDuration: number;
  color: string;
  icon: string;
}

@Component({
  selector: 'app-notificacoes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="notifications-container">
      <main class="main-content">
        <!-- Modern Header with Gradient -->
        <header class="modern-header">
          <div class="header-background">
            <div class="header-gradient"></div>
            <div class="header-pattern"></div>
          </div>
          
          <div class="header-content">
            <div class="title-section">
              <div class="page-icon">
                <div class="icon-inner">🔔</div>
              </div>
              <div>
                <h1>Central de Notificações</h1>
                <p>Acompanhe suas metas, aprenda e evolua financeiramente</p>
              </div>
            </div>
            
            <div class="header-stats">
              <div class="stat-card">
                <div class="stat-value">{{ unreadCount }}</div>
                <div class="stat-label">Não lidas</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ getCompletedContentCount() }}</div>
                <div class="stat-label">Concluídos</div>
              </div>
            </div>
          </div>
        </header>
        
        <div class="page-content">
          <!-- Enhanced Tabs with Icons -->
          <div class="enhanced-tabs">
            <button 
              class="tab-item" 
              [class.active]="activeTab === 'todas'"
              (click)="setActiveTab('todas')">
              <div class="tab-icon">📨</div>
              <div class="tab-info">
                <span class="tab-name">Todas</span>
                <span class="tab-count">{{ notifications.length }}</span>
              </div>
            </button>
            
            <button 
              class="tab-item" 
              [class.active]="activeTab === 'metas'"
              (click)="setActiveTab('metas')">
              <div class="tab-icon">🎯</div>
              <div class="tab-info">
                <span class="tab-name">Metas</span>
                <span class="tab-count">{{ getNotificationsByType('meta').length }}</span>
              </div>
            </button>
            
            <button 
              class="tab-item" 
              [class.active]="activeTab === 'educacao'"
              (click)="setActiveTab('educacao')">
              <div class="tab-icon">🎓</div>
              <div class="tab-info">
                <span class="tab-name">Educação</span>
                <span class="tab-count special">{{ educationContent.length }}</span>
              </div>
            </button>
            
            <button 
              class="tab-item" 
              [class.active]="activeTab === 'sistema'"
              (click)="setActiveTab('sistema')">
              <div class="tab-icon">⚙️</div>
              <div class="tab-info">
                <span class="tab-name">Sistema</span>
                <span class="tab-count">{{ getNotificationsByType('sistema').length }}</span>
              </div>
            </button>
          </div>

          <!-- Regular Notifications -->
          <div class="content-section" *ngIf="activeTab !== 'educacao'">
            <div class="section-header">
              <h3>{{ getSectionTitle() }}</h3>
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

            <div class="notifications-grid" *ngIf="getFilteredNotifications().length > 0">
              <div 
                class="notification-card" 
                *ngFor="let notification of getFilteredNotifications(); trackBy: trackNotificationById"
                [class]="getNotificationClasses(notification)"
                (click)="markAsRead(notification)">
                
                <div class="notification-header">
                  <div class="notification-icon" [class]="'type-' + notification.type">
                    {{ getNotificationEmoji(notification.type) }}
                  </div>
                  
                  <div class="notification-meta">
                    <div class="notification-type">{{ getNotificationTypeLabel(notification.type) }}</div>
                    <div class="notification-date">{{ formatDate(notification.date) }}</div>
                  </div>
                  
                  <div class="notification-actions">
                    <div class="priority-indicator" [class]="'priority-' + notification.priority">
                      {{ notification.priority.toUpperCase() }}
                    </div>
                    <button class="dismiss-btn" (click)="dismissNotification(notification, $event)">
                      ❌
                    </button>
                  </div>
                </div>
                
                <div class="notification-content">
                  <h4>{{ notification.title }}</h4>
                  <p>{{ notification.message }}</p>
                  
                  <div class="notification-footer" *ngIf="notification.actionText">
                    <button class="action-btn">
                      {{ notification.actionText }}
                      <span class="arrow">→</span>
                    </button>
                  </div>
                </div>
                
                <div class="unread-indicator" *ngIf="!notification.read"></div>
              </div>
            </div>

            <!-- Empty State -->
            <div class="empty-state" *ngIf="getFilteredNotifications().length === 0">
              <div class="empty-icon">📭</div>
              <h3>Nenhuma notificação</h3>
              <p>{{ getEmptyStateMessage() }}</p>
            </div>
          </div>

          <!-- SUPER EDUCAÇÃO SECTION -->
          <div class="education-super-section" *ngIf="activeTab === 'educacao'">
            
            <!-- Learning Progress Dashboard -->
            <div class="learning-dashboard">
              <div class="dashboard-header">
                <h2>📚 Sua Jornada de Aprendizado</h2>
                <p>Desenvolva suas habilidades financeiras com nossos cursos especializados</p>
              </div>
              
              <div class="progress-overview">
                <div class="progress-card main-progress">
                  <div class="progress-icon">🏆</div>
                  <div class="progress-info">
                    <h4>Progresso Geral</h4>
                    <div class="progress-bar-modern">
                      <div class="progress-fill" [style.width.%]="getProgressPercentage()"></div>
                      <div class="progress-text">{{ getProgressPercentage() }}%</div>
                    </div>
                    <p>{{ getCompletedContentCount() }} de {{ educationContent.length }} cursos concluídos</p>
                  </div>
                </div>
                
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-icon">⏱️</div>
                    <div class="stat-value">{{ getTotalStudyTime() }}</div>
                    <div class="stat-label">Minutos estudados</div>
                  </div>
                  
                  <div class="stat-item">
                    <div class="stat-icon">🎯</div>
                    <div class="stat-value">{{ getCertificatesCount() }}</div>
                    <div class="stat-label">Certificados</div>
                  </div>
                  
                  <div class="stat-item">
                    <div class="stat-icon">🔥</div>
                    <div class="stat-value">{{ getStreakDays() }}</div>
                    <div class="stat-label">Dias consecutivos</div>
                  </div>
                  
                  <div class="stat-item">
                    <div class="stat-icon">⭐</div>
                    <div class="stat-value">{{ getAverageRating() }}</div>
                    <div class="stat-label">Avaliação média</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Learning Paths -->
            <div class="learning-paths-section">
              <h3>🛤️ Trilhas de Aprendizado</h3>
              <p>Siga um caminho estruturado para dominar diferentes áreas financeiras</p>
              
              <div class="paths-grid">
                <div 
                  class="path-card" 
                  *ngFor="let path of learningPaths"
                  [style.border-color]="path.color"
                  (click)="selectLearningPath(path)">
                  
                  <div class="path-header" [style.background]="path.color + '20'">
                    <div class="path-icon" [style.background]="path.color">{{ path.icon }}</div>
                    <div class="path-difficulty" [class]="'difficulty-' + path.difficulty">
                      {{ getDifficultyLabel(path.difficulty) }}
                    </div>
                  </div>
                  
                  <div class="path-content">
                    <h4>{{ path.title }}</h4>
                    <p>{{ path.description }}</p>
                    
                    <div class="path-meta">
                      <span class="course-count">📖 {{ path.courses.length }} cursos</span>
                      <span class="duration">⏱️ {{ path.totalDuration }}min</span>
                    </div>
                  </div>
                  
                  <div class="path-footer">
                    <button class="start-path-btn" [style.background]="path.color">
                      Iniciar Trilha
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filters and Search -->
            <div class="education-filters">
              <div class="filter-header">
                <h3>📋 Cursos Disponíveis</h3>
                <div class="filter-controls">
                  <select class="filter-select" [(ngModel)]="educationFilter" (change)="onEducationFilterChange()">
                    <option value="todos">🔍 Todas as categorias</option>
                    <option value="renda-fixa">🏦 Renda Fixa</option>
                    <option value="renda-variavel">📈 Renda Variável</option>
                    <option value="planejamento">📊 Planejamento</option>
                    <option value="tributacao">📋 Tributação</option>
                    <option value="criptomoedas">₿ Criptomoedas</option>
                    <option value="empreendedorismo">🚀 Empreendedorismo</option>
                  </select>
                  
                  <select class="filter-select" [(ngModel)]="difficultyFilter">
                    <option value="todos">📚 Todas as dificuldades</option>
                    <option value="basico">🟢 Básico</option>
                    <option value="intermediario">🟡 Intermediário</option>
                    <option value="avancado">🔴 Avançado</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Enhanced Education Grid -->
            <div class="education-premium-grid">
              <div 
                class="education-premium-card" 
                *ngFor="let content of getFilteredEducationContent(); trackBy: trackEducationById"
                [class.completed]="content.completed"
                (click)="openEducationContent(content)">
                
                <!-- Card Header with Thumbnail -->
                <div class="card-header">
                  <div class="thumbnail" [style.background-image]="'url(' + (content.thumbnail || getDefaultThumbnail(content.category)) + ')'">
                    <div class="overlay">
                      <div class="play-button" *ngIf="!content.completed">▶️</div>
                      <div class="completed-badge" *ngIf="content.completed">✅</div>
                    </div>
                  </div>
                  
                  <div class="card-badges">
                    <span class="category-badge" [class]="'category-' + content.category">
                      {{ getEducationCategoryLabel(content.category) }}
                    </span>
                    <span class="difficulty-badge" [class]="'difficulty-' + content.difficulty">
                      {{ getDifficultyLabel(content.difficulty) }}
                    </span>
                  </div>
                </div>
                
                <!-- Card Content -->
                <div class="card-content">
                  <h4>{{ content.title }}</h4>
                  <p>{{ content.description }}</p>
                  
                  <!-- Instructor and Rating -->
                  <div class="instructor-info">
                    <div class="instructor">
                      <div class="instructor-avatar">👨‍🏫</div>
                      <span>{{ content.instructor }}</span>
                    </div>
                    <div class="rating">
                      <div class="stars">
                        <span *ngFor="let star of getStars(content.rating)">{{ star }}</span>
                      </div>
                      <span class="rating-text">{{ content.rating }}</span>
                    </div>
                  </div>
                  
                  <!-- Course Meta -->
                  <div class="course-meta">
                    <div class="meta-item">
                      <span class="icon">📹</span>
                      <span>{{ content.videoCount }} vídeos</span>
                    </div>
                    <div class="meta-item">
                      <span class="icon">⏱️</span>
                      <span>{{ content.duration }}min</span>
                    </div>
                    <div class="meta-item">
                      <span class="icon">👥</span>
                      <span>{{ content.students }} alunos</span>
                    </div>
                    <div class="meta-item" *ngIf="content.certificated">
                      <span class="icon">🏆</span>
                      <span>Certificado</span>
                    </div>
                  </div>
                  
                  <!-- Topics Tags -->
                  <div class="topics-tags">
                    <span class="topic-tag" *ngFor="let topic of content.topics.slice(0, 4)">
                      {{ topic }}
                    </span>
                    <span class="more-topics" *ngIf="content.topics.length > 4">
                      +{{ content.topics.length - 4 }}
                    </span>
                  </div>
                </div>
                
                <!-- Card Footer -->
                <div class="card-footer">
                  <div class="progress-indicator" *ngIf="content.completed">
                    <div class="progress-bar-small">
                      <div class="progress-fill-small" style="width: 100%"></div>
                    </div>
                    <span class="progress-text-small">Concluído</span>
                  </div>
                  
                  <button class="learn-btn" [class.completed]="content.completed">
                    <span class="btn-icon">{{ content.completed ? '🔄' : '▶️' }}</span>
                    <span>{{ content.completed ? 'Revisitar' : 'Começar Agora' }}</span>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Gamification Section -->
            <div class="gamification-section">
              <h3>🎮 Suas Conquistas</h3>
              
              <div class="achievements-grid">
                <div class="achievement-card" [class.unlocked]="getCompletedContentCount() >= 1">
                  <div class="achievement-icon">🌟</div>
                  <h4>Primeiro Passo</h4>
                  <p>Complete seu primeiro curso</p>
                </div>
                
                <div class="achievement-card" [class.unlocked]="getCompletedContentCount() >= 5">
                  <div class="achievement-icon">📚</div>
                  <h4>Estudioso</h4>
                  <p>Complete 5 cursos</p>
                </div>
                
                <div class="achievement-card" [class.unlocked]="getTotalStudyTime() >= 120">
                  <div class="achievement-icon">⏰</div>
                  <h4>Dedicação</h4>
                  <p>Estude por 2 horas</p>
                </div>
                
                <div class="achievement-card" [class.unlocked]="getStreakDays() >= 7">
                  <div class="achievement-icon">🔥</div>
                  <h4>Consistente</h4>
                  <p>Mantenha uma sequência de 7 dias</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .notifications-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }

    .main-content {
      min-height: 100vh;
    }

    /* Modern Header */
    .modern-header {
      position: relative;
      background: white;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .header-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .header-gradient {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.9;
    }

    .header-pattern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 2px, transparent 2px),
        radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 2px, transparent 2px);
      background-size: 50px 50px;
    }

    .header-content {
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 3rem 2rem;
      color: white;
    }

    .title-section {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .page-icon {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .icon-inner {
      font-size: 2.5rem;
    }

    .title-section h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0 0 0.5rem 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .title-section p {
      font-size: 1.1rem;
      margin: 0;
      opacity: 0.9;
    }

    .header-stats {
      display: flex;
      gap: 1.5rem;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 16px;
      padding: 1.5rem;
      text-align: center;
      min-width: 100px;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.875rem;
      opacity: 0.9;
    }

    .page-content {
      padding: 2rem;
    }

    /* Enhanced Tabs */
    .enhanced-tabs {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 3rem;
    }

    .tab-item {
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 16px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 1rem;
      text-align: left;
    }

    .tab-item:hover {
      border-color: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
    }

    .tab-item.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: #667eea;
      color: white;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    }

    .tab-icon {
      font-size: 2rem;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f1f5f9;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .tab-item.active .tab-icon {
      background: rgba(255, 255, 255, 0.2);
    }

    .tab-info {
      flex: 1;
    }

    .tab-name {
      display: block;
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .tab-count {
      display: inline-block;
      background: #e2e8f0;
      color: #64748b;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .tab-item.active .tab-count {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .tab-count.special {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }

    /* Section Headers */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .section-header h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    .view-controls {
      display: flex;
      gap: 0.5rem;
      background: #f1f5f9;
      padding: 0.5rem;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }

    .view-btn {
      padding: 0.5rem 1rem;
      background: transparent;
      border: none;
      border-radius: 8px;
      color: #64748b;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .view-btn.active {
      background: #667eea;
      color: white;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    }

    /* Notifications Grid */
    .notifications-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .notification-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 1.5rem;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .notification-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      border-color: #667eea;
    }

    .notification-card.unread {
      border-left: 4px solid #667eea;
      background: linear-gradient(135deg, #667eea05 0%, #764ba205 100%);
    }

    .notification-card.priority-alta {
      border-left: 4px solid #ef4444;
    }

    .notification-card.priority-alta.unread {
      background: linear-gradient(135deg, #ef444405 0%, #dc262605 100%);
    }

    .notification-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .notification-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .notification-icon.type-meta {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    .notification-icon.type-fluxo {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }

    .notification-icon.type-sistema {
      background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    }

    .notification-meta {
      flex: 1;
    }

    .notification-type {
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }

    .notification-date {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .notification-actions {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .priority-indicator {
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-size: 0.625rem;
      font-weight: 600;
      letter-spacing: 0.05em;
    }

    .priority-indicator.priority-alta {
      background: #ef4444;
      color: white;
    }

    .priority-indicator.priority-media {
      background: #f59e0b;
      color: white;
    }

    .priority-indicator.priority-baixa {
      background: #e2e8f0;
      color: #64748b;
    }

    .dismiss-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .dismiss-btn:hover {
      background: #fee2e2;
    }

    .notification-content h4 {
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
      line-height: 1.4;
    }

    .notification-content p {
      color: #64748b;
      margin: 0 0 1rem 0;
      line-height: 1.6;
      font-size: 0.875rem;
    }

    .notification-footer {
      display: flex;
      justify-content: flex-end;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .arrow {
      font-size: 1rem;
    }

    .unread-indicator {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 12px;
      height: 12px;
      background: #667eea;
      border-radius: 50%;
      border: 2px solid white;
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      background: white;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      text-align: center;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state h3 {
      color: #1e293b;
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: #64748b;
      margin: 0;
    }

    /* SUPER EDUCATION SECTION */
    .education-super-section {
      margin-top: 1rem;
    }

    /* Learning Dashboard */
    .learning-dashboard {
      background: white;
      border-radius: 24px;
      padding: 2.5rem;
      margin-bottom: 3rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .dashboard-header h2 {
      font-size: 2rem;
      font-weight: 800;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .dashboard-header p {
      color: #64748b;
      font-size: 1.1rem;
      margin: 0;
    }

    .progress-overview {
      display: grid;
      grid-template-columns: 2fr 3fr;
      gap: 3rem;
      align-items: center;
    }

    .progress-card.main-progress {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      padding: 2rem;
      color: white;
      text-align: center;
    }

    .progress-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .progress-info h4 {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 1.5rem 0;
    }

    .progress-bar-modern {
      position: relative;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 25px;
      height: 50px;
      margin: 1.5rem 0;
      overflow: hidden;
    }

    .progress-fill {
      background: white;
      height: 100%;
      border-radius: 25px;
      transition: width 0.8s ease;
      position: relative;
    }

    .progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-weight: 700;
      color: #667eea;
      z-index: 2;
    }

    .progress-info p {
      margin: 0;
      opacity: 0.9;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .stat-item {
      background: #f8fafc;
      border-radius: 16px;
      padding: 1.5rem;
      text-align: center;
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
    }

    .stat-item:hover {
      background: white;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .stat-item .stat-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .stat-item .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }

    .stat-item .stat-label {
      color: #64748b;
      font-size: 0.875rem;
      font-weight: 500;
    }

    /* Learning Paths */
    .learning-paths-section {
      margin-bottom: 3rem;
    }

    .learning-paths-section h3 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .learning-paths-section p {
      color: #64748b;
      margin: 0 0 2rem 0;
      font-size: 1rem;
    }

    .paths-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .path-card {
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 20px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .path-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }

    .path-header {
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .path-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;
    }

    .path-difficulty {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .difficulty-basico {
      background: #dcfce7;
      color: #16a34a;
    }

    .difficulty-intermediario {
      background: #fed7aa;
      color: #ea580c;
    }

    .difficulty-avancado {
      background: #fee2e2;
      color: #dc2626;
    }

    .path-content {
      padding: 0 1.5rem 1.5rem;
    }

    .path-content h4 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 0.75rem 0;
    }

    .path-content p {
      color: #64748b;
      margin: 0 0 1rem 0;
      line-height: 1.6;
    }

    .path-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: #9ca3af;
    }

    .path-footer {
      padding: 1.5rem;
      border-top: 1px solid #f1f5f9;
    }

    .start-path-btn {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 12px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .start-path-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    /* Education Filters */
    .education-filters {
      margin-bottom: 2rem;
    }

    .filter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .filter-header h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    .filter-controls {
      display: flex;
      gap: 1rem;
    }

    .filter-select {
      padding: 0.75rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      background: white;
      color: #1e293b;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 180px;
    }

    .filter-select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    /* Premium Education Grid */
    .education-premium-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      gap: 2rem;
    }

    .education-premium-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }

    .education-premium-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      border-color: #667eea;
    }

    .education-premium-card.completed {
      border-color: #10b981;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    }

    .card-header {
      position: relative;
      height: 200px;
    }

    .thumbnail {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      background-color: #f1f5f9;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: all 0.3s ease;
    }

    .education-premium-card:hover .overlay {
      opacity: 1;
    }

    .play-button {
      width: 60px;
      height: 60px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: #667eea;
    }

    .completed-badge {
      font-size: 3rem;
    }

    .card-badges {
      position: absolute;
      top: 1rem;
      left: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .category-badge, .difficulty-badge {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      backdrop-filter: blur(10px);
    }

    .category-badge {
      background: rgba(255, 255, 255, 0.9);
      color: #1e293b;
    }

    .difficulty-badge {
      background: rgba(0, 0, 0, 0.7);
      color: white;
    }

    .card-content {
      padding: 1.5rem;
    }

    .card-content h4 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 0.75rem 0;
      line-height: 1.4;
    }

    .card-content p {
      color: #64748b;
      margin: 0 0 1.5rem 0;
      line-height: 1.6;
      font-size: 0.9rem;
    }

    .instructor-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .instructor {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .instructor-avatar {
      width: 32px;
      height: 32px;
      background: #f1f5f9;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }

    .instructor span {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .stars {
      display: flex;
      gap: 2px;
    }

    .rating-text {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 600;
    }

    .course-meta {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .meta-item .icon {
      font-size: 0.875rem;
    }

    .topics-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .topic-tag {
      background: #f1f5f9;
      color: #64748b;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .more-topics {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .card-footer {
      padding: 1.5rem;
      border-top: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .progress-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .progress-bar-small {
      width: 80px;
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill-small {
      height: 100%;
      background: #10b981;
      border-radius: 3px;
    }

    .progress-text-small {
      font-size: 0.75rem;
      color: #10b981;
      font-weight: 600;
    }

    .learn-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .learn-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .learn-btn.completed {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    .btn-icon {
      font-size: 1rem;
    }

    /* Gamification */
    .gamification-section {
      background: white;
      border-radius: 20px;
      padding: 2rem;
      margin-top: 3rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .gamification-section h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 2rem 0;
    }

    .achievements-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .achievement-card {
      background: #f8fafc;
      border: 2px dashed #e2e8f0;
      border-radius: 16px;
      padding: 1.5rem;
      text-align: center;
      transition: all 0.3s ease;
      opacity: 0.6;
    }

    .achievement-card.unlocked {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border: 2px solid #f59e0b;
      opacity: 1;
      transform: scale(1.02);
      box-shadow: 0 8px 25px rgba(245, 158, 11, 0.2);
    }

    .achievement-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .achievement-card h4 {
      font-size: 1rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .achievement-card p {
      color: #64748b;
      margin: 0;
      font-size: 0.875rem;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .header-content {
        flex-direction: column;
        gap: 2rem;
        text-align: center;
      }

      .enhanced-tabs {
        grid-template-columns: repeat(2, 1fr);
      }

      .progress-overview {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .stats-grid {
        grid-template-columns: repeat(4, 1fr);
      }

      .filter-controls {
        flex-direction: column;
        gap: 0.5rem;
      }
    }

    @media (max-width: 768px) {
      .page-content {
        padding: 1rem;
      }

      .header-content {
        padding: 2rem 1rem;
      }

      .enhanced-tabs {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .education-premium-grid {
        grid-template-columns: 1fr;
      }

      .paths-grid {
        grid-template-columns: 1fr;
      }

      .achievements-grid {
        grid-template-columns: 1fr;
      }

      .course-meta {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class NotificacoesComponent implements OnInit {
  activeTab = 'educacao'; // Start with education tab
  viewMode = 'all';
  educationFilter = 'todos';
  difficultyFilter = 'todos';
  
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
      type: 'sistema',
      priority: 'media',
      title: 'Novo curso disponível: Bitcoin para Iniciantes',
      message: 'Aprenda sobre criptomoedas e blockchain de forma simples e prática.',
      date: new Date('2025-08-24'),
      read: false,
      actionText: 'Ver Curso'
    },
    {
      id: '3',
      type: 'educacao',
      priority: 'baixa',
      title: 'Parabéns! Você completou o curso de Renda Fixa',
      message: 'Seu certificado já está disponível para download.',
      date: new Date('2025-08-23'),
      read: true,
      actionText: 'Baixar Certificado'
    },
    {
      id: '4',
      type: 'meta',
      priority: 'media',
      title: 'Meta "Reserva de Emergência" atingida',
      message: 'Você conseguiu atingir 100% da sua reserva de emergência. Continue assim!',
      date: new Date('2025-08-22'),
      read: true,
      actionText: 'Celebrar'
    }
  ];
  
  educationContent: EducationContent[] = [
    {
      id: '1',
      title: 'Fundamentos da Renda Fixa Completo',
      category: 'renda-fixa',
      duration: 45,
      difficulty: 'basico',
      description: 'Domine todos os conceitos essenciais de renda fixa, desde CDBs até títulos públicos. Aprenda a construir um portfólio sólido e seguro.',
      topics: ['CDB', 'Tesouro Direto', 'LCI/LCA', 'Liquidez', 'Tributação', 'Análise de Riscos'],
      completed: true,
      rating: 4.8,
      students: 15420,
      instructor: 'Carlos Mendes',
      videoCount: 12,
      certificated: true
    },
    {
      id: '2',
      title: 'Estratégias Avançadas de Diversificação',
      category: 'renda-variavel',
      duration: 68,
      difficulty: 'avancado',
      description: 'Técnicas profissionais para diversificar investimentos, balancear riscos e maximizar retornos com estratégias institucionais.',
      topics: ['Ações', 'FIIs', 'ETFs', 'Commodities', 'Internacional', 'Correlações', 'Rebalanceamento'],
      completed: false,
      rating: 4.9,
      students: 8934,
      instructor: 'Ana Silva',
      videoCount: 18,
      certificated: true
    },
    {
      id: '3',
      title: 'Planejamento de Aposentadoria 360°',
      category: 'planejamento',
      duration: 52,
      difficulty: 'intermediario',
      description: 'Construa um plano completo para sua aposentadoria, considerando INSS, previdência privada e investimentos próprios.',
      topics: ['PGBL', 'VGBL', 'INSS', 'Simulações', 'Tributação', 'Sucessão'],
      completed: false,
      rating: 4.7,
      students: 12156,
      instructor: 'Roberto Costa',
      videoCount: 15,
      certificated: true
    },
    {
      id: '4',
      title: 'Otimização Fiscal para Investidores',
      category: 'tributacao',
      duration: 38,
      difficulty: 'avancado',
      description: 'Estratégias legais para reduzir impostos sobre investimentos e otimizar sua declaração de IR.',
      topics: ['IR', 'Come-cotas', 'Isenções', 'Declaração', 'Holding', 'Offshores'],
      completed: false,
      rating: 4.6,
      students: 6789,
      instructor: 'Mariana Santos',
      videoCount: 10,
      certificated: true
    },
    {
      id: '5',
      title: 'Bitcoin e Criptomoedas do Zero',
      category: 'criptomoedas',
      duration: 41,
      difficulty: 'basico',
      description: 'Entre no mundo das criptomoedas com segurança. Aprenda sobre blockchain, carteiras e como investir.',
      topics: ['Bitcoin', 'Ethereum', 'Blockchain', 'Carteiras', 'Exchanges', 'DeFi'],
      completed: false,
      rating: 4.5,
      students: 23451,
      instructor: 'Pedro Lima',
      videoCount: 14,
      certificated: false
    },
    {
      id: '6',
      title: 'Mindset Empreendedor para Investidores',
      category: 'empreendedorismo',
      duration: 35,
      difficulty: 'intermediario',
      description: 'Desenvolva a mentalidade empreendedora aplicada aos investimentos e construção de patrimônio.',
      topics: ['Mindset', 'Oportunidades', 'Networking', 'Inovação', 'Startups', 'Angel Investing'],
      completed: true,
      rating: 4.8,
      students: 9876,
      instructor: 'Julia Rodrigues',
      videoCount: 11,
      certificated: false
    }
  ];

  learningPaths: LearningPath[] = [
    {
      id: '1',
      title: 'Investidor Iniciante',
      description: 'Trilha completa para quem está começando a investir. Do básico ao intermediário.',
      courses: ['1', '3', '5'],
      difficulty: 'basico',
      totalDuration: 120,
      color: '#10b981',
      icon: '🌱'
    },
    {
      id: '2',
      title: 'Expert em Renda Variável',
      description: 'Domine ações, fundos e estratégias avançadas de investimento em renda variável.',
      courses: ['2', '4', '6'],
      difficulty: 'avancado',
      totalDuration: 160,
      color: '#f59e0b',
      icon: '📈'
    },
    {
      id: '3',
      title: 'Planejamento Completo',
      description: 'Construa um plano financeiro sólido com foco em aposentadoria e proteção.',
      courses: ['3', '4', '1'],
      difficulty: 'intermediario',
      totalDuration: 135,
      color: '#6366f1',
      icon: '🎯'
    },
    {
      id: '4',
      title: 'Futuro Digital',
      description: 'Explore as novas tendências: criptomoedas, DeFi e investimentos digitais.',
      courses: ['5', '6'],
      difficulty: 'intermediario',
      totalDuration: 76,
      color: '#8b5cf6',
      icon: '🚀'
    }
  ];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Initialize component
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
      case 'sistema': return 'Sistema';
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

  getNotificationEmoji(type: string): string {
    switch (type) {
      case 'meta': return '🎯';
      case 'fluxo': return '💰';
      case 'investimento': return '📊';
      case 'sistema': return '⚙️';
      case 'educacao': return '🎓';
      default: return '🔔';
    }
  }

  getNotificationTypeLabel(type: string): string {
    switch (type) {
      case 'meta': return 'Metas';
      case 'fluxo': return 'Fluxo de Caixa';
      case 'investimento': return 'Investimentos';
      case 'sistema': return 'Sistema';
      case 'educacao': return 'Educação';
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

  // Education methods
  onEducationFilterChange(): void {
    // Filter logic handled by getFilteredEducationContent
  }

  getFilteredEducationContent(): EducationContent[] {
    let filtered = this.educationContent;
    
    if (this.educationFilter !== 'todos') {
      filtered = filtered.filter(content => content.category === this.educationFilter);
    }
    
    if (this.difficultyFilter !== 'todos') {
      filtered = filtered.filter(content => content.difficulty === this.difficultyFilter);
    }
    
    return filtered;
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

  getCertificatesCount(): number {
    return this.educationContent.filter(content => content.completed && content.certificated).length;
  }

  getStreakDays(): number {
    return 12; // Mock streak days
  }

  getAverageRating(): number {
    const ratings = this.educationContent.map(content => content.rating);
    const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    return Math.round(average * 10) / 10;
  }

  getEducationCategoryLabel(category: string): string {
    switch (category) {
      case 'renda-fixa': return 'Renda Fixa';
      case 'renda-variavel': return 'Renda Variável';
      case 'planejamento': return 'Planejamento';
      case 'tributacao': return 'Tributação';
      case 'criptomoedas': return 'Criptomoedas';
      case 'empreendedorismo': return 'Empreendedorismo';
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

  getDefaultThumbnail(category: string): string {
    // Return gradient backgrounds based on category
    const gradients: {[key: string]: string} = {
      'renda-fixa': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'renda-variavel': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'planejamento': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'tributacao': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'criptomoedas': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'empreendedorismo': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    };
    return gradients[category] || gradients['renda-fixa'];
  }

  getStars(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return [
      ...Array(fullStars).fill('⭐'),
      ...(hasHalfStar ? ['🌟'] : []),
      ...Array(emptyStars).fill('☆')
    ];
  }

  selectLearningPath(path: LearningPath): void {
    console.log('Selected learning path:', path);
    // Logic to start learning path
  }

  openEducationContent(content: EducationContent): void {
    console.log('Opening education content:', content);
    // Simulate completion for demo
    if (!content.completed) {
      content.completed = true;
    }
  }

  trackEducationById(index: number, content: EducationContent): string {
    return content.id;
  }
}