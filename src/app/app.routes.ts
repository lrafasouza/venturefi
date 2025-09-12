import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  
  // Simple home page - just button to onboarding
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  
  // Website routes with header/footer (kept for potential future use)
  {
    path: 'website',
    loadComponent: () => import('./layouts/website-layout.component').then(m => m.WebsiteLayoutComponent),
    children: [
      { path: 'features', loadComponent: () => import('./pages/features/features.component').then(m => m.FeaturesComponent) },
      { path: 'pricing', loadComponent: () => import('./pages/pricing/pricing.component').then(m => m.PricingComponent) },
      { path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
      { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) }
    ]
  },
  
  // Login route without header/footer
  {
    path: 'login',
    loadComponent: () => import('./layouts/login-layout.component').then(m => m.LoginLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) }
    ]
  },
  
  // Onboarding route (standalone)
  {
    path: 'onboarding',
    loadComponent: () => import('./pages/onboarding/onboarding.component').then(m => m.OnboardingComponent)
  },
  
  // Platform routes without website header/footer
  {
    path: 'platform',
    loadComponent: () => import('./layouts/platform-layout.component').then(m => m.PlatformLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'dream-pursuit', loadComponent: () => import('./pages/dream-pursuit/dream-pursuit-super.component').then(m => m.DreamPursuitSuperComponent) },
      { path: 'open-finance', loadComponent: () => import('./pages/open-finance/open-finance').then(m => m.OpenFinanceComponent) },
      { path: 'transacoes', loadComponent: () => import('./pages/transacoes/transacoes.component').then(m => m.TransacoesComponent) },
      { path: 'relatorios', loadComponent: () => import('./pages/relatorios/relatorios.component').then(m => m.RelatoriosComponent) },
      { path: 'notificacoes', loadComponent: () => import('./pages/notificacoes/notificacoes.component').then(m => m.NotificacoesComponent) },
      { path: 'configuracoes', loadComponent: () => import('./pages/configuracoes/configuracoes.component').then(m => m.ConfiguracoesComponent) }
    ]
  },
  
  { path: '**', redirectTo: '/home' }
];