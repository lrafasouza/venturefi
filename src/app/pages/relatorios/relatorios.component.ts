import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="executive-reports">
      <!-- Executive Header -->
      <header class="executive-header">
        <div class="header-background">
          <div class="gradient-mesh"></div>
          <div class="floating-elements">
            <div class="float-element chart"></div>
            <div class="float-element data"></div>
            <div class="float-element trend"></div>
          </div>
        </div>
        <div class="header-content">
          <div class="title-section">
            <div class="breadcrumb">
              <span class="breadcrumb-item">VentureFi</span>
              <span class="breadcrumb-separator">›</span>
              <span class="breadcrumb-current">Relatórios Executivos</span>
            </div>
            <h1 class="executive-title">Dashboard Analítico</h1>
            <p class="executive-subtitle">Insights avançados e métricas de performance para tomada de decisão estratégica</p>
          </div>
          <div class="header-actions">
            <div class="time-range-selector">
              <button class="range-btn active" (click)="setTimeRange('30d')">30D</button>
              <button class="range-btn" (click)="setTimeRange('90d')">90D</button>
              <button class="range-btn" (click)="setTimeRange('1y')">1Y</button>
            </div>
            <button class="export-btn premium">
              <span class="btn-icon">📊</span>
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </header>
        
      <!-- Executive Content -->
      <main class="executive-content">
        <!-- Executive Summary -->
        <section class="executive-summary">
          <div class="summary-grid">
            <div class="summary-card primary">
              <div class="card-header">
                <div class="metric-icon revenue">💰</div>
                <div class="metric-trend positive">
                  <span class="trend-arrow">↗</span>
                  <span class="trend-percent">+18.5%</span>
                </div>
              </div>
              <div class="metric-value">R$ 127.430</div>
              <div class="metric-label">Receita Total (90d)</div>
              <div class="metric-insight">
                <span class="insight-label">vs período anterior:</span>
                <span class="insight-value positive">+R$ 19.840</span>
              </div>
            </div>

            <div class="summary-card secondary">
              <div class="card-header">
                <div class="metric-icon profit">📈</div>
                <div class="metric-trend positive">
                  <span class="trend-arrow">↗</span>
                  <span class="trend-percent">+24.2%</span>
                </div>
              </div>
              <div class="metric-value">R$ 41.890</div>
              <div class="metric-label">Margem de Lucro</div>
              <div class="metric-insight">
                <span class="insight-label">Taxa:</span>
                <span class="insight-value">32.9%</span>
              </div>
            </div>

            <div class="summary-card tertiary">
              <div class="card-header">
                <div class="metric-icon investments">💎</div>
                <div class="metric-trend positive">
                  <span class="trend-arrow">↗</span>
                  <span class="trend-percent">+8.7%</span>
                </div>
              </div>
              <div class="metric-value">R$ 18.420</div>
              <div class="metric-label">Investimentos</div>
              <div class="metric-insight">
                <span class="insight-label">Rentabilidade:</span>
                <span class="insight-value positive">+8.7%</span>
              </div>
            </div>

            <div class="summary-card quaternary">
              <div class="card-header">
                <div class="metric-icon cashflow">💎</div>
                <div class="metric-trend stable">
                  <span class="trend-arrow">→</span>
                  <span class="trend-percent">+2.1%</span>
                </div>
              </div>
              <div class="metric-value">R$ 23.560</div>
              <div class="metric-label">Fluxo de Caixa</div>
              <div class="metric-insight">
                <span class="insight-label">Projeção 30d:</span>
                <span class="insight-value">R$ 31.200</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Advanced Analytics -->
        <section class="analytics-section">
          <div class="section-header">
            <h2 class="section-title">Análises Avançadas</h2>
            <div class="section-controls">
              <select class="analytics-filter">
                <option value="revenue">Por Receita</option>
                <option value="client">Por Cliente</option>
                <option value="project">Por Projeto</option>
              </select>
            </div>
          </div>
          
          <div class="analytics-grid">
            <!-- Performance Chart -->
            <div class="analytics-card chart-card">
              <div class="card-title">
                <h3>Performance Temporal</h3>
                <div class="chart-legend">
                  <span class="legend-item revenue">● Receitas</span>
                  <span class="legend-item expenses">● Despesas</span>
                  <span class="legend-item profit">● Lucro</span>
                </div>
              </div>
              <div class="chart-container">
                <div class="performance-chart">
                  <!-- Mock Line Chart -->
                  <div class="chart-area">
                    <div class="chart-line revenue-line"></div>
                    <div class="chart-line expenses-line"></div>
                    <div class="chart-line profit-line"></div>
                    <div class="chart-points">
                      <div class="point active" style="left: 20%; bottom: 60%"></div>
                      <div class="point" style="left: 40%; bottom: 45%"></div>
                      <div class="point" style="left: 60%; bottom: 75%"></div>
                      <div class="point" style="left: 80%; bottom: 85%"></div>
                    </div>
                  </div>
                  <div class="chart-labels">
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Ago</span>
                    <span>Set</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Categories Analysis -->
            <div class="analytics-card categories-card">
              <div class="card-title">
                <h3>Análise por Categoria</h3>
                <span class="card-subtitle">Principais gastos</span>
              </div>
              <div class="categories-list">
                <div class="category-item">
                  <div class="category-info">
                    <div class="category-icon">🏠</div>
                    <div class="category-details">
                      <div class="category-name">Moradia</div>
                      <div class="category-type">Gastos fixos</div>
                    </div>
                  </div>
                  <div class="category-metrics">
                    <div class="category-value">R$ 18.500</div>
                    <div class="category-percentage">32.4%</div>
                  </div>
                </div>
                
                <div class="category-item">
                  <div class="category-info">
                    <div class="category-icon">🍽️</div>
                    <div class="category-details">
                      <div class="category-name">Alimentação</div>
                      <div class="category-type">Gastos variáveis</div>
                    </div>
                  </div>
                  <div class="category-metrics">
                    <div class="category-value">R$ 12.300</div>
                    <div class="category-percentage">21.5%</div>
                  </div>
                </div>
                
                <div class="category-item">
                  <div class="category-info">
                    <div class="category-icon">🚗</div>
                    <div class="category-details">
                      <div class="category-name">Transporte</div>
                      <div class="category-type">Gastos variáveis</div>
                    </div>
                  </div>
                  <div class="category-metrics">
                    <div class="category-value">R$ 9.800</div>
                    <div class="category-percentage">17.1%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Strategic Insights -->
        <section class="insights-section">
          <div class="section-header">
            <h2 class="section-title">Insights Estratégicos</h2>
            <span class="ai-badge">🤖 Powered by AI</span>
          </div>
          
          <div class="insights-grid">
            <div class="insight-card growth">
              <div class="insight-header">
                <div class="insight-icon">📈</div>
                <div class="insight-category">Crescimento</div>
              </div>
              <h4>Oportunidade de Crescimento</h4>
              <p>Com base no crescimento de 18.5% na receita, você pode aumentar seus ganhos em até R$ 35.000 nos próximos 3 meses otimizando suas fontes de renda.</p>
              <div class="insight-action">
                <button class="action-btn">Ver estratégia</button>
              </div>
            </div>

            <div class="insight-card optimization">
              <div class="insight-header">
                <div class="insight-icon">⚡</div>
                <div class="insight-category">Otimização</div>
              </div>
              <h4>Redução de Custos</h4>
              <p>Identificamos R$ 4.200/mês em gastos otimizáveis. Principais oportunidades: ferramentas duplicadas (R$ 890) e assinaturas subutilizadas (R$ 1.340).</p>
              <div class="insight-action">
                <button class="action-btn">Otimizar agora</button>
              </div>
            </div>

            <div class="insight-card risk">
              <div class="insight-header">
                <div class="insight-icon">⚠️</div>
                <div class="insight-category">Risco</div>
              </div>
              <h4>Concentração de Gastos</h4>
              <p>68% dos gastos se concentram em apenas 3 categorias. Considere diversificar investimentos e otimizar custos fixos para maior flexibilidade financeira.</p>
              <div class="insight-action">
                <button class="action-btn">Ver plano</button>
              </div>
            </div>

            <div class="insight-card forecast">
              <div class="insight-header">
                <div class="insight-icon">🔮</div>
                <div class="insight-category">Previsão</div>
              </div>
              <h4>Projeção Q4</h4>
              <p>Baseado nos padrões atuais, estimamos receita de R$ 165.000 no Q4, com margem de lucro de 34.2%. Meta: R$ 175.000.</p>
              <div class="insight-action">
                <button class="action-btn">Ajustar metas</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .executive-reports {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }

    /* Executive Header */
    .executive-header {
      position: relative;
      background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
      padding: 3rem 2rem 4rem;
      overflow: hidden;
    }

    .header-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
    }

    .gradient-mesh {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
      animation: float 20s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(2deg); }
    }

    .floating-elements {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .float-element {
      position: absolute;
      width: 60px;
      height: 60px;
      border-radius: 12px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .float-element.chart {
      top: 20%;
      right: 15%;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1));
      animation: floatChart 15s ease-in-out infinite;
    }

    .float-element.data {
      top: 60%;
      right: 25%;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.1));
      animation: floatData 18s ease-in-out infinite;
    }

    .float-element.trend {
      top: 40%;
      right: 5%;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1));
      animation: floatTrend 12s ease-in-out infinite;
    }

    @keyframes floatChart {
      0%, 100% { transform: translateY(0px) translateX(0px); }
      33% { transform: translateY(-15px) translateX(5px); }
      66% { transform: translateY(10px) translateX(-5px); }
    }

    @keyframes floatData {
      0%, 100% { transform: translateY(0px) translateX(0px); }
      50% { transform: translateY(-20px) translateX(10px); }
    }

    @keyframes floatTrend {
      0%, 100% { transform: translateY(0px) translateX(0px); }
      25% { transform: translateY(15px) translateX(-8px); }
      75% { transform: translateY(-10px) translateX(8px); }
    }

    .header-content {
      position: relative;
      z-index: 2;
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 2rem;
    }

    .title-section {
      flex: 1;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .breadcrumb-current {
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
    }

    .executive-title {
      font-size: 3.5rem;
      font-weight: 800;
      color: white;
      margin: 0 0 1rem 0;
      line-height: 1.1;
      background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .executive-subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
      line-height: 1.5;
      max-width: 600px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .time-range-selector {
      display: flex;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 4px;
      backdrop-filter: blur(10px);
    }

    .range-btn {
      padding: 0.5rem 1rem;
      border: none;
      background: transparent;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 600;
      font-size: 0.875rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .range-btn.active {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .range-btn:hover:not(.active) {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.9);
    }

    .export-btn.premium {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .export-btn.premium:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
    }

    /* Executive Content */
    .executive-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    /* Executive Summary */
    .executive-summary {
      margin-bottom: 3rem;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .summary-card {
      background: white;
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(0, 0, 0, 0.05);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .summary-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    }

    .summary-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
    }

    .summary-card.primary::before {
      background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    }

    .summary-card.secondary::before {
      background: linear-gradient(90deg, #10b981, #059669);
    }

    .summary-card.tertiary::before {
      background: linear-gradient(90deg, #8b5cf6, #7c3aed);
    }

    .summary-card.quaternary::before {
      background: linear-gradient(90deg, #f59e0b, #d97706);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .metric-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05));
    }

    .metric-trend {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .metric-trend.positive {
      background: rgba(16, 185, 129, 0.1);
      color: #059669;
    }

    .metric-trend.stable {
      background: rgba(59, 130, 246, 0.1);
      color: #1d4ed8;
    }

    .metric-value {
      font-size: 2.5rem;
      font-weight: 800;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
      line-height: 1.2;
    }

    .metric-label {
      font-size: 1rem;
      color: #64748b;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .metric-insight {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 12px;
    }

    .insight-label {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
    }

    .insight-value {
      font-size: 0.875rem;
      font-weight: 700;
      color: #1e293b;
    }

    .insight-value.positive {
      color: #059669;
    }

    /* Section Headers */
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    .ai-badge {
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      color: white;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .section-controls {
      display: flex;
      gap: 1rem;
    }

    .analytics-filter {
      padding: 0.5rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: white;
      color: #1e293b;
      font-weight: 500;
      cursor: pointer;
    }

    /* Analytics Section */
    .analytics-section {
      margin-bottom: 3rem;
    }

    .analytics-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }

    .analytics-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .card-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
    }

    .card-title h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    .card-subtitle {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
    }

    .chart-legend {
      display: flex;
      gap: 1rem;
    }

    .legend-item {
      font-size: 0.75rem;
      font-weight: 600;
    }

    .legend-item.revenue {
      color: #3b82f6;
    }

    .legend-item.expenses {
      color: #ef4444;
    }

    .legend-item.profit {
      color: #10b981;
    }

    /* Chart Components */
    .chart-container {
      height: 300px;
      position: relative;
    }

    .performance-chart {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .chart-area {
      flex: 1;
      position: relative;
      background: linear-gradient(180deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%);
      border-radius: 12px;
      margin-bottom: 1rem;
    }

    .chart-line {
      position: absolute;
      height: 2px;
      border-radius: 1px;
      top: 50%;
      left: 10%;
      right: 10%;
    }

    .chart-line.revenue-line {
      background: linear-gradient(90deg, #3b82f6, #1d4ed8);
      transform: translateY(-10px);
    }

    .chart-line.expenses-line {
      background: linear-gradient(90deg, #ef4444, #dc2626);
      transform: translateY(0px);
    }

    .chart-line.profit-line {
      background: linear-gradient(90deg, #10b981, #059669);
      transform: translateY(10px);
    }

    .chart-points {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .point {
      position: absolute;
      width: 8px;
      height: 8px;
      background: #3b82f6;
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .point.active {
      width: 12px;
      height: 12px;
      background: #1d4ed8;
      box-shadow: 0 4px 12px rgba(29, 78, 216, 0.4);
    }

    .chart-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
    }

    /* Categories Analysis */
    .categories-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .category-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .category-item:hover {
      background: rgba(59, 130, 246, 0.05);
      transform: translateX(4px);
    }

    .category-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .category-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .category-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .category-name {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.875rem;
    }

    .category-type {
      font-size: 0.75rem;
      color: #64748b;
    }

    .category-metrics {
      text-align: right;
    }

    .category-value {
      font-weight: 700;
      color: #1e293b;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }

    .category-percentage {
      font-size: 0.75rem;
      font-weight: 600;
      color: #3b82f6;
    }

    /* Insights Section */
    .insights-section {
      margin-bottom: 3rem;
    }

    .insights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .insight-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .insight-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
    }

    .insight-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
    }

    .insight-card.growth::before {
      background: linear-gradient(90deg, #10b981, #059669);
    }

    .insight-card.optimization::before {
      background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    }

    .insight-card.risk::before {
      background: linear-gradient(90deg, #f59e0b, #d97706);
    }

    .insight-card.forecast::before {
      background: linear-gradient(90deg, #8b5cf6, #7c3aed);
    }

    .insight-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .insight-icon {
      font-size: 1.5rem;
    }

    .insight-category {
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .insight-card h4 {
      font-size: 1.125rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 0.75rem 0;
    }

    .insight-card p {
      font-size: 0.875rem;
      color: #64748b;
      line-height: 1.6;
      margin: 0 0 1rem 0;
    }

    .insight-action {
      margin-top: 1rem;
    }

    .action-btn {
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05));
      color: #1d4ed8;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .action-btn:hover {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.1));
      transform: translateY(-1px);
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .header-content {
        flex-direction: column;
        text-align: center;
        gap: 2rem;
      }

      .executive-title {
        font-size: 2.5rem;
      }

      .analytics-grid {
        grid-template-columns: 1fr;
      }

      .summary-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .executive-header {
        padding: 2rem 1rem 3rem;
      }

      .executive-content {
        padding: 1rem;
      }

      .executive-title {
        font-size: 2rem;
      }

      .header-actions {
        flex-direction: column;
        width: 100%;
      }

      .time-range-selector {
        width: 100%;
        justify-content: center;
      }

      .insights-grid {
        grid-template-columns: 1fr;
      }

      .summary-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .summary-card {
        padding: 1.5rem;
      }

      .metric-value {
        font-size: 2rem;
      }
    }
  `]
})
export class RelatoriosComponent implements OnInit {
  selectedPeriod = 'quarter';
  currentTimeRange = '90d';
  
  constructor() { }

  ngOnInit(): void {
  }

  setTimeRange(range: string): void {
    this.currentTimeRange = range;
  }

  setPeriod(period: string): void {
    this.selectedPeriod = period;
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR');
  }
}