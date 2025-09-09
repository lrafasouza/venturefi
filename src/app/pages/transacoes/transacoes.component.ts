import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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
          </div>
        </div>
      </header>

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
  `]
})
export class TransacoesComponent implements OnInit {
  // State properties
  activeFilter = 'all';
  selectedPeriod = 'current-month';
  selectedOrigin = 'all';
  showTransactionModal = false;
  editingTransaction = false;

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

  ngOnInit() {}

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
}
