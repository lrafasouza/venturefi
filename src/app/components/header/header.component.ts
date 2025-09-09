import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <a routerLink="/home">
              <h2 class="logo-text">VentureFi</h2>
            </a>
          </div>
          
          <nav class="nav" [class.nav-open]="isMenuOpen">
            <ul class="nav-list">
              <li><a routerLink="/home" routerLinkActive="active">Home</a></li>
              <li><a routerLink="/features" routerLinkActive="active">Features</a></li>
              <li><a routerLink="/pricing" routerLinkActive="active">Planos</a></li>
              <li><a routerLink="/about" routerLinkActive="active">Sobre</a></li>
              <li><a routerLink="/contact" routerLinkActive="active">Contato</a></li>
            </ul>
          </nav>
          
          <div class="header-actions">
            <a routerLink="/login" class="btn btn-outline">Login</a>
            <a routerLink="/platform/dashboard" class="btn btn-primary">Comece já</a>
            
            <button class="mobile-menu-toggle" (click)="toggleMenu()" aria-label="Toggle menu">
              <span class="hamburger-line" [class.active]="isMenuOpen"></span>
              <span class="hamburger-line" [class.active]="isMenuOpen"></span>
              <span class="hamburger-line" [class.active]="isMenuOpen"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: var(--white);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }
    
    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 0;
    }
    
    .logo a {
      text-decoration: none;
    }
    
    .logo-text {
      color: var(--security-blue);
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
    }
    
    .nav {
      display: flex;
    }
    
    .nav-list {
      display: flex;
      list-style: none;
      gap: 2rem;
      margin: 0;
      padding: 0;
    }
    
    .nav-list a {
      text-decoration: none;
      color: var(--medium-gray);
      font-weight: 500;
      transition: all 0.2s ease;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      position: relative;
    }
    
    .nav-list a:hover {
      color: var(--security-blue);
      background-color: rgba(30, 58, 95, 0.08);
    }
    
    .nav-list a.active {
      color: var(--security-blue);
      background-color: rgba(30, 58, 95, 0.12);
      font-weight: 600;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .mobile-menu-toggle {
      display: none;
      flex-direction: column;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      width: 2rem;
      height: 2rem;
      position: relative;
    }
    
    .hamburger-line {
      width: 100%;
      height: 2px;
      background-color: var(--security-blue);
      margin: 2px 0;
      transition: 0.3s;
      transform-origin: center;
    }
    
    .hamburger-line.active:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }
    
    .hamburger-line.active:nth-child(2) {
      opacity: 0;
    }
    
    .hamburger-line.active:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }
    
    @media (max-width: 768px) {
      .nav {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: var(--white);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }
      
      .nav-open {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }
      
      .nav-list {
        flex-direction: column;
        padding: 1rem;
        gap: 0;
      }
      
      .nav-list a {
        display: block;
        padding: 1rem 0;
        border-bottom: 1px solid var(--light-gray);
      }
      
      .mobile-menu-toggle {
        display: flex;
      }
      
      .header-actions .btn {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  isMenuOpen = false;
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}