# VentureFi Design System Standards

Este documento define os padrões de design e estrutura que **TODOS** os componentes da plataforma VentureFi devem seguir, baseado no componente `dashboard.component.ts` como referência.

## 🎯 Componente de Referência
**Arquivo:** `src/app/pages/dashboard/dashboard.component.ts`

Este componente estabelece o padrão visual, estrutural e de comportamento para toda a plataforma.

---

## 📋 Estrutura Base Obrigatória

### 1. Container Principal
```html
<div class="dashboard-container">
  <!-- Mobile Header -->
  <header class="mobile-header">
    <!-- Controles mobile obrigatórios -->
  </header>

  <!-- Mobile Menu Overlay -->
  <div class="mobile-overlay" *ngIf="isMobileMenuOpen" (click)="closeMobileMenu()"></div>

  <!-- Sidebar Navigation -->
  <aside class="sidebar" [class.mobile-open]="isMobileMenuOpen">
    <!-- Estrutura sidebar padrão -->
  </aside>
  
  <!-- Main Content Area -->
  <main class="main-content">
    <!-- Conteúdo específico de cada página -->
  </main>
</div>
```

### 2. Layout CSS Grid Obrigatório
```scss
.dashboard-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
  background: var(--bg-tertiary);
  overflow: hidden;
}
```

---

## 🎨 Padrões Visuais Obrigatórios

### Header Pattern
```html
<header class="dashboard-header">
  <div class="header-content">
    <div class="welcome-section">
      <h1>[Título da Página]</h1>
      <p>[Subtítulo/Descrição]</p>
    </div>
    <div class="header-actions">
      <!-- Botões de ação específicos da página -->
    </div>
  </div>
</header>
```

### Card Components Padrão
```html
<!-- KPI Cards -->
<div class="kpi-card hover-lift">
  <div class="kpi-header">
    <div class="kpi-icon [tipo]">
      <app-icon name="[icon]" size="20"></app-icon>
    </div>
    <div class="kpi-trend [up/down]">
      <!-- Indicadores de tendência -->
    </div>
  </div>
  <div class="kpi-content">
    <div class="kpi-label">[Label]</div>
    <div class="kpi-value">[Valor]</div>
    <div class="kpi-subtitle">[Subtítulo]</div>
  </div>
</div>

<!-- Custom Widgets -->
<div class="custom-widget [tipo]-widget">
  <div class="widget-header">
    <h3>[Título do Widget]</h3>
    <!-- Controles opcionais -->
  </div>
  <!-- Conteúdo específico -->
</div>
```

---

## 🎯 Sidebar Navigation (Obrigatório em Todas as Páginas)

### Estrutura HTML
```html
<aside class="sidebar" [class.mobile-open]="isMobileMenuOpen">
  <div class="sidebar-header">
    <h2>VentureFi</h2>
  </div>
  <nav class="sidebar-nav">
    <ul>
      <li><a routerLink="/platform/dashboard" class="nav-link" [class.active]="currentPage === 'dashboard'">
        <span class="nav-icon">
          <app-icon name="chart-bar" size="20" className="icon-primary"></app-icon>
        </span>
        <span>Dashboard</span>
      </a></li>
      <li><a routerLink="/platform/dream-pursuit" class="nav-link" [class.active]="currentPage === 'dream-pursuit'">
        <span class="nav-icon">
          <app-icon name="target" size="20"></app-icon>
        </span>
        <span>Em Busca do Sonho</span>
      </a></li>
      <li><a routerLink="/platform/transacoes" class="nav-link" [class.active]="currentPage === 'transacoes'">
        <span class="nav-icon">
          <app-icon name="banknotes" size="20"></app-icon>
        </span>
        <span>Transações</span>
      </a></li>
      <li><a routerLink="/platform/relatorios" class="nav-link" [class.active]="currentPage === 'relatorios'">
        <span class="nav-icon">
          <app-icon name="presentation-chart-line" size="20"></app-icon>
        </span>
        <span>Relatórios</span>
      </a></li>
      <li><a routerLink="/platform/notificacoes" class="nav-link" [class.active]="currentPage === 'notificacoes'">
        <span class="nav-icon">
          <app-icon name="bell" size="20"></app-icon>
        </span>
        <span>Notificações</span>
        <span class="notification-badge">3</span>
      </a></li>
      <li><a routerLink="/platform/configuracoes" class="nav-link" [class.active]="currentPage === 'configuracoes'">
        <span class="nav-icon">
          <app-icon name="cog" size="20"></app-icon>
        </span>
        <span>Configurações</span>
      </a></li>
    </ul>
  </nav>
  <div class="sidebar-footer">
    <div class="user-profile">
      <div class="user-avatar">RN</div>
      <div class="user-info">
        <div class="user-name">Rafael Nascimento</div>
        <div class="user-plan">Plano Free</div>
      </div>
    </div>
    <a routerLink="/home" class="logout-btn">
      <app-icon name="logout" size="18"></app-icon>
      <span>Sair</span>
    </a>
  </div>
</aside>
```

