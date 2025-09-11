import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IconComponent],
  template: `
    <!-- Modern Fintech Transaction Page -->
    <div class="transaction-page">

      <!-- Header with Balance -->
      <header class="balance-header">
        <div class="balance-card">
          <div class="balance-info">
            <h1>Saldo Total</h1>
            <div class="balance-amount" [class]="getFilteredBalance() >= 0 ? 'positive' : 'negative'">
              R$ {{ formatCurrency(getAbsoluteBalance()) }}
            </div>
            <div class="balance-trend">
              <span class="trend-icon">📈</span>
              <span>+18.5% este mês</span>
            </div>
          </div>
          <div class="quick-actions">
            <button class="action-btn primary" (click)="showTransactionModal = true">
              <span>+</span> Nova Transação
            </button>
            <button class="action-btn secondary" (click)="exportCSV()">
              <span>↓</span> Exportar
            </button>
            <button class="action-btn smart" (click)="showCategorizationPanel = !showCategorizationPanel">
              <app-icon name="sparkles" size="16"></app-icon>
              <span>IA</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Smart Categorization Panel -->
      <section class="smart-categorization" *ngIf="showCategorizationPanel">
        <div class="categorization-card">
          <div class="categorization-header">
            <div class="header-left">
              <div class="ai-icon">
                <app-icon name="sparkles" size="24" className="text-primary"></app-icon>
              </div>
              <div class="header-text">
                <h3>Categorização Inteligente</h3>
                <p>Sistema de IA analisando suas transações para melhor organização</p>
              </div>
            </div>
            <div class="header-actions">
              <button class="toggle-btn" (click)="toggleCategorizationRules()">
                <app-icon name="cog-6-tooth" size="16"></app-icon>
                <span>Configurar Regras</span>
              </button>
              <button class="close-panel-btn" (click)="showCategorizationPanel = false">
                <app-icon name="x-mark" size="16"></app-icon>
              </button>
            </div>
          </div>

          <!-- AI Suggestions -->
          <div class="ai-suggestions" *ngIf="aiSuggestions.length > 0">
            <div class="suggestions-header">
              <app-icon name="light-bulb" size="20" className="text-warning"></app-icon>
              <h4>Sugestões de Categorização</h4>
              <span class="suggestions-count">{{ aiSuggestions.length }} sugestões</span>
            </div>
            
            <div class="suggestions-list">
              <div class="suggestion-item" *ngFor="let suggestion of aiSuggestions">
                <div class="suggestion-content">
                  <div class="transaction-preview">
                    <div class="preview-icon" [style.background-color]="suggestion.suggestedCategory.color + '20'">
                      {{ getCategoryEmoji(suggestion.suggestedCategory.name) }}
                    </div>
                    <div class="preview-info">
                      <div class="preview-description">{{ suggestion.transaction.description }}</div>
                      <div class="preview-details">
                        <span class="amount">R$ {{ formatCurrency(suggestion.transaction.amount) }}</span>
                        <span class="date">{{ formatDate(suggestion.transaction.date) }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="suggestion-action">
                    <div class="category-suggestion">
                      <span class="suggestion-text">Sugerir categoria:</span>
                      <div class="suggested-category" [style.background-color]="suggestion.suggestedCategory.color + '20'" [style.color]="suggestion.suggestedCategory.color">
                        {{ getCategoryEmoji(suggestion.suggestedCategory.name) }}
                        {{ suggestion.suggestedCategory.name }}
                      </div>
                      <span class="confidence">{{ suggestion.confidence }}% de confiança</span>
                    </div>
                    
                    <div class="suggestion-buttons">
                      <button class="suggestion-btn accept" (click)="acceptSuggestion(suggestion)">
                        <app-icon name="check" size="14"></app-icon>
                        <span>Aceitar</span>
                      </button>
                      <button class="suggestion-btn reject" (click)="rejectSuggestion(suggestion)">
                        <app-icon name="x-mark" size="14"></app-icon>
                        <span>Rejeitar</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Learning from User -->
                <div class="learning-indicator" *ngIf="suggestion.isLearning">
                  <app-icon name="academic-cap" size="16" className="text-blue"></app-icon>
                  <span>IA aprendendo com sua escolha...</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Auto-Categorization Rules -->
          <div class="categorization-rules" *ngIf="showRulesPanel">
            <div class="rules-header">
              <h4>
                <app-icon name="cog-6-tooth" size="20" className="text-secondary"></app-icon>
                Regras de Categorização Automática
              </h4>
              <button class="add-rule-btn" (click)="showAddRuleModal = true">
                <app-icon name="plus" size="14"></app-icon>
                <span>Nova Regra</span>
              </button>
            </div>

            <div class="rules-list">
              <div class="rule-item" *ngFor="let rule of categorizationRules">
                <div class="rule-content">
                  <div class="rule-condition">
                    <div class="condition-type">
                      <span class="condition-label">Se</span>
                      <span class="condition-field">{{ getRuleFieldName(rule.field) }}</span>
                      <span class="condition-operator">{{ getRuleOperatorName(rule.operator) }}</span>
                      <span class="condition-value">"{{ rule.value }}"</span>
                    </div>
                    <div class="rule-action">
                      <span class="action-label">Então</span>
                      <div class="action-category" [style.background-color]="rule.targetCategory.color + '20'" [style.color]="rule.targetCategory.color">
                        {{ getCategoryEmoji(rule.targetCategory.name) }}
                        {{ rule.targetCategory.name }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="rule-stats">
                    <span class="rule-usage">{{ rule.appliedCount }} aplicações</span>
                    <span class="rule-accuracy">{{ rule.accuracy }}% precisão</span>
                  </div>
                </div>
                
                <div class="rule-actions">
                  <button class="rule-action-btn" (click)="toggleRule(rule)" [class.active]="rule.isActive">
                    <app-icon [name]="rule.isActive ? 'pause' : 'play'" size="14"></app-icon>
                  </button>
                  <button class="rule-action-btn edit" (click)="editRule(rule)">
                    <app-icon name="pencil" size="14"></app-icon>
                  </button>
                  <button class="rule-action-btn delete" (click)="deleteRule(rule.id)">
                    <app-icon name="trash" size="14"></app-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="categorization-stats">
            <div class="stat-item">
              <div class="stat-icon">
                <app-icon name="chart-pie" size="16" className="text-success"></app-icon>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ getCategorizationAccuracy() }}%</span>
                <span class="stat-label">Precisão da IA</span>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon">
                <app-icon name="clock" size="16" className="text-blue"></app-icon>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ getAutoCategorizationCount() }}</span>
                <span class="stat-label">Auto categorizadas</span>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon">
                <app-icon name="academic-cap" size="16" className="text-purple"></app-icon>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ getActiveRulesCount() }}</span>
                <span class="stat-label">Regras ativas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Filters -->
      <section class="filters-section">
        <div class="filter-tabs">
          <button
            class="filter-tab"
            [class.active]="activeFilter === 'all'"
            (click)="setFilter('all')">
            Todas ({{ getTransactionCount('all') }})
          </button>
          <button
            class="filter-tab income"
            [class.active]="activeFilter === 'income'"
            (click)="setFilter('income')">
            <span class="emoji">📈</span> Receitas ({{ getTransactionCount('income') }})
          </button>
          <button
            class="filter-tab expense"
            [class.active]="activeFilter === 'expense'"
            (click)="setFilter('expense')">
            <span class="emoji">📉</span> Despesas ({{ getTransactionCount('expense') }})
          </button>
        </div>

        <div class="period-filter">
          <select [(ngModel)]="selectedPeriod" (change)="onPeriodChange()" class="modern-select">
            <option value="current-month">Mês atual</option>
            <option value="last-month">Mês anterior</option>
            <option value="current-year">Ano atual</option>
          </select>
        </div>
      </section>

      <!-- KPI Cards -->
      <section class="kpi-section">
        <div class="kpi-grid">
          <div class="kpi-card income">
            <div class="kpi-icon">💰</div>
            <div class="kpi-content">
              <div class="kpi-label">Receitas</div>
              <div class="kpi-value">R$ {{ formatCurrency(getFilteredIncome()) }}</div>
              <div class="kpi-trend positive">+12.8%</div>
            </div>
          </div>

          <div class="kpi-card expense">
            <div class="kpi-icon">💸</div>
            <div class="kpi-content">
              <div class="kpi-label">Despesas</div>
              <div class="kpi-value">R$ {{ formatCurrency(getFilteredExpenses()) }}</div>
              <div class="kpi-trend neutral">-3.2%</div>
            </div>
          </div>

          <div class="kpi-card balance" *ngIf="selectedOrigin === 'business' || selectedOrigin === 'all'">
            <div class="kpi-icon">📊</div>
            <div class="kpi-content">
              <div class="kpi-label">Margem de Lucro</div>
              <div class="kpi-value">{{ getProfitMargin().toFixed(1) }}%</div>
              <div class="kpi-trend" [class]="getProfitMargin() >= 0 ? 'positive' : 'negative'">
                {{ getProfitMargin() >= 0 ? '+' : '' }}{{ getProfitMargin().toFixed(1) }}%
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Transactions List -->
      <section class="transactions-section">
        <div class="section-header">
          <h2>Histórico de Transações</h2>
          <div class="transaction-count">{{ getFilteredTransactions().length }} transações</div>
        </div>

        <div class="transactions-container">
          <!-- Transaction Cards -->
          <div class="transaction-card"
               *ngFor="let transaction of getFilteredTransactions()"
               [class]="transaction.type"
               (click)="selectTransaction(transaction)">

            <div class="card-left">
              <div class="transaction-icon" [style.background-color]="transaction.categoryColor + '20'">
                {{ getCategoryEmoji(transaction.category) }}
              </div>
              <div class="transaction-info">
                <div class="transaction-title">{{ transaction.description }}</div>
                <div class="transaction-details">
                  <span class="category">{{ transaction.category }}</span>
                  <span class="date">{{ formatDate(transaction.date) }}</span>
                  <span class="method" *ngIf="transaction.method">{{ transaction.method }}</span>
                </div>
              </div>
            </div>

            <div class="card-right">
              <div class="transaction-amount" [class]="transaction.type">
                {{ transaction.type === 'income' ? '+' : '-' }}R$ {{ formatCurrency(transaction.amount) }}
              </div>
              <div class="card-actions">
                <button class="action-icon" (click)="editTransaction(transaction); $event.stopPropagation()" title="Editar">
                  ✏️
                </button>
                <button class="action-icon delete" (click)="deleteTransaction(transaction.id); $event.stopPropagation()" title="Excluir">
                  🗑️
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div class="empty-state" *ngIf="getFilteredTransactions().length === 0">
            <div class="empty-icon">🔍</div>
            <div class="empty-title">Nenhuma transação encontrada</div>
            <div class="empty-subtitle">Tente ajustar os filtros ou criar uma nova transação</div>
            <button class="action-btn primary" (click)="showTransactionModal = true">
              + Criar Transação
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- Transaction Modal -->
    <div class="modal-overlay" *ngIf="showTransactionModal" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ editingTransaction ? 'Editar' : 'Nova' }} Transação</h3>
          <button class="close-btn" (click)="closeModal()">✕</button>
        </div>

        <form class="transaction-form" (ngSubmit)="saveTransaction()">
          <div class="form-group">
            <label>Tipo *</label>
            <div class="type-selector">
              <button type="button"
                      class="type-btn"
                      [class.active]="newTransaction.type === 'income'"
                      (click)="setTransactionType('income')">
                📈 Receita
              </button>
              <button type="button"
                      class="type-btn"
                      [class.active]="newTransaction.type === 'expense'"
                      (click)="setTransactionType('expense')">
                📉 Despesa
              </button>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Descrição *</label>
              <input type="text"
                     [(ngModel)]="newTransaction.description"
                     name="description"
                     placeholder="Ex: Venda de produto, Pagamento fornecedor"
                     required>
            </div>
            <div class="form-group">
              <label>Valor (R$) *</label>
              <input type="number"
                     [(ngModel)]="newTransaction.amount"
                     name="amount"
                     step="0.01"
                     min="0"
                     placeholder="0,00"
                     required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Categoria *</label>
              <select [(ngModel)]="newTransaction.category" name="category" required>
                <option value="">Selecionar categoria</option>
                <option *ngFor="let category of getCategories()" [value]="category.name">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Data *</label>
              <input type="date"
                     [(ngModel)]="newTransaction.date"
                     name="date"
                     required>
            </div>
          </div>

          <div class="form-group">
            <label>Método de Pagamento</label>
            <select [(ngModel)]="newTransaction.method" name="method">
              <option value="">Selecionar método</option>
              <option value="PIX">PIX</option>
              <option value="Cartão de Crédito">Cartão de Crédito</option>
              <option value="Cartão de Débito">Cartão de Débito</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Transferência">Transferência</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="closeModal()">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              {{ editingTransaction ? 'Atualizar' : 'Criar' }} Transação
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    /* Modern Fintech Transaction Page Styles */
    .transaction-page {
      min-height: 100vh;
      padding: 1rem;
    }

    /* Balance Header */
    .balance-header {
      margin-bottom: 2rem;
    }

    .balance-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    .balance-info h1 {
      color: #334155;
      font-size: 1rem;
      margin: 0 0 0.5rem 0;
      font-weight: 500;
    }

    .balance-amount {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
    }

    .balance-amount.positive {
      color: #10b981;
    }

    .balance-amount.negative {
      color: #ef4444;
    }

    .balance-trend {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #10b981;
    }

    .quick-actions {
      display: flex;
      gap: 1rem;
    }

    .action-btn {
      padding: 1rem 1.5rem;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .action-btn.primary {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    }

    .action-btn.secondary {
      background: rgba(255, 255, 255, 0.8);
      color: #334155;
      border: 1px solid #e2e8f0;
    }

    .action-btn.smart {
      background: linear-gradient(135deg, #8b5cf6, #a855f7);
      color: white;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
    }

    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    /* Filters Section */
    .filters-section {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .filter-tabs {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .filter-tab {
      padding: 0.75rem 1.5rem;
      border: 2px solid #e2e8f0;
      background: white;
      border-radius: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .filter-tab:hover,
    .filter-tab.active {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-color: transparent;
      transform: translateY(-2px);
    }

    .filter-tab.income:not(.active):hover {
      background: #10b981;
      color: white;
      border-color: #10b981;
    }

    .filter-tab.expense:not(.active):hover {
      background: #f59e0b;
      color: white;
      border-color: #f59e0b;
    }

    .modern-select {
      padding: 0.75rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      background: white;
      cursor: pointer;
      font-size: 0.875rem;
    }

    /* KPI Section */
    .kpi-section {
      margin-bottom: 2rem;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .kpi-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 0.3s ease;
    }

    .kpi-card:hover {
      transform: translateY(-4px);
    }

    .kpi-card.income {
      border-left: 4px solid #10b981;
    }

    .kpi-card.expense {
      border-left: 4px solid #f59e0b;
    }

    .kpi-card.balance {
      border-left: 4px solid #8b5cf6;
    }

    .kpi-icon {
      font-size: 2rem;
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(102, 126, 234, 0.1);
    }

    .kpi-content {
      flex: 1;
    }

    .kpi-label {
      font-size: 0.875rem;
      color: #64748b;
      margin-bottom: 0.25rem;
    }

    .kpi-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }

    .kpi-trend {
      font-size: 0.75rem;
      font-weight: 500;
    }

    .kpi-trend.positive {
      color: #10b981;
    }

    .kpi-trend.negative {
      color: #ef4444;
    }

    .kpi-trend.neutral {
      color: #64748b;
    }

    /* Transactions Section */
    .transactions-section {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .section-header h2 {
      color: #1e293b;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
    }

    .transaction-count {
      color: #64748b;
      font-size: 0.875rem;
    }

    .transactions-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    /* Transaction Cards */
    .transaction-card {
      border: 1px solid #f1f5f9;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .transaction-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      border-color: #e2e8f0;
    }

    .transaction-card.income {
      border-left: 4px solid #10b981;
    }

    .transaction-card.expense {
      border-left: 4px solid #f59e0b;
    }

    .card-left {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
    }

    .transaction-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .transaction-info {
      flex: 1;
    }

    .transaction-title {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .transaction-details {
      display: flex;
      gap: 1rem;
      font-size: 0.75rem;
      color: #64748b;
      flex-wrap: wrap;
    }

    .card-right {
      display: flex;
      align-items: center;
      gap: 1rem;
      text-align: right;
    }

    .transaction-amount {
      font-size: 1.25rem;
      font-weight: 700;
    }

    .transaction-amount.income {
      color: #10b981;
    }

    .transaction-amount.expense {
      color: #f59e0b;
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-icon {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 8px;
      background: #f8fafc;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .action-icon:hover {
      background: #e2e8f0;
      transform: scale(1.1);
    }

    .action-icon.delete:hover {
      background: #fecaca;
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

    .empty-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .empty-subtitle {
      margin-bottom: 2rem;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }

    .modal-content {
      background: white;
      border-radius: 16px;
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .modal-header h3 {
      color: #1e293b;
      margin: 0;
      font-size: 1.25rem;
    }

    .close-btn {
      width: 36px;
      height: 36px;
      border: none;
      background: #f8fafc;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .transaction-form {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group label {
      display: block;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 0.875rem;
      transition: border-color 0.3s ease;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .type-selector {
      display: flex;
      gap: 0.5rem;
    }

    .type-btn {
      flex: 1;
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .type-btn:hover,
    .type-btn.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .btn-secondary {
      padding: 0.75rem 1.5rem;
      border: 2px solid #e5e7eb;
      background: white;
      color: #374151;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-primary {
      padding: 0.75rem 1.5rem;
      border: none;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .transaction-page {
        padding: 0.5rem;
      }

      .balance-card {
        flex-direction: column;
        text-align: center;
        padding: 1.5rem;
      }

      .balance-amount {
        font-size: 2rem;
      }

      .filters-section {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-tabs {
        justify-content: center;
      }

      .kpi-grid {
        grid-template-columns: 1fr;
      }

      .transaction-card {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .card-right {
        width: 100%;
        justify-content: space-between;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .type-selector {
        flex-direction: column;
      }
    }

    @media (max-width: 480px) {
      .filter-tabs {
        flex-direction: column;
      }

      .filter-tab {
        justify-content: center;
      }

      .quick-actions {
        flex-direction: column;
        width: 100%;
      }

      .transaction-details {
        flex-direction: column;
        gap: 0.25rem;
      }
    }

    /* ============ Smart Categorization Styles ============ */
    .smart-categorization {
      margin-bottom: 2rem;
    }

    .categorization-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
      overflow: hidden;
    }

    .categorization-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .ai-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #8b5cf6, #a855f7);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .header-text h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 0.25rem 0;
    }

    .header-text p {
      font-size: 0.875rem;
      color: #64748b;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .toggle-btn, .close-panel-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .toggle-btn {
      background: #667eea;
      color: white;
    }

    .toggle-btn:hover {
      background: #5a67d8;
      transform: translateY(-1px);
    }

    .close-panel-btn {
      background: #f8fafc;
      color: #64748b;
      width: 36px;
      height: 36px;
      justify-content: center;
      padding: 0;
    }

    .close-panel-btn:hover {
      background: #e2e8f0;
      color: #374151;
    }

    /* AI Suggestions */
    .ai-suggestions {
      padding: 1.5rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .suggestions-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .suggestions-header h4 {
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
      flex: 1;
    }

    .suggestions-count {
      background: #fbbf24;
      color: #92400e;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .suggestions-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .suggestion-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1rem;
      transition: all 0.3s ease;
    }

    .suggestion-item:hover {
      border-color: #8b5cf6;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
    }

    .suggestion-content {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 1rem;
      align-items: center;
    }

    .transaction-preview {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .preview-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .preview-info {
      flex: 1;
    }

    .preview-description {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }

    .preview-details {
      display: flex;
      gap: 1rem;
      font-size: 0.75rem;
      color: #64748b;
    }

    .suggestion-action {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      align-items: flex-end;
    }

    .category-suggestion {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
    }

    .suggestion-text {
      font-size: 0.75rem;
      color: #64748b;
    }

    .suggested-category {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .confidence {
      font-size: 0.75rem;
      color: #059669;
      font-weight: 600;
    }

    .suggestion-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .suggestion-btn {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem 0.75rem;
      border: none;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .suggestion-btn.accept {
      background: #10b981;
      color: white;
    }

    .suggestion-btn.accept:hover {
      background: #059669;
      transform: translateY(-1px);
    }

    .suggestion-btn.reject {
      background: #f1f5f9;
      color: #64748b;
    }

    .suggestion-btn.reject:hover {
      background: #e2e8f0;
      color: #374151;
    }

    .learning-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.75rem;
      padding: 0.5rem;
      background: rgba(59, 130, 246, 0.1);
      border-radius: 6px;
      font-size: 0.75rem;
      color: #2563eb;
      font-style: italic;
    }

    /* Categorization Rules */
    .categorization-rules {
      padding: 1.5rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .rules-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .rules-header h4 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .add-rule-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .add-rule-btn:hover {
      background: #059669;
      transform: translateY(-1px);
    }

    .rules-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .rule-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      transition: all 0.3s ease;
    }

    .rule-item:hover {
      border-color: #cbd5e1;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .rule-content {
      flex: 1;
    }

    .rule-condition {
      margin-bottom: 0.5rem;
    }

    .condition-type {
      margin-bottom: 0.25rem;
    }

    .condition-label, .action-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #8b5cf6;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .condition-field, .condition-operator, .condition-value {
      font-size: 0.875rem;
      color: #374151;
      margin: 0 0.25rem;
    }

    .condition-value {
      font-weight: 600;
      color: #1e293b;
    }

    .rule-action {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .action-category {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.75rem;
    }

    .rule-stats {
      display: flex;
      gap: 1rem;
      font-size: 0.75rem;
      color: #64748b;
    }

    .rule-usage, .rule-accuracy {
      font-weight: 500;
    }

    .rule-actions {
      display: flex;
      gap: 0.25rem;
      margin-left: 1rem;
    }

    .rule-action-btn {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 6px;
      background: #f1f5f9;
      color: #64748b;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .rule-action-btn:hover {
      background: #e2e8f0;
      color: #374151;
      transform: scale(1.1);
    }

    .rule-action-btn.active {
      background: #10b981;
      color: white;
    }

    .rule-action-btn.edit:hover {
      background: #3b82f6;
      color: white;
    }

    .rule-action-btn.delete:hover {
      background: #ef4444;
      color: white;
    }

    /* Categorization Stats */
    .categorization-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      padding: 1.5rem;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 10px;
      transition: all 0.3s ease;
    }

    .stat-item:hover {
      background: #f1f5f9;
      transform: translateY(-2px);
    }

    .stat-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: rgba(139, 92, 246, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
    }

    /* Color utilities for icons */
    .text-primary { color: #8b5cf6; }
    .text-warning { color: #f59e0b; }
    .text-secondary { color: #64748b; }
    .text-blue { color: #3b82f6; }
    .text-success { color: #10b981; }
    .text-purple { color: #8b5cf6; }

    /* Responsive Design for Smart Categorization */
    @media (max-width: 768px) {
      .categorization-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .header-left {
        justify-content: center;
        text-align: center;
      }

      .suggestion-content {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }

      .suggestion-action {
        align-items: flex-start;
      }

      .category-suggestion {
        align-items: flex-start;
      }

      .categorization-stats {
        grid-template-columns: 1fr;
      }

      .rule-item {
        flex-direction: column;
        gap: 0.75rem;
        align-items: flex-start;
      }

      .rule-actions {
        margin-left: 0;
        align-self: flex-end;
      }
    }
  `]
})
export class TransacoesComponent implements OnInit {
  // State properties
  activeFilter = 'all';
  selectedPeriod = 'current-month';
  selectedOrigin = 'all';
  showTransactionModal = false;
  editingTransaction = false;
  
