import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { getSvgIcon } from '../../shared/icons';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="hero">
      <div class="container">
        <div class="hero-content text-center">
          <h1>Sobre a VentureFi</h1>
          <p class="hero-subtitle">Nascemos da necessidade real de freelancers e autônomos por uma gestão financeira que realmente funcione</p>
        </div>
      </div>
    </section>

    <section class="mission-section">
      <div class="container">
        <div class="mission-content">
          <div class="mission-text">
            <h2>Nossa Missão</h2>
            <p>Democratizar o acesso à gestão financeira inteligente, oferecendo ferramentas simples e poderosas para freelancers e autônomos organizarem suas finanças e alcançarem seus objetivos.</p>
            <p>Acreditamos que todos merecem ter controle sobre seu dinheiro, independentemente do tipo de renda ou conhecimento financeiro.</p>
            
            <div class="mission-stats">
              <div class="stat-item">
                <div class="stat-number">1000+</div>
                <div class="stat-label">Usuários ativos</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">R$ 2M+</div>
                <div class="stat-label">Economizados pelos usuários</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">500+</div>
                <div class="stat-label">Metas alcançadas</div>
              </div>
            </div>
          </div>
          
          <div class="mission-visual">
            <div class="mission-image">
              <div class="image-placeholder">
                <div class="image-icon" [innerHTML]="getIcon('target', 48)"></div>
                <div class="image-text">Transformando sonhos em realidade</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="story-section">
      <div class="container">
        <div class="story-content">
          <div class="story-header text-center">
            <h2>Nossa História</h2>
            <p>Como surgiu a VentureFi</p>
          </div>
          
          <div class="story-timeline">
            <div class="timeline-item" *ngFor="let event of timeline">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-date">{{ event.date }}</div>
                <h3>{{ event.title }}</h3>
                <p>{{ event.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="team-section">
      <div class="container">
        <div class="section-header text-center">
          <h2>Equipe Fundadora</h2>
          <p>Estudantes da FIAP apaixonados por tecnologia e finanças</p>
        </div>
        
        <div class="team-grid">
          <div class="team-member" *ngFor="let member of team">
            <div class="member-photo">
              <div class="photo-placeholder">{{ member.initials }}</div>
            </div>
            <div class="member-info">
              <h3>{{ member.name }}</h3>
              <div class="member-role">{{ member.role }}</div>
              <div class="member-course">{{ member.course }}</div>
              <p>{{ member.bio }}</p>
              <div class="member-social">
                <a href="{{ member.linkedin }}" target="_blank" aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="{{ member.github }}" target="_blank" aria-label="GitHub">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="values-section">
      <div class="container">
        <div class="section-header text-center">
          <h2>Nossos Valores</h2>
          <p>Os princípios que guiam nosso trabalho</p>
        </div>
        
        <div class="values-grid">
          <div class="value-card" *ngFor="let value of values">
            <div class="value-icon" [innerHTML]="getIcon(value.iconName, 32)"></div>
            <h3>{{ value.title }}</h3>
            <p>{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="future-section">
      <div class="container">
        <div class="future-content">
          <div class="future-text">
            <h2>O Futuro da VentureFi</h2>
            <p>Este é apenas o começo. Nossa visão é criar um ecossistema completo de ferramentas financeiras para profissionais autônomos, incluindo:</p>
            
            <ul class="future-features">
              <li>Integração com Open Finance para conexão automática com bancos</li>
              <li>Assistente financeiro com Inteligência Artificial</li>
              <li>Plataforma de investimentos simplificada</li>
              <li>Marketplace de serviços financeiros</li>
              <li>Comunidade de freelancers para troca de experiências</li>
            </ul>
            
            <a routerLink="/contact" class="btn btn-primary">Fale conosco</a>
          </div>
          
          <div class="future-visual">
            <div class="future-image">
              <div class="image-placeholder">
                <div class="image-icon" [innerHTML]="getIcon('rocket', 48)"></div>
                <div class="image-text">Construindo o futuro das finanças</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="academic-section">
      <div class="container">
        <div class="academic-content text-center">
          <h2>Projeto Acadêmico FIAP 2025</h2>
          <p>A VentureFi nasceu como projeto acadêmico do curso de Análise e Desenvolvimento de Sistemas da FIAP, mas nossa visão vai muito além da sala de aula.</p>
          <p>Queremos transformar a realidade financeira de milhões de brasileiros que trabalham de forma autônoma.</p>
          
          <div class="academic-info">
            <div class="info-item">
              <div class="info-icon" [innerHTML]="getIcon('building', 28)"></div>
              <div class="info-text">
                <div class="info-title">Instituição</div>
                <div class="info-value">FIAP - Faculdade de Informática e Administração Paulista</div>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon" [innerHTML]="getIcon('user', 28)"></div>
              <div class="info-text">
                <div class="info-title">Curso</div>
                <div class="info-value">Análise e Desenvolvimento de Sistemas</div>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon" [innerHTML]="getIcon('star', 28)"></div>
              <div class="info-text">
                <div class="info-title">Ano</div>
                <div class="info-value">2025</div>
              </div>
            </div>
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
      max-width: 600px;
      margin: 0 auto;
    }
    
    .mission-section {
      padding: 4rem 0;
    }
    
    .mission-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }
    
    .mission-text h2 {
      font-size: 2.5rem;
      margin-bottom: 2rem;
    }
    
    .mission-text p {
      font-size: 1.125rem;
      margin-bottom: 1.5rem;
    }
    
    .mission-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin-top: 3rem;
    }
    
    .stat-item {
      text-align: center;
    }
    
    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--innovation-green);
      margin-bottom: 0.5rem;
    }
    
    .stat-label {
      font-size: 0.875rem;
      color: var(--medium-gray);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .mission-visual {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .mission-image,
    .future-image {
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--innovation-green), #27ae60);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--white);
      text-align: center;
    }
    
    .image-icon {
      margin-bottom: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .image-icon :global(.icon) {
      color: var(--white);
    }
    
    .image-text {
      font-size: 1.125rem;
      font-weight: 600;
      max-width: 200px;
    }
    
    .story-section {
      padding: 4rem 0;
      background: var(--professional-light-gray);
    }
    
    .story-header {
      margin-bottom: 3rem;
    }
    
    .story-header h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    .story-timeline {
      max-width: 800px;
      margin: 0 auto;
      position: relative;
    }
    
    .story-timeline::before {
      content: '';
      position: absolute;
      left: 2rem;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--innovation-green);
    }
    
    .timeline-item {
      position: relative;
      margin-bottom: 3rem;
      padding-left: 6rem;
    }
    
    .timeline-dot {
      position: absolute;
      left: 1rem;
      top: 0.5rem;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: var(--innovation-green);
      border: 4px solid var(--white);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .timeline-date {
      font-size: 0.875rem;
      color: var(--medium-gray);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 0.5rem;
    }
    
    .timeline-content h3 {
      color: var(--security-blue);
      margin-bottom: 1rem;
    }
    
    .team-section {
      padding: 4rem 0;
    }
    
    .section-header {
      margin-bottom: 3rem;
    }
    
    .section-header h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }
    
    .team-member {
      background: var(--white);
      padding: 2rem;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .team-member:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
    }
    
    .member-photo {
      margin-bottom: 1.5rem;
    }
    
    .photo-placeholder {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: var(--innovation-green);
      color: var(--white);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 600;
      margin: 0 auto;
    }
    
    .member-info h3 {
      color: var(--security-blue);
      margin-bottom: 0.5rem;
    }
    
    .member-role {
      font-weight: 600;
      color: var(--innovation-green);
      margin-bottom: 0.25rem;
    }
    
    .member-course {
      font-size: 0.875rem;
      color: var(--medium-gray);
      margin-bottom: 1rem;
    }
    
    .member-info p {
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }
    
    .member-social {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }
    
    .member-social a {
      color: var(--medium-gray);
      transition: color 0.3s ease;
    }
    
    .member-social a:hover {
      color: var(--innovation-green);
    }
    
    .values-section {
      padding: 4rem 0;
      background: var(--professional-light-gray);
    }
    
    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }
    
    .value-card {
      background: var(--white);
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }
    
    .value-icon {
      margin-bottom: 1rem;
      color: var(--security-blue);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .value-icon :global(.icon) {
      color: var(--security-blue);
    }
    
    .value-card h3 {
      color: var(--security-blue);
      margin-bottom: 1rem;
    }
    
    .future-section {
      padding: 4rem 0;
    }
    
    .future-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }
    
    .future-text h2 {
      font-size: 2.5rem;
      margin-bottom: 2rem;
    }
    
    .future-text p {
      font-size: 1.125rem;
      margin-bottom: 2rem;
    }
    
    .future-features {
      list-style: none;
      margin: 2rem 0;
    }
    
    .future-features li {
      padding: 0.75rem 0;
      padding-left: 2rem;
      position: relative;
      font-size: 1.1rem;
    }
    
    .future-features li::before {
      content: '🚀';
      position: absolute;
      left: 0;
      font-size: 1.2rem;
    }
    
    .academic-section {
      padding: 4rem 0;
      background: var(--security-blue);
      color: var(--white);
    }
    
    .academic-content h2 {
      color: var(--white);
      font-size: 2.5rem;
      margin-bottom: 2rem;
    }
    
    .academic-content p {
      font-size: 1.125rem;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 1.5rem;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .academic-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-top: 3rem;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .info-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: rgba(255, 255, 255, 0.1);
      padding: 1.5rem;
      border-radius: 12px;
    }
    
    .info-icon {
      font-size: 2rem;
    }
    
    .info-title {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 0.25rem;
    }
    
    .info-value {
      font-weight: 600;
      color: var(--white);
    }
    
    @media (max-width: 768px) {
      .hero h1,
      .mission-text h2,
      .story-header h2,
      .section-header h2,
      .future-text h2,
      .academic-content h2 {
        font-size: 2rem;
      }
      
      .mission-content,
      .future-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      .mission-stats {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .story-timeline::before {
        left: 1rem;
      }
      
      .timeline-item {
        padding-left: 4rem;
      }
      
      .timeline-dot {
        left: 0rem;
      }
      
      .academic-info {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AboutComponent {
  // Method to get SVG icons in templates
  getIcon(iconName: string, size: number = 24): string {
    return getSvgIcon(iconName, size, 'icon');
  }
  timeline = [
    {
      date: 'Janeiro 2024',
      title: 'A Ideia Nasceu',
      description: 'Durante conversas entre amigos freelancers da FIAP, percebemos a dificuldade comum de gerenciar finanças com renda variável. Decidimos criar uma solução.'
    },
    {
      date: 'Março 2024',
      title: 'Pesquisa e Validação',
      description: 'Entrevistamos mais de 100 freelancers e autônomos para entender suas principais dores financeiras e validar nossa solução.'
    },
    {
      date: 'Junho 2024',
      title: 'Desenvolvimento Iniciado',
      description: 'Começamos o desenvolvimento do MVP com foco na experiência do usuário e nas funcionalidades mais essenciais.'
    },
    {
      date: 'Setembro 2024',
      title: 'Primeira Versão',
      description: 'Lançamos a primeira versão beta para um grupo restrito de usuários, coletando feedback valioso para melhorias.'
    },
    {
      date: 'Janeiro 2025',
      title: 'Lançamento Oficial',
      description: 'Apresentação oficial da VentureFi como projeto de conclusão de curso na FIAP, já com usuários reais utilizando a plataforma.'
    }
  ];

  team = [
    {
      name: 'Rafael de Lima Souza',
      role: 'Fundador & CTO (Chief Technology Officer)',
      course: 'Análise e Desenvolvimento de Sistemas - FIAP',
      bio: 'Responsável pela liderança técnica, desenvolvimento do sistema, arquitetura de software e integração com APIs.',
      initials: 'RS',
      linkedin: '#',
      github: '#'
    },
    {
      name: 'João Pedro Marson',
      role: 'Co-fundador & CIO (Chief Innovation Officer)',
      course: 'Análise e Desenvolvimento de Sistemas - FIAP',
      bio: 'Atua na definição de estratégias inovadoras com foco em automação de processos e validação de soluções com usuários.',
      initials: 'JM',
      linkedin: '#',
      github: '#'
    },
    {
      name: 'Caio Leal Willeman',
      role: 'Chief Infrastructure Officer',
      course: 'Análise e Desenvolvimento de Sistemas - FIAP',
      bio: 'Cuida da infraestrutura em nuvem, desempenho, escalabilidade e segurança da informação da plataforma.',
      initials: 'CW',
      linkedin: '#',
      github: '#'
    },
    {
      name: 'Gabriel Cavalcanti Pereira',
      role: 'Chief Software & Alianças',
      course: 'Análise e Desenvolvimento de Sistemas - FIAP',
      bio: 'Responsável pela evolução do software e pela gestão de parcerias estratégicas com empresas e instituições.',
      initials: 'GP',
      linkedin: '#',
      github: '#'
    }
  ];

  values = [
    {
      iconName: 'rocket',
      title: 'Inovação',
      description: 'Buscamos constantemente novas formas de simplificar a gestão financeira, utilizando tecnologia de ponta para resolver problemas reais.'
    },
    {
      iconName: 'shield',
      title: 'Transparência',
      description: 'Acreditamos em relacionamentos transparentes com nossos usuários, sem taxas ocultas ou promessas irreais.'
    },
    {
      iconName: 'target',
      title: 'Foco no Usuário',
      description: 'Cada decisão é tomada pensando no benefício dos nossos usuários. Eles estão sempre no centro do que fazemos.'
    },
    {
      iconName: 'lock',
      title: 'Segurança',
      description: 'A proteção dos dados financeiros dos nossos usuários é nossa prioridade máxima, utilizando os melhores protocolos de segurança.'
    },
    {
      iconName: 'trendingUp',
      title: 'Crescimento',
      description: 'Apoiamos o crescimento profissional e financeiro dos nossos usuários, oferecendo ferramentas para alcançar seus objetivos.'
    },
    {
      iconName: 'building',
      title: 'Sustentabilidade',
      description: 'Construímos um negócio sustentável que pode crescer junto com nossos usuários, sempre mantendo nossos valores.'
    }
  ];
}