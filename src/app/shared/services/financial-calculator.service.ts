import { Injectable } from '@angular/core';
import { Transaction, Goal } from './data.service';

export interface KPIData {
  totalRevenue: number;
  totalExpenses: number;
  netBalance: number;
  revenueTransactions: number;
  expenseTransactions: number;
  totalTransactions: number;
  profitMargin: number;
  averageTicket: number;
  salesCount: number;
}

export interface GoalAnalysis {
  id: string;
  percentage: number;
  monthsRemaining: number;
  status: 'ahead' | 'on-track' | 'behind' | 'completed';
  expectedMonthly: number;
  actualMonthly: number;
  daysToDeadline: number;
  isDelayed: boolean;
  isAhead: boolean;
  isBehind: boolean;
  completionForecast: string;
}

export interface PeriodFilter {
  type: 'mes-atual' | 'mes-anterior' | 'ultimos-30-dias' | 'ultimos-90-dias' | 'ano-atual' | 'personalizado';
  customFrom?: string;
  customTo?: string;
}

export interface CategoryData {
  name: string;
  value: number;
  percentage: number;
  color: string;
  transactions: number;
  startAngle: number;
}

@Injectable({
  providedIn: 'root'
})
export class FinancialCalculatorService {
  private readonly CATEGORY_COLORS = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', 
    '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'
  ];

  constructor() {}

  // ============ KPIs DASHBOARD ============
  calculateKPIs(
    transactions: Transaction[], 
    period: PeriodFilter, 
    origin: 'personal' | 'business' | 'both' = 'both'
  ): KPIData {
    const filteredTransactions = this.filterTransactionsByPeriodAndOrigin(transactions, period, origin);

    const revenues = filteredTransactions.filter(t => t.type === 'income');
    const expenses = filteredTransactions.filter(t => t.type === 'expense');

    const totalRevenue = revenues.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalRevenue - totalExpenses;

    // Calcular margem de lucro (apenas para negócios)
    const profitMargin = totalRevenue > 0 ? Math.round((netBalance / totalRevenue) * 100) : 0;

    // Ticket médio (média das receitas)
    const averageTicket = revenues.length > 0 ? totalRevenue / revenues.length : 0;

    return {
      totalRevenue,
      totalExpenses,
      netBalance,
      revenueTransactions: revenues.length,
      expenseTransactions: expenses.length,
      totalTransactions: filteredTransactions.length,
      profitMargin: Math.max(0, profitMargin),
      averageTicket,
      salesCount: revenues.length
    };
  }

  // ============ ANÁLISE POR CATEGORIAS ============
  analyzeExpenseCategories(
    transactions: Transaction[],
    period: PeriodFilter,
    origin: 'personal' | 'business' | 'both' = 'both'
  ): CategoryData[] {
    const filteredTransactions = this.filterTransactionsByPeriodAndOrigin(transactions, period, origin);
    const expenses = filteredTransactions.filter(t => t.type === 'expense');

    const categoryTotals = new Map<string, { amount: number; count: number }>();
    
    expenses.forEach(expense => {
      const current = categoryTotals.get(expense.category) || { amount: 0, count: 0 };
      categoryTotals.set(expense.category, {
        amount: current.amount + expense.amount,
        count: current.count + 1
      });
    });

    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    const categories = Array.from(categoryTotals.entries())
      .map(([category, data], index) => ({
        name: category,
        value: data.amount,
        percentage: totalExpenses > 0 ? Math.round((data.amount / totalExpenses) * 100) : 0,
        color: this.CATEGORY_COLORS[index % this.CATEGORY_COLORS.length],
        transactions: data.count
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Máximo 8 categorias para visualização
    
    // Calcular startAngle para gráfico de pizza
    let currentAngle = 0;
    return categories.map(category => {
      const categoryWithAngle = {
        ...category,
        startAngle: currentAngle
      };
      currentAngle += (category.percentage / 100) * 360;
      return categoryWithAngle;
    });
  }

  // ============ ANÁLISE INTEGRADA (METAS + FINANÇAS) ============
  calculateIntegratedFinancialHealth(
    transactions: Transaction[], 
    goals: Goal[], 
    period: PeriodFilter
  ): {
    availableForGoals: number;
    monthlyCommitmentToGoals: number;
    financialCapacity: 'excellent' | 'good' | 'limited' | 'critical';
    recommendedGoalBudget: number;
    goalImpactOnBudget: number;
  } {
    const kpis = this.calculateKPIs(transactions, period, 'both');
    const activeGoals = goals.filter(g => !g.completed);
    
    const monthlyCommitmentToGoals = activeGoals.reduce((sum, goal) => sum + goal.monthlyTarget, 0);
    const availableForGoals = Math.max(0, kpis.netBalance - monthlyCommitmentToGoals);
    const goalImpactOnBudget = kpis.totalRevenue > 0 ? (monthlyCommitmentToGoals / kpis.totalRevenue) * 100 : 0;
    
    // Calcular capacidade financeira
    let financialCapacity: 'excellent' | 'good' | 'limited' | 'critical';
    const budgetRatio = goalImpactOnBudget;
    
    if (budgetRatio < 20) {
      financialCapacity = 'excellent';
    } else if (budgetRatio < 40) {
      financialCapacity = 'good';
    } else if (budgetRatio < 60) {
      financialCapacity = 'limited';
    } else {
      financialCapacity = 'critical';
    }
    
    // Recomendação de orçamento para metas (máximo 30% da receita)
    const recommendedGoalBudget = kpis.totalRevenue * 0.3;
    
    return {
      availableForGoals,
      monthlyCommitmentToGoals,
      financialCapacity,
      recommendedGoalBudget,
      goalImpactOnBudget
    };
  }

  // ============ ANÁLISE DE METAS ============
  analyzeGoals(goals: Goal[]): {
    totalInGoals: number;
    totalSaved: number;
    activeGoals: number;
    overallProgress: number;
    nextGoal: Goal | null;
    goalAnalysis: GoalAnalysis[];
  } {
    const activeGoals = goals.filter(g => !g.completed);
    
    const totalInGoals = goals.reduce((sum, g) => sum + g.target, 0);
    const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0);
    const overallProgress = totalInGoals > 0 ? Math.round((totalSaved / totalInGoals) * 100) : 0;

    // Próxima meta (com menor prazo)
    const nextGoal = activeGoals
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0] || null;

    const goalAnalysis = goals.map(goal => this.analyzeIndividualGoal(goal));

    return {
      totalInGoals,
      totalSaved,
      activeGoals: activeGoals.length,
      overallProgress,
      nextGoal,
      goalAnalysis
    };
  }

  analyzeIndividualGoal(goal: Goal): GoalAnalysis {
    const now = new Date();
    const deadline = new Date(goal.deadline);
    const daysToDeadline = Math.max(0, Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const monthsRemaining = Math.max(0, Math.ceil(daysToDeadline / 30));
    
    const percentage = goal.target > 0 ? Math.round((goal.saved / goal.target) * 100) : 0;
    const remaining = goal.target - goal.saved;
    const expectedMonthly = monthsRemaining > 0 ? remaining / monthsRemaining : 0;
    
    // Status baseado no progresso vs tempo decorrido
    let status: GoalAnalysis['status'];
    if (goal.completed) {
      status = 'completed';
    } else {
      const createdAt = new Date(goal.createdAt);
      const totalDays = Math.floor((deadline.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      const elapsedDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      const expectedProgress = totalDays > 0 ? (elapsedDays / totalDays) * 100 : 0;
      
      if (percentage >= expectedProgress * 1.1) {
        status = 'ahead';
      } else if (percentage >= expectedProgress * 0.9) {
        status = 'on-track';
      } else {
        status = 'behind';
      }
    }
    
    // Previsão de conclusão
    let completionForecast = goal.deadline;
    if (!goal.completed && goal.actualMonthly > 0) {
      const remainingAmount = goal.target - goal.saved;
      const monthsToComplete = Math.ceil(remainingAmount / goal.actualMonthly);
      const forecastDate = new Date();
      forecastDate.setMonth(forecastDate.getMonth() + monthsToComplete);
      completionForecast = forecastDate.toISOString().split('T')[0];
    }

    return {
      id: goal.id,
      percentage,
      monthsRemaining,
      status,
      expectedMonthly,
      actualMonthly: goal.actualMonthly,
      daysToDeadline,
      isDelayed: new Date(completionForecast) > deadline,
      isAhead: status === 'ahead',
      isBehind: status === 'behind',
      completionForecast
    };
  }

  // ============ ALERTAS INTELIGENTES ============
  generateSmartAlerts(
    kpis: KPIData,
    goals: Goal[],
    goalAnalysis: GoalAnalysis[],
    origin: 'personal' | 'business' | 'both'
  ): any[] {
    const alerts: any[] = [];

    // Alert 1: Saldo negativo
    if (kpis.netBalance < 0) {
      alerts.push({
        id: 'negative-balance',
        type: 'danger',
        icon: 'exclamation-triangle',
        title: 'Saldo Negativo Crítico',
        message: `Suas despesas superaram as receitas em R$ ${this.formatCurrency(Math.abs(kpis.netBalance))}. Ação imediata necessária.`,
        priority: 'high',
        actions: [
          { label: 'Analisar Gastos', action: 'navigate', data: '/platform/relatorios' },
          { label: 'Ver Transações', action: 'navigate', data: '/platform/transacoes' }
        ]
      });
    }

    // Alert 2: Despesas muito altas
    if (kpis.totalExpenses > kpis.totalRevenue * 0.8) {
      alerts.push({
        id: 'high-expense-ratio',
        type: 'warning',
        icon: 'exclamation-triangle',
        title: 'Taxa de Gastos Elevada',
        message: `Suas despesas representam ${Math.round((kpis.totalExpenses / kpis.totalRevenue) * 100)}% da receita. O ideal é manter abaixo de 70%.`,
        priority: 'medium',
        actions: [
          { label: 'Otimizar Custos', action: 'navigate', data: '/platform/relatorios' }
        ]
      });
    }

    // Alert 3: Margem de lucro baixa (negócios)
    if ((origin === 'business' || origin === 'both') && kpis.profitMargin < 20 && kpis.profitMargin > 0) {
      alerts.push({
        id: 'low-profit-margin',
        type: 'warning',
        icon: 'chart-pie',
        title: 'Margem de Lucro Baixa',
        message: `Margem atual: ${kpis.profitMargin}%. Para sustentabilidade, recomenda-se manter acima de 20%.`,
        priority: 'medium',
        actions: [
          { label: 'Revisar Preços', action: 'modal', data: 'pricing-analysis' },
          { label: 'Analisar Custos', action: 'navigate', data: '/platform/relatorios' }
        ]
      });
    }

    // Alert 4: Metas em atraso
    const delayedGoals = goalAnalysis.filter(g => g.status === 'behind' && !goals.find(goal => goal.id === g.id)?.completed);
    if (delayedGoals.length > 0) {
      alerts.push({
        id: 'delayed-goals',
        type: 'warning',
        icon: 'clock',
        title: `${delayedGoals.length} Meta${delayedGoals.length > 1 ? 's' : ''} em Atraso`,
        message: `Algumas metas estão abaixo do progresso esperado. Ajuste necessário nos aportes.`,
        priority: 'medium',
        actions: [
          { label: 'Ver Metas', action: 'navigate', data: '/platform/dream-pursuit' },
          { label: 'Ajustar Aportes', action: 'modal', data: 'adjust-contributions' }
        ]
      });
    }

    // Alert 5: Oportunidade de investimento
    if (kpis.netBalance > 5000 && kpis.totalRevenue > 10000) {
      alerts.push({
        id: 'investment-opportunity',
        type: 'success',
        icon: 'light-bulb',
        title: 'Oportunidade de Crescimento',
        message: `Com saldo positivo de R$ ${this.formatCurrency(kpis.netBalance)}, considere diversificar em investimentos.`,
        priority: 'low',
        actions: [
          { label: 'Simular Investimento', action: 'modal', data: 'investment-simulator' },
          { label: 'Nova Meta', action: 'navigate', data: '/platform/dream-pursuit' }
        ]
      });
    }

    // Alert 6: Meta próxima da conclusão
    const nearCompletionGoals = goalAnalysis.filter(g => g.percentage >= 90 && g.percentage < 100);
    if (nearCompletionGoals.length > 0) {
      const goal = goals.find(g => g.id === nearCompletionGoals[0].id);
      alerts.push({
        id: 'goal-near-completion',
        type: 'success',
        icon: 'trophy',
        title: 'Meta Quase Concluída!',
        message: `${goal?.name} está ${nearCompletionGoals[0].percentage}% completa. Faltam apenas R$ ${this.formatCurrency(goal!.target - goal!.saved)}!`,
        priority: 'high',
        actions: [
          { label: 'Finalizar Meta', action: 'modal', data: `complete-goal-${goal?.id}` },
          { label: 'Ver Progresso', action: 'navigate', data: '/platform/dream-pursuit' }
        ]
      });
    }

    // Alert 7: Comprometimento alto com metas
    const monthlyCommitmentToGoals = goals.filter(g => !g.completed).reduce((sum, g) => sum + g.monthlyTarget, 0);
    const commitmentRatio = kpis.totalRevenue > 0 ? (monthlyCommitmentToGoals / kpis.totalRevenue) * 100 : 0;
    
    if (commitmentRatio > 50) {
      alerts.push({
        id: 'high-goal-commitment',
        type: 'warning',
        icon: 'exclamation-triangle',
        title: 'Alto Comprometimento com Metas',
        message: `${Math.round(commitmentRatio)}% da sua receita está comprometida com metas. Considere reajustar os aportes.`,
        priority: 'medium',
        actions: [
          { label: 'Revisar Metas', action: 'navigate', data: '/platform/dream-pursuit' },
          { label: 'Ajustar Aportes', action: 'modal', data: 'adjust-goal-contributions' }
        ]
      });
    }

    // Alert 8: Capacidade para nova meta
    if (kpis.netBalance > 2000 && commitmentRatio < 30 && goals.filter(g => !g.completed).length < 5) {
      alerts.push({
        id: 'new-goal-opportunity',
        type: 'info',
        icon: 'light-bulb',
        title: 'Oportunidade para Nova Meta',
        message: `Com saldo positivo de R$ ${this.formatCurrency(kpis.netBalance)}, você pode criar uma nova meta com aporte mensal de até R$ ${this.formatCurrency((kpis.netBalance * 0.3))}.`,
        priority: 'low',
        actions: [
          { label: 'Criar Nova Meta', action: 'navigate', data: '/platform/dream-pursuit' }
        ]
      });
    }

    // Ordenar por prioridade
    const priorityOrder: { [key: string]: number } = { 'high': 3, 'medium': 2, 'low': 1 };
    return alerts.sort((a, b) => (priorityOrder[b.priority] || 1) - (priorityOrder[a.priority] || 1));
  }

  // ============ UTILITÁRIOS ============
  private filterTransactionsByPeriodAndOrigin(
    transactions: Transaction[],
    period: PeriodFilter,
    origin: 'personal' | 'business' | 'both'
  ): Transaction[] {
    let filtered = [...transactions];

    // Filtrar por origem
    if (origin !== 'both') {
      filtered = filtered.filter(t => t.origin === origin);
    }

    // Filtrar por período
    const now = new Date();
    const { startDate, endDate } = this.getPeriodDates(period, now);

    filtered = filtered.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    return filtered;
  }

  private getPeriodDates(period: PeriodFilter, now: Date): { startDate: Date; endDate: Date } {
    const endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999);
    
    let startDate = new Date();

    switch (period.type) {
      case 'mes-atual':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      
      case 'mes-anterior':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate.setFullYear(now.getFullYear(), now.getMonth(), 0);
        break;
      
      case 'ultimos-30-dias':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        break;
      
      case 'ultimos-90-dias':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 90);
        break;
      
      case 'ano-atual':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      
      case 'personalizado':
        if (period.customFrom) {
          startDate = new Date(period.customFrom);
        }
        if (period.customTo) {
          endDate.setTime(new Date(period.customTo).getTime());
          endDate.setHours(23, 59, 59, 999);
        }
        break;
      
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    startDate.setHours(0, 0, 0, 0);
    return { startDate, endDate };
  }

  formatCurrency(value: number): string {
    return Math.abs(value).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  formatPercentage(value: number): string {
    return `${Math.round(value)}%`;
  }

  // ============ CÁLCULOS DE META ============
  calculateMonthlyTarget(target: number, saved: number, deadline: string): number {
    const remaining = target - saved;
    const now = new Date();
    const deadlineDate = new Date(deadline);
    
    const monthsRemaining = Math.max(1, Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    
    return remaining / monthsRemaining;
  }

  calculateGoalDeadline(target: number, monthlyContribution: number, currentSaved: number = 0): string {
    const remaining = target - currentSaved;
    const monthsNeeded = Math.ceil(remaining / monthlyContribution);
    
    const deadline = new Date();
    deadline.setMonth(deadline.getMonth() + monthsNeeded);
    
    return deadline.toISOString().split('T')[0];
  }

  validateGoal(goal: Partial<Goal>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!goal.name || goal.name.trim().length < 2) {
      errors.push('Nome da meta deve ter pelo menos 2 caracteres');
    }

    if (!goal.target || goal.target <= 0) {
      errors.push('Valor da meta deve ser maior que zero');
    }

    if (!goal.deadline) {
      errors.push('Prazo deve ser informado');
    } else {
      const deadline = new Date(goal.deadline);
      const now = new Date();
      if (deadline <= now) {
        errors.push('Prazo deve ser no futuro');
      }
    }

    if (!goal.monthlyTarget || goal.monthlyTarget <= 0) {
      errors.push('Aporte mensal deve ser maior que zero');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}