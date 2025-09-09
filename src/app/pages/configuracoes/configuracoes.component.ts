import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { InputComponent } from '../../shared/components/form/input.component';
import { SelectComponent } from '../../shared/components/form/select.component';
import { TextareaComponent } from '../../shared/components/form/textarea.component';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, InputComponent, SelectComponent, TextareaComponent, CardComponent],
  template: `
    <div class="settings-container">
      <header class="settings-header">
        <div class="header-content">
          <div class="welcome-section">
            <h1>Configurações</h1>
            <p>Personalize sua experiência na VentureFi</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-outline" (click)="resetToDefault()">
              <app-icon name="arrow-path" size="18"></app-icon>
              Restaurar Padrões
            </button>
            <button class="btn btn-primary" (click)="saveAllSettings()">
              <app-icon name="check" size="18"></app-icon>
              Salvar Alterações
            </button>
          </div>
        </div>
      </header>

      <div class="settings-content">
          <!-- Settings Navigation -->
          <section class="settings-navigation">
            <nav class="settings-nav">
              <button
                class="nav-item"
                [class.active]="activeSection === 'profile'"
                (click)="setActiveSection('profile')">
                Perfil
              </button>
              <button
                class="nav-item"
                [class.active]="activeSection === 'security'"
                (click)="setActiveSection('security')">
                Segurança
              </button>
              <button
                class="nav-item"
                [class.active]="activeSection === 'notifications'"
                (click)="setActiveSection('notifications')">
                Notificações
              </button>
              <button
                class="nav-item"
                [class.active]="activeSection === 'preferences'"
                (click)="setActiveSection('preferences')">
                Preferências
              </button>
              <button
                class="nav-item"
                [class.active]="activeSection === 'integrations'"
                (click)="setActiveSection('integrations')">
                Integrações
              </button>
              <button
                class="nav-item"
                [class.active]="activeSection === 'billing'"
                (click)="setActiveSection('billing')">
                Assinatura
              </button>
            </nav>
          </section>

          <!-- Profile Section -->
          <section class="settings-section" *ngIf="activeSection === 'profile'">
            <div class="section-header">
              <h2>Informações Pessoais</h2>
              <p>Gerencie suas informações básicas e foto do perfil</p>
            </div>

            <app-card>
              <div class="profile-photo-section">
                <div class="current-photo">
                  <div class="photo-preview">{{ userProfile.name.charAt(0).toUpperCase() }}</div>
                  <div class="photo-info">
                    <h4>Foto do Perfil</h4>
                    <p>JPG ou PNG. Máximo 2MB.</p>
                  </div>
                </div>
                <div class="photo-actions">
                  <button class="btn btn-outline">
                    <app-icon name="camera" size="18"></app-icon>
                    Alterar Foto
                  </button>
                  <button class="btn btn-text">
                    <app-icon name="trash" size="16"></app-icon>
                    Remover
                  </button>
                </div>
              </div>

              <div class="form-grid">
                <app-input
                  label="Nome Completo"
                  [(ngModel)]="userProfile.name"
                  placeholder="Seu nome completo"
                  [required]="true">
                </app-input>

                <app-input
                  label="Email"
                  type="email"
                  [(ngModel)]="userProfile.email"
                  placeholder="seu@email.com"
                  [required]="true"
                  iconLeft="user">
                </app-input>

                <app-input
                  label="Telefone"
                  type="tel"
                  [(ngModel)]="userProfile.phone"
                  placeholder="(11) 99999-9999"
                  iconLeft="phone">
                </app-input>

                <app-input
                  label="Data de Nascimento"
                  type="date"
                  [(ngModel)]="userProfile.birthDate"
                  iconLeft="calendar">
                </app-input>

                <div class="full-width">
                  <app-input
                    label="Profissão"
                    [(ngModel)]="userProfile.profession"
                    placeholder="Ex: Designer, Desenvolvedor, Consultor"
                    iconLeft="briefcase">
                  </app-input>
                </div>

                <div class="full-width">
                  <app-textarea
                    label="Bio"
                    [(ngModel)]="userProfile.bio"
                    placeholder="Conte um pouco sobre você e seu negócio..."
                    [rows]="3">
                  </app-textarea>
                </div>
              </div>
            </app-card>
          </section>

          <!-- Security Section -->
          <section class="settings-section" *ngIf="activeSection === 'security'">
            <div class="section-header">
              <h2>Segurança</h2>
              <p>Mantenha sua conta segura com autenticação e controle de acesso</p>
            </div>

            <app-card>
              <div class="security-item">
                <div class="security-info">
                  <app-icon name="lock-closed" size="20" className="text-primary-600"></app-icon>
                  <div>
                    <h4>Alterar Senha</h4>
                    <p>Recomendamos alterar sua senha a cada 3 meses</p>
                  </div>
                </div>
                <button class="btn btn-outline">
                  <app-icon name="pencil" size="16"></app-icon>
                  Alterar Senha
                </button>
              </div>

              <div class="security-item">
                <div class="security-info">
                  <app-icon name="shield-check" size="20" className="text-primary-600"></app-icon>
                  <div>
                    <h4>Autenticação em Duas Etapas (2FA)</h4>
                    <p>Adicione uma camada extra de segurança à sua conta</p>
                  </div>
                </div>
                <div class="security-toggle">
                  <label class="toggle-switch">
                    <input type="checkbox" [(ngModel)]="securitySettings.twoFactorEnabled">
                    <span class="slider"></span>
                  </label>
                  <span class="toggle-status">{{ securitySettings.twoFactorEnabled ? 'Ativado' : 'Desativado' }}</span>
                </div>
              </div>

              <div class="security-item">
                <div class="security-info">
                  <app-icon name="device-desktop" size="20" className="text-primary-600"></app-icon>
                  <div>
                    <h4>Sessões Ativas</h4>
                    <p>Gerencie dispositivos conectados à sua conta</p>
                  </div>
                </div>
                <button class="btn btn-outline">
                  <app-icon name="eye" size="16"></app-icon>
                  Ver Sessões
                </button>
              </div>

              <div class="security-item">
                <div class="security-info">
                  <app-icon name="cloud-arrow-down" size="20" className="text-primary-600"></app-icon>
                  <div>
                    <h4>Backup dos Dados</h4>
                    <p>Faça backup dos seus dados financeiros</p>
                  </div>
                </div>
                <button class="btn btn-outline">
                  <app-icon name="arrow-down-tray" size="16"></app-icon>
                  Fazer Backup
                </button>
              </div>
            </app-card>
          </section>

          <!-- Notifications Section -->
          <section class="settings-section" *ngIf="activeSection === 'notifications'">
            <div class="section-header">
              <h2>Configurações de Notificação</h2>
              <p>Escolha como e quando receber notificações</p>
            </div>

            <div class="settings-card">
              <div class="notification-group">
                <h4>Canais de Notificação</h4>
                <div class="notification-options">
                  <div class="notification-item">
                    <label class="notification-label">
                      <input type="checkbox" [(ngModel)]="notificationSettings.email">
                      <span class="checkmark"></span>
                      Email
                    </label>
                    <span class="notification-desc">Receber notificações por email</span>
                  </div>

                  <div class="notification-item">
                    <label class="notification-label">
                      <input type="checkbox" [(ngModel)]="notificationSettings.push">
                      <span class="checkmark"></span>
                      Push Browser
                    </label>
                    <span class="notification-desc">Notificações no navegador</span>
                  </div>

                  <div class="notification-item">
                    <label class="notification-label">
                      <input type="checkbox" [(ngModel)]="notificationSettings.whatsapp">
                      <span class="checkmark"></span>
                      WhatsApp
                    </label>
                    <span class="notification-desc">Alertas importantes via WhatsApp</span>
                  </div>
                </div>
              </div>

              <div class="notification-group">
                <h4>Tipos de Notificação</h4>
                <div class="notification-options">
                  <div class="notification-item">
                    <label class="notification-label">
                      <input type="checkbox" [(ngModel)]="notificationSettings.goals">
                      <span class="checkmark"></span>
                      Metas e Objetivos
                    </label>
                    <span class="notification-desc">Progresso e lembretes de metas</span>
                  </div>

                  <div class="notification-item">
                    <label class="notification-label">
                      <input type="checkbox" [(ngModel)]="notificationSettings.transactions">
                      <span class="checkmark"></span>
                      Transações
                    </label>
                    <span class="notification-desc">Novas transações e limites</span>
                  </div>

                  <div class="notification-item">
                    <label class="notification-label">
                      <input type="checkbox" [(ngModel)]="notificationSettings.insights">
                      <span class="checkmark"></span>
                      Insights Inteligentes
                    </label>
                    <span class="notification-desc">Sugestões e análises</span>
                  </div>

                  <div class="notification-item">
                    <label class="notification-label">
                      <input type="checkbox" [(ngModel)]="notificationSettings.reports">
                      <span class="checkmark"></span>
                      Relatórios
                    </label>
                    <span class="notification-desc">Relatórios periódicos</span>
                  </div>
                </div>
              </div>

              <div class="notification-group">
                <h4>Frequência</h4>
                <div class="frequency-options">
                  <div class="frequency-item">
                    <label>Relatórios automáticos:</label>
                    <select [(ngModel)]="notificationSettings.reportFrequency">
                      <option value="daily">Diário</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensal</option>
                      <option value="never">Nunca</option>
                    </select>
                  </div>

                  <div class="frequency-item">
                    <label>Lembretes de metas:</label>
                    <select [(ngModel)]="notificationSettings.goalReminders">
                      <option value="daily">Diário</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensal</option>
                      <option value="never">Nunca</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Preferences Section -->
          <section class="settings-section" *ngIf="activeSection === 'preferences'">
            <div class="section-header">
              <h2>Preferências de Interface</h2>
              <p>Customize a aparência e comportamento da plataforma</p>
            </div>

            <div class="settings-card">
              <div class="preference-group">
                <h4>Aparência</h4>
                <div class="preference-item">
                  <label>Tema:</label>
                  <div class="theme-options">
                    <button
                      class="theme-btn"
                      [class.active]="preferences.theme === 'light'"
                      (click)="setTheme('light')">
                      Claro
                    </button>
                    <button
                      class="theme-btn"
                      [class.active]="preferences.theme === 'dark'"
                      (click)="setTheme('dark')">
                      Escuro
                    </button>
                    <button
                      class="theme-btn"
                      [class.active]="preferences.theme === 'auto'"
                      (click)="setTheme('auto')">
                      Automático
                    </button>
                  </div>
                </div>

                <div class="preference-item">
                  <app-select
                    label="Moeda padrão"
                    [(ngModel)]="preferences.currency"
                    [options]="currencyOptions">
                  </app-select>
                </div>

                <div class="preference-item">
                  <app-select
                    label="Idioma"
                    [(ngModel)]="preferences.language"
                    [options]="languageOptions">
                  </app-select>
                </div>
              </div>

              <div class="preference-group">
                <h4>Dashboard</h4>
                <div class="preference-item">
                  <label class="checkbox-label">
                    <input type="checkbox" [(ngModel)]="preferences.showWelcomeMessage">
                    <span class="checkmark"></span>
                    Exibir mensagem de boas-vindas
                  </label>
                </div>

                <div class="preference-item">
                  <label class="checkbox-label">
                    <input type="checkbox" [(ngModel)]="preferences.autoRefresh">
                    <span class="checkmark"></span>
                    Atualizar dados automaticamente
                  </label>
                </div>

                <div class="preference-item">
                  <label class="checkbox-label">
                    <input type="checkbox" [(ngModel)]="preferences.showTips">
                    <span class="checkmark"></span>
                    Mostrar dicas e sugestões
                  </label>
                </div>
              </div>

              <div class="preference-group">
                <h4>Transações</h4>
                <div class="preference-item">
                  <app-select
                    label="Categoria padrão para receitas"
                    [(ngModel)]="preferences.defaultIncomeCategory"
                    [options]="incomeCategoryOptions">
                  </app-select>
                </div>

                <div class="preference-item">
                  <app-select
                    label="Categoria padrão para despesas"
                    [(ngModel)]="preferences.defaultExpenseCategory"
                    [options]="expenseCategoryOptions">
                  </app-select>
                </div>
              </div>
            </div>
          </section>

          <!-- Integrations Section -->
          <section class="settings-section" *ngIf="activeSection === 'integrations'">
            <div class="section-header">
              <h2>Integrações</h2>
              <p>Conecte suas contas bancárias e ferramentas favoritas</p>
            </div>

            <div class="integrations-grid">
              <div class="integration-card bank">
                <div class="integration-info">
                  <h4>Open Banking</h4>
                  <p>Sincronize automaticamente suas transações bancárias</p>
                  <div class="integration-status disconnected">
                    <span class="status-dot"></span>
                    Desconectado
                  </div>
                </div>
                <div class="integration-actions">
                  <button class="btn btn-primary">Conectar</button>
                </div>
              </div>

              <div class="integration-card pix">
                <div class="integration-info">
                  <h4>PIX</h4>
                  <p>Receba notificações automáticas de pagamentos PIX</p>
                  <div class="integration-status connected">
                    <span class="status-dot"></span>
                    Conectado
                  </div>
                </div>
                <div class="integration-actions">
                  <button class="btn btn-outline">Configurar</button>
                </div>
              </div>

              <div class="integration-card whatsapp">
                <div class="integration-info">
                  <h4>WhatsApp</h4>
                  <p>Receba relatórios e alertas via WhatsApp</p>
                  <div class="integration-status disconnected">
                    <span class="status-dot"></span>
                    Desconectado
                  </div>
                </div>
                <div class="integration-actions">
                  <button class="btn btn-primary">Conectar</button>
                </div>
              </div>

              <div class="integration-card excel">
                <div class="integration-info">
                  <h4>Excel/Google Sheets</h4>
                  <p>Exporte automaticamente para planilhas</p>
                  <div class="integration-status disconnected">
                    <span class="status-dot"></span>
                    Desconectado
                  </div>
                </div>
                <div class="integration-actions">
                  <button class="btn btn-primary">Conectar</button>
                </div>
              </div>

              <div class="integration-card accounting">
                <div class="integration-info">
                  <h4>Contabilidade</h4>
                  <p>Integre com seu software de contabilidade</p>
                  <div class="integration-status disconnected">
                    <span class="status-dot"></span>
                    Desconectado
                  </div>
                </div>
                <div class="integration-actions">
                  <button class="btn btn-primary">Conectar</button>
                </div>
              </div>

              <div class="integration-card api">
                <div class="integration-info">
                  <h4>API Personalizada</h4>
                  <p>Conecte suas próprias ferramentas via API</p>
                  <div class="integration-status disconnected">
                    <span class="status-dot"></span>
                    Desconectado
                  </div>
                </div>
                <div class="integration-actions">
                  <button class="btn btn-primary">Ver Docs</button>
                </div>
              </div>
            </div>
          </section>

          <!-- Billing Section -->
          <section class="settings-section" *ngIf="activeSection === 'billing'">
            <div class="section-header">
              <h2>Assinatura e Faturamento</h2>
              <p>Gerencie seu plano e informações de pagamento</p>
            </div>

            <div class="billing-overview">
              <div class="current-plan-card">
                <div class="plan-header">
                  <h3>Plano Atual: Free</h3>
                  <span class="plan-badge free">Gratuito</span>
                </div>
                <div class="plan-features">
                  <div class="feature-item">
                    <span class="feature-icon">✓</span>
                    <span>Até 50 transações por mês</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">✓</span>
                    <span>3 metas simultâneas</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">✓</span>
                    <span>Relatórios básicos</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">×</span>
                    <span>Integrações bancárias</span>
                  </div>
                </div>
                <div class="plan-actions">
                  <button class="btn btn-primary">Fazer Upgrade</button>
                </div>
              </div>

              <div class="usage-stats">
                <h4>Uso do Plano Atual</h4>
                <div class="usage-item">
                  <div class="usage-info">
                    <span class="usage-label">Transações este mês:</span>
                    <span class="usage-value">32 / 50</span>
                  </div>
                  <div class="usage-bar">
                    <div class="usage-fill" style="width: 64%"></div>
                  </div>
                </div>

                <div class="usage-item">
                  <div class="usage-info">
                    <span class="usage-label">Metas ativas:</span>
                    <span class="usage-value">3 / 3</span>
                  </div>
                  <div class="usage-bar">
                    <div class="usage-fill" style="width: 100%"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="plans-comparison">
              <h4>Comparar Planos</h4>
              <div class="plans-grid">
                <div class="plan-card free">
                  <div class="plan-name">Free</div>
                  <div class="plan-price">R$ 0<span>/mês</span></div>
                  <ul class="plan-features-list">
                    <li>50 transações/mês</li>
                    <li>3 metas simultâneas</li>
                    <li>Relatórios básicos</li>
                    <li>Suporte por email</li>
                  </ul>
                  <button class="btn btn-outline" disabled>Plano Atual</button>
                </div>

                <div class="plan-card pro popular">
                  <div class="plan-badge-popular">Mais Popular</div>
                  <div class="plan-name">Pro</div>
                  <div class="plan-price">R$ 29<span>/mês</span></div>
                  <ul class="plan-features-list">
                    <li>Transações ilimitadas</li>
                    <li>Metas ilimitadas</li>
                    <li>Relatórios avançados</li>
                    <li>Integrações bancárias</li>
                    <li>Suporte prioritário</li>
                  </ul>
                  <button class="btn btn-primary">Escolher Pro</button>
                </div>

                <div class="plan-card business">
                  <div class="plan-name">Business</div>
                  <div class="plan-price">R$ 79<span>/mês</span></div>
                  <ul class="plan-features-list">
                    <li>Todos os recursos Pro</li>
                    <li>Múltiplas empresas</li>
                    <li>API personalizada</li>
                    <li>Gerente de conta</li>
                    <li>SLA garantido</li>
                  </ul>
                  <button class="btn btn-outline">Escolher Business</button>
                </div>
              </div>
            </div>
          </section>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      min-height: 100vh;
      background: var(--bg-secondary);
    }

    .settings-header {
      background: var(--bg-primary);
      border-bottom: 1px solid var(--border-primary);
      padding: var(--space-8);
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--space-6);
    }

    .welcome-section h1 {
      color: var(--primary-900);
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 var(--space-2) 0;
    }

    .welcome-section p {
      color: var(--text-secondary);
      font-size: 1rem;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: var(--space-3);
      flex-shrink: 0;
    }

    .settings-content {
      padding: var(--space-8);
      display: flex;
      gap: var(--space-8);
    }

    .settings-navigation {
      flex-shrink: 0;
      width: 260px;
    }

    .settings-nav {
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-primary);
      overflow: hidden;
      position: sticky;
      top: var(--space-8);
    }

    .nav-item {
      display: block;
      width: 100%;
      padding: var(--space-4) var(--space-6);
      border: none;
      background: var(--bg-primary);
      text-align: left;
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
      border-bottom: 1px solid var(--border-primary);
    }

    .nav-item:last-child {
      border-bottom: none;
    }

    .nav-item:hover {
      background: var(--primary-50);
      color: var(--primary-700);
    }

    .nav-item.active {
      background: var(--accent-blue-light);
      color: var(--accent-blue);
      font-weight: 600;
    }

    .settings-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-8);
    }

    .section-header h2 {
      color: var(--primary-900);
      margin-bottom: var(--space-2);
      font-size: 1.5rem;
      font-weight: 700;
    }

    .section-header p {
      color: var(--text-secondary);
      margin: 0;
      font-size: 1rem;
    }

    .settings-card {
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-primary);
      padding: var(--space-6);
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .profile-photo-section {
      display: flex;
      align-items: center;
      gap: var(--space-8);
      margin-bottom: var(--space-8);
      padding-bottom: var(--space-8);
      border-bottom: 1px solid var(--border-primary);
    }

    .current-photo {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .photo-preview {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-full);
      background: var(--accent-blue);
      color: var(--text-inverse);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 600;
    }

    .photo-info h4 {
      color: var(--primary-900);
      margin: 0 0 var(--space-1) 0;
      font-weight: 600;
    }

    .photo-info p {
      color: var(--text-secondary);
      margin: 0;
      font-size: 0.875rem;
    }

    .photo-actions {
      display: flex;
      gap: var(--space-3);
      margin-left: auto;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-6);
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .security-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: var(--space-6) 0;
      border-bottom: 1px solid var(--border-primary);
      gap: var(--space-4);
    }

    .security-item:last-child {
      border-bottom: none;
    }

    .security-info {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
      flex: 1;
    }

    .security-info h4 {
      color: var(--primary-900);
      margin: 0 0 var(--space-1) 0;
      font-size: 1rem;
      font-weight: 600;
    }

    .security-info p {
      color: var(--text-secondary);
      margin: 0;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .security-toggle {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      flex-shrink: 0;
    }

    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--border-secondary);
      transition: 0.2s ease;
      border-radius: var(--radius-full);
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: var(--bg-primary);
      transition: 0.2s ease;
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-xs);
    }

    input:checked + .slider {
      background-color: var(--accent-blue);
    }

    input:checked + .slider:before {
      transform: translateX(20px);
    }

    .toggle-status {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
      min-width: 70px;
    }

    .notification-group {
      margin-bottom: var(--space-8);
    }

    .notification-group h4 {
      color: var(--primary-900);
      margin-bottom: var(--space-4);
      font-size: 1rem;
      font-weight: 600;
    }

    .notification-options,
    .frequency-options {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .notification-item,
    .frequency-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-3) 0;
    }

    .notification-label,
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      cursor: pointer;
      font-weight: 500;
      color: var(--primary-900);
    }

    .notification-label input[type="checkbox"],
    .checkbox-label input[type="checkbox"] {
      display: none;
    }

    .checkmark {
      width: 20px;
      height: 20px;
      border: 2px solid var(--border-secondary);
      border-radius: var(--radius-base);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
      background: var(--bg-primary);
    }

    .notification-label input[type="checkbox"]:checked + .checkmark,
    .checkbox-label input[type="checkbox"]:checked + .checkmark {
      background: var(--accent-blue);
      border-color: var(--accent-blue);
    }

    .notification-label input[type="checkbox"]:checked + .checkmark::after,
    .checkbox-label input[type="checkbox"]:checked + .checkmark::after {
      content: '✓';
      color: var(--text-inverse);
      font-size: 0.875rem;
      font-weight: 600;
    }

    .notification-desc {
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.4;
    }

    .frequency-item label {
      font-weight: 500;
      color: var(--primary-900);
    }

    .frequency-item select {
      padding: var(--space-2) var(--space-4);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-base);
      font-size: 0.875rem;
      min-width: 140px;
      background: var(--bg-primary);
      color: var(--text-primary);
    }

    .preference-group {
      margin-bottom: var(--space-8);
    }

    .preference-group h4 {
      color: var(--primary-900);
      margin-bottom: var(--space-4);
      font-size: 1rem;
      font-weight: 600;
    }

    .preference-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-4) 0;
      border-bottom: 1px solid var(--border-primary);
      gap: var(--space-4);
    }

    .preference-item:last-child {
      border-bottom: none;
    }

    .preference-item label {
      font-weight: 500;
      color: var(--primary-900);
      flex: 1;
    }

    .theme-options {
      display: flex;
      gap: var(--space-2);
      flex-shrink: 0;
    }

    .theme-btn {
      padding: var(--space-2) var(--space-4);
      border: 1px solid var(--border-primary);
      background: var(--bg-primary);
      border-radius: var(--radius-base);
      cursor: pointer;
      transition: all 0.15s ease;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .theme-btn:hover {
      border-color: var(--accent-blue);
      color: var(--accent-blue);
    }

    .theme-btn.active {
      background: var(--accent-blue);
      color: var(--text-inverse);
      border-color: var(--accent-blue);
    }

    .integrations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: var(--space-6);
    }

    .integration-card {
      background: var(--bg-primary);
      padding: var(--space-6);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-primary);
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      transition: all 0.15s ease;
    }

    .integration-card:hover {
      box-shadow: var(--shadow-md);
      border-color: var(--border-secondary);
    }

    .integration-info h4 {
      color: var(--primary-900);
      margin: 0 0 var(--space-2) 0;
      text-align: center;
      font-weight: 600;
    }

    .integration-info p {
      color: var(--text-secondary);
      margin: 0 0 var(--space-4) 0;
      text-align: center;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .integration-status {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: var(--space-4);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-base);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: var(--radius-full);
    }

    .integration-status.connected {
      color: var(--success);
      background: var(--success-light);
    }

    .integration-status.connected .status-dot {
      background: var(--success);
    }

    .integration-status.disconnected {
      color: var(--text-tertiary);
      background: var(--bg-tertiary);
    }

    .integration-status.disconnected .status-dot {
      background: var(--text-tertiary);
    }

    .integration-actions {
      text-align: center;
    }

    .billing-overview {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--space-8);
      margin-bottom: var(--space-8);
    }

    .current-plan-card,
    .usage-stats {
      background: var(--bg-primary);
      padding: var(--space-8);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-primary);
    }

    .plan-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-6);
    }

    .plan-header h3 {
      color: var(--primary-900);
      margin: 0;
      font-weight: 700;
    }

    .plan-badge {
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .plan-badge.free {
      background: var(--success-light);
      color: var(--success);
    }

    .plan-features {
      margin-bottom: var(--space-8);
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-3);
      font-size: 0.875rem;
    }

    .feature-icon {
      font-size: 1rem;
      width: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .usage-stats h4 {
      color: var(--primary-900);
      margin-bottom: var(--space-6);
      font-weight: 600;
    }

    .usage-item {
      margin-bottom: var(--space-6);
    }

    .usage-item:last-child {
      margin-bottom: 0;
    }

    .usage-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--space-2);
    }

    .usage-label {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .usage-value {
      color: var(--primary-900);
      font-weight: 600;
      font-size: 0.875rem;
    }

    .usage-bar {
      height: 8px;
      background: var(--bg-tertiary);
      border-radius: var(--radius-base);
      overflow: hidden;
    }

    .usage-fill {
      height: 100%;
      background: var(--accent-blue);
      transition: width 0.3s ease;
    }

    .plans-comparison {
      background: var(--bg-primary);
      padding: var(--space-8);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-primary);
    }

    .plans-comparison h4 {
      color: var(--primary-900);
      margin-bottom: var(--space-6);
      text-align: center;
      font-weight: 600;
    }

    .plans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--space-6);
    }

    .plan-card {
      border: 2px solid var(--border-primary);
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      text-align: center;
      position: relative;
      transition: all 0.15s ease;
      background: var(--bg-primary);
    }

    .plan-card:hover {
      border-color: var(--accent-blue);
      box-shadow: var(--shadow-md);
    }

    .plan-card.popular {
      border-color: var(--accent-blue);
      transform: scale(1.02);
    }

    .plan-badge-popular {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--accent-blue);
      color: var(--text-inverse);
      padding: var(--space-1) var(--space-4);
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .plan-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary-900);
      margin-bottom: var(--space-4);
    }

    .plan-price {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary-900);
      margin-bottom: var(--space-6);
    }

    .plan-price span {
      font-size: 1rem;
      font-weight: 400;
      color: var(--text-secondary);
    }

    .plan-features-list {
      list-style: none;
      padding: 0;
      margin: 0 0 var(--space-8) 0;
    }

    .plan-features-list li {
      padding: var(--space-2) 0;
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .btn-text {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.15s ease;
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-base);
    }

    .btn-text:hover {
      color: var(--accent-red);
      background: var(--accent-red-light);
    }

    @media (max-width: 1024px) {
      .settings-content {
        flex-direction: column;
        padding: var(--space-6);
      }

      .settings-navigation {
        width: 100%;
      }

      .settings-nav {
        position: relative;
        display: flex;
        overflow-x: auto;
        border-radius: var(--radius-lg);
      }

      .nav-item {
        flex-shrink: 0;
        border-bottom: none;
        border-right: 1px solid var(--border-primary);
        white-space: nowrap;
        min-width: 120px;
      }

      .nav-item:last-child {
        border-right: none;
      }

      .billing-overview {
        grid-template-columns: 1fr;
        gap: var(--space-6);
      }

      .plans-grid {
        grid-template-columns: 1fr;
      }

      .plan-card.popular {
        transform: none;
      }
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: var(--space-4);
        align-items: flex-start;
      }

      .header-actions {
        width: 100%;
        justify-content: space-between;
      }

      .settings-content {
        padding: var(--space-4);
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .integrations-grid {
        grid-template-columns: 1fr;
      }

      .profile-photo-section {
        flex-direction: column;
        text-align: center;
        gap: var(--space-6);
      }

      .photo-actions {
        margin-left: 0;
        justify-content: center;
      }

      .security-item {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-4);
      }

      .security-toggle {
        width: 100%;
        justify-content: space-between;
      }

      .preference-item {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-3);
      }

      .theme-options {
        width: 100%;
        justify-content: flex-start;
      }
    }
  `]
})
export class ConfiguracoesComponent implements OnInit {
  activeSection = 'profile';

