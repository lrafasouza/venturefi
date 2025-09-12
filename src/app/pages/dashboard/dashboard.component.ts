import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService, Transaction, Goal } from '../../shared/services/data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="modern-dashboard">
      <!-- Dashboard Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="welcome-section">
            <h1 class="welcome-title">Bom dia, Rafael! 👋</h1>
            <p class="welcome-subtitle">Aqui está um resumo das suas finanças hoje</p>
          </div>
          <div class="header-stats">
            <div class="quick-stat">
              <span class="stat-value">R$ 47.320,50</span>
              <span class="stat-label">Saldo Total</span>
              <span class="stat-trend positive">+12.3%</span>
            </div>
            <div class="quick-stat">
              <span class="stat-value">R$ 8.240,00</span>
              <span class="stat-label">Este Mês</span>
              <span class="stat-trend positive">↗</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="dashboard-main">
        <!-- KPI Cards -->
        <section class="kpi-section">
          <h2 class="section-title">Visão Geral Financeira</h2>
          <div class="kpi-grid">
            <!-- Revenue Card -->
            <div class="kpi-card revenue-card">
              <div class="card-header">
                <div class="card-icon">💰</div>
                <div class="card-trend positive">
                  <span class="trend-arrow">↗</span>
                  <span class="trend-value">+15.8%</span>
                </div>
              </div>
              <div class="card-content">
                <h3 class="card-title">Receitas</h3>
                <div class="card-value">R$ 34.250,00</div>
                <div class="card-subtitle">47 transações • R$ 728 média</div>
              </div>
              <div class="card-progress">
                <div class="progress-bar">
                  <div class="progress-fill revenue" style="width: 78%"></div>
                </div>
                <span class="progress-text">78% da meta mensal</span>
              </div>
            </div>

            <!-- Expenses Card -->
            <div class="kpi-card expenses-card">
              <div class="card-header">
                <div class="card-icon">💸</div>
                <div class="card-trend negative">
                  <span class="trend-arrow">↗</span>
                  <span class="trend-value">+8.2%</span>
                </div>
              </div>
              <div class="card-content">
                <h3 class="card-title">Despesas</h3>
                <div class="card-value expense">R$ 25.830,00</div>
                <div class="card-subtitle">134 transações • R$ 192 média</div>
              </div>
              <div class="card-breakdown">
                <div class="breakdown-item">
                  <span class="breakdown-category">Moradia</span>
                  <span class="breakdown-value">35%</span>
                </div>
                <div class="breakdown-item">
                  <span class="breakdown-category">Alimentação</span>
                  <span class="breakdown-value">22%</span>
                </div>
                <div class="breakdown-item">
                  <span class="breakdown-category">Outros</span>
                  <span class="breakdown-value">43%</span>
                </div>
              </div>
            </div>

            <!-- Balance Card -->
            <div class="kpi-card balance-card">
              <div class="card-header">
                <div class="card-icon">⚖️</div>
                <div class="card-trend positive">
                  <span class="trend-arrow">↗</span>
                  <span class="trend-value">+24.7%</span>
                </div>
              </div>
              <div class="card-content">
                <h3 class="card-title">Saldo Líquido</h3>
                <div class="card-value positive">R$ 8.420,00</div>
                <div class="card-subtitle">Resultado do mês</div>
              </div>
              <div class="balance-indicator">
                <div class="indicator-healthy">Situação saudável</div>
                <div class="indicator-details">75% de taxa de economia</div>
              </div>
            </div>

            <!-- Cash Flow Card -->
            <div class="kpi-card cashflow-card">
              <div class="card-header">
                <div class="card-icon">📊</div>
                <div class="card-trend stable">
                  <span class="trend-arrow">→</span>
                  <span class="trend-value">+2.1%</span>
                </div>
              </div>
              <div class="card-content">
                <h3 class="card-title">Fluxo de Caixa</h3>
                <div class="card-value">R$ 23.560,00</div>
                <div class="card-subtitle">Projeção 30 dias: R$ 31.200</div>
              </div>
              <div class="cashflow-chart">
                <div class="mini-chart">
                  <div class="chart-bar" style="height: 30%"></div>
                  <div class="chart-bar" style="height: 50%"></div>
                  <div class="chart-bar" style="height: 80%"></div>
                  <div class="chart-bar" style="height: 65%"></div>
                  <div class="chart-bar" style="height: 90%"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Recent Transactions -->
        <section class="transactions-section">
          <div class="section-header">
            <h2 class="section-title">Transações Recentes</h2>
            <a routerLink="/platform/transacoes" class="view-all-btn">Ver todas</a>
          </div>
          <div class="transactions-list">
            <div class="transaction-item" *ngFor="let transaction of getRecentTransactions()">
              <div class="transaction-icon" [class]="transaction.type">
                <span>{{ getTransactionIcon(transaction.category) }}</span>
              </div>
              <div class="transaction-details">
                <div class="transaction-description">{{ transaction.description }}</div>
                <div class="transaction-meta">
                  <span class="transaction-category">{{ transaction.category }}</span>
                  <span class="transaction-date">{{ formatDate(transaction.date) }}</span>
                </div>
              </div>
              <div class="transaction-amount" [class]="transaction.type">
                {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
              </div>
            </div>
          </div>
        </section>

        <!-- Goals Preview -->
        <section class="goals-section">
          <div class="section-header">
            <h2 class="section-title">Suas Metas</h2>
            <a routerLink="/platform/dream-pursuit" class="view-all-btn">Ver todas</a>
          </div>
          <div class="goals-grid">
            <div class="goal-card" *ngFor="let goal of getTopGoals()">
              <div class="goal-header">
                <span class="goal-icon">{{ goal.icon }}</span>
                <div class="goal-priority" [class]="goal.priority">
                  {{ getPriorityLabel(goal.priority) }}
                </div>
              </div>
              <div class="goal-content">
                <h3 class="goal-name">{{ goal.name }}</h3>
                <div class="goal-progress">
                  <div class="progress-amount">
                    <span class="saved">{{ formatCurrency(goal.saved) }}</span>
                    <span class="target">de {{ formatCurrency(goal.target) }}</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width]="getProgressPercentage(goal) + '%'"></div>
                  </div>
                  <div class="progress-percentage">{{ getProgressPercentage(goal) }}%</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Quick Actions -->
        <section class="actions-section">
          <h2 class="section-title">Ações Rápidas</h2>
          <div class="actions-grid">
            <button class="action-card" (click)="addTransaction()">
              <div class="action-icon">➕</div>
              <div class="action-content">
                <h3>Nova Transação</h3>
                <p>Registre uma receita ou despesa</p>
              </div>
            </button>
            <button class="action-card" (click)="addGoal()">
              <div class="action-icon">🎯</div>
              <div class="action-content">
                <h3>Nova Meta</h3>
                <p>Defina um novo objetivo financeiro</p>
              </div>
            </button>
            <button class="action-card" routerLink="/platform/relatorios">
              <div class="action-icon">📊</div>
              <div class="action-content">
                <h3>Ver Relatórios</h3>
                <p>Análise detalhada das finanças</p>
              </div>
            </button>
            <button class="action-card" (click)="exportData()">
              <div class="action-icon">📤</div>
              <div class="action-content">
                <h3>Exportar Dados</h3>
                <p>Baixe seus dados financeiros</p>
              </div>
            </button>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .modern-dashboard {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 2rem;
    }

    /* Dashboard Header */
    .dashboard-header {
      background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
      border-radius: 24px;
      padding: 3rem;
      margin-bottom: 3rem;
      color: white;
      position: relative;
      overflow: hidden;
    }

    .dashboard-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
      pointer-events: none;
    }

    .header-content {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }

    .welcome-section {
      flex: 1;
    }

    .welcome-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0 0 0.5rem 0;
      background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .welcome-subtitle {
      font-size: 1.125rem;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
    }

    .header-stats {
      display: flex;
      gap: 2rem;
    }

    .quick-stat {
      text-align: center;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .stat-value {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      display: block;
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 0.5rem;
    }

    .stat-trend {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
    }

    .stat-trend.positive {
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
    }

    /* Main Content */
    .dashboard-main {
      max-width: 1400px;
      margin: 0 auto;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 1.5rem 0;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .view-all-btn {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.875rem;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .view-all-btn:hover {
      background: rgba(59, 130, 246, 0.1);
    }

    /* KPI Section */
    .kpi-section {
      margin-bottom: 3rem;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
    }

    .kpi-card {
      background: white;
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(0, 0, 0, 0.05);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .kpi-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    }

    .kpi-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
    }

    .kpi-card.revenue-card::before {
      background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    }

    .kpi-card.expenses-card::before {
      background: linear-gradient(90deg, #ef4444, #dc2626);
    }

    .kpi-card.balance-card::before {
      background: linear-gradient(90deg, #10b981, #059669);
    }

    .kpi-card.cashflow-card::before {
      background: linear-gradient(90deg, #f59e0b, #d97706);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .card-trend {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .card-trend.positive {
      background: rgba(16, 185, 129, 0.1);
      color: #059669;
    }

    .card-trend.negative {
      background: rgba(239, 68, 68, 0.1);
      color: #dc2626;
    }

    .card-trend.stable {
      background: rgba(59, 130, 246, 0.1);
      color: #1d4ed8;
    }

    .card-content {
      margin-bottom: 1.5rem;
    }

    .card-title {
      font-size: 1rem;
      font-weight: 600;
      color: #64748b;
      margin: 0 0 0.5rem 0;
    }

    .card-value {
      font-size: 2rem;
      font-weight: 800;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .card-value.expense {
      color: #dc2626;
    }

    .card-value.positive {
      color: #059669;
    }

    .card-subtitle {
      font-size: 0.875rem;
      color: #64748b;
    }

    .card-progress {
      margin-top: 1rem;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .progress-fill.revenue {
      background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    }

    .progress-text {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
    }

    .card-breakdown {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .breakdown-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
    }

    .breakdown-category {
      color: #64748b;
    }

    .breakdown-value {
      color: #1e293b;
      font-weight: 600;
    }

    .balance-indicator {
      padding: 1rem;
      background: rgba(16, 185, 129, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(16, 185, 129, 0.1);
    }

    .indicator-healthy {
      font-size: 0.875rem;
      font-weight: 600;
      color: #059669;
      margin-bottom: 0.25rem;
    }

    .indicator-details {
      font-size: 0.75rem;
      color: #64748b;
    }

    .cashflow-chart {
      height: 40px;
    }

    .mini-chart {
      display: flex;
      align-items: end;
      gap: 4px;
      height: 100%;
    }

    .chart-bar {
      flex: 1;
      background: linear-gradient(180deg, #f59e0b, #d97706);
      border-radius: 2px;
      min-height: 4px;
    }

    /* Transactions Section */
    .transactions-section {
      margin-bottom: 3rem;
    }

    .transactions-list {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .transaction-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .transaction-item:last-child {
      border-bottom: none;
    }

    .transaction-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .transaction-icon.income {
      background: rgba(16, 185, 129, 0.1);
    }

    .transaction-icon.expense {
      background: rgba(239, 68, 68, 0.1);
    }

    .transaction-details {
      flex: 1;
    }

    .transaction-description {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }

    .transaction-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.75rem;
      color: #64748b;
    }

    .transaction-amount {
      font-weight: 700;
      font-size: 0.875rem;
    }

    .transaction-amount.income {
      color: #059669;
    }

    .transaction-amount.expense {
      color: #dc2626;
    }

    /* Goals Section */
    .goals-section {
      margin-bottom: 3rem;
    }

    .goals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .goal-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
    }

    .goal-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
    }

    .goal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .goal-icon {
      font-size: 2rem;
    }

    .goal-priority {
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.625rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .goal-priority.high {
      background: rgba(239, 68, 68, 0.1);
      color: #dc2626;
    }

    .goal-priority.medium {
      background: rgba(245, 158, 11, 0.1);
      color: #d97706;
    }

    .goal-priority.low {
      background: rgba(16, 185, 129, 0.1);
      color: #059669;
    }

    .goal-name {
      font-size: 1.125rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 1rem 0;
    }

    .goal-progress {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .progress-amount {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }

    .saved {
      font-size: 1.25rem;
      font-weight: 700;
      color: #059669;
    }

    .target {
      font-size: 0.875rem;
      color: #64748b;
    }

    .progress-percentage {
      font-size: 0.75rem;
      font-weight: 600;
      color: #3b82f6;
      text-align: center;
    }

    /* Actions Section */
    .actions-section {
      margin-bottom: 3rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .action-card {
      background: white;
      border: 1px solid rgba(0, 0, 0, 0.05);
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      color: inherit;
    }

    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
      border-color: #3b82f6;
    }

    .action-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .action-content h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.25rem 0;
    }

    .action-content p {
      font-size: 0.75rem;
      color: #64748b;
      margin: 0;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .header-content {
        flex-direction: column;
        text-align: center;
        gap: 2rem;
      }

      .header-stats {
        justify-content: center;
      }

      .kpi-grid {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .modern-dashboard {
        padding: 1rem;
      }

      .dashboard-header {
        padding: 2rem;
      }

      .welcome-title {
        font-size: 2rem;
      }

      .header-stats {
        flex-direction: column;
        width: 100%;
      }

      .quick-stat {
        padding: 1rem;
      }

      .kpi-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .kpi-card {
        padding: 1.5rem;
      }

      .card-value {
        font-size: 1.75rem;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  
  constructor(private dataService: DataService) {}

  ngOnInit(): void {}

  getRecentTransactions(): Transaction[] {
    return this.dataService.getTransactions()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }

  getTopGoals(): Goal[] {
    return this.dataService.getGoals()
      .filter(goal => !goal.completed)
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, 3);
  }

  getTransactionIcon(category: string): string {
    const iconMap: { [key: string]: string } = {
      'Freelance': '💼',
      'Salário': '💰',
      'Consultoria': '🤝',
      'Moradia': '🏠',
      'Alimentação': '🍽️',
      'Transporte': '🚗',
      'Saúde': '🏥',
      'Lazer': '🎬',
      'Ferramentas': '🛠️',
      'Investimento/Poupança': '💎'
    };
    return iconMap[category] || '📝';
  }

  getProgressPercentage(goal: Goal): number {
    return Math.round((goal.saved / goal.target) * 100);
  }

  getPriorityLabel(priority: string): string {
    const labels: { [key: string]: string } = {
      'high': 'Alta',
      'medium': 'Média', 
      'low': 'Baixa'
    };
    return labels[priority] || priority;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  }

  addTransaction(): void {
    // Mock function - In real app would open modal
    console.log('Add transaction clicked');
  }

  addGoal(): void {
    // Mock function - In real app would open modal
    console.log('Add goal clicked');
  }

  exportData(): void {
    // Mock function - In real app would export data
    console.log('Export data clicked');
  }
}