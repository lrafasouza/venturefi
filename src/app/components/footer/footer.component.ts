import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>VentureFi</h3>
            <p>Transforme sua relação com o dinheiro. Gestão financeira inteligente para autônomos e freelancers.</p>
            <div class="social-links">
              <a href="#" aria-label="LinkedIn" class="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" aria-label="GitHub" class="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div class="footer-section">
            <h4>Produto</h4>
            <ul>
              <li><a routerLink="/features">Features</a></li>
              <li><a routerLink="/pricing">Pricing</a></li>
              <li><a routerLink="/dashboard">Dashboard</a></li>
              <li><a href="#">API (Em breve)</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>Empresa</h4>
            <ul>
              <li><a routerLink="/about">Sobre nós</a></li>
              <li><a routerLink="/contact">Contato</a></li>
              <li><a href="#">Blog (Em breve)</a></li>
              <li><a href="#">Carreiras (Em breve)</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>Suporte</h4>
            <ul>
              <li><a href="#">Central de Ajuda</a></li>
              <li><a href="#">Documentação</a></li>
              <li><a href="#">Status do Sistema</a></li>
              <li><a routerLink="/contact">Fale Conosco</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="footer-bottom-content">
            <p>&copy; 2025 VentureFi. Projeto acadêmico FIAP. Todos os direitos reservados.</p>
            <div class="footer-links">
              <a href="#">Política de Privacidade</a>
              <a href="#">Termos de Uso</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--security-blue);
      color: var(--white);
      margin-top: auto;
    }
    
    .footer-content {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 2rem;
      padding: 3rem 0 2rem;
    }
    
    .footer-section h3 {
      color: var(--white);
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }
    
    .footer-section h4 {
      color: var(--white);
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }
    
    .footer-section p {
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    
    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .footer-section ul li {
      margin-bottom: 0.5rem;
    }
    
    .footer-section ul li a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: color 0.3s ease;
    }
    
    .footer-section ul li a:hover {
      color: var(--innovation-green);
    }
    
    .social-links {
      display: flex;
      gap: 1rem;
    }
    
    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      color: var(--white);
      text-decoration: none;
      transition: all 0.3s ease;
    }
    
    .social-link:hover {
      background-color: var(--innovation-green);
      transform: translateY(-2px);
    }
    
    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding: 1.5rem 0;
    }
    
    .footer-bottom-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .footer-bottom p {
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
    }
    
    .footer-links {
      display: flex;
      gap: 1.5rem;
    }
    
    .footer-links a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.3s ease;
    }
    
    .footer-links a:hover {
      color: var(--innovation-green);
    }
    
    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: 2rem;
        text-align: center;
      }
      
      .footer-bottom-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      
      .footer-links {
        justify-content: center;
      }
    }
  `]
})
export class FooterComponent {}