  userProfile = {
    name: 'Rafael Souza',
    email: 'rafael@email.com',
    phone: '(11) 99999-9999',
    birthDate: '1990-05-15',
    profession: 'Desenvolvedor Full-Stack',
    bio: 'Desenvolvedor apaixonado por tecnologia e empreendedorismo. Trabalho com desenvolvimento web há mais de 5 anos, ajudando empresas a crescerem no digital.'
  };

  securitySettings = {
    twoFactorEnabled: false,
    sessionTimeout: 30,
    loginNotifications: true
  };

  notificationSettings = {
    email: true,
    push: true,
    whatsapp: false,
    goals: true,
    transactions: true,
    insights: true,
    reports: false,
    reportFrequency: 'weekly',
    goalReminders: 'weekly'
  };

  preferences = {
    theme: 'light',
    currency: 'BRL',
    language: 'pt-BR',
    showWelcomeMessage: true,
    autoRefresh: true,
    showTips: true,
    defaultIncomeCategory: 'servicos',
    defaultExpenseCategory: 'outros'
  };

  // Select Options
  currencyOptions = [
    { value: 'BRL', label: 'Real Brasileiro (R$)' },
    { value: 'USD', label: 'Dólar Americano ($)' },
    { value: 'EUR', label: 'Euro (€)' }
  ];

