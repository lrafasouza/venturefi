import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  type: 'welcome' | 'profile' | 'goals' | 'features' | 'complete';
  completed: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  profession: string;
  monthlyIncome: number;
  hasVariableIncome: boolean;
  mainGoal: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
}

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="onboarding-container">
      <!-- Progress Header -->
      <header class="onboarding-header">
        <div class="header-content">
          <div class="logo-section">
            <div class="logo">
              <span class="logo-text">VentureFi</span>
              <span class="logo-badge">Beta</span>
            </div>
            <span class="tagline">Sua jornada financeira começa aqui</span>
          </div>
          
          <div class="progress-section">
            <div class="progress-bar">
              <div class="progress-fill" [style.width]="getProgressPercentage() + '%'"></div>
            </div>
            <span class="progress-text">{{ currentStep + 1 }} de {{ steps.length }}</span>
          </div>
        </div>
      </header>

      <!-- Step Content -->
      <main class="onboarding-content">
        <div class="step-container" [ngSwitch]="getCurrentStep().type">
          
          <!-- Welcome Step -->
          <div *ngSwitchCase="'welcome'" class="step welcome-step animate-fade-in">
            <div class="step-visual">
              <div class="welcome-illustration">
                <div class="floating-card card-1">
                  <app-icon name="chart-bar" size="24" className="text-success"></app-icon>
                  <span>Análises</span>
                </div>
                <div class="floating-card card-2">
                  <app-icon name="target" size="24" className="text-primary"></app-icon>
                  <span>Metas</span>
                </div>
                <div class="floating-card card-3">
                  <app-icon name="banknotes" size="24" className="text-warning"></app-icon>
                  <span>Controle</span>
                </div>
                <div class="central-logo">
                  <app-icon name="sparkles" size="48" className="text-primary"></app-icon>
                </div>
              </div>
            </div>
            
            <div class="step-content">
              <h1>Bem-vindo ao VentureFi!</h1>
              <p class="lead">A plataforma financeira pensada especialmente para <strong>freelancers</strong> e <strong>trabalhadores autônomos</strong>.</p>
              
              <div class="features-preview">
                <div class="feature-item">
                  <app-icon name="chart-pie" size="20" className="text-primary"></app-icon>
                  <span>Controle total das suas finanças</span>
                </div>
                <div class="feature-item">
                  <app-icon name="target" size="20" className="text-success"></app-icon>
                  <span>Metas e objetivos personalizados</span>
                </div>
                <div class="feature-item">
                  <app-icon name="credit-card" size="20" className="text-warning"></app-icon>
                  <span>Integração com seus bancos</span>
                </div>
                <div class="feature-item">
                  <app-icon name="light-bulb" size="20" className="text-purple"></app-icon>
                  <span>Insights inteligentes sobre gastos</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Setup Step -->
          <div *ngSwitchCase="'profile'" class="step profile-step animate-fade-in">
            <div class="step-content">
              <div class="step-header">
                <h2>Conte-nos sobre você</h2>
                <p>Essas informações nos ajudam a personalizar sua experiência</p>
              </div>

              <form class="profile-form">
                <div class="form-row">
                  <div class="form-group">
                    <label for="name">Qual seu nome?</label>
                    <input 
                      type="text" 
                      id="name"
                      class="form-input"
                      [(ngModel)]="userProfile.name"
                      name="name"
                      placeholder="Digite seu nome completo"
                      required>
                  </div>
                  
                  <div class="form-group">
                    <label for="email">E-mail</label>
                    <input 
                      type="email" 
                      id="email"
                      class="form-input"
                      [(ngModel)]="userProfile.email"
                      name="email"
                      placeholder="seu@email.com"
                      required>
                  </div>
                </div>

                <div class="form-group">
                  <label for="profession">Qual sua área de atuação?</label>
                  <select 
                    id="profession"
                    class="form-select"
                    [(ngModel)]="userProfile.profession"
                    name="profession"
                    required>
                    <option value="">Selecione sua área</option>
                    <option value="developer">Desenvolvedor/Programador</option>
                    <option value="designer">Designer/UX-UI</option>
                    <option value="marketing">Marketing Digital</option>
                    <option value="consultant">Consultor</option>
                    <option value="writer">Redator/Copywriter</option>
                    <option value="photographer">Fotógrafo/Videomaker</option>
                    <option value="teacher">Professor/Instrutor</option>
                    <option value="other">Outros</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="income">Renda mensal aproximada</label>
                  <select 
                    id="income"
                    class="form-select"
                    [(ngModel)]="userProfile.monthlyIncome"
                    name="income"
                    required>
                    <option value="">Selecione uma faixa</option>
                    <option value="2000">Até R$ 2.000</option>
                    <option value="5000">R$ 2.000 - R$ 5.000</option>
                    <option value="10000">R$ 5.000 - R$ 10.000</option>
                    <option value="20000">R$ 10.000 - R$ 20.000</option>
                    <option value="20001">Acima de R$ 20.000</option>
                  </select>
                </div>

                <div class="form-group checkbox-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="userProfile.hasVariableIncome"
                      name="hasVariableIncome">
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-text">Minha renda varia mensalmente</span>
                  </label>
                  <small class="form-hint">Isso nos ajuda a criar análises mais precisas</small>
                </div>

                <div class="experience-selector">
                  <label>Qual seu nível de experiência com controle financeiro?</label>
                  <div class="experience-options">
                    <button 
                      type="button"
                      class="experience-option"
                      [class.active]="userProfile.experienceLevel === 'beginner'"
                      (click)="setExperienceLevel('beginner')">
                      <app-icon name="academic-cap" size="24"></app-icon>
                      <span class="option-title">Iniciante</span>
                      <span class="option-desc">Começando agora</span>
                    </button>
                    
                    <button 
                      type="button"
                      class="experience-option"
                      [class.active]="userProfile.experienceLevel === 'intermediate'"
                      (click)="setExperienceLevel('intermediate')">
                      <app-icon name="chart-bar" size="24"></app-icon>
                      <span class="option-title">Intermediário</span>
                      <span class="option-desc">Já controlo algumas coisas</span>
                    </button>
                    
                    <button 
                      type="button"
                      class="experience-option"
                      [class.active]="userProfile.experienceLevel === 'advanced'"
                      (click)="setExperienceLevel('advanced')">
                      <app-icon name="trophy" size="24"></app-icon>
                      <span class="option-title">Avançado</span>
                      <span class="option-desc">Experiente em finanças</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- Goals Step -->
          <div *ngSwitchCase="'goals'" class="step goals-step animate-fade-in">
            <div class="step-content">
              <div class="step-header">
                <h2>Qual seu principal objetivo?</h2>
                <p>Vamos personalizar sua experiência baseada no que mais importa para você</p>
              </div>

              <div class="goals-grid">
                <button 
                  type="button"
                  class="goal-card"
                  [class.active]="userProfile.mainGoal === 'organize'"
                  (click)="setMainGoal('organize')">
                  <div class="goal-icon">
                    <app-icon name="clipboard-document-list" size="32" className="text-primary"></app-icon>
                  </div>
                  <h3>Organizar Finanças</h3>
                  <p>Ter controle total sobre receitas e despesas</p>
                </button>

                <button 
                  type="button"
                  class="goal-card"
                  [class.active]="userProfile.mainGoal === 'save'"
                  (click)="setMainGoal('save')">
                  <div class="goal-icon">
                    <app-icon name="banknotes" size="32" className="text-success"></app-icon>
                  </div>
                  <h3>Economizar Dinheiro</h3>
                  <p>Criar uma reserva de emergência e poupar</p>
                </button>

                <button 
                  type="button"
                  class="goal-card"
                  [class.active]="userProfile.mainGoal === 'invest'"
                  (click)="setMainGoal('invest')">
                  <div class="goal-icon">
                    <app-icon name="chart-bar" size="32" className="text-warning"></app-icon>
                  </div>
                  <h3>Investir e Crescer</h3>
                  <p>Fazer o dinheiro trabalhar para mim</p>
                </button>

                <button 
                  type="button"
                  class="goal-card"
                  [class.active]="userProfile.mainGoal === 'dream'"
                  (click)="setMainGoal('dream')">
                  <div class="goal-icon">
                    <app-icon name="star" size="32" className="text-purple"></app-icon>
                  </div>
                  <h3>Realizar Sonhos</h3>
                  <p>Planejar e conquistar objetivos específicos</p>
                </button>

                <button 
                  type="button"
                  class="goal-card"
                  [class.active]="userProfile.mainGoal === 'business'"
                  (click)="setMainGoal('business')">
                  <div class="goal-icon">
                    <app-icon name="building-office" size="32" className="text-blue"></app-icon>
                  </div>
                  <h3>Expandir Negócio</h3>
                  <p>Crescer profissionalmente e aumentar renda</p>
                </button>

                <button 
                  type="button"
                  class="goal-card"
                  [class.active]="userProfile.mainGoal === 'freedom'"
                  (click)="setMainGoal('freedom')">
                  <div class="goal-icon">
                    <app-icon name="paper-airplane" size="32" className="text-green"></app-icon>
                  </div>
                  <h3>Independência</h3>
                  <p>Conquistar liberdade financeira</p>
                </button>
              </div>
            </div>
          </div>

          <!-- Features Tour Step -->
          <div *ngSwitchCase="'features'" class="step features-step animate-fade-in">
            <div class="step-content">
              <div class="step-header">
                <h2>Descubra suas ferramentas</h2>
                <p>Conheça as principais funcionalidades que vão transformar sua gestão financeira</p>
              </div>

              <div class="features-showcase">
                <div class="feature-card" *ngFor="let feature of featuresShowcase">
                  <div class="feature-visual">
                    <div class="feature-mockup" [ngClass]="feature.mockupClass">
                      <app-icon [name]="feature.icon" size="24"></app-icon>
                    </div>
                  </div>
                  <div class="feature-info">
                    <h3>{{ feature.title }}</h3>
                    <p>{{ feature.description }}</p>
                    <div class="feature-benefits">
                      <span *ngFor="let benefit of feature.benefits" class="benefit-tag">
                        {{ benefit }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Complete Step -->
          <div *ngSwitchCase="'complete'" class="step complete-step animate-fade-in">
            <div class="step-content">
              <div class="completion-visual">
                <div class="success-animation">
                  <div class="success-circle">
                    <app-icon name="check" size="48" className="text-success"></app-icon>
                  </div>
                  <div class="confetti"></div>
                </div>
              </div>

              <div class="completion-content">
                <h1>Tudo pronto, {{ userProfile.name }}!</h1>
                <p class="lead">Sua conta foi configurada com sucesso. Agora você pode começar a transformar sua gestão financeira.</p>

                <div class="next-steps">
                  <h3>Próximos passos recomendados:</h3>
                  <div class="steps-list">
                    <div class="next-step-item">
                      <div class="step-number">1</div>
                      <div class="step-info">
                        <h4>Conecte seus bancos</h4>
                        <p>Importe suas transações automaticamente</p>
                      </div>
                    </div>
                    <div class="next-step-item">
                      <div class="step-number">2</div>
                      <div class="step-info">
                        <h4>Defina suas primeiras metas</h4>
                        <p>Comece com objetivos pequenos e alcançáveis</p>
                      </div>
                    </div>
                    <div class="next-step-item">
                      <div class="step-number">3</div>
                      <div class="step-info">
                        <h4>Explore o dashboard</h4>
                        <p>Descubra insights sobre seus hábitos financeiros</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="personalized-tips" *ngIf="getPersonalizedTips().length > 0">
                  <h3>Dicas personalizadas para você:</h3>
                  <div class="tips-grid">
                    <div class="tip-card" *ngFor="let tip of getPersonalizedTips()">
                      <app-icon [name]="tip.icon" size="20" [className]="tip.iconClass"></app-icon>
                      <span>{{ tip.text }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Navigation Footer -->
      <footer class="onboarding-footer">
        <div class="footer-content">
          <button 
            class="btn btn-ghost"
            [disabled]="currentStep === 0"
            (click)="previousStep()"
            *ngIf="currentStep > 0">
            <app-icon name="arrow-left" size="16"></app-icon>
            <span>Voltar</span>
          </button>
          
          <div class="step-indicators">
            <div 
              class="step-dot"
              *ngFor="let step of steps; let i = index"
              [class.active]="i === currentStep"
              [class.completed]="i < currentStep">
            </div>
          </div>
          
          <button 
            class="btn"
            [class]="getCurrentStep().type === 'complete' ? 'btn-success' : 'btn-primary'"
            [disabled]="!canProceed()"
            (click)="nextStep()">
            <span>{{ getNextButtonText() }}</span>
            <app-icon 
              [name]="getCurrentStep().type === 'complete' ? 'rocket-launch' : 'arrow-right'" 
              size="16">
            </app-icon>
          </button>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .onboarding-container {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
      display: flex;
      flex-direction: column;
    }

    .onboarding-header {
      background: var(--bg-primary);
      border-bottom: 1px solid var(--border-primary);
      padding: var(--space-6) var(--space-8);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: var(--shadow-sm);
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .logo-badge {
      background: var(--accent-blue);
      color: var(--text-inverse);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .tagline {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .progress-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      align-items: flex-end;
    }

    .progress-bar {
      width: 200px;
      height: 8px;
      background: var(--bg-tertiary);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-blue), var(--accent-green));
      border-radius: var(--radius-full);
      transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .progress-text {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .onboarding-content {
      flex: 1;
      padding: var(--space-8);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .step-container {
      max-width: 900px;
      width: 100%;
    }

    .step {
      background: var(--bg-primary);
      border-radius: var(--radius-2xl);
      padding: var(--space-8);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-primary);
    }

    .welcome-step {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-8);
      align-items: center;
    }

    .step-visual {
      position: relative;
    }

    .welcome-illustration {
      position: relative;
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .floating-card {
      position: absolute;
      background: var(--bg-primary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-xl);
      padding: var(--space-4);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      box-shadow: var(--shadow-md);
      animation: float 3s ease-in-out infinite;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .card-1 {
      top: 20px;
      left: 20px;
      animation-delay: 0s;
    }

    .card-2 {
      top: 50px;
      right: 30px;
      animation-delay: 1s;
    }

    .card-3 {
      bottom: 40px;
      left: 40px;
      animation-delay: 2s;
    }

    .central-logo {
      background: linear-gradient(135deg, var(--accent-blue), var(--accent-green));
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-inverse);
      box-shadow: var(--shadow-lg);
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(2deg); }
    }

    .step-content h1 {
      font-size: 2.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: var(--space-4);
    }

    .lead {
      font-size: 1.125rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: var(--space-6);
    }

    .features-preview {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3);
      background: var(--bg-secondary);
      border-radius: var(--radius-lg);
      font-weight: 500;
    }

    .step-header {
      text-align: center;
      margin-bottom: var(--space-8);
    }

    .step-header h2 {
      font-size: 1.875rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--space-2);
    }

    .step-header p {
      font-size: 1rem;
      color: var(--text-secondary);
      margin: 0;
    }

    .profile-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .form-group label {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.875rem;
    }

    .form-input, .form-select {
      padding: var(--space-3) var(--space-4);
      border: 2px solid var(--border-primary);
      border-radius: var(--radius-lg);
      font-size: 1rem;
      transition: all 0.2s ease;
      background: var(--bg-primary);
    }

    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px var(--accent-blue-light);
    }

    .checkbox-group {
      flex-direction: row;
      align-items: center;
      gap: var(--space-3);
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      cursor: pointer;
      font-weight: 500;
    }

    .checkbox-label input[type="checkbox"] {
      display: none;
    }

    .checkbox-custom {
      width: 20px;
      height: 20px;
      border: 2px solid var(--border-secondary);
      border-radius: var(--radius-sm);
      position: relative;
      transition: all 0.2s ease;
    }

    .checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
      background: var(--accent-blue);
      border-color: var(--accent-blue);
    }

    .checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--text-inverse);
      font-size: 0.75rem;
      font-weight: 700;
    }

    .form-hint {
      color: var(--text-tertiary);
      font-size: 0.75rem;
      margin-top: var(--space-1);
    }

    .experience-selector {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .experience-selector label {
      font-weight: 600;
      color: var(--text-primary);
    }

    .experience-options {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-4);
    }

    .experience-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-6);
      background: var(--bg-secondary);
      border: 2px solid var(--border-primary);
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
    }

    .experience-option:hover {
      border-color: var(--accent-blue);
      background: var(--accent-blue-light);
    }

    .experience-option.active {
      border-color: var(--accent-blue);
      background: var(--accent-blue-light);
      color: var(--accent-blue);
    }

    .option-title {
      font-weight: 600;
      font-size: 1rem;
    }

    .option-desc {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .goals-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-4);
    }

    .goal-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-6);
      background: var(--bg-secondary);
      border: 2px solid var(--border-primary);
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
    }

    .goal-card:hover {
      border-color: var(--accent-blue);
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    .goal-card.active {
      border-color: var(--accent-blue);
      background: var(--accent-blue-light);
      color: var(--accent-blue);
    }

    .goal-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      margin-bottom: var(--space-2);
    }

    .goal-card h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
    }

    .goal-card p {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.4;
    }

    .features-showcase {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .feature-card {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: var(--space-6);
      padding: var(--space-6);
      background: var(--bg-secondary);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-primary);
    }

    .feature-visual {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .feature-mockup {
      width: 120px;
      height: 120px;
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-inverse);
    }

    .feature-mockup.dashboard {
      background: linear-gradient(135deg, var(--accent-blue), var(--accent-green));
    }

    .feature-mockup.goals {
      background: linear-gradient(135deg, var(--accent-green), var(--accent-orange));
    }

    .feature-mockup.insights {
      background: linear-gradient(135deg, var(--accent-purple), var(--accent-blue));
    }

    .feature-mockup.integration {
      background: linear-gradient(135deg, var(--accent-orange), var(--accent-red));
    }

    .feature-info h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--space-2);
    }

    .feature-info p {
      color: var(--text-secondary);
      margin-bottom: var(--space-4);
      line-height: 1.5;
    }

    .feature-benefits {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .benefit-tag {
      background: var(--accent-blue-light);
      color: var(--accent-blue);
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 500;
    }

    .completion-visual {
      text-align: center;
      margin-bottom: var(--space-8);
    }

    .success-animation {
      position: relative;
      display: inline-block;
    }

    .success-circle {
      width: 120px;
      height: 120px;
      background: linear-gradient(135deg, var(--accent-green), var(--accent-blue));
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: bounce 1s ease-out;
    }

    .completion-content {
      text-align: center;
    }

    .completion-content h1 {
      font-size: 2.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: var(--space-4);
    }

    .next-steps {
      margin: var(--space-8) 0;
      text-align: left;
    }

    .next-steps h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--space-4);
      text-align: center;
    }

    .steps-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .next-step-item {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-4);
      background: var(--bg-secondary);
      border-radius: var(--radius-lg);
    }

    .step-number {
      width: 32px;
      height: 32px;
      background: var(--accent-blue);
      color: var(--text-inverse);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      flex-shrink: 0;
    }

    .step-info h4 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 var(--space-1) 0;
    }

    .step-info p {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin: 0;
    }

    .personalized-tips {
      margin-top: var(--space-8);
    }

    .personalized-tips h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--space-4);
    }

    .tips-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-3);
    }

    .tip-card {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3);
      background: var(--bg-secondary);
      border-radius: var(--radius-lg);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .onboarding-footer {
      background: var(--bg-primary);
      border-top: 1px solid var(--border-primary);
      padding: var(--space-6) var(--space-8);
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .step-indicators {
      display: flex;
      gap: var(--space-2);
    }

    .step-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--border-secondary);
      transition: all 0.2s ease;
    }

    .step-dot.active {
      background: var(--accent-blue);
      transform: scale(1.2);
    }

    .step-dot.completed {
      background: var(--accent-green);
    }

    @media (max-width: 1024px) {
      .welcome-step {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .experience-options {
        grid-template-columns: 1fr;
      }

      .goals-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .feature-card {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .tips-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .header-content {
        flex-direction: column;
        gap: var(--space-4);
      }

      .progress-section {
        align-items: center;
      }

      .onboarding-content {
        padding: var(--space-4);
      }

      .step {
        padding: var(--space-6);
      }

      .goals-grid {
        grid-template-columns: 1fr;
      }

      .footer-content {
        flex-direction: column;
        gap: var(--space-4);
      }
    }
  `]
})
export class OnboardingComponent implements OnInit {
  currentStep = 0;
  
  steps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Bem-vindo',
      subtitle: 'Conhecendo o VentureFi',
      description: 'Apresentação da plataforma',
      icon: 'sparkles',
      type: 'welcome',
      completed: false
    },
    {
      id: 2,
      title: 'Perfil',
      subtitle: 'Conte sobre você',
      description: 'Configuração do perfil',
      icon: 'user',
      type: 'profile',
      completed: false
    },
    {
      id: 3,
      title: 'Objetivos',
      subtitle: 'Seus objetivos',
      description: 'Definição de metas',
      icon: 'target',
      type: 'goals',
      completed: false
    },
    {
      id: 4,
      title: 'Recursos',
      subtitle: 'Suas ferramentas',
      description: 'Tour das funcionalidades',
      icon: 'cog-6-tooth',
      type: 'features',
      completed: false
    },
    {
      id: 5,
      title: 'Pronto!',
      subtitle: 'Configuração completa',
      description: 'Finalizando o setup',
      icon: 'check-circle',
      type: 'complete',
      completed: false
    }
  ];

  userProfile: UserProfile = {
    name: 'Rafael Silva',
    email: 'rafael@exemplo.com',
    profession: 'Desenvolvedor Freelancer',
    monthlyIncome: 8000,
    hasVariableIncome: true,
    mainGoal: 'organize',
    experienceLevel: 'intermediate'
  };

  featuresShowcase = [
    {
      title: 'Dashboard Inteligente',
      description: 'Visualize todas suas finanças em tempo real com gráficos interativos e KPIs personalizados.',
      icon: 'chart-bar',
      mockupClass: 'dashboard',
      benefits: ['Visão 360°', 'Tempo Real', 'Personalizável']
    },
    {
      title: 'Metas e Objetivos',
      description: 'Defina e acompanhe suas metas financeiras com progresso visual e lembretes inteligentes.',
      icon: 'target',
      mockupClass: 'goals',
      benefits: ['Progresso Visual', 'Lembretes', 'Motivação']
    },
    {
      title: 'Insights Financeiros',
      description: 'Receba análises automáticas sobre seus hábitos e sugestões para otimizar suas finanças.',
      icon: 'light-bulb',
      mockupClass: 'insights',
      benefits: ['IA Integrada', 'Sugestões', 'Análises']
    },
    {
      title: 'Open Finance',
      description: 'Conecte suas contas bancárias e cartões para importação automática de transações.',
      icon: 'credit-card',
      mockupClass: 'integration',
      benefits: ['Seguro', 'Automático', 'Sincronizado']
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Always show onboarding - no automatic skipping
  }

  getCurrentStep(): OnboardingStep {
    return this.steps[this.currentStep];
  }

  getProgressPercentage(): number {
    return ((this.currentStep + 1) / this.steps.length) * 100;
  }

  canProceed(): boolean {
    switch (this.getCurrentStep().type) {
      case 'welcome':
        return true;
      case 'profile':
        return this.userProfile.name.length >= 2 && 
               this.userProfile.email.includes('@') && 
               this.userProfile.profession.length > 0 &&
               this.userProfile.monthlyIncome > 0 &&
               this.userProfile.experienceLevel.length > 0;
      case 'goals':
        return this.userProfile.mainGoal.length > 0;
      case 'features':
        return true;
      case 'complete':
        return true;
      default:
        return false;
    }
  }

  getNextButtonText(): string {
    switch (this.getCurrentStep().type) {
      case 'welcome':
        return 'Vamos começar';
      case 'complete':
        return 'Acessar VentureFi';
      default:
        return 'Continuar';
    }
  }

  nextStep(): void {
    if (!this.canProceed()) return;

    if (this.currentStep < this.steps.length - 1) {
      this.steps[this.currentStep].completed = true;
      this.currentStep++;
    } else {
      this.completeOnboarding();
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  setExperienceLevel(level: 'beginner' | 'intermediate' | 'advanced'): void {
    this.userProfile.experienceLevel = level;
  }

  setMainGoal(goal: string): void {
    this.userProfile.mainGoal = goal;
  }

  getPersonalizedTips(): Array<{icon: string, iconClass: string, text: string}> {
    const tips = [];
    
    if (this.userProfile.experienceLevel === 'beginner') {
      tips.push({
        icon: 'academic-cap',
        iconClass: 'text-blue',
        text: 'Comece devagar: foque em categorizar suas despesas'
      });
    }

    if (this.userProfile.hasVariableIncome) {
      tips.push({
        icon: 'chart-bar',
        iconClass: 'text-warning',
        text: 'Crie uma reserva para meses de menor renda'
      });
    }

    if (this.userProfile.mainGoal === 'save') {
      tips.push({
        icon: 'banknotes',
        iconClass: 'text-success',
        text: 'Configure transferências automáticas para poupança'
      });
    }

    if (this.userProfile.profession === 'developer') {
      tips.push({
        icon: 'code-bracket',
        iconClass: 'text-purple',
        text: 'Considere investir em cursos e certificações'
      });
    }

    return tips;
  }

  completeOnboarding(): void {
    // Save user profile
    localStorage.setItem('venturefi_user_profile', JSON.stringify(this.userProfile));
    localStorage.setItem('venturefi_onboarding_completed', 'true');

    // Navigate to dashboard
    this.router.navigate(['/platform/dashboard']);
  }
}