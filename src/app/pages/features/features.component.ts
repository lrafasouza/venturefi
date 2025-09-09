import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="hero">
      <div class="container">
        <div class="hero-content text-center">
          <h1>Recursos Poderosos para Freelancers</h1>
          <p class="hero-subtitle">Tudo que você precisa para ter controle total das suas finanças</p>
        </div>
      </div>
    </section>

    <section class="features-detailed">
      <div class="container">
        <div class="feature-item" *ngFor="let feature of features; let i = index" [class.reverse]="i % 2 === 1">
          <div class="feature-content">
            <div class="feature-info">
              <h2>{{ feature.title }}</h2>
              <p>{{ feature.description }}</p>
              <ul class="feature-benefits">
                <li *ngFor="let benefit of feature.benefits">{{ benefit }}</li>
              </ul>
              <a routerLink="/platform/dashboard" class="btn btn-primary">Experimentar agora</a>
            </div>
            <div class="feature-visual">
              <div class="feature-mockup" [ngClass]="feature.mockupClass">
                <ng-container [ngSwitch]="feature.type">
                  
                  <!-- Dashboard mockup -->
                  <div *ngSwitchCase="'dashboard'" class="dashboard-preview">
                    <div class="dashboard-header">
                      <div class="header-title">Dashboard Financeiro</div>
                    </div>
                    <div class="dashboard-grid">
                      <div class="dashboard-card primary">
                        <div class="card-label">Saldo Total</div>
                        <div class="card-value">R$ 12.540,50</div>
                      </div>
                      <div class="dashboard-card success">
                        <div class="card-label">Receitas</div>
                        <div class="card-value">+R$ 8.200,00</div>
                      </div>
                      <div class="dashboard-card warning">
                        <div class="card-label">Despesas</div>
                        <div class="card-value">-R$ 3.650,00</div>
                      </div>
                    </div>
                    <div class="chart-area">
                      <div class="chart-title">Evolução Mensal</div>
                      <div class="chart-bars">
                        <div class="bar" style="height: 40%"></div>
                        <div class="bar" style="height: 70%"></div>
                        <div class="bar" style="height: 55%"></div>
                        <div class="bar" style="height: 85%"></div>
                        <div class="bar" style="height: 60%"></div>
                        <div class="bar" style="height: 90%"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Dream pursuit mockup -->
                  <div *ngSwitchCase="'dream'" class="dream-preview">
                    <div class="dream-card-preview">
                      <div class="dream-title">Viagem dos Sonhos ✈️</div>
                      <div class="dream-target">Meta: R$ 15.000</div>
                      <div class="progress-section">
                        <div class="progress-bar">
                          <div class="progress-fill" style="width: 65%"></div>
                        </div>
                        <div class="progress-text">R$ 9.750 economizados (65%)</div>
                      </div>
                      <div class="dream-timeline">
                        <div class="timeline-item">Faltam 6 meses</div>
                        <div class="timeline-item">R$ 875/mês</div>
                      </div>
                    </div>
                  </div>

                  <!-- Notifications mockup -->
                  <div *ngSwitchCase="'notifications'" class="notifications-preview">
                    <div class="whatsapp-header">
                      <div class="whatsapp-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#25d366">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                        </svg>
                        <span>WhatsApp VentureFi</span>
                      </div>
                      <div class="whatsapp-status">Online</div>
                    </div>
                    <div class="whatsapp-messages">
                      <div class="whatsapp-message received">
                        <div class="message-content">🎉 Parabéns! Você alcançou sua meta mensal de economia: R$ 2.000!</div>
                        <div class="message-time">14:32</div>
                      </div>
                      <div class="whatsapp-message received">
                        <div class="message-content">💡 Dica: Você gastou R$ 450 com delivery este mês. Reduzindo 30% você economizaria R$ 135!</div>
                        <div class="message-time">14:33</div>
                      </div>
                      <div class="whatsapp-message received">
                        <div class="message-content">⚠️ Atenção: Seus gastos com alimentação ultrapassaram o orçamento em R$ 200. Quer ajuda para ajustar?</div>
                        <div class="message-time">14:35</div>
                      </div>
                    </div>
                  </div>

                  <!-- Security mockup -->
                  <div *ngSwitchCase="'security'" class="security-preview">
                    <div class="security-badge">
                      <div class="security-icon">🔒</div>
                      <div class="security-text">Conexão Segura</div>
                    </div>
                    <div class="security-features">
                      <div class="security-item">
                        <span class="check">✓</span>
                        <span>Criptografia AES-256</span>
                      </div>
                      <div class="security-item">
                        <span class="check">✓</span>
                        <span>Autenticação 2FA</span>
                      </div>
                      <div class="security-item">
                        <span class="check">✓</span>
                        <span>Backup automático</span>
                      </div>
                      <div class="security-item">
                        <span class="check">✓</span>
                        <span>Monitoramento 24/7</span>
                      </div>
                    </div>
                  </div>

                </ng-container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="integration-section">
      <div class="container">
        <div class="section-header text-center">
          <h2>Integrações Futuras</h2>
          <p>Planejamos conectar com as principais ferramentas do mercado</p>
        </div>
        <div class="integration-grid">
          <div class="integration-card">
            <div class="integration-icon">🏦</div>
            <h3>Open Finance</h3>
            <p>Conexão automática com bancos e fintechs</p>
            <span class="coming-soon">Em breve</span>
          </div>
          <div class="integration-card">
            <div class="integration-icon">🤖</div>
            <h3>IA Assistant</h3>
            <p>Assistente financeiro inteligente personalizado</p>
            <span class="coming-soon">Em desenvolvimento</span>
          </div>
          <div class="integration-card">
            <div class="integration-icon">⛓️</div>
            <h3>Blockchain</h3>
            <p>Segurança e investimentos descentralizados</p>
            <span class="coming-soon">Roadmap 2026</span>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <div class="cta-content text-center">
          <h2>Pronto para experimentar?</h2>
          <p>Comece gratuitamente e descubra como a VentureFi pode transformar suas finanças</p>
          <a routerLink="/platform/dashboard" class="btn btn-primary">Começar agora</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      padding: 4rem 0;
      background: linear-gradient(135deg, var(--security-blue) 0%, #2c5aa0 100%);
      color: var(--white);
    }
    
    .hero h1 {
      color: var(--white);
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.9);
    }
    
    .features-detailed {
      padding: 4rem 0;
    }
    
    .feature-item {
      margin-bottom: 6rem;
    }
    
    .feature-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }
    
    .feature-item.reverse .feature-content {
      direction: rtl;
    }
    
    .feature-item.reverse .feature-info {
      direction: ltr;
    }
    
    .feature-info h2 {
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
    }
    
    .feature-info p {
      font-size: 1.125rem;
      margin-bottom: 2rem;
    }
    
    .feature-benefits {
      list-style: none;
      margin: 2rem 0;
    }
    
    .feature-benefits li {
      padding: 0.75rem 0;
      padding-left: 2rem;
      position: relative;
      font-size: 1.1rem;
    }
    
    .feature-benefits li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--innovation-green);
      font-weight: bold;
      font-size: 1.2rem;
    }
    
    .feature-mockup {
      background: var(--white);
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      padding: 2rem;
    }
    
    .dashboard-preview {
      min-height: 300px;
    }
    
    .dashboard-header {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--light-gray);
    }
    
    .header-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--security-blue);
    }
    
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .dashboard-card {
      padding: 1rem;
      border-radius: 8px;
      background: var(--professional-light-gray);
    }
    
    .dashboard-card.primary {
      background: rgba(30, 58, 95, 0.1);
    }
    
    .dashboard-card.success {
      background: rgba(46, 204, 113, 0.1);
    }
    
    .dashboard-card.warning {
      background: rgba(243, 156, 18, 0.1);
    }
    
    .card-label {
      font-size: 0.875rem;
      color: var(--medium-gray);
      margin-bottom: 0.5rem;
    }
    
    .card-value {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--security-blue);
    }
    
    .chart-area {
      background: var(--professional-light-gray);
      padding: 1rem;
      border-radius: 8px;
    }
    
    .chart-title {
      font-size: 0.875rem;
      color: var(--medium-gray);
      margin-bottom: 1rem;
    }
    
    .chart-bars {
      display: flex;
      gap: 0.5rem;
      height: 80px;
      align-items: end;
    }
    
    .bar {
      flex: 1;
      background: var(--innovation-green);
      border-radius: 2px 2px 0 0;
      min-height: 10px;
    }
    
    .dream-preview {
      min-height: 250px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .dream-card-preview {
      background: var(--professional-light-gray);
      padding: 2rem;
      border-radius: 12px;
      width: 100%;
      max-width: 300px;
    }
    
    .dream-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--security-blue);
      margin-bottom: 0.5rem;
    }
    
    .dream-target {
      font-size: 0.875rem;
      color: var(--medium-gray);
      margin-bottom: 1.5rem;
    }
    
    .progress-section {
      margin-bottom: 1.5rem;
    }
    
    .progress-text {
      font-size: 0.875rem;
      color: var(--medium-gray);
      margin-top: 0.5rem;
    }
    
    .dream-timeline {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .timeline-item {
      text-align: center;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--security-blue);
    }
    
    .notifications-preview {
      min-height: 300px;
      background: #f0f0f0;
      border-radius: 12px;
      overflow: hidden;
    }
    
    .whatsapp-header {
      background: #25d366;
      color: white;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .whatsapp-icon {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
    }
    
    .whatsapp-status {
      font-size: 0.875rem;
      opacity: 0.9;
    }
    
    .whatsapp-messages {
      padding: 1rem;
      background: #e5ddd5;
      min-height: 200px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-opacity='0.03'%3E%3Cpolygon fill='%23000' points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E");
    }
    
    .whatsapp-message {
      margin-bottom: 0.5rem;
      display: flex;
      justify-content: flex-start;
    }
    
    .whatsapp-message.received .message-content {
      background: white;
      border-radius: 7.5px;
      padding: 0.75rem;
      max-width: 80%;
      box-shadow: 0 1px 0.5px rgba(0,0,0,.13);
      position: relative;
      margin-left: 0;
    }
    
    .whatsapp-message.received .message-content::before {
      content: '';
      position: absolute;
      left: -6px;
      top: 6px;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 6px 8px 0;
      border-color: transparent white transparent transparent;
    }
    
    .message-content {
      font-size: 0.875rem;
      line-height: 1.4;
      word-wrap: break-word;
    }
    
    .message-time {
      font-size: 0.75rem;
      color: #999;
      margin-top: 0.25rem;
      text-align: right;
    }
    
    .security-preview {
      min-height: 250px;
      text-align: center;
    }
    
    .security-badge {
      background: rgba(46, 204, 113, 0.1);
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
    }
    
    .security-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .security-text {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--innovation-green);
    }
    
    .security-features {
      display: grid;
      gap: 1rem;
    }
    
    .security-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      background: var(--professional-light-gray);
      border-radius: 8px;
    }
    
    .check {
      color: var(--innovation-green);
      font-weight: bold;
    }
    
    .integration-section {
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
    
    .integration-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .integration-card {
      background: var(--white);
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
      position: relative;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }
    
    .integration-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .integration-card h3 {
      margin-bottom: 1rem;
      color: var(--security-blue);
    }
    
    .coming-soon {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: var(--innovation-green);
      color: var(--white);
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
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
    
    @media (max-width: 768px) {
      .feature-content,
      .feature-item.reverse .feature-content {
        grid-template-columns: 1fr;
        direction: ltr;
        gap: 2rem;
      }
      
      .hero h1,
      .feature-info h2,
      .section-header h2,
      .cta-content h2 {
        font-size: 2rem;
      }
      
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
      
      .integration-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FeaturesComponent {
  features = [
    {
      title: 'Dashboard Interativo',
      description: 'Visualize todas as suas informações financeiras em um painel intuitivo e personalizável. Acompanhe receitas, despesas e saldo em tempo real.',
      benefits: [
        'Gráficos interativos e personalizáveis',
        'Visão geral completa das finanças',
        'Atualizações em tempo real',
        'Interface responsiva para todos os dispositivos'
      ],
      type: 'dashboard',
      mockupClass: 'dashboard-mockup'
    },
    {
      title: 'Em Busca do Sonho',
      description: 'Transforme seus objetivos em metas concretas com nossa ferramenta exclusiva. Planeje, economize e conquiste seus sonhos de forma organizada.',
      benefits: [
        'Criação de metas personalizadas',
        'Calculadora inteligente de economia',
        'Acompanhamento visual do progresso',
        'Sugestões automáticas de economia'
      ],
      type: 'dream',
      mockupClass: 'dream-mockup'
    },
    {
      title: 'Notificações Inteligentes via WhatsApp',
      description: 'Receba alertas financeiros diretamente no WhatsApp! Nossa integração exclusiva envia notificações personalizadas sobre suas metas, gastos e oportunidades de economia.',
      benefits: [
        'Notificações via WhatsApp em tempo real',
        'Alertas inteligentes de gastos excessivos',
        'Dicas personalizadas de economia por mensagem',
        'Lembretes automáticos de metas e prazos',
        'Relatórios financeiros mensais no WhatsApp'
      ],
      type: 'notifications',
      mockupClass: 'notifications-mockup'
    },
    {
      title: 'Segurança Avançada',
      description: 'Seus dados protegidos com os mais altos padrões de segurança. Utilizamos criptografia bancária e monitoramento 24/7.',
      benefits: [
        'Criptografia AES-256 em todas as transações',
        'Autenticação de dois fatores (2FA)',
        'Backup automático e redundante',
        'Monitoramento contínuo de segurança'
      ],
      type: 'security',
      mockupClass: 'security-mockup'
    }
  ];
}