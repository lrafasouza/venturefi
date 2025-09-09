import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1>Transforme sua relação com o dinheiro</h1>
            <p class="hero-subtitle">A VentureFi ajuda autônomos e freelancers a organizar, planejar e alcançar seus objetivos financeiros com simplicidade e tecnologia.</p>
            <div class="hero-actions">
              <a routerLink="/platform/dashboard" class="btn btn-primary btn-large">Comece grátis</a>
              <a routerLink="/features" class="btn btn-outline btn-large">Saiba mais</a>
            </div>
          </div>
          <div class="hero-visual">
            <div class="dashboard-mockup">
              <div class="mockup-header">
                <div class="mockup-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div class="mockup-content">
                <div class="mockup-cards">
                  <div class="mockup-card">
                    <div class="card-title">Saldo Atual</div>
                    <div class="card-value">R$ 12.540,50</div>
                  </div>
                  <div class="mockup-card success">
                    <div class="card-title">Receitas</div>
                    <div class="card-value">R$ 8.200,00</div>
                  </div>
                  <div class="mockup-card">
                    <div class="card-title">Despesas</div>
                    <div class="card-value">R$ 3.650,00</div>
                  </div>
                </div>
                <div class="mockup-chart">
                  <div class="chart-bars">
                    <div class="bar" style="height: 60%"></div>
                    <div class="bar" style="height: 80%"></div>
                    <div class="bar" style="height: 45%"></div>
                    <div class="bar" style="height: 90%"></div>
                    <div class="bar" style="height: 70%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="dream-showcase">
      <div class="container">
        <div class="dream-content">
          <div class="dream-info">
            <h2>Em Busca do Sonho</h2>
            <p>Transforme seus sonhos em metas concretas e acompanhe seu progresso em tempo real.</p>
            <ul class="dream-features">
              <li>Definição de metas personalizadas</li>
              <li>Calculadora inteligente de economia</li>
              <li>Acompanhamento visual do progresso</li>
              <li>Dicas personalizadas de economia</li>
            </ul>
            <a routerLink="/platform/dream-pursuit" class="btn btn-success">Explore agora</a>
          </div>
          <div class="dream-visual">
            <div class="dream-card">
              <div class="dream-header">
                <h3>Meu Carro Novo</h3>
                <div class="dream-icon">🚗</div>
              </div>
              <div class="dream-progress">
                <div class="progress-info">
                  <span>R$ 15.000 / R$ 45.000</span>
                  <span>33%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: 33%"></div>
                </div>
              </div>
              <div class="dream-stats">
                <div class="stat">
                  <div class="stat-label">Faltam</div>
                  <div class="stat-value">18 meses</div>
                </div>
                <div class="stat">
                  <div class="stat-label">Por mês</div>
                  <div class="stat-value">R$ 1.667</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="features-preview">
      <div class="container">
        <div class="section-header text-center">
          <h2>Por que escolher a VentureFi?</h2>
          <p>Desenvolvida especialmente para quem tem renda variável</p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Dashboard Intuitivo</h3>
            <p>Visualize suas finanças de forma clara e organizada com gráficos interativos.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Metas Inteligentes</h3>
            <p>Defina objetivos e acompanhe seu progresso com nossa ferramenta "Em Busca do Sonho".</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔔</div>
            <h3>Notificações Smart</h3>
            <p>Receba alertas personalizados sobre suas finanças e oportunidades de economia.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>Segurança Total</h3>
            <p>Seus dados protegidos com criptografia avançada e protocolos de segurança bancária.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <div class="cta-content text-center">
          <h2>Pronto para transformar suas finanças?</h2>
          <p>Junte-se a milhares de freelancers e autônomos que já organizam suas finanças com a VentureFi</p>
          <div class="cta-actions">
            <a routerLink="/platform/dashboard" class="btn btn-primary btn-large">Começar gratuitamente</a>
            <a routerLink="/pricing" class="btn btn-outline-white btn-large">Ver planos</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      padding: 4rem 0;
      background: linear-gradient(135deg, var(--professional-light-gray) 0%, var(--white) 100%);
    }
    
    .hero-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }
    
    .hero-text h1 {
      font-size: 3rem;
      margin-bottom: 1.5rem;
      line-height: 1.2;
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      color: var(--medium-gray);
    }
    
    .hero-actions {
      display: flex;
      gap: 1rem;
    }
    
    .btn-large {
      padding: 1rem 2rem;
      font-size: 1.1rem;
      font-weight: 600;
      min-width: 200px;
      text-align: center;
    }
    
    .dashboard-mockup {
      background: var(--white);
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transform: perspective(1000px) rotateY(-15deg) rotateX(10deg);
      transition: transform 0.3s ease;
    }
    
    .dashboard-mockup:hover {
      transform: perspective(1000px) rotateY(-10deg) rotateX(5deg);
    }
    
    .mockup-header {
      background: var(--security-blue);
      padding: 1rem;
      display: flex;
      align-items: center;
    }
    
    .mockup-dots {
      display: flex;
      gap: 0.5rem;
    }
    
    .mockup-dots span {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
    }
    
    .mockup-dots span:first-child {
      background: #ff5f56;
    }
    
    .mockup-dots span:nth-child(2) {
      background: #ffbd2e;
    }
    
    .mockup-dots span:last-child {
      background: #27ca3f;
    }
    
    .mockup-content {
      padding: 2rem;
    }
    
    .mockup-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .mockup-card {
      background: var(--professional-light-gray);
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
    }
    
    .mockup-card.success {
      background: rgba(46, 204, 113, 0.1);
    }
    
    .card-title {
      font-size: 0.8rem;
      color: var(--medium-gray);
      margin-bottom: 0.5rem;
    }
    
    .card-value {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--security-blue);
    }
    
    .mockup-chart {
      height: 100px;
      background: var(--professional-light-gray);
      border-radius: 8px;
      padding: 1rem;
      display: flex;
      align-items: end;
    }
    
    .chart-bars {
      display: flex;
      gap: 0.5rem;
      width: 100%;
      height: 100%;
      align-items: end;
    }
    
    .bar {
      flex: 1;
      background: var(--innovation-green);
      border-radius: 2px 2px 0 0;
      min-height: 20px;
    }
    
    .dream-showcase {
      padding: 4rem 0;
      background: var(--white);
    }
    
    .dream-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }
    
    .dream-features {
      list-style: none;
      margin: 2rem 0;
    }
    
    .dream-features li {
      padding: 0.5rem 0;
      padding-left: 2rem;
      position: relative;
    }
    
    .dream-features li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--innovation-green);
      font-weight: bold;
    }
    
    .dream-card {
      background: var(--white);
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--light-gray);
    }
    
    .dream-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .dream-header h3 {
      margin: 0;
      color: var(--security-blue);
    }
    
    .dream-icon {
      font-size: 2rem;
    }
    
    .dream-progress {
      margin-bottom: 1.5rem;
    }
    
    .progress-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      color: var(--medium-gray);
    }
    
    .dream-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .stat {
      text-align: center;
    }
    
    .stat-label {
      font-size: 0.8rem;
      color: var(--medium-gray);
      margin-bottom: 0.25rem;
    }
    
    .stat-value {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--security-blue);
    }
    
    .features-preview {
      padding: 4rem 0;
      background: var(--professional-light-gray);
    }
    
    .section-header {
      margin-bottom: 3rem;
    }
    
    .section-header h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }
    
    .feature-card {
      background: var(--white);
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    }
    
    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .feature-card h3 {
      margin-bottom: 1rem;
      color: var(--security-blue);
    }
    
    .cta-section {
      padding: 4rem 0;
      background: var(--security-blue);
      color: var(--white);
    }
    
    .cta-content h2 {
      color: var(--white);
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    .cta-content p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      color: rgba(255, 255, 255, 0.9);
    }
    
    .cta-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    
    @media (max-width: 768px) {
      .hero-content,
      .dream-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      .hero-text h1 {
        font-size: 2rem;
      }
      
      .hero-actions,
      .cta-actions {
        flex-direction: column;
        align-items: center;
      }
      
      .mockup-cards {
        grid-template-columns: 1fr;
      }
      
      .dashboard-mockup {
        transform: none;
      }
      
      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent {}