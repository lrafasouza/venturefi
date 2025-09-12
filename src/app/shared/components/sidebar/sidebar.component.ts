import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <!-- Mobile Header -->
    <header class="mobile-header">
      <button class="mobile-menu-toggle" (click)="toggleMobileMenu()">
        <app-icon [name]="isMobileMenuOpen ? 'x-mark' : 'bars-3'" size="24"></app-icon>
      </button>
      <div class="mobile-brand">
        <h2 class="brand-logo">VentureFi</h2>
        <span class="page-subtitle">Plataforma</span>
      </div>
      <div class="mobile-user">
        <div class="user-avatar animate-pulse">RN</div>
      </div>
    </header>

    <!-- Mobile Menu Overlay -->
    <div class="mobile-overlay" *ngIf="isMobileMenuOpen" (click)="closeMobileMenu()"></div>

    <!-- Sidebar Navigation -->
    <aside class="sidebar-modern" [class.mobile-open]="isMobileMenuOpen">
      <div class="sidebar-header">
        <div class="brand-container">
          <h2 class="brand-title">VentureFi</h2>
          <span class="brand-tagline">Gestão Financeira</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li class="nav-item" *ngFor="let item of menuItems">
            <a
              [routerLink]="item.route"
              class="nav-link"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{exact: false}"
              (click)="closeMobileMenu()"
            >
              <div class="nav-icon">
                <app-icon [name]="item.icon" size="20"></app-icon>
              </div>
              <span class="nav-text">{{ item.label }}</span>
              <span *ngIf="item.badge" class="notification-badge pulse">{{ item.badge }}</span>
              <div class="active-indicator"></div>
            </a>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <div class="user-profile-card">
          <div class="user-avatar-large">RS</div>
          <div class="user-details">
            <div class="user-name">Rafael Souza</div>
            <div class="user-plan-badge">Plano Business</div>
          </div>
        </div>
        <a routerLink="/home" class="logout-btn-modern" (click)="closeMobileMenu()">
          <app-icon name="logout" size="18"></app-icon>
          <span>Sair</span>
        </a>
      </div>
    </aside>
  `,
  styles: [`
    /* Modern Sidebar Component */
    .mobile-header {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 68px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 1px 30px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--space-6);
    }

    .mobile-menu-toggle {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: var(--text-primary);
      cursor: pointer;
      padding: var(--space-3);
      border-radius: var(--radius-lg);
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      backdrop-filter: blur(10px);
    }

    .mobile-menu-toggle:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
    }

    .mobile-brand {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .brand-logo {
      color: var(--text-primary);
      font-size: 1.375rem;
      font-weight: 800;
      margin: 0;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .page-subtitle {
      font-size: 0.75rem;
      color: var(--text-tertiary);
      font-weight: 500;
      margin-top: 2px;
    }

    .mobile-user .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
      color: var(--text-inverse);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.875rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .animate-pulse {
      animation: pulse 2s infinite;
    }

    .mobile-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 900;
      animation: fadeIn 0.3s ease;
    }

    /* Modern Sidebar */
    .sidebar-modern {
      position: fixed;
      top: 0;
      left: 0;
      width: 300px;
      height: 100vh;
      background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
      border-right: 1px solid rgba(226, 232, 240, 0.8);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
      z-index: 800;
    }

    .sidebar-modern::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
      z-index: 1;
    }

    .sidebar-header {
      padding: var(--space-8) var(--space-6) var(--space-6);
      flex-shrink: 0;
    }

    .brand-container {
      text-align: center;
    }

    .brand-title {
      color: var(--text-primary);
      margin: 0 0 var(--space-1) 0;
      font-size: 1.75rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .brand-tagline {
      font-size: 0.875rem;
      color: var(--text-tertiary);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    /* Modern Navigation */
    .sidebar-nav {
      flex: 1;
      padding: var(--space-2) var(--space-3);
      overflow-y: auto;
    }

    .nav-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .nav-item {
      position: relative;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-4) var(--space-4);
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: var(--radius-xl);
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      position: relative;
      font-weight: 500;
      font-size: 0.875rem;
      margin: 0 var(--space-2);
    }

    .nav-link:hover {
      background: rgba(102, 126, 234, 0.08);
      color: var(--text-primary);
      transform: translateX(4px);
    }

    .nav-link.active {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
      color: #667eea;
      font-weight: 600;
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    }

    .active-indicator {
      position: absolute;
      left: -12px;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 20px;
      background: linear-gradient(180deg, #667eea, #764ba2);
      border-radius: 0 4px 4px 0;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .nav-link.active .active-indicator {
      opacity: 1;
    }

    .nav-link.active .nav-icon {
      transform: scale(1.1);
      color: #667eea;
    }

    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      transition: transform 0.3s ease;
    }

    .nav-link:hover .nav-icon,
    .active-icon {
      transform: scale(1.1);
      color: #667eea;
    }

    .nav-text {
      flex: 1;
      font-size: 0.9375rem;
      line-height: 1.2;
    }

    .notification-badge {
      background: linear-gradient(135deg, #E74C3C, #C0392B);
      color: white;
      font-size: 0.6875rem;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: var(--radius-full);
      margin-left: auto;
      min-width: 20px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
    }

    .pulse {
      animation: pulse 2s infinite;
    }

    /* Modern Sidebar Footer */
    .sidebar-footer {
      border-top: 1px solid rgba(226, 232, 240, 0.6);
      padding: var(--space-6);
      flex-shrink: 0;
      background: linear-gradient(180deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.9));
    }

    .user-profile-card {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-5);
      padding: var(--space-4);
      background: rgba(255, 255, 255, 0.8);
      border-radius: var(--radius-xl);
      border: 1px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
    }

    .user-avatar-large {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1rem;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .user-details {
      flex: 1;
      min-width: 0;
    }

    .user-name {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.9375rem;
      margin-bottom: var(--space-1);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-plan-badge {
      font-size: 0.75rem;
      color: #667eea;
      font-weight: 600;
      background: rgba(102, 126, 234, 0.1);
      padding: 2px 8px;
      border-radius: var(--radius-md);
      display: inline-block;
    }

    .logout-btn-modern {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 600;
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-lg);
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      background: rgba(255, 255, 255, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
    }

    .logout-btn-modern:hover {
      background: rgba(231, 76, 60, 0.1);
      color: #E74C3C;
      transform: translateX(4px);
      border-color: rgba(231, 76, 60, 0.2);
    }

    /* Animations */
    @keyframes pulse {
      0%, 100% { opacity: 0.7; transform: scale(1); }
      50% { opacity: 0.3; transform: scale(1.05); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .sidebar-modern {
        position: fixed;
        top: 68px;
        left: -300px;
        width: 280px;
        height: calc(100vh - 68px);
        z-index: 800;
        transition: left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        box-shadow: 10px 0 30px rgba(0, 0, 0, 0.1);
      }

      .sidebar-modern.mobile-open {
        left: 0;
      }

      .mobile-header {
        display: flex;
      }


    }

    @media (max-width: 480px) {
      .sidebar-modern {
        width: 260px;
      }

      .brand-title {
        font-size: 1.5rem;
      }

      .user-profile-card {
        padding: var(--space-3);
      }

      .user-avatar-large {
        width: 40px;
        height: 40px;
        font-size: 0.875rem;
      }
    }
  `]
})
export class SidebarComponent implements OnInit {
  isMobileMenuOpen = false;

  menuItems = [
    {
      label: 'Dashboard',
      route: '/platform/dashboard',
      icon: 'chart-bar'
    },
    {
      label: 'Em Busca do Sonho',
      route: '/platform/dream-pursuit',
      icon: 'target'
    },
    {
      label: 'Conta',
      route: '/platform/open-finance',
      icon: 'building-library'
    },
    {
      label: 'Transações',
      route: '/platform/transacoes',
      icon: 'banknotes'
    },
    {
      label: 'Relatórios',
      route: '/platform/relatorios',
      icon: 'presentation-chart-line'
    },
    {
      label: 'Notificações',
      route: '/platform/notificacoes',
      icon: 'bell',
      badge: 3
    },
    {
      label: 'Configurações',
      route: '/platform/configuracoes',
      icon: 'cog'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

}
