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
      </div>
    </div>
  `,
  styles: [`
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

    /* All existing modern styles from before... */
    /* [Include all the modern card styles, capacity indicator, goals grid, etc.] */
  `]
})
export class DreamPursuitComponent implements OnInit, OnDestroy {
  // Properties
  goals: Goal[] = [];
  filteredGoals: Goal[] = [];
  activeMenuId: string | null = null;

  // Computed properties
  totalInGoals = 0;
  totalSaved = 0;
  activeGoals = 0;
  overallProgress = 0;
  nextGoalName = 'Carro Novo';
  nextGoalMonths = 8;
  availableForGoals = 2500;
  goalImpactOnBudget = 35;
  recommendedGoalBudget = 3000;
  financialCapacity: 'excellent' | 'good' | 'limited' | 'critical' = 'good';

  constructor(
    private modalService: ModalService,
    private dataService: DataService,
    private calculatorService: FinancialCalculatorService
  ) {}

  ngOnInit() {
    this.loadGoals();
  }

  ngOnDestroy() {
    // Cleanup subscriptions if any
  }

  loadGoals() {
    this.goals = this.dataService.getGoals();
    this.filteredGoals = [...this.goals];
    this.calculateTotals();
  }

  calculateTotals() {
    this.totalInGoals = this.goals.reduce((sum, goal) => sum + goal.target, 0);
    this.totalSaved = this.goals.reduce((sum, goal) => sum + goal.saved, 0);
    this.activeGoals = this.goals.filter(goal => !goal.completed).length;
    this.overallProgress = this.totalInGoals > 0 ? (this.totalSaved / this.totalInGoals) * 100 : 0;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  exportGoals() {
    const dataStr = this.dataService.exportData();
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'metas-venturefi.json';
    link.click();
  }

  openCreateGoalModal() {
    // Implementation for opening modal
    console.log('Opening create goal modal...');
  }

  toggleGoalMenu(goalId: string) {
    this.activeMenuId = this.activeMenuId === goalId ? null : goalId;
  }

  editGoal(goal: Goal) {
    console.log('Editing goal:', goal);
    this.activeMenuId = null;
  }

  addMoney(goal: Goal) {
    const amount = prompt('Quanto você quer adicionar à meta?');
    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
      this.dataService.addToGoalSavings(goal.id, Number(amount));
      this.loadGoals();
      this.activeMenuId = null;
    }
  }

  deleteGoal(goalId: string) {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
      this.dataService.deleteGoal(goalId);
      this.loadGoals();
      this.activeMenuId = null;
    }
  }

  viewGoalDetails(goal: Goal) {
    console.log('Viewing goal details:', goal);
    this.activeMenuId = null;
  }

  getGoalProgress(goal: Goal): number {
    return goal.target > 0 ? (goal.saved / goal.target) * 100 : 0;
  }

  getGoalStatus(goal: Goal): string {
    const progress = this.getGoalProgress(goal);
    const analysis = this.calculatorService.analyzeIndividualGoal(goal);

    if (progress >= 100) return 'completed';
    if (analysis.isAhead) return 'ahead';
    if (analysis.isBehind) return 'behind';
    return 'on-track';
  }

  getGoalStatusText(goal: Goal): string {
    const status = this.getGoalStatus(goal);
    switch (status) {
      case 'ahead': return 'Adiantado';
      case 'on-track': return 'No prazo';
      case 'behind': return 'Atrasado';
      case 'completed': return 'Concluído';
      default: return 'No prazo';
    }
  }

  getGoalClasses(goal: Goal): string {
    return `status-${this.getGoalStatus(goal)}`;
  }

  getPriorityText(priority: string): string {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Média';
    }
  }

  getMonthsRemaining(goal: Goal): number {
    const analysis = this.calculatorService.analyzeIndividualGoal(goal);
    return analysis.monthsRemaining;
  }

  trackGoalById(index: number, goal: Goal): string {
    return goal.id;
  }

  // Capacity methods
  getCapacityIcon(): string {
    switch (this.financialCapacity) {
      case 'excellent': return 'star';
      case 'good': return 'check-circle';
      case 'limited': return 'exclamation-triangle';
      case 'critical': return 'x-circle';
      default: return 'check-circle';
    }
  }

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
      case 'excellent': return '#2ECC71';
      case 'good': return '#3498DB';
      case 'limited': return '#F39C12';
      case 'critical': return '#E74C3C';
      default: return '#3498DB';
    }
  }

  getCapacityRecommendation(): string {
    switch (this.financialCapacity) {
      case 'excellent': return 'Você pode aumentar suas metas ou criar novas!';
      case 'good': return 'Continue assim, suas metas estão bem balanceadas.';
      case 'limited': return 'Considere revisar algumas metas ou aumentar a renda.';
      case 'critical': return 'Recomendamos revisar suas metas e despesas urgentemente.';
      default: return 'Continue acompanhando suas metas regularmente.';
    }
  }

  // New modern design methods
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
