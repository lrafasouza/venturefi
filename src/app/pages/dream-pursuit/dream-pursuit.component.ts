import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ModalService } from '../../shared/services/modal.service';
import { DataService, Goal } from '../../shared/services/data.service';
import { FinancialCalculatorService, GoalAnalysis } from '../../shared/services/financial-calculator.service';

@Component({
  selector: 'app-dream-pursuit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IconComponent],
  template: `
    <!-- Page Header -->
    <section class="page-header">
      <div class="header-content">
        <div class="page-title-section">
          <h1 class="page-title">Em Busca do Sonho</h1>
          <p class="page-description">Transforme seus sonhos em metas concretas e acompanhe seu progresso financeiro</p>
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

    <!-- Dashboard Content -->
    <div class="content-wrapper">
        <!-- Overview Cards -->
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
                    <span>+18%</span>
                  </div>
                </div>
                <div class="card-content-modern">
                  <div class="card-label-modern">Total em Metas</div>
                  <div class="card-value-modern primary-text">R$ {{ formatCurrency(totalInGoals) }}</div>
                  <div class="card-subtitle-modern">{{ activeGoals }} metas ativas</div>
                  <div class="card-progress-line"><div class="progress-fill" style="width: 75%"></div></div>
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
                  <div class="card-progress-line"><div class="progress-fill success" [style.width.%]="overallProgress"></div></div>
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
                  <div class="card-progress-line"><div class="progress-fill warning" style="width: 60%"></div></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Financial Capacity Indicator -->
          <div class="capacity-indicator animate-slide-up">
            <div class="capacity-card-premium">
              <div class="capacity-background-glow" [class]="getCapacityGlowClass()"></div>
              <div class="capacity-header-modern">
                <div class="capacity-icon-premium" [class]="getCapacityIconClass()">
                  <div class="icon-glow"></div>
                  <app-icon [name]="getCapacityIcon()" size="32"></app-icon>
                </div>
                <div class="capacity-info-modern">
                  <h4 class="capacity-title">Capacidade Financeira</h4>
                  <div class="capacity-status-badge" [class]="getCapacityBadgeClass()">
                    <span class="status-indicator"></span>
                    <span class="status-text">{{ getCapacityText() }}</span>
                  </div>
                </div>
                <div class="capacity-score">
                  <div class="score-circle" [class]="getCapacityScoreClass()">
                    <span class="score-number">{{ getCapacityScore() }}</span>
                    <span class="score-label">Score</span>
                  </div>
                </div>
              </div>
              <div class="capacity-metrics-grid">
                <div class="metric-card">
                  <div class="metric-icon success">
                    <app-icon name="banknotes" size="20"></app-icon>
                  </div>
                  <div class="metric-content">
                    <span class="metric-label-modern">Disponível para Metas</span>
                    <span class="metric-value-modern success-gradient">R$ {{ formatCurrency(availableForGoals) }}</span>
                    <div class="metric-trend positive">+12% este mês</div>
                  </div>
                </div>
                <div class="metric-card">
                  <div class="metric-icon" [class]="goalImpactOnBudget > 50 ? 'warning' : 'primary'">
                    <app-icon name="chart-pie" size="20"></app-icon>
                  </div>
                  <div class="metric-content">
                    <span class="metric-label-modern">Comprometimento Atual</span>
                    <span class="metric-value-modern" [class]="goalImpactOnBudget > 50 ? 'warning-gradient' : 'primary-gradient'">{{ goalImpactOnBudget.toFixed(1) }}%</span>
                    <div class="metric-progress">
                      <div class="progress-track"></div>
                      <div class="progress-bar-modern" [class]="goalImpactOnBudget > 50 ? 'warning' : 'primary'" [style.width.%]="goalImpactOnBudget"></div>
                    </div>
                  </div>
                </div>
                <div class="metric-card">
                  <div class="metric-icon primary">
                    <app-icon name="calculator" size="20"></app-icon>
                  </div>
                  <div class="metric-content">
                    <span class="metric-label-modern">Orçamento Recomendado</span>
                    <span class="metric-value-modern primary-gradient">R$ {{ formatCurrency(recommendedGoalBudget) }}</span>
                    <div class="metric-trend neutral">Baseado no seu perfil</div>
                  </div>
                </div>
              </div>
              <div class="capacity-recommendation-modern">
                <div class="recommendation-icon">
                  <app-icon name="light-bulb" size="18"></app-icon>
                </div>
                <div class="recommendation-content">
                  <span class="recommendation-text">{{ getCapacityRecommendation() }}</span>
                  <button class="recommendation-action">Ver Detalhes</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Filters Section -->
          <div class="filters-section animate-fade-in">
            <div class="section-header">
              <h3>Suas Metas</h3>
              <div class="section-meta">
                <span class="total-count">{{ filteredGoals.length }} metas</span>
              </div>
            </div>

            <div class="filters-row">
              <div class="filter-group">
                <label>Status</label>
                <select class="filter-select" [(ngModel)]="statusFilter" (change)="applyFilters()">
                  <option value="all">Todos os status</option>
                  <option value="on-track">No prazo</option>
                  <option value="ahead">Adiantado</option>
                  <option value="behind">Atrasado</option>
                </select>
              </div>
              <div class="filter-group">
                <label>Origem</label>
                <select class="filter-select" [(ngModel)]="originFilter" (change)="applyFilters()">
                  <option value="all">Todas as origens</option>
                  <option value="personal">Pessoal</option>
                  <option value="business">Negócio</option>
                </select>
              </div>
              <div class="filter-group">
                <label>Prioridade</label>
                <select class="filter-select" [(ngModel)]="priorityFilter" (change)="applyFilters()">
                  <option value="all">Todas as prioridades</option>
                  <option value="high">Alta</option>
                  <option value="medium">Média</option>
                  <option value="low">Baixa</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Goals Grid -->
          <div class="goals-grid animate-stagger">
            <div class="goal-card-modern hover-lift-premium" *ngFor="let goal of filteredGoals; trackBy: trackGoalById" [class]="getGoalClasses(goal)">
              <div class="goal-background-pattern"></div>
              <div class="goal-glow-effect" [class]="getGoalGlowClass(goal)"></div>

              <div class="goal-header-modern">
                <div class="goal-info-modern">
                  <div class="goal-icon-premium" [class]="'priority-' + goal.priority + '-glow'">
                    <div class="icon-ring"></div>
                    <span class="icon-emoji">{{ goal.icon }}</span>
                    <div class="priority-indicator" [class]="goal.priority"></div>
                  </div>
                  <div class="goal-details-modern">
                    <h4 class="goal-title-modern">{{ goal.name }}</h4>
                    <div class="goal-badges-modern">
                      <span class="origin-badge-modern" [class]="goal.origin">
                        <div class="badge-icon"></div>
                        {{ goal.origin === 'personal' ? 'Pessoal' : 'Negócio' }}
                      </span>
                      <span class="status-badge-modern" [class]="getGoalStatus(goal)">
                        <div class="status-dot" [class]="getGoalStatus(goal)"></div>
                        {{ getGoalStatusText(goal) }}
                      </span>
                      <span class="priority-badge-modern" [class]="goal.priority">
                        {{ getPriorityText(goal.priority) }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="goal-actions-modern">
                  <button class="action-btn-modern" (click)="toggleGoalMenu(goal.id)">
                    <app-icon name="ellipsis-vertical" size="18"></app-icon>
                  </button>
                  <div class="action-menu-modern" *ngIf="activeMenuId === goal.id">
                    <button class="menu-item edit" (click)="editGoal(goal)">
                      <app-icon name="pencil" size="16"></app-icon>
                      <span>Editar</span>
                    </button>
                    <button class="menu-item add" (click)="addMoney(goal)">
                      <app-icon name="plus" size="16"></app-icon>
                      <span>Adicionar</span>
                    </button>
                    <button class="menu-item danger" (click)="deleteGoal(goal.id)">
                      <app-icon name="trash" size="16"></app-icon>
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>
              </div>

              <div class="goal-progress-modern">
                <div class="progress-header-modern">
                  <div class="amount-section">
                    <span class="progress-amount-modern">R$ {{ formatCurrency(goal.saved) }}</span>
                    <span class="progress-target-modern">de R$ {{ formatCurrency(goal.target) }}</span>
                  </div>
                  <div class="percentage-section">
                    <div class="percentage-circle" [class]="getGoalStatus(goal)">
                      <span>{{ getGoalProgress(goal) }}%</span>
                    </div>
                  </div>
                </div>
                <div class="progress-bar-modern">
                  <div class="progress-track-modern"></div>
                  <div class="progress-fill-modern" [style.width.%]="getGoalProgress(goal)" [class]="getGoalStatus(goal)">
                    <div class="progress-glow"></div>
                  </div>
                  <div class="progress-markers">
                    <div class="marker" [class.active]="getGoalProgress(goal) >= 25" style="left: 25%"></div>
                    <div class="marker" [class.active]="getGoalProgress(goal) >= 50" style="left: 50%"></div>
                    <div class="marker" [class.active]="getGoalProgress(goal) >= 75" style="left: 75%"></div>
                  </div>
                </div>
                <div class="progress-footer-modern">
                  <div class="progress-stats">
                    <div class="stat">
                      <app-icon name="clock" size="14"></app-icon>
                      <span>{{ getMonthsRemaining(goal) }} meses</span>
                    </div>
                    <div class="stat">
                      <app-icon name="calendar" size="14"></app-icon>
                      <span>{{ goal.deadline | date:'MMM yyyy' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="goal-stats">
                <div class="stat-item">
                  <div class="stat-icon">
                    <app-icon name="calendar" size="16"></app-icon>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">Meta mensal</div>
                    <div class="stat-value">R$ {{ formatCurrency(goal.monthlyTarget) }}</div>
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon">
                    <app-icon name="clock" size="16"></app-icon>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">Prazo final</div>
                    <div class="stat-value">{{ goal.deadline }}</div>
                  </div>
                </div>
              </div>

              <div class="goal-footer">
                <button class="btn btn-ghost btn-sm" (click)="viewGoalDetails(goal)">
                  <app-icon name="eye" size="14"></app-icon>
                  <span>Ver detalhes</span>
                </button>
                <button class="btn btn-primary btn-sm" (click)="addMoney(goal)">
                  <app-icon name="plus" size="14"></app-icon>
                  <span>Adicionar valor</span>
                </button>
              </div>
            </div>

            <!-- Empty State -->
            <div class="empty-state" *ngIf="filteredGoals.length === 0">
              <div class="empty-icon">
                <app-icon name="target" size="48"></app-icon>
              </div>
              <h3>Nenhuma meta encontrada</h3>
              <p>Crie sua primeira meta para começar a realizar seus sonhos!</p>
              <button class="btn btn-primary" (click)="openCreateGoalModal()">
                <app-icon name="plus" size="16"></app-icon>
                <span>Criar primeira meta</span>
              </button>
            </div>
          </div>

          <!-- Sistema de Conquistas e Badges -->
          <div class="achievements-section animate-fade-in">
            <div class="achievements-header">
              <div class="header-content">
                <h3>
                  <app-icon name="trophy" size="20" className="text-warning"></app-icon>
                  Suas Conquistas
                </h3>
                <div class="achievements-stats">
                  <div class="stat-item">
                    <span class="stat-number">{{ userLevel }}</span>
                    <span class="stat-label">Nível</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{ totalPoints }}</span>
                    <span class="stat-label">Pontos</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{ unlockedBadges.length }}/{{ totalBadges }}</span>
                    <span class="stat-label">Badges</span>
                  </div>
                </div>
              </div>
              <button class="btn btn-outline btn-sm" (click)="toggleAchievementsView()">
                <app-icon [name]="showAllAchievements ? 'eye-slash' : 'eye'" size="16"></app-icon>
                <span>{{ showAllAchievements ? 'Ocultar' : 'Ver Todos' }}</span>
              </button>
            </div>

            <!-- Progress Bar do Nível -->
            <div class="level-progress">
              <div class="level-info">
                <span class="current-level">Nível {{ userLevel }}: {{ getCurrentLevelName() }}</span>
                <span class="next-level">Próximo: {{ getNextLevelName() }}</span>
              </div>
              <div class="progress-bar level-bar">
                <div class="progress-fill level-fill" [style.width.%]="getLevelProgress()"></div>
              </div>
              <div class="level-points">
                <span>{{ getCurrentLevelPoints() }} / {{ getNextLevelPoints() }} pontos</span>
              </div>
            </div>

            <!-- Badges Recentes -->
            <div class="recent-badges" *ngIf="recentBadges.length > 0">
              <h4>Conquistas Recentes 🎉</h4>
              <div class="badges-grid recent">
                <div class="badge-card recent" *ngFor="let badge of recentBadges">
                  <div class="badge-icon recent-glow">
                    <span class="badge-emoji">{{ badge.icon }}</span>
                  </div>
                  <div class="badge-info">
                    <div class="badge-name">{{ badge.name }}</div>
                    <div class="badge-description">{{ badge.description }}</div>
                    <div class="badge-date">{{ badge.unlockedAt | date:'dd/MM' }}</div>
                  </div>
                  <div class="badge-points">+{{ badge.points }}</div>
                </div>
              </div>
            </div>

            <!-- Todas as Conquistas -->
            <div class="all-achievements" [class.expanded]="showAllAchievements">
              <div class="achievements-categories">
                <!-- Categoria: Primeiros Passos -->
                <div class="achievement-category">
                  <h4>🚀 Primeiros Passos</h4>
                  <div class="badges-grid">
                    <div class="badge-card"
                         *ngFor="let badge of getBadgesByCategory('starter')"
                         [class.unlocked]="badge.unlocked"
                         [class.locked]="!badge.unlocked">
                      <div class="badge-icon" [class.unlocked-glow]="badge.unlocked">
                        <span class="badge-emoji" [class.grayscale]="!badge.unlocked">{{ badge.icon }}</span>
                      </div>
                      <div class="badge-info">
                        <div class="badge-name">{{ badge.name }}</div>
                        <div class="badge-description">{{ badge.description }}</div>
                        <div class="badge-progress" *ngIf="badge.progress && !badge.unlocked">
                          <div class="progress-bar mini">
                            <div class="progress-fill" [style.width.%]="(badge.current / badge.target) * 100"></div>
                          </div>
                          <span>{{ badge.current }}/{{ badge.target }}</span>
                        </div>
                      </div>
                      <div class="badge-points">{{ badge.points }}</div>
                    </div>
                  </div>
                </div>

                <!-- Categoria: Consistência -->
                <div class="achievement-category">
                  <h4>⚡ Consistência</h4>
                  <div class="badges-grid">
                    <div class="badge-card"
                         *ngFor="let badge of getBadgesByCategory('consistency')"
                         [class.unlocked]="badge.unlocked"
                         [class.locked]="!badge.unlocked">
                      <div class="badge-icon" [class.unlocked-glow]="badge.unlocked">
                        <span class="badge-emoji" [class.grayscale]="!badge.unlocked">{{ badge.icon }}</span>
                      </div>
                      <div class="badge-info">
                        <div class="badge-name">{{ badge.name }}</div>
                        <div class="badge-description">{{ badge.description }}</div>
                        <div class="badge-progress" *ngIf="badge.progress && !badge.unlocked">
                          <div class="progress-bar mini">
                            <div class="progress-fill" [style.width.%]="(badge.current / badge.target) * 100"></div>
                          </div>
                          <span>{{ badge.current }}/{{ badge.target }}</span>
                        </div>
                      </div>
                      <div class="badge-points">{{ badge.points }}</div>
                    </div>
                  </div>
                </div>

                <!-- Categoria: Marcos Financeiros -->
                <div class="achievement-category">
                  <h4>💰 Marcos Financeiros</h4>
                  <div class="badges-grid">
                    <div class="badge-card"
                         *ngFor="let badge of getBadgesByCategory('financial')"
                         [class.unlocked]="badge.unlocked"
                         [class.locked]="!badge.unlocked">
                      <div class="badge-icon" [class.unlocked-glow]="badge.unlocked">
                        <span class="badge-emoji" [class.grayscale]="!badge.unlocked">{{ badge.icon }}</span>
                      </div>
                      <div class="badge-info">
                        <div class="badge-name">{{ badge.name }}</div>
                        <div class="badge-description">{{ badge.description }}</div>
                        <div class="badge-progress" *ngIf="badge.progress && !badge.unlocked">
                          <div class="progress-bar mini">
                            <div class="progress-fill" [style.width.%]="(badge.current / badge.target) * 100"></div>
                          </div>
                          <span>R$ {{ formatCurrency(badge.current) }}/{{ formatCurrency(badge.target) }}</span>
                        </div>
                      </div>
                      <div class="badge-points">{{ badge.points }}</div>
                    </div>
                  </div>
                </div>

                <!-- Categoria: Metas Especiais -->
                <div class="achievement-category">
                  <h4>🎯 Metas Especiais</h4>
                  <div class="badges-grid">
                    <div class="badge-card"
                         *ngFor="let badge of getBadgesByCategory('goals')"
                         [class.unlocked]="badge.unlocked"
                         [class.locked]="!badge.unlocked">
                      <div class="badge-icon" [class.unlocked-glow]="badge.unlocked">
                        <span class="badge-emoji" [class.grayscale]="!badge.unlocked">{{ badge.icon }}</span>
                      </div>
                      <div class="badge-info">
                        <div class="badge-name">{{ badge.name }}</div>
                        <div class="badge-description">{{ badge.description }}</div>
                        <div class="badge-progress" *ngIf="badge.progress && !badge.unlocked">
                          <div class="progress-bar mini">
                            <div class="progress-fill" [style.width.%]="(badge.current / badge.target) * 100"></div>
                          </div>
                          <span>{{ badge.current }}/{{ badge.target }}</span>
                        </div>
                      </div>
                      <div class="badge-points">{{ badge.points }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Simulador de Cenários -->
          <div class="scenario-simulator animate-fade-in">
            <div class="simulator-header">
              <h3>
                <app-icon name="calculator" size="20" className="text-primary"></app-icon>
                Simulador de Cenários
              </h3>
              <p>Descubra como pequenos ajustes podem acelerar suas metas</p>
            </div>

            <div class="simulator-content">
              <div class="simulator-controls">
                <div class="control-group">
                  <label>Meta para simular</label>
                  <select class="simulator-select" [(ngModel)]="selectedGoalForSimulation" (change)="updateSimulation()">
                    <option value="" disabled>Escolha uma meta</option>
                    <option [value]="goal.id" *ngFor="let goal of activeGoalsForSimulation">
                      {{ goal.name }} - R$ {{ formatCurrency(goal.target) }}
                    </option>
                  </select>
                </div>

                <div class="scenarios-grid" *ngIf="selectedGoalForSimulation">
                  <div class="scenario-card current">
                    <div class="scenario-header">
                      <h4>📊 Cenário Atual</h4>
                      <span class="scenario-badge current">Base</span>
                    </div>
                    <div class="scenario-stats">
                      <div class="stat-row">
                        <span>Aporte mensal:</span>
                        <span class="stat-value">R$ {{ formatCurrency(getCurrentScenario().monthlyAmount) }}</span>
                      </div>
                      <div class="stat-row">
                        <span>Tempo restante:</span>
                        <span class="stat-value">{{ getCurrentScenario().months }} meses</span>
                      </div>
                      <div class="stat-row">
                        <span>Data prevista:</span>
                        <span class="stat-value">{{ getCurrentScenario().completionDate }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="scenario-card optimized">
                    <div class="scenario-header">
                      <h4>🚀 +20% no aporte</h4>
                      <span class="scenario-badge optimized">Otimizado</span>
                    </div>
                    <div class="scenario-stats">
                      <div class="stat-row">
                        <span>Aporte mensal:</span>
                        <span class="stat-value">R$ {{ formatCurrency(getOptimizedScenario(1.2).monthlyAmount) }}</span>
                      </div>
                      <div class="stat-row">
                        <span>Tempo restante:</span>
                        <span class="stat-value success">{{ getOptimizedScenario(1.2).months }} meses</span>
                      </div>
                      <div class="stat-row">
                        <span>Economia de tempo:</span>
                        <span class="stat-value success">-{{ getCurrentScenario().months - getOptimizedScenario(1.2).months }} meses</span>
                      </div>
                    </div>
                  </div>

                  <div class="scenario-card aggressive">
                    <div class="scenario-header">
                      <h4>⚡ +50% no aporte</h4>
                      <span class="scenario-badge aggressive">Agressivo</span>
                    </div>
                    <div class="scenario-stats">
                      <div class="stat-row">
                        <span>Aporte mensal:</span>
                        <span class="stat-value">R$ {{ formatCurrency(getOptimizedScenario(1.5).monthlyAmount) }}</span>
                      </div>
                      <div class="stat-row">
                        <span>Tempo restante:</span>
                        <span class="stat-value success">{{ getOptimizedScenario(1.5).months }} meses</span>
                      </div>
                      <div class="stat-row">
                        <span>Economia de tempo:</span>
                        <span class="stat-value success">-{{ getCurrentScenario().months - getOptimizedScenario(1.5).months }} meses</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="custom-scenario" *ngIf="selectedGoalForSimulation">
                  <h4>🎛️ Cenário Personalizado</h4>
                  <div class="custom-controls">
                    <div class="slider-group">
                      <label>Aporte mensal: R$ {{ customScenario.monthlyAmount.toLocaleString('pt-BR') }}</label>
                      <input type="range"
                             [(ngModel)]="customScenario.monthlyAmount"
                             [min]="getCurrentScenario().monthlyAmount * 0.5"
                             [max]="getCurrentScenario().monthlyAmount * 3"
                             [step]="50"
                             class="scenario-slider"
                             (input)="updateCustomScenario()">
                    </div>
                    <div class="custom-results">
                      <div class="result-item">
                        <span>⏱️ Tempo: {{ customScenario.months }} meses</span>
                      </div>
                      <div class="result-item">
                        <span>📅 Conclusão: {{ customScenario.completionDate }}</span>
                      </div>
                      <div class="result-item" [class.success]="customScenario.timeSaved > 0" [class.warning]="customScenario.timeSaved < 0">
                        <span>{{ customScenario.timeSaved > 0 ? '⚡' : '🐌' }}
                          {{ customScenario.timeSaved > 0 ? 'Economia' : 'Atraso' }}:
                          {{ getAbsoluteValue(customScenario.timeSaved) }} meses</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- WhatsApp Integration -->
          <div class="whatsapp-section animate-fade-in">
            <div class="whatsapp-card">
              <div class="whatsapp-header">
                <div class="header-content">
                  <div class="header-icon">
                    <app-icon name="chat-bubble-left-ellipsis" size="24"></app-icon>
                  </div>
                  <div class="header-text">
                    <h3>Acompanhamento via WhatsApp</h3>
                    <p>Receba lembretes e dicas personalizadas no seu celular</p>
                  </div>
                </div>
                <div class="whatsapp-toggle">
                  <label class="switch">
                    <input type="checkbox" [(ngModel)]="whatsappEnabled" (change)="toggleWhatsApp()">
                    <span class="slider round"></span>
                  </label>
                </div>
              </div>

              <div class="whatsapp-content" *ngIf="whatsappEnabled">
                <div class="form-group">
                  <label>Número do WhatsApp</label>
                  <input type="tel" [(ngModel)]="whatsappNumber" class="form-input" placeholder="(11) 99999-9999">
                </div>

                <div class="notification-preferences">
                  <h4>Preferências de Notificação</h4>
                  <div class="checkbox-group">
                    <label class="checkbox-item">
                      <input type="checkbox" [(ngModel)]="notificationSettings.goalReached">
                      <span class="checkmark"></span>
                      <span class="checkbox-label">Meta alcançada</span>
                    </label>
                    <label class="checkbox-item">
                      <input type="checkbox" [(ngModel)]="notificationSettings.weeklyReminder">
                      <span class="checkmark"></span>
                      <span class="checkbox-label">Lembrete semanal de aporte</span>
                    </label>
                    <label class="checkbox-item">
                      <input type="checkbox" [(ngModel)]="notificationSettings.monthlyReport">
                      <span class="checkmark"></span>
                      <span class="checkbox-label">Relatório mensal</span>
                    </label>
                    <label class="checkbox-item">
                      <input type="checkbox" [(ngModel)]="notificationSettings.smartTips">
                      <span class="checkmark"></span>
                      <span class="checkbox-label">Dicas inteligentes</span>
                    </label>
                  </div>
                </div>

                <div class="whatsapp-actions">
                  <button class="btn btn-success" (click)="saveWhatsAppSettings()">
                    <app-icon name="check" size="16"></app-icon>
                    <span>Salvar Configurações</span>
                  </button>
                </div>
              </div>

              <div class="whatsapp-preview" *ngIf="whatsappEnabled">
                <h4>Prévia das Mensagens</h4>
                <div class="message-preview">
                  <div class="message-bubble">
                    <div class="message-header">
                      <app-icon name="target" size="16"></app-icon>
                      <strong>VentureFi</strong>
                    </div>
                    <div class="message-content">
                      Oi! Sua meta "Carro Novo" está 33% concluída. Continue assim! 💪<br>
                      <small>Faltam R$ 30.000 para alcançar seu objetivo.</small>
                    </div>
                  </div>
                  <div class="message-bubble">
                    <div class="message-header">
                      <app-icon name="light-bulb" size="16"></app-icon>
                      <strong>Dica Inteligente</strong>
                    </div>
                    <div class="message-content">
                      Você está gastando R$ 450/mês com delivery. Reduzindo 30%, você pode acelerar sua meta em 2 meses! 🚀
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </div>

    <!-- Create/Edit Goal Modal -->
    <div class="modal-overlay" *ngIf="showCreateModal" (click)="closeCreateModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ editingGoal ? 'Editar Meta' : 'Nova Meta' }}</h3>
          <button class="modal-close" (click)="closeCreateModal()">
            <app-icon name="x-mark" size="20"></app-icon>
          </button>
        </div>

        <form class="modal-form" (ngSubmit)="saveGoal()" #goalForm="ngForm">
          <div class="form-group">
            <label>Nome da meta *</label>
            <input type="text" [(ngModel)]="newGoal.name" name="name" class="form-input" placeholder="Ex: Carro novo, Viagem, Casa própria" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Valor da meta (R$) *</label>
              <input type="number" [(ngModel)]="newGoal.target" name="target" class="form-input" placeholder="Ex: 50000" required>
            </div>
            <div class="form-group">
              <label>Valor inicial (R$)</label>
              <input type="number" [(ngModel)]="newGoal.saved" name="saved" class="form-input" placeholder="Ex: 5000">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Origem *</label>
              <select [(ngModel)]="newGoal.origin" name="origin" class="form-input" required>
                <option value="personal">Pessoal</option>
                <option value="business">Negócio</option>
              </select>
            </div>
            <div class="form-group">
              <label>Prioridade</label>
              <select [(ngModel)]="newGoal.priority" name="priority" class="form-input">
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Prazo (meses) *</label>
              <input type="number" [(ngModel)]="newGoal.months" name="months" class="form-input" placeholder="Ex: 24" required>
            </div>
            <div class="form-group">
              <label>Ícone</label>
              <select [(ngModel)]="newGoal.icon" name="icon" class="form-input">
                <option value="🚗">🚗 Carro</option>
                <option value="✈️">✈️ Viagem</option>
                <option value="🏠">🏠 Casa</option>
                <option value="💍">💍 Casamento</option>
                <option value="🎓">🎓 Educação</option>
                <option value="💻">💻 Eletrônicos</option>
                <option value="🏦">🏦 Emergência</option>
                <option value="🎯">🎯 Outros</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Descrição (opcional)</label>
            <textarea [(ngModel)]="newGoal.description" name="description" class="form-input" rows="3" placeholder="Descreva sua meta e o que ela significa para você"></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" (click)="closeCreateModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary" [disabled]="!goalForm.form.valid">
              {{ editingGoal ? 'Salvar alterações' : 'Criar meta' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    /* Dream Pursuit Page Styles */

    .sidebar-footer {
      border-top: 1px solid var(--border-primary);
      padding: var(--space-6);
      flex-shrink: 0;
      background: var(--bg-secondary);
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-4);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
      color: var(--text-inverse);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
      flex-shrink: 0;
      box-shadow: var(--shadow-sm);
    }

    .user-info {
      flex: 1;
      min-width: 0;
    }

    .user-name {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.875rem;
      line-height: 1.2;
      margin-bottom: var(--space-1);
    }

    .user-plan {
      font-size: 0.75rem;
      color: var(--text-tertiary);
      line-height: 1;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      color: var(--text-tertiary);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-md);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .logout-btn:hover {
      color: var(--accent-red);
      background: var(--accent-red-light);
    }

    /* Main Content Area with Improved Spacing */
    .main-content-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      margin-left: var(--space-8);
      background: transparent;
      padding: var(--space-6) var(--space-8) var(--space-8) var(--space-8);
    }

    /* Modern Page Header */
    .page-header {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: var(--radius-2xl);
      padding: var(--space-8);
      margin-bottom: var(--space-8);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--space-6);
    }

    .page-title-section {
      flex: 1;
    }

    .page-title {
      color: var(--text-primary);
      font-size: 2.25rem;
      font-weight: 800;
      margin: 0 0 var(--space-3) 0;
      letter-spacing: -0.025em;
      background: linear-gradient(135deg, #1e293b, #475569);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1.1;
    }

    .page-description {
      color: var(--text-secondary);
      margin: 0;
      font-size: 1.125rem;
      font-weight: 500;
      line-height: 1.5;
      max-width: 600px;
    }

    .header-actions {
      display: flex;
      gap: var(--space-4);
      align-items: center;
    }

    .btn-primary, .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-4) var(--space-6);
      border-radius: var(--radius-xl);
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      white-space: nowrap;
      backdrop-filter: blur(10px);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: var(--text-secondary);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.9);
      color: var(--text-primary);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #5a6fd8, #6a4190);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    /* Content Wrapper */
    .content-wrapper {
      flex: 1;
      overflow-y: auto;
      padding-right: var(--space-2);
    }

    .content-wrapper::-webkit-scrollbar {
      width: 8px;
    }

    .content-wrapper::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.05);
      border-radius: var(--radius-full);
    }

    .content-wrapper::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: var(--radius-full);
    }

    .content-wrapper::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.3);
    }

    /* Overview Cards Modern */
    .overview-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: var(--space-8);
      margin-bottom: var(--space-10);
    }

    .overview-card {
      position: relative;
      border-radius: var(--radius-2xl);
      padding: 0;
      transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
      overflow: hidden;
      min-height: 180px;
    }

    .gradient-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .gradient-success {
      background: linear-gradient(135deg, #2ECC71 0%, #27AE60 100%);
    }

    .gradient-warning {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .card-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }

    .card-content-wrapper {
      position: relative;
      z-index: 2;
      padding: var(--space-6);
      height: 100%;
    }

    .hover-lift-smooth {
      transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .hover-lift-smooth:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-4);
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

    .card-icon.success {
      background: var(--accent-green-light);
      color: var(--accent-green);
    }

    .card-icon.primary {
      background: var(--accent-blue-light);
      color: var(--accent-blue);
    }

    .card-icon.warning {
      background: var(--accent-orange-light);
      color: var(--accent-orange);
    }

    .card-trend {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: 0.75rem;
      font-weight: 600;
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-md);
    }

    .card-trend.up {
      background: var(--accent-green-light);
      color: var(--accent-green);
    }

    .card-meta {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .card-months {
      font-size: 0.75rem;
      color: var(--text-tertiary);
      font-weight: 500;
    }

    .card-content {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .card-label {
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .card-value {
      color: var(--text-primary);
      font-size: 1.75rem;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: var(--space-1);
    }

    .card-value.success {
      color: var(--accent-green);
    }

    .card-subtitle {
      color: var(--text-tertiary);
      font-size: 0.75rem;
      font-weight: 500;
    }

    /* Filters */
    .filters-section {
      margin-bottom: var(--space-6);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
    }

    .section-header h3 {
      color: var(--text-primary);
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }

    .section-meta {
      color: var(--text-tertiary);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .filters-row {
      display: flex;
      gap: var(--space-4);
      align-items: end;
      background: var(--bg-primary);
      padding: var(--space-6);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-primary);
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      min-width: 160px;
    }

    .filter-group label {
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .filter-select {
      padding: var(--space-2) var(--space-3);
      border: 1px solid var(--border-secondary);
      border-radius: var(--radius-lg);
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    .filter-select:focus {
      outline: none;
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px var(--accent-blue-light);
    }

    /* Goals Grid */
    .goals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: var(--space-6);
      margin-bottom: var(--space-8);
    }

    .goal-card {
      background: var(--bg-primary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }

    .goal-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }

    .goal-card.status-ahead {
      border-left: 4px solid var(--accent-green);
    }

    .goal-card.status-behind {
      border-left: 4px solid var(--accent-red);
    }

    .goal-card.status-on-track {
      border-left: 4px solid var(--accent-blue);
    }

    .goal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-6);
    }

    .goal-info {
      display: flex;
      gap: var(--space-4);
      flex: 1;
    }

    .goal-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .goal-icon.priority-high {
      background: var(--accent-red-light);
    }

    .goal-icon.priority-medium {
      background: var(--accent-orange-light);
    }

    .goal-icon.priority-low {
      background: var(--accent-green-light);
    }

    .goal-details {
      flex: 1;
    }

    .goal-title {
      color: var(--text-primary);
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0 0 var(--space-2) 0;
      line-height: 1.3;
    }

    .goal-badges {
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
    }

    .origin-badge,
    .status-badge,
    .priority-badge {
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-md);
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .origin-badge.personal {
      background: var(--accent-blue-light);
      color: var(--accent-blue);
    }

    .origin-badge.business {
      background: var(--accent-purple-light);
      color: var(--accent-purple);
    }

    .status-badge.ahead {
      background: var(--accent-green-light);
      color: var(--accent-green);
    }

    .status-badge.on-track {
      background: var(--accent-blue-light);
      color: var(--accent-blue);
    }

    .status-badge.behind {
      background: var(--accent-red-light);
      color: var(--accent-red);
    }

    .priority-badge.high {
      background: var(--accent-red-light);
      color: var(--accent-red);
    }

    .priority-badge.medium {
      background: var(--accent-orange-light);
      color: var(--accent-orange);
    }

    .priority-badge.low {
      background: var(--accent-green-light);
      color: var(--accent-green);
    }

    .goal-actions {
      position: relative;
    }

    .action-btn {
      background: none;
      border: none;
      color: var(--text-tertiary);
      cursor: pointer;
      padding: var(--space-2);
      border-radius: var(--radius-md);
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      background: var(--bg-secondary);
      color: var(--text-primary);
    }

    .action-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: var(--bg-primary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      z-index: 10;
      min-width: 140px;
      overflow: hidden;
    }

    .action-menu button {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      width: 100%;
      padding: var(--space-3) var(--space-4);
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      font-size: 0.875rem;
      color: var(--text-secondary);
      transition: all 0.2s ease;
    }

    .action-menu button:hover {
      background: var(--bg-secondary);
      color: var(--text-primary);
    }

    .action-menu button.danger {
      color: var(--accent-red);
    }

    .action-menu button.danger:hover {
      background: var(--accent-red-light);
    }

    /* Goal Progress */
    .goal-progress {
      margin-bottom: var(--space-6);
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-2);
    }

    .progress-amount {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 1rem;
    }

    .progress-target {
      font-size: 0.875rem;
      color: var(--text-tertiary);
    }

    .progress-bar {
      height: 8px;
      background: var(--bg-secondary);
      border-radius: var(--radius-full);
      overflow: hidden;
      margin-bottom: var(--space-2);
    }

    .progress-fill {
      height: 100%;
      border-radius: var(--radius-full);
      transition: width 0.3s ease;
    }

    .progress-fill.ahead {
      background: var(--accent-green);
    }

    .progress-fill.on-track {
      background: var(--accent-blue);
    }

    .progress-fill.behind {
      background: var(--accent-red);
    }

    .progress-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .progress-percentage {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .progress-time {
      font-size: 0.875rem;
      color: var(--text-tertiary);
    }

    /* Goal Stats */
    .goal-stats {
      display: flex;
      gap: var(--space-4);
      margin-bottom: var(--space-6);
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      flex: 1;
      padding: var(--space-3);
      background: var(--bg-secondary);
      border-radius: var(--radius-lg);
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: var(--bg-primary);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      flex-shrink: 0;
    }

    .stat-content {
      flex: 1;
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--text-tertiary);
      margin-bottom: var(--space-1);
    }

    .stat-value {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    /* Goal Footer */
    .goal-footer {
      display: flex;
      gap: var(--space-3);
    }

    .goal-footer .btn {
      flex: 1;
    }

    /* Empty State */
    .empty-state {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-12);
      background: var(--bg-primary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-xl);
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
      margin-bottom: var(--space-6);
    }

    /* WhatsApp Section */
    .whatsapp-section {
      margin-bottom: var(--space-8);
    }

    .whatsapp-card {
      background: var(--bg-primary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-xl);
      padding: var(--space-6);
    }

    .whatsapp-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-6);
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .header-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: var(--accent-green-light);
      border-radius: var(--radius-lg);
      color: var(--accent-green);
    }

    .header-text h3 {
      color: var(--text-primary);
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0 0 var(--space-1) 0;
    }

    .header-text p {
      color: var(--text-secondary);
      margin: 0;
      font-size: 0.875rem;
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 34px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--bg-secondary);
      transition: 0.4s;
      border-radius: 34px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: var(--text-inverse);
      transition: 0.4s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: var(--accent-green);
    }

    input:checked + .slider:before {
      transform: translateX(26px);
    }

    .whatsapp-content {
      margin-bottom: var(--space-6);
    }

    .form-group {
      margin-bottom: var(--space-4);
    }

    .form-group label {
      display: block;
      margin-bottom: var(--space-2);
      font-weight: 500;
      color: var(--text-primary);
      font-size: 0.875rem;
    }

    .form-input {
      width: 100%;
      padding: var(--space-3) var(--space-4);
      border: 1px solid var(--border-secondary);
      border-radius: var(--radius-lg);
      font-size: 0.875rem;
      transition: all 0.2s ease;
      background: var(--bg-primary);
      color: var(--text-primary);
    }

    .form-input:focus {
      outline: none;
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px var(--accent-blue-light);
    }

    .notification-preferences h4 {
      color: var(--text-primary);
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: var(--space-4);
    }

    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      margin-bottom: var(--space-6);
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      cursor: pointer;
    }

    .checkbox-item input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: var(--accent-green);
    }

    .checkbox-label {
      color: var(--text-primary);
      font-size: 0.875rem;
    }

    .whatsapp-preview h4 {
      color: var(--text-primary);
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: var(--space-4);
    }

    .message-preview {
      background: var(--accent-green-light);
      padding: var(--space-6);
      border-radius: var(--radius-lg);
      border: 1px solid var(--accent-green);
    }

    .message-bubble {
      background: var(--bg-primary);
      padding: var(--space-4);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-4);
      box-shadow: var(--shadow-sm);
    }

    .message-bubble:last-child {
      margin-bottom: 0;
    }

    .message-header {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-bottom: var(--space-2);
    }

    .message-header strong {
      color: var(--accent-green);
      font-size: 0.875rem;
    }

    .message-content {
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .message-content small {
      color: var(--text-tertiary);
      font-size: 0.75rem;
    }

    /* Sistema de Conquistas */
    .achievements-section {
      background: var(--bg-primary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      margin-bottom: var(--space-8);
    }

    .achievements-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-6);
    }

    .achievements-header h3 {
      color: var(--text-primary);
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .achievements-stats {
      display: flex;
      gap: var(--space-6);
    }

    .achievements-stats .stat-item {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--accent-orange);
      line-height: 1.2;
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    /* Level Progress */
    .level-progress {
      background: var(--bg-secondary);
      padding: var(--space-4);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-6);
    }

    .level-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-2);
    }

    .current-level {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.875rem;
    }

    .next-level {
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }

    .level-bar {
      height: 12px;
      background: var(--bg-tertiary);
      margin-bottom: var(--space-2);
    }

    .level-fill {
      background: linear-gradient(90deg, var(--accent-orange), var(--accent-red));
      border-radius: var(--radius-full);
    }

    .level-points {
      text-align: center;
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }

    /* Recent Badges */
    .recent-badges {
      margin-bottom: var(--space-6);
    }

    .recent-badges h4 {
      color: var(--text-primary);
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: var(--space-4);
    }

    .badges-grid {
      display: grid;
      gap: var(--space-4);
    }

    .badges-grid.recent {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }

    .badges-grid:not(.recent) {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    }

    .badge-card {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      background: var(--bg-secondary);
      padding: var(--space-4);
      border-radius: var(--radius-lg);
      border: 2px solid transparent;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .badge-card.recent {
      background: linear-gradient(135deg, var(--accent-green-light), var(--accent-blue-light));
      border-color: var(--accent-green);
    }

    .badge-card.unlocked {
      border-color: var(--accent-green);
      background: var(--accent-green-light);
    }

    .badge-card.locked {
      opacity: 0.6;
      background: var(--bg-tertiary);
    }

    .badge-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .badge-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: var(--bg-primary);
      border-radius: var(--radius-lg);
      flex-shrink: 0;
      font-size: 1.5rem;
      position: relative;
    }

    .badge-icon.recent-glow {
      box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
      animation: glow 2s ease-in-out infinite alternate;
    }

    .badge-icon.unlocked-glow {
      box-shadow: 0 0 10px rgba(34, 197, 94, 0.2);
    }

    @keyframes glow {
      from { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
      to { box-shadow: 0 0 30px rgba(34, 197, 94, 0.6); }
    }

    .badge-emoji.grayscale {
      filter: grayscale(100%);
    }

    .badge-info {
      flex: 1;
    }

    .badge-name {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.875rem;
      margin-bottom: var(--space-1);
    }

    .badge-description {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin-bottom: var(--space-2);
    }

    .badge-date {
      font-size: 0.625rem;
      color: var(--text-tertiary);
      font-weight: 500;
    }

    .badge-progress {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }

    .progress-bar.mini {
      height: 4px;
      width: 60px;
      background: var(--bg-tertiary);
      flex-shrink: 0;
    }

    .badge-points {
      font-weight: 600;
      color: var(--accent-orange);
      font-size: 0.875rem;
      flex-shrink: 0;
    }

    /* All Achievements */
    .all-achievements {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .all-achievements.expanded {
      max-height: 2000px;
    }

    .achievement-category {
      margin-bottom: var(--space-6);
    }

    .achievement-category h4 {
      color: var(--text-primary);
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: var(--space-4);
      padding-bottom: var(--space-2);
      border-bottom: 2px solid var(--border-primary);
    }

    /* Simulador de Cenários */
    .scenario-simulator {
      background: var(--bg-primary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      margin-bottom: var(--space-8);
    }

    .simulator-header {
      margin-bottom: var(--space-6);
    }

    .simulator-header h3 {
      color: var(--text-primary);
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0 0 var(--space-2) 0;
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .simulator-header p {
      color: var(--text-secondary);
      margin: 0;
      font-size: 0.875rem;
    }

    .control-group {
      margin-bottom: var(--space-6);
    }

    .control-group label {
      display: block;
      font-weight: 500;
      color: var(--text-primary);
      font-size: 0.875rem;
      margin-bottom: var(--space-2);
    }

    .simulator-select {
      width: 100%;
      padding: var(--space-3) var(--space-4);
      border: 1px solid var(--border-secondary);
      border-radius: var(--radius-lg);
      background: var(--bg-secondary);
      color: var(--text-primary);
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    .simulator-select:focus {
      outline: none;
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px var(--accent-blue-light);
    }

    .scenarios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--space-4);
      margin-bottom: var(--space-6);
    }

    .scenario-card {
      background: var(--bg-secondary);
      border: 2px solid var(--border-primary);
      border-radius: var(--radius-lg);
      padding: var(--space-4);
      transition: all 0.2s ease;
    }

    .scenario-card.current {
      border-color: var(--accent-blue);
      background: var(--accent-blue-light);
    }

    .scenario-card.optimized {
      border-color: var(--accent-green);
      background: var(--accent-green-light);
    }

    .scenario-card.aggressive {
      border-color: var(--accent-orange);
      background: var(--accent-orange-light);
    }

    .scenario-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
    }

    .scenario-header h4 {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .scenario-badge {
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-md);
      font-size: 0.625rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .scenario-badge.current {
      background: var(--accent-blue);
      color: var(--text-inverse);
    }

    .scenario-badge.optimized {
      background: var(--accent-green);
      color: var(--text-inverse);
    }

    .scenario-badge.aggressive {
      background: var(--accent-orange);
      color: var(--text-inverse);
    }

    .scenario-stats {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
    }

    .stat-value {
      font-weight: 600;
      color: var(--text-primary);
    }

    .stat-value.success {
      color: var(--accent-green);
    }

    /* Custom Scenario */
    .custom-scenario {
      background: var(--bg-secondary);
      padding: var(--space-6);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-primary);
    }

    .custom-scenario h4 {
      color: var(--text-primary);
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 var(--space-4) 0;
    }

    /* Estilos Modernos - Animações e Micro-interações */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes stagger {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .animate-fade-in {
      animation: fadeIn 0.6s ease-out;
    }

    .animate-slide-up {
      animation: slideUp 0.8s ease-out;
    }

    .animate-stagger {
      animation: stagger 0.6s ease-out;
    }

    .animate-stagger > * {
      animation: stagger 0.6s ease-out;
      animation-fill-mode: both;
    }

    .animate-stagger > *:nth-child(1) { animation-delay: 0.1s; }
    .animate-stagger > *:nth-child(2) { animation-delay: 0.2s; }
    .animate-stagger > *:nth-child(3) { animation-delay: 0.3s; }
    .animate-stagger > *:nth-child(4) { animation-delay: 0.4s; }

    /* Capacity Indicator Premium */
    .capacity-card-premium {
      position: relative;
      background: var(--bg-primary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-2xl);
      padding: var(--space-8);
      overflow: hidden;
      transition: all 0.4s ease;
    }

    .capacity-background-glow {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.1;
      border-radius: inherit;
    }

    .glow-excellent { background: radial-gradient(circle, #2ECC71, transparent); }
    .glow-good { background: radial-gradient(circle, #3498DB, transparent); }
    .glow-limited { background: radial-gradient(circle, #F39C12, transparent); }
    .glow-critical { background: radial-gradient(circle, #E74C3C, transparent); }

    .capacity-header-modern {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-6);
    }

    .capacity-icon-premium {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      border-radius: var(--radius-full);
      margin-right: var(--space-4);
    }

    .icon-glow {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: inherit;
      animation: pulse 2s infinite;
    }

    .icon-excellent {
      background: linear-gradient(135deg, #2ECC71, #27AE60);
      color: white;
    }

    .icon-good {
      background: linear-gradient(135deg, #3498DB, #2980B9);
      color: white;
    }

    .icon-warning {
      background: linear-gradient(135deg, #F39C12, #E67E22);
      color: white;
    }

    .icon-critical {
      background: linear-gradient(135deg, #E74C3C, #C0392B);
      color: white;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.7; transform: scale(1); }
      50% { opacity: 0.3; transform: scale(1.05); }
    }

    .capacity-info-modern {
      flex: 1;
    }

    .capacity-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 var(--space-2) 0;
    }

    .capacity-status-badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-full);
      font-size: 0.875rem;
      font-weight: 600;
    }

    .badge-excellent {
      background: linear-gradient(135deg, #2ECC71, #27AE60);
      color: white;
    }

    .badge-good {
      background: linear-gradient(135deg, #3498DB, #2980B9);
      color: white;
    }

    .badge-limited {
      background: linear-gradient(135deg, #F39C12, #E67E22);
      color: white;
    }

    .badge-critical {
      background: linear-gradient(135deg, #E74C3C, #C0392B);
      color: white;
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: currentColor;
      animation: blink 2s infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .capacity-score {
      text-align: center;
    }

    .score-circle {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 4px solid;
      position: relative;
    }

    .score-excellent { border-color: #2ECC71; color: #2ECC71; }
    .score-good { border-color: #3498DB; color: #3498DB; }
    .score-limited { border-color: #F39C12; color: #F39C12; }
    .score-critical { border-color: #E74C3C; color: #E74C3C; }

    .score-number {
      font-size: 1.5rem;
      font-weight: 800;
      line-height: 1;
    }

    .score-label {
      font-size: 0.75rem;
      font-weight: 500;
      opacity: 0.8;
    }

    /* Capacity Metrics Grid */
    .capacity-metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--space-6);
      margin-bottom: var(--space-6);
    }

    .metric-card {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-6);
      background: var(--bg-secondary);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-primary);
      transition: all 0.3s ease;
    }

    .metric-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .metric-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      flex-shrink: 0;
    }

    .metric-icon.success {
      background: linear-gradient(135deg, #2ECC71, #27AE60);
      color: white;
    }

    .metric-icon.primary {
      background: linear-gradient(135deg, #3498DB, #2980B9);
      color: white;
    }

    .metric-icon.warning {
      background: linear-gradient(135deg, #F39C12, #E67E22);
      color: white;
    }

    .metric-content {
      flex: 1;
    }

    .metric-label-modern {
      display: block;
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
      margin-bottom: var(--space-1);
    }

    .metric-value-modern {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: var(--space-2);
    }

    .success-gradient {
      background: linear-gradient(45deg, #2ECC71, #27AE60);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .primary-gradient {
      background: linear-gradient(45deg, #3498DB, #2980B9);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .warning-gradient {
      background: linear-gradient(45deg, #F39C12, #E67E22);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .metric-trend {
      font-size: 0.75rem;
      font-weight: 500;
    }

    .metric-trend.positive { color: var(--accent-green); }
    .metric-trend.neutral { color: var(--text-tertiary); }

    .metric-progress {
      position: relative;
      height: 4px;
      background: var(--bg-tertiary);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .progress-track {
      width: 100%;
      height: 100%;
      background: var(--bg-tertiary);
      border-radius: inherit;
    }

    .progress-bar-modern {
      height: 100%;
      border-radius: inherit;
      transition: width 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .progress-bar-modern.primary {
      background: linear-gradient(90deg, #3498DB, #2980B9);
    }

    .progress-bar-modern.warning {
      background: linear-gradient(90deg, #F39C12, #E67E22);
    }

    /* Capacity Recommendation Modern */
    .capacity-recommendation-modern {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-4);
      background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-primary);
    }

    .recommendation-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #F39C12, #E67E22);
      color: white;
      border-radius: var(--radius-lg);
      flex-shrink: 0;
    }

    .recommendation-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
    }

    .recommendation-text {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .recommendation-action {
      background: none;
      border: 1px solid var(--accent-blue);
      color: var(--accent-blue);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-md);
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .recommendation-action:hover {
      background: var(--accent-blue);
      color: white;
    }

    /* Goal Cards Modern */
    .goal-card-modern {
      position: relative;
      background: var(--bg-primary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-2xl);
      padding: 0;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .hover-lift-premium {
      transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .hover-lift-premium:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
    }

    .goal-background-pattern {
      position: absolute;
      top: 0;
      right: 0;
      width: 120px;
      height: 120px;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23E5E7EB" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
      opacity: 0.3;
    }

    .goal-glow-effect {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.1;
      border-radius: inherit;
    }

    .glow-ahead { background: radial-gradient(circle at top right, #2ECC71, transparent); }
    .glow-on-track { background: radial-gradient(circle at top right, #3498DB, transparent); }
    .glow-behind { background: radial-gradient(circle at top right, #E74C3C, transparent); }

    .goal-header-modern {
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: var(--space-6);
      margin: 0;
    }

    .goal-info-modern {
      display: flex;
      gap: var(--space-4);
      flex: 1;
    }

    .goal-icon-premium {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: var(--radius-xl);
      flex-shrink: 0;
    }

    .icon-ring {
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border: 2px solid;
      border-radius: inherit;
      opacity: 0.3;
    }

    .priority-high-glow .icon-ring { border-color: #E74C3C; }
    .priority-medium-glow .icon-ring { border-color: #F39C12; }
    .priority-low-glow .icon-ring { border-color: #2ECC71; }

    .icon-emoji {
      font-size: 2rem;
      position: relative;
      z-index: 2;
    }

    .priority-indicator {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid var(--bg-primary);
    }

    .priority-indicator.high { background: #E74C3C; }
    .priority-indicator.medium { background: #F39C12; }
    .priority-indicator.low { background: #2ECC71; }

    .goal-details-modern {
      flex: 1;
      min-width: 0;
    }

    .goal-title-modern {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 var(--space-3) 0;
      line-height: 1.3;
    }

    .goal-badges-modern {
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
    }

    .origin-badge-modern,
    .status-badge-modern,
    .priority-badge-modern {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: var(--space-1);
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .badge-icon {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: var(--space-1);
      animation: pulse-dot 2s infinite;
    }

    @keyframes pulse-dot {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .origin-badge-modern.personal {
      background: linear-gradient(135deg, #3498DB, #2980B9);
      color: white;
    }

    .origin-badge-modern.business {
      background: linear-gradient(135deg, #9B59B6, #8E44AD);
      color: white;
    }

    .status-badge-modern.ahead {
      background: linear-gradient(135deg, #2ECC71, #27AE60);
      color: white;
    }

    .status-badge-modern.on-track {
      background: linear-gradient(135deg, #3498DB, #2980B9);
      color: white;
    }

    .status-badge-modern.behind {
      background: linear-gradient(135deg, #E74C3C, #C0392B);
      color: white;
    }

    .priority-badge-modern.high {
      background: linear-gradient(135deg, #E74C3C, #C0392B);
      color: white;
    }

    .priority-badge-modern.medium {
      background: linear-gradient(135deg, #F39C12, #E67E22);
      color: white;
    }

    .priority-badge-modern.low {
      background: linear-gradient(135deg, #2ECC71, #27AE60);
      color: white;
    }

    .goal-actions-modern {
      position: relative;
      z-index: 3;
    }

    .action-btn-modern {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: var(--text-secondary);
      cursor: pointer;
      padding: var(--space-3);
      border-radius: var(--radius-lg);
      transition: all 0.3s ease;
    }

    .action-btn-modern:hover {
      background: rgba(255, 255, 255, 0.2);
      color: var(--text-primary);
      transform: scale(1.05);
    }

    .action-menu-modern {
      position: absolute;
      top: calc(100% + var(--space-2));
      right: 0;
      background: var(--bg-primary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      z-index: 20;
      min-width: 160px;
      overflow: hidden;
      animation: fadeInScale 0.2s ease-out;
    }

    @keyframes fadeInScale {
      from { opacity: 0; transform: scale(0.95) translateY(-10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      width: 100%;
      padding: var(--space-3) var(--space-4);
      background: none;
      border: none;
      color: var(--text-primary);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border-bottom: 1px solid var(--border-primary);
    }

    .menu-item:last-child {
      border-bottom: none;
    }

    .menu-item:hover {
      background: var(--bg-secondary);
      color: var(--text-primary);
    }

    .menu-item.edit:hover {
      background: linear-gradient(135deg, #3498DB, #2980B9);
      color: white;
    }

    .menu-item.add:hover {
      background: linear-gradient(135deg, #2ECC71, #27AE60);
      color: white;
    }

    .menu-item.danger:hover {
      background: linear-gradient(135deg, #E74C3C, #C0392B);
      color: white;
    }

    /* Goal Progress Modern */
    .goal-progress-modern {
      position: relative;
      z-index: 2;
      padding: 0 var(--space-6) var(--space-6);
    }

    .progress-header-modern {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
    }

    .amount-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .progress-amount-modern {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1.2;
    }

    .progress-target-modern {
      font-size: 0.875rem;
      color: var(--text-tertiary);
      font-weight: 500;
    }

    .percentage-section {
      text-align: center;
    }

    .percentage-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 3px solid;
      font-size: 0.875rem;
      font-weight: 700;
    }

    .percentage-circle.ahead { border-color: #2ECC71; color: #2ECC71; }
    .percentage-circle.on-track { border-color: #3498DB; color: #3498DB; }
    .percentage-circle.behind { border-color: #E74C3C; color: #E74C3C; }

    .progress-bar-modern {
      position: relative;
      height: 8px;
      background: var(--bg-tertiary);
      border-radius: var(--radius-full);
      overflow: hidden;
      margin-bottom: var(--space-4);
    }

    .progress-track-modern {
      width: 100%;
      height: 100%;
      background: var(--bg-tertiary);
      border-radius: inherit;
    }

    .progress-fill-modern {
      height: 100%;
      border-radius: inherit;
      position: relative;
      transition: width 1s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .progress-fill-modern.ahead {
      background: linear-gradient(90deg, #2ECC71, #27AE60);
    }

    .progress-fill-modern.on-track {
      background: linear-gradient(90deg, #3498DB, #2980B9);
    }

    .progress-fill-modern.behind {
      background: linear-gradient(90deg, #E74C3C, #C0392B);
    }

    .progress-glow {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: shimmer 2s infinite;
    }

    .progress-markers {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .marker {
      position: absolute;
      top: -2px;
      width: 4px;
      height: 12px;
      background: var(--bg-primary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-sm);
      transform: translateX(-50%);
      transition: all 0.3s ease;
    }

    .marker.active {
      background: var(--accent-green);
      border-color: var(--accent-green);
      box-shadow: 0 0 8px rgba(46, 204, 113, 0.4);
    }

    .progress-footer-modern {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .progress-stats {
      display: flex;
      gap: var(--space-4);
    }

    .stat {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: 0.75rem;
      color: var(--text-tertiary);
      font-weight: 500;
    }

    /* Modern Responsive Design */
    @media (max-width: 1024px) {
      .sidebar-modern {
        width: 280px;
      }

      .main-content-area {
        margin-left: var(--space-6);
        padding: var(--space-4) var(--space-6) var(--space-6) var(--space-6);
      }

      .page-title {
        font-size: 2rem;
      }

      .page-description {
        font-size: 1rem;
      }
    }

    @media (max-width: 768px) {
      .dream-pursuit-container {
        flex-direction: column;
      }

      .sidebar-modern {
        position: fixed;
        top: 68px;
        left: -300px;
        width: 280px;
        height: calc(100vh - 68px);
        z-index: 800;
        transition: left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        box-shadow: 10px 0 30px rgba(0, 0, 0, 0.1);
      }

      .sidebar-modern.mobile-open {
        left: 0;
      }

      .mobile-header {
        display: flex;
      }

      .main-content-area {
        margin-left: 0;
        padding: var(--space-4);
        padding-top: calc(68px + var(--space-4));
      }

      .page-header {
        padding: var(--space-6);
        margin-bottom: var(--space-6);
      }

      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-4);
      }

      .page-title {
        font-size: 1.75rem;
      }

      .page-description {
        font-size: 1rem;
        max-width: none;
      }

      .header-actions {
        width: 100%;
        justify-content: stretch;
      }

      .btn-primary, .btn-secondary {
        flex: 1;
        justify-content: center;
      }

      .overview-cards {
        grid-template-columns: 1fr;
        gap: var(--space-6);
        margin-bottom: var(--space-8);
      }

      .card-content-wrapper {
        padding: var(--space-4);
      }

      .card-value-modern {
        font-size: 1.5rem;
      }

      .capacity-metrics-grid {
        grid-template-columns: 1fr;
        gap: var(--space-4);
      }

      .goals-grid {
        grid-template-columns: 1fr;
        gap: var(--space-4);
      }

      .hover-lift-smooth:hover,
      .hover-lift-premium:hover {
        transform: translateY(-4px) scale(1.01);
      }
    }

    @media (max-width: 480px) {
      .card-icon-modern {
        width: 48px;
        height: 48px;
      }

      .card-value-modern {
        font-size: 1.25rem;
      }

      .capacity-icon-premium {
        width: 48px;
        height: 48px;
      }

      .score-circle {
        width: 60px;
        height: 60px;
      }

      .goal-badges-modern {
        gap: var(--space-1);
      }

      .origin-badge-modern,
      .status-badge-modern,
      .priority-badge-modern {
        font-size: 0.6875rem;
        padding: var(--space-1) var(--space-2);
      }

      .progress-bar-modern {
        height: 6px;
      }
    }

    .slider-group {
      margin-bottom: var(--space-4);
    }

    .slider-group label {
      display: block;
      font-weight: 500;
      color: var(--text-primary);
      font-size: 0.875rem;
      margin-bottom: var(--space-2);
    }

    .scenario-slider {
      width: 100%;
      height: 6px;
      border-radius: var(--radius-full);
      background: var(--bg-tertiary);
      outline: none;
      -webkit-appearance: none;
    }

    .scenario-slider::-webkit-slider-thumb {
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--accent-blue);
      cursor: pointer;
      box-shadow: var(--shadow-sm);
    }

    .custom-results {
      display: flex;
      gap: var(--space-4);
      flex-wrap: wrap;
    }

    .result-item {
      flex: 1;
      min-width: 140px;
      padding: var(--space-2) var(--space-3);
      background: var(--bg-primary);
      border-radius: var(--radius-md);
      font-size: 0.75rem;
      text-align: center;
    }

    .result-item.success {
      background: var(--accent-green-light);
      color: var(--accent-green);
    }

    .result-item.warning {
      background: var(--accent-red-light);
      color: var(--accent-red);
    }

    /* Modal */
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
      z-index: 1000;
    }

    .modal-content {
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow-xl);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-6) var(--space-6) var(--space-4) var(--space-6);
      border-bottom: 1px solid var(--border-primary);
    }

    .modal-header h3 {
      color: var(--text-primary);
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }

    .modal-close {
      background: none;
      border: none;
      color: var(--text-tertiary);
      cursor: pointer;
      padding: var(--space-2);
      border-radius: var(--radius-md);
      transition: all 0.2s ease;
    }

    .modal-close:hover {
      background: var(--bg-secondary);
      color: var(--text-primary);
    }

    .modal-form {
      padding: var(--space-6);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
      margin-bottom: var(--space-4);
    }

    .modal-actions {
      display: flex;
      gap: var(--space-3);
      margin-top: var(--space-8);
    }

    .modal-actions .btn {
      flex: 1;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .dashboard-container {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
      }

      .mobile-header {
        display: flex;
      }

      .mobile-overlay {
        display: block;
      }

      .sidebar {
        position: fixed;
        top: 0;
        left: -280px;
        width: 280px;
        height: 100vh;
        z-index: 45;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .sidebar.mobile-open {
        transform: translateX(280px);
      }

      .main-content {
        grid-column: 1;
        margin-top: 0;
      }

      .header-content {
        flex-direction: column;
        gap: var(--space-4);
        align-items: flex-start;
      }

      .filters-row {
        flex-direction: column;
        gap: var(--space-4);
      }

      .filter-group {
        min-width: auto;
      }

      .goals-grid {
        grid-template-columns: 1fr;
      }

      .overview-cards {
        grid-template-columns: repeat(2, 1fr);
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

      .overview-cards {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .goal-stats {
        flex-direction: column;
      }

      .goal-footer {
        flex-direction: column;
      }

      .page-content {
        padding: var(--space-4);
      }

      .whatsapp-header {
        flex-direction: column;
        gap: var(--space-4);
        align-items: flex-start;
      }
    }
  `]
})
export class DreamPursuitComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  isMobileMenuOpen = false;
  showCreateModal = false;
  editingGoal = false;
  statusFilter = 'all';
  originFilter = 'all';
  priorityFilter = 'all';
  activeMenuId: string | null = null;

  // Overview data - calculado dinamicamente
  totalInGoals = 0;
  totalSaved = 0;
  activeGoals = 0;
  overallProgress = 0;
  nextGoalName = '';
  nextGoalMonths = 0;

  // Capacidade financeira
  financialCapacity: 'excellent' | 'good' | 'limited' | 'critical' = 'good';
  availableForGoals = 0;
  monthlyCommitmentToGoals = 0;
  recommendedGoalBudget = 0;
  goalImpactOnBudget = 0;

  // WhatsApp
  whatsappEnabled = false;
  whatsappNumber = '';
  notificationSettings = {
    goalReached: true,
    weeklyReminder: true,
    monthlyReport: true,
    smartTips: true
  };

  // Goals data - vem do DataService
  goals: Goal[] = [];
  goalAnalysis: GoalAnalysis[] = [];
  filteredGoals: Goal[] = [];

  // Goals data mock (removido)
  _oldGoals = [
    {
      id: 1,
      name: 'Carro Novo',
      target: 45000,
      saved: 15000,
      percentage: 33,
      icon: '🚗',
      origin: 'business',
      priority: 'high',
      monthsRemaining: 18,
      monthlyTarget: 1667,
      deadline: 'Jun 2026',
      completed: false,
      description: 'Comprar um carro seminovo para facilitar o trabalho',
      expectedMonthly: 1667,
      actualMonthly: 1800
    },
    {
      id: 2,
      name: 'Viagem Europa',
      target: 12000,
      saved: 7800,
      percentage: 65,
      icon: '✈️',
      origin: 'personal',
      priority: 'medium',
      monthsRemaining: 7,
      monthlyTarget: 600,
      deadline: 'Ago 2025',
      completed: false,
      description: 'Mochilão de 3 semanas pela Europa',
      expectedMonthly: 600,
      actualMonthly: 700
    },
    {
      id: 3,
      name: 'Reserva de Emergência',
      target: 20000,
      saved: 5000,
      percentage: 25,
      icon: '🏦',
      origin: 'personal',
      priority: 'high',
      monthsRemaining: 24,
      monthlyTarget: 625,
      deadline: 'Jan 2027',
      completed: false,
      description: 'Reserva para 6 meses de despesas',
      expectedMonthly: 625,
      actualMonthly: 500
    }
  ];

  // Propriedades computadas
  get activeGoalsForSimulation() {
    return this.goals.filter(g => !g.completed);
  }

  // Sistema de Conquistas
  userLevel = 3;
  totalPoints = 1250;
  showAllAchievements = false;

  achievements = [
    // Primeiros Passos
    { id: 1, name: 'Primeiro Passo', description: 'Criou sua primeira meta', icon: '🎯', category: 'starter', points: 50, unlocked: true, progress: false, current: 1, target: 1 },
    { id: 2, name: 'Planejador', description: 'Criou 3 metas diferentes', icon: '📋', category: 'starter', points: 100, unlocked: true, progress: false, current: 3, target: 3 },
    { id: 3, name: 'Visionário', description: 'Criou 5 metas diferentes', icon: '🔮', category: 'starter', points: 200, unlocked: false, progress: true, current: 3, target: 5 },
    { id: 4, name: 'Primeira Contribuição', description: 'Fez o primeiro aporte em uma meta', icon: '💰', category: 'starter', points: 75, unlocked: true, progress: false, current: 1, target: 1 },

    // Consistência
    { id: 5, name: 'Consistente', description: 'Aporte por 3 meses seguidos', icon: '⚡', category: 'consistency', points: 150, unlocked: false, progress: true, current: 2, target: 3 },
    { id: 6, name: 'Disciplinado', description: 'Aporte por 6 meses seguidos', icon: '🎖️', category: 'consistency', points: 300, unlocked: false, progress: true, current: 2, target: 6 },
    { id: 7, name: 'Inabalável', description: 'Aporte por 12 meses seguidos', icon: '👑', category: 'consistency', points: 500, unlocked: false, progress: true, current: 2, target: 12 },
    { id: 8, name: 'Pontualidade', description: 'Fez aportes todo dia 5 do mês', icon: '📅', category: 'consistency', points: 250, unlocked: false, progress: true, current: 4, target: 6 },

    // Marcos Financeiros
    { id: 9, name: 'Primeira Marca', description: 'Economizou R$ 1.000', icon: '💵', category: 'financial', points: 100, unlocked: true, progress: false, current: 27800, target: 1000 },
    { id: 10, name: 'Crescendo', description: 'Economizou R$ 5.000', icon: '📈', category: 'financial', points: 200, unlocked: true, progress: false, current: 27800, target: 5000 },
    { id: 11, name: 'Poupador', description: 'Economizou R$ 10.000', icon: '🏦', category: 'financial', points: 300, unlocked: true, progress: false, current: 27800, target: 10000 },
    { id: 12, name: 'Investidor', description: 'Economizou R$ 25.000', icon: '💎', category: 'financial', points: 500, unlocked: true, progress: false, current: 27800, target: 25000 },
    { id: 13, name: 'Milionário em Formação', description: 'Economizou R$ 50.000', icon: '🚀', category: 'financial', points: 1000, unlocked: false, progress: true, current: 27800, target: 50000 },

    // Metas Especiais
    { id: 14, name: 'Meta Cumprida', description: 'Completou sua primeira meta', icon: '🏆', category: 'goals', points: 200, unlocked: false, progress: true, current: 0, target: 1 },
    { id: 15, name: 'Realizador', description: 'Completou 3 metas', icon: '🌟', category: 'goals', points: 400, unlocked: false, progress: true, current: 0, target: 3 },
    { id: 16, name: 'Adiantado', description: 'Completou uma meta antes do prazo', icon: '⏰', category: 'goals', points: 300, unlocked: false, progress: true, current: 0, target: 1 },
    { id: 17, name: 'Alta Performance', description: 'Tem 3 metas no prazo simultaneamente', icon: '🎭', category: 'goals', points: 350, unlocked: false, progress: true, current: 2, target: 3 }
  ];

  recentBadges = [
    { id: 12, name: 'Investidor', description: 'Economizou R$ 25.000', icon: '💎', points: 500, unlockedAt: new Date(2024, 11, 15) },
    { id: 2, name: 'Planejador', description: 'Criou 3 metas diferentes', icon: '📋', points: 100, unlockedAt: new Date(2024, 11, 10) }
  ];

  levels = [
    { level: 1, name: 'Iniciante', minPoints: 0, maxPoints: 200 },
    { level: 2, name: 'Aprendiz', minPoints: 201, maxPoints: 500 },
    { level: 3, name: 'Poupador', minPoints: 501, maxPoints: 1000 },
    { level: 4, name: 'Investidor', minPoints: 1001, maxPoints: 2000 },
    { level: 5, name: 'Expert', minPoints: 2001, maxPoints: 3500 },
    { level: 6, name: 'Mestre', minPoints: 3501, maxPoints: 5000 },
    { level: 7, name: 'Guru Financeiro', minPoints: 5001, maxPoints: 999999 }
  ];

  // Simulador de Cenários
  selectedGoalForSimulation: string | null = null;
  customScenario = {
    monthlyAmount: 0,
    months: 0,
    completionDate: '',
    timeSaved: 0
  };

  newGoal = {
    id: 0,
    name: '',
    target: 0,
    saved: 0,
    icon: '🎯',
    origin: 'personal',
    priority: 'medium',
    months: 0,
    description: '',
    percentage: 0,
    monthsRemaining: 0,
    monthlyTarget: 0,
    deadline: '',
    completed: false,
    expectedMonthly: 0,
    actualMonthly: 0
  };

  constructor(
    private modalService: ModalService,
    private dataService: DataService,
    private calculatorService: FinancialCalculatorService
  ) { }

  ngOnInit() {
    this.subscribeToData();
    this.updateOverviewStats();
    this.applyFilters();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private subscribeToData(): void {
    this.subscriptions.add(
      this.dataService.goals$.subscribe(goals => {
        this.goals = goals;
        this.calculateGoalAnalysis();
        this.updateOverviewStats();
        this.applyFilters();
      })
    );

    this.subscriptions.add(
      this.dataService.transactions$.subscribe(transactions => {
        this.calculateFinancialCapacity(transactions);
      })
    );
  }

  private calculateGoalAnalysis(): void {
    this.goalAnalysis = this.goals.map(goal =>
      this.calculatorService.analyzeIndividualGoal(goal)
    );
  }

  private calculateFinancialCapacity(transactions: any[]): void {
    const period = { type: 'mes-atual' as any };

    const integratedHealth = this.calculatorService.calculateIntegratedFinancialHealth(
      transactions,
      this.goals,
      period
    );

    this.financialCapacity = integratedHealth.financialCapacity;
    this.availableForGoals = integratedHealth.availableForGoals;
    this.monthlyCommitmentToGoals = integratedHealth.monthlyCommitmentToGoals;
    this.recommendedGoalBudget = integratedHealth.recommendedGoalBudget;
    this.goalImpactOnBudget = integratedHealth.goalImpactOnBudget;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  exportGoals(): void {
    console.log('Exportando metas...');
  }

  formatCurrency(value: number): string {
    return this.calculatorService.formatCurrency(value);
  }

  // Métodos helper para o template
  getGoalProgress(goal: Goal): number {
    return goal.target > 0 ? Math.round((goal.saved / goal.target) * 100) : 0;
  }

  getGoalStatus(goal: Goal): 'ahead' | 'on-track' | 'behind' | 'completed' {
    const analysis = this.calculatorService.analyzeIndividualGoal(goal);
    return analysis.status;
  }

  getMonthsRemaining(goal: Goal): number {
    const analysis = this.calculatorService.analyzeIndividualGoal(goal);
    return analysis.monthsRemaining;
  }

  getGoalStatusText(goal: Goal): string {
    const status = this.getGoalStatus(goal);
    switch (status) {
      case 'ahead': return 'Adiantado';
      case 'on-track': return 'No prazo';
      case 'behind': return 'Atrasado';
      case 'completed': return 'Concluída';
      default: return 'No prazo';
    }
  }

  calculateSuggestedMonthly(target: number, saved: number = 0, months: number = 12): number {
    return this.calculatorService.calculateMonthlyTarget(target, saved,
      new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );
  }

  // Métodos para indicadores de capacidade financeira
  getCapacityText(): string {
    switch (this.financialCapacity) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Boa';
      case 'limited': return 'Limitada';
      case 'critical': return 'Crítica';
      default: return 'Boa';
    }
  }

  getCapacityColor(): string {
    switch (this.financialCapacity) {
      case 'excellent': return 'var(--success)';
      case 'good': return 'var(--primary)';
      case 'limited': return 'var(--warning)';
      case 'critical': return 'var(--danger)';
      default: return 'var(--primary)';
    }
  }

  getCapacityIcon(): string {
    switch (this.financialCapacity) {
      case 'excellent': return 'check-circle';
      case 'good': return 'chart-bar';
      case 'limited': return 'exclamation-triangle';
      case 'critical': return 'exclamation-circle';
      default: return 'chart-bar';
    }
  }

  getCapacityRecommendation(): string {
    switch (this.financialCapacity) {
      case 'excellent': return 'Você pode criar novas metas ou aumentar os aportes das existentes.';
      case 'good': return 'Suas metas estão bem balanceadas com sua situação financeira.';
      case 'limited': return 'Considere revisar os valores das metas ou aumentar sua receita.';
      case 'critical': return 'Recomendamos reduzir os aportes das metas para equilibrar suas finanças.';
      default: return 'Mantenha o equilíbrio entre metas e situação financeira.';
    }
  }

  updateOverviewStats() {
    const goalsAnalysis = this.calculatorService.analyzeGoals(this.goals);

    this.totalInGoals = goalsAnalysis.totalInGoals;
    this.totalSaved = goalsAnalysis.totalSaved;
    this.activeGoals = goalsAnalysis.activeGoals;
    this.overallProgress = goalsAnalysis.overallProgress;

    if (goalsAnalysis.nextGoal) {
      const analysis = this.calculatorService.analyzeIndividualGoal(goalsAnalysis.nextGoal);
      this.nextGoalName = goalsAnalysis.nextGoal.name;
      this.nextGoalMonths = analysis.monthsRemaining;
    } else {
      this.nextGoalName = 'Nenhuma';
      this.nextGoalMonths = 0;
    }
  }

  applyFilters() {
    let filtered = this.goals;

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(g => this.getGoalStatus(g) === this.statusFilter);
    }

    if (this.originFilter !== 'all') {
      filtered = filtered.filter(g => g.origin === this.originFilter);
    }

    if (this.priorityFilter !== 'all') {
      filtered = filtered.filter(g => g.priority === this.priorityFilter);
    }

    this.filteredGoals = filtered;
  }


  getGoalClasses(goal: any): string {
    return `status-${this.getGoalStatus(goal)}`;
  }

  getPriorityText(priority: string): string {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  }

  toggleGoalMenu(goalId: string) {
    this.activeMenuId = this.activeMenuId === goalId ? null : goalId;
  }

  openCreateGoalModal() {
    this.showCreateModal = true;
    this.editingGoal = false;
    this.resetNewGoal();
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.editingGoal = false;
    this.activeMenuId = null;
  }

  resetNewGoal() {
    this.newGoal = {
      id: 0,
      name: '',
      target: 0,
      saved: 0,
      icon: '🎯',
      origin: 'personal',
      priority: 'medium',
      months: 0,
      description: '',
      percentage: 0,
      monthsRemaining: 0,
      monthlyTarget: 0,
      deadline: '',
      completed: false,
      expectedMonthly: 0,
      actualMonthly: 0
    };
  }

  editGoal(goal: any) {
    this.newGoal = { ...goal };
    this.editingGoal = true;
    this.showCreateModal = true;
    this.activeMenuId = null;
  }

  deleteGoal(goalId: string) {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
      this.dataService.deleteGoal(goalId);
      this.activeMenuId = null;
    }
  }

  saveGoal() {
    // Calcular deadline baseado no monthlyTarget e valor necessário
    const deadline = this.calculatorService.calculateGoalDeadline(
      this.newGoal.target,
      this.newGoal.monthlyTarget || 500,
      this.newGoal.saved || 0
    );

    if (this.editingGoal) {
      // Atualizar meta existente
      this.dataService.updateGoal(String(this.newGoal.id), {
        name: this.newGoal.name,
        target: this.newGoal.target,
        icon: this.newGoal.icon,
        origin: this.newGoal.origin as 'personal' | 'business',
        priority: this.newGoal.priority as 'low' | 'medium' | 'high',
        deadline: deadline,
        description: this.newGoal.description,
        monthlyTarget: this.newGoal.monthlyTarget || 500
      });
    } else {
      // Criar nova meta
      this.dataService.addGoal({
        name: this.newGoal.name,
        target: this.newGoal.target,
        icon: this.newGoal.icon,
        origin: this.newGoal.origin as 'personal' | 'business',
        priority: this.newGoal.priority as 'low' | 'medium' | 'high',
        deadline: deadline,
        description: this.newGoal.description,
        monthlyTarget: this.newGoal.monthlyTarget || 500
      });
    }

    this.closeCreateModal();
  }

  getDeadlineString(months: number): string {
    const now = new Date();
    const deadline = new Date(now.getFullYear(), now.getMonth() + months, now.getDate());
    return deadline.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
  }

  addMoney(goal: Goal) {
    const amount = prompt('Quanto você quer adicionar à meta?');
    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
      this.dataService.addToGoalSavings(goal.id, Number(amount));
      this.activeMenuId = null;
    }
  }

  viewGoalDetails(goal: any) {
    alert(`Visualizar detalhes da meta: ${goal.name}`);
    this.activeMenuId = null;
  }

  toggleWhatsApp() {
    if (!this.whatsappEnabled) {
      this.whatsappNumber = '';
    }
  }

  saveWhatsAppSettings() {
    this.whatsappEnabled = !!this.whatsappNumber;
    alert(`Configurações do WhatsApp salvas! ${this.whatsappEnabled ? 'Ativado' : 'Desativado'}`);
  }

  trackGoalById(index: number, goal: any): number {
    return goal.id;
  }

  getAbsoluteValue(value: number): number {
    return Math.abs(value);
  }

  // Métodos do Sistema de Conquistas
  get unlockedBadges() {
    return this.achievements.filter(a => a.unlocked);
  }

  get totalBadges() {
    return this.achievements.length;
  }

  toggleAchievementsView() {
    this.showAllAchievements = !this.showAllAchievements;
  }

  getBadgesByCategory(category: string) {
    return this.achievements.filter(a => a.category === category);
  }

  getCurrentLevelName(): string {
    const currentLevel = this.levels.find(l => l.level === this.userLevel);
    return currentLevel?.name || 'Desconhecido';
  }

  getNextLevelName(): string {
    const nextLevel = this.levels.find(l => l.level === this.userLevel + 1);
    return nextLevel?.name || 'Máximo';
  }

  getLevelProgress(): number {
    const currentLevel = this.levels.find(l => l.level === this.userLevel);
    if (!currentLevel) return 0;

    const progressInLevel = this.totalPoints - currentLevel.minPoints;
    const levelRange = currentLevel.maxPoints - currentLevel.minPoints;
    return Math.round((progressInLevel / levelRange) * 100);
  }

  getCurrentLevelPoints(): number {
    const currentLevel = this.levels.find(l => l.level === this.userLevel);
    return this.totalPoints - (currentLevel?.minPoints || 0);
  }

  getNextLevelPoints(): number {
    const currentLevel = this.levels.find(l => l.level === this.userLevel);
    if (!currentLevel) return 0;
    return currentLevel.maxPoints - currentLevel.minPoints;
  }

  // Métodos do Simulador de Cenários
  updateSimulation() {
    if (this.selectedGoalForSimulation) {
      const goal = this.goals.find(g => g.id === this.selectedGoalForSimulation);
      if (goal) {
        this.customScenario.monthlyAmount = goal.monthlyTarget;
        this.updateCustomScenario();
      }
    }
  }

  getCurrentScenario() {
    const goal = this.goals.find(g => g.id === this.selectedGoalForSimulation);
    if (!goal) return { monthlyAmount: 0, months: 0, completionDate: '' };

    return {
      monthlyAmount: goal.monthlyTarget,
      months: this.calculatorService.analyzeIndividualGoal(goal).monthsRemaining,
      completionDate: goal.deadline
    };
  }

  getOptimizedScenario(multiplier: number) {
    const goal = this.goals.find(g => g.id === this.selectedGoalForSimulation);
    if (!goal) return { monthlyAmount: 0, months: 0, completionDate: '' };

    const newMonthlyAmount = goal.monthlyTarget * multiplier;
    const remaining = goal.target - goal.saved;
    const newMonths = Math.ceil(remaining / newMonthlyAmount);

    const completionDate = new Date();
    completionDate.setMonth(completionDate.getMonth() + newMonths);

    return {
      monthlyAmount: newMonthlyAmount,
      months: newMonths,
      completionDate: completionDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
    };
  }

  updateCustomScenario() {
    const goal = this.goals.find(g => g.id === this.selectedGoalForSimulation);
    if (!goal) return;

    const remaining = goal.target - goal.saved;
    const newMonths = Math.ceil(remaining / this.customScenario.monthlyAmount);

    const completionDate = new Date();
    completionDate.setMonth(completionDate.getMonth() + newMonths);

    this.customScenario.months = newMonths;
    this.customScenario.completionDate = completionDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    const goalAnalysis = this.calculatorService.analyzeIndividualGoal(goal);
    this.customScenario.timeSaved = Math.max(0, goalAnalysis.monthsRemaining - newMonths);
  }

  // Método para simular conquista de badge (para demonstração)
  unlockBadge(badgeId: number) {
    const badge = this.achievements.find(a => a.id === badgeId);
    if (badge && !badge.unlocked) {
      badge.unlocked = true;
      this.totalPoints += badge.points;

      // Adicionar aos badges recentes
      this.recentBadges.unshift({
        ...badge,
        unlockedAt: new Date()
      });

      // Manter apenas os 3 mais recentes
      this.recentBadges = this.recentBadges.slice(0, 3);

      // Verificar se subiu de nível
      this.checkLevelUp();
    }
  }

  checkLevelUp() {
    const newLevel = this.levels.find(l =>
      this.totalPoints >= l.minPoints && this.totalPoints <= l.maxPoints
    );

    if (newLevel && newLevel.level > this.userLevel) {
      this.userLevel = newLevel.level;
      // Aqui poderia mostrar uma animação de level up
      console.log(`Parabéns! Você subiu para o nível ${this.userLevel}: ${newLevel.name}!`);
    }
  }

  // Novos métodos para o design moderno
  getCapacityGlowClass(): string {
    switch (this.financialCapacity) {
      case 'excellent': return 'glow-excellent';
      case 'good': return 'glow-good';
      case 'limited': return 'glow-limited';
      case 'critical': return 'glow-critical';
      default: return 'glow-good';
    }
  }

  getCapacityIconClass(): string {
    switch (this.financialCapacity) {
      case 'excellent': return 'icon-excellent';
      case 'good': return 'icon-good';
      case 'limited': return 'icon-warning';
      case 'critical': return 'icon-critical';
      default: return 'icon-good';
    }
  }

  getCapacityBadgeClass(): string {
    switch (this.financialCapacity) {
      case 'excellent': return 'badge-excellent';
      case 'good': return 'badge-good';
      case 'limited': return 'badge-limited';
      case 'critical': return 'badge-critical';
      default: return 'badge-good';
    }
  }

  getCapacityScoreClass(): string {
    switch (this.financialCapacity) {
      case 'excellent': return 'score-excellent';
      case 'good': return 'score-good';
      case 'limited': return 'score-limited';
      case 'critical': return 'score-critical';
      default: return 'score-good';
    }
  }

  getCapacityScore(): number {
    switch (this.financialCapacity) {
      case 'excellent': return 95;
      case 'good': return 75;
      case 'limited': return 55;
      case 'critical': return 25;
      default: return 75;
    }
  }

  getGoalGlowClass(goal: Goal): string {
    const status = this.getGoalStatus(goal);
    return `glow-${status}`;
  }
}
