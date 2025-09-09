import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DashboardWidgetsService, DashboardWidget } from '../../shared/services/dashboard-widgets.service';
import { FinancialSummaryWidgetComponent } from '../../shared/components/widgets/financial-summary-widget.component';
import { ChartWidgetComponent } from '../../shared/components/widgets/chart-widget.component';
import { GoalsWidgetComponent } from '../../shared/components/widgets/goals-widget.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DataService, Transaction, Goal } from '../../shared/services/data.service';
import { FinancialCalculatorService, KPIData, PeriodFilter, CategoryData } from '../../shared/services/financial-calculator.service';
import { ModalService } from '../../shared/services/modal.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IconComponent, DragDropModule, FinancialSummaryWidgetComponent, ChartWidgetComponent, GoalsWidgetComponent],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
          <div class="header-content">
            <div class="welcome-section">
              <h1>Olá, Rafael!</h1>
              <p>Vamos ver como estão suas finanças hoje</p>
            </div>
            <div class="header-actions">
              <button class="btn btn-outline hover-scale focus-ring" (click)="openNewTransactionModal()">
                <app-icon name="plus" size="16"></app-icon>
                <span>Nova Transação</span>
              </button>
              <button class="btn btn-primary hover-glow focus-ring" (click)="openUpgradePremiumModal()">
                <app-icon name="sparkles" size="16"></app-icon>
                <span>Upgrade Premium</span>
              </button>
            </div>
          </div>
      </header>
      
      <div class="dashboard-content">
        <!-- Filtros Globais -->
        <div class="global-filters animate-fade-in">
          <div class="filters-header">
            <h3>Filtros do Dashboard</h3>
            <div class="filter-summary">
              <span class="filter-tag">{{ selectedPeriod }}</span>
              <span class="filter-tag">{{ selectedOrigin }}</span>
              <button class="btn btn-ghost btn-sm" (click)="clearFilters()" title="Limpar filtros">
                <app-icon name="x-mark" size="14"></app-icon>
              </button>
            </div>
          </div>
          <div class="filters-row">
            <div class="filter-group">
              <label>Período</label>
              <select class="filter-select" [(ngModel)]="selectedPeriod" (change)="onFiltersChange()">
                <option value="mes-atual">Mês Atual</option>
                <option value="mes-anterior">Mês Anterior</option>
                <option value="ultimos-30-dias">Últimos 30 dias</option>
                <option value="ultimos-90-dias">Últimos 90 dias</option>
                <option value="ano-atual">Ano Atual</option>
                <option value="personalizado">Personalizado</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Contexto</label>
              <select class="filter-select" [(ngModel)]="selectedOrigin" (change)="onFiltersChange()">
                <option value="ambos">Pessoal + Negócio</option>
                <option value="pessoal">Só Pessoal</option>
                <option value="negocio">Só Negócio</option>
              </select>
            </div>
            <div class="filter-group" *ngIf="selectedPeriod === 'personalizado'">
              <label>De - Até</label>
              <div class="date-range">
                <input type="date" class="filter-date" [(ngModel)]="customDateFrom" (change)="setCustomPeriod()">
                <span class="date-separator">até</span>
                <input type="date" class="filter-date" [(ngModel)]="customDateTo" (change)="setCustomPeriod()">
              </div>
            </div>
            <div class="filter-group">
              <label>Ações</label>
              <div class="filter-actions">
                <button class="btn btn-outline btn-sm" (click)="refreshDashboard()" title="Atualizar dados">
                  <app-icon name="arrow-path" size="14"></app-icon>
                </button>
                <button class="btn btn-outline btn-sm" (click)="exportDashboardData()" title="Exportar dados">
                  <app-icon name="arrow-down-tray" size="14"></app-icon>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- KPIs Cards Baseados nos Filtros -->
        <div class="kpis-grid animate-fade-in">
          <div class="kpi-card hover-lift" [class.highlight]="selectedOrigin !== 'negocio'">
              <div class="kpi-header">
                <div class="kpi-icon personal">
                  <app-icon name="banknotes" size="20"></app-icon>
                </div>
                <div class="kpi-trend up">
                  <app-icon name="arrow-trending-up" size="16"></app-icon>
                  <span>+12%</span>
                </div>
              </div>
              <div class="kpi-content">
                <div class="kpi-label">Receitas {{ getPeriodLabel() }}</div>
                <div class="kpi-value">R$ {{ formatCurrency(kpis.totalRevenue) }}</div>
                <div class="kpi-subtitle">{{ kpis.revenueTransactions }} transações</div>
              </div>
            </div>

            <div class="kpi-card hover-lift" [class.highlight]="selectedOrigin !== 'negocio'">
              <div class="kpi-header">
                <div class="kpi-icon expense">
                  <app-icon name="credit-card" size="20"></app-icon>
                </div>
                <div class="kpi-trend down">
                  <app-icon name="arrow-trending-down" size="16"></app-icon>
                  <span>+8%</span>
                </div>
              </div>
              <div class="kpi-content">
                <div class="kpi-label">Despesas {{ getPeriodLabel() }}</div>
                <div class="kpi-value expense">R$ {{ formatCurrency(kpis.totalExpenses) }}</div>
                <div class="kpi-subtitle">{{ kpis.expenseTransactions }} transações</div>
              </div>
            </div>

            <div class="kpi-card hover-lift" [class.highlight]="selectedOrigin !== 'negocio'">
              <div class="kpi-header">
                <div class="kpi-icon" [class]="kpis.netBalance >= 0 ? 'success' : 'warning'">
                  <app-icon [name]="kpis.netBalance >= 0 ? 'check-circle' : 'exclamation-triangle'" size="20"></app-icon>
                </div>
                <div class="kpi-meta">
                  <span class="kpi-percentage" [class]="kpis.netBalance >= 0 ? 'positive' : 'negative'">
                    {{ kpis.netBalance >= 0 ? 'Lucro' : 'Prejuízo' }}
                  </span>
                </div>
              </div>
              <div class="kpi-content">
                <div class="kpi-label">Saldo {{ getPeriodLabel() }}</div>
                <div class="kpi-value" [class]="kpis.netBalance >= 0 ? 'success' : 'expense'">{{ kpis.netBalance >= 0 ? '+' : '' }}R$ {{ formatCurrency(getAbsoluteValue(kpis.netBalance)) }}</div>
                <div class="kpi-subtitle">{{ kpis.totalTransactions }} transações total</div>
              </div>
            </div>

            <!-- KPIs Específicos para Negócio -->
            <div class="kpi-card hover-lift business-only" *ngIf="selectedOrigin === 'negocio' || selectedOrigin === 'ambos'" [class.highlight]="selectedOrigin === 'negocio'">
              <div class="kpi-header">
                <div class="kpi-icon business">
                  <app-icon name="chart-pie" size="20"></app-icon>
                </div>
                <div class="kpi-trend" [class]="kpis.profitMargin >= 20 ? 'up' : 'down'">
                  <app-icon [name]="kpis.profitMargin >= 20 ? 'arrow-trending-up' : 'arrow-trending-down'" size="16"></app-icon>
                  <span>{{ kpis.profitMargin }}%</span>
                </div>
              </div>
              <div class="kpi-content">
                <div class="kpi-label">Margem de Lucro</div>
                <div class="kpi-value" [class]="kpis.profitMargin >= 20 ? 'success' : kpis.profitMargin >= 10 ? 'warning' : 'expense'">{{ kpis.profitMargin }}%</div>
                <div class="kpi-subtitle">{{ kpis.profitMargin >= 20 ? 'Excelente' : kpis.profitMargin >= 10 ? 'Bom' : 'Precisa melhorar' }}</div>
              </div>
            </div>

            <div class="kpi-card hover-lift business-only" *ngIf="selectedOrigin === 'negocio' || selectedOrigin === 'ambos'" [class.highlight]="selectedOrigin === 'negocio'">
              <div class="kpi-header">
                <div class="kpi-icon business">
                  <app-icon name="calculator" size="20"></app-icon>
                </div>
                <div class="kpi-meta">
                  <span class="kpi-count">{{ kpis.salesCount }} vendas</span>
                </div>
              </div>
              <div class="kpi-content">
                <div class="kpi-label">Ticket Médio</div>
                <div class="kpi-value">R$ {{ formatCurrency(kpis.averageTicket) }}</div>
                <div class="kpi-subtitle">Por venda realizada</div>
              </div>
            </div>
          </div>

          <!-- Alertas Inteligentes -->
          <div class="smart-alerts animate-fade-in" *ngIf="smartAlerts.length > 0">
            <div class="alerts-header">
              <h3>
                <app-icon name="exclamation-triangle" size="20" className="text-warning"></app-icon>
                Alertas Inteligentes
              </h3>
              <span class="alerts-count">{{ smartAlerts.length }} alertas</span>
            </div>
            <div class="alerts-grid">
              <div class="alert-card hover-lift" 
                   *ngFor="let alert of smartAlerts" 
                   [class]="'alert-' + alert.type">
                <div class="alert-icon">
                  <app-icon [name]="alert.icon" size="20"></app-icon>
                </div>
                <div class="alert-content">
                  <h4 class="alert-title">{{ alert.title }}</h4>
                  <p class="alert-message">{{ alert.message }}</p>
                  <div class="alert-actions" *ngIf="alert.actions">
                    <button class="btn btn-sm btn-outline" 
                            *ngFor="let action of alert.actions"
                            (click)="handleAlertAction(action)">
                      {{ action.label }}
                    </button>
                  </div>
                </div>
                <button class="alert-close" (click)="dismissAlert(alert.id)">
                  <app-icon name="x-mark" size="16"></app-icon>
                </button>
              </div>
            </div>
          </div>

          <!-- Gráficos Interativos -->
          <div class="interactive-charts animate-fade-in">
            <div class="charts-header">
              <h3>
                <app-icon name="chart-bar" size="20" className="text-primary"></app-icon>
                Análise Visual
              </h3>
              <div class="chart-controls">
                <button class="btn btn-outline btn-sm" 
                        [class.active]="activeChartView === 'categorias'"
                        (click)="setActiveChart('categorias')">
                  <app-icon name="chart-pie" size="16"></app-icon>
                  <span>Categorias</span>
                </button>
                <button class="btn btn-outline btn-sm"
                        [class.active]="activeChartView === 'evolucao'"
                        (click)="setActiveChart('evolucao')">
                  <app-icon name="presentation-chart-line" size="16"></app-icon>
                  <span>Evolução</span>
                </button>
              </div>
            </div>

            <div class="charts-container">
              <!-- Gráfico de Pizza - Categorias -->
              <div class="chart-card" *ngIf="activeChartView === 'categorias'">
                <div class="chart-header">
                  <h4>Gastos por Categoria</h4>
                  <div class="chart-summary">
                    <span class="total-value">R$ {{ formatCurrency(getTotalExpensesByCategory()) }}</span>
                    <span class="period-label">{{ getPeriodLabel() }}</span>
                  </div>
                </div>
                <div class="pie-chart-container">
                  <div class="pie-chart-mock">
                    <!-- Mock Pie Chart usando CSS -->
                    <div class="pie-slice" 
                         *ngFor="let category of expenseCategories; let i = index"
                         [style.--slice-color]="category.color"
                         [style.--slice-percent]="category.percentage + '%'"
                         [style.transform]="'rotate(' + (category.startAngle || 0) + 'deg)'"
                         [attr.data-category]="category.name"
                         [attr.data-value]="formatCurrency(category.value)"
                         (mouseenter)="setHoveredCategory(category)"
                         (mouseleave)="setHoveredCategory(null)">
                    </div>
                    <div class="pie-center">
                      <div class="center-value" *ngIf="!hoveredCategory">
                        <span class="center-label">Total</span>
                        <span class="center-amount">R$ {{ formatCurrency(getTotalExpensesByCategory()) }}</span>
                      </div>
                      <div class="center-value" *ngIf="hoveredCategory">
                        <span class="center-label">{{ hoveredCategory.name }}</span>
                        <span class="center-amount">R$ {{ formatCurrency(hoveredCategory.value) }}</span>
                        <span class="center-percent">{{ hoveredCategory.percentage }}%</span>
                      </div>
                    </div>
                  </div>
                  <div class="chart-legend">
                    <div class="legend-item" 
                         *ngFor="let category of expenseCategories"
                         [class.hovered]="hoveredCategory?.name === category.name"
                         (mouseenter)="setHoveredCategory(category)"
                         (mouseleave)="setHoveredCategory(null)">
                      <div class="legend-color" [style.background-color]="category.color"></div>
                      <div class="legend-info">
                        <div class="legend-name">{{ category.name }}</div>
                        <div class="legend-value">R$ {{ formatCurrency(category.value) }} ({{ category.percentage }}%)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Gráfico de Linha - Evolução -->
              <div class="chart-card" *ngIf="activeChartView === 'evolucao'">
                <div class="chart-header">
                  <h4>Evolução Financeira</h4>
                  <div class="chart-toggle">
                    <button class="toggle-btn"
                            [class.active]="showRevenue"
                            (click)="toggleRevenue()">
                      <div class="toggle-color revenue"></div>
                      Receitas
                    </button>
                    <button class="toggle-btn"
                            [class.active]="showExpenses" 
                            (click)="toggleExpenses()">
                      <div class="toggle-color expenses"></div>
                      Despesas
                    </button>
                  </div>
                </div>
                <div class="line-chart-container">
                  <div class="chart-grid">
                    <!-- Grid lines -->
                    <div class="grid-line horizontal" *ngFor="let line of [0,1,2,3,4,5,6]" 
                         [style.bottom]="(line * 16.66) + '%'">
                      <span class="grid-label">{{ getYAxisLabel(line) }}</span>
                    </div>
                    <div class="grid-line vertical" *ngFor="let line of [0,1,2,3,4,5,6]" 
                         [style.left]="(line * 16.66) + '%'">
                    </div>
                  </div>
                  
                  <div class="chart-data">
                    <!-- Revenue Line -->
                    <svg class="chart-svg" *ngIf="showRevenue" viewBox="0 0 400 200">
                      <polyline 
                        fill="none" 
                        stroke="var(--accent-green)" 
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        [attr.points]="getRevenueLinePoints()">
                      </polyline>
                      <circle *ngFor="let point of revenuePoints; let i = index"
                              [attr.cx]="point.x"
                              [attr.cy]="point.y"
                              r="4"
                              fill="var(--accent-green)"
                              [attr.data-value]="point.value"
                              [attr.data-month]="point.month"
                              class="chart-point"
                              (mouseenter)="setHoveredPoint(point, 'revenue')"
                              (mouseleave)="setHoveredPoint(null, null)">
                      </circle>
                    </svg>

                    <!-- Expenses Line -->
                    <svg class="chart-svg" *ngIf="showExpenses" viewBox="0 0 400 200">
                      <polyline 
                        fill="none" 
                        stroke="var(--accent-red)" 
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        [attr.points]="getExpensesLinePoints()">
                      </polyline>
                      <circle *ngFor="let point of expensePoints; let i = index"
                              [attr.cx]="point.x"
                              [attr.cy]="point.y"
                              r="4"
                              fill="var(--accent-red)"
                              [attr.data-value]="point.value"
                              [attr.data-month]="point.month"
                              class="chart-point"
                              (mouseenter)="setHoveredPoint(point, 'expense')"
                              (mouseleave)="setHoveredPoint(null, null)">
                      </circle>
                    </svg>
                  </div>
                  
                  <!-- Month labels -->
                  <div class="month-labels">
                    <span class="month-label" *ngFor="let month of monthLabels">{{ month }}</span>
                  </div>

                  <!-- Tooltip -->
                  <div class="chart-tooltip" *ngIf="hoveredPoint" 
                       [style.left]="tooltipPosition.x + 'px'"
                       [style.top]="tooltipPosition.y + 'px'">
                    <div class="tooltip-title">{{ hoveredPoint.month }}</div>
                    <div class="tooltip-value" [class]="hoveredPointType">
                      {{ hoveredPointType === 'revenue' ? 'Receita' : 'Despesa' }}: 
                      R$ {{ formatCurrency(hoveredPoint.value) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Dashboard Customization Controls -->
          <div class="dashboard-controls">
            <div class="controls-header">
              <h3>Widgets Personalizáveis</h3>
              <div class="controls-actions">
                <button class="btn btn-ghost hover-scale focus-ring" (click)="toggleEditMode()">
                  <app-icon [name]="isEditMode ? 'check' : 'pencil'" size="16"></app-icon>
                  <span>{{ isEditMode ? 'Salvar Layout' : 'Personalizar' }}</span>
                </button>
                <button class="btn btn-outline hover-scale focus-ring" (click)="resetLayout()">
                  <app-icon name="arrow-path" size="16"></app-icon>
                  <span>Restaurar</span>
                </button>
                <button class="btn btn-secondary hover-scale focus-ring" (click)="exportDashboardData()">
                  <app-icon name="arrow-down-tray" size="16"></app-icon>
                  <span>Exportar</span>
                </button>
              </div>
            </div>
            <div class="edit-mode-help" *ngIf="isEditMode">
              <div class="help-text">
                <app-icon name="information-circle" size="16"></app-icon>
                <span>Arraste os widgets para reorganizar conforme sua preferência</span>
              </div>
            </div>
          </div>

          <!-- Customizable Widget Grid -->
          <div class="widgets-container animate-fade-in" 
               [class.edit-mode]="isEditMode"
               cdkDropList
               (cdkDropListDropped)="dropWidget($event)">
            <div class="widget-wrapper hover-lift animate-fade-in-scale" 
                 *ngFor="let widget of visibleWidgets; trackBy: trackWidgetById; let i = index"
                 [class]="'widget-size-' + widget.size"
                 [class.dragging]="isEditMode"
                 [style.animation-delay]="(i * 0.1) + 's'"
                 cdkDrag
                 [cdkDragDisabled]="!isEditMode">
              
              <!-- Widget Move Handle -->
              <div class="widget-handle" *ngIf="isEditMode" cdkDragHandle>
                <app-icon name="bars-3" size="16"></app-icon>
              </div>
              
              <!-- Financial Summary Widgets -->
              <app-financial-summary-widget
                *ngIf="widget.type === 'financial-summary'"
                [title]="widget.title"
                [data]="widget.data">
              </app-financial-summary-widget>
              
              <!-- Chart Widgets -->
              <app-chart-widget
                *ngIf="widget.type === 'chart'"
                [title]="widget.title"
                [data]="widget.data">
              </app-chart-widget>
              
              <!-- Goals Widget -->
              <app-goals-widget
                *ngIf="widget.type === 'goals'"
                [title]="widget.title"
                [data]="widget.data">
              </app-goals-widget>
              
              <!-- Transactions Widget -->
              <div class="custom-widget transactions-widget" *ngIf="widget.type === 'transactions'">
                <div class="widget-header">
                  <h3>{{ widget.title }}</h3>
                  <a routerLink="/platform/transacoes" class="view-all-link">
                    <app-icon name="arrow-right" size="16"></app-icon>
                  </a>
                </div>
                <div class="transactions-list">
                  <div class="transaction-item" *ngFor="let transaction of widget.data?.transactions">
                    <div class="transaction-info">
                      <div class="transaction-icon" [class]="transaction.type">
                        <app-icon [name]="transaction.type === 'income' ? 'arrow-trending-up' : 'arrow-trending-down'" size="16"></app-icon>
                      </div>
                      <div class="transaction-details">
                        <div class="transaction-description">{{ transaction.description }}</div>
                        <div class="transaction-date">{{ transaction.date }}</div>
                      </div>
                    </div>
                    <div class="transaction-amount" [class]="transaction.type">
                      {{ transaction.amount > 0 ? '+' : '' }}R$ {{ formatCurrency(getAbsoluteValue(transaction.amount)) }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Notifications Widget -->
              <div class="custom-widget notifications-widget" *ngIf="widget.type === 'notifications'">
                <div class="widget-header">
                  <h3>{{ widget.title }}</h3>
                  <button class="mark-all-read">
                    <app-icon name="check-circle" size="16"></app-icon>
                  </button>
                </div>
                <div class="notifications-list">
                  <div class="notification-item" *ngFor="let notification of widget.data?.notifications" [class]="notification.type">
                    <div class="notification-icon" [class]="notification.type">
                      <app-icon 
                        [name]="notification.type === 'success' ? 'check-circle' : notification.type === 'warning' ? 'exclamation-triangle' : 'information-circle'" 
                        size="16">
                      </app-icon>
                    </div>
                    <div class="notification-content">
                      <div class="notification-title">{{ notification.title }}</div>
                      <div class="notification-text">{{ notification.message }}</div>
                    </div>
                    <button class="notification-dismiss">
                      <app-icon name="x-mark" size="14"></app-icon>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Quick Actions Widget -->
              <div class="custom-widget quick-actions-widget" *ngIf="widget.type === 'quick-actions'">
                <div class="widget-header">
                  <h3>{{ widget.title }}</h3>
                </div>
                <div class="quick-actions-grid">
                  <button class="quick-action" *ngFor="let action of widget.data?.actions" (click)="executeQuickAction(action.action)">
                    <div class="action-icon">
                      <app-icon [name]="action.icon" size="20" className="icon-primary"></app-icon>
                    </div>
                    <span class="action-label">{{ action.label }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  `,
  styles: [`
    .main-content {
      overflow-y: auto;
      min-height: 100vh;
      background: var(--bg-tertiary);
    }

    .dashboard-content {
      padding: var(--space-8);
      flex: 1;
      min-height: calc(100vh - 120px);
    }

    .btn-secondary {
      background: linear-gradient(135deg, var(--accent-purple), #7c3aed);
      color: var(--text-inverse);
      border: 1px solid var(--accent-purple);

      &:hover {
        background: linear-gradient(135deg, #7c3aed, #6d28d9);
        box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3);
      }
    }
    
    .filter-summary {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .filter-actions {
      display: flex;
      gap: var(--space-2);
    }
    
    .date-range {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    
    .date-separator {
      color: var(--text-tertiary);
      font-size: 0.875rem;
    }
    
    .kpi-trend, .kpi-meta {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: 0.75rem;
      font-weight: 600;
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-md);
    }
    
    .kpi-trend.up {
      background: var(--accent-green-light);
      color: var(--accent-green);
    }
    
    .kpi-trend.down {
      background: var(--accent-red-light);
      color: var(--accent-red);
    }
    
    .kpi-percentage.positive {
      color: var(--accent-green);
    }
    
    .kpi-percentage.negative {
      color: var(--accent-red);
    }
    
    .kpi-count {
      color: var(--text-tertiary);
      font-size: 0.75rem;
    }

    .alerts-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);

      h3 {
        color: var(--text-primary);
        font-size: 1.125rem;
        font-weight: 600;
        margin: 0;
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }
    }

    .alerts-count {
      background: var(--accent-orange-light);
      color: var(--accent-orange);
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .alerts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: var(--space-4);
    }

    .alert-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-lg);
      flex-shrink: 0;
      margin-top: var(--space-1);
    }

    .alert-danger .alert-icon {
      background: var(--accent-red);
      color: var(--text-inverse);
    }

    .alert-warning .alert-icon {
      background: var(--accent-orange);
      color: var(--text-inverse);
    }

    .alert-info .alert-icon {
      background: var(--accent-blue);
      color: var(--text-inverse);
    }

    .alert-success .alert-icon {
      background: var(--accent-green);
      color: var(--text-inverse);
    }

    .alert-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .alert-title {
      color: var(--text-primary);
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
      line-height: 1.3;
    }

    .alert-message {
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 0;
    }

    .alert-actions {
      display: flex;
      gap: var(--space-2);
      margin-top: var(--space-2);
      flex-wrap: wrap;

      .btn {
        font-size: 0.75rem;
        padding: var(--space-1) var(--space-2);
      }
    }

    .alert-close {
      position: absolute;
      top: var(--space-3);
      right: var(--space-3);
      background: none;
      border: none;
      color: var(--text-tertiary);
      cursor: pointer;
      padding: var(--space-1);
      border-radius: var(--radius-md);
      transition: all 0.2s ease;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: var(--bg-secondary);
        color: var(--text-primary);
      }
    }

    .interactive-charts {
      background: var(--bg-primary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      margin-bottom: var(--space-6);
      box-shadow: var(--shadow-sm);
      min-height: 450px;
      display: flex;
      flex-direction: column;
    }

    .charts-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-6);

      h3 {
        color: var(--text-primary);
        font-size: 1.125rem;
        font-weight: 600;
        margin: 0;
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }
    }

    .chart-controls {
      display: flex;
      gap: var(--space-2);

      .btn {
        padding: var(--space-2) var(--space-3);
        font-size: 0.875rem;
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }
    }

    .charts-container {
      flex: 1;
      min-height: 350px;
      height: auto;
      overflow: visible;
    }

    .chart-card {
      background: var(--bg-secondary);
      border-radius: var(--radius-lg);
      padding: var(--space-6);
      border: 1px solid var(--border-primary);
      height: 100%;
      min-height: 350px;
      display: flex;
      flex-direction: column;
    }

    .chart-summary {
      text-align: right;
    }

    .total-value {
      display: block;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .period-label {
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }

    .pie-chart-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-8);
      align-items: center;
      min-height: 250px;
      height: 100%;
      flex: 1;
    }

    .pie-chart-mock {
      position: relative;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: conic-gradient(
        #ef4444 0deg 117deg,
        #f97316 117deg 197deg,
        #eab308 197deg 265deg,
        #22c55e 265deg 314deg,
        #3b82f6 314deg 347deg,
        #8b5cf6 347deg 360deg
      );
      margin: 0 auto;
      cursor: pointer;
    }

    .pie-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80px;
      height: 80px;
      background: var(--bg-primary);
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-sm);
    }

    .center-value {
      text-align: center;
    }

    .center-label {
      display: block;
      font-size: 0.75rem;
      color: var(--text-tertiary);
      margin-bottom: var(--space-1);
    }

    .center-amount {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .center-percent {
      display: block;
      font-size: 0.75rem;
      color: var(--accent-blue);
      font-weight: 600;
    }

    .chart-legend {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-2);
      border-radius: var(--radius-md);
      transition: all 0.2s ease;
      cursor: pointer;

      &:hover,
      &.hovered {
        background: var(--accent-blue-light);
      }
    }

    .legend-color {
      width: 16px;
      height: 16px;
      border-radius: var(--radius-sm);
      flex-shrink: 0;
    }

    .legend-info {
      flex: 1;
    }

    .legend-name {
      font-weight: 500;
      color: var(--text-primary);
      font-size: 0.875rem;
    }

    .legend-value {
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }

    .chart-toggle {
      display: flex;
      gap: var(--space-3);
    }

    .toggle-btn {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      background: none;
      border: 1px solid var(--border-secondary);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--border-primary);
        background: var(--bg-tertiary);
      }

      &.active {
        border-color: var(--accent-blue);
        background: var(--accent-blue-light);
        color: var(--accent-blue);
      }
    }

    .toggle-color {
      width: 12px;
      height: 12px;
      border-radius: var(--radius-sm);

      &.revenue {
        background: var(--accent-green);
      }

      &.expenses {
        background: var(--accent-red);
      }
    }

    .line-chart-container {
      position: relative;
      height: 280px;
      min-height: 280px;
      margin-top: var(--space-4);
      overflow: visible;
      flex: 1;
    }

    .chart-grid {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 40px;
    }

    .grid-line {
      position: absolute;

      &.horizontal {
        left: 40px;
        right: 0;
        border-top: 1px solid var(--border-primary);
      }

      &.vertical {
        top: 0;
        bottom: 0;
        border-left: 1px solid var(--border-primary);
      }
    }

    .grid-label {
      position: absolute;
      left: -35px;
      top: -8px;
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }

    .chart-data {
      position: absolute;
      top: 0;
      left: 40px;
      right: 0;
      bottom: 40px;
    }

    .chart-svg {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .chart-point {
      transition: all 0.2s ease;
      cursor: pointer;

      &:hover {
        r: 6;
      }
    }

    .month-labels {
      position: absolute;
      bottom: 0;
      left: 40px;
      right: 0;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .month-label {
      font-size: 0.75rem;
      color: var(--text-tertiary);
      text-align: center;
      flex: 1;
    }

    .chart-tooltip {
      position: absolute;
      background: var(--bg-primary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-md);
      padding: var(--space-2) var(--space-3);
      box-shadow: var(--shadow-md);
      z-index: 10;
      pointer-events: none;
    }

    .tooltip-title {
      font-size: 0.75rem;
      color: var(--text-tertiary);
      margin-bottom: var(--space-1);
    }

    .tooltip-value {
      font-size: 0.875rem;
      font-weight: 600;

      &.revenue {
        color: var(--accent-green);
      }

      &.expense {
        color: var(--accent-red);
      }
    }
    
    .dashboard-controls {
      margin-bottom: var(--space-6);
    }
    
    .controls-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);

      h3 {
        color: var(--text-primary);
        font-size: 1.125rem;
        font-weight: 600;
        margin: 0;
      }
    }
    
    .controls-actions {
      display: flex;
      gap: var(--space-3);
    }
    
    .edit-mode-help {
      background: var(--accent-blue-light);
      border: 1px solid var(--accent-blue);
      border-radius: var(--radius-lg);
      padding: var(--space-4);
    }
    
    .help-text {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--accent-blue);
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .widgets-container.animate-fade-in {
      animation: fadeInUp 0.6s ease-out;
    }
    
    .widget-wrapper.cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    
    .widget-wrapper.cdk-drag-dragging {
      z-index: 1000;
      box-shadow: var(--shadow-lg);
      transform: rotate(5deg);
    }
    
    .widget-size-small {
      grid-column: span 1;
      grid-row: span 1;
    }
    
    .widget-size-medium {
      grid-column: span 2;
      grid-row: span 2;
    }
    
    .widget-size-large {
      grid-column: span 4;
      grid-row: span 2;
    }
    
    .widget-handle {
      position: absolute;
      top: var(--space-2);
      right: var(--space-2);
      z-index: 10;
      background: var(--accent-blue);
      color: var(--text-inverse);
      border-radius: var(--radius-md);
      padding: var(--space-1);
      cursor: grab;
      opacity: 0.7;
      transition: all 0.2s ease;

      &:hover {
        opacity: 1;
        transform: scale(1.1);
      }

      &:active {
        cursor: grabbing;
      }
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

      &:hover {
        background: var(--accent-blue-light);
        color: var(--accent-blue);
      }
    }
    
    .transactions-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    
    .transaction-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-3);
      border-radius: var(--radius-lg);
      background: var(--bg-secondary);
      transition: all 0.2s ease;

      &:hover {
        background: var(--accent-blue-light);
      }
    }
    
    .transaction-info {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }
    
    .transaction-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: var(--radius-lg);

      &.income {
        background: var(--accent-green-light);
        color: var(--accent-green);
      }

      &.expense {
        background: var(--accent-red-light);
        color: var(--accent-red);
      }
    }
    
    .transaction-description {
      font-weight: 500;
      color: var(--text-primary);
      font-size: 0.875rem;
    }
    
    .transaction-date {
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }
    
    .transaction-amount {
      font-weight: 600;
      font-size: 0.875rem;

      &.income {
        color: var(--accent-green);
      }

      &.expense {
        color: var(--accent-red);
      }
    }
    
    .notifications-widget .mark-all-read {
      background: none;
      border: none;
      color: var(--accent-blue);
      cursor: pointer;
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-md);
      font-size: 0.75rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: var(--space-1);
      transition: all 0.2s ease;

      &:hover {
        background: var(--accent-blue-light);
      }
    }
    
    .notifications-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    
    .notification-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
      padding: var(--space-3);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-primary);
      transition: all 0.2s ease;

      &:hover {
        box-shadow: var(--shadow-sm);
      }

      &.success {
        border-left: 3px solid var(--accent-green);
        background: var(--accent-green-light);
      }

      &.warning {
        border-left: 3px solid var(--accent-orange);
        background: var(--accent-orange-light);
      }

      &.info {
        border-left: 3px solid var(--accent-blue);
        background: var(--accent-blue-light);
      }
    }
    
    .notification-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: var(--radius-md);
      flex-shrink: 0;

      &.success {
        color: var(--accent-green);
      }

      &.warning {
        color: var(--accent-orange);
      }

      &.info {
        color: var(--accent-blue);
      }
    }
    
    .notification-content {
      flex: 1;
    }
    
    .notification-title {
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--space-1);
      font-size: 0.875rem;
    }
    
    .notification-text {
      font-size: 0.75rem;
      color: var(--text-secondary);
      line-height: 1.4;
    }
    
    .notification-dismiss {
      background: none;
      border: none;
      color: var(--text-tertiary);
      cursor: pointer;
      padding: var(--space-1);
      border-radius: var(--radius-md);
      transition: all 0.2s ease;
      flex-shrink: 0;

      &:hover {
        background: var(--bg-secondary);
        color: var(--text-primary);
      }
    }
    
    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: var(--space-3);
      flex: 1;
    }
    
    .quick-action {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-4);
      background: var(--bg-secondary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
      color: var(--text-secondary);

      &:hover {
        background: var(--accent-blue-light);
        border-color: var(--accent-blue);
        color: var(--accent-blue);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);

        .action-icon {
          background: var(--accent-blue);
          color: var(--text-inverse);
        }
      }
    }
    
    .action-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: var(--bg-primary);
      border-radius: var(--radius-lg);
      transition: all 0.2s ease;
    }
    
    .action-label {
      font-size: 0.75rem;
      font-weight: 500;
      text-align: center;
      line-height: 1.2;
    }
    
    @media (max-width: 1024px) {
      .filter-group {
        min-width: auto;
      }
      
      .widget-size-medium {
        grid-column: span 1;
        grid-row: span 1;
      }
      
      .widget-size-large {
        grid-column: span 2;
        grid-row: span 1;
      }

      .interactive-charts {
        min-height: 400px;
      }

      .chart-card {
        min-height: 300px;
      }

      .line-chart-container {
        height: 250px;
        min-height: 250px;
      }

      .pie-chart-container {
        grid-template-columns: 1fr;
        gap: var(--space-4);
        text-align: center;
      }
    }

    @media (max-width: 640px) {
      .widget-size-small,
      .widget-size-medium,
      .widget-size-large {
        grid-column: span 1;
        grid-row: span 1;
      }
      
      .controls-header {
        flex-direction: column;
        gap: var(--space-3);
        align-items: flex-start;
      }
      
      .controls-actions {
        width: 100%;
      }
      
      .header-actions .btn {
        justify-content: center;
      }
      
      .quick-actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .date-range {
        flex-direction: column;
        align-items: stretch;
      }
      
      .filter-summary {
        flex-direction: column;
        gap: var(--space-1);
        align-items: flex-start;
      }

      .filter-actions {
        flex-direction: column;
        width: 100%;
      }

      .dashboard-content {
        padding: var(--space-4);
        min-height: calc(100vh - 140px);
      }

      .interactive-charts {
        min-height: 350px;
        padding: var(--space-4);
      }

      .chart-card {
        min-height: 280px;
      }

      .line-chart-container {
        height: 220px;
        min-height: 220px;
      }

      .pie-chart-container {
        grid-template-columns: 1fr;
        gap: var(--space-3);
        min-height: 200px;
      }

      .pie-chart-mock {
        width: 160px;
        height: 160px;
      }
    }

    /* Scrollbar personalizada */
    .dashboard-content {
      scrollbar-width: thin;
      scrollbar-color: var(--border-secondary) transparent;
    }

    .dashboard-content::-webkit-scrollbar {
      width: 8px;
    }

    .dashboard-content::-webkit-scrollbar-track {
      background: transparent;
    }

    .dashboard-content::-webkit-scrollbar-thumb {
      background: var(--border-secondary);
      border-radius: var(--radius-sm);
    }

    .dashboard-content::-webkit-scrollbar-thumb:hover {
      background: var(--text-tertiary);
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  
  isEditMode = false;
  widgets: DashboardWidget[] = [];
  visibleWidgets: DashboardWidget[] = [];
  
  // Filtros Globais
  selectedPeriod = 'mes-atual';
  selectedOrigin = 'ambos';
  customDateFrom = '';
  customDateTo = '';
  
  // Dados reais
  transactions: Transaction[] = [];
  goals: Goal[] = [];
  
  // KPIs Calculados dinamicamente
  kpis: KPIData = {
    totalRevenue: 0,
    totalExpenses: 0,
    netBalance: 0,
    revenueTransactions: 0,
    expenseTransactions: 0,
    totalTransactions: 0,
    profitMargin: 0,
    averageTicket: 0,
    salesCount: 0
  };

  // Alertas Inteligentes
  smartAlerts: any[] = [];

  // Gráficos Interativos
  activeChartView: 'categorias' | 'evolucao' = 'categorias';
  showRevenue = true;
  showExpenses = true;
  hoveredCategory: any = null;
  hoveredPoint: any = null;
  hoveredPointType: 'revenue' | 'expense' | null = null;
  tooltipPosition = { x: 0, y: 0 };

  // Dados dos gráficos calculados dinamicamente
  expenseCategories: CategoryData[] = [];

  monthLabels = ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan'];
  
  revenuePoints = [
    { x: 57, y: 120, value: 12500, month: 'Jul' },
    { x: 114, y: 95, value: 14200, month: 'Ago' },
    { x: 171, y: 110, value: 13100, month: 'Set' },
    { x: 228, y: 70, value: 16800, month: 'Out' },
    { x: 285, y: 85, value: 15600, month: 'Nov' },
    { x: 342, y: 50, value: 18200, month: 'Dez' },
    { x: 399, y: 45, value: 19100, month: 'Jan' }
  ];

  expensePoints = [
    { x: 57, y: 150, value: 8200, month: 'Jul' },
    { x: 114, y: 140, value: 9100, month: 'Ago' },
    { x: 171, y: 145, value: 8750, month: 'Set' },
    { x: 228, y: 135, value: 9450, month: 'Out' },
    { x: 285, y: 125, value: 10200, month: 'Nov' },
    { x: 342, y: 155, value: 8100, month: 'Dez' },
    { x: 399, y: 130, value: 9800, month: 'Jan' }
  ];

  constructor(
    private widgetsService: DashboardWidgetsService,
    private dataService: DataService,
    private calculatorService: FinancialCalculatorService,
    private router: Router,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.loadWidgets();
    this.subscribeToData();
    this.calculateDashboard();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private subscribeToData(): void {
    this.subscriptions.add(
      this.dataService.transactions$.subscribe(transactions => {
        this.transactions = transactions;
        this.calculateDashboard();
      })
    );
    
    this.subscriptions.add(
      this.dataService.goals$.subscribe(goals => {
        this.goals = goals;
        this.calculateDashboard();
      })
    );
  }

  loadWidgets() {
    this.widgetsService.widgets$.subscribe(widgets => {
      this.widgets = widgets;
      this.visibleWidgets = widgets.filter(w => w.visible);
    });
  }

  formatCurrency(value: number): string {
    return this.calculatorService.formatCurrency(value);
  }


  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.widgetsService.updateWidgets(this.widgets);
    }
  }

  resetLayout(): void {
    this.widgetsService.resetToDefault();
    this.isEditMode = false;
  }

  dropWidget(event: CdkDragDrop<DashboardWidget[]>): void {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.visibleWidgets, event.previousIndex, event.currentIndex);
      // Update the widgets array to reflect the new order
      this.widgets = [...this.visibleWidgets];
    }
  }

  trackWidgetById(index: number, widget: DashboardWidget): string {
    return widget.id;
  }

  executeQuickAction(action: string): void {
    switch (action) {
      case 'add-transaction':
        this.openNewTransactionModal();
        break;
      case 'add-goal':
        this.openCreateGoalModal();
        break;
      case 'view-report':
        this.router.navigate(['/platform/relatorios']);
        break;
      case 'view-transactions':
        this.router.navigate(['/platform/transacoes']);
        break;
      case 'view-notifications':
        this.router.navigate(['/platform/notificacoes']);
        break;
      case 'view-settings':
        this.router.navigate(['/platform/configuracoes']);
        break;
    }
  }

  // Implementação das funcionalidades de modal
  openNewTransactionModal(): void {
    this.modalService.openModal('transaction', {
      title: 'Nova Transação',
      mode: 'create',
      onConfirm: (transactionData: any) => {
        this.addNewTransaction(transactionData);
      }
    });
  }

  openCreateGoalModal(): void {
    this.modalService.openModal('goal', {
      title: 'Nova Meta Financeira',
      mode: 'create',
      onConfirm: (goalData: any) => {
        this.addNewGoal(goalData);
      }
    });
  }

  openUpgradePremiumModal(): void {
    this.modalService.openModal('premium', {
      title: 'Upgrade para Premium',
      subtitle: 'Desbloqueie recursos avançados',
      features: [
        'Relatórios avançados e exportação',
        'Integrações com bancos',
        'Alertas personalizados',
        'Suporte prioritário',
        'Dashboard customizável',
        'Análises preditivas'
      ],
      plans: [
        {
          name: 'Premium Mensal',
          price: 29.90,
          period: 'mês',
          popular: false
        },
        {
          name: 'Premium Anual',
          price: 299.90,
          period: 'ano',
          popular: true,
          discount: '2 meses grátis'
        }
      ],
      onConfirm: (planData: any) => {
        this.upgradeToPremium(planData);
      }
    });
  }

  // Métodos para adicionar transações e metas
  private addNewTransaction(transactionData: any): void {
    const transactionToAdd = {
      type: transactionData.type as 'income' | 'expense',
      amount: parseFloat(transactionData.amount),
      description: transactionData.description,
      category: transactionData.category,
      date: transactionData.date || new Date().toISOString().split('T')[0],
      origin: (transactionData.origin || 'personal') as 'personal' | 'business'
    };

    this.dataService.addTransaction(transactionToAdd);
    
    // Mostrar notificação de sucesso
    this.showSuccessMessage(`Transação ${transactionData.type === 'income' ? 'de receita' : 'de despesa'} adicionada com sucesso!`);
    
    // Recalcular dashboard
    this.calculateDashboard();
  }

  private addNewGoal(goalData: any): void {
    const goalToAdd = {
      name: goalData.title,
      description: goalData.description,
      target: parseFloat(goalData.targetAmount),
      deadline: goalData.deadline,
      priority: (goalData.priority || 'medium') as 'low' | 'medium' | 'high',
      origin: 'personal' as 'personal' | 'business',
      icon: this.getGoalIcon(goalData.category),
      monthlyTarget: this.calculateMonthlyTarget(parseFloat(goalData.targetAmount), goalData.deadline)
    };

    this.dataService.addGoal(goalToAdd);
    
    // Mostrar notificação de sucesso
    this.showSuccessMessage('Meta financeira criada com sucesso!');
    
    // Recalcular dashboard
    this.calculateDashboard();
  }

  private upgradeToPremium(planData: any): void {
    // Simular processo de upgrade
    console.log('Processando upgrade para:', planData);
    
    // Em um app real, aqui seria feita a integração com gateway de pagamento
    setTimeout(() => {
      this.showSuccessMessage('Upgrade realizado com sucesso! Bem-vindo ao Premium!');
      
      // Atualizar status do usuário
      localStorage.setItem('userPremiumStatus', 'true');
      
      // Recarregar dados ou atualizar interface
      this.loadWidgets();
    }, 2000);
  }

  private getMonthsUntilDeadline(deadline: string): number {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = Math.abs(deadlineDate.getTime() - today.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return Math.max(diffMonths, 1);
  }

  private calculateMonthlyTarget(targetAmount: number, deadline: string): number {
    const monthsUntilDeadline = this.getMonthsUntilDeadline(deadline);
    return targetAmount / monthsUntilDeadline;
  }

  private getGoalIcon(category: string): string {
    const iconMap: { [key: string]: string } = {
      'home': 'home',
      'travel': 'airplane',
      'education': 'academic-cap',
      'vehicle': 'truck',
      'emergency': 'shield-exclamation',
      'investment': 'chart-bar',
      'business': 'building-office',
      'health': 'heart',
      'family': 'users',
      'other': 'star'
    };
    return iconMap[category] || 'star';
  }

  private showSuccessMessage(message: string): void {
    // Adicionar um alerta temporário de sucesso
    const successAlert = {
      id: Date.now().toString(),
      type: 'success',
      title: 'Sucesso!',
      message: message,
      icon: 'check-circle',
      actions: []
    };
    
    this.smartAlerts.unshift(successAlert);
    
    // Remover o alerta após 5 segundos
    setTimeout(() => {
      this.dismissAlert(successAlert.id);
    }, 5000);
  }

  getAbsoluteValue(value: number): number {
    return Math.abs(value);
  }
  
  onFiltersChange(): void {
    this.calculateDashboard();
  }
  
  private calculateDashboard(): void {
    if (this.transactions.length === 0) return;
    
    const period: PeriodFilter = {
      type: this.selectedPeriod as any,
      customFrom: this.customDateFrom || undefined,
      customTo: this.customDateTo || undefined
    };
    
    const origin = this.mapOriginFilter(this.selectedOrigin);
    
    // Calcular KPIs
    this.kpis = this.calculatorService.calculateKPIs(this.transactions, period, origin);
    
    // Calcular categorias de despesas
    this.expenseCategories = this.calculatorService.analyzeExpenseCategories(this.transactions, period, origin);
    
    // Atualizar widgets com dados reais
    this.updateWidgetData();
    
    // Gerar alertas inteligentes
    this.generateSmartAlerts();
  }

  private updateWidgetData(): void {
    const goalsData = this.calculatorService.analyzeGoals(this.goals);
    const integratedHealth = this.calculatorService.calculateIntegratedFinancialHealth(
      this.transactions, 
      this.goals, 
      {
        type: this.selectedPeriod as any,
        customFrom: this.customDateFrom || undefined,
        customTo: this.customDateTo || undefined
      }
    );

    // Atualizar widget de metas com dados reais
    this.widgets = this.widgets.map(widget => {
      if (widget.type === 'goals') {
        return {
          ...widget,
          data: {
            goals: this.goals,
            totalInGoals: goalsData.totalInGoals,
            totalSaved: goalsData.totalSaved,
            activeGoals: goalsData.activeGoals,
            overallProgress: goalsData.overallProgress,
            nextGoal: goalsData.nextGoal,
            monthlyCommitment: integratedHealth.monthlyCommitmentToGoals,
            financialCapacity: integratedHealth.financialCapacity,
            availableForGoals: integratedHealth.availableForGoals
          }
        };
      }
      
      if (widget.type === 'financial-summary') {
        return {
          ...widget,
          data: {
            ...this.kpis,
            goalImpact: integratedHealth.goalImpactOnBudget,
            capacityStatus: integratedHealth.financialCapacity
          }
        };
      }
      
      return widget;
    });

    this.visibleWidgets = this.widgets.filter(w => w.visible);
  }
  
  private mapOriginFilter(filter: string): 'personal' | 'business' | 'both' {
    switch (filter) {
      case 'pessoal': return 'personal';
      case 'negocio': return 'business';
      default: return 'both';
    }
  }
  
  getPeriodLabel(): string {
    switch (this.selectedPeriod) {
      case 'mes-atual': return 'deste mês';
      case 'mes-anterior': return 'do mês anterior';
      case 'ultimos-30-dias': return 'dos últimos 30 dias';
      case 'ultimos-90-dias': return 'dos últimos 90 dias';
      case 'ano-atual': return 'deste ano';
      case 'personalizado': return 'do período selecionado';
      default: return 'do período';
    }
  }

  generateSmartAlerts(): void {
    if (this.transactions.length === 0) {
      this.smartAlerts = [];
      return;
    }
    
    const goalAnalysis = this.goals.map(goal => 
      this.calculatorService.analyzeIndividualGoal(goal)
    );
    
    const origin = this.mapOriginFilter(this.selectedOrigin);
    
    this.smartAlerts = this.calculatorService.generateSmartAlerts(
      this.kpis,
      this.goals,
      goalAnalysis,
      origin
    );
  }

  dismissAlert(alertId: string): void {
    this.smartAlerts = this.smartAlerts.filter(alert => alert.id !== alertId);
  }

  handleAlertAction(action: any): void {
    switch (action.action) {
      case 'navigate':
        this.router.navigate([action.data]);
        break;
      case 'modal':
        this.modalService.openModal(action.data.type, action.data.config || {});
        break;
      case 'external':
        window.open(action.data, '_blank');
        break;
      case 'add-transaction':
        this.openNewTransactionModal();
        break;
      case 'create-goal':
        this.openCreateGoalModal();
        break;
      case 'view-transactions':
        this.router.navigate(['/platform/transacoes']);
        break;
      case 'view-reports':
        this.router.navigate(['/platform/relatorios']);
        break;
    }
  }

  // Chart Methods
  setActiveChart(view: 'categorias' | 'evolucao'): void {
    this.activeChartView = view;
  }

  toggleRevenue(): void {
    this.showRevenue = !this.showRevenue;
  }

  toggleExpenses(): void {
    this.showExpenses = !this.showExpenses;
  }

  setHoveredCategory(category: any): void {
    this.hoveredCategory = category;
  }

  setHoveredPoint(point: any, type: 'revenue' | 'expense' | null): void {
    this.hoveredPoint = point;
    this.hoveredPointType = type;
    
    if (point) {
      // Calculate tooltip position (mock positioning)
      this.tooltipPosition = {
        x: point.x + 20,
        y: point.y - 40
      };
    }
  }

  getTotalExpensesByCategory(): number {
    return this.expenseCategories.reduce((total, cat) => total + cat.value, 0);
  }

  getRevenueLinePoints(): string {
    return this.revenuePoints.map(p => `${p.x},${p.y}`).join(' ');
  }

  getExpensesLinePoints(): string {
    return this.expensePoints.map(p => `${p.x},${p.y}`).join(' ');
  }

  getYAxisLabel(index: number): string {
    const maxValue = 20000;
    const value = (index * maxValue) / 6;
    return (value / 1000) + 'k';
  }

  // Métodos adicionais para melhorar a experiência do usuário
  refreshDashboard(): void {
    this.calculateDashboard();
    this.showSuccessMessage('Dashboard atualizado!');
  }

  exportDashboardData(): void {
    const dashboardData = {
      kpis: this.kpis,
      transactions: this.transactions,
      goals: this.goals,
      exportDate: new Date().toISOString(),
      period: this.selectedPeriod,
      origin: this.selectedOrigin
    };

    const dataStr = JSON.stringify(dashboardData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Método para configurar período personalizado
  setCustomPeriod(): void {
    if (this.customDateFrom && this.customDateTo) {
      this.selectedPeriod = 'personalizado';
      this.onFiltersChange();
    }
  }

  // Método para limpar filtros
  clearFilters(): void {
    this.selectedPeriod = 'mes-atual';
    this.selectedOrigin = 'ambos';
    this.customDateFrom = '';
    this.customDateTo = '';
    this.onFiltersChange();
  }
}