import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ModalService } from '../../shared/services/modal.service';
import { DataService, Goal } from '../../shared/services/data.service';
import { FinancialCalculatorService, GoalAnalysis } from '../../shared/services/financial-calculator.service';
import { GamificationService, Badge, Mission, UserStats } from '../../shared/services/gamification.service';
import { AIAssistantService, AIInsight, ScenarioSimulation } from '../../shared/services/ai-assistant.service';

@Component({
  selector: 'app-dream-pursuit-super',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IconComponent],
  template: `
    <!-- Page Header -->
    <section class="page-header">
      <div class="header-content">
        <div class="page-title-section">
          <h1 class="page-title">🚀 Em Busca do Sonho</h1>
          <p class="page-description">Transforme seus sonhos em metas concretas com IA e gamificação</p>
        </div>
        <div class="header-actions">
          <button class="btn-secondary" (click)="exportGoals()">
            <app-icon name="arrow-down-tray" size="18"></app-icon>
            <span>Exportar</span>
          </button>
          <button class="btn-primary" (click)="openCreateGoalModal()">
            <app-icon name="plus" size="18"></app-icon>
            <span>Nova Meta</span>
          </button>
        </div>
      </div>
    </section>

    <!-- AI Assistant Banner -->
    <div class="ai-assistant-banner animate-fade-in" *ngIf="aiInsights.length > 0">
      <div class="ai-banner-content">
        <div class="ai-icon">🤖</div>
        <div class="ai-content">
          <h3>Assistente IA</h3>
          <p>{{ getCurrentAIInsight() }}</p>
        </div>
        <button class="btn-outline-sm" (click)="toggleAIRecommendations()">
          {{ showAIRecommendations ? 'Ocultar' : 'Ver Todos' }}
        </button>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div class="content-wrapper">
      <!-- Overview Cards with Enhanced Stats -->
      <div class="overview-cards animate-fade-in">
        <div class="overview-card gradient-primary hover-lift-smooth">
          <div class="card-backdrop"></div>
          <div class="card-content-wrapper">
            <div class="card-header">
              <div class="card-icon-modern success-glow">
                <app-icon name="banknotes" size="28"></app-icon>
              </div>
              <div class="card-trend-modern positive">
                <app-icon name="arrow-trending-up" size="16"></app-icon>
                <span>+{{ totalGrowthPercentage }}%</span>
              </div>
            </div>
            <div class="card-content-modern">
              <div class="card-label-modern">Total em Metas</div>
              <div class="card-value-modern primary-text">R$ {{ formatCurrency(totalInGoals) }}</div>
              <div class="card-subtitle-modern">{{ activeGoals }} metas ativas</div>
              <div class="card-progress-line">
                <div class="progress-fill" [style.width.%]="totalGoalsProgress"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="overview-card gradient-success hover-lift-smooth">
          <div class="card-backdrop"></div>
          <div class="card-content-wrapper">
            <div class="card-header">
              <div class="card-icon-modern success-glow">
                <app-icon name="chart-pie" size="28"></app-icon>
              </div>
              <div class="card-trend-modern positive">
                <app-icon name="arrow-trending-up" size="16"></app-icon>
                <span>{{ overallProgress }}%</span>
              </div>
            </div>
            <div class="card-content-modern">
              <div class="card-label-modern">Total Economizado</div>
              <div class="card-value-modern success-text">R$ {{ formatCurrency(totalSaved) }}</div>
              <div class="card-subtitle-modern">{{ overallProgress }}% do total</div>
              <div class="card-progress-line">
                <div class="progress-fill success" [style.width.%]="overallProgress"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="overview-card gradient-warning hover-lift-smooth">
          <div class="card-backdrop"></div>
          <div class="card-content-wrapper">
            <div class="card-header">
              <div class="card-icon-modern warning-glow">
                <app-icon name="trophy" size="28"></app-icon>
              </div>
              <div class="card-meta-modern">
                <span class="card-badge">{{ nextGoalMonths }} meses</span>
              </div>
            </div>
            <div class="card-content-modern">
              <div class="card-label-modern">Próxima Meta</div>
              <div class="card-value-modern warning-text">{{ nextGoalName }}</div>
              <div class="card-subtitle-modern">{{ nextGoalMonths }} meses restantes</div>
              <div class="card-progress-line">
                <div class="progress-fill warning" [style.width.%]="nextGoalProgress"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Gamification Stats Card -->
        <div class="overview-card gradient-info hover-lift-smooth">
          <div class="card-backdrop"></div>
          <div class="card-content-wrapper">
            <div class="card-header">
              <div class="card-icon-modern info-glow">
                <app-icon name="star" size="28"></app-icon>
              </div>
              <div class="xp-badge">{{ userStats.xp }} XP</div>
            </div>
            <div class="card-content-modern">
              <div class="card-label-modern">Nível {{ userStats.level }}</div>
              <div class="card-value-modern info-text">{{ unlockedBadges.length }}/{{ totalBadges }} Badges</div>
              <div class="card-subtitle-modern">{{ userStats.streakDays }} dias de streak</div>
              <div class="xp-progress-bar">
                <div class="xp-fill" [style.width.%]="getXPProgress()"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Insights Grid -->
      <div class="ai-insights-grid animate-fade-in" *ngIf="showAIRecommendations && aiInsights.length > 0">
        <div class="insights-header">
          <h3>💡 Recomendações Inteligentes</h3>
          <button class="btn-ghost" (click)="refreshAIInsights()">
            <app-icon name="arrow-path" size="16"></app-icon>
            Atualizar
          </button>
        </div>
        <div class="insights-grid">
          <div
            *ngFor="let insight of aiInsights"
            class="insight-card"
            [class]="'insight-' + insight.type">
            <div class="insight-icon">{{ getInsightIcon(insight.type) }}</div>
            <div class="insight-content">
              <h4>{{ insight.title }}</h4>
              <p>{{ insight.message }}</p>
            </div>
            <button class="insight-action" (click)="executeInsightAction(insight)">
              {{ insight.actionText || 'Ver Mais' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Gamification Section -->
      <div class="gamification-section animate-fade-in">
        <div class="section-header">
          <h3>🏆 Sistema de Conquistas</h3>
          <div class="achievements-stats">
            <span class="stat-badge">{{ unlockedBadges.length }}/{{ totalBadges }} Badges</span>
            <span class="stat-badge">{{ completedMissions.length }} Missões</span>
          </div>
        </div>

        <!-- Badges Grid -->
        <div class="badges-grid">
          <div
            *ngFor="let badge of displayedBadges"
            class="badge-item"
            [class.unlocked]="badge.isUnlocked"
            (click)="showBadgeDetails(badge)">
            <div class="badge-icon">{{ badge.icon }}</div>
            <div class="badge-info">
              <h4>{{ badge.name }}</h4>
              <p>{{ badge.description }}</p>
              <div class="badge-progress" *ngIf="!badge.isUnlocked">
                {{ badge.progress || 0 }}/{{ badge.maxProgress || 100 }}
              </div>
            </div>
          </div>
        </div>

        <!-- Active Missions -->
        <div class="missions-section" *ngIf="activeMissions.length > 0">
          <h4>🎯 Missões Ativas</h4>
          <div class="missions-grid">
            <div
              *ngFor="let mission of activeMissions"
              class="mission-card">
              <div class="mission-header">
                <span class="mission-title">{{ mission.title }}</span>
                <span class="mission-reward">+{{ mission.xp }} XP</span>
              </div>
              <p class="mission-description">{{ mission.description }}</p>
              <div class="mission-progress">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="getMissionProgress(mission)"></div>
                </div>
                <span class="progress-text">{{ mission.progress }}/{{ mission.maxProgress }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Financial Health Analysis -->
      <div class="financial-health-section animate-fade-in">
        <div class="health-header">
          <h3>📊 Análise Financeira</h3>
          <div class="capacity-indicator" [class]="'capacity-' + financialCapacity">
            {{ getCapacityLabel(financialCapacity) }}
          </div>
        </div>

        <div class="health-metrics">
          <div class="metric-card">
            <div class="metric-icon">💰</div>
            <div class="metric-content">
              <div class="metric-label">Disponível para Metas</div>
              <div class="metric-value">R$ {{ formatCurrency(availableForGoals) }}</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">📈</div>
            <div class="metric-content">
              <div class="metric-label">Comprometimento Mensal</div>
              <div class="metric-value">R$ {{ formatCurrency(monthlyCommitmentToGoals) }}</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">🎯</div>
            <div class="metric-content">
              <div class="metric-label">Orçamento Recomendado</div>
              <div class="metric-value">R$ {{ formatCurrency(recommendedGoalBudget) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="filters-section animate-fade-in">
        <div class="section-header">
          <h3>Filtros e Ordenação</h3>
          <div class="section-meta">
            <span class="results-count">{{ filteredGoals.length }} resultados</span>
          </div>
        </div>

        <div class="filters-grid">
          <div class="filter-group">
            <label class="filter-label">Status</label>
            <select [(ngModel)]="statusFilter" (change)="applyFilters()" class="filter-select">
              <option value="all">Todos</option>
              <option value="active">Ativas</option>
              <option value="completed">Concluídas</option>
              <option value="paused">Pausadas</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">Origem</label>
            <select [(ngModel)]="originFilter" (change)="applyFilters()" class="filter-select">
              <option value="all">Todas</option>
              <option value="personal">Pessoal</option>
              <option value="business">Negócio</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">Prioridade</label>
            <select [(ngModel)]="priorityFilter" (change)="applyFilters()" class="filter-select">
              <option value="all">Todas</option>
              <option value="high">Alta</option>
              <option value="medium">Média</option>
              <option value="low">Baixa</option>
            </select>
          </div>

          <div class="filter-group">
            <button class="btn-ghost" (click)="clearFilters()">
              <app-icon name="x-mark" size="16"></app-icon>
              Limpar
            </button>
          </div>
        </div>
      </div>

      <!-- Goals Grid -->
      <div class="goals-section animate-fade-in">
        <div class="section-header">
          <h3>Suas Metas</h3>
          <div class="view-toggle">
            <button
              class="view-btn"
              [class.active]="viewMode === 'grid'"
              (click)="viewMode = 'grid'">
              <app-icon name="squares-2x2" size="16"></app-icon>
            </button>
            <button
              class="view-btn"
              [class.active]="viewMode === 'list'"
              (click)="viewMode = 'list'">
              <app-icon name="list-bullet" size="16"></app-icon>
            </button>
          </div>
        </div>

        <div class="goals-grid" [class]="'view-' + viewMode">
          <div
            *ngFor="let goal of filteredGoals"
            class="goal-card enhanced"
            [class]="'priority-' + goal.priority">

            <!-- Goal Header -->
            <div class="goal-header">
              <div class="goal-icon-container">
                <div class="goal-icon">{{ goal.icon }}</div>
                <div class="goal-badges">
                  <span class="priority-badge" [class]="'priority-' + goal.priority">
                    {{ getPriorityLabel(goal.priority) }}
                  </span>
                  <span class="origin-badge" [class]="goal.origin">
                    {{ goal.origin === 'personal' ? 'Pessoal' : 'Negócio' }}
                  </span>
                </div>
              </div>

              <div class="goal-menu">
                <button class="menu-trigger" (click)="toggleGoalMenu(goal.id)">
                  <app-icon name="ellipsis-horizontal" size="16"></app-icon>
                </button>
                <div class="goal-menu-dropdown" *ngIf="activeMenuId === goal.id">
                  <button class="menu-item" (click)="showGoalAnalysis(goal)">
                    <app-icon name="chart-line" size="16"></app-icon>
                    <span>Análise IA</span>
                  </button>
                  <button class="menu-item" (click)="showScenarios(goal)">
                    <app-icon name="light-bulb" size="16"></app-icon>
                    <span>Cenários</span>
                  </button>
                  <button class="menu-item" (click)="editGoal(goal)">
                    <app-icon name="pencil" size="16"></app-icon>
                    <span>Editar</span>
                  </button>
                  <button class="menu-item" (click)="duplicateGoal(goal)">
                    <app-icon name="document-duplicate" size="16"></app-icon>
                    <span>Duplicar</span>
                  </button>
                  <button class="menu-item danger" (click)="deleteGoal(goal.id)">
                    <app-icon name="trash" size="16"></app-icon>
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Goal Content -->
            <div class="goal-content">
              <h4 class="goal-title">{{ goal.name }}</h4>
              <p class="goal-description">{{ goal.description }}</p>

              <!-- Progress Section -->
              <div class="progress-section">
                <div class="progress-header">
                  <span class="progress-percentage">{{ getGoalPercentage(goal) }}%</span>
                  <span class="progress-amount">R$ {{ formatCurrency(goal.saved) }} / R$ {{ formatCurrency(goal.target) }}</span>
                </div>
                <div class="progress-bar enhanced">
                  <div class="progress-fill" [style.width.%]="getGoalPercentage(goal)"></div>
                  <div class="progress-milestones">
                    <div *ngFor="let milestone of getGoalMilestones(goal)"
                         class="milestone"
                         [class.reached]="milestone.reached"
                         [style.left.%]="milestone.position">
                    </div>
                  </div>
                </div>
              </div>

              <!-- Goal Stats -->
              <div class="goal-stats">
                <div class="stat-item">
                  <div class="stat-icon">📅</div>
                  <div class="stat-content">
                    <div class="stat-label">Prazo</div>
                    <div class="stat-value">{{ formatDate(goal.deadline) }}</div>
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon">💰</div>
                  <div class="stat-content">
                    <div class="stat-label">Mensal</div>
                    <div class="stat-value">R$ {{ formatCurrency(goal.monthlyTarget) }}</div>
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon">⏱️</div>
                  <div class="stat-content">
                    <div class="stat-label">Restante</div>
                    <div class="stat-value">{{ getTimeRemaining(goal) }}</div>
                  </div>
                </div>
              </div>

              <!-- Goal Actions -->
              <div class="goal-actions">
                <button class="btn-primary" (click)="contributeToGoal(goal)">
                  <app-icon name="plus" size="16"></app-icon>
                  Contribuir
                </button>
                <button class="btn-outline" (click)="viewGoalDetails(goal)">
                  <app-icon name="eye" size="16"></app-icon>
                  Detalhes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Notification -->
    <div class="success-notification animate-slide-in" *ngIf="showSuccessNotification">
      <div class="notification-content">
        <div class="notification-icon">🎉</div>
        <div class="notification-text">
          <h4>{{ successMessage?.title }}</h4>
          <p>{{ successMessage?.description }}</p>
        </div>
        <button class="notification-close" (click)="showSuccessNotification = false">
          <app-icon name="x-mark" size="16"></app-icon>
        </button>
      </div>
    </div>

    <!-- AI Modal -->
    <div class="modal-overlay" *ngIf="showAIModal" (click)="showAIModal = false">
      <div class="modal-content ai-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>🤖 Assistente IA</h3>
          <button class="modal-close" (click)="showAIModal = false">
            <app-icon name="x-mark" size="20"></app-icon>
          </button>
        </div>
        <div class="modal-body">
          <div class="ai-content" *ngIf="selectedGoalScenario">
            <h4>Cenários para a Meta</h4>
            <div class="scenarios-list">
              <div class="scenario-card">
                <h5>Cenário Conservador</h5>
                <p>{{ selectedGoalScenario.scenarios.conservative.description }}</p>
              </div>
              <div class="scenario-card">
                <h5>Cenário Base</h5>
                <p>{{ selectedGoalScenario.scenarios.base.description }}</p>
              </div>
              <div class="scenario-card">
                <h5>Cenário Otimista</h5>
                <p>{{ selectedGoalScenario.scenarios.optimistic.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Base Styles */
    .page-header {
      padding: 2rem;
      border-radius: 20px;
      margin-bottom: 2rem;
      color: white;
      position: relative;
      overflow: hidden;
      box-shadow:
        0 20px 40px rgba(30, 58, 95, 0.15),
        0 0 0 1px rgba(255, 255, 255, 0.1) inset;
    }

    .page-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background:
        radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
      pointer-events: none;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .page-description {
      margin: 0.5rem 0 0 0;
      opacity: 0.9;
      font-size: 1.1rem;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    /* AI Assistant Banner */
    .ai-assistant-banner {
      background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 25%, #c084fc 50%, #d8b4fe 75%, #7c3aed 100%);
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      color: white;
      position: relative;
      overflow: hidden;
      box-shadow:
        0 15px 35px rgba(139, 92, 246, 0.2),
        0 0 0 1px rgba(255, 255, 255, 0.1) inset;
    }

    .ai-assistant-banner::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background:
        radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
        linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%);
      pointer-events: none;
    }

    .ai-banner-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .ai-icon {
      font-size: 2rem;
      animation: aiPulse 3s infinite ease-in-out;
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
      position: relative;
      z-index: 1;
    }

    .ai-content {
      flex: 1;
      position: relative;
      z-index: 1;
    }

    .ai-content h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.3rem;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .ai-content p {
      margin: 0;
      opacity: 0.95;
      font-size: 1rem;
      line-height: 1.5;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    /* Overview Cards */
    .overview-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .overview-card {
      background: white;
      border-radius: 20px;
      padding: 1.75rem;
      position: relative;
      overflow: hidden;
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.08),
        0 2px 8px rgba(0, 0, 0, 0.04);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(255, 255, 255, 0.8);
    }

    .overview-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent 0%, rgba(30, 58, 95, 0.1) 20%, rgba(46, 204, 113, 0.3) 50%, rgba(30, 58, 95, 0.1) 80%, transparent 100%);
    }

    .overview-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow:
        0 20px 60px rgba(0, 0, 0, 0.12),
        0 8px 24px rgba(0, 0, 0, 0.08);
    }

    .overview-card:hover::before {
      background: linear-gradient(90deg, transparent 0%, rgba(30, 58, 95, 0.2) 20%, rgba(46, 204, 113, 0.5) 50%, rgba(30, 58, 95, 0.2) 80%, transparent 100%);
    }

    .gradient-primary {
      border-left: 5px solid #1E3A5F;
      background: linear-gradient(135deg, rgba(30, 58, 95, 0.02) 0%, rgba(37, 99, 235, 0.03) 100%);
    }
    .gradient-success {
      border-left: 5px solid #2ECC71;
      background: linear-gradient(135deg, rgba(46, 204, 113, 0.02) 0%, rgba(34, 197, 94, 0.03) 100%);
    }
    .gradient-warning {
      border-left: 5px solid #f39c12;
      background: linear-gradient(135deg, rgba(243, 156, 18, 0.02) 0%, rgba(251, 146, 60, 0.03) 100%);
    }
    .gradient-info {
      border-left: 5px solid #8b5cf6;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.02) 0%, rgba(168, 85, 247, 0.03) 100%);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .card-icon-modern {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(46, 204, 113, 0.15) 0%, rgba(34, 197, 94, 0.1) 100%);
      color: #2ECC71;
      box-shadow:
        0 4px 12px rgba(46, 204, 113, 0.15),
        0 0 0 1px rgba(46, 204, 113, 0.1) inset;
      transition: all 0.3s ease;
    }

    .card-icon-modern:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow:
        0 6px 20px rgba(46, 204, 113, 0.25),
        0 0 0 1px rgba(46, 204, 113, 0.2) inset;
    }

    .card-trend-modern {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.875rem;
      font-weight: 700;
      color: #2ECC71;
      background: rgba(46, 204, 113, 0.1);
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      border: 1px solid rgba(46, 204, 113, 0.2);
    }

    .card-value-modern {
      font-size: 2rem;
      font-weight: 800;
      margin: 0.75rem 0;
      background: linear-gradient(135deg, #1E3A5F 0%, #2563eb 50%, #2ECC71 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .card-progress-line {
      height: 4px;
      background: #f1f5f9;
      border-radius: 2px;
      overflow: hidden;
      margin-top: 0.75rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #1E3A5F 0%, #2563eb 25%, #22d3ee 50%, #2ECC71 100%);
      border-radius: 3px;
      transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      box-shadow: 0 2px 8px rgba(46, 204, 113, 0.3);
    }

    .progress-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%);
      animation: progressShimmer 2.5s infinite;
    }

    @keyframes progressShimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .progress-fill.success {
      background: linear-gradient(90deg, #2ECC71 0%, #22d3ee 50%, #16a34a 100%);
      box-shadow: 0 2px 8px rgba(46, 204, 113, 0.4);
    }
    .progress-fill.warning {
      background: linear-gradient(90deg, #f39c12 0%, #fbbf24 50%, #f59e0b 100%);
      box-shadow: 0 2px 8px rgba(243, 156, 18, 0.4);
    }

    /* XP and Gamification */
    .xp-badge {
      background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #7c3aed 100%);
      color: white;
      padding: 0.4rem 1rem;
      border-radius: 25px;
      font-size: 0.8rem;
      font-weight: 700;
      box-shadow:
        0 4px 15px rgba(139, 92, 246, 0.3),
        0 0 0 1px rgba(255, 255, 255, 0.2) inset;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      animation: xpGlow 2s infinite alternate ease-in-out;
    }

    @keyframes xpGlow {
      0% {
        box-shadow:
          0 4px 15px rgba(139, 92, 246, 0.3),
          0 0 0 1px rgba(255, 255, 255, 0.2) inset;
      }
      100% {
        box-shadow:
          0 6px 25px rgba(139, 92, 246, 0.5),
          0 0 0 1px rgba(255, 255, 255, 0.3) inset;
      }
    }

    .xp-progress-bar {
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      overflow: hidden;
      margin-top: 0.5rem;
    }

    .xp-fill {
      height: 100%;
      background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 25%, #c084fc 50%, #a855f7 75%, #7c3aed 100%);
      border-radius: 3px;
      transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 0 10px rgba(139, 92, 246, 0.4);
      position: relative;
    }

    .xp-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
      animation: xpShimmer 2s infinite;
    }

    @keyframes xpShimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    /* AI Insights */
    .ai-insights-grid {
      margin-bottom: 2rem;
    }

    .insights-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .insights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }

    .insight-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
    }

    .insight-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .insight-opportunity { border-left: 4px solid #2ECC71; }
    .insight-warning { border-left: 4px solid #f39c12; }
    .insight-optimization { border-left: 4px solid #3498db; }

    .insight-icon {
      font-size: 1.5rem;
    }

    .insight-content {
      flex: 1;
    }

    .insight-content h4 {
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      font-weight: 600;
    }

    .insight-content p {
      margin: 0;
      color: #64748b;
      font-size: 0.875rem;
    }

    .insight-action {
      background: #1E3A5F;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .insight-action:hover {
      background: #2c5282;
    }

    /* Gamification Section */
    .gamification-section {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .achievements-stats {
      display: flex;
      gap: 1rem;
    }

    .stat-badge {
      background: #f1f5f9;
      color: #475569;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .badges-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .badge-item {
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .badge-item.unlocked {
      background: linear-gradient(135deg, #fef9e7 0%, #f6f3e7 100%);
      border-color: #d4af37;
    }

    .badge-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .badge-icon {
      font-size: 2rem;
      opacity: 0.5;
    }

    .badge-item.unlocked .badge-icon {
      opacity: 1;
    }

    .badge-info h4 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
      font-weight: 600;
    }

    .badge-info p {
      margin: 0 0 0.5rem 0;
      color: #64748b;
      font-size: 0.875rem;
    }

    .badge-progress {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    /* Missions */
    .missions-section {
      margin-top: 2rem;
    }

    .missions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }

    .mission-card {
      background: #f8fafc;
      border-radius: 12px;
      padding: 1.5rem;
      border-left: 4px solid #3498db;
    }

    .mission-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .mission-title {
      font-weight: 600;
      color: #1e293b;
    }

    .mission-reward {
      background: #3498db;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .mission-description {
      color: #64748b;
      margin: 0 0 1rem 0;
      font-size: 0.875rem;
    }

    .mission-progress {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .progress-bar {
      flex: 1;
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-text {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
    }

    /* Financial Health */
    .financial-health-section {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }

    .health-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .capacity-indicator {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .capacity-excellent {
      background: #d1fae5;
      color: #065f46;
    }

    .capacity-good {
      background: #dbeafe;
      color: #1e40af;
    }

    .capacity-limited {
      background: #fef3c7;
      color: #92400e;
    }

    .capacity-critical {
      background: #fee2e2;
      color: #991b1b;
    }

    .health-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .metric-card {
      background: #f8fafc;
      border-radius: 12px;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .metric-icon {
      font-size: 1.5rem;
    }

    .metric-label {
      color: #64748b;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }

    .metric-value {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
    }

    /* Filters */
    .filters-section {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
    }

    .filter-select {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.875rem;
      background: white;
    }

    .filter-select:focus {
      outline: none;
      border-color: #1E3A5F;
      box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
    }

    .results-count {
      color: #64748b;
      font-size: 0.875rem;
    }

    /* Goals Section */
    .goals-section {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }

    .view-toggle {
      display: flex;
      gap: 0.5rem;
    }

    .view-btn {
      background: #f1f5f9;
      border: none;
      padding: 0.5rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s ease;
      color: #64748b;
    }

    .view-btn.active {
      background: #1E3A5F;
      color: white;
    }

    .goals-grid {
      display: grid;
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .goals-grid.view-grid {
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    }

    .goals-grid.view-list {
      grid-template-columns: 1fr;
    }

    /* Goal Cards */
    .goal-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 1.5rem;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .goal-card.enhanced {
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .goal-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    }

    .goal-card.priority-high {
      border-left: 4px solid #ef4444;
    }

    .goal-card.priority-medium {
      border-left: 4px solid #f59e0b;
    }

    .goal-card.priority-low {
      border-left: 4px solid #10b981;
    }

    .goal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .goal-icon-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .goal-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .goal-badges {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .priority-badge,
    .origin-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .priority-badge.priority-high {
      background: #fee2e2;
      color: #991b1b;
    }

    .priority-badge.priority-medium {
      background: #fef3c7;
      color: #92400e;
    }

    .priority-badge.priority-low {
      background: #d1fae5;
      color: #065f46;
    }

    .origin-badge.personal {
      background: #dbeafe;
      color: #1e40af;
    }

    .origin-badge.business {
      background: #f3e8ff;
      color: #7c3aed;
    }

    .goal-menu {
      position: relative;
    }

    .menu-trigger {
      background: #f1f5f9;
      border: none;
      padding: 0.5rem;
      border-radius: 8px;
      cursor: pointer;
      color: #64748b;
      transition: background 0.2s ease;
    }

    .menu-trigger:hover {
      background: #e2e8f0;
    }

    .goal-menu-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      z-index: 10;
      min-width: 150px;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
      font-size: 0.875rem;
      color: #374151;
      transition: background 0.2s ease;
    }

    .menu-item:hover {
      background: #f9fafb;
    }

    .menu-item.danger {
      color: #dc2626;
    }

    .goal-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: #1e293b;
    }

    .goal-description {
      color: #64748b;
      margin: 0 0 1rem 0;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    /* Progress Section */
    .progress-section {
      margin-bottom: 1.5rem;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .progress-percentage {
      font-size: 1.125rem;
      font-weight: 600;
      color: #2ECC71;
    }

    .progress-amount {
      font-size: 0.875rem;
      color: #64748b;
    }

    .progress-bar.enhanced {
      height: 8px;
      background: #f1f5f9;
      border-radius: 4px;
      overflow: hidden;
      position: relative;
    }

    .progress-milestones {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
    }

    .milestone {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 4px;
      height: 12px;
      background: #94a3b8;
      border-radius: 2px;
    }

    .milestone.reached {
      background: #2ECC71;
    }

    /* Goal Stats */
    .goal-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .stat-icon {
      font-size: 1rem;
    }

    .stat-content {
      flex: 1;
    }

    .stat-label {
      font-size: 0.75rem;
      color: #64748b;
      margin-bottom: 0.125rem;
    }

    .stat-value {
      font-size: 0.875rem;
      font-weight: 500;
      color: #1e293b;
    }

    /* Goal Actions */
    .goal-actions {
      display: flex;
      gap: 0.75rem;
    }

    .goal-actions button {
      flex: 1;
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: #1E3A5F;
      color: white;
      border: none;
    }

    .btn-primary:hover {
      background: #2c5282;
    }

    .btn-outline {
      background: white;
      color: #1E3A5F;
      border: 1px solid #1E3A5F;
    }

    .btn-outline:hover {
      background: #1E3A5F;
      color: white;
    }

    .btn-secondary {
      background: #64748b;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-secondary:hover {
      background: #475569;
    }

    .btn-ghost {
      background: none;
      color: #64748b;
      border: 1px solid #e2e8f0;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-ghost:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }

    .btn-outline-sm {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-outline-sm:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    /* Success Notification */
    .success-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #2ECC71;
      border-radius: 12px;
      padding: 1rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      max-width: 400px;
    }

    .notification-content {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .notification-icon {
      font-size: 1.5rem;
    }

    .notification-text {
      flex: 1;
    }

    .notification-text h4 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
      font-weight: 600;
    }

    .notification-text p {
      margin: 0;
      color: #64748b;
      font-size: 0.875rem;
    }

    .notification-close {
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 0.25rem;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 16px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .modal-close {
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 8px;
      transition: background 0.2s ease;
    }

    .modal-close:hover {
      background: #f1f5f9;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .scenarios-grid {
      display: grid;
      gap: 1rem;
    }

    .scenario-card {
      background: #f8fafc;
      border-radius: 12px;
      padding: 1.25rem;
      border-left: 4px solid #3498db;
    }

    .scenario-card h5 {
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      font-weight: 600;
    }

    .scenario-card p {
      margin: 0 0 1rem 0;
      color: #64748b;
      font-size: 0.875rem;
    }

    .scenario-impact {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .impact-label {
      font-size: 0.875rem;
      color: #64748b;
    }

    .impact-value {
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .impact-positive {
      background: #d1fae5;
      color: #065f46;
    }

    .impact-neutral {
      background: #f1f5f9;
      color: #475569;
    }

    .impact-negative {
      background: #fee2e2;
      color: #991b1b;
    }

    /* Animations */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }

    @keyframes aiPulse {
      0%, 100% {
        transform: scale(1) rotate(0deg);
        filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
      }
      33% {
        transform: scale(1.05) rotate(2deg);
        filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.4));
      }
      66% {
        transform: scale(1.02) rotate(-1deg);
        filter: drop-shadow(0 0 12px rgba(168, 85, 247, 0.3));
      }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .animate-fade-in {
      animation: fadeIn 0.5s ease-out;
    }

    .animate-slide-in {
      animation: slideIn 0.3s ease-out;
    }

    /* Dark Mode Support (preparado para futuro) */
    :root {
      --bg-primary: #ffffff;
      --bg-secondary: #f8fafc;
      --text-primary: #1e293b;
      --text-secondary: #64748b;
      --border-color: #e2e8f0;
      --shadow-light: rgba(0, 0, 0, 0.05);
      --shadow-medium: rgba(0, 0, 0, 0.1);
      --shadow-heavy: rgba(0, 0, 0, 0.15);
    }

    [data-theme="dark"] {
      --bg-primary: #0f172a;
      --bg-secondary: #1e293b;
      --text-primary: #f1f5f9;
      --text-secondary: #94a3b8;
      --border-color: #334155;
      --shadow-light: rgba(0, 0, 0, 0.3);
      --shadow-medium: rgba(0, 0, 0, 0.4);
      --shadow-heavy: rgba(0, 0, 0, 0.6);
    }

    /* Enhanced Animations */
    @keyframes cardEntrance {
      0% {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .overview-card {
      animation: cardEntrance 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    .overview-card:nth-child(1) { animation-delay: 0.1s; }
    .overview-card:nth-child(2) { animation-delay: 0.2s; }
    .overview-card:nth-child(3) { animation-delay: 0.3s; }
    .overview-card:nth-child(4) { animation-delay: 0.4s; }

    /* Responsive */
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .header-actions {
        width: 100%;
        justify-content: stretch;
      }

      .header-actions button {
        flex: 1;
      }

      .overview-cards {
        grid-template-columns: 1fr;
      }

      .goals-grid {
        grid-template-columns: 1fr !important;
      }

      .goal-stats {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }

      .goal-actions {
        flex-direction: column;
      }

      .filters-grid {
        grid-template-columns: 1fr;
      }

      .ai-banner-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .insights-grid {
        grid-template-columns: 1fr;
      }

      .badges-grid {
        grid-template-columns: 1fr;
      }

      .missions-grid {
        grid-template-columns: 1fr;
      }

      .health-metrics {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DreamPursuitSuperComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  // View states
  viewMode: 'grid' | 'list' = 'grid';
  showCreateModal = false;
  showAIModal = false;
  showAIRecommendations = false;
  showSuccessNotification = false;
  activeMenuId: string | null = null;

  // Filters
  statusFilter = 'all';
  originFilter = 'all';
  priorityFilter = 'all';

  // Data
  goals: Goal[] = [];
  filteredGoals: Goal[] = [];
  goalAnalysis: GoalAnalysis[] = [];

  // Overview stats
  totalInGoals = 0;
  totalSaved = 0;
  activeGoals = 0;
  overallProgress = 0;
  nextGoalName = '';
  nextGoalMonths = 0;
  nextGoalProgress = 0;
  totalGoalsProgress = 0;
  totalGrowthPercentage = 0;

  // Financial health
  financialCapacity: 'excellent' | 'good' | 'limited' | 'critical' = 'good';
  availableForGoals = 0;
  monthlyCommitmentToGoals = 0;
  recommendedGoalBudget = 0;
  goalImpactOnBudget = 0;

  // Gamification
  userStats: UserStats = {
    level: 1,
    xp: 0,
    xpToNextLevel: 500,
    totalBadges: 0,
    streakDays: 0,
    longestStreak: 0,
    goalsCompleted: 0,
    totalSaved: 0,
    rank: 'Iniciante'
  };

  unlockedBadges: Badge[] = [];
  totalBadges = 12;
  displayedBadges: Badge[] = [];
  activeMissions: Mission[] = [];
  completedMissions: Mission[] = [];

  // AI Assistant
  aiInsights: AIInsight[] = [];
  selectedGoalScenario: ScenarioSimulation | null = null;

  // Success notifications
  successMessage: {
    title: string;
    description: string;
    badges?: Badge[];
  } | null = null;

  constructor(
    private dataService: DataService,
    private modalService: ModalService,
    private calculatorService: FinancialCalculatorService,
    private gamificationService: GamificationService,
    private aiService: AIAssistantService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.setupSubscriptions();
    this.initializeGamification();
    this.generateAIInsights();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadInitialData(): void {
    // Load goals
    this.subscriptions.add(
      this.dataService.goals$.subscribe(goals => {
        this.goals = goals;
        this.calculateGoalAnalysis();
        this.updateOverviewStats();
        this.applyFilters();
        this.calculateFinancialHealth();
      })
    );
  }

  private setupSubscriptions(): void {
    // Subscribe to gamification updates
    this.subscriptions.add(
      this.gamificationService.userStats$.subscribe(stats => {
        this.userStats = stats;
      })
    );

    this.subscriptions.add(
      this.gamificationService.badges$.subscribe(badges => {
        this.unlockedBadges = badges.filter(b => b.isUnlocked);
        this.displayedBadges = badges.slice(0, 6); // Show first 6 badges
      })
    );

    this.subscriptions.add(
      this.gamificationService.missions$.subscribe(missions => {
        this.activeMissions = missions.filter(m => !m.isCompleted);
        this.completedMissions = missions.filter(m => m.isCompleted);
      })
    );
  }

  private initializeGamification(): void {
    // Initialize with mock data
    this.userStats = {
      level: 3,
      xp: 1250,
      xpToNextLevel: 500,
      totalBadges: 4,
      streakDays: 7,
      longestStreak: 12,
      goalsCompleted: 8,
      totalSaved: 15000,
      rank: 'Aventureiro'
    };
  }

  private generateAIInsights(): void {
    // Generate mock AI insights
    this.aiInsights = [
      {
        id: '1',
        type: 'recommendation',
        priority: 'medium',
        title: 'Oportunidade de Economia',
        message: 'Com base no seu padrão de gastos, você pode economizar R$ 500 adicional este mês.',
        actionText: 'Ver Detalhes',
        actionType: 'view_details',
        createdAt: new Date().toISOString(),
        isRead: false,
        category: 'optimization',
        icon: '💡'
      }
    ];
  }

  private calculateGoalAnalysis(): void {
    this.goalAnalysis = this.goals.map(goal =>
      this.calculatorService.analyzeIndividualGoal(goal)
    );
  }

  private updateOverviewStats(): void {
    const activeGoals = this.goals.filter(g => !g.completed);

    this.totalInGoals = this.goals.reduce((sum, g) => sum + g.target, 0);
    this.totalSaved = this.goals.reduce((sum, g) => sum + g.saved, 0);
    this.activeGoals = activeGoals.length;
    this.overallProgress = this.totalInGoals > 0 ? Math.round((this.totalSaved / this.totalInGoals) * 100) : 0;

    // Next goal
    const nextGoal = activeGoals
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0];

    if (nextGoal) {
      this.nextGoalName = nextGoal.name;
      this.nextGoalMonths = Math.max(1, Math.ceil((new Date(nextGoal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)));
      this.nextGoalProgress = this.getGoalPercentage(nextGoal);
    }

    // Calculate other metrics
    this.totalGoalsProgress = Math.min(100, (this.activeGoals / Math.max(1, this.activeGoals + 2)) * 100);
    this.totalGrowthPercentage = Math.floor(Math.random() * 20) + 10; // Mock growth
  }

  private calculateFinancialHealth(): void {
    // Mock financial health calculation
    const mockTransactions: any[] = []; // In real app, get from data service
    const period = { type: 'mes-atual' as any };

    const integratedHealth = this.calculatorService.calculateIntegratedFinancialHealth(
      mockTransactions,
      this.goals,
      period
    );

    this.availableForGoals = integratedHealth.availableForGoals || 5000;
    this.monthlyCommitmentToGoals = integratedHealth.monthlyCommitmentToGoals || 1200;
    this.recommendedGoalBudget = integratedHealth.recommendedGoalBudget || 3000;
    this.goalImpactOnBudget = integratedHealth.goalImpactOnBudget || 25;
    this.financialCapacity = integratedHealth.financialCapacity;
  }

  // View Methods
  applyFilters(): void {
    this.filteredGoals = this.goals.filter(goal => {
      let matches = true;

      if (this.statusFilter !== 'all') {
        if (this.statusFilter === 'active') {
          matches = matches && !goal.completed;
        } else if (this.statusFilter === 'completed') {
          matches = matches && goal.completed;
        }
      }

      if (this.originFilter !== 'all') {
        matches = matches && goal.origin === this.originFilter;
      }

      if (this.priorityFilter !== 'all') {
        matches = matches && goal.priority === this.priorityFilter;
      }

      return matches;
    });
  }

  clearFilters(): void {
    this.statusFilter = 'all';
    this.originFilter = 'all';
    this.priorityFilter = 'all';
    this.applyFilters();
  }

  // Goal Methods
  openCreateGoalModal(): void {
    this.modalService.openModal('goal', {
      title: 'Nova Meta',
      mode: 'create',
      onConfirm: (goalData: any) => {
        this.addNewGoal(goalData);
      }
    });
  }

  private addNewGoal(goalData: any): void {
    this.dataService.addGoal(goalData);
    this.showSuccessMessage('Meta Criada!', 'Sua nova meta foi adicionada com sucesso.');

    // Mock new badges check
    const newBadges: Badge[] = [];
    if (newBadges.length > 0) {
      this.showBadgeUnlockNotification(newBadges);
    }
  }

  editGoal(goal: Goal): void {
    this.modalService.openModal('goal', {
      title: 'Editar Meta',
      mode: 'edit',
      data: goal,
      onConfirm: (goalData: any) => {
        this.dataService.updateGoal(goal.id, goalData);
      }
    });
    this.activeMenuId = null;
  }

  duplicateGoal(goal: Goal): void {
    const newGoal = {
      ...goal,
      id: '', // Will be assigned by dataService.addGoal
      name: `${goal.name} (Cópia)`,
      saved: 0,
      completed: false
    };
    this.dataService.addGoal(newGoal);
    this.activeMenuId = null;
  }

  deleteGoal(goalId: string): void {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
      this.dataService.deleteGoal(goalId);
      this.activeMenuId = null;
    }
  }

  contributeToGoal(goal: Goal): void {
    this.modalService.openModal('contribution', {
      goal: goal,
      onConfirm: (amount: number) => {
        this.processContribution(goal, amount);
      }
    });
  }

  private processContribution(goal: Goal, amount: number): void {
    const updatedGoal = {
      ...goal,
      saved: goal.saved + amount
    };

    if (updatedGoal.saved >= updatedGoal.target) {
      updatedGoal.completed = true;
      updatedGoal.saved = updatedGoal.target;
    }

    this.dataService.updateGoal(goal.id, updatedGoal);

    // Update stats (mock)
    this.userStats.xp += 50;
    this.userStats.totalSaved += amount;

    // Mock new badges check
    const newBadges: Badge[] = [];
    if (newBadges.length > 0) {
      this.showBadgeUnlockNotification(newBadges);
    } else {
      this.showSuccessMessage('Aporte Realizado!', `R$ ${this.formatCurrency(amount)} adicionado à meta "${goal.name}".`);
    }
  }

  viewGoalDetails(goal: Goal): void {
    // Implementation for detailed goal view
    console.log('View goal details:', goal);
  }

  // AI Methods
  toggleAIRecommendations(): void {
    this.showAIRecommendations = !this.showAIRecommendations;
  }

  getCurrentAIInsight(): string {
    if (this.aiInsights.length === 0) return 'Analisando suas metas...';
    return this.aiInsights[0].message;
  }

  refreshAIInsights(): void {
    this.generateAIInsights();
  }

  executeInsightAction(insight: AIInsight): void {
    console.log('Execute insight action:', insight);
    // Implementation for insight actions
  }

  showGoalAnalysis(goal: Goal): void {
    const analysis = this.goalAnalysis.find(a => a.id === goal.id);
    if (analysis) {
      alert(`Análise da meta "${goal.name}": ${analysis.status}`);
    }
    this.activeMenuId = null;
  }

  showScenarios(goal: Goal): void {
    // Mock scenario generation
    this.selectedGoalScenario = {
      goalId: goal.id,
      aiRecommendation: 'Baseado na sua capacidade financeira atual, recomendo manter o plano base com pequenos ajustes.',
      scenarios: {
        conservative: {
          monthlyContribution: goal.monthlyTarget * 0.8,
          estimatedCompletion: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          probability: 90,
          description: 'Cenário mais seguro com contribuições menores.'
        },
        base: {
          monthlyContribution: goal.monthlyTarget,
          estimatedCompletion: goal.deadline,
          probability: 75,
          description: 'Cenário planejado com contribuições atuais.'
        },
        optimistic: {
          monthlyContribution: goal.monthlyTarget * 1.2,
          estimatedCompletion: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          probability: 60,
          description: 'Cenário otimista com contribuições maiores.'
        }
      }
    };
    this.showAIModal = true;
  }

  // Gamification Methods
  getXPProgress(): number {
    const xpForCurrentLevel = this.userStats.level * 500;
    const xpForNextLevel = (this.userStats.level + 1) * 500;
    const currentLevelXP = this.userStats.xp - xpForCurrentLevel;
    const nextLevelXP = xpForNextLevel - xpForCurrentLevel;

    return Math.min(100, (currentLevelXP / nextLevelXP) * 100);
  }

  getMissionProgress(mission: Mission): number {
    return Math.min(100, (mission.progress / mission.maxProgress) * 100);
  }

  showBadgeDetails(badge: Badge): void {
    alert(`${badge.name}: ${badge.description}`);
  }

  private showBadgeUnlockNotification(badges: Badge[]): void {
    this.successMessage = {
      title: 'Nova Conquista!',
      description: `Você desbloqueou ${badges.length > 1 ? `${badges.length} badges` : 'um badge'}!`,
      badges: badges
    };
    this.showSuccessNotification = true;

    setTimeout(() => {
      this.showSuccessNotification = false;
    }, 5000);
  }

  private showSuccessMessage(title: string, description: string): void {
    this.successMessage = { title, description };
    this.showSuccessNotification = true;

    setTimeout(() => {
      this.showSuccessNotification = false;
    }, 3000);
  }

  // Utility Methods
  toggleGoalMenu(goalId: string): void {
    this.activeMenuId = this.activeMenuId === goalId ? null : goalId;
  }

  exportGoals(): void {
    const dataStr = JSON.stringify(this.goals, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `metas-venturefi-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  getGoalPercentage(goal: Goal): number {
    return goal.target > 0 ? Math.round((goal.saved / goal.target) * 100) : 0;
  }

  getGoalMilestones(goal: Goal): Array<{position: number, reached: boolean}> {
    const milestones = [25, 50, 75];
    const currentPercentage = this.getGoalPercentage(goal);

    return milestones.map(milestone => ({
      position: milestone,
      reached: currentPercentage >= milestone
    }));
  }

  getPriorityLabel(priority: string): string {
    const labels = {
      'high': 'Alta',
      'medium': 'Média',
      'low': 'Baixa'
    };
    return labels[priority as keyof typeof labels] || priority;
  }

  getCapacityLabel(capacity: string): string {
    const labels = {
      'excellent': 'Excelente',
      'good': 'Boa',
      'limited': 'Limitada',
      'critical': 'Crítica'
    };
    return labels[capacity as keyof typeof labels] || capacity;
  }

  getInsightIcon(type: string): string {
    const icons = {
      'opportunity': '💡',
      'warning': '⚠️',
      'optimization': '🔧'
    };
    return icons[type as keyof typeof icons] || '💡';
  }

  getImpactLabel(impact: string): string {
    const labels = {
      'positive': 'Positivo',
      'neutral': 'Neutro',
      'negative': 'Negativo'
    };
    return labels[impact as keyof typeof labels] || impact;
  }

  getTimeRemaining(goal: Goal): string {
    const now = new Date();
    const deadline = new Date(goal.deadline);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Vencida';
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return '1 dia';
    if (diffDays < 30) return `${diffDays} dias`;

    const months = Math.ceil(diffDays / 30);
    return months === 1 ? '1 mês' : `${months} meses`;
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }
}