  languageOptions = [
    { value: 'pt-BR', label: 'Português (Brasil)' },
    { value: 'en-US', label: 'English (US)' },
    { value: 'es-ES', label: 'Español' }
  ];

  incomeCategoryOptions = [
    { value: 'servicos', label: 'Serviços' },
    { value: 'produtos', label: 'Produtos' },
    { value: 'consultoria', label: 'Consultoria' },
    { value: 'outros', label: 'Outros' }
  ];

  expenseCategoryOptions = [
    { value: 'alimentacao', label: 'Alimentação' },
    { value: 'transporte', label: 'Transporte' },
    { value: 'escritorio', label: 'Material de Escritório' },
    { value: 'outros', label: 'Outros' }
  ];

  ngOnInit() {
    // Carregar configurações salvas
  }

  setActiveSection(section: string) {
    this.activeSection = section;
  }

  setTheme(theme: string) {
    this.preferences.theme = theme;
    // Implementar mudança de tema
  }

  saveAllSettings() {
    console.log('Salvando todas as configurações...');
    // Implementar salvamento
    alert('Configurações salvas com sucesso!');
  }

  resetToDefault() {
    if (confirm('Tem certeza que deseja restaurar todas as configurações para os valores padrão?')) {
      // Resetar para valores padrão
      console.log('Restaurando configurações padrão...');
      alert('Configurações restauradas!');
    }
  }
}
