import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'financial-summary' | 'chart' | 'goals' | 'transactions' | 'notifications' | 'quick-actions';
  size: 'small' | 'medium' | 'large';
  position: { row: number; col: number; width: number; height: number };
  visible: boolean;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardWidgetsService {
  private readonly STORAGE_KEY = 'venturefi-dashboard-widgets';
  
  private defaultWidgets: DashboardWidget[] = [
    {
      id: 'balance-card',
      title: 'Saldo Atual',
      type: 'financial-summary',
      size: 'medium',
      position: { row: 0, col: 0, width: 1, height: 1 },
      visible: true,
      data: { value: 12540.50, change: 5.2, icon: 'wallet' }
    },
    {
      id: 'income-card',
      title: 'Receitas',
      type: 'financial-summary',
      size: 'medium',
      position: { row: 0, col: 1, width: 1, height: 1 },
      visible: true,
      data: { value: 8200.00, change: 12.8, icon: 'arrow-trending-up' }
    },
    {
      id: 'expenses-card',
      title: 'Despesas',
      type: 'financial-summary',
      size: 'medium',
      position: { row: 0, col: 2, width: 1, height: 1 },
      visible: true,
      data: { value: 3650.00, change: -2.1, icon: 'arrow-trending-down' }
    },
    {
      id: 'savings-card',
      title: 'Economia',
      type: 'financial-summary',
      size: 'medium',
      position: { row: 0, col: 3, width: 1, height: 1 },
      visible: true,
      data: { value: 4550.00, change: 18.5, icon: 'target' }
    },
    {
      id: 'revenue-chart',
      title: 'Evolução Mensal',
      type: 'chart',
      size: 'large',
      position: { row: 1, col: 0, width: 2, height: 2 },
      visible: true,
      data: {
        chartType: 'line',
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [
          {
            label: 'Receitas',
            data: [5000, 6000, 5500, 7000, 8000, 8200],
            color: '#10B981'
          },
          {
            label: 'Despesas',
            data: [3000, 3200, 3100, 3500, 3800, 3650],
            color: '#F59E0B'
          }
        ]
      }
    },
    {
      id: 'expenses-donut',
      title: 'Gastos por Categoria',
      type: 'chart',
      size: 'medium',
      position: { row: 1, col: 2, width: 2, height: 2 },
      visible: true,
      data: {
        chartType: 'donut',
        labels: ['Alimentação', 'Transporte', 'Moradia', 'Outros'],
        datasets: [
          {
            label: 'Gastos',
            data: [1200, 800, 1000, 650],
            colors: ['#E74C3C', '#F39C12', '#3498DB', '#2ECC71']
          }
        ]
      }
    },
    {
      id: 'dream-goals',
      title: 'Metas de Sonhos',
      type: 'goals',
      size: 'medium',
      position: { row: 3, col: 0, width: 2, height: 2 },
      visible: true,
      data: {
        goals: [
          { name: 'Carro Novo', target: 45000, saved: 15000, percentage: 33 },
          { name: 'Viagem Europa', target: 12000, saved: 7800, percentage: 65 },
          { name: 'Reserva Emergência', target: 20000, saved: 5000, percentage: 25 }
        ]
      }
    },
    {
      id: 'recent-transactions',
      title: 'Transações Recentes',
      type: 'transactions',
      size: 'medium',
      position: { row: 3, col: 2, width: 2, height: 2 },
      visible: true,
      data: {
        transactions: [
          { description: 'Pagamento Cliente', amount: 2500, type: 'income', date: '26/08' },
          { description: 'Material Escritório', amount: -150, type: 'expense', date: '25/08' },
          { description: 'Venda Curso Online', amount: 500, type: 'income', date: '24/08' }
        ]
      }
    },
    {
      id: 'smart-notifications',
      title: 'Notificações Inteligentes',
      type: 'notifications',
      size: 'medium',
      position: { row: 5, col: 0, width: 2, height: 1 },
      visible: true,
      data: {
        notifications: [
          { title: 'Meta alcançada!', message: '65% da sua meta de viagem!', type: 'success' },
          { title: 'Orçamento ultrapassado', message: 'Gastos com alimentação: R$ 1.200', type: 'warning' },
          { title: 'Dica de economia', message: 'Reduza delivery em 30%', type: 'info' }
        ]
      }
    },
    {
      id: 'quick-actions',
      title: 'Ações Rápidas',
      type: 'quick-actions',
      size: 'small',
      position: { row: 5, col: 2, width: 1, height: 1 },
      visible: true,
      data: {
        actions: [
          { label: 'Nova Transação', icon: 'plus', action: 'add-transaction' },
          { label: 'Nova Meta', icon: 'target', action: 'add-goal' },
          { label: 'Ver Relatório', icon: 'presentation-chart-line', action: 'view-report' }
        ]
      }
    }
  ];

  private widgetsSubject = new BehaviorSubject<DashboardWidget[]>(this.getStoredWidgets());
  public widgets$ = this.widgetsSubject.asObservable();

  constructor() { }

  getWidgets(): DashboardWidget[] {
    return this.widgetsSubject.value;
  }

  updateWidgets(widgets: DashboardWidget[]): void {
    this.widgetsSubject.next(widgets);
    this.saveWidgets(widgets);
  }

  updateWidgetPosition(widgetId: string, position: { row: number; col: number; width: number; height: number }): void {
    const widgets = this.getWidgets();
    const widgetIndex = widgets.findIndex(w => w.id === widgetId);
    
    if (widgetIndex !== -1) {
      widgets[widgetIndex].position = position;
      this.updateWidgets(widgets);
    }
  }

  toggleWidgetVisibility(widgetId: string): void {
    const widgets = this.getWidgets();
    const widgetIndex = widgets.findIndex(w => w.id === widgetId);
    
    if (widgetIndex !== -1) {
      widgets[widgetIndex].visible = !widgets[widgetIndex].visible;
      this.updateWidgets(widgets);
    }
  }

  resetToDefault(): void {
    this.updateWidgets([...this.defaultWidgets]);
  }

  getAvailableWidgets(): DashboardWidget[] {
    return [...this.defaultWidgets];
  }

  private getStoredWidgets(): DashboardWidget[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsedWidgets = JSON.parse(stored);
        // Validate stored widgets against default structure
        return this.validateWidgets(parsedWidgets);
      }
    } catch (error) {
      console.warn('Error loading stored widgets, using defaults:', error);
    }
    return [...this.defaultWidgets];
  }

  private saveWidgets(widgets: DashboardWidget[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(widgets));
    } catch (error) {
      console.warn('Error saving widgets:', error);
    }
  }

  private validateWidgets(widgets: any[]): DashboardWidget[] {
    if (!Array.isArray(widgets)) {
      return [...this.defaultWidgets];
    }

    // Ensure all required properties exist
    const validatedWidgets = widgets.filter(widget => 
      widget.id && 
      widget.title && 
      widget.type && 
      widget.position &&
      typeof widget.visible === 'boolean'
    );

    // If validation fails or widgets are missing, return defaults
    if (validatedWidgets.length === 0) {
      return [...this.defaultWidgets];
    }

    return validatedWidgets;
  }
}