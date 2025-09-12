import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="minimal-home">
      <!-- Background Animation -->
      <div class="bg-animation">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
        <div class="floating-shape shape-4"></div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <div class="brand-section">
          <div class="brand-icon">💰</div>
          <h1 class="brand-name">VentureFi</h1>
          <p class="brand-tagline">Sua jornada financeira começa aqui</p>
        </div>

        <div class="action-section">
          <a routerLink="/onboarding" class="enter-btn">
            <span class="btn-icon">✨</span>
            <span class="btn-text">Começar Agora</span>
            <span class="btn-arrow">→</span>
          </a>
          <p class="helper-text">Clique para iniciar sua configuração</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="minimal-footer">
        <p>Desenvolvido para Empresas e Freelancers</p>
      </div>
    </div>
  `,
  styles: [`
    .minimal-home {
      height: 100vh;
      width: 100%;
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Background Animation */
    .bg-animation {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    .floating-shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(46, 204, 113, 0.1);
      animation: float 6s ease-in-out infinite;
    }

    .shape-1 {
      width: 100px;
      height: 100px;
      top: 20%;
      left: 10%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 60px;
      height: 60px;
      top: 60%;
      right: 15%;
      background: rgba(59, 130, 246, 0.1);
      animation-delay: 2s;
    }

    .shape-3 {
      width: 80px;
      height: 80px;
      bottom: 30%;
      left: 20%;
      background: rgba(139, 92, 246, 0.1);
      animation-delay: 4s;
    }

    .shape-4 {
      width: 40px;
      height: 40px;
      top: 30%;
      right: 30%;
      background: rgba(245, 158, 11, 0.1);
      animation-delay: 1s;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
        opacity: 0.7;
      }
      50% {
        transform: translateY(-20px) rotate(180deg);
        opacity: 0.3;
      }
    }

    /* Main Content */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      z-index: 2;
      position: relative;
      padding: 2rem;
    }

    .brand-section {
      margin-bottom: 3rem;
    }

    .brand-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }

    .brand-name {
      font-size: 3.5rem;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0 0 1rem 0;
      text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      letter-spacing: -0.02em;
    }

    .brand-tagline {
      font-size: 1.2rem;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
      font-weight: 300;
    }

    .action-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .enter-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.8rem;
      padding: 1.2rem 2.5rem;
      background: linear-gradient(135deg, #2ECC71, #27AE60);
      color: white;
      text-decoration: none;
      border-radius: 60px;
      font-size: 1.1rem;
      font-weight: 600;
      box-shadow: 0 8px 25px rgba(46, 204, 113, 0.3);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .enter-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }

    .enter-btn:hover::before {
      left: 100%;
    }

    .enter-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 35px rgba(46, 204, 113, 0.4);
      background: linear-gradient(135deg, #27AE60, #229A52);
    }

    .btn-icon {
      font-size: 1.2rem;
    }

    .btn-text {
      font-size: 1.1rem;
    }

    .btn-arrow {
      font-size: 1.2rem;
      transition: transform 0.3s ease;
    }

    .enter-btn:hover .btn-arrow {
      transform: translateX(4px);
    }

    .helper-text {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
      margin: 0;
      font-weight: 300;
    }

    /* Footer */
    .minimal-footer {
      text-align: center;
      padding: 2rem;
      z-index: 2;
      position: relative;
    }

    .minimal-footer p {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.85rem;
      margin: 0;
      font-weight: 300;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .brand-name {
        font-size: 2.5rem;
      }

      .brand-tagline {
        font-size: 1rem;
      }

      .enter-btn {
        padding: 1rem 2rem;
        font-size: 1rem;
      }

      .main-content {
        padding: 1.5rem;
      }

      .floating-shape {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .brand-name {
        font-size: 2rem;
      }

      .brand-icon {
        font-size: 3rem;
      }

      .enter-btn {
        padding: 0.9rem 1.8rem;
        gap: 0.6rem;
      }
    }
  `]
})
export class HomeComponent {}
