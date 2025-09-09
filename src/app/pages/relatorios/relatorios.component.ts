import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="reports-container">
      <main class="main-content">
        <header class="dashboard-header">
          <div class="header-content">
            <div class="welcome-section">
              <h1>Relatórios</h1>
              <p>Análises detalhadas do seu desempenho financeiro</p>
            </div>
            <div class="header-actions">
              <button class="btn btn-outline hover-scale focus-ring">Personalizar</button>
              <button class="btn btn-primary hover-glow focus-ring">Exportar PDF</button>
            </div>
          </div>
        </header>
        
        <div class="dashboard-content">
          <!-- Period Selector -->
          <section class="period-selector">
            <div class="period-tabs">
              <button 
                class="period-btn" 
                [class.active]="selectedPeriod === 'month'"
                (click)="setPeriod('month')">
                Este Mês
              </button>
              <button 
                class="period-btn" 
                [class.active]="selectedPeriod === 'quarter'"
                (click)="setPeriod('quarter')">
                Último Trimestre
              </button>
              <button 
                class="period-btn" 
                [class.active]="selectedPeriod === 'year'"
                (click)="setPeriod('year')">
                Este Ano
              </button>
              <button 
                class="period-btn" 
                [class.active]="selectedPeriod === 'custom'"
                (click)="setPeriod('custom')">
                Personalizado
              </button>
            </div>
            <div class="period-info">
              <span class="period-label">Período selecionado:</span>
              <span class="period-text">{{ getPeriodText() }}</span>
            </div>
          </section>

          <!-- Key Metrics -->
          <section class="key-metrics">
            <div class="metric-card revenue">
              <div class="metric-header">
                <h3>Receita Total</h3>
              </div>
              <div class="metric-value">R$ {{ formatCurrency(totalRevenue) }}</div>
              <div class="metric-change positive">
                <span>+15.2% vs período anterior</span>
              </div>
              <div class="metric-details">
                <div class="detail-item">
                  <span class="detail-label">Maior receita:</span>
                  <span class="detail-value">R$ {{ formatCurrency(maxRevenue) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Média mensal:</span>
                  <span class="detail-value">R$ {{ formatCurrency(avgMonthlyRevenue) }}</span>
                </div>
              </div>
            </div>
            
            <div class="metric-card expenses">
              <div class="metric-header">
                <h3>Despesas Totais</h3>
              </div>
              <div class="metric-value">R$ {{ formatCurrency(totalExpenses) }}</div>
              <div class="metric-change negative">
                <span>+8.7% vs período anterior</span>
              </div>
              <div class="metric-details">
                <div class="detail-item">
                  <span class="detail-label">Maior despesa:</span>
                  <span class="detail-value">R$ {{ formatCurrency(maxExpense) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Média mensal:</span>
                  <span class="detail-value">R$ {{ formatCurrency(avgMonthlyExpenses) }}</span>
                </div>
              </div>
            </div>
            
            <div class="metric-card profit">
              <div class="metric-header">
                <h3>Lucro Líquido</h3>
              </div>
              <div class="metric-value">R$ {{ formatCurrency(netProfit) }}</div>
              <div class="metric-change positive">
                <span>+22.1% vs período anterior</span>
              </div>
              <div class="metric-details">
                <div class="detail-item">
                  <span class="detail-label">Margem:</span>
                  <span class="detail-value">{{ profitMargin }}%</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">ROI:</span>
                  <span class="detail-value">{{ roi }}%</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Charts Section -->
          <section class="charts-grid">
            <div class="chart-card evolution">
              <div class="chart-header">
                <h3>Evolução Financeira</h3>
                <div class="chart-controls">
                  <button class="chart-btn active">Receitas</button>
                  <button class="chart-btn">Despesas</button>
                  <button class="chart-btn">Lucro</button>
                </div>
              </div>
              <div class="chart-content">
                <div class="line-chart-mock">
                  <div class="chart-lines">
                    <svg viewBox="0 0 400 200" class="chart-svg">
                      <polyline 
                        points="0,150 50,120 100,100 150,80 200,60 250,40 300,30 350,20 400,10"
                        fill="none" 
                        stroke="var(--innovation-green)" 
                        stroke-width="3"
                        stroke-linecap="round"/>
                      <polyline 
                        points="0,180 50,170 100,160 150,155 200,145 250,140 300,135 350,130 400,125"
                        fill="none" 
                        stroke="var(--warning-orange)" 
                        stroke-width="2"
                        stroke-linecap="round"/>
                    </svg>
                  </div>
                  <div class="chart-legend">
                    <div class="legend-item">
                      <span class="legend-color revenue"></span>
                      <span>Receitas</span>
                    </div>
                    <div class="legend-item">
                      <span class="legend-color expenses"></span>
                      <span>Despesas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="chart-card categories">
              <div class="chart-header">
                <h3>Despesas por Categoria</h3>
                <div class="chart-total">
                  Total: R$ {{ formatCurrency(totalExpenses) }}
                </div>
              </div>
              <div class="chart-content">
                <div class="donut-chart">
                  <div class="donut-chart-mock">
                    <div class="donut-center">
                      <div class="donut-value">{{ expenseCategories.length }}</div>
                      <div class="donut-label">Categorias</div>
                    </div>
                  </div>
                  <div class="categories-breakdown">
                    <div 
                      class="category-item" 
                      *ngFor="let category of expenseCategories">
                      <div class="category-color" [style.background-color]="category.color"></div>
                      <div class="category-info">
                        <div class="category-name">{{ category.name }}</div>
                        <div class="category-amount">R$ {{ formatCurrency(category.amount) }}</div>
                      </div>
                      <div class="category-percentage">{{ category.percentage }}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="chart-card comparison">
              <div class="chart-header">
                <h3>Comparativo Mensal</h3>
                <select class="comparison-select">
                  <option>Últimos 6 meses</option>
                  <option>Últimos 12 meses</option>
                  <option>Comparar anos</option>
                </select>
              </div>
              <div class="chart-content">
                <div class="bar-chart-mock">
                  <div class="bars-container">
                    <div class="bar-group" *ngFor="let month of monthlyComparison">
                      <div class="bar-label">{{ month.name }}</div>
                      <div class="bars">
                        <div 
                          class="bar revenue-bar" 
                          [style.height.%]="month.revenuePercent">
                        </div>
                        <div 
                          class="bar expense-bar" 
                          [style.height.%]="month.expensePercent">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Insights Section -->
          <section class="insights-section">
            <div class="insights-header">
              <h2>Insights Inteligentes</h2>
              <p>Análises automáticas baseadas nos seus dados financeiros</p>
            </div>
            
            <div class="insights-grid">
              <div class="insight-card positive">
                <div class="insight-content">
                  <h4>Crescimento Consistente</h4>
                  <p>Suas receitas cresceram 15.2% nos últimos 3 meses. Continue assim!</p>
                  <div class="insight-action">
                    <button class="btn-link">Ver detalhes →</button>
                  </div>
                </div>
              </div>
              
              <div class="insight-card warning">
                <div class="insight-content">
                  <h4>Atenção aos Gastos</h4>
                  <p>Despesas com alimentação aumentaram 25% este mês. Considere revisar.</p>
                  <div class="insight-action">
                    <button class="btn-link">Otimizar gastos →</button>
                  </div>
                </div>
              </div>
              
              <div class="insight-card info">
                <div class="insight-content">
                  <h4>Oportunidade de Economia</h4>
                  <p>Você pode economizar R$ 340/mês cortando 30% dos gastos variáveis.</p>
                  <div class="insight-action">
                    <button class="btn-link">Ver plano →</button>
                  </div>
                </div>
              </div>
              
              <div class="insight-card success">
                <div class="insight-content">
                  <h4>Meta Alcançada</h4>
                  <p>Parabéns! Você atingiu sua meta de economia mensal de R$ 2.000.</p>
                  <div class="insight-action">
                    <button class="btn-link">Nova meta →</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <!-- Export Options -->
          <section class="export-section">
            <div class="export-card">
              <h3>Exportar Relatórios</h3>
              <p>Baixe seus relatórios financeiros em diferentes formatos</p>
              <div class="export-options">
                <button class="export-btn">
                  <span class="export-text">
                    <div class="export-title">Relatório Completo</div>
                    <div class="export-desc">PDF com todas as análises</div>
                  </span>
                </button>
                <button class="export-btn">
                  <span class="export-text">
                    <div class="export-title">Planilha Excel</div>
                    <div class="export-desc">Dados brutos para análise</div>
                  </span>
                </button>
                <button class="export-btn">
                  <span class="export-text">
                    <div class="export-title">Resumo Executivo</div>
                    <div class="export-desc">Principais métricas em 1 página</div>
                  </span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .reports-container {
      height: 100vh;
      background: var(--bg-tertiary);
      overflow: hidden;
    }
    
    .main-content {
      overflow-y: auto;
      height: 100vh;
      background: var(--bg-tertiary);
    }
    
    .dashboard-header {
      background: var(--bg-primary);
      border-bottom: 1px solid var(--border-primary);
      padding: var(--space-8) var(--space-8);
      flex-shrink: 0;
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .welcome-section h1 {
      color: var(--text-primary);
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 var(--space-2) 0;
      letter-spacing: -0.025em;
    }
    
    .welcome-section p {
      color: var(--text-secondary);
      margin: 0;
      font-size: 1rem;
    }
    
    .header-actions {
      display: flex;
      gap: var(--space-3);
    }
    
    .dashboard-content {
      padding: var(--space-8);
      display: flex;
      flex-direction: column;
      gap: var(--space-8);
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .period-selector {
      background: var(--bg-primary);
      padding: var(--space-6);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-primary);
    }
    
    .period-tabs {
      display: flex;
      gap: var(--space-2);
      margin-bottom: var(--space-4);
      flex-wrap: wrap;
    }
    
    .period-btn {
      padding: var(--space-3) var(--space-4);
      border: 1px solid var(--border-primary);
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
    }
    
    .period-btn.active {
      background: var(--accent-blue);
      color: var(--text-inverse);
      border-color: var(--accent-blue);
      box-shadow: var(--shadow-sm);
      font-weight: 600;
    }
    
    .period-btn:hover {
      background: var(--accent-blue-light);
      color: var(--accent-blue);
      border-color: var(--accent-blue-light);
    }
    
    .period-info {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }
    
    .period-label {
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .period-text {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
    
    .key-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: var(--space-6);
    }
    
    .metric-card {
      background: var(--bg-primary);
      padding: var(--space-8);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-primary);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .metric-card.revenue {
      border-left: 4px solid var(--accent-green);
    }
    
    .metric-card.expenses {
      border-left: 4px solid var(--accent-orange);
    }
    
    .metric-card.profit {
      border-left: 4px solid var(--accent-blue);
    }
    
    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-6);
    }
    
    .metric-header h3 {
      color: var(--text-primary);
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
    }
    
    
    .metric-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: var(--space-4);
      line-height: 1.1;
      letter-spacing: -0.025em;
    }
    
    .metric-change {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: var(--space-6);
    }
    
    .metric-change.positive {
      color: var(--accent-green);
    }
    
    .metric-change.negative {
      color: var(--accent-orange);
    }
    
    .metric-details {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    
    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
    }
    
    .detail-label {
      color: var(--text-secondary);
    }
    
    .detail-value {
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .charts-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      grid-template-rows: auto auto;
      gap: var(--space-8);
    }
    
    .chart-card {
      background: var(--bg-primary);
      padding: var(--space-6);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-primary);
    }
    
    .chart-card.evolution {
      grid-column: 1 / -1;
    }
    
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-8);
    }
    
    .chart-header h3 {
      color: var(--text-primary);
      margin: 0;
      font-weight: 600;
    }
    
    .chart-controls {
      display: flex;
      gap: var(--space-2);
    }
    
    .chart-btn {
      padding: var(--space-2) var(--space-4);
      border: 1px solid var(--border-primary);
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      color: var(--text-secondary);
      font-weight: 500;
    }
    
    .chart-btn.active {
      background: var(--accent-blue);
      color: var(--text-inverse);
      border-color: var(--accent-blue);
      font-weight: 600;
    }
    
    .chart-btn:hover {
      background: var(--accent-blue-light);
      color: var(--accent-blue);
      border-color: var(--accent-blue-light);
    }
    
    .chart-total {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    
    .comparison-select {
      padding: var(--space-2) var(--space-4);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      background: var(--bg-primary);
      color: var(--text-primary);
    }
    
    .line-chart-mock {
      height: 250px;
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }
    
    .chart-svg {
      width: 100%;
      height: 200px;
      border-bottom: 1px solid var(--border-primary);
      border-left: 1px solid var(--border-primary);
    }
    
    .chart-legend {
      display: flex;
      justify-content: center;
      gap: var(--space-8);
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    
    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: var(--radius-sm);
    }
    
    .legend-color.revenue {
      background: var(--accent-green);
    }
    
    .legend-color.expenses {
      background: var(--accent-orange);
    }
    
    .donut-chart-mock {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: conic-gradient(
        var(--accent-green) 0deg 108deg,
        var(--accent-orange) 108deg 180deg,
        var(--accent-blue) 180deg 252deg,
        var(--accent-purple) 252deg 360deg
      );
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--space-4);
    }
    
    .donut-center {
      width: 60px;
      height: 60px;
      background: var(--bg-primary);
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    
    .donut-value {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .donut-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    
    .categories-breakdown {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    
    .category-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }
    
    .category-color {
      width: 12px;
      height: 12px;
      border-radius: var(--radius-sm);
    }
    
    .category-info {
      flex: 1;
    }
    
    .category-name {
      font-size: 0.875rem;
      color: var(--text-primary);
      margin-bottom: var(--space-1);
    }
    
    .category-amount {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    
    .category-percentage {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .bar-chart-mock {
      height: 200px;
      padding: var(--space-4) 0;
    }
    
    .bars-container {
      display: flex;
      justify-content: space-between;
      height: 100%;
      align-items: end;
      gap: var(--space-2);
    }
    
    .bar-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
    }
    
    .bar-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin-bottom: var(--space-4);
      text-align: center;
    }
    
    .bars {
      display: flex;
      gap: var(--space-1);
      align-items: end;
      flex: 1;
    }
    
    .bar {
      width: 20px;
      min-height: 10px;
      border-radius: var(--radius-sm) var(--radius-sm) 0 0;
    }
    
    .revenue-bar {
      background: var(--accent-green);
    }
    
    .expense-bar {
      background: var(--accent-orange);
    }
    
    .insights-section {
      margin-top: var(--space-4);
    }
    
    .insights-header {
      text-align: center;
      margin-bottom: var(--space-8);
    }
    
    .insights-header h2 {
      color: var(--text-primary);
      margin-bottom: var(--space-2);
      font-weight: 700;
    }
    
    .insights-header p {
      color: var(--text-secondary);
      margin: 0;
    }
    
    .insights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--space-6);
    }
    
    .insight-card {
      background: var(--bg-primary);
      padding: var(--space-6);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-primary);
      display: flex;
      gap: var(--space-4);
    }
    
    .insight-card.positive {
      border-left: 4px solid var(--accent-green);
    }
    
    .insight-card.warning {
      border-left: 4px solid var(--accent-orange);
    }
    
    .insight-card.info {
      border-left: 4px solid var(--accent-blue);
    }
    
    .insight-card.success {
      border-left: 4px solid var(--accent-green);
    }
    
    
    .insight-content {
      flex: 1;
    }
    
    .insight-content h4 {
      color: var(--text-primary);
      margin: 0 0 var(--space-2) 0;
      font-size: 1rem;
      font-weight: 600;
    }
    
    .insight-content p {
      color: var(--text-secondary);
      margin: 0 0 var(--space-4) 0;
      font-size: 0.875rem;
      line-height: 1.5;
    }
    
    .btn-link {
      background: none;
      border: none;
      color: var(--accent-blue);
      font-size: 0.875rem;
      cursor: pointer;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .btn-link:hover {
      text-decoration: underline;
    }
    
    .export-section {
      margin-top: var(--space-4);
    }
    
    .export-card {
      background: var(--bg-primary);
      padding: var(--space-8);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-primary);
      text-align: center;
    }
    
    .export-card h3 {
      color: var(--text-primary);
      margin-bottom: var(--space-2);
      font-weight: 600;
    }
    
    .export-card p {
      color: var(--text-secondary);
      margin-bottom: var(--space-8);
    }
    
    .export-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-4);
    }
    
    .export-btn {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-6);
      border: 1px solid var(--border-primary);
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      text-align: left;
    }
    
    .export-btn:hover {
      border-color: var(--accent-blue);
      box-shadow: var(--shadow-md);
      background: var(--bg-primary);
    }
    
    
    .export-title {
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--space-1);
    }
    
    .export-desc {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    
    @media (max-width: 1024px) {
      .charts-grid {
        grid-template-columns: 1fr;
      }
      
      .chart-card.evolution {
        grid-column: 1;
      }
    }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }
      
      .dashboard-content {
        padding: var(--space-4);
      }
      
      .key-metrics {
        grid-template-columns: 1fr;
      }
      
      .insights-grid {
        grid-template-columns: 1fr;
      }
      
      .export-options {
        grid-template-columns: 1fr;
      }
      
      .period-tabs {
        flex-direction: column;
      }
    }
  `]
})
export class RelatoriosComponent implements OnInit {
  selectedPeriod = 'month';
  
  // Key metrics
  totalRevenue = 24800.00;
  totalExpenses = 12350.00;
  netProfit = 12450.00;
  maxRevenue = 8500.00;
  maxExpense = 2800.00;
  avgMonthlyRevenue = 8266.67;
  avgMonthlyExpenses = 4116.67;
  profitMargin = 50.2;
  roi = 22.4;
  
  expenseCategories = [
    { name: 'Alimentação', amount: 3200, percentage: 26, color: '#E74C3C' },
    { name: 'Transporte', amount: 2800, percentage: 23, color: '#F39C12' },
    { name: 'Marketing', amount: 2500, percentage: 20, color: '#9B59B6' },
    { name: 'Software', amount: 1850, percentage: 15, color: '#3498DB' },
    { name: 'Material', amount: 1200, percentage: 10, color: '#2ECC71' },
    { name: 'Outros', amount: 800, percentage: 6, color: '#95A5A6' }
  ];
  
  monthlyComparison = [
    { name: 'Jan', revenuePercent: 70, expensePercent: 45 },
    { name: 'Fev', revenuePercent: 80, expensePercent: 50 },
    { name: 'Mar', revenuePercent: 85, expensePercent: 55 },
    { name: 'Abr', revenuePercent: 90, expensePercent: 48 },
    { name: 'Mai', revenuePercent: 95, expensePercent: 52 },
    { name: 'Jun', revenuePercent: 100, expensePercent: 47 }
  ];
  
  ngOnInit() {
    // Simular carregamento de dados
  }
  
  setPeriod(period: string) {
    this.selectedPeriod = period;
  }
  
  getPeriodText(): string {
    const periods: { [key: string]: string } = {
      month: 'Agosto 2024',
      quarter: 'Jun - Ago 2024',
      year: '2024',
      custom: 'Jan - Ago 2024'
    };
    return periods[this.selectedPeriod] || 'Período selecionado';
  }
  
  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}