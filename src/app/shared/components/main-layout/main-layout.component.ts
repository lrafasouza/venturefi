import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="app-container">
      <app-sidebar></app-sidebar>
      <main class="main-content-area">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      position: relative;
    }

    /* Main Content Area with Perfect Spacing */
    .main-content-area {
      flex: 1;
      margin-left: 300px;
      padding: var(--space-6) var(--space-8) var(--space-8) var(--space-8);
      min-height: 100vh;
      overflow-x: hidden;
      transition: margin-left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    /* Custom Scrollbar for Main Content */
    .main-content-area::-webkit-scrollbar {
      width: 8px;
    }

    .main-content-area::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.05);
      border-radius: var(--radius-full);
    }

    .main-content-area::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: var(--radius-full);
    }

    .main-content-area::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.3);
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .main-content-area {
        margin-left: 280px;
        padding: var(--space-4) var(--space-6) var(--space-6) var(--space-6);
      }
    }

    @media (max-width: 768px) {
      .main-content-area {
        margin-left: 0;
        padding: var(--space-4);
        padding-top: calc(68px + var(--space-4));
      }
    }

    @media (max-width: 480px) {
      .main-content-area {
        padding: var(--space-3);
        padding-top: calc(68px + var(--space-3));
      }
    }
  `]
})
export class MainLayoutComponent {
  constructor() {}
}