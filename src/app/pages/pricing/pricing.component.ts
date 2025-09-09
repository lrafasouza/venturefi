import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="hero">
      <div class="container">
        <div class="hero-content text-center">
          <h1>Planos que se adaptam ao seu negócio</h1>
          <p class="hero-subtitle">Escolha o plano ideal para organizar suas finanças e alcançar seus objetivos</p>
        </div>
      </div>
    </section>

    <section class="pricing-section">
      <div class="container">
        <div class="pricing-grid">
          <div class="pricing-card" [class.popular]="plan.popular" *ngFor="let plan of plans">
            <div class="plan-header">
              <div class="plan-badge" *ngIf="plan.popular">Mais Popular</div>
              <h3>{{ plan.name }}</h3>
              <div class="plan-price">
                <span class="currency">R$</span>
                <span class="amount">{{ plan.price }}</span>
                <span class="period">/mês</span>
              </div>
              <p class="plan-description">{{ plan.description }}</p>
            </div>
            
            <div class="plan-features">
              <ul>
                <li *ngFor="let feature of plan.features" [class.highlight]="feature.highlight">
                  <span class="feature-icon" [class.check]="feature.included" [class.times]="!feature.included">
                    {{ feature.included ? '✓' : '×' }}
                  </span>
                  {{ feature.name }}
                </li>
              </ul>
            </div>
            
            <div class="plan-action">
              <a [routerLink]="plan.ctaLink" class="btn" [class.btn-primary]="plan.popular" [class.btn-outline]="!plan.popular">
                {{ plan.ctaText }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="comparison-section">
      <div class="container">
        <div class="section-header text-center">
          <h2>Comparação Detalhada</h2>
          <p>Veja todas as funcionalidades disponíveis em cada plano</p>
        </div>
        
        <div class="comparison-table-wrapper">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Funcionalidades</th>
                <th>Free</th>
                <th>Essencial</th>
                <th>Business</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let feature of comparisonFeatures">
                <td class="feature-name">{{ feature.name }}</td>
                <td class="feature-value" [class.included]="feature.free === true" [class.limited]="typeof feature.free === 'string'">
                  <span *ngIf="feature.free === true" class="check">✓</span>
                  <span *ngIf="feature.free === false" class="times">×</span>
                  <span *ngIf="typeof feature.free === 'string'">{{ feature.free }}</span>
                </td>
                <td class="feature-value" [class.included]="feature.essencial === true" [class.limited]="typeof feature.essencial === 'string'">
                  <span *ngIf="feature.essencial === true" class="check">✓</span>
                  <span *ngIf="feature.essencial === false" class="times">×</span>
                  <span *ngIf="typeof feature.essencial === 'string'">{{ feature.essencial }}</span>
                </td>
                <td class="feature-value" [class.included]="feature.business === true" [class.limited]="typeof feature.business === 'string'">
                  <span *ngIf="feature.business === true" class="check">✓</span>
                  <span *ngIf="feature.business === false" class="times">×</span>
                  <span *ngIf="typeof feature.business === 'string'">{{ feature.business }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="faq-section">
      <div class="container">
        <div class="section-header text-center">
          <h2>Perguntas Frequentes</h2>
          <p>Tire suas dúvidas sobre nossos planos</p>
        </div>
        
        <div class="faq-grid">
          <div class="faq-item" *ngFor="let faq of faqs">
            <h3>{{ faq.question }}</h3>
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="testimonials-section">
      <div class="container">
        <div class="section-header text-center">
          <h2>O que nossos usuários dizem</h2>
          <p>Depoimentos de freelancers que transformaram suas finanças</p>
        </div>
        
        <div class="testimonials-grid">
          <div class="testimonial-card" *ngFor="let testimonial of testimonials">
            <div class="testimonial-content">
              <p>"{{ testimonial.text }}"</p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">{{ testimonial.avatar }}</div>
              <div class="author-info">
                <div class="author-name">{{ testimonial.name }}</div>
                <div class="author-role">{{ testimonial.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <div class="cta-content text-center">
          <h2>Comece sua jornada financeira hoje</h2>
          <p>Junte-se a milhares de freelancers que já organizaram suas finanças com a VentureFi</p>
          <div class="cta-actions">
            <a routerLink="/platform/dashboard" class="btn btn-primary">Começar gratuitamente</a>
            <a routerLink="/contact" class="btn btn-outline">Falar com vendas</a>
          </div>
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
    
    .pricing-section {
      padding: 4rem 0;
    }
    
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    @media (min-width: 1024px) {
      .pricing-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    .pricing-card {
      background: var(--white);
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      border: 2px solid var(--light-gray);
      position: relative;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .pricing-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
    }
    
    .pricing-card.popular {
      border-color: var(--innovation-green);
      transform: scale(1.05);
    }
    
    .pricing-card.popular:hover {
      transform: scale(1.05) translateY(-8px);
    }
    
    .plan-badge {
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--innovation-green);
      color: var(--white);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
    }
    
    .plan-header {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--light-gray);
    }
    
    .plan-header h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: var(--security-blue);
    }
    
    .plan-price {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }
    
    .currency {
      font-size: 1.25rem;
      color: var(--medium-gray);
    }
    
    .amount {
      font-size: 3rem;
      font-weight: 700;
      color: var(--security-blue);
      margin: 0 0.25rem;
    }
    
    .period {
      font-size: 1rem;
      color: var(--medium-gray);
    }
    
    .plan-description {
      font-size: 1rem;
      color: var(--medium-gray);
    }
    
    .plan-features ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .plan-features li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 0;
      font-size: 1rem;
    }
    
    .feature-icon {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: bold;
    }
    
    .feature-icon.check {
      background: rgba(46, 204, 113, 0.1);
      color: var(--innovation-green);
    }
    
    .feature-icon.times {
      background: rgba(231, 76, 60, 0.1);
      color: #e74c3c;
    }
    
    .plan-features li.highlight {
      background: rgba(46, 204, 113, 0.05);
      margin: 0 -1rem;
      padding: 0.75rem 1rem;
      border-radius: 8px;
    }
    
    .plan-action {
      margin-top: 2rem;
      text-align: center;
    }
    
    .comparison-section {
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
    
    .comparison-table-wrapper {
      overflow-x: auto;
      background: var(--white);
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }
    
    .comparison-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .comparison-table th,
    .comparison-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid var(--light-gray);
    }
    
    .comparison-table th {
      background: var(--professional-light-gray);
      font-weight: 600;
      color: var(--security-blue);
    }
    
    .feature-name {
      font-weight: 500;
      color: var(--dark-gray);
    }
    
    .feature-value {
      text-align: center;
    }
    
    .feature-value.included .check {
      color: var(--innovation-green);
    }
    
    .feature-value .times {
      color: #e74c3c;
    }
    
    .feature-value.limited {
      color: var(--medium-gray);
      font-style: italic;
    }
    
    .faq-section {
      padding: 4rem 0;
    }
    
    .faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
    }
    
    .faq-item {
      background: var(--white);
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }
    
    .faq-item h3 {
      color: var(--security-blue);
      margin-bottom: 1rem;
      font-size: 1.125rem;
    }
    
    .testimonials-section {
      padding: 4rem 0;
      background: var(--professional-light-gray);
    }
    
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .testimonial-card {
      background: var(--white);
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }
    
    .testimonial-content {
      margin-bottom: 1.5rem;
    }
    
    .testimonial-content p {
      font-style: italic;
      font-size: 1.125rem;
      color: var(--dark-gray);
    }
    
    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .author-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--innovation-green);
      color: var(--white);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    .author-name {
      font-weight: 600;
      color: var(--security-blue);
    }
    
    .author-role {
      font-size: 0.875rem;
      color: var(--medium-gray);
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
      .hero h1,
      .section-header h2,
      .cta-content h2 {
        font-size: 2rem;
      }
      
      .pricing-card.popular {
        transform: none;
      }
      
      .pricing-card.popular:hover {
        transform: translateY(-8px);
      }
      
      .faq-grid {
        grid-template-columns: 1fr;
      }
      
      .cta-actions {
        flex-direction: column;
        align-items: center;
      }
      
      .comparison-table th,
      .comparison-table td {
        padding: 0.75rem 0.5rem;
        font-size: 0.875rem;
      }
    }
  `]
})
export class PricingComponent {
  plans = [
    {
      name: 'Plano Free',
      price: '0',
      description: 'Ideal para começar o controle financeiro',
      popular: false,
      ctaText: 'Começar grátis',
      ctaLink: '/platform/dashboard',
      features: [
        { name: 'Cadastro manual de receitas e despesas', included: true },
        { name: 'Painel com saldo mensal', included: true },
        { name: '1 meta ativa no "Em Busca do Sonho"', included: true },
        { name: 'Relatórios básicos (mensal e por categoria)', included: true },
        { name: 'Lembretes simples (e-mail ou notificação push)', included: true },
        { name: 'Onboarding interativo com ajuda contextual', included: true },
        { name: 'Controle para quem lida com renda variável', included: true },
        { name: 'Metas ilimitadas', included: false },
        { name: 'Notificações WhatsApp', included: false },
        { name: 'Consultoria financeira', included: false }
      ]
    },
    {
      name: 'Plano Essencial',
      price: '100',
      description: 'Feito para autônomos e freelancers com foco em organização fiscal',
      popular: true,
      ctaText: 'Assinar Essencial',
      ctaLink: '/platform/dashboard',
      features: [
        { name: 'Tudo do plano Gratuito', included: true },
        { name: 'Metas ilimitadas "Em Busca do Sonho"', included: true, highlight: true },
        { name: 'Sugestões personalizadas de economia e investimento', included: true, highlight: true },
        { name: 'Relatórios detalhados e exportação (CSV)', included: true },
        { name: 'Notificações inteligentes via WhatsApp (integração API)', included: true, highlight: true },
        { name: 'Assistente virtual básico com dicas financeiras', included: true },
        { name: 'Organização fiscal especializada', included: true },
        { name: 'Suporte prioritário', included: false },
        { name: 'Consultoria financeira individual', included: false },
        { name: 'Acesso antecipado a novas funcionalidades', included: false }
      ]
    },
    {
      name: 'Plano Business',
      price: '150',
      description: 'Solução completa com consultoria estratégica individual',
      popular: false,
      ctaText: 'Assinar Business',
      ctaLink: '/platform/dashboard',
      features: [
        { name: 'Tudo do plano Essencial', included: true },
        { name: 'Consultoria Financeira estratégica individual (2h/mês)', included: true, highlight: true },
        { name: 'Planejamento adaptado ao fluxo de caixa variável', included: true, highlight: true },
        { name: 'Suporte prioritário', included: true },
        { name: 'Acesso antecipado a novas funcionalidades', included: true, highlight: true },
        { name: 'Open Finance (em desenvolvimento)', included: true },
        { name: 'IA avançada (roadmap)', included: true },
        { name: 'Blockchain (roadmap)', included: true },
        { name: 'Consultoria ilimitada', included: false },
        { name: 'Desenvolvimento customizado', included: false }
      ]
    }
  ];

  comparisonFeatures = [
    { name: 'Cadastro manual de receitas e despesas', free: true, essencial: true, business: true },
    { name: 'Painel com saldo mensal', free: true, essencial: true, business: true },
    { name: 'Metas Em Busca do Sonho', free: '1 meta', essencial: 'Ilimitadas', business: 'Ilimitadas' },
    { name: 'Relatórios básicos', free: true, essencial: true, business: true },
    { name: 'Lembretes simples', free: true, essencial: true, business: true },
    { name: 'Onboarding interativo', free: true, essencial: true, business: true },
    { name: 'Controle para renda variável', free: true, essencial: true, business: true },
    { name: 'Sugestões personalizadas de economia', free: false, essencial: true, business: true },
    { name: 'Relatórios detalhados e CSV', free: false, essencial: true, business: true },
    { name: 'Notificações via WhatsApp', free: false, essencial: true, business: true },
    { name: 'Assistente virtual com dicas', free: false, essencial: true, business: true },
    { name: 'Organização fiscal especializada', free: false, essencial: true, business: true },
    { name: 'Consultoria financeira individual (2h/mês)', free: false, essencial: false, business: true },
    { name: 'Planejamento para fluxo variável', free: false, essencial: false, business: true },
    { name: 'Suporte prioritário', free: false, essencial: false, business: true },
    { name: 'Acesso antecipado a funcionalidades', free: false, essencial: false, business: true },
    { name: 'Open Finance (desenvolvimento)', free: false, essencial: false, business: true },
    { name: 'IA avançada (roadmap)', free: false, essencial: false, business: true },
    { name: 'Blockchain (roadmap)', free: false, essencial: false, business: true }
  ];

  faqs = [
    {
      question: 'Posso cancelar minha assinatura a qualquer momento?',
      answer: 'Sim! Você pode cancelar sua assinatura Premium a qualquer momento. Não há taxas de cancelamento e você continuará tendo acesso aos recursos Premium até o final do período pago.'
    },
    {
      question: 'Como funciona o período gratuito?',
      answer: 'O plano Free é completamente gratuito e não tem limite de tempo. Você pode usar as funcionalidades básicas pelo tempo que quiser, sem precisar inserir cartão de crédito.'
    },
    {
      question: 'Meus dados estão seguros?',
      answer: 'Sim! Utilizamos criptografia bancária (AES-256) e seguimos os mais rigorosos protocolos de segurança. Seus dados são armazenados em servidores seguros com backup automático.'
    },
    {
      question: 'Posso fazer upgrade do Free para Premium?',
      answer: 'Claro! Você pode fazer upgrade a qualquer momento. Todos os seus dados e metas serão preservados, e você terá acesso imediato às funcionalidades Premium.'
    },
    {
      question: 'Há desconto para pagamento anual?',
      answer: 'Sim! Oferecemos 20% de desconto para assinaturas anuais. O valor fica R$ 278,40 por ano (equivalente a R$ 23,20/mês).'
    },
    {
      question: 'Preciso instalar algum software?',
      answer: 'Não! A VentureFi é uma aplicação web que funciona em qualquer navegador moderno. Também temos versão otimizada para dispositivos móveis.'
    }
  ];

  testimonials = [
    {
      text: 'A VentureFi transformou completamente como eu gerencio minhas finanças como freelancer. Agora consigo planejar meus projetos e economizar para meus objetivos.',
      name: 'Ana Silva',
      role: 'Designer Freelancer',
      avatar: 'AS'
    },
    {
      text: 'O recurso Em Busca do Sonho me ajudou a economizar R$ 15.000 em 8 meses para comprar meu primeiro carro. Recomendo para todos os autônomos!',
      name: 'Carlos Santos',
      role: 'Desenvolvedor',
      avatar: 'CS'
    },
    {
      text: 'Interface super intuitiva e funcionalidades que realmente fazem sentido para quem tem renda variável. Vale cada centavo do Premium.',
      name: 'Mariana Costa',
      role: 'Consultora de Marketing',
      avatar: 'MC'
    }
  ];
}