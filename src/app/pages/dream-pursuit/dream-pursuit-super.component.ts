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
    <!-- Premium Page Header -->
    <section class="premium-page-header">
      <div class="header-background">
        <div class="gradient-overlay"></div>
        <div class="geometric-pattern"></div>
      </div>

      <div class="header-content-wrapper">
        <div class="header-main-content">
          <div class="title-section">
            <div class="title-icon">
              <app-icon name="rocket-launch" size="48"></app-icon>
            </div>
            <div class="title-text">
              <h1 class="page-title">Em Busca do Sonho</h1>
              <p class="page-subtitle">Transforme seus objetivos em realidade com IA avançada</p>
            </div>
          </div>

          <div class="header-stats">
            <div class="stat-card">
              <div class="stat-icon">
                <app-icon name="target" size="24"></app-icon>
              </div>
              <div class="stat-content">
                <span class="stat-number">{{ goals.length }}</span>
                <span class="stat-label">Metas Ativas</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <app-icon name="banknotes" size="24"></app-icon>
              </div>
              <div class="stat-content">
                <span class="stat-number">R$ {{ getTotalSaved() }}</span>
                <span class="stat-label">Total Poupado</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <app-icon name="chart-bar" size="24"></app-icon>
              </div>
              <div class="stat-content">
                <span class="stat-number">{{ getAverageProgress() }}%</span>
                <span class="stat-label">Progresso Médio</span>
              </div>
            </div>
          </div>
        </div>

        <div class="header-actions">
          <button class="premium-action-btn primary" (click)="showCreateModal = true">
            <span class="btn-icon">✨</span>
            <span class="btn-text">Nova Meta</span>
          </button>
          <button class="premium-action-btn secondary" (click)="openAIAssistant()">
            <span class="btn-icon">🤖</span>
            <span class="btn-text">IA Assistant</span>
          </button>
        </div>
      </div>
    </section>

    <!-- AI Assistant Banner -->
    <div class="ai-assistant-banner animate-fade-in" *ngIf="aiInsights.length > 0">
      <div class="ai-banner-content">
        <div class="ai-icon">
          <app-icon name="cpu-chip" size="32"></app-icon>
        </div>
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
                <span class="icon-emoji">💰</span>
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
                <span class="icon-emoji">📉</span>
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
                <span class="icon-emoji">🏆</span>
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
                <span class="icon-emoji">⭐</span>
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
          <h3>
            <app-icon name="light-bulb" size="20"></app-icon>
            Recomendações Inteligentes
          </h3>
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

      <!-- Premium Achievement System -->
      <div class="premium-achievements-section animate-fade-in">
        <!-- Achievement Header -->
        <div class="achievement-header">
          <div class="header-main">
            <h3 class="achievement-title">
              <span class="title-icon-premium">
                <app-icon name="trophy" size="32"></app-icon>
              </span>
              <span class="title-text">Centro de Conquistas</span>
            </h3>
            <div class="achievement-subtitle">
              Acompanhe seu progresso e desbloqueie recompensas exclusivas
            </div>
          </div>

          <div class="user-level-card">
            <div class="level-info">
              <div class="level-avatar">
                <div class="avatar-ring" [style.background]="getLevelRingColor()">
                  <span class="level-number">{{ userStats.level }}</span>
                </div>
              </div>
              <div class="level-details">
                <h4 class="level-title">Nível {{ userStats.level }}</h4>
                <div class="level-subtitle">{{ getLevelTitle() }}</div>
                <div class="xp-progress">
                  <div class="xp-bar">
                    <div class="xp-fill" [style.width.%]="getXPProgress()"></div>
                  </div>
                  <span class="xp-text">{{ userStats.xp }} / {{ getNextLevelXP() }} XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Achievement Stats Overview -->
        <div class="achievement-stats-overview">
          <div class="stat-card-premium" (click)="showAllBadges()">
            <div class="stat-icon-premium">
              <app-icon name="trophy" size="32"></app-icon>
            </div>
            <div class="stat-content-premium">
              <div class="stat-value-premium">{{ unlockedBadges.length }}</div>
              <div class="stat-label-premium">Badges Conquistados</div>
              <div class="stat-progress-premium">
                <div class="progress-mini" [style.width.%]="getBadgeCompletionPercentage()"></div>
              </div>
            </div>
            <div class="stat-arrow">›</div>
          </div>

          <div class="stat-card-premium" (click)="showActiveMissions()">
            <div class="stat-icon-premium">
              <app-icon name="target" size="32"></app-icon>
            </div>
            <div class="stat-content-premium">
              <div class="stat-value-premium">{{ activeMissions.length }}</div>
              <div class="stat-label-premium">Missões Ativas</div>
              <div class="stat-progress-premium">
                <div class="progress-mini" [style.width.%]="getActiveMissionsProgress()"></div>
              </div>
            </div>
            <div class="stat-arrow">›</div>
          </div>

          <div class="stat-card-premium" (click)="showStreakInfo()">
            <div class="stat-icon-premium">
              <app-icon name="fire" size="32"></app-icon>
            </div>
            <div class="stat-content-premium">
              <div class="stat-value-premium">{{ userStats.streakDays }}</div>
              <div class="stat-label-premium">Dias de Sequência</div>
              <div class="stat-progress-premium">
                <div class="progress-mini" [style.width.%]="getStreakProgress()"></div>
              </div>
            </div>
            <div class="stat-arrow">›</div>
          </div>

          <div class="stat-card-premium" (click)="showRankingInfo()">
            <div class="stat-icon-premium">
              <app-icon name="chart-bar" size="32"></app-icon>
            </div>
            <div class="stat-content-premium">
              <div class="stat-value-premium">#{{ getUserRank() }}</div>
              <div class="stat-label-premium">Ranking Geral</div>
              <div class="stat-progress-premium">
                <div class="progress-mini" [style.width.%]="getRankingProgress()"></div>
              </div>
            </div>
            <div class="stat-arrow">›</div>
          </div>
        </div>

        <!-- Featured Badges & Recent Achievements -->
        <div class="featured-content">
          <!-- Featured Badges -->
          <div class="featured-badges">
            <div class="section-header-mini">
              <h4>
                <app-icon name="star" size="16"></app-icon>
                Badges em Destaque
              </h4>
              <button class="view-all-btn" (click)="showAllBadges()">Ver todos</button>
            </div>

            <div class="badges-showcase">
              <div *ngFor="let badge of getFeaturedBadges()"
                   class="badge-showcase-item"
                   [class.unlocked]="badge.isUnlocked"
                   [class.almost-unlocked]="isAlmostUnlocked(badge)"
                   (click)="showBadgeDetails(badge)">
                <div class="badge-image">
                  <div class="badge-glow" *ngIf="badge.isUnlocked"></div>
                  <span class="badge-icon-large">{{ badge.icon }}</span>
                  <div class="badge-rarity" [class]="badge.rarity">{{ getRarityLabel(badge.rarity) }}</div>
                </div>
                <div class="badge-details">
                  <h5 class="badge-name">{{ badge.name }}</h5>
                  <p class="badge-desc">{{ badge.description }}</p>
                  <div class="badge-progress-container" *ngIf="!badge.isUnlocked">
                    <div class="progress-bar-mini">
                      <div class="progress-fill-mini" [style.width.%]="getBadgeProgress(badge)"></div>
                    </div>
                    <span class="progress-text-mini">{{ badge.progress || 0 }}/{{ badge.maxProgress || 100 }}</span>
                  </div>
                  <div class="badge-unlocked" *ngIf="badge.isUnlocked">
                    <app-icon name="check-circle" size="12"></app-icon>
                    Desbloqueado
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Missions Premium -->
          <div class="active-missions-premium" *ngIf="activeMissions.length > 0">
            <div class="section-header-mini">
              <h4>
                <app-icon name="bolt" size="16"></app-icon>
                Missões Ativas
              </h4>
              <span class="missions-count">{{ activeMissions.length }}/5</span>
            </div>

            <div class="missions-list">
              <div *ngFor="let mission of getTopMissions()"
                   class="mission-item-premium"
                   (click)="showMissionDetails(mission)">
                <div class="mission-icon-container">
                  <span class="mission-icon">{{ mission.icon }}</span>
                  <div class="mission-type-badge" [class]="mission.type">{{ getMissionTypeLabel(mission.type) }}</div>
                </div>

                <div class="mission-content">
                  <h5 class="mission-name">{{ mission.title }}</h5>
                  <p class="mission-description">{{ mission.description }}</p>

                  <div class="mission-progress-premium">
                    <div class="progress-info">
                      <span class="progress-current">{{ mission.progress }}</span>
                      <span class="progress-separator">/</span>
                      <span class="progress-max">{{ mission.maxProgress }}</span>
                    </div>
                    <div class="progress-bar-premium">
                      <div class="progress-fill-premium" [style.width.%]="getMissionProgress(mission)"></div>
                    </div>
                  </div>
                </div>

                <div class="mission-reward">
                  <div class="xp-reward">
                    <span class="xp-icon">
                      <app-icon name="sparkles" size="12"></app-icon>
                    </span>
                    <span class="xp-amount">+{{ mission.xp }}</span>
                  </div>
                  <div class="mission-arrow">›</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Financial Health Analysis -->
      <div class="financial-health-section animate-fade-in">
        <div class="health-header">
          <h3>
            <app-icon name="chart-pie" size="24"></app-icon>
            Análise Financeira
          </h3>
          <div class="capacity-indicator" [class]="'capacity-' + financialCapacity">
            {{ getCapacityLabel(financialCapacity) }}
          </div>
        </div>

        <div class="health-metrics">
          <div class="metric-card">
            <div class="metric-icon">
              <app-icon name="banknotes" size="24"></app-icon>
            </div>
            <div class="metric-content">
              <div class="metric-label">Disponível para Metas</div>
              <div class="metric-value">R$ {{ formatCurrency(availableForGoals) }}</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <app-icon name="chart-bar" size="24"></app-icon>
            </div>
            <div class="metric-content">
              <div class="metric-label">Comprometimento Mensal</div>
              <div class="metric-value">R$ {{ formatCurrency(monthlyCommitmentToGoals) }}</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <app-icon name="target" size="24"></app-icon>
            </div>
            <div class="metric-content">
              <div class="metric-label">Orçamento Recomendado</div>
              <div class="metric-value">R$ {{ formatCurrency(recommendedGoalBudget) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Premium Filters & Controls Section -->
      <div class="premium-controls-section animate-fade-in">
        <div class="controls-header">
          <div class="header-left">
            <h3 class="section-title-premium">
              <span class="title-icon">
                <app-icon name="adjustments-horizontal" size="24"></app-icon>
              </span>
              <span>Controles Avançados</span>
            </h3>
            <div class="results-indicator">
              <span class="count-badge">{{ filteredGoals.length }}</span>
              <span class="count-label">metas encontradas</span>
            </div>
          </div>
          <div class="header-right">
            <div class="view-controls">
              <div class="view-toggle-premium">
                <button class="view-btn-premium"
                        [class.active]="viewMode === 'grid'"
                        (click)="viewMode = 'grid'"
                        title="Visualização em Grade">
                  <span class="btn-icon">
                    <app-icon name="squares-2x2" size="16"></app-icon>
                  </span>
                  <span class="btn-text">Grade</span>
                </button>
                <button class="view-btn-premium"
                        [class.active]="viewMode === 'list'"
                        (click)="viewMode = 'list'"
                        title="Visualização em Lista">
                  <span class="btn-icon">
                    <app-icon name="bars-3" size="16"></app-icon>
                  </span>
                  <span class="btn-text">Lista</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="filters-container-premium">
          <!-- Quick Filters -->
          <div class="quick-filters">
            <h4 class="filter-section-title">Filtros Rápidos</h4>
            <div class="quick-filter-chips">
              <button class="filter-chip"
                      [class.active]="statusFilter === 'all'"
                      (click)="setQuickFilter('status', 'all')">
                <span class="chip-icon">
                  <app-icon name="arrow-path" size="16"></app-icon>
                </span>
                <span class="chip-text">Todas</span>
                <span class="chip-count">{{ getAllGoalsCount() }}</span>
              </button>
              <button class="filter-chip"
                      [class.active]="statusFilter === 'active'"
                      (click)="setQuickFilter('status', 'active')">
                <span class="chip-icon">
                  <app-icon name="target" size="16"></app-icon>
                </span>
                <span class="chip-text">Ativas</span>
                <span class="chip-count">{{ getActiveGoalsCount() }}</span>
              </button>
              <button class="filter-chip"
                      [class.active]="statusFilter === 'completed'"
                      (click)="setQuickFilter('status', 'completed')">
                <span class="chip-icon">
                  <app-icon name="check-circle" size="16"></app-icon>
                </span>
                <span class="chip-text">Concluídas</span>
                <span class="chip-count">{{ getCompletedGoalsCount() }}</span>
              </button>
              <button class="filter-chip"
                      [class.active]="priorityFilter === 'high'"
                      (click)="setQuickFilter('priority', 'high')">
                <span class="chip-icon">
                  <app-icon name="exclamation-circle" size="16"></app-icon>
                </span>
                <span class="chip-text">Alta Prioridade</span>
                <span class="chip-count">{{ getHighPriorityCount() }}</span>
              </button>
            </div>
          </div>

          <!-- Advanced Filters -->
          <div class="advanced-filters">
            <div class="filter-row">
              <div class="filter-group-premium">
                <label class="filter-label-premium">
                  <app-icon name="briefcase" size="14"></app-icon>
                  Categoria
                </label>
                <div class="custom-select">
                  <select [(ngModel)]="originFilter" (change)="applyFilters()" class="select-premium">
                    <option value="all">Todas as categorias</option>
                    <option value="personal">Pessoal</option>
                    <option value="business">Negócio</option>
                  </select>
                  <div class="select-arrow">▼</div>
                </div>
              </div>

              <div class="filter-group-premium">
                <label class="filter-label-premium">
                  <app-icon name="bolt" size="14"></app-icon>
                  Prioridade
                </label>
                <div class="custom-select">
                  <select [(ngModel)]="priorityFilter" (change)="applyFilters()" class="select-premium">
                    <option value="all">Todas as prioridades</option>
                    <option value="high">Alta</option>
                    <option value="medium">Média</option>
                    <option value="low">Baixa</option>
                  </select>
                  <div class="select-arrow">▼</div>
                </div>
              </div>

              <div class="filter-group-premium">
                <label class="filter-label-premium">
                  <app-icon name="bars-arrow-up" size="14"></app-icon>
                  Ordenar por
                </label>
                <div class="custom-select">
                  <select [(ngModel)]="sortBy" (change)="applySorting()" class="select-premium">
                    <option value="progress">Progresso</option>
                    <option value="deadline">Prazo</option>
                    <option value="amount">Valor</option>
                    <option value="priority">Prioridade</option>
                    <option value="name">Nome</option>
                  </select>
                  <div class="select-arrow">▼</div>
                </div>
              </div>

              <div class="filter-actions">
                <button class="btn-clear-premium" (click)="clearAllFilters()" title="Limpar todos os filtros">
                  <span class="btn-icon">
                    <app-icon name="trash" size="16"></app-icon>
                  </span>
                  <span class="btn-text">Limpar</span>
                </button>
                <button class="btn-save-filter" (click)="saveCurrentFilter()" title="Salvar filtro atual">
                  <span class="btn-icon">
                    <app-icon name="floppy-disk" size="16"></app-icon>
                  </span>
                  <span class="btn-text">Salvar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modern Goals Section -->
      <div class="modern-goals-section animate-fade-in">
        <!-- Section Header -->
        <div class="modern-goals-header">
          <div class="header-main">
            <div class="title-wrapper">
              <div class="title-icon-wrapper">
                <div class="title-icon-bg">
                  <span class="title-icon">🎯</span>
                </div>
              </div>
              <div class="title-content">
                <h2 class="section-title">Suas Metas Financeiras</h2>
                <p class="section-subtitle">Transforme seus sonhos em realidade com planejamento inteligente</p>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="quick-stats">
              <div class="stat-item">
                <div class="stat-number">{{ getOverallProgress() }}%</div>
                <div class="stat-label">Progresso Médio</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">R$ {{ getTotalSaved() }}</div>
                <div class="stat-label">Total Economizado</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ goals.length }}</div>
                <div class="stat-label">Metas Ativas</div>
              </div>
            </div>
          </div>

          <!-- Header Actions -->
          <div class="header-actions">
            <button class="create-goal-btn" (click)="showCreateModal = true">
              <div class="btn-icon-wrapper">
                <span class="btn-icon">✨</span>
              </div>
              <span class="btn-text">Nova Meta</span>
              <div class="btn-arrow">→</div>
            </button>
          </div>
        </div>

        <!-- Goals Grid -->
        <div class="modern-goals-grid" *ngIf="filteredGoals.length > 0">
          <div *ngFor="let goal of filteredGoals"
               class="modern-goal-card"
               [class.completed]="goal.completed"
               [class.high-priority]="goal.priority === 'high'"
               [class.favorite]="goal.isFavorite"
               [class.almost-complete]="getGoalPercentage(goal) >= 80"
               (click)="openGoalDetails(goal)">

            <!-- Card Background Pattern -->
            <div class="card-bg-pattern"></div>

            <!-- Card Header -->
            <div class="modern-card-header">
              <div class="goal-identity">
                <div class="goal-icon-container">
                  <div class="goal-icon">{{ goal.icon || '🎯' }}</div>
                  <div class="priority-indicator" [class]="'priority-' + goal.priority"></div>
                </div>
                <div class="goal-info">
                  <h3 class="goal-title">{{ goal.name }}</h3>
                  <div class="goal-meta">
                    <span class="goal-category">{{ getGoalCategory(goal) }}</span>
                    <span class="goal-deadline">{{ getTimeRemaining(goal) }}</span>
                  </div>
                </div>
              </div>

              <div class="card-actions">
                <button class="action-btn favorite"
                        (click)="$event.stopPropagation(); favoriteGoal(goal)"
                        [class.active]="goal.isFavorite"
                        title="Favoritar">
                  <span>{{ goal.isFavorite ? '❤️' : '🤍' }}</span>
                </button>
                <div class="status-indicator" [class]="getGoalSmartStatus(goal).class">
                  {{ getGoalSmartStatus(goal).icon }}
                </div>
              </div>
            </div>

            <!-- Progress Section -->
            <div class="modern-progress-section">
              <!-- Progress Ring -->
              <div class="progress-ring-container">
                <svg class="progress-ring" width="100" height="100">
                  <defs>
                    <linearGradient id="progressGradient-{{ goal.id }}" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" [attr.stop-color]="getProgressColor(goal)" stop-opacity="0.3"/>
                      <stop offset="100%" [attr.stop-color]="getProgressColor(goal)" stop-opacity="1"/>
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="40" stroke="#f1f5f9" stroke-width="6" fill="none"></circle>
                  <circle cx="50" cy="50" r="40"
                          [attr.stroke]="'url(#progressGradient-' + goal.id + ')'"
                          stroke-width="6"
                          fill="none"
                          stroke-linecap="round"
                          [style.stroke-dasharray]="251.2"
                          [style.stroke-dashoffset]="getProgressRingOffset(goal)"
                          transform="rotate(-90 50 50)">
                  </circle>
                </svg>
                <div class="progress-center">
                  <div class="progress-percentage">{{ getGoalPercentage(goal) }}%</div>
                  <div class="progress-label">Concluído</div>
                </div>
              </div>

              <!-- Progress Stats -->
              <div class="progress-stats-modern">
                <div class="stat-row">
                  <div class="stat-item-modern">
                    <div class="stat-icon">💰</div>
                    <div class="stat-content">
                      <div class="stat-value">R$ {{ formatCurrency(goal.saved) }}</div>
                      <div class="stat-label">Economizado</div>
                    </div>
                  </div>
                  <div class="stat-item-modern">
                    <div class="stat-icon">🎯</div>
                    <div class="stat-content">
                      <div class="stat-value">R$ {{ formatCurrency(goal.target - goal.saved) }}</div>
                      <div class="stat-label">Restante</div>
                    </div>
                  </div>
                </div>
                <div class="stat-row">
                  <div class="stat-item-modern">
                    <div class="stat-icon">📅</div>
                    <div class="stat-content">
                      <div class="stat-value">R$ {{ formatCurrency(goal.monthlyTarget) }}</div>
                      <div class="stat-label">Por Mês</div>
                    </div>
                  </div>
                  <div class="stat-item-modern">
                    <div class="stat-icon">⏱️</div>
                    <div class="stat-content">
                      <div class="stat-value">{{ getMonthsRemaining(goal) }}</div>
                      <div class="stat-label">Meses</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Achievement Milestones -->
            <div class="milestones-section">
              <div class="milestones-header">
                <span class="milestones-title">Marcos de Progresso</span>
                <span class="milestones-count">{{ getAchievedCheckpoints(goal) }}/{{ getTotalCheckpoints(goal) }}</span>
              </div>
              <div class="milestones-track">
                <div *ngFor="let milestone of getGoalCheckpoints(goal); let i = index"
                     class="milestone"
                     [class.achieved]="milestone.achieved"
                     [class.current]="milestone.isCurrent"
                     [style.left.%]="milestone.percentage">
                  <div class="milestone-dot">
                    <span class="milestone-icon">{{ milestone.icon }}</span>
                  </div>
                  <div class="milestone-tooltip">{{ milestone.percentage }}%</div>
                </div>
                <div class="milestones-progress" [style.width.%]="getGoalPercentage(goal)"></div>
              </div>
            </div>

            <!-- Card Footer -->
            <div class="modern-card-footer">
              <div class="footer-info">
                <div class="next-milestone" *ngIf="getNextCheckpoint(goal) as nextCheckpoint">
                  <span class="milestone-label">Próximo marco:</span>
                  <span class="milestone-value">{{ nextCheckpoint.percentage }}% - {{ nextCheckpoint.title }}</span>
                </div>
              </div>
              <button class="contribute-btn"
                      (click)="$event.stopPropagation(); openContributeModal(goal)">
                <span class="btn-icon">💸</span>
                <span class="btn-text">Contribuir</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="filteredGoals.length === 0">
          <div class="empty-icon">🎯</div>
          <h3>Nenhuma meta encontrada</h3>
          <p>Crie sua primeira meta financeira e comece a transformar seus sonhos em realidade!</p>
          <button class="create-first-goal-btn" (click)="showCreateModal = true">
            <span class="btn-icon">✨</span>
            <span class="btn-text">Criar Primeira Meta</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Success Notification -->
    <div class="success-notification animate-slide-in" *ngIf="showSuccessNotification">
      <div class="notification-content">
        <div class="notification-icon">
          <app-icon name="trophy" size="24"></app-icon>
        </div>
        <div class="notification-text">
          <h4>{{ successMessage?.title }}</h4>
          <p>{{ successMessage?.description }}</p>
        </div>
        <button class="notification-close" (click)="showSuccessNotification = false">
          <app-icon name="x-mark" size="16"></app-icon>
        </button>
      </div>
    </div>

    <!-- Modern Goal Details Modal -->
    <div class="modern-modal-overlay" *ngIf="showGoalDetailsModal" (click)="showGoalDetailsModal = false">
      <div class="modern-modal-content goal-details-modal" (click)="$event.stopPropagation()">
        <!-- Modal Header -->
        <div class="modern-modal-header">
          <div class="modal-header-bg"></div>
          <div class="goal-header-content">
            <div class="goal-identity-modal">
              <div class="goal-icon-large">
                <div class="icon-bg">{{ selectedGoalForDetails?.icon || '🎯' }}</div>
                <div class="priority-ring" [class]="'priority-' + (selectedGoalForDetails?.priority || 'low')"></div>
              </div>
              <div class="goal-title-section">
                <h3 class="goal-title-modal">{{ selectedGoalForDetails?.name }}</h3>
                <div class="goal-meta-modal">
                  <span class="goal-category-modal">{{ selectedGoalForDetails ? getGoalCategory(selectedGoalForDetails) : '' }}</span>
                  <span class="goal-created-modal">Criada {{ selectedGoalForDetails ? getGoalCreatedDate(selectedGoalForDetails) : '' }}</span>
                </div>
                <div class="goal-badges-modal">
                  <div class="priority-badge-large" [class]="'priority-' + (selectedGoalForDetails?.priority || 'low')">
                    <span class="badge-icon">{{ getPriorityIcon(selectedGoalForDetails?.priority || 'low') }}</span>
                    <span class="badge-text">{{ getPriorityLabel(selectedGoalForDetails?.priority || 'low') }}</span>
                  </div>
                  <div class="status-badge-large" [class]="selectedGoalForDetails ? getGoalSmartStatus(selectedGoalForDetails).class : ''">
                    <span class="badge-icon">{{ selectedGoalForDetails ? getGoalSmartStatus(selectedGoalForDetails).icon : '' }}</span>
                    <span class="badge-text">{{ selectedGoalForDetails ? getGoalSmartStatus(selectedGoalForDetails).label : '' }}</span>
                  </div>
                </div>
              </div>
            </div>
            <button class="modern-modal-close" (click)="showGoalDetailsModal = false">
              <span class="close-icon">×</span>
            </button>
          </div>
        </div>

        <div class="modern-modal-body" *ngIf="selectedGoalForDetails">
          <!-- Progress Dashboard -->
          <div class="progress-dashboard-modal">
            <!-- Main Progress Ring -->
            <div class="main-progress-container">
              <div class="progress-ring-large">
                <svg width="160" height="160" class="progress-svg">
                  <defs>
                    <linearGradient id="modalProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" [attr.stop-color]="getProgressColor(selectedGoalForDetails)" stop-opacity="0.3"/>
                      <stop offset="50%" [attr.stop-color]="getProgressColor(selectedGoalForDetails)" stop-opacity="0.8"/>
                      <stop offset="100%" [attr.stop-color]="getProgressColor(selectedGoalForDetails)" stop-opacity="1"/>
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <circle cx="80" cy="80" r="70" stroke="#f1f5f9" stroke-width="12" fill="none"></circle>
                  <circle cx="80" cy="80" r="70"
                          stroke="url(#modalProgressGradient)"
                          stroke-width="12"
                          fill="none"
                          stroke-linecap="round"
                          filter="url(#glow)"
                          [style.stroke-dasharray]="439.8"
                          [style.stroke-dashoffset]="getProgressRingOffsetLarge(selectedGoalForDetails)"
                          transform="rotate(-90 80 80)">
                  </circle>
                </svg>
                <div class="progress-center-large">
                  <div class="progress-percentage-large">{{ getGoalPercentage(selectedGoalForDetails) }}%</div>
                  <div class="progress-label-large">Concluído</div>
                  <div class="progress-trend">
                    <span class="trend-icon">{{ getProgressTrend(selectedGoalForDetails).icon }}</span>
                    <span class="trend-text">{{ getProgressTrend(selectedGoalForDetails).text }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Stats Grid -->
            <div class="quick-stats-modal">
              <div class="stat-card-modal primary">
                <div class="stat-icon-wrapper">
                  <span class="stat-icon">💰</span>
                </div>
                <div class="stat-content">
                  <div class="stat-value">R$ {{ formatCurrency(selectedGoalForDetails.saved) }}</div>
                  <div class="stat-label">Economizado</div>
                  <div class="stat-progress-mini" [style.width.%]="(selectedGoalForDetails.saved / selectedGoalForDetails.target) * 100"></div>
                </div>
              </div>

              <div class="stat-card-modal secondary">
                <div class="stat-icon-wrapper">
                  <span class="stat-icon">🎯</span>
                </div>
                <div class="stat-content">
                  <div class="stat-value">R$ {{ formatCurrency(selectedGoalForDetails.target - selectedGoalForDetails.saved) }}</div>
                  <div class="stat-label">Restante</div>
                  <div class="stat-progress-mini" [style.width.%]="100 - ((selectedGoalForDetails.saved / selectedGoalForDetails.target) * 100)"></div>
                </div>
              </div>

              <div class="stat-card-modal accent">
                <div class="stat-icon-wrapper">
                  <span class="stat-icon">📅</span>
                </div>
                <div class="stat-content">
                  <div class="stat-value">R$ {{ formatCurrency(selectedGoalForDetails.monthlyTarget) }}</div>
                  <div class="stat-label">Mensal</div>
                  <div class="stat-progress-mini" [style.width.%]="getMonthlyProgress(selectedGoalForDetails)"></div>
                </div>
              </div>

              <div class="stat-card-modal warning">
                <div class="stat-icon-wrapper">
                  <span class="stat-icon">⏱️</span>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ getMonthsRemaining(selectedGoalForDetails) }}</div>
                  <div class="stat-label">Meses</div>
                  <div class="stat-progress-mini" [style.width.%]="getTimeProgress(selectedGoalForDetails)"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Goal Description & Details -->
          <div class="goal-details-section">
            <div class="details-card">
              <div class="card-header-small">
                <span class="header-icon">📝</span>
                <h4>Descrição & Objetivo</h4>
              </div>
              <div class="description-content">
                <p class="goal-description">{{ selectedGoalForDetails.description }}</p>
                <div class="goal-metadata">
                  <div class="metadata-item">
                    <span class="metadata-label">Meta Total:</span>
                    <span class="metadata-value">R$ {{ formatCurrency(selectedGoalForDetails.target) }}</span>
                  </div>
                  <div class="metadata-item">
                    <span class="metadata-label">Prazo:</span>
                    <span class="metadata-value">{{ getFormattedDeadline(selectedGoalForDetails) }}</span>
                  </div>
                  <div class="metadata-item">
                    <span class="metadata-label">Categoria:</span>
                    <span class="metadata-value">{{ getGoalCategory(selectedGoalForDetails) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Progress Timeline -->
          <div class="timeline-section">
            <div class="timeline-header">
              <span class="timeline-icon">🏆</span>
              <h4>Linha do Tempo de Conquistas</h4>
              <span class="timeline-progress">{{ getAchievedCheckpoints(selectedGoalForDetails) }}/{{ getTotalCheckpoints(selectedGoalForDetails) }} marcos</span>
            </div>

            <div class="timeline-container">
              <div class="timeline-track">
                <div class="timeline-progress-line" [style.width.%]="getGoalPercentage(selectedGoalForDetails)"></div>
              </div>

              <div class="timeline-milestones">
                <div *ngFor="let milestone of getGoalCheckpoints(selectedGoalForDetails); let i = index"
                     class="timeline-milestone"
                     [class.achieved]="milestone.achieved"
                     [class.current]="milestone.isCurrent"
                     [class.future]="!milestone.achieved && !milestone.isCurrent"
                     [style.left.%]="milestone.percentage">

                  <div class="milestone-marker">
                    <div class="milestone-dot">
                      <span class="milestone-icon">{{ milestone.icon }}</span>
                    </div>
                    <div class="milestone-glow" *ngIf="milestone.achieved"></div>
                  </div>

                  <div class="milestone-card">
                    <div class="milestone-header">
                      <h5 class="milestone-title">{{ milestone.title }}</h5>
                      <span class="milestone-percentage">{{ milestone.percentage }}%</span>
                    </div>
                    <p class="milestone-description">Marco de {{ milestone.percentage }}% da meta</p>
                    <div class="milestone-value">R$ {{ formatCurrency(milestone.amount) }}</div>
                    <div class="milestone-status" [class]="milestone.achieved ? 'achieved' : milestone.isCurrent ? 'current' : 'future'">
                      {{ milestone.achieved ? '✅ Conquistado' : milestone.isCurrent ? '🎯 Atual' : '⏳ Futuro' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- AI Insights & Recommendations -->
          <div class="ai-insights-section" *ngIf="getSmartRecommendations(selectedGoalForDetails).length > 0">
            <div class="insights-header">
              <span class="insights-icon">🤖</span>
              <h4>Insights Inteligentes</h4>
              <span class="insights-badge">IA</span>
            </div>

            <div class="insights-grid">
              <div *ngFor="let insight of getSmartRecommendations(selectedGoalForDetails)"
                   class="insight-card-modern"
                   [class]="insight.type">
                <div class="insight-header">
                  <div class="insight-icon-bg">
                    <span class="insight-icon">{{ insight.icon }}</span>
                  </div>
                  <div class="insight-content">
                    <h5 class="insight-title">{{ insight.title }}</h5>
                    <div class="insight-type-badge">{{ insight.typeLabel }}</div>
                  </div>
                </div>
                <p class="insight-description">{{ insight.description }}</p>
                <div class="insight-impact" *ngIf="insight.impact">
                  <span class="impact-label">Impacto:</span>
                  <span class="impact-value">{{ insight.impact }}</span>
                </div>
                <button class="insight-action-btn"
                        (click)="executeInsightAction(insight)"
                        *ngIf="insight.actionable">
                  <span class="btn-icon">{{ insight.actionIcon }}</span>
                  <span class="btn-text">{{ insight.actionText }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="modern-modal-actions">
            <button class="action-btn-modal secondary" 
                    (click)="openScenarioSimulator()"
                    [disabled]="filteredGoals.length === 0">
              <div class="btn-icon-wrapper">
                <span class="btn-icon">📊</span>
              </div>
              <span class="btn-text">Cenários</span>
            </button>

            <button class="action-btn-modal secondary" (click)="editGoal(selectedGoalForDetails)">
              <div class="btn-icon-wrapper">
                <span class="btn-icon">✏️</span>
              </div>
              <span class="btn-text">Editar</span>
            </button>

            <button class="action-btn-modal primary" (click)="contributeToGoal(selectedGoalForDetails)">
              <div class="btn-icon-wrapper">
                <span class="btn-icon">💸</span>
              </div>
              <span class="btn-text">Contribuir Agora</span>
              <div class="btn-arrow">→</div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Modal / Scenarios Simulator -->
    <div class="modal-overlay" *ngIf="showAIModal" (click)="showAIModal = false">
      <div class="modal-content scenarios-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="header-info">
            <h3>
              <app-icon name="target" size="24"></app-icon>
              Simulador de Cenários
            </h3>
            <p class="modal-subtitle" *ngIf="selectedGoalScenario">{{ getSelectedGoal()?.name }}</p>
          </div>
          <button class="modal-close" (click)="showAIModal = false">
            <app-icon name="x-mark" size="20"></app-icon>
          </button>
        </div>

        <div class="modal-body" *ngIf="selectedGoalScenario">
          <!-- AI Recommendation Banner -->
          <div class="ai-recommendation">
            <div class="ai-icon">
              <app-icon name="cpu-chip" size="24"></app-icon>
            </div>
            <div class="recommendation-content">
              <h4>Recomendação Inteligente</h4>
              <p>{{ selectedGoalScenario.aiRecommendation }}</p>
            </div>
          </div>

          <!-- Interactive Calculator -->
          <div class="calculator-section">
            <h4>
              <app-icon name="calculator" size="20"></app-icon>
              Calculadora Dinâmica
            </h4>
            <div class="calculator-inputs">
              <div class="input-group">
                <label>Aporte Mensal (R$)</label>
                <input type="number"
                       [(ngModel)]="simulatedMonthlyAmount"
                       (ngModelChange)="recalculateScenarios()"
                       class="calculator-input">
              </div>
              <div class="input-group">
                <label>Aporte Extra Anual (R$)</label>
                <input type="number"
                       [(ngModel)]="simulatedExtraAmount"
                       (ngModelChange)="recalculateScenarios()"
                       class="calculator-input">
              </div>
            </div>
          </div>

          <!-- Scenarios Grid -->
          <div class="scenarios-grid">
            <div class="scenario-card conservative"
                 [class.selected]="selectedScenario === 'conservative'"
                 (click)="selectScenario('conservative')">
              <div class="scenario-header">
                <div class="scenario-icon">
                  <app-icon name="lock-closed" size="24"></app-icon>
                </div>
                <h5>Conservador</h5>
                <div class="probability-badge">{{ selectedGoalScenario.scenarios.conservative.probability }}%</div>
              </div>
              <div class="scenario-content">
                <div class="scenario-metric">
                  <span class="metric-label">Mensal:</span>
                  <span class="metric-value">R$ {{ formatCurrency(selectedGoalScenario.scenarios.conservative.monthlyContribution) }}</span>
                </div>
                <div class="scenario-metric">
                  <span class="metric-label">Conclusão:</span>
                  <span class="metric-value">{{ formatDate(selectedGoalScenario.scenarios.conservative.estimatedCompletion) }}</span>
                </div>
                <div class="scenario-metric">
                  <span class="metric-label">Duração:</span>
                  <span class="metric-value">{{ calculateMonthsDifference(selectedGoalScenario.scenarios.conservative.estimatedCompletion) }} meses</span>
                </div>
                <p class="scenario-description">{{ selectedGoalScenario.scenarios.conservative.description }}</p>
              </div>
              <div class="scenario-progress">
                <div class="progress-bar">
                  <div class="progress-fill conservative-fill"
                       [style.width.%]="getScenarioProgress('conservative')"></div>
                </div>
              </div>
            </div>

            <div class="scenario-card base"
                 [class.selected]="selectedScenario === 'base'"
                 (click)="selectScenario('base')">
              <div class="scenario-header">
                <div class="scenario-icon">
                  <app-icon name="target" size="24"></app-icon>
                </div>
                <h5>Planejado</h5>
                <div class="probability-badge">{{ selectedGoalScenario.scenarios.base.probability }}%</div>
              </div>
              <div class="scenario-content">
                <div class="scenario-metric">
                  <span class="metric-label">Mensal:</span>
                  <span class="metric-value">R$ {{ formatCurrency(selectedGoalScenario.scenarios.base.monthlyContribution) }}</span>
                </div>
                <div class="scenario-metric">
                  <span class="metric-label">Conclusão:</span>
                  <span class="metric-value">{{ formatDate(selectedGoalScenario.scenarios.base.estimatedCompletion) }}</span>
                </div>
                <div class="scenario-metric">
                  <span class="metric-label">Duração:</span>
                  <span class="metric-value">{{ calculateMonthsDifference(selectedGoalScenario.scenarios.base.estimatedCompletion) }} meses</span>
                </div>
                <p class="scenario-description">{{ selectedGoalScenario.scenarios.base.description }}</p>
              </div>
              <div class="scenario-progress">
                <div class="progress-bar">
                  <div class="progress-fill base-fill"
                       [style.width.%]="getScenarioProgress('base')"></div>
                </div>
              </div>
            </div>

            <div class="scenario-card optimistic"
                 [class.selected]="selectedScenario === 'optimistic'"
                 (click)="selectScenario('optimistic')">
              <div class="scenario-header">
                <div class="scenario-icon">
                  <app-icon name="rocket-launch" size="24"></app-icon>
                </div>
                <h5>Otimista</h5>
                <div class="probability-badge">{{ selectedGoalScenario.scenarios.optimistic.probability }}%</div>
              </div>
              <div class="scenario-content">
                <div class="scenario-metric">
                  <span class="metric-label">Mensal:</span>
                  <span class="metric-value">R$ {{ formatCurrency(selectedGoalScenario.scenarios.optimistic.monthlyContribution) }}</span>
                </div>
                <div class="scenario-metric">
                  <span class="metric-label">Conclusão:</span>
                  <span class="metric-value">{{ formatDate(selectedGoalScenario.scenarios.optimistic.estimatedCompletion) }}</span>
                </div>
                <div class="scenario-metric">
                  <span class="metric-label">Duração:</span>
                  <span class="metric-value">{{ calculateMonthsDifference(selectedGoalScenario.scenarios.optimistic.estimatedCompletion) }} meses</span>
                </div>
                <p class="scenario-description">{{ selectedGoalScenario.scenarios.optimistic.description }}</p>
              </div>
              <div class="scenario-progress">
                <div class="progress-bar">
                  <div class="progress-fill optimistic-fill"
                       [style.width.%]="getScenarioProgress('optimistic')"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Comparison Chart Placeholder -->
          <div class="chart-section">
            <h4>
              <app-icon name="chart-bar" size="20"></app-icon>
              Projeção de Crescimento
            </h4>
            <div class="chart-placeholder">
              <div class="chart-bars">
                <div class="chart-bar conservative-bar">
                  <div class="bar-fill" [style.height.%]="getChartHeight('conservative')"></div>
                  <span class="bar-label">Conservador</span>
                </div>
                <div class="chart-bar base-bar">
                  <div class="bar-fill" [style.height.%]="getChartHeight('base')"></div>
                  <span class="bar-label">Planejado</span>
                </div>
                <div class="chart-bar optimistic-bar">
                  <div class="bar-fill" [style.height.%]="getChartHeight('optimistic')"></div>
                  <span class="bar-label">Otimista</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="modal-actions">
            <button class="btn-secondary" (click)="exportScenarios()">
              <app-icon name="arrow-down-tray" size="16"></app-icon>
              Exportar
            </button>
            <button class="btn-primary"
                    [disabled]="!selectedScenario"
                    (click)="applyScenario()">
              <app-icon name="check" size="16"></app-icon>
              Aplicar Cenário
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contribute Modal -->
    <div class="modal-overlay-modern" *ngIf="showContributeModal" (click)="closeContributeModal()">
      <div class="modal-content-modern contribute-modal" (click)="$event.stopPropagation()">
        <div class="modal-header-modern">
          <div class="modal-title-section">
            <div class="modal-icon">💸</div>
            <div class="modal-title-info">
              <h3 class="modal-title">Contribuir para Meta</h3>
              <p class="modal-subtitle" *ngIf="selectedGoalForContribute">{{ selectedGoalForContribute.name }}</p>
            </div>
          </div>
          <button class="modal-close-modern" (click)="closeContributeModal()">
            <span>✕</span>
          </button>
        </div>

        <div class="modal-body-modern" *ngIf="selectedGoalForContribute">
          <!-- Goal Progress Summary -->
          <div class="contribute-summary">
            <div class="goal-info-contribute">
              <div class="goal-icon-contribute">{{ selectedGoalForContribute.icon || '🎯' }}</div>
              <div class="goal-details-contribute">
                <h4 class="goal-name-contribute">{{ selectedGoalForContribute.name }}</h4>
                <div class="progress-info-contribute">
                  <span class="current-amount">R$ {{ formatCurrency(selectedGoalForContribute.saved) }}</span>
                  <span class="separator"> / </span>
                  <span class="target-amount">R$ {{ formatCurrency(selectedGoalForContribute.target) }}</span>
                </div>
                <div class="progress-bar-contribute">
                  <div class="progress-fill-contribute" [style.width.%]="getGoalPercentage(selectedGoalForContribute)"></div>
                </div>
                <div class="progress-percentage-contribute">{{ getGoalPercentage(selectedGoalForContribute) }}% concluído</div>
              </div>
            </div>
          </div>

          <!-- Contribution Form -->
          <div class="contribute-form">
            <div class="form-group-modern">
              <label class="form-label-modern">
                <span class="label-icon">💵</span>
                <span class="label-text">Valor da Contribuição</span>
              </label>
              <div class="input-wrapper-modern">
                <span class="input-prefix">R$</span>
                <input type="number"
                       [(ngModel)]="contributeAmount"
                       class="form-input-modern"
                       placeholder="0,00"
                       min="0"
                       step="0.01">
              </div>
            </div>

            <!-- Quick Amount Buttons -->
            <div class="quick-amounts">
              <h5 class="quick-title">⚡ Valores Rápidos</h5>
              <div class="quick-buttons">
                <button class="quick-btn" (click)="setQuickAmount(50)">R$ 50</button>
                <button class="quick-btn" (click)="setQuickAmount(100)">R$ 100</button>
                <button class="quick-btn" (click)="setQuickAmount(200)">R$ 200</button>
                <button class="quick-btn" (click)="setQuickAmount(500)">R$ 500</button>
              </div>
            </div>

            <!-- Impact Preview -->
            <div class="impact-preview" *ngIf="contributeAmount > 0">
              <div class="impact-header">
                <span class="impact-icon">📈</span>
                <span class="impact-title">Impacto da Contribuição</span>
              </div>
              <div class="impact-stats">
                <div class="impact-stat">
                  <span class="stat-label">Novo Total:</span>
                  <span class="stat-value">R$ {{ formatCurrency((selectedGoalForContribute.saved || 0) + (contributeAmount || 0)) }}</span>
                </div>
                <div class="impact-stat">
                  <span class="stat-label">Novo Progresso:</span>
                  <span class="stat-value">{{ getNewProgressPercentage() }}%</span>
                </div>
                <div class="impact-stat">
                  <span class="stat-label">Faltam:</span>
                  <span class="stat-value">R$ {{ formatCurrency(getRemainingAmount()) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="modal-actions-modern">
          <button class="btn-cancel-modern" (click)="closeContributeModal()">
            <span class="btn-icon">❌</span>
            <span class="btn-text">Cancelar</span>
          </button>
          <button class="btn-confirm-modern"
                  [disabled]="!contributeAmount || contributeAmount <= 0"
                  (click)="confirmContribution()">
            <span class="btn-icon">✨</span>
            <span class="btn-text">Confirmar Contribuição</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Create Goal Modal -->
    <div class="modal-overlay-modern" *ngIf="showCreateModal" (click)="showCreateModal = false">
      <div class="modal-content-modern create-modal" (click)="$event.stopPropagation()">
        <div class="modal-header-modern">
          <div class="modal-title-section">
            <div class="modal-icon">✨</div>
            <div class="modal-title-info">
              <h3 class="modal-title">Nova Meta</h3>
              <p class="modal-subtitle">Defina uma nova meta financeira</p>
            </div>
          </div>
          <button class="modal-close-modern" (click)="showCreateModal = false">
            <span>✕</span>
          </button>
        </div>

        <div class="modal-body-modern">
          <form class="create-goal-form" (ngSubmit)="createNewGoal()">
            <div class="form-row">
              <div class="form-group">
                <label for="goalName">Nome da Meta</label>
                <input type="text" id="goalName" [(ngModel)]="newGoal.name" name="goalName"
                       placeholder="Ex: Viagem para Europa" required class="form-input">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="goalTarget">Valor Alvo (R$)</label>
                <input type="number" id="goalTarget" [(ngModel)]="newGoal.target" name="goalTarget"
                       placeholder="10000" required class="form-input">
              </div>
              <div class="form-group">
                <label for="goalMonthly">Aporte Mensal (R$)</label>
                <input type="number" id="goalMonthly" [(ngModel)]="newGoal.monthlyTarget" name="goalMonthly"
                       placeholder="500" required class="form-input">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="goalDeadline">Data Limite</label>
                <input type="date" id="goalDeadline" [(ngModel)]="newGoal.deadline" name="goalDeadline"
                       required class="form-input">
              </div>
              <div class="form-group">
                <label for="goalPriority">Prioridade</label>
                <select id="goalPriority" [(ngModel)]="newGoal.priority" name="goalPriority" class="form-select">
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="goalIcon">Ícone</label>
                <select id="goalIcon" [(ngModel)]="newGoal.icon" name="goalIcon" class="form-select">
                  <option value="🏠">🏠 Casa</option>
                  <option value="✈️">✈️ Viagem</option>
                  <option value="🚗">🚗 Carro</option>
                  <option value="🎓">🎓 Educação</option>
                  <option value="💰">💰 Investimento</option>
                  <option value="🎯">🎯 Meta Geral</option>
                </select>
              </div>
              <div class="form-group">
                <label for="goalDescription">Descrição</label>
                <textarea id="goalDescription" [(ngModel)]="newGoal.description" name="goalDescription"
                          placeholder="Descreva sua meta..." class="form-textarea"></textarea>
              </div>
            </div>
          </form>
        </div>

        <div class="modal-actions-modern">
          <button type="button" class="btn-cancel-modern" (click)="showCreateModal = false">
            Cancelar
          </button>
          <button type="button" class="btn-confirm-modern" (click)="createNewGoal()"
                  [disabled]="!newGoal.name || !newGoal.target || !newGoal.monthlyTarget || !newGoal.deadline">
            <span class="btn-icon">✨</span>
            <span class="btn-text">Criar Meta</span>
          </button>
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
      height: 42px;
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
      color: #475569; /* Darker for better contrast */
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
      color: #475569; /* Improved contrast */
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
      color: #64748b !important;
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

    /* Enhanced Scenarios Modal */
    .scenarios-modal {
      max-width: 1000px;
      width: 95vw;
      max-height: 90vh;
      overflow-y: auto;
    }

    .header-info .modal-subtitle {
      font-size: 0.9rem;
      color: #64748b;
      margin: 0.25rem 0 0 0;
    }

    .ai-recommendation {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      margin-bottom: 1.5rem;
    }

    .ai-recommendation .ai-icon {
      font-size: 1.5rem;
      line-height: 1;
    }

    .recommendation-content h4 {
      color: #1e293b;
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
    }

    .recommendation-content p {
      color: #64748b;
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .calculator-section {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }

    .calculator-section h4 {
      margin: 0 0 1rem 0;
      color: #1e293b;
    }

    .calculator-inputs {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .input-group label {
      font-weight: 500;
      color: #374151;
      font-size: 0.9rem;
    }

    .calculator-input {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s ease;
    }

    .calculator-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .scenarios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .scenario-card {
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .scenario-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .scenario-card.selected {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      background: #f8fafc;
    }

    .scenario-card.conservative.selected {
      border-color: #f59e0b;
      background: #f8fafc;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
    }

    .scenario-card.optimistic.selected {
      border-color: #10b981;
      background: #f8fafc;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    .scenario-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .scenario-header h5 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
    }

    .scenario-icon {
      font-size: 1.5rem;
      margin-right: 0.5rem;
    }

    .probability-badge {
      background: #e2e8f0;
      color: #475569;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .conservative .probability-badge {
      background: #fef3c7;
      color: #92400e;
    }

    .base .probability-badge {
      background: #dbeafe;
      color: #1e40af;
    }

    .optimistic .probability-badge {
      background: #dcfce7;
      color: #166534;
    }

    .scenario-content {
      margin-bottom: 1rem;
    }

    .scenario-metric {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .metric-label {
      font-size: 0.9rem;
      color: #475569; /* Better contrast */
    }

    .metric-value {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.9rem;
    }

    .scenario-description {
      font-size: 0.85rem;
      color: #475569; /* Improved contrast */
      line-height: 1.4;
      margin: 0.75rem 0 0 0;
    }

    .scenario-progress {
      margin-top: 1rem;
    }

    .scenario-progress .progress-bar {
      height: 4px;
      background: #e2e8f0;
      border-radius: 2px;
      overflow: hidden;
    }

    .conservative-fill {
      background: linear-gradient(90deg, #f59e0b, #eab308);
    }

    .base-fill {
      background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    }

    .optimistic-fill {
      background: linear-gradient(90deg, #10b981, #059669);
    }

    .chart-section {
      margin-bottom: 1.5rem;
    }

    .chart-section h4 {
      margin: 0 0 1rem 0;
      color: #1e293b;
    }

    .chart-placeholder {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
      height: 200px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    .chart-bars {
      display: flex;
      align-items: flex-end;
      gap: 2rem;
      height: 100%;
    }

    /* Modern Goals Section Styles - FIXED & OPTIMIZED */
    .modern-goals-section {
      background: #ffffff;
      border-radius: 24px;
      margin-bottom: 2rem;
      overflow: hidden;
      box-shadow:
        0 20px 40px rgba(0, 0, 0, 0.08),
        0 4px 16px rgba(0, 0, 0, 0.04),
        0 0 0 1px rgba(255, 255, 255, 0.1) inset;
      position: relative;
      border: 1px solid #e2e8f0;
    }


    .modern-goals-header {
      padding: 2rem 2rem 1.5rem 2rem;
      background: #ffffff; /* Fundo branco limpo */
      border-bottom: 1px solid #e2e8f0;
      position: relative;
      z-index: 2;
    }

    .header-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
      margin-bottom: 1.5rem;
    }

    .title-wrapper {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .title-icon-wrapper {
      position: relative;
    }

    .title-icon-bg {
      width: 64px;
      height: 64px;
      background: #f8fafc;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
      position: relative;
      overflow: hidden;
    }


    .title-icon {
      font-size: 2rem;
      color: #1e293b;
      position: relative;
      z-index: 1;
    }

    .title-content h2 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 800;
      color: #1e293b;
      line-height: 1.2;
    }

    .section-subtitle {
      margin: 0;
      color: #475569; /* Better contrast */
      font-size: 1.1rem;
      font-weight: 500;
      line-height: 1.4;
    }

    .quick-stats {
      display: flex;
      gap: 2rem;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #1E3A5F 0%, #2ECC71 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: block;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
      margin-top: 0.25rem;
    }

    .header-actions {
      display: flex;
      align-items: center;
    }

    .create-goal-btn {
      background: linear-gradient(135deg, #1E3A5F 0%, #2563eb 50%, #2ECC71 100%);
      color: #ffffff;
      border: none;
      padding: 1rem 2rem;
      border-radius: 16px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow:
        0 8px 32px rgba(30, 58, 95, 0.3),
        0 0 0 1px rgba(255, 255, 255, 0.2) inset;
      position: relative;
      overflow: hidden;
      min-height: 48px;
      white-space: nowrap;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .create-goal-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
      transition: opacity 0.3s ease;
    }

    .create-goal-btn:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow:
        0 12px 48px rgba(30, 58, 95, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.3) inset;
    }

    .create-goal-btn:hover::before {
      opacity: 0.2;
    }

    .btn-icon-wrapper {
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .btn-arrow {
      font-size: 1.2rem;
      margin-left: 0.5rem;
      transition: transform 0.3s ease;
      opacity: 0.9;
    }

    .create-goal-btn:hover .btn-arrow {
      transform: translateX(4px);
      opacity: 1;
    }

    .create-goal-btn:focus {
      outline: none;
      box-shadow:
        0 8px 32px rgba(30, 58, 95, 0.3),
        0 0 0 3px rgba(30, 58, 95, 0.2);
    }

    .create-goal-btn:active {
      transform: translateY(1px);
      box-shadow:
        0 4px 16px rgba(30, 58, 95, 0.3),
        0 0 0 1px rgba(255, 255, 255, 0.2) inset;
    }

    /* Modern Goals Grid - OPTIMIZED */
    .modern-goals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
      padding: 2rem;
      align-items: start;
    }

    @media (max-width: 480px) {
      .modern-goals-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 1rem;
      }
    }

    .modern-goal-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      box-shadow:
        0 4px 20px rgba(0, 0, 0, 0.06),
        0 1px 3px rgba(0, 0, 0, 0.02);
      height: auto;
      min-height: 320px;
      display: flex;
      flex-direction: column;
    }

    .modern-goal-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #e2e8f0 0%, #2ECC71 50%, #e2e8f0 100%);
      transform: scaleX(0);
      transition: transform 0.4s ease;
    }

    .modern-goal-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
      border-color: #2ECC71;
    }

    .modern-goal-card:hover::before {
      transform: scaleX(1);
    }

    .modern-goal-card.high-priority::before {
      background: linear-gradient(90deg, #e2e8f0 0%, #ef4444 50%, #e2e8f0 100%);
    }

    .modern-goal-card.favorite::before {
      background: linear-gradient(90deg, #e2e8f0 0%, #8b5cf6 50%, #e2e8f0 100%);
    }

    .modern-goal-card.almost-complete::before {
      background: linear-gradient(90deg, #e2e8f0 0%, #f59e0b 50%, #e2e8f0 100%);
    }

    .card-bg-pattern {
      position: absolute;
      top: 0;
      right: 0;
      width: 120px;
      height: 120px;
      background: radial-gradient(circle at center, rgba(46, 204, 113, 0.05) 0%, transparent 70%);
      border-radius: 50%;
      transform: translate(40px, -40px);
    }

    .modern-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      position: relative;
      z-index: 1;
    }

    .goal-identity {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .goal-icon-container {
      position: relative;
    }

    .goal-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      box-shadow:
        0 4px 16px rgba(0, 0, 0, 0.08),
        0 0 0 1px rgba(255, 255, 255, 0.5) inset;
    }

    .priority-indicator {
      position: absolute;
      bottom: -4px;
      right: -4px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid white;
    }

    .priority-indicator.priority-high {
      background: #ef4444;
    }

    .priority-indicator.priority-medium {
      background: #f59e0b;
    }

    .priority-indicator.priority-low {
      background: #2ECC71;
    }

    .goal-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      color: #1e293b;
      line-height: 1.3;
    }

    .goal-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: #64748b;
    }

    .goal-category {
      font-weight: 500;
    }

    .goal-deadline {
      font-weight: 500;
    }

    .card-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .action-btn.favorite {
      background: none;
      border: none;
      padding: 0.5rem;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1.2rem;
    }

    .action-btn.favorite:hover {
      background: rgba(139, 92, 246, 0.1);
      transform: scale(1.1);
    }

    .action-btn.favorite.active {
      background: rgba(139, 92, 246, 0.1);
    }

    .status-indicator {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }

    .status-indicator.on-track {
      background: rgba(46, 204, 113, 0.1);
      color: #2ECC71;
    }

    .status-indicator.behind {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }

    .status-indicator.ahead {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    /* Modern Progress Section */
    .modern-progress-section {
      margin-bottom: 1.5rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .progress-ring-container {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 1rem;
    }

    .progress-ring {
      position: relative;
    }

    .progress-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }

    .progress-percentage {
      font-size: 1.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #1E3A5F 0%, #2ECC71 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: block;
    }

    .progress-label {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
    }

    .progress-stats-modern {
      flex: 1;
    }

    .stat-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.75rem;
    }

    .stat-row:last-child {
      margin-bottom: 0;
    }

    .stat-item-modern {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }

    .stat-icon {
      font-size: 1.25rem;
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 1rem;
      font-weight: 700;
      color: #1e293b;
      display: block;
    }

    .stat-label {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
    }

    /* Milestones Section */
    .milestones-section {
      margin-bottom: 1.5rem;
    }

    .milestones-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .milestones-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
    }

    .milestones-count {
      font-size: 0.75rem;
      color: #64748b;
      background: #f1f5f9;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
    }

    .milestones-track {
      position: relative;
      height: 40px;
      background: #f1f5f9;
      border-radius: 20px;
      overflow: hidden;
    }

    .milestones-progress {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background: linear-gradient(90deg, #2ECC71 0%, #22d3ee 50%, #3b82f6 100%);
      border-radius: 20px;
      transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .milestone {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
    }

    .milestone-dot {
      width: 24px;
      height: 24px;
      background: white;
      border: 3px solid #d1d5db;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      transition: all 0.3s ease;
    }

    .milestone.achieved .milestone-dot {
      border-color: #2ECC71;
      background: #2ECC71;
      color: white;
    }

    .milestone.current .milestone-dot {
      border-color: #3b82f6;
      background: white;
      color: #3b82f6;
      animation: pulse 2s infinite;
    }

    .milestone-tooltip {
      position: absolute;
      top: -35px;
      left: 50%;
      transform: translateX(-50%);
      background: #1e293b;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    .milestone:hover .milestone-tooltip {
      opacity: 1;
    }

    /* Modern Card Footer */
    .modern-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #f1f5f9;
    }

    .footer-info {
      flex: 1;
    }

    .next-milestone {
      font-size: 0.875rem;
    }

    .milestone-label {
      color: #64748b;
      font-weight: 500;
    }

    .milestone-value {
      color: #1e293b;
      font-weight: 600;
    }

    .contribute-btn {
      background: linear-gradient(135deg, #2ECC71 0%, #22d3ee 100%);
      color: #ffffff;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 16px rgba(46, 204, 113, 0.3);
      min-height: 40px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      width: auto;
      min-width: 120px;
    }

    .contribute-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(46, 204, 113, 0.4);
    }

    .contribute-btn:focus {
      outline: none;
      box-shadow:
        0 4px 16px rgba(46, 204, 113, 0.3),
        0 0 0 3px rgba(46, 204, 113, 0.2);
    }

    .contribute-btn:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(46, 204, 113, 0.3);
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #64748b;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 1rem 0;
      color: #374151;
    }

    .empty-state p {
      font-size: 1rem;
      margin: 0 0 2rem 0;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .create-first-goal-btn {
      background: linear-gradient(135deg, #1E3A5F 0%, #2ECC71 100%);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 16px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      transition: all 0.3s ease;
      box-shadow: 0 8px 32px rgba(30, 58, 95, 0.3);
    }

    .create-first-goal-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 48px rgba(30, 58, 95, 0.4);
    }

    /* Modern Modal Styles */
    .modern-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    }

    .modern-modal-content {
      background: white;
      border-radius: 24px;
      max-width: 1200px;
      width: 95vw;
      max-height: 90vh;
      overflow: hidden;
      box-shadow:
        0 25px 50px rgba(0, 0, 0, 0.25),
        0 0 0 1px rgba(255, 255, 255, 0.1) inset;
      animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes modalSlideIn {
      0% {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .modern-modal-header {
      position: relative;
      padding: 2rem;
      background: linear-gradient(135deg, #1E3A5F 0%, #2563eb 50%, #2ECC71 100%);
      color: white;
      overflow: hidden;
    }

    .modal-header-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background:
        radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    }

    .goal-header-content {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .goal-identity-modal {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .goal-icon-large {
      position: relative;
    }

    .icon-bg {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.2),
        0 0 0 1px rgba(255, 255, 255, 0.3) inset;
    }

    .priority-ring {
      position: absolute;
      bottom: -4px;
      right: -4px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
    }

    .priority-ring.priority-high {
      background: #ef4444;
    }

    .priority-ring.priority-medium {
      background: #f59e0b;
    }

    .priority-ring.priority-low {
      background: #2ECC71;
    }

    .goal-title-modal {
      font-size: 2rem;
      font-weight: 800;
      margin: 0 0 0.75rem 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .goal-meta-modal {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .goal-badges-modal {
      display: flex;
      gap: 0.75rem;
    }

    .priority-badge-large,
    .status-badge-large {
      background: rgba(255, 255, 255, 0.2);
      padding: 0.5rem 1rem;
      border-radius: 16px;
      font-size: 0.875rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .modern-modal-close {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      width: 48px;
      height: 48px;
      border-radius: 16px;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .modern-modal-close:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.05);
    }

    .close-icon {
      font-size: 1.5rem;
      font-weight: 300;
    }

    .modern-modal-body {
      max-height: calc(90vh - 200px);
      overflow-y: auto;
      padding: 2rem;
    }

    /* Progress Dashboard in Modal */
    .progress-dashboard-modal {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 20px;
      border: 1px solid #e2e8f0;
    }

    .main-progress-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .progress-ring-large {
      position: relative;
    }

    .progress-center-large {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }

    .progress-percentage-large {
      font-size: 2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #1E3A5F 0%, #2ECC71 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: block;
    }

    .progress-label-large {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 600;
      margin-top: 0.25rem;
    }

    .progress-trend {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      margin-top: 0.5rem;
      font-size: 0.75rem;
      color: #64748b;
    }

    .quick-stats-modal {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .stat-card-modal {
      background: white;
      border-radius: 16px;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
      border: 1px solid #e2e8f0;
      position: relative;
      overflow: hidden;
    }

    .stat-card-modal::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: #2ECC71;
    }

    .stat-card-modal.secondary::before {
      background: #3b82f6;
    }

    .stat-card-modal.accent::before {
      background: #8b5cf6;
    }

    .stat-card-modal.warning::before {
      background: #f59e0b;
    }

    .stat-icon-wrapper {
      width: 40px;
      height: 40px;
      background: #f1f5f9;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .stat-progress-mini {
      height: 2px;
      background: #2ECC71;
      border-radius: 1px;
      margin-top: 0.5rem;
      transition: width 0.8s ease;
    }

    /* Goal Details Section */
    .goal-details-section {
      margin-bottom: 2rem;
    }

    .details-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    }

    .card-header-small {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .card-header-small h4 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
    }

    .header-icon {
      font-size: 1.25rem;
    }

    .goal-description {
      color: #374151;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .goal-metadata {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .metadata-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }

    .metadata-label {
      font-weight: 500;
      color: #64748b;
    }

    .metadata-value {
      font-weight: 600;
      color: #1e293b;
    }

    /* Timeline Section */
    .timeline-section {
      margin-bottom: 2rem;
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .timeline-header h4 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .timeline-icon {
      font-size: 1.25rem;
    }

    .timeline-progress {
      font-size: 0.875rem;
      color: #64748b;
      background: #f1f5f9;
      padding: 0.5rem 1rem;
      border-radius: 16px;
      font-weight: 500;
    }

    .timeline-container {
      position: relative;
      background: white;
      border-radius: 16px;
      padding: 2rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    }

    .timeline-track {
      position: relative;
      height: 4px;
      background: #e2e8f0;
      border-radius: 2px;
      margin-bottom: 2rem;
    }

    .timeline-progress-line {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background: linear-gradient(90deg, #2ECC71 0%, #22d3ee 50%, #3b82f6 100%);
      border-radius: 2px;
      transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .timeline-milestones {
      position: relative;
    }

    .timeline-milestone {
      position: absolute;
      top: -2rem;
      transform: translateX(-50%);
    }

    .milestone-marker {
      position: relative;
      margin-bottom: 1rem;
    }

    .milestone-dot {
      width: 32px;
      height: 32px;
      background: white;
      border: 4px solid #d1d5db;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      transition: all 0.3s ease;
      position: relative;
      z-index: 1;
    }

    .timeline-milestone.achieved .milestone-dot {
      border-color: #2ECC71;
      background: #2ECC71;
      color: white;
    }

    .timeline-milestone.current .milestone-dot {
      border-color: #3b82f6;
      background: white;
      color: #3b82f6;
      animation: pulse 2s infinite;
    }

    .milestone-glow {
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      background: radial-gradient(circle, rgba(46, 204, 113, 0.4) 0%, transparent 70%);
      border-radius: 50%;
      animation: glow 2s infinite alternate;
    }

    @keyframes glow {
      0% { opacity: 0.5; transform: scale(1); }
      100% { opacity: 1; transform: scale(1.1); }
    }

    .milestone-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1rem;
      min-width: 200px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
    }

    .milestone-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    }

    .milestone-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .milestone-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .milestone-percentage {
      font-size: 0.8rem;
      font-weight: 600;
      color: #64748b;
      background: #f1f5f9;
      padding: 0.25rem 0.5rem;
      border-radius: 8px;
    }

    .milestone-description {
      font-size: 0.8rem;
      color: #64748b;
      margin: 0 0 0.5rem 0;
      line-height: 1.4;
    }

    .milestone-value {
      font-size: 0.875rem;
      font-weight: 600;
      color: #2ECC71;
      margin-bottom: 0.5rem;
    }

    .milestone-status {
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.25rem 0.5rem;
      border-radius: 8px;
      text-align: center;
    }

    .milestone-status.achieved {
      background: #d1fae5;
      color: #065f46;
    }

    .milestone-status.current {
      background: #dbeafe;
      color: #1e40af;
    }

    .milestone-status.future {
      background: #f1f5f9;
      color: #64748b;
    }

    /* AI Insights Section */
    .ai-insights-section {
      margin-bottom: 2rem;
    }

    .insights-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .insights-header h4 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .insights-icon {
      font-size: 1.25rem;
    }

    .insights-badge {
      background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .insights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }

    .insight-card-modern {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
    }

    .insight-card-modern:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    }

    .insight-card-modern.optimization {
      border-left: 4px solid #3b82f6;
    }

    .insight-card-modern.warning {
      border-left: 4px solid #f59e0b;
    }

    .insight-card-modern.opportunity {
      border-left: 4px solid #2ECC71;
    }

    .insight-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .insight-icon-bg {
      width: 40px;
      height: 40px;
      background: #f1f5f9;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .insight-content {
      flex: 1;
    }

    .insight-title {
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.25rem 0;
    }

    .insight-type-badge {
      font-size: 0.75rem;
      color: #64748b;
      background: #f1f5f9;
      padding: 0.25rem 0.5rem;
      border-radius: 8px;
      font-weight: 500;
    }

    .insight-description {
      color: #374151;
      line-height: 1.5;
      margin-bottom: 1rem;
    }

    .insight-impact {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }

    .impact-label {
      color: #64748b;
      font-weight: 500;
    }

    .impact-value {
      color: #2ECC71;
      font-weight: 600;
    }

    .insight-action-btn {
      background: linear-gradient(135deg, #1E3A5F 0%, #2563eb 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      width: 100%;
      justify-content: center;
    }

    .insight-action-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(30, 58, 95, 0.3);
    }

    /* Modern Modal Actions */
    .modern-modal-actions {
      display: flex;
      gap: 1rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
      justify-content: flex-end;
    }

    .action-btn-modal {
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      transition: all 0.3s ease;
    }

    .action-btn-modal.secondary {
      background: #f1f5f9;
      color: #374151;
      border: 1px solid #e2e8f0;
    }

    .action-btn-modal.secondary:hover {
      background: #e2e8f0;
      transform: translateY(-1px);
    }

    .action-btn-modal.primary {
      background: linear-gradient(135deg, #2ECC71 0%, #22d3ee 100%);
      color: white;
      box-shadow: 0 4px 16px rgba(46, 204, 113, 0.3);
    }

    .action-btn-modal.primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(46, 204, 113, 0.4);
    }

    .action-btn-modal .btn-icon-wrapper {
      width: 24px;
      height: 24px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
    }

    .action-btn-modal.secondary .btn-icon-wrapper {
      background: rgba(55, 65, 81, 0.1);
    }

    .action-btn-modal .btn-arrow {
      font-size: 1rem;
      transition: transform 0.3s ease;
    }

    .action-btn-modal.primary:hover .btn-arrow {
      transform: translateX(2px);
    }

    /* COMPREHENSIVE RESPONSIVE DESIGN */

    /* Tablet Portrait */
    @media (max-width: 768px) {
      .modern-goals-section {
        margin-bottom: 1.5rem;
        border-radius: 16px;
      }

      .modern-goals-header {
        padding: 1.5rem;
      }

      .header-main {
        flex-direction: column;
        align-items: stretch;
        gap: 1.5rem;
        margin-bottom: 1rem;
      }

      .title-wrapper {
        justify-content: center;
        text-align: center;
      }

      .title-content h2 {
        font-size: 1.75rem;
      }

      .quick-stats {
        justify-content: space-around;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .stat-item {
        min-width: 100px;
      }

      .create-goal-btn {
        width: 100%;
        justify-content: center;
        padding: 1rem 1.5rem;
      }

      .modern-goals-grid {
        grid-template-columns: 1fr;
        padding: 1.5rem;
        gap: 1.25rem;
      }

      .modern-goal-card {
        min-height: 280px;
      }

      .progress-ring-container {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }

      .stat-row {
        flex-direction: column;
        gap: 0.5rem;
      }
    }

    /* Mobile Portrait */
    @media (max-width: 480px) {
      .modern-goals-header {
        padding: 1rem;
      }

      .title-content h2 {
        font-size: 1.5rem;
      }

      .section-subtitle {
        font-size: 1rem;
      }

      .quick-stats {
        flex-direction: column;
        gap: 0.75rem;
      }

      .stat-item {
        padding: 0.75rem;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.5);
        text-align: center;
      }

      .stat-number {
        font-size: 1.25rem;
      }

      .create-goal-btn {
        padding: 0.875rem 1.25rem;
        font-size: 0.9rem;
        border-radius: 12px;
      }

      .modern-goals-grid {
        padding: 1rem;
        gap: 1rem;
      }

      .modern-goal-card {
        padding: 1.25rem;
        border-radius: 16px;
        min-height: auto;
      }

      .goal-icon {
        width: 48px;
        height: 48px;
        font-size: 1.25rem;
      }

      .goal-title {
        font-size: 1.1rem;
      }

      .stat-item-modern {
        padding: 0.75rem;
        gap: 0.5rem;
      }

      .stat-value {
        font-size: 0.9rem;
      }

      .contribute-btn {
        padding: 0.675rem 1.25rem;
        font-size: 0.8rem;
        min-width: 100px;
      }

      .milestones-track {
        height: 32px;
      }

      .milestone-dot {
        width: 20px;
        height: 20px;
        font-size: 0.7rem;
      }

      .milestone-tooltip {
        font-size: 0.7rem;
        top: -30px;
      }
    }

    /* Modal Responsive */
    @media (max-width: 768px) {
      .progress-dashboard-modal {
        flex-direction: column;
        gap: 1.5rem;
        padding: 1.25rem;
      }

      .quick-stats-modal {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }

      .goal-identity-modal {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }

      .modern-modal-actions {
        flex-direction: column;
        gap: 0.75rem;
      }

      .action-btn-modal {
        justify-content: center;
        padding: 0.875rem 1.5rem;
      }

      .timeline-container {
        padding: 1.5rem;
      }

      .insights-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Extra Small Mobile */
    @media (max-width: 360px) {
      .modern-goals-header {
        padding: 0.75rem;
      }

      .title-content h2 {
        font-size: 1.375rem;
      }

      .modern-goal-card {
        padding: 1rem;
      }

      .contribute-btn {
        padding: 0.625rem 1rem;
        font-size: 0.75rem;
        min-width: 90px;
      }

      .create-goal-btn {
        padding: 0.75rem 1rem;
        font-size: 0.85rem;
      }
    }

    /* Touch-friendly optimizations for all mobile devices */
    @media (hover: none) and (pointer: coarse) {
      .modern-goal-card {
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }

      .modern-goal-card:active {
        transform: scale(0.98);
        transition: transform 0.1s ease;
      }

      .contribute-btn,
      .create-goal-btn,
      .action-btn-modal {
        min-height: 44px; /* iOS recommended touch target */
        min-width: 44px;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }

      .contribute-btn:active,
      .create-goal-btn:active,
      .action-btn-modal:active {
        transform: scale(0.95);
        transition: transform 0.1s ease;
      }

      .goal-menu .menu-trigger {
        min-height: 44px;
        min-width: 44px;
        padding: 0.75rem;
      }

      .milestone-dot {
        min-height: 32px;
        min-width: 32px;
        touch-action: manipulation;
      }

      /* Improve text selection on mobile */
      .goal-title,
      .goal-description,
      .section-subtitle {
        -webkit-user-select: text;
        user-select: text;
      }

      /* Prevent zoom on input focus */
      .calculator-input {
        font-size: 16px; /* Prevents zoom on iOS */
      }
    }

    /* Sempre manter fundo branco - dark mode removido */

    .chart-bar {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      min-width: 60px;
    }

    .bar-fill {
      width: 40px;
      background: linear-gradient(180deg, #3b82f6, #1d4ed8);
      border-radius: 4px 4px 0 0;
      transition: height 0.3s ease;
    }

    .conservative-bar .bar-fill {
      background: linear-gradient(180deg, #f59e0b, #eab308);
    }

    .optimistic-bar .bar-fill {
      background: linear-gradient(180deg, #10b981, #059669);
    }

    .bar-label {
      font-size: 0.8rem;
      color: #64748b;
      margin-top: 0.5rem;
      text-align: center;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    /* Responsive Scenarios Modal */
    @media (max-width: 768px) {
      .scenarios-modal {
        width: 98vw;
        max-height: 95vh;
      }

      .scenarios-grid {
        grid-template-columns: 1fr;
      }

      .calculator-inputs {
        grid-template-columns: 1fr;
      }

      .chart-bars {
        gap: 1rem;
      }

      .modal-actions {
        flex-direction: column;
      }
    }

    /* Clean Minimalist Goal Cards */
    .goal-content-clean {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      height: 100%;
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 12px;
      background: #ffffff;
      position: relative;
      overflow: hidden;
    }

    .goal-content-clean:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .goal-content-clean::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #3b82f6, #1d4ed8);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .goal-content-clean:hover::before {
      opacity: 1;
    }

    .goal-header-clean {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .goal-icon-large {
      font-size: 2.5rem;
      line-height: 1;
      flex-shrink: 0;
    }

    .goal-info {
      flex: 1;
      min-width: 0;
    }

    .goal-title-clean {
      margin: 0 0 0.5rem 0;
      font-size: 1.2rem;
      font-weight: 600;
      color: #1e293b;
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .goal-meta-clean {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .goal-amount {
      font-size: 0.9rem;
      font-weight: 500;
      color: #3b82f6;
    }

    .goal-deadline {
      font-size: 0.8rem;
      color: #64748b;
    }

    .goal-progress-mini {
      flex-shrink: 0;
    }

    .progress-circle-mini {
      position: relative;
      width: 48px;
      height: 48px;
    }

    .progress-percent-mini {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 0.7rem;
      font-weight: 600;
      color: #1e293b;
    }

    .progress-bar-clean {
      position: relative;
      height: 6px;
      background: #f1f5f9;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 1rem;
    }

    .progress-fill-clean {
      height: 100%;
      border-radius: 3px;
      transition: all 0.5s ease;
      position: relative;
    }

    .progress-start {
      background: linear-gradient(90deg, #ef4444, #dc2626);
    }

    .progress-fair {
      background: linear-gradient(90deg, #f59e0b, #eab308);
    }

    .progress-good {
      background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    }

    .progress-excellent {
      background: linear-gradient(90deg, #10b981, #059669);
    }

    .checkpoints-mini {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
    }

    .checkpoint-mini {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 8px;
      height: 8px;
      background: #94a3b8;
      border-radius: 50%;
      border: 2px solid #ffffff;
    }

    .checkpoint-mini.achieved {
      background: #10b981;
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
    }

    .quick-actions-clean {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    .quick-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 1rem;
      background: #f1f5f9;
      color: #64748b;
    }

    .quick-btn:hover {
      background: #e2e8f0;
      transform: scale(1.1);
    }

    .quick-btn.contribute {
      background: #3b82f6;
      color: white;
    }

    .quick-btn.contribute:hover {
      background: #1d4ed8;
    }

    .quick-btn.favorite.active {
      background: #fef3c7;
      color: #d97706;
    }

    .quick-btn.favorite.active:hover {
      background: #fde68a;
    }

    /* Elegant Goal Details Modal */
    .goal-details-modal {
      max-width: 800px;
      width: 90vw;
      max-height: 90vh;
      overflow-y: auto;
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    }

    .modal-header.elegant {
      padding: 2rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-bottom: 1px solid #e2e8f0;
      border-radius: 20px 20px 0 0;
    }

    .goal-header-modal {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .goal-icon-modal {
      font-size: 3rem;
      line-height: 1;
    }

    .goal-title-section {
      flex: 1;
    }

    .goal-title-modal {
      margin: 0 0 0.75rem 0;
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
      line-height: 1.2;
    }

    .goal-badges-modal {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .priority-badge-modal {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
      background: #f1f5f9;
      color: #475569;
    }

    .priority-badge-modal.priority-high {
      background: #fef2f2;
      color: #991b1b;
    }

    .priority-badge-modal.priority-medium {
      background: #fffbeb;
      color: #92400e;
    }

    .priority-badge-modal.priority-low {
      background: #f0fdf4;
      color: #166534;
    }

    .status-badge-modal {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .status-badge-modal.status-excellent {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge-modal.status-great {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-badge-modal.status-ontrack {
      background: #dcfce7;
      color: #166534;
    }

    .status-badge-modal.status-ahead {
      background: #e0f2fe;
      color: #0c4a6e;
    }

    .status-badge-modal.status-warning {
      background: #fef2f2;
      color: #991b1b;
    }

    .modal-close.elegant {
      background: rgba(0, 0, 0, 0.05);
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .modal-close.elegant:hover {
      background: rgba(0, 0, 0, 0.1);
      transform: scale(1.1);
    }

    .modal-body.elegant {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .progress-overview-modal {
      display: flex;
      align-items: center;
      gap: 2rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 16px;
      border: 1px solid #e2e8f0;
    }

    .progress-circle-large {
      position: relative;
      flex-shrink: 0;
    }

    .progress-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }

    .progress-percent-large {
      display: block;
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
    }

    .progress-label-large {
      display: block;
      font-size: 0.9rem;
      color: #64748b;
      margin-top: 0.25rem;
    }

    .progress-stats-modal {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      flex: 1;
    }

    .stat-modal {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 1rem;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }

    .stat-modal.primary {
      border-color: #3b82f6;
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    }

    .stat-modal.secondary {
      border-color: #10b981;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    }

    .stat-modal.accent {
      border-color: #f59e0b;
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    }

    .stat-modal .stat-value {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
    }

    .stat-modal .stat-label {
      font-size: 0.85rem;
      color: #64748b;
    }

    .description-modal h4,
    .checkpoints-modal h4,
    .recommendations-modal h4 {
      margin: 0 0 1rem 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .description-modal p {
      margin: 0;
      color: #475569;
      line-height: 1.6;
    }

    .timeline-modal {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .checkpoint-item-modal {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 12px;
      border: 2px solid transparent;
      transition: all 0.2s ease;
    }

    .checkpoint-item-modal.achieved {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border-color: #10b981;
    }

    .checkpoint-item-modal.current {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border-color: #3b82f6;
      animation: pulse 2s infinite;
    }

    .checkpoint-marker-modal {
      flex-shrink: 0;
    }

    .checkpoint-dot-modal {
      width: 40px;
      height: 40px;
      background: #94a3b8;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      color: white;
    }

    .checkpoint-item-modal.achieved .checkpoint-dot-modal {
      background: #10b981;
    }

    .checkpoint-item-modal.current .checkpoint-dot-modal {
      background: #3b82f6;
    }

    .checkpoint-content-modal h5 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
    }

    .checkpoint-content-modal p {
      margin: 0;
      font-size: 0.9rem;
      color: #64748b;
    }

    .recommendations-grid-modal {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .recommendation-card-modal {
      padding: 1.5rem;
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      transition: all 0.2s ease;
    }

    .recommendation-card-modal:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .recommendation-card-modal.optimization {
      border-color: #3b82f6;
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    }

    .recommendation-card-modal.warning {
      border-color: #ef4444;
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    }

    .recommendation-card-modal.suggestion {
      border-color: #10b981;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    }

    .recommendation-card-modal.template {
      border-color: #8b5cf6;
      background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
    }

    .rec-header-modal {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .rec-icon-modal {
      font-size: 1.5rem;
      line-height: 1;
    }

    .rec-header-modal h5 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
    }

    .recommendation-card-modal p {
      margin: 0 0 1rem 0;
      font-size: 0.9rem;
      color: #64748b;
      line-height: 1.5;
    }

    .rec-btn-modal {
      padding: 0.75rem 1.5rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
    }

    .rec-btn-modal:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }

    .modal-actions.elegant {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
    }

    .btn-modal {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-modal.primary {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
    }

    .btn-modal.primary:hover {
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      transform: translateY(-2px);
    }

    .btn-modal.secondary {
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #e2e8f0;
    }

    .btn-modal.secondary:hover {
      background: #e2e8f0;
      transform: translateY(-1px);
    }

    /* Responsive Modal */
    @media (max-width: 768px) {
      .goal-details-modal {
        width: 95vw;
        max-height: 95vh;
        border-radius: 16px;
      }

      .modal-header.elegant {
        padding: 1.5rem;
      }

      .goal-title-modal {
        font-size: 1.5rem;
      }

      .goal-icon-modal {
        font-size: 2.5rem;
      }

      .progress-overview-modal {
        flex-direction: column;
        text-align: center;
        gap: 1.5rem;
      }

      .progress-stats-modal {
        width: 100%;
      }

      .recommendations-grid-modal {
        grid-template-columns: 1fr;
      }

      .modal-actions.elegant {
        flex-direction: column;
      }
    }

    .goal-progress-circle {
      position: relative;
      width: 60px;
      height: 60px;
    }

    .progress-ring {
      width: 60px;
      height: 60px;
      transform: rotate(-90deg);
    }

    .progress-ring-bg {
      fill: none;
      stroke: #e2e8f0;
      stroke-width: 3;
    }

    .progress-ring-fill {
      fill: none;
      stroke: #3b82f6;
      stroke-width: 3;
      stroke-linecap: round;
      stroke-dasharray: 157;
      transition: stroke-dashoffset 0.5s ease;
    }

    .progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 0.8rem;
      font-weight: 600;
      color: #1e293b;
    }

    .goal-description-section {
      padding: 0 1.5rem;
    }

    .goal-description-modern {
      margin: 0 0 1rem 0;
      color: #64748b;
      line-height: 1.5;
      font-size: 0.9rem;
    }

    .ai-recommendation-inline {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 0.75rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }

    .ai-icon-small {
      font-size: 1rem;
      line-height: 1;
    }

    .ai-text {
      font-size: 0.85rem;
      color: #0c4a6e;
      line-height: 1.4;
    }

    .progress-section-modern {
      padding: 0 1.5rem;
    }

    .progress-metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .metric-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      transition: all 0.2s ease;
    }

    .metric-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transform: translateY(-1px);
    }

    .metric-card.primary {
      border-color: #3b82f6;
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    }

    .metric-card.secondary {
      border-color: #10b981;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    }

    .metric-card.accent {
      border-color: #f59e0b;
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    }

    .metric-icon {
      font-size: 1.5rem;
      line-height: 1;
    }

    .metric-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .metric-value {
      font-size: 0.9rem;
      font-weight: 600;
      color: #1e293b;
    }

    .metric-label {
      font-size: 0.75rem;
      color: #64748b;
    }

    .progress-container-modern {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .progress-header-modern {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .progress-label {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.9rem;
    }

    .progress-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: #f1f5f9;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 1rem;
    }

    .btn-icon:hover {
      background: #e2e8f0;
      transform: scale(1.05);
    }

    .progress-track-modern {
      position: relative;
      height: 12px;
      background: #f1f5f9;
      border-radius: 6px;
      overflow: hidden;
    }

    .progress-fill-modern {
      height: 100%;
      border-radius: 6px;
      position: relative;
      transition: all 0.5s ease;
      overflow: hidden;
    }

    .progress-start {
      background: linear-gradient(90deg, #ef4444, #dc2626);
    }

    .progress-fair {
      background: linear-gradient(90deg, #f59e0b, #eab308);
    }

    .progress-good {
      background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    }

    .progress-excellent {
      background: linear-gradient(90deg, #10b981, #059669);
    }

    .progress-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      animation: shine 2s infinite;
    }

    @keyframes shine {
      0% { left: -100%; }
      100% { left: 100%; }
    }

    .checkpoint-markers-modern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
    }

    .checkpoint-modern {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .checkpoint-dot {
      width: 20px;
      height: 20px;
      background: #ffffff;
      border: 2px solid #94a3b8;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      transition: all 0.3s ease;
      z-index: 2;
    }

    .checkpoint-modern.achieved .checkpoint-dot {
      border-color: #10b981;
      background: #10b981;
      color: white;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
    }

    .checkpoint-modern.current .checkpoint-dot {
      border-color: #3b82f6;
      background: #3b82f6;
      color: white;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
      animation: pulse 2s infinite;
    }

    .checkpoint-label {
      font-size: 0.7rem;
      color: #64748b;
      font-weight: 500;
      background: #ffffff;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
      white-space: nowrap;
    }

    .progress-footer-modern {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .progress-amount-modern {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.9rem;
    }

    .progress-remaining {
      font-size: 0.8rem;
      color: #64748b;
    }

    .smart-management-section {
      padding: 0 1.5rem;
    }

    .section-title {
      margin: 0 0 1rem 0;
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .smart-recommendations {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .recommendation-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .recommendation-item:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }

    .recommendation-item.optimization {
      border-color: #3b82f6;
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    }

    .recommendation-item.warning {
      border-color: #ef4444;
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    }

    .recommendation-item.suggestion {
      border-color: #10b981;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    }

    .recommendation-item.template {
      border-color: #8b5cf6;
      background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
    }

    .rec-icon {
      font-size: 1.2rem;
      line-height: 1;
    }

    .rec-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .rec-title {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.9rem;
    }

    .rec-description {
      font-size: 0.8rem;
      color: #64748b;
      line-height: 1.3;
    }

    .rec-action {
      padding: 0.5rem 1rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .rec-action:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }

    .goal-actions-modern {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.5rem;
      border-top: 1px solid #e2e8f0;
      background: #f8fafc;
      margin-top: auto;
    }

    .primary-actions {
      display: flex;
      gap: 0.75rem;
    }

    .action-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .action-btn.primary {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
    }

    .action-btn.primary:hover {
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      transform: translateY(-2px);
    }

    .action-btn.secondary {
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #e2e8f0;
    }

    .action-btn.secondary:hover {
      background: #e2e8f0;
      transform: translateY(-1px);
    }

    .btn-icon, .btn-text {
      font-size: 0.9rem;
    }

    .secondary-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    .action-btn-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: none;
      background: #f1f5f9;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 1.1rem;
    }

    .action-btn-icon:hover {
      background: #e2e8f0;
      transform: scale(1.05);
    }

    .action-btn-icon.favorited {
      background: #fef3c7;
      color: #d97706;
    }

    /* Premium Fintech Controls & Filters */
    .premium-controls-section {
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }

    .controls-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }

    .section-title-premium {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
    }

    .title-icon {
      font-size: 1.75rem;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .results-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .count-badge {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .count-label {
      color: #64748b;
      font-size: 0.9rem;
    }

    .view-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .view-toggle-premium {
      display: flex;
      background: #f1f5f9;
      border-radius: 12px;
      padding: 0.25rem;
      border: 1px solid #e2e8f0;
    }

    .view-btn-premium {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: none;
      background: transparent;
      color: #64748b;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .view-btn-premium.active {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
    }

    .filters-container-premium {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .quick-filters {
      background: #f8fafc;
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
    }

    .filter-section-title {
      margin: 0 0 1rem 0;
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
    }

    .quick-filter-chips {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .filter-chip {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
      font-weight: 500;
      color: #475569;
    }

    .filter-chip:hover {
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .filter-chip.active {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border-color: #3b82f6;
      color: white;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .chip-icon {
      font-size: 1rem;
    }

    .chip-count {
      background: rgba(255, 255, 255, 0.2);
      padding: 0.2rem 0.5rem;
      border-radius: 10px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .filter-chip.active .chip-count {
      background: rgba(255, 255, 255, 0.3);
    }

    .advanced-filters {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
    }

    .filter-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      align-items: end;
    }

    .filter-group-premium {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-label-premium {
      font-weight: 600;
      color: #374151;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .custom-select {
      position: relative;
    }

    .select-premium {
      width: 100%;
      padding: 0.75rem 2.5rem 0.75rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      background: #ffffff;
      font-size: 0.9rem;
      color: #1e293b;
      appearance: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .select-premium:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .select-arrow {
      position: absolute;
      top: 50%;
      right: 1rem;
      transform: translateY(-50%);
      color: #64748b;
      pointer-events: none;
    }

    .filter-actions {
      display: flex;
      gap: 0.75rem;
    }

    .btn-clear-premium, .btn-save-filter {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      background: #ffffff;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .btn-clear-premium:hover {
      border-color: #ef4444;
      color: #ef4444;
      background: #fef2f2;
    }

    .btn-save-filter:hover {
      border-color: #10b981;
      color: #10b981;
      background: #f0fdf4;
    }

    /* Premium Goals Section */
    .premium-goals-section {
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }

    .goals-header-premium {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }

    .header-content-premium {
      flex: 1;
    }

    .goals-title-premium {
      margin: 0 0 1rem 0;
      font-size: 1.75rem;
      font-weight: 700;
    }

    .title-gradient {
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .goals-summary {
      display: flex;
      gap: 2rem;
    }

    .summary-stat {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #64748b;
    }

    .header-actions-premium {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: flex-end;
    }

    .sort-controls {
      display: flex;
      gap: 0.75rem;
    }

    .sort-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: #f1f5f9;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .sort-btn.active, .sort-btn:hover {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border-color: #3b82f6;
      color: white;
    }

    .bulk-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border: 1px solid #bfdbfe;
      border-radius: 10px;
    }

    .selection-count {
      color: #1e40af;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .bulk-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .bulk-btn:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }

    /* Premium Achievement System */
    .premium-achievements-section {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }

    .achievement-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }

    .achievement-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 0 0 0.5rem 0;
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
    }

    .title-icon-premium {
      font-size: 2rem;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .achievement-subtitle {
      color: #64748b;
      font-size: 1rem;
      margin-top: 0.5rem;
    }

    .user-level-card {
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border: 2px solid #e2e8f0;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
    }

    .level-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .level-avatar {
      position: relative;
    }

    .avatar-ring {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .level-number {
      color: white;
      font-size: 1.5rem;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .level-details {
      flex: 1;
    }

    .level-title {
      margin: 0 0 0.25rem 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
    }

    .level-subtitle {
      color: #64748b;
      font-size: 0.9rem;
      margin-bottom: 0.75rem;
    }

    .xp-progress {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .xp-bar {
      flex: 1;
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      overflow: hidden;
    }

    .xp-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #1d4ed8);
      transition: width 0.5s ease;
    }

    .xp-text {
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 500;
    }

    .achievement-stats-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card-premium {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .stat-card-premium:hover {
      border-color: #3b82f6;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .stat-icon-premium {
      font-size: 2rem;
      line-height: 1;
    }

    .stat-content-premium {
      flex: 1;
    }

    .stat-value-premium {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
    }

    .stat-label-premium {
      display: block;
      font-size: 0.85rem;
      color: #64748b;
      margin-top: 0.25rem;
      margin-bottom: 0.5rem;
    }

    .stat-progress-premium {
      height: 3px;
      background: #e2e8f0;
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-mini {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #059669);
      transition: width 0.5s ease;
    }

    .stat-arrow {
      font-size: 1.2rem;
      color: #94a3b8;
      transition: transform 0.2s ease;
    }

    .stat-card-premium:hover .stat-arrow {
      transform: translateX(2px);
    }

    .featured-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }

    .section-header-mini {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .section-header-mini h4 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .view-all-btn {
      padding: 0.5rem 1rem;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.85rem;
    }

    .view-all-btn:hover {
      background: #e2e8f0;
      color: #1e293b;
    }

    .badges-showcase {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 1rem;
    }

    .badge-showcase-item {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .badge-showcase-item.unlocked {
      border-color: #10b981;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    }

    .badge-showcase-item.almost-unlocked {
      border-color: #f59e0b;
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    }

    .badge-showcase-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .badge-image {
      position: relative;
      display: flex;
      justify-content: center;
      margin-bottom: 0.75rem;
    }

    .badge-icon-large {
      font-size: 2.5rem;
      line-height: 1;
    }

    .badge-glow {
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.3), transparent);
      border-radius: 50%;
      animation: glow 2s infinite alternate;
    }

    .badge-rarity {
      position: absolute;
      top: -5px;
      right: -5px;
      padding: 0.2rem 0.4rem;
      background: #64748b;
      color: white;
      border-radius: 6px;
      font-size: 0.7rem;
      font-weight: 600;
    }

    .badge-rarity.rare {
      background: #3b82f6;
    }

    .badge-rarity.epic {
      background: #8b5cf6;
    }

    .badge-rarity.legendary {
      background: #f59e0b;
    }

    .badge-details {
      text-align: center;
    }

    .badge-name {
      margin: 0 0 0.5rem 0;
      font-size: 0.9rem;
      font-weight: 600;
      color: #1e293b;
    }

    .badge-desc {
      margin: 0 0 0.75rem 0;
      font-size: 0.8rem;
      color: #64748b;
      line-height: 1.3;
    }

    .badge-progress-container {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .progress-bar-mini {
      height: 4px;
      background: #e2e8f0;
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-fill-mini {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #1d4ed8);
      transition: width 0.5s ease;
    }

    .progress-text-mini {
      font-size: 0.75rem;
      color: #64748b;
    }

    .badge-unlocked {
      color: #10b981;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .missions-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .mission-item-premium {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .mission-item-premium:hover {
      border-color: #3b82f6;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .mission-icon-container {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .mission-icon {
      font-size: 1.5rem;
      line-height: 1;
    }

    .mission-type-badge {
      padding: 0.2rem 0.5rem;
      background: #e2e8f0;
      color: #64748b;
      border-radius: 6px;
      font-size: 0.65rem;
      font-weight: 600;
    }

    .mission-type-badge.daily {
      background: #dbeafe;
      color: #1e40af;
    }

    .mission-type-badge.weekly {
      background: #dcfce7;
      color: #166534;
    }

    .mission-type-badge.monthly {
      background: #fef3c7;
      color: #92400e;
    }

    .mission-type-badge.special {
      background: #ede9fe;
      color: #6b46c1;
    }

    .mission-content {
      flex: 1;
    }

    .mission-name {
      margin: 0 0 0.25rem 0;
      font-size: 0.95rem;
      font-weight: 600;
      color: #1e293b;
    }

    .mission-description {
      margin: 0 0 0.75rem 0;
      font-size: 0.8rem;
      color: #64748b;
      line-height: 1.3;
    }

    .mission-progress-premium {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .progress-info {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: #1e293b;
    }

    .progress-separator {
      color: #94a3b8;
    }

    .progress-bar-premium {
      flex: 1;
      height: 4px;
      background: #e2e8f0;
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-fill-premium {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #059669);
      transition: width 0.5s ease;
    }

    .mission-reward {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    flex-direction: row;
    }

    .xp-reward {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.5rem;
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border: 1px solid #f59e0b;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      color: #92400e;
    }

    .mission-arrow {
      font-size: 1.2rem;
      color: #94a3b8;
      transition: transform 0.2s ease;
    }

    .mission-item-premium:hover .mission-arrow {
      transform: translateX(2px);
    }

    .missions-count {
      background: #e2e8f0;
      color: #64748b;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    /* Responsive Premium Design */
    @media (max-width: 768px) {
      .premium-controls-section,
      .premium-goals-section,
      .premium-achievements-section {
        padding: 1.5rem;
      }

      .controls-header,
      .goals-header-premium,
      .achievement-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .section-title-premium,
      .goals-title-premium,
      .achievement-title {
        font-size: 1.5rem;
      }

      .filter-row {
        grid-template-columns: 1fr;
      }

      .quick-filter-chips {
        gap: 0.5rem;
      }

      .filter-chip {
        padding: 0.5rem 0.75rem;
        font-size: 0.8rem;
      }

      .goals-summary {
        flex-direction: column;
        gap: 1rem;
      }

      .achievement-stats-overview {
        grid-template-columns: 1fr;
      }

      .featured-content {
        grid-template-columns: 1fr;
      }

      .badges-showcase {
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      }

      .user-level-card {
        padding: 1rem;
      }

      .level-info {
        gap: 0.75rem;
      }

      .avatar-ring {
        width: 50px;
        height: 50px;
      }

      .level-number {
        font-size: 1.2rem;
      }

      .goal-content-clean {
        padding: 1.25rem;
      }
    }

    /* ===== PREMIUM FINTECH STYLES ===== */

    /* Premium Page Header */
    .premium-page-header {
      position: relative;
      margin-bottom: 2rem;
      overflow: hidden;
      border-radius: 20px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      min-height: 200px;
      display: flex;
      align-items: center;
    }

    .header-background {
      display: none;
    }

    .gradient-overlay {
      display: none;
    }

    .geometric-pattern {
      display: none;
    }

    .header-content-wrapper {
      position: relative;
      z-index: 2;
      width: 100%;      margin: 0 auto;
      padding: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .header-main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .title-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .premium-page-header .title-icon {
      font-size: 3rem;
      color: #1e293b;
    }

    .title-text {
      flex: 1;
    }

    .premium-page-header .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    .premium-page-header .page-subtitle {
      font-size: 1.1rem;
      color: #64748b;
      margin: 0.5rem 0 0 0;
    }

    .header-stats {
      display: flex;
      gap: 1.5rem;
    }

    .stat-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-width: 140px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .stat-card:hover {
      background: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      font-size: 1.5rem;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .stat-number {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
    }

    .stat-label {
      font-size: 0.75rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .premium-action-btn {
      padding: 0.875rem 1.5rem;
      border-radius: 12px;
      border: none;
      font-weight: 600;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      min-width: 140px;
      justify-content: center;
    }

    .premium-action-btn.primary {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
    }

    .premium-action-btn.primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
    }

    .premium-action-btn.secondary {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .premium-action-btn.secondary:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
    }

    /* Premium Goals Section */
    .premium-goals-section {
      background: #ffffff;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .premium-goals-header {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      padding: 2rem;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .premium-goals-header .header-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .premium-goals-header .title-section {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .premium-goals-header .section-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0;
      color: #1e293b;
    }

    .title-gradient {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .premium-goals-header .section-subtitle {
      font-size: 1rem;
      color: #64748b;
      margin: 0;
    }

    .goals-overview {
      display: flex;
      gap: 2rem;
    }

    .overview-stat {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .overview-stat .stat-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
    }

    .overview-stat .stat-label {
      font-size: 0.8rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .premium-create-btn {
      padding: 1rem 1.5rem;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: #ffffff;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
    }

    .premium-create-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
    }

    /* Premium Goals Grid */
    .premium-goals-grid {
      padding: 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.5rem;
    }

    .premium-goal-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      position: relative;
    }

    .premium-goal-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      border-color: #c7d2fe;
    }

    .premium-goal-card.high-priority {
      border-left: 4px solid #ef4444;
    }

    .premium-goal-card.favorite {
      border-left: 4px solid #f59e0b;
    }

    .premium-goal-card.completed {
      border-left: 4px solid #10b981;
      opacity: 0.8;
    }

    /* Card Header */
    .premium-card-header {
      padding: 1.5rem 1.5rem 1rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }

    .goal-identity {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      flex: 1;
    }

    .goal-icon-premium {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .goal-info-premium {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .goal-title-premium {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
      line-height: 1.4;
    }

    .goal-badges-premium {
      display: flex;
      gap: 0.5rem;
    }

    .priority-badge-premium,
    .status-badge-premium {
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .priority-badge-premium.priority-high {
      background: #fef2f2;
      color: #dc2626;
    }

    .priority-badge-premium.priority-medium {
      background: #fef3c7;
      color: #d97706;
    }

    .priority-badge-premium.priority-low {
      background: #f0f9ff;
      color: #0284c7;
    }

    .card-actions-premium {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn-premium {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 8px;
      background: #f8fafc;
      color: #64748b;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .action-btn-premium:hover {
      background: #e2e8f0;
    }

    .action-btn-premium.favorite.active {
      background: #fef3c7;
      color: #d97706;
    }

    /* Progress Section */
    .premium-progress-section {
      padding: 0 1.5rem 1rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .progress-overview {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .progress-circle {
      position: relative;
      flex-shrink: 0;
    }

    .progress-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }

    .progress-percent {
      font-size: 0.9rem;
      font-weight: 700;
      color: #1e293b;
    }

    .progress-stats {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .stat-primary,
    .stat-secondary {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .stat-primary .stat-value {
      font-size: 1.1rem;
      font-weight: 700;
      color: #10b981;
    }

    .stat-secondary .stat-value {
      font-size: 1rem;
      font-weight: 600;
      color: #64748b;
    }

    .stat-primary .stat-label,
    .stat-secondary .stat-label {
      font-size: 0.75rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Checkpoints Mini */
    .checkpoints-mini {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
    }

    .checkpoint-mini {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .checkpoint-mini.achieved {
      background: #dcfce7;
      border-color: #10b981;
    }

    .checkpoint-mini.current {
      background: #fef3c7;
      border-color: #f59e0b;
      animation: pulse 2s infinite;
    }

    .checkpoint-dot-mini {
      font-size: 0.8rem;
    }

    /* Summary */
    .premium-summary {
      padding: 0 1.5rem;
      display: flex;
      gap: 1rem;
    }

    .summary-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex: 1;
    }

    .summary-icon {
      font-size: 0.9rem;
      opacity: 0.7;
    }

    .summary-text {
      font-size: 0.85rem;
      color: #64748b;
      font-weight: 500;
    }

    /* Card Footer */
    .premium-card-footer {
      padding: 1rem 1.5rem 1.5rem 1.5rem;
    }

    .contribute-btn-premium {
      width: 100%;
      padding: 0.75rem;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .contribute-btn-premium:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .header-content-wrapper {
        flex-direction: column;
        text-align: center;
        gap: 1.5rem;
      }

      .header-stats {
        justify-content: center;
        flex-wrap: wrap;
      }

      .header-actions {
        flex-direction: row;
        justify-content: center;
      }

      .premium-goals-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1.5rem;
      }

      .goals-overview {
        flex-wrap: wrap;
      }

      .premium-goals-grid {
        grid-template-columns: 1fr;
        padding: 1rem;
      }
    }

    /* Create Goal Modal Styles */
    .create-modal {
      max-width: 600px;
      width: 90vw;
    }

    .create-goal-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-row:first-child {
      grid-template-columns: 1fr;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }

    .form-input,
    .form-select,
    .form-textarea {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s ease;
      background: white;
    }

    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #2ECC71;
      box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .modal-actions-modern {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .btn-cancel-modern,
    .btn-confirm-modern {
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border: none;
    }

    .btn-cancel-modern {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .btn-cancel-modern:hover {
      background: #e5e7eb;
    }

    .btn-confirm-modern {
      background: linear-gradient(135deg, #2ECC71 0%, #22d3ee 100%);
      color: white;
      box-shadow: 0 4px 16px rgba(46, 204, 113, 0.3);
    }

    .btn-confirm-modern:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(46, 204, 113, 0.4);
    }

    .btn-confirm-modern:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: 0 2px 8px rgba(46, 204, 113, 0.2);
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .modal-actions-modern {
        flex-direction: column;
      }

      .create-modal {
        width: 95vw;
        margin: 1rem;
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
  showContributeModal = false;
  activeMenuId: string | null = null;
  selectedGoalForContribute: Goal | null = null;
  contributeAmount: number = 0;

  // New Goal form data
  newGoal = {
    name: '',
    target: 0,
    monthlyTarget: 0,
    deadline: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    icon: '🎯',
    description: ''
  };

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
  selectedScenario: 'conservative' | 'base' | 'optimistic' | null = null;
  simulatedMonthlyAmount: number = 0;
  simulatedExtraAmount: number = 0;

  // Goal Details Modal
  showGoalDetailsModal = false;
  selectedGoalForDetails: Goal | null = null;

  // Premium Filters & Sorting
  sortBy: string = 'progress';
  sortDirection: 'asc' | 'desc' = 'desc';
  selectedGoals: Goal[] = [];

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
  ) { }

  ngOnInit(): void {
    // Simplified initialization to prevent freeze
    this.loadBasicData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadBasicData(): void {
    // Load only essential mock data to prevent freeze
    this.goals = [
      {
        id: '1',
        name: 'Viagem para Europa',
        description: 'Viagem de 15 dias para Europa no próximo verão',
        target: 15000,
        saved: 4500,
        monthlyTarget: 800,
        deadline: '2024-06-15',
        priority: 'high',
        createdAt: '2024-01-15',
        icon: '✈️',
        origin: 'personal',
        updatedAt: '2024-01-15',
        completed: false,
        actualMonthly: 750
      },
      {
        id: '2',
        name: 'Emergência',
        description: 'Reserva de emergência de 6 meses',
        target: 24000,
        saved: 18000,
        monthlyTarget: 1000,
        deadline: '2024-12-31',
        priority: 'high',
        createdAt: '2024-01-01',
        icon: '🛡️',
        origin: 'personal',
        updatedAt: '2024-01-01',
        completed: false,
        actualMonthly: 1200
      }
    ];

    // Initialize basic stats
    this.userStats = {
      level: 3,
      xp: 1250,
      xpToNextLevel: 500,
      totalSaved: 22500,
      goalsCompleted: 2,
      totalBadges: 5,
      streakDays: 15,
      longestStreak: 30,
      rank: 'Bronze'
    };

    // Initialize empty arrays for other data
    this.aiInsights = [];
    this.activeMissions = [];
    this.completedMissions = [];
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

  createNewGoal(): void {
    if (!this.newGoal.name || !this.newGoal.target || !this.newGoal.monthlyTarget || !this.newGoal.deadline) {
      return;
    }

    const goal = {
      id: '',
      name: this.newGoal.name,
      target: this.newGoal.target,
      saved: 0,
      monthlyTarget: this.newGoal.monthlyTarget,
      deadline: this.newGoal.deadline,
      priority: this.newGoal.priority,
      icon: this.newGoal.icon,
      description: this.newGoal.description,
      completed: false,
      origin: 'personal' as const,
      createdAt: new Date()
    };

    this.dataService.addGoal(goal);
    
    // Reset form
    this.newGoal = {
      name: '',
      target: 0,
      monthlyTarget: 0,
      deadline: '',
      priority: 'medium',
      icon: '🎯',
      description: ''
    };

    // Close modal
    this.showCreateModal = false;

    // Show success notification
    this.showSuccessNotification = true;
    setTimeout(() => {
      this.showSuccessNotification = false;
    }, 3000);
    
    // Add XP for creating a new goal
    this.gamificationService.addXP(10);
  }

  deleteGoal(goalId: string): void {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
      this.dataService.deleteGoal(goalId);
      this.activeMenuId = null;
    }
  }

  openContributeModal(goal: Goal): void {
    this.selectedGoalForContribute = goal;
    this.contributeAmount = 0;
    this.showContributeModal = true;
  }

  closeContributeModal(): void {
    this.showContributeModal = false;
    this.selectedGoalForContribute = null;
    this.contributeAmount = 0;
  }

  setQuickAmount(amount: number): void {
    this.contributeAmount = amount;
  }

  getNewProgressPercentage(): number {
    if (!this.selectedGoalForContribute || !this.contributeAmount) return 0;
    const newTotal = (this.selectedGoalForContribute.saved || 0) + this.contributeAmount;
    return Math.round((newTotal / this.selectedGoalForContribute.target) * 100);
  }

  getRemainingAmount(): number {
    if (!this.selectedGoalForContribute) return 0;
    const target = this.selectedGoalForContribute.target || 0;
    const saved = this.selectedGoalForContribute.saved || 0;
    const contribution = this.contributeAmount || 0;
    return Math.max(0, target - saved - contribution);
  }

  confirmContribution(): void {
    if (this.selectedGoalForContribute && this.contributeAmount > 0) {
      this.processContribution(this.selectedGoalForContribute, this.contributeAmount);
      this.closeContributeModal();
    }
  }

  contributeToGoal(goal: Goal): void {
    this.openContributeModal(goal);
  }

  private processContribution(goal: Goal, amount: number): void {
    // Store previous progress for checkpoint detection
    const previousPercentage = this.getGoalPercentage(goal);
    goal.lastKnownPercentage = previousPercentage;

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

    // Check for checkpoint achievements
    setTimeout(() => {
      // Small delay to let the data update
      const updatedGoalData = this.goals.find(g => g.id === goal.id);
      if (updatedGoalData) {
        this.triggerCheckpointCelebration(updatedGoalData);
      }
    }, 100);

    // Show regular contribution message (checkpoint celebration will override if applicable)
    setTimeout(() => {
      this.showSuccessMessage('Aporte Realizado!', `R$ ${this.formatCurrency(amount)} adicionado à meta "${goal.name}".`);
    }, 150);
  }

  viewGoalDetails(goal: Goal): void {
    this.selectedGoalForDetails = goal;
    this.showGoalDetailsModal = true;
  }

  openGoalDetails(goal: Goal): void {
    this.selectedGoalForDetails = goal;
    this.showGoalDetailsModal = true;
  }

  getProgressColor(goal: Goal): string {
    const percentage = this.getGoalPercentage(goal);
    if (percentage >= 75) return '#10b981';
    if (percentage >= 50) return '#3b82f6';
    if (percentage >= 25) return '#f59e0b';
    return '#ef4444';
  }

  getProgressOffsetMini(goal: Goal): number {
    const percentage = this.getGoalPercentage(goal);
    const circumference = 2 * Math.PI * 20; // radius = 20
    return circumference - (percentage / 100) * circumference;
  }

  getProgressOffsetLarge(goal: Goal): number {
    const percentage = this.getGoalPercentage(goal);
    const circumference = 2 * Math.PI * 50; // radius = 50
    return circumference - (percentage / 100) * circumference;
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

  openScenarioSimulator(): void {
    // Use selected goal if available, otherwise use the first available goal
    let targetGoal = this.selectedGoalForDetails;
    
    if (!targetGoal && this.filteredGoals.length > 0) {
      targetGoal = this.filteredGoals[0];
      this.selectedGoalForDetails = targetGoal;
    }
    
    if (targetGoal) {
      this.showScenarios(targetGoal);
    }
  }

  showScenarios(goal: Goal): void {
    // Initialize simulation values
    this.simulatedMonthlyAmount = goal.monthlyTarget;
    this.simulatedExtraAmount = 0;
    this.selectedScenario = 'base';

    // Generate enhanced scenario data
    this.selectedGoalScenario = {
      goalId: goal.id,
      aiRecommendation: this.generateAIRecommendation(goal),
      scenarios: this.calculateScenarios(goal)
    };
    this.showAIModal = true;
  }

  private generateAIRecommendation(goal: Goal): string {
    const currentProgress = this.getGoalPercentage(goal);
    const remainingAmount = goal.target - goal.saved;
    const monthsToDeadline = this.calculateMonthsDifference(goal.deadline);
    const requiredMonthly = remainingAmount / monthsToDeadline;

    if (requiredMonthly > goal.monthlyTarget * 1.5) {
      return '⚠️ Atenção: Para cumprir o prazo, você precisaria aumentar significativamente os aportes. Considere revisar o prazo ou o valor da meta.';
    } else if (requiredMonthly < goal.monthlyTarget * 0.8) {
      return '🎉 Excelente! Você está no caminho certo. Considere o cenário otimista para conquistar sua meta mais rapidamente.';
    } else {
      return '💡 Baseado na sua capacidade financeira atual, recomendo manter o plano base com pequenos ajustes conforme sua evolução.';
    }
  }

  private calculateScenarios(goal: Goal) {
    const remainingAmount = goal.target - goal.saved;
    const baseMonthly = this.simulatedMonthlyAmount;
    const extraAnnual = this.simulatedExtraAmount;

    return {
      conservative: {
        monthlyContribution: baseMonthly * 0.8,
        estimatedCompletion: this.calculateCompletionDate(remainingAmount, baseMonthly * 0.8, extraAnnual * 0.5),
        probability: 90,
        description: 'Cenário seguro que considera possíveis imprevistos financeiros e reduz o risco de não cumprimento.'
      },
      base: {
        monthlyContribution: baseMonthly,
        estimatedCompletion: this.calculateCompletionDate(remainingAmount, baseMonthly, extraAnnual),
        probability: 75,
        description: 'Cenário planejado baseado na sua capacidade atual de investimento e histórico.'
      },
      optimistic: {
        monthlyContribution: baseMonthly * 1.2,
        estimatedCompletion: this.calculateCompletionDate(remainingAmount, baseMonthly * 1.2, extraAnnual * 1.5),
        probability: 60,
        description: 'Cenário otimista que considera aumentos de renda ou economia adicional.'
      }
    };
  }

  private calculateCompletionDate(remainingAmount: number, monthlyAmount: number, extraAnnual: number): string {
    const monthlyTotal = monthlyAmount + (extraAnnual / 12);
    const monthsNeeded = Math.ceil(remainingAmount / monthlyTotal);
    const completionDate = new Date();
    completionDate.setMonth(completionDate.getMonth() + monthsNeeded);
    return completionDate.toISOString().split('T')[0];
  }

  recalculateScenarios(): void {
    if (this.selectedGoalScenario) {
      const goal = this.getSelectedGoal();
      if (goal) {
        this.selectedGoalScenario.scenarios = this.calculateScenarios(goal);
        this.selectedGoalScenario.aiRecommendation = this.generateAIRecommendation(goal);
      }
    }
  }

  getSelectedGoal(): Goal | null {
    if (!this.selectedGoalScenario) return null;
    return this.goals.find(g => g.id === this.selectedGoalScenario!.goalId) || null;
  }

  selectScenario(scenario: 'conservative' | 'base' | 'optimistic'): void {
    this.selectedScenario = scenario;
  }

  getScenarioProgress(scenario: 'conservative' | 'base' | 'optimistic'): number {
    const goal = this.getSelectedGoal();
    if (!goal || !this.selectedGoalScenario) return 0;

    const scenarioData = this.selectedGoalScenario.scenarios[scenario];
    const monthsTotal = this.calculateMonthsDifference(scenarioData.estimatedCompletion);
    const monthsPassed = Math.max(0, 24 - monthsTotal); // Assuming 2-year max timeline

    return Math.min(100, (monthsPassed / 24) * 100);
  }

  getChartHeight(scenario: 'conservative' | 'base' | 'optimistic'): number {
    if (!this.selectedGoalScenario) return 0;

    const scenarioData = this.selectedGoalScenario.scenarios[scenario];
    const monthsToCompletion = this.calculateMonthsDifference(scenarioData.estimatedCompletion);
    const maxMonths = 36; // 3 years max for chart scaling

    // Invert the height (shorter time = taller bar)
    return Math.max(20, 100 - ((monthsToCompletion / maxMonths) * 80));
  }

  calculateMonthsDifference(dateString: string): number {
    const targetDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime = targetDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, Math.ceil(diffDays / 30));
  }

  applyScenario(): void {
    if (!this.selectedScenario || !this.selectedGoalScenario) return;

    const goal = this.getSelectedGoal();
    if (goal) {
      const scenarioData = this.selectedGoalScenario.scenarios[this.selectedScenario];

      // Update goal with selected scenario
      const updatedGoal = {
        ...goal,
        monthlyTarget: scenarioData.monthlyContribution,
        deadline: scenarioData.estimatedCompletion
      };

      this.dataService.updateGoal(goal.id, updatedGoal);

      // Award XP for optimization
      this.gamificationService.addXP(25);

      this.showSuccessMessage(
        '🎯 Cenário Aplicado!',
        `Meta otimizada com o cenário ${this.selectedScenario}. +25 XP`
      );

      this.showAIModal = false;
      this.activeMenuId = null;
    }
  }

  exportScenarios(): void {
    if (!this.selectedGoalScenario) return;

    const goal = this.getSelectedGoal();
    if (goal) {
      const exportData = {
        goal: goal.name,
        scenarios: this.selectedGoalScenario.scenarios,
        recommendation: this.selectedGoalScenario.aiRecommendation,
        exportedAt: new Date().toISOString()
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `cenarios-${goal.name.replace(/\s+/g, '-').toLowerCase()}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
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
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `metas-venturefi-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  getGoalPercentage(goal: Goal): number {
    return goal.target > 0 ? Math.round((goal.saved / goal.target) * 100) : 0;
  }

  getGoalMilestones(goal: Goal): Array<{ position: number, reached: boolean }> {
    const milestones = [25, 50, 75];
    const currentPercentage = this.getGoalPercentage(goal);

    return milestones.map(milestone => ({
      position: milestone,
      reached: currentPercentage >= milestone
    }));
  }

  getGoalCheckpoints(goal: Goal) {
    const checkpoints = [
      { percentage: 25, icon: '🎯', title: 'Primeiro Marco', badge: 'Iniciante' },
      { percentage: 50, icon: '🚀', title: 'Meio Caminho', badge: 'Persistente' },
      { percentage: 75, icon: '⭐', title: 'Quase Lá', badge: 'Determinado' },
      { percentage: 100, icon: '🏆', title: 'Meta Conquistada', badge: 'Campeão' }
    ];

    const currentPercentage = this.getGoalPercentage(goal);
    const lastPercentage = goal.lastKnownPercentage || 0;

    return checkpoints.map(checkpoint => {
      const achieved = currentPercentage >= checkpoint.percentage;
      const isCurrent = currentPercentage >= checkpoint.percentage - 5 &&
        currentPercentage < checkpoint.percentage + 5;
      const justAchieved = achieved && lastPercentage < checkpoint.percentage;

      return {
        ...checkpoint,
        amount: (goal.target * checkpoint.percentage) / 100,
        achieved,
        isCurrent,
        shouldCelebrate: justAchieved
      };
    });
  }

  getNextCheckpoint(goal: Goal) {
    const currentPercentage = this.getGoalPercentage(goal);
    const checkpoints = this.getGoalCheckpoints(goal);

    return checkpoints.find(checkpoint => !checkpoint.achieved);
  }

  getCheckpointInsight(goal: Goal): string | null {
    const currentPercentage = this.getGoalPercentage(goal);
    const nextCheckpoint = this.getNextCheckpoint(goal);

    if (!nextCheckpoint) {
      return 'Parabéns! Você conquistou todos os marcos desta meta! 🎉';
    }

    const remaining = nextCheckpoint.amount - goal.saved;
    const monthsToNext = Math.ceil(remaining / goal.monthlyTarget);

    if (currentPercentage >= 75) {
      return `Quase lá! Faltam apenas R$ ${this.formatCurrency(remaining)} para conquistar o marco de ${nextCheckpoint.percentage}%! 💪`;
    } else if (currentPercentage >= 50) {
      return `Você está no meio do caminho! Em ${monthsToNext} meses você conquistará o próximo marco. 🚀`;
    } else if (currentPercentage >= 25) {
      return `Ótimo progresso! Continue assim e em ${monthsToNext} meses você alcançará ${nextCheckpoint.percentage}%. 🎯`;
    } else {
      return `Comece forte! Seu primeiro marco estará ao alcance em ${monthsToNext} meses. 💫`;
    }
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

  // Enhanced Goal Management Methods
  getPriorityIcon(priority: string): string {
    const icons = {
      'high': '🔴',
      'medium': '🟡',
      'low': '🟢'
    };
    return icons[priority as keyof typeof icons] || '🟢';
  }

  getGoalSmartStatus(goal: Goal): { class: string, icon: string, label: string } {
    const percentage = this.getGoalPercentage(goal);
    const timeRemaining = this.calculateMonthsDifference(goal.deadline);
    const requiredMonthly = (goal.target - goal.saved) / timeRemaining;

    if (percentage >= 90) {
      return { class: 'status-excellent', icon: '🎆', label: 'Quase Lá!' };
    } else if (percentage >= 75) {
      return { class: 'status-great', icon: '🚀', label: 'Indo Bem' };
    } else if (requiredMonthly > goal.monthlyTarget * 1.5) {
      return { class: 'status-warning', icon: '⚠️', label: 'Risco' };
    } else if (requiredMonthly < goal.monthlyTarget * 0.8) {
      return { class: 'status-ahead', icon: '✨', label: 'Adiantado' };
    } else {
      return { class: 'status-ontrack', icon: '🎯', label: 'No Prazo' };
    }
  }

  getProgressOffset(goal: Goal): number {
    const percentage = this.getGoalPercentage(goal);
    const circumference = 2 * Math.PI * 25; // radius = 25
    return circumference - (percentage / 100) * circumference;
  }

  getGoalAIRecommendation(goal: Goal): string | null {
    const percentage = this.getGoalPercentage(goal);
    const timeRemaining = this.calculateMonthsDifference(goal.deadline);
    const requiredMonthly = (goal.target - goal.saved) / timeRemaining;

    if (requiredMonthly > goal.monthlyTarget * 1.5) {
      return 'Considere revisar o prazo ou aumentar os aportes mensais.';
    } else if (requiredMonthly < goal.monthlyTarget * 0.8) {
      return 'Você pode alcançar esta meta mais cedo mantendo o ritmo!';
    } else if (percentage < 25 && timeRemaining < 6) {
      return 'Tempo curto restante. Considere aportes extras ou revisar a meta.';
    } else if (percentage > 50 && goal.priority === 'low') {
      return 'Esta meta está progredindo bem. Considere aumentar a prioridade.';
    }
    return null;
  }

  getProgressFillClass(goal: Goal): string {
    const percentage = this.getGoalPercentage(goal);
    if (percentage >= 75) return 'progress-excellent';
    if (percentage >= 50) return 'progress-good';
    if (percentage >= 25) return 'progress-fair';
    return 'progress-start';
  }

  getSmartRecommendations(goal: Goal): any[] {
    const recommendations = [];
    const percentage = this.getGoalPercentage(goal);
    const timeRemaining = this.calculateMonthsDifference(goal.deadline);
    const requiredMonthly = (goal.target - goal.saved) / timeRemaining;

    // Recomendação de otimização de aportes
    if (requiredMonthly !== goal.monthlyTarget) {
      recommendations.push({
        type: 'optimization',
        icon: '📈',
        title: 'Ajustar Aportes',
        description: `Aporte ideal: R$ ${this.formatCurrency(requiredMonthly)}/mês`,
        actionable: true,
        actionText: 'Aplicar',
        action: 'adjust_contribution'
      });
    }

    // Alerta de risco de atraso
    if (requiredMonthly > goal.monthlyTarget * 1.3) {
      recommendations.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Risco de Atraso',
        description: 'Meta pode não ser cumprida no prazo atual',
        actionable: true,
        actionText: 'Revisar',
        action: 'review_deadline'
      });
    }

    // Sugestão de priorização
    if (percentage > 60 && goal.priority === 'low') {
      recommendations.push({
        type: 'suggestion',
        icon: '⬆️',
        title: 'Aumentar Prioridade',
        description: 'Meta com bom progresso merece mais atenção',
        actionable: true,
        actionText: 'Priorizar',
        action: 'increase_priority'
      });
    }

    // Template de meta similar
    if (percentage < 10) {
      recommendations.push({
        type: 'template',
        icon: '📄',
        title: 'Usar Template',
        description: 'Aplique configurações de metas similares bem-sucedidas',
        actionable: true,
        actionText: 'Aplicar',
        action: 'apply_template'
      });
    }

    return recommendations;
  }

  executeRecommendation(goal: Goal, recommendation: any): void {
    switch (recommendation.action) {
      case 'adjust_contribution':
        this.adjustGoalContribution(goal);
        break;
      case 'review_deadline':
        this.reviewGoalDeadline(goal);
        break;
      case 'increase_priority':
        this.updateGoalPriority(goal, 'high');
        break;
      case 'apply_template':
        this.applyGoalTemplate(goal);
        break;
    }
  }

  adjustGoalContribution(goal: Goal): void {
    const timeRemaining = this.calculateMonthsDifference(goal.deadline);
    const requiredMonthly = (goal.target - goal.saved) / timeRemaining;

    const updatedGoal = {
      ...goal,
      monthlyTarget: Math.round(requiredMonthly)
    };

    this.dataService.updateGoal(goal.id, updatedGoal);
    this.gamificationService.addXP(15);

    this.showSuccessMessage(
      '📈 Aporte Otimizado!',
      `Novo valor mensal: R$ ${this.formatCurrency(requiredMonthly)}. +15 XP`
    );
  }

  reviewGoalDeadline(goal: Goal): void {
    // Open deadline review modal (mock implementation)
    const monthsNeeded = Math.ceil((goal.target - goal.saved) / goal.monthlyTarget);
    const newDeadline = new Date();
    newDeadline.setMonth(newDeadline.getMonth() + monthsNeeded);

    const updatedGoal = {
      ...goal,
      deadline: newDeadline.toISOString().split('T')[0]
    };

    this.dataService.updateGoal(goal.id, updatedGoal);
    this.gamificationService.addXP(10);

    this.showSuccessMessage(
      '📅 Prazo Atualizado!',
      `Novo prazo: ${this.formatDate(updatedGoal.deadline)}. +10 XP`
    );
  }

  updateGoalPriority(goal: Goal, newPriority: 'low' | 'medium' | 'high'): void {
    const updatedGoal = {
      ...goal,
      priority: newPriority
    };

    this.dataService.updateGoal(goal.id, updatedGoal);
    this.gamificationService.addXP(5);

    this.showSuccessMessage(
      '⬆️ Prioridade Atualizada!',
      `Meta marcada como ${this.getPriorityLabel(newPriority)}. +5 XP`
    );
  }

  applyGoalTemplate(goal: Goal): void {
    // Apply successful goal template (mock implementation)
    const template = {
      monthlyTarget: Math.round(goal.target * 0.05), // 5% per month = ~20 months
      priority: 'medium' as const
    };

    const updatedGoal = {
      ...goal,
      ...template
    };

    this.dataService.updateGoal(goal.id, updatedGoal);
    this.gamificationService.addXP(20);

    this.showSuccessMessage(
      '📄 Template Aplicado!',
      'Configurações otimizadas aplicadas à meta. +20 XP'
    );
  }

  optimizeGoal(goal: Goal): void {
    // Run comprehensive goal optimization
    this.adjustGoalContribution(goal);
    const recommendations = this.getSmartRecommendations(goal);

    this.showSuccessMessage(
      '⚙️ Meta Otimizada!',
      `${recommendations.length} melhorias aplicadas automaticamente.`
    );
  }

  shareGoal(goal: Goal): void {
    // Share goal progress (mock implementation)
    const shareText = `Estou ${this.getGoalPercentage(goal)}% perto da minha meta "${goal.name}"! 🎯`;

    if (navigator.share) {
      navigator.share({
        title: 'Minha Meta no VentureFi',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      this.showSuccessMessage('📤 Copiado!', 'Texto copiado para a área de transferência.');
    }
  }

  favoriteGoal(goal: Goal): void {
    const updatedGoal = {
      ...goal,
      isFavorite: !goal.isFavorite
    };

    this.dataService.updateGoal(goal.id, updatedGoal);

    const message = updatedGoal.isFavorite ? '⭐ Adicionada aos favoritos!' : 'Removida dos favoritos';
    this.showSuccessMessage(message, '');
  }

  // Premium Filter Methods
  setQuickFilter(type: string, value: string): void {
    if (type === 'status') {
      this.statusFilter = value;
    } else if (type === 'priority') {
      this.priorityFilter = value;
    }
    this.applyFilters();
  }

  getAllGoalsCount(): number {
    return this.goals.length;
  }

  getActiveGoalsCount(): number {
    return this.goals.filter(g => !g.completed).length;
  }

  getCompletedGoalsCount(): number {
    return this.goals.filter(g => g.completed).length;
  }

  getHighPriorityCount(): number {
    return this.goals.filter(g => g.priority === 'high').length;
  }

  applySorting(): void {
    this.filteredGoals = [...this.filteredGoals].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (this.sortBy) {
        case 'progress':
          aValue = this.getGoalPercentage(a);
          bValue = this.getGoalPercentage(b);
          break;
        case 'deadline':
          aValue = new Date(a.deadline).getTime();
          bValue = new Date(b.deadline).getTime();
          break;
        case 'amount':
          aValue = a.target;
          bValue = b.target;
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        default:
          return 0;
      }

      if (this.sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applySorting();
  }

  getSortLabel(): string {
    const labels = {
      progress: 'Progresso',
      deadline: 'Prazo',
      amount: 'Valor',
      priority: 'Prioridade',
      name: 'Nome'
    };
    return labels[this.sortBy as keyof typeof labels] || 'Progresso';
  }

  clearAllFilters(): void {
    this.statusFilter = 'all';
    this.originFilter = 'all';
    this.priorityFilter = 'all';
    this.sortBy = 'progress';
    this.sortDirection = 'desc';
    this.applyFilters();
  }

  saveCurrentFilter(): void {
    const filterConfig = {
      status: this.statusFilter,
      origin: this.originFilter,
      priority: this.priorityFilter,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection
    };

    localStorage.setItem('dreamsuit_saved_filter', JSON.stringify(filterConfig));
    this.showSuccessMessage('💾 Filtro Salvo!', 'Suas preferências de filtragem foram salvas.');
  }

  // Premium Goals Section Methods
  getOverallProgress(): number {
    if (this.goals.length === 0) return 0;
    const totalProgress = this.goals.reduce((sum, goal) => sum + this.getGoalPercentage(goal), 0);
    return Math.round(totalProgress / this.goals.length);
  }


  bulkContribute(): void {
    // Mock bulk contribute functionality
    this.showSuccessMessage('💰 Contribuição em Lote', `Contribuindo para ${this.selectedGoals.length} metas selecionadas.`);
    this.selectedGoals = [];
  }

  bulkExport(): void {
    const exportData = this.selectedGoals.map(goal => ({
      name: goal.name,
      target: goal.target,
      saved: goal.saved,
      progress: this.getGoalPercentage(goal),
      deadline: goal.deadline
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `metas-selecionadas-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    this.selectedGoals = [];
  }

  // Premium Achievement System Methods
  getLevelRingColor(): string {
    const colors = {
      1: 'linear-gradient(45deg, #94a3b8, #cbd5e1)',
      2: 'linear-gradient(45deg, #10b981, #059669)',
      3: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
      4: 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
      5: 'linear-gradient(45deg, #f59e0b, #d97706)'
    };
    return colors[this.userStats.level as keyof typeof colors] || colors[1];
  }

  getLevelTitle(): string {
    const titles = {
      1: 'Iniciante',
      2: 'Aventureiro',
      3: 'Especialista',
      4: 'Mestre',
      5: 'Lenda'
    };
    return titles[this.userStats.level as keyof typeof titles] || 'Iniciante';
  }

  getNextLevelXP(): number {
    return (this.userStats.level + 1) * 500;
  }

  getBadgeCompletionPercentage(): number {
    if (this.totalBadges === 0) return 0;
    return Math.round((this.unlockedBadges.length / this.totalBadges) * 100);
  }

  getActiveMissionsProgress(): number {
    if (this.activeMissions.length === 0) return 0;
    const totalProgress = this.activeMissions.reduce((sum, mission) => sum + this.getMissionProgress(mission), 0);
    return Math.round(totalProgress / this.activeMissions.length);
  }

  getStreakProgress(): number {
    const maxStreak = 30; // 30 days target
    return Math.min(100, (this.userStats.streakDays / maxStreak) * 100);
  }

  getUserRank(): number {
    // Mock ranking based on XP
    return Math.max(1, Math.floor((5000 - this.userStats.xp) / 100));
  }

  getRankingProgress(): number {
    // Mock progress to next rank tier
    return (this.userStats.xp % 500) / 5; // Convert to percentage
  }

  getFeaturedBadges(): Badge[] {
    // Return top 6 badges (unlocked + almost unlocked)
    return this.displayedBadges.slice(0, 6);
  }

  isAlmostUnlocked(badge: Badge): boolean {
    if (badge.isUnlocked) return false;
    const progress = (badge.progress || 0) / (badge.maxProgress || 100);
    return progress >= 0.8; // 80% or more
  }

  getRarityLabel(rarity: string): string {
    const labels = {
      common: 'Comum',
      rare: 'Raro',
      epic: 'Épico',
      legendary: 'Lendário'
    };
    return labels[rarity as keyof typeof labels] || 'Comum';
  }

  getBadgeProgress(badge: Badge): number {
    if (!badge.maxProgress) return 0;
    return Math.round(((badge.progress || 0) / badge.maxProgress) * 100);
  }

  getTopMissions(): Mission[] {
    return this.activeMissions.slice(0, 3); // Show top 3 missions
  }

  getMissionTypeLabel(type: string): string {
    const labels = {
      daily: 'Diária',
      weekly: 'Semanal',
      monthly: 'Mensal',
      special: 'Especial'
    };
    return labels[type as keyof typeof labels] || 'Geral';
  }

  showAllBadges(): void {
    // Open badges modal/page
    this.showSuccessMessage('🏅 Badges', 'Visualizando todos os badges disponíveis.');
  }

  showActiveMissions(): void {
    // Open missions modal/page
    this.showSuccessMessage('🎯 Missões', 'Visualizando todas as missões ativas.');
  }

  showStreakInfo(): void {
    this.showSuccessMessage('🔥 Sequência', `Você tem ${this.userStats.streakDays} dias consecutivos de atividade!`);
  }

  showRankingInfo(): void {
    this.showSuccessMessage('📈 Ranking', `Você está na posição #${this.getUserRank()} do ranking geral!`);
  }

  showMissionDetails(mission: Mission): void {
    this.showSuccessMessage(`🎯 ${mission.title}`, mission.description);
  }

  // Update goal's last known percentage for celebration detection
  private updateGoalProgress(goalId: string) {
    const goal = this.goals.find(g => g.id === goalId);
    if (goal) {
      goal.lastKnownPercentage = this.getGoalPercentage(goal);
    }
  }

  // Trigger celebration for newly achieved checkpoints
  private triggerCheckpointCelebration(goal: Goal) {
    const checkpoints = this.getGoalCheckpoints(goal);
    const celebratingCheckpoint = checkpoints.find(c => c.shouldCelebrate);

    if (celebratingCheckpoint) {
      // Award XP based on checkpoint
      const xpReward = celebratingCheckpoint.percentage * 2; // 50, 100, 150, 200 XP
      this.gamificationService.addXP(xpReward);

      // Try to unlock milestone badges (they might already exist in the system)
      const badgeId = `milestone_${celebratingCheckpoint.percentage}`;
      this.gamificationService.unlockBadge(badgeId);

      // Update goal's progress tracking
      this.updateGoalProgress(goal.id);

      // Show celebration message
      this.showSuccessMessage(
        `🎉 Marco Conquistado!`,
        `Você alcançou ${celebratingCheckpoint.percentage}% da meta "${goal.name}"! +${xpReward} XP`
      );
    }
  }

  // Premium Header Helper Methods
  getTotalSaved(): string {
    const total = this.goals.reduce((sum, goal) => sum + goal.saved, 0);
    return this.formatCurrency(total);
  }

  getAverageProgress(): number {
    if (this.goals.length === 0) return 0;
    const totalProgress = this.goals.reduce((sum, goal) => sum + this.getGoalPercentage(goal), 0);
    return Math.round(totalProgress / this.goals.length);
  }

  openAIAssistant(): void {
    this.showAIModal = true;
  }

  // Helper method to convert emoji icons to SVG icon names
  getGoalIconName(goal: Goal): string {
    const emojiToIconMap: Record<string, string> = {
      '🏠': 'home',
      '🚗': 'truck',
      '🏖️': 'sun',
      '✈️': 'paper-airplane',
      '💍': 'heart',
      '🎓': 'academic-cap',
      '💼': 'briefcase',
      '📱': 'device-phone-mobile',
      '💻': 'computer-desktop',
      '🍔': 'cake',
      '🎯': 'target',
      '🚀': 'rocket-launch',
      '💰': 'banknotes',
      '📈': 'chart-bar',
      '🎮': 'puzzle-piece',
      '📚': 'book-open',
      '🏆': 'trophy',
      '⭐': 'star',
      '💡': 'light-bulb',
      '🔧': 'wrench-screwdriver',
      '🎨': 'paint-brush',
      '🏋️': 'heart',
      '🌟': 'sparkles',
      '💎': 'gem',
      '🎪': 'gift',
      '🌍': 'globe-americas',
      '🎄': 'gift',
      '🎁': 'gift'
    };

    return emojiToIconMap[goal.icon] || 'target'; // Default to target icon
  }

  // New methods for the modern design
  getAchievedCheckpoints(goal: Goal): number {
    return this.getGoalCheckpoints(goal).filter(c => c.achieved).length;
  }

  getTotalCheckpoints(goal: Goal): number {
    return this.getGoalCheckpoints(goal).length;
  }

  getProgressRingOffset(goal: Goal): number {
    const percentage = this.getGoalPercentage(goal);
    const circumference = 2 * Math.PI * 40; // radius = 40
    return circumference - (percentage / 100) * circumference;
  }

  getProgressRingOffsetLarge(goal: Goal): number {
    const percentage = this.getGoalPercentage(goal);
    const circumference = 2 * Math.PI * 70; // radius = 70
    return circumference - (percentage / 100) * circumference;
  }

  getGoalCategory(goal: Goal): string {
    // Map goal types to categories
    const categoryMap: Record<string, string> = {
      'house': 'Imóveis',
      'car': 'Veículos',
      'vacation': 'Viagens',
      'education': 'Educação',
      'emergency': 'Emergência',
      'investment': 'Investimentos',
      'business': 'Negócios',
      'personal': 'Pessoal'
    };

    return categoryMap[goal.origin] || 'Pessoal';
  }

  getGoalCreatedDate(goal: Goal): string {
    // Mock created date (in real app, this would come from goal data)
    return 'há 2 meses';
  }

  getProgressTrend(goal: Goal): { icon: string, text: string } {
    const percentage = this.getGoalPercentage(goal);
    const timeRemaining = this.calculateMonthsDifference(goal.deadline);
    const requiredMonthly = (goal.target - goal.saved) / timeRemaining;

    if (requiredMonthly < goal.monthlyTarget * 0.8) {
      return { icon: '📈', text: 'Acima da meta' };
    } else if (requiredMonthly > goal.monthlyTarget * 1.2) {
      return { icon: '📉', text: 'Atrás da meta' };
    } else {
      return { icon: '🎯', text: 'No ritmo certo' };
    }
  }

  getMonthlyProgress(goal: Goal): number {
    // Mock monthly progress based on current month's contributions
    const currentMonth = new Date().getMonth();
    const mockProgress = (currentMonth + 1) * 8; // Simulate monthly progress
    return Math.min(100, mockProgress);
  }

  getTimeProgress(goal: Goal): number {
    const now = new Date();
    const deadline = new Date(goal.deadline);
    const created = new Date(goal.createdAt || now.getTime() - (365 * 24 * 60 * 60 * 1000)); // Mock created date

    const totalTime = deadline.getTime() - created.getTime();
    const elapsed = now.getTime() - created.getTime();

    return Math.min(100, Math.max(0, (elapsed / totalTime) * 100));
  }

  getMonthsRemaining(goal: Goal): string {
    const months = this.calculateMonthsDifference(goal.deadline);
    if (months <= 0) return '0';
    if (months === 1) return '1';
    return months.toString();
  }

  getFormattedDeadline(goal: Goal): string {
    const date = new Date(goal.deadline);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