  // Smart Categorization properties
  showCategorizationPanel = true;
  showRulesPanel = false;
  showAddRuleModal = false;
  aiSuggestions: any[] = [];
  categorizationRules: any[] = [];

  newTransaction = {
    type: 'expense',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: '',
    method: ''
  };

  // Mock data
  transactions = [
    {
      id: 1,
      type: 'income',
      description: 'Pagamento Cliente - Projeto Website',
      amount: 2500.00,
      date: new Date('2024-08-26'),
      category: 'Serviços',
      categoryColor: '#10b981',
      method: 'PIX'
    },
    {
      id: 2,
      type: 'expense',
      description: 'Compra Material de Escritório',
      amount: 150.00,
      date: new Date('2024-08-25'),
      category: 'Equipamentos',
      categoryColor: '#f59e0b',
      method: 'Cartão de Débito'
    },
    {
      id: 3,
      type: 'income',
      description: 'Venda de Curso Online',
      amount: 500.00,
      date: new Date('2024-08-24'),
      category: 'Produtos Digitais',
      categoryColor: '#8b5cf6',
      method: 'Transferência'
    },
    {
      id: 4,
      type: 'expense',
      description: 'Almoço Reunião com Cliente',
      amount: 85.00,
      date: new Date('2024-08-24'),
      category: 'Alimentação',
      categoryColor: '#ef4444',
      method: 'Cartão de Crédito'
    },
    {
      id: 5,
      type: 'expense',
      description: 'Combustível',
      amount: 120.00,
      date: new Date('2024-08-23'),
      category: 'Transporte',
      categoryColor: '#f97316',
      method: 'Dinheiro'
    }
  ];

