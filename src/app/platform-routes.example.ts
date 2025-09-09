import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';

// Example: Platform routes using fixed sidebar layout
export const platformRoutes: Routes = [
  {
    path: 'platform',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => 
          import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent)
      },
      {
        path: 'dream-pursuit',
        loadComponent: () => 
          import('./pages/dream-pursuit/dream-pursuit.component').then(c => c.DreamPursuitComponent)
      },
      {
        path: 'transacoes',
        loadComponent: () => 
          import('./pages/transacoes/transacoes.component').then(c => c.TransacoesComponent)
      },
      {
        path: 'relatorios',
        loadComponent: () => 
          import('./pages/relatorios/relatorios.component').then(c => c.RelatoriosComponent)
      },
      {
        path: 'notificacoes',
        loadComponent: () => 
          import('./pages/notificacoes/notificacoes.component').then(c => c.NotificacoesComponent)
      },
      {
        path: 'configuracoes',
        loadComponent: () => 
          import('./pages/configuracoes/configuracoes.component').then(c => c.ConfiguracoesComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

// Main app routes (including marketing pages without sidebar)
export const appRoutes: Routes = [
  {
    path: 'home',
    loadComponent: () => 
      import('./pages/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'features',
    loadComponent: () => 
      import('./pages/features/features.component').then(c => c.FeaturesComponent)
  },
  {
    path: 'pricing',
    loadComponent: () => 
      import('./pages/pricing/pricing.component').then(c => c.PricingComponent)
  },
  {
    path: 'login',
    loadComponent: () => 
      import('./pages/login/login.component').then(c => c.LoginComponent)
  },
  // Include platform routes
  ...platformRoutes,
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];