---

## 📱 Mobile Header (Obrigatório)

```html
<header class="mobile-header">
  <button class="mobile-menu-toggle" (click)="toggleMobileMenu()">
    <app-icon [name]="isMobileMenuOpen ? 'x-mark' : 'bars-3'" size="24"></app-icon>
  </button>
  <h2 class="mobile-logo">VentureFi</h2>
  <div class="mobile-user">
    <div class="user-avatar">RN</div>
  </div>
</header>
```

---

## 🎨 CSS Classes Padrão Obrigatórias

### Layout Classes
- `.dashboard-container` - Container principal
- `.sidebar` - Navegação lateral
- `.main-content` - Área de conteúdo
- `.dashboard-header` - Header da página
- `.dashboard-content` - Conteúdo da página

### Component Classes
- `.kpi-card` - Cards de KPIs/métricas
- `.custom-widget` - Widgets customizados
- `.global-filters` - Container de filtros
- `.filter-select` / `.filter-date` - Inputs de filtro

### Interactive Classes
- `.hover-lift` - Efeito hover de elevação
- `.hover-scale` - Efeito hover de escala
- `.hover-glow` - Efeito hover com brilho
- `.focus-ring` - Ring de foco para acessibilidade

### State Classes
- `.active` - Estado ativo de navegação
- `.highlight` - Destaque visual
- `.mobile-open` - Estado mobile aberto

---

## 📐 Design System Values

### Border Radius
- Cards principais: `var(--radius-xl)`
- Botões/inputs: `var(--radius-lg)`
- Tags/badges: `var(--radius-full)`

### Shadows
- Hover state: `var(--shadow-md)`
- Cards normais: `var(--shadow-sm)`
- Elementos arrastáveis: `var(--shadow-lg)`

### Spacing
- Padding interno de cards: `var(--space-6)`
- Gap entre elementos: `var(--space-4)`
- Margens menores: `var(--space-3)`

### Colors
- Background principal: `var(--bg-primary)`
- Background secundário: `var(--bg-secondary)`
- Background terciário: `var(--bg-tertiary)`
- Bordas: `var(--border-primary)`
- Texto: `var(--text-primary)`, `var(--text-secondary)`, `var(--text-tertiary)`
- Accent: `var(--accent-blue)`, `var(--accent-green)`, `var(--accent-red)`

---

## 📱 Responsive Design Obrigatório

### Breakpoints
```scss
// Tablet
@media (max-width: 1024px) {
  .dashboard-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
  
  .mobile-header { display: flex; }
  .sidebar { /* mobile positioning */ }
}

// Mobile
@media (max-width: 640px) {
  .widgets-container {
    grid-template-columns: 1fr;
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
}
```

---

## ⚙️ TypeScript Component Structure

### Propriedades Obrigatórias
```typescript
export class [PageName]Component implements OnInit {
  // Mobile menu state (obrigatório)
  isMobileMenuOpen = false;
  
  // Current page identifier (obrigatório para navigation active state)
  currentPage = '[page-identifier]';
  
  // Mobile menu methods (obrigatórios)
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
```

### Imports Obrigatórios
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
```

---

## 🎯 Componentes que Devem Seguir Este Padrão

### ❌ Componentes Não Conformes (Para Corrigir)
1. **`dream-pursuit.component.ts`** - Em Busca do Sonho
2. **`transacoes.component.ts`** - Transações  
3. **`relatorios.component.ts`** - Relatórios
4. **`notificacoes.component.ts`** - Notificações
5. **`configuracoes.component.ts`** - Configurações

### ✅ Componente Padrão (Referência)
- **`dashboard.component.ts`** - Dashboard Principal

---

## 🔧 Checklist de Padronização

Para cada componente, verificar:

- [ ] Usa estrutura `.dashboard-container` com CSS Grid
- [ ] Implementa `.mobile-header` e controles mobile
- [ ] Tem sidebar completa com navegação
- [ ] Usa `.dashboard-header` com welcome section
- [ ] Cards seguem padrão `.kpi-card` / `.custom-widget`
- [ ] Implementa classes de interação (hover, focus)
- [ ] Responsive design com breakpoints corretos
- [ ] TypeScript com propriedades mobile obrigatórias
- [ ] Imports dos componentes shared corretos
- [ ] Navegação ativa baseada em `currentPage`

---

## 📝 Notas Importantes

1. **NUNCA** remover a sidebar ou mobile header de qualquer página da plataforma
2. **SEMPRE** manter a estrutura de grid CSS obrigatória
3. **SEMPRE** implementar os controles mobile (menu toggle, overlay)
4. **SEMPRE** usar as CSS custom properties para cores e espaçamentos
5. **SEMPRE** manter a navegação ativa sincronizada com a página atual

Este padrão garante consistência visual e UX em toda a plataforma VentureFi.