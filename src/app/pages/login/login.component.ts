import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <h1>VentureFi</h1>
          </div>
          <h2>Bem-vindo de volta</h2>
          <p>Entre em sua conta para continuar</p>
        </div>
        
        <div class="security-indicators">
          <div class="security-item">
            <span class="security-icon">🔒</span>
            <span class="security-text">Conexão segura</span>
          </div>
          <div class="security-item">
            <span class="security-icon">🛡️</span>
            <span class="security-text">Dados protegidos</span>
          </div>
        </div>
        
        <form class="login-form" (ngSubmit)="onLogin()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              class="form-input"
              [(ngModel)]="loginData.email"
              placeholder="seu@email.com"
              required>
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Senha</label>
            <div class="password-input">
              <input 
                [type]="showPassword ? 'text' : 'password'"
                id="password" 
                name="password"
                class="form-input"
                [(ngModel)]="loginData.password"
                placeholder="Sua senha"
                required>
              <button 
                type="button" 
                class="password-toggle"
                (click)="togglePassword()"
                aria-label="Mostrar/ocultar senha">
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>
          
          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="loginData.rememberMe" name="rememberMe">
              <span class="checkbox-text">Lembrar de mim</span>
            </label>
            <a href="#" class="forgot-link">Esqueci minha senha</a>
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary login-btn"
            [disabled]="!loginForm.form.valid || isLoading">
            {{ isLoading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
        
        <div class="divider">
          <span>ou</span>
        </div>
        
        <div class="social-login">
          <button class="btn btn-outline social-btn" (click)="loginWithGoogle()">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar com Google
          </button>
        </div>
        
        <div class="login-footer">
          <p>Não tem uma conta? 
            <a routerLink="/contact" class="signup-link">Criar conta</a>
          </p>
          <p class="terms-text">
            Ao entrar, você concorda com nossos 
            <a href="#">Termos de Uso</a> e 
            <a href="#">Política de Privacidade</a>
          </p>
        </div>
      </div>
      
      <div class="login-info">
        <div class="info-content">
          <h3>Gerencie suas finanças com segurança</h3>
          <ul class="feature-list">
            <li>
              <span class="feature-icon">📊</span>
              <span>Dashboard completo e intuitivo</span>
            </li>
            <li>
              <span class="feature-icon">🎯</span>
              <span>Metas financeiras personalizadas</span>
            </li>
            <li>
              <span class="feature-icon">🔔</span>
              <span>Notificações inteligentes</span>
            </li>
            <li>
              <span class="feature-icon">🔒</span>
              <span>Máxima segurança dos seus dados</span>
            </li>
          </ul>
          
          <div class="testimonial">
            <p>"A VentureFi transformou como eu controlo minhas finanças como freelancer. Recomendo!"</p>
            <div class="testimonial-author">
              <div class="author-avatar">AS</div>
              <div class="author-info">
                <div class="author-name">Ana Silva</div>
                <div class="author-role">Designer Freelancer</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
      background: var(--professional-light-gray);
    }
    
    .login-card {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 3rem;
      background: var(--white);
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .logo h1 {
      color: var(--security-blue);
      font-size: 2rem;
      margin-bottom: 2rem;
    }
    
    .login-header h2 {
      color: var(--security-blue);
      font-size: 1.75rem;
      margin-bottom: 0.5rem;
    }
    
    .login-header p {
      color: var(--medium-gray);
      font-size: 1rem;
    }
    
    .security-indicators {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 2rem;
      padding: 1rem;
      background: rgba(46, 204, 113, 0.05);
      border-radius: 8px;
      border: 1px solid rgba(46, 204, 113, 0.2);
    }
    
    .security-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--innovation-green);
      font-weight: 500;
    }
    
    .security-icon {
      font-size: 1rem;
    }
    
    .login-form {
      margin-bottom: 2rem;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .password-input {
      position: relative;
    }
    
    .password-toggle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      color: var(--medium-gray);
      transition: color 0.3s ease;
    }
    
    .password-toggle:hover {
      color: var(--security-blue);
    }
    
    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.875rem;
    }
    
    .checkbox-label input[type="checkbox"] {
      accent-color: var(--innovation-green);
    }
    
    .checkbox-text {
      color: var(--medium-gray);
    }
    
    .forgot-link {
      color: var(--innovation-green);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: color 0.3s ease;
    }
    
    .forgot-link:hover {
      color: var(--security-blue);
    }
    
    .login-btn {
      width: 100%;
      padding: 1rem;
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
    }
    
    .login-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .divider {
      text-align: center;
      margin: 1.5rem 0;
      position: relative;
    }
    
    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--light-gray);
    }
    
    .divider span {
      background: var(--white);
      padding: 0 1rem;
      color: var(--medium-gray);
      font-size: 0.875rem;
    }
    
    .social-login {
      margin-bottom: 2rem;
    }
    
    .social-btn {
      width: 100%;
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      font-size: 1rem;
    }
    
    .login-footer {
      text-align: center;
    }
    
    .login-footer p {
      margin-bottom: 1rem;
      font-size: 0.875rem;
      color: var(--medium-gray);
    }
    
    .signup-link,
    .terms-text a {
      color: var(--innovation-green);
      text-decoration: none;
      font-weight: 500;
    }
    
    .signup-link:hover,
    .terms-text a:hover {
      color: var(--security-blue);
    }
    
    .terms-text {
      font-size: 0.75rem !important;
      line-height: 1.4;
    }
    
    .login-info {
      background: linear-gradient(135deg, var(--security-blue) 0%, #2c5aa0 100%);
      color: var(--white);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem;
    }
    
    .info-content {
      max-width: 400px;
    }
    
    .info-content h3 {
      color: var(--white);
      font-size: 2rem;
      margin-bottom: 2rem;
      line-height: 1.2;
    }
    
    .feature-list {
      list-style: none;
      margin-bottom: 3rem;
    }
    
    .feature-list li {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
      font-size: 1rem;
    }
    
    .feature-icon {
      font-size: 1.5rem;
    }
    
    .testimonial {
      background: rgba(255, 255, 255, 0.1);
      padding: 1.5rem;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .testimonial p {
      font-style: italic;
      margin-bottom: 1rem;
      color: rgba(255, 255, 255, 0.9);
    }
    
    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .author-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--innovation-green);
      color: var(--white);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
    }
    
    .author-name {
      font-weight: 600;
      color: var(--white);
      font-size: 0.875rem;
    }
    
    .author-role {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.8);
    }
    
    @media (max-width: 768px) {
      .login-container {
        grid-template-columns: 1fr;
      }
      
      .login-info {
        order: -1;
        min-height: 300px;
      }
      
      .login-card {
        padding: 2rem 1.5rem;
      }
      
      .info-content h3 {
        font-size: 1.5rem;
      }
      
      .feature-list {
        margin-bottom: 2rem;
      }
      
      .security-indicators {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      
      .form-options {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }
    }
  `]
})
export class LoginComponent {
  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };
  
  showPassword = false;
  isLoading = false;

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    
    // Simular login
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/dashboard']);
    }, 2000);
  }

  loginWithGoogle() {
    // Simular login com Google
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 1000);
  }
}