  categories = {
    income: [
      { name: 'Serviços', color: '#10b981' },
      { name: 'Produtos Digitais', color: '#8b5cf6' },
      { name: 'Vendas', color: '#06b6d4' },
      { name: 'Investimentos', color: '#10b981' }
    ],
    expense: [
      { name: 'Alimentação', color: '#ef4444' },
      { name: 'Transporte', color: '#f97316' },
      { name: 'Equipamentos', color: '#f59e0b' },
      { name: 'Marketing', color: '#ec4899' },
      { name: 'Tributos', color: '#6366f1' }
    ]
  };

  ngOnInit() {
    this.initializeAISuggestions();
    this.initializeCategorizationRules();
  }

  // Filter methods
  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  onPeriodChange() {
    // Handle period filtering logic
  }

  getFilteredTransactions() {
    let filtered = [...this.transactions];

    // Apply type filter
    switch (this.activeFilter) {
      case 'income':
        filtered = filtered.filter(t => t.type === 'income');
        break;
      case 'expense':
        filtered = filtered.filter(t => t.type === 'expense');
        break;
    }

    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // Calculation methods
  getFilteredIncome(): number {
    return this.getFilteredTransactions()
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getFilteredExpenses(): number {
    return this.getFilteredTransactions()
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getFilteredBalance(): number {
    return this.getFilteredIncome() - this.getFilteredExpenses();
  }

  getProfitMargin(): number {
    const income = this.getFilteredIncome();
    return income > 0 ? ((this.getFilteredBalance() / income) * 100) : 0;
  }

  getTransactionCount(type: string): number {
    if (type === 'all') return this.transactions.length;
    return this.transactions.filter(t => t.type === type).length;
  }

  // UI helper methods
  getCategoryEmoji(category: string): string {
    const emojiMap: { [key: string]: string } = {
      'Serviços': '💼',
      'Produtos Digitais': '💻',
      'Vendas': '🛒',
      'Investimentos': '📈',
      'Alimentação': '🍽️',
      'Transporte': '🚗',
      'Equipamentos': '🖥️',
      'Marketing': '📢',
      'Tributos': '📋'
    };
    return emojiMap[category] || '📄';
  }

  // Transaction management
  selectTransaction(transaction: any) {
    // Handle transaction selection if needed
  }

  setTransactionType(type: 'income' | 'expense') {
    this.newTransaction.type = type;
    this.newTransaction.category = '';
  }

  getCategories() {
    return (this.categories as any)[this.newTransaction.type] || [];
  }

  saveTransaction() {
    const categoryInfo = this.getCategories().find((c: any) => c.name === this.newTransaction.category);

    const transaction = {
      id: this.editingTransaction ?
        this.transactions.find(t => this.editingTransaction)?.id || 0 :
        Math.max(...this.transactions.map(t => t.id)) + 1,
      type: this.newTransaction.type,
      description: this.newTransaction.description,
      amount: this.newTransaction.amount,
      date: new Date(this.newTransaction.date),
      category: this.newTransaction.category,
      categoryColor: categoryInfo?.color || '#64748b',
      method: this.newTransaction.method
    };

    if (this.editingTransaction) {
      const index = this.transactions.findIndex(t => t.id === transaction.id);
      if (index !== -1) {
        this.transactions[index] = transaction;
      }
    } else {
      this.transactions.push(transaction);
    }

    this.closeModal();
  }

  editTransaction(transaction: any) {
    this.newTransaction = {
      type: transaction.type,
      description: transaction.description,
      amount: transaction.amount,
      date: transaction.date.toISOString().split('T')[0],
      category: transaction.category,
      method: transaction.method
    };
    this.editingTransaction = true;
    this.showTransactionModal = true;
  }

  deleteTransaction(id: number) {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      this.transactions = this.transactions.filter(t => t.id !== id);
    }
  }

  closeModal() {
    this.newTransaction = {
      type: 'expense',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: '',
      method: ''
    };
    this.editingTransaction = false;
    this.showTransactionModal = false;
  }

  exportCSV() {
    const data = this.getFilteredTransactions();
    const csvContent = [
      ['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor', 'Método'],
      ...data.map(t => [
        this.formatDate(t.date),
        t.type === 'income' ? 'Receita' : 'Despesa',
        t.category,
        t.description,
        t.amount.toString().replace('.', ','),
        t.method
      ])
    ].map(row => row.join(';')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transacoes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  // Utility methods
  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getAbsoluteBalance(): number {
    return Math.abs(this.getFilteredBalance());
  }

  // ============ Smart Categorization Methods ============

  initializeAISuggestions(): void {
    this.aiSuggestions = [
      {
        id: 'ai-1',
        transaction: {
          id: 999,
          description: 'UBER EATS - Pedido #12345',
          amount: 42.50,
          date: new Date(),
          category: '',
          type: 'expense'
        },
        suggestedCategory: {
          name: 'Alimentação',
          color: '#ef4444'
        },
        confidence: 94,
        reason: 'Padrão reconhecido: "UBER EATS" indica delivery de comida',
        isLearning: false
      },
      {
        id: 'ai-2',
        transaction: {
          id: 998,
          description: 'POSTO SHELL - Combustível',
          amount: 85.20,
          date: new Date(),
          category: '',
          type: 'expense'
        },
        suggestedCategory: {
          name: 'Transporte',
          color: '#f97316'
        },
        confidence: 89,
        reason: 'Padrão reconhecido: "POSTO" + "Combustível" indica abastecimento',
        isLearning: false
      },
      {
        id: 'ai-3',
        transaction: {
          id: 997,
          description: 'Adobe Creative Suite - Assinatura',
          amount: 150.00,
          date: new Date(),
          category: '',
          type: 'expense'
        },
        suggestedCategory: {
          name: 'Equipamentos',
          color: '#f59e0b'
        },
        confidence: 96,
        reason: 'Padrão reconhecido: Software de design profissional',
        isLearning: false
      }
    ];
  }

  initializeCategorizationRules(): void {
    this.categorizationRules = [
      {
        id: 'rule-1',
        name: 'Delivery Apps',
        field: 'description',
        operator: 'contains',
        value: 'UBER EATS',
        targetCategory: {
          name: 'Alimentação',
          color: '#ef4444'
        },
        isActive: true,
        appliedCount: 23,
        accuracy: 98,
        createdAt: new Date('2024-01-15')
      },
      {
        id: 'rule-2',
        name: 'Postos de Combustível',
        field: 'description',
        operator: 'contains',
        value: 'POSTO',
        targetCategory: {
          name: 'Transporte',
          color: '#f97316'
        },
        isActive: true,
        appliedCount: 31,
        accuracy: 95,
        createdAt: new Date('2024-01-10')
      },
      {
        id: 'rule-3',
        name: 'Software Adobe',
        field: 'description',
        operator: 'contains',
        value: 'Adobe',
        targetCategory: {
          name: 'Equipamentos',
          color: '#f59e0b'
        },
        isActive: true,
        appliedCount: 12,
        accuracy: 100,
        createdAt: new Date('2024-02-01')
      },
      {
        id: 'rule-4',
        name: 'Altos valores freelance',
        field: 'amount',
        operator: 'greater_than',
        value: '2000',
        targetCategory: {
          name: 'Serviços',
          color: '#10b981'
        },
        isActive: true,
        appliedCount: 8,
        accuracy: 87,
        createdAt: new Date('2024-01-20')
      },
      {
        id: 'rule-5',
        name: 'Supermercados',
        field: 'description',
        operator: 'contains',
        value: 'SUPERMERCADO',
        targetCategory: {
          name: 'Alimentação',
          color: '#ef4444'
        },
        isActive: false,
        appliedCount: 15,
        accuracy: 78,
        createdAt: new Date('2024-01-25')
      }
    ];
  }

  // Smart Categorization Actions
  toggleCategorizationRules(): void {
    this.showRulesPanel = !this.showRulesPanel;
  }

  acceptSuggestion(suggestion: any): void {
    // Apply the suggested category to the transaction
    const transaction = this.transactions.find(t => t.id === suggestion.transaction.id);
    if (transaction) {
      transaction.category = suggestion.suggestedCategory.name;
      transaction.categoryColor = suggestion.suggestedCategory.color;
    }

    // Mark as learning and remove from suggestions
    suggestion.isLearning = true;
    setTimeout(() => {
      this.aiSuggestions = this.aiSuggestions.filter(s => s.id !== suggestion.id);
    }, 2000);
  }

  rejectSuggestion(suggestion: any): void {
    // Remove from suggestions
    this.aiSuggestions = this.aiSuggestions.filter(s => s.id !== suggestion.id);
    
    // In a real app, this would train the AI to not suggest this pattern again
    console.log('AI learning from rejection:', suggestion.reason);
  }

  // Categorization Rules Management
  toggleRule(rule: any): void {
    rule.isActive = !rule.isActive;
  }

  editRule(rule: any): void {
    console.log('Editing rule:', rule.name);
    // In a real app, this would open an edit modal
  }

  deleteRule(ruleId: string): void {
    if (confirm('Tem certeza que deseja excluir esta regra?')) {
      this.categorizationRules = this.categorizationRules.filter(r => r.id !== ruleId);
    }
  }

  // Rule Helper Methods
  getRuleFieldName(field: string): string {
    const fieldMap: { [key: string]: string } = {
      'description': 'descrição',
      'amount': 'valor',
      'category': 'categoria',
      'method': 'método de pagamento'
    };
    return fieldMap[field] || field;
  }

  getRuleOperatorName(operator: string): string {
    const operatorMap: { [key: string]: string } = {
      'contains': 'contém',
      'equals': 'é igual a',
      'greater_than': 'é maior que',
      'less_than': 'é menor que',
      'starts_with': 'começa com',
      'ends_with': 'termina com'
    };
    return operatorMap[operator] || operator;
  }

  // Statistics Methods
  getCategorizationAccuracy(): number {
    if (this.categorizationRules.length === 0) return 0;
    
    const totalAccuracy = this.categorizationRules
      .filter(rule => rule.isActive)
      .reduce((sum, rule) => sum + rule.accuracy, 0);
    
    const activeRules = this.categorizationRules.filter(rule => rule.isActive).length;
    
    return activeRules > 0 ? Math.round(totalAccuracy / activeRules) : 0;
  }

  getAutoCategorizationCount(): number {
    return this.categorizationRules
      .filter(rule => rule.isActive)
      .reduce((sum, rule) => sum + rule.appliedCount, 0);
  }

  getActiveRulesCount(): number {
    return this.categorizationRules.filter(rule => rule.isActive).length;
  }
}
