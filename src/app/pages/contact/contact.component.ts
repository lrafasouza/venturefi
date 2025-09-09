import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section class="hero">
      <div class="container">
        <div class="hero-content text-center">
          <h1>Entre em Contato</h1>
          <p class="hero-subtitle">Estamos aqui para ajudar você a transformar sua gestão financeira</p>
        </div>
      </div>
    </section>

    <section class="contact-section">
      <div class="container">
        <div class="contact-content">
          <div class="contact-info">
            <h2>Fale Conosco</h2>
            <p>Tem dúvidas, sugestões ou precisa de ajuda? Nossa equipe está pronta para atender você.</p>
            
            <div class="contact-methods">
              <div class="contact-method">
                <div class="method-icon">📧</div>
                <div class="method-info">
                  <div class="method-title">Email</div>
                  <div class="method-value">contato@venturefi.com.br</div>
                  <div class="method-desc">Respondemos em até 24 horas</div>
                </div>
              </div>
              
              <div class="contact-method">
                <div class="method-icon">💬</div>
                <div class="method-info">
                  <div class="method-title">Chat Online</div>
                  <div class="method-value">Segunda a Sexta, 9h às 18h</div>
                  <div class="method-desc">Suporte em tempo real</div>
                </div>
              </div>
              
              <div class="contact-method">
                <div class="method-icon">📱</div>
                <div class="method-info">
                  <div class="method-title">WhatsApp</div>
                  <div class="method-value">(11) 99999-9999</div>
                  <div class="method-desc">Para clientes Premium</div>
                </div>
              </div>
            </div>
            
            <div class="social-section">
              <h3>Siga-nos nas Redes Sociais</h3>
              <div class="social-links">
                <a href="#" class="social-link">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
                <a href="#" class="social-link">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>GitHub</span>
                </a>
                <a href="#" class="social-link">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span>Twitter</span>
                </a>
              </div>
            </div>
          </div>
          
          <div class="contact-form-container">
            <form class="contact-form" (ngSubmit)="onSubmit()" #contactForm="ngForm">
              <div class="form-header">
                <h3>Envie uma Mensagem</h3>
                <p>Preencha o formulário abaixo e entraremos em contato em breve</p>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="name" class="form-label">Nome completo *</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    class="form-input"
                    [(ngModel)]="formData.name"
                    placeholder="Seu nome completo"
                    required>
                </div>
                
                <div class="form-group">
                  <label for="email" class="form-label">Email *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    class="form-input"
                    [(ngModel)]="formData.email"
                    placeholder="seu@email.com"
                    required>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="phone" class="form-label">Telefone</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone"
                    class="form-input"
                    [(ngModel)]="formData.phone"
                    placeholder="(11) 99999-9999">
                </div>
                
                <div class="form-group">
                  <label for="subject" class="form-label">Assunto *</label>
                  <select 
                    id="subject" 
                    name="subject"
                    class="form-input"
                    [(ngModel)]="formData.subject"
                    required>
                    <option value="">Selecione um assunto</option>
                    <option value="support">Suporte técnico</option>
                    <option value="sales">Informações comerciais</option>
                    <option value="partnership">Parcerias</option>
                    <option value="feedback">Feedback do produto</option>
                    <option value="other">Outros</option>
                  </select>
                </div>
              </div>
              
              <div class="form-group">
                <label for="message" class="form-label">Mensagem *</label>
                <textarea 
                  id="message" 
                  name="message"
                  class="form-input"
                  rows="6"
                  [(ngModel)]="formData.message"
                  placeholder="Conte-nos como podemos ajudar você..."
                  required></textarea>
              </div>
              
              <div class="form-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="newsletter"
                    [(ngModel)]="formData.newsletter">
                  <span class="checkbox-text">Quero receber novidades e dicas financeiras por email</span>
                </label>
              </div>
              
              <div class="form-actions">
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  [disabled]="!contactForm.form.valid || isSubmitting">
                  {{ isSubmitting ? 'Enviando...' : 'Enviar mensagem' }}
                </button>
              </div>
              
              <div class="form-note">
                <p>* Campos obrigatórios</p>
                <p>Seus dados estão protegidos e não serão compartilhados com terceiros.</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    <section class="faq-section">
      <div class="container">
        <div class="section-header text-center">
          <h2>Dúvidas Frequentes</h2>
          <p>Respostas rápidas para as perguntas mais comuns</p>
        </div>
        
        <div class="faq-grid">
          <div class="faq-item" *ngFor="let faq of faqs">
            <h3>{{ faq.question }}</h3>
            <p>{{ faq.answer }}</p>
          </div>
        </div>
        
        <div class="faq-cta text-center">
          <p>Não encontrou o que procura?</p>
          <a href="#contact-form" class="btn btn-outline">Fale conosco</a>
        </div>
      </div>
    </section>

    <!-- Success Modal -->
    <div class="modal-overlay" *ngIf="showSuccessModal" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="success-icon">✅</div>
          <h3>Mensagem Enviada!</h3>
        </div>
        <div class="modal-body">
          <p>Obrigado por entrar em contato conosco, {{ formData.name }}!</p>
          <p>Recebemos sua mensagem e nossa equipe entrará em contato em até 24 horas.</p>
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" (click)="closeModal()">Fechar</button>
        </div>
      </div>
    </div>
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
    
    .contact-section {
      padding: 4rem 0;
    }
    
    .contact-content {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 4rem;
    }
    
    .contact-info h2 {
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
    }
    
    .contact-info > p {
      font-size: 1.125rem;
      margin-bottom: 3rem;
      color: var(--medium-gray);
    }
    
    .contact-methods {
      margin-bottom: 3rem;
    }
    
    .contact-method {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: var(--professional-light-gray);
      border-radius: 12px;
    }
    
    .method-icon {
      font-size: 2.5rem;
      min-width: 50px;
    }
    
    .method-title {
      font-weight: 600;
      color: var(--security-blue);
      margin-bottom: 0.25rem;
    }
    
    .method-value {
      font-weight: 500;
      color: var(--dark-gray);
      margin-bottom: 0.25rem;
    }
    
    .method-desc {
      font-size: 0.875rem;
      color: var(--medium-gray);
    }
    
    .social-section h3 {
      color: var(--security-blue);
      margin-bottom: 1rem;
    }
    
    .social-links {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .social-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: var(--white);
      border: 2px solid var(--light-gray);
      border-radius: 8px;
      text-decoration: none;
      color: var(--security-blue);
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .social-link:hover {
      border-color: var(--innovation-green);
      color: var(--innovation-green);
      transform: translateY(-2px);
    }
    
    .contact-form-container {
      background: var(--white);
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--light-gray);
    }
    
    .form-header {
      margin-bottom: 2rem;
      text-align: center;
    }
    
    .form-header h3 {
      color: var(--security-blue);
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    
    .form-header p {
      color: var(--medium-gray);
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-input,
    .form-input:focus {
      width: 100%;
    }
    
    .form-input[type="tel"],
    .form-input[type="email"] {
      font-family: monospace;
    }
    
    textarea.form-input {
      resize: vertical;
      min-height: 120px;
    }
    
    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      cursor: pointer;
      font-size: 0.9rem;
    }
    
    .checkbox-label input[type="checkbox"] {
      margin-top: 0.25rem;
      accent-color: var(--innovation-green);
    }
    
    .checkbox-text {
      color: var(--medium-gray);
      line-height: 1.4;
    }
    
    .form-actions {
      margin-bottom: 1rem;
    }
    
    .form-actions .btn {
      width: 100%;
      padding: 1rem 2rem;
      font-size: 1.1rem;
    }
    
    .form-actions .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .form-note {
      text-align: center;
      font-size: 0.875rem;
      color: var(--medium-gray);
    }
    
    .form-note p {
      margin: 0.25rem 0;
    }
    
    .faq-section {
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
    
    .faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
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
    
    .faq-cta p {
      font-size: 1.125rem;
      margin-bottom: 1rem;
      color: var(--medium-gray);
    }
    
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .modal-content {
      background: var(--white);
      border-radius: 16px;
      padding: 2rem;
      max-width: 400px;
      width: 90%;
      text-align: center;
    }
    
    .modal-header {
      margin-bottom: 1.5rem;
    }
    
    .success-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .modal-header h3 {
      color: var(--security-blue);
      margin-bottom: 0;
    }
    
    .modal-body {
      margin-bottom: 2rem;
    }
    
    .modal-body p {
      margin-bottom: 1rem;
      color: var(--medium-gray);
    }
    
    @media (max-width: 768px) {
      .hero h1,
      .contact-info h2,
      .section-header h2 {
        font-size: 2rem;
      }
      
      .contact-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .social-links {
        justify-content: center;
      }
      
      .faq-grid {
        grid-template-columns: 1fr;
      }
      
      .modal-content {
        margin: 1rem;
        padding: 1.5rem;
      }
    }
  `]
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    newsletter: false
  };
  
  isSubmitting = false;
  showSuccessModal = false;

  faqs = [
    {
      question: 'Como posso começar a usar a VentureFi?',
      answer: 'É muito simples! Basta se cadastrar gratuitamente em nossa plataforma e começar a usar imediatamente. Não é necessário cartão de crédito para o plano gratuito.'
    },
    {
      question: 'A VentureFi é segura para meus dados financeiros?',
      answer: 'Sim! Utilizamos criptografia bancária AES-256 e seguimos os mais rigorosos protocolos de segurança. Seus dados são protegidos e nunca compartilhados com terceiros.'
    },
    {
      question: 'Posso usar a VentureFi no meu celular?',
      answer: 'Sim! Nossa plataforma é responsiva e funciona perfeitamente em celulares, tablets e computadores. Também estamos desenvolvendo aplicativos nativos.'
    },
    {
      question: 'Qual a diferença entre o plano Free e Premium?',
      answer: 'O plano Free oferece funcionalidades básicas como dashboard e 1 meta. O Premium inclui múltiplas metas, relatórios avançados, suporte prioritário e muito mais.'
    },
    {
      question: 'Vocês oferecem suporte técnico?',
      answer: 'Sim! Oferecemos suporte por email para todos os usuários. Clientes Premium têm acesso a suporte prioritário via WhatsApp e chat online.'
    },
    {
      question: 'Como funciona a funcionalidade "Em Busca do Sonho"?',
      answer: 'É nossa ferramenta exclusiva para criação e acompanhamento de metas financeiras. Você define seu objetivo, prazo e recebe sugestões personalizadas para alcançá-lo.'
    }
  ];

  onSubmit() {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    // Simular envio do formulário
    setTimeout(() => {
      this.isSubmitting = false;
      this.showSuccessModal = true;
      this.resetForm();
    }, 2000);
  }
  
  resetForm() {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      newsletter: false
    };
  }
  
  closeModal() {
    this.showSuccessModal = false;
  }
}