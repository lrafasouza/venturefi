import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Goal } from './data.service';

export interface AIInsight {
  id: string;
  type: 'recommendation' | 'warning' | 'opportunity' | 'celebration' | 'tip';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  actionText?: string;
  actionType?: 'adjust_goal' | 'add_money' | 'create_goal' | 'view_details' | 'nothing';
  relatedGoalId?: string;
  createdAt: string;
  expiresAt?: string;
  isRead: boolean;
  category: 'planning' | 'progress' | 'optimization' | 'motivation' | 'warning';
  icon: string;
  data?: any;
}

export interface AIRecommendation {
  goalId: string;
  type: 'increase_contribution' | 'adjust_timeline' | 'prioritize' | 'optimize' | 'celebrate';
  title: string;
  description: string;
  impact: string;
  confidence: number; // 0-100
  suggestedAction: string;
  estimatedResult: string;
}

export interface ScenarioSimulation {
  goalId: string;
  scenarios: {
    conservative: {
      monthlyContribution: number;
      estimatedCompletion: string;
      probability: number;
      description: string;
    };
    base: {
      monthlyContribution: number;
      estimatedCompletion: string;
      probability: number;
      description: string;
    };
    optimistic: {
      monthlyContribution: number;
      estimatedCompletion: string;
      probability: number;
      description: string;
    };
  };
  aiRecommendation: string;
}

@Injectable({
  providedIn: 'root'
})
export class AIAssistantService {
  private readonly STORAGE_KEYS = {
    INSIGHTS: 'venturefi_ai_insights',
    RECOMMENDATIONS: 'venturefi_ai_recommendations',
    USER_BEHAVIOR: 'venturefi_user_behavior'
  };

  private insightsSubject = new BehaviorSubject<AIInsight[]>([]);
  private recommendationsSubject = new BehaviorSubject<AIRecommendation[]>([]);
  private userBehaviorSubject = new BehaviorSubject<any>({
    totalContributions: 0,
    averageContribution: 0,
    consistencyScore: 0,
    lastActivity: null,
    preferredContributionDay: 'monday',
    riskTolerance: 'medium'
  });

  public insights$ = this.insightsSubject.asObservable();
  public recommendations$ = this.recommendationsSubject.asObservable();
  public userBehavior$ = this.userBehaviorSubject.asObservable();

  constructor() {
    this.initializeData();
    this.generateDailyInsights();
  }

  private initializeData(): void {
    this.loadInsights();
    this.loadRecommendations();
    this.loadUserBehavior();
  }

  // ============ INSIGHTS GENERATION ============
  generateInsightsForGoals(goals: Goal[], transactions: any[]): AIInsight[] {
    const insights: AIInsight[] = [];
    const now = new Date();

    goals.forEach(goal => {
      const progress = goal.saved / goal.target;
      const deadline = new Date(goal.deadline);
      const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const monthsRemaining = daysRemaining / 30;
      const requiredMonthly = (goal.target - goal.saved) / monthsRemaining;

      // Insight de progresso atrasado
      if (progress < 0.25 && daysRemaining < 90) {
        insights.push({
          id: `behind_${goal.id}`,
          type: 'warning',
          priority: 'high',
          title: '⚠️ Meta em Risco',
          message: `Sua meta "${goal.name}" precisa de atenção! Para alcançar no prazo, você precisa aumentar os aportes para R$ ${requiredMonthly.toFixed(0)}/mês.`,
          actionText: 'Ajustar Meta',
          actionType: 'adjust_goal',
          relatedGoalId: goal.id,
          createdAt: now.toISOString(),
          expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          isRead: false,
          category: 'warning',
          icon: '⚠️'
        });
      }

      // Insight de oportunidade
      if (progress >= 0.75) {
        insights.push({
          id: `opportunity_${goal.id}`,
          type: 'opportunity',
          priority: 'medium',
          title: '🚀 Quase Lá!',
          message: `Parabéns! Você já alcançou ${(progress * 100).toFixed(0)}% da meta "${goal.name}". Que tal fazer um aporte extra para acelerar a conclusão?`,
          actionText: 'Adicionar Valor',
          actionType: 'add_money',
          relatedGoalId: goal.id,
          createdAt: now.toISOString(),
          isRead: false,
          category: 'motivation',
          icon: '🚀'
        });
      }

      // Insight de milestone
      if (progress >= 0.5 && progress < 0.6) {
        insights.push({
          id: `milestone_${goal.id}`,
          type: 'celebration',
          priority: 'medium',
          title: '🎉 Marco Alcançado!',
          message: `Incrível! Você chegou à metade da sua meta "${goal.name}". Continue assim e você chegará lá!`,
          actionText: 'Ver Progresso',
          actionType: 'view_details',
          relatedGoalId: goal.id,
          createdAt: now.toISOString(),
          isRead: false,
          category: 'motivation',
          icon: '🎉'
        });
      }
    });

    // Insight geral de planejamento
    if (goals.length > 0) {
      const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
      const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0);
      const overallProgress = totalSaved / totalTarget;

      if (overallProgress > 0.3) {
        insights.push({
          id: 'general_progress',
          type: 'tip',
          priority: 'low',
          title: '💡 Dica Inteligente',
          message: `Com ${(overallProgress * 100).toFixed(0)}% de progresso geral, você está no caminho certo! Considere criar uma nova meta para manter o momentum.`,
          actionText: 'Nova Meta',
          actionType: 'create_goal',
          createdAt: now.toISOString(),
          isRead: false,
          category: 'planning',
          icon: '💡'
        });
      }
    }

    return insights;
  }

  generateDailyInsights(): void {
    const dailyInsights: AIInsight[] = [
      {
        id: 'daily_motivation',
        type: 'tip',
        priority: 'low',
        title: '🌟 Dica do Dia',
        message: 'Pequenos aportes consistentes são mais efetivos que grandes aportes esporádicos. Considere automatizar suas contribuições!',
        createdAt: new Date().toISOString(),
        isRead: false,
        category: 'motivation',
        icon: '🌟'
      },
      {
        id: 'weekly_review',
        type: 'recommendation',
        priority: 'medium',
        title: '📊 Análise Semanal',
        message: 'Esta semana você fez 3 aportes totalizando R$ 450. Que tal revisar suas metas e ver se pode otimizar alguma?',
        actionText: 'Ver Análise',
        actionType: 'view_details',
        createdAt: new Date().toISOString(),
        isRead: false,
        category: 'optimization',
        icon: '📊'
      }
    ];

    this.addInsights(dailyInsights);
  }

  // ============ SCENARIO SIMULATION ============
  simulateScenarios(goal: Goal): ScenarioSimulation {
    const now = new Date();
    const deadline = new Date(goal.deadline);
    const monthsRemaining = Math.max(1, (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30));
    const remaining = goal.target - goal.saved;

    const conservative = {
      monthlyContribution: Math.ceil(remaining / monthsRemaining * 1.2), // 20% buffer
      estimatedCompletion: new Date(deadline.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      probability: 85,
      description: 'Cenário conservador com folga para imprevistos'
    };

    const base = {
      monthlyContribution: Math.ceil(remaining / monthsRemaining),
      estimatedCompletion: goal.deadline,
      probability: 70,
      description: 'Cenário base seguindo o planejamento original'
    };

    const optimistic = {
      monthlyContribution: Math.ceil(remaining / monthsRemaining * 0.8), // 20% mais agressivo
      estimatedCompletion: new Date(deadline.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      probability: 45,
      description: 'Cenário otimista com contribuições maiores'
    };

    const aiRecommendation = this.generateScenarioRecommendation(goal, { conservative, base, optimistic });

    return {
      goalId: goal.id,
      scenarios: { conservative, base, optimistic },
      aiRecommendation
    };
  }

  private generateScenarioRecommendation(goal: Goal, scenarios: any): string {
    const progress = goal.saved / goal.target;
    
    if (progress < 0.3) {
      return `Recomendo o cenário conservador para esta meta. Com ${(progress * 100).toFixed(0)}% de progresso, é importante garantir que você conseguirá manter a consistência nos aportes.`;
    } else if (progress < 0.7) {
      return `O cenário base parece ideal! Você está em ${(progress * 100).toFixed(0)}% e mantendo essa disciplina chegará no prazo. Considere o otimista se tiver receita extra.`;
    } else {
      return `Você está quase lá com ${(progress * 100).toFixed(0)}%! O cenário otimista pode te ajudar a concluir antes do prazo e liberar recursos para outras metas.`;
    }
  }

  // ============ PERSONALIZED RECOMMENDATIONS ============
  generatePersonalizedRecommendations(goals: Goal[], userBehavior: any): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];

    goals.forEach(goal => {
      const progress = goal.saved / goal.target;
      const isHighPriority = goal.priority === 'high';

      // Recomendação de priorização
      if (isHighPriority && progress < 0.5) {
        recommendations.push({
          goalId: goal.id,
          type: 'prioritize',
          title: 'Foque na Prioridade Alta',
          description: `Sua meta "${goal.name}" tem prioridade alta mas está com progresso de apenas ${(progress * 100).toFixed(0)}%.`,
          impact: 'Alto impacto na realização dos seus sonhos principais',
          confidence: 85,
          suggestedAction: `Concentre 60% dos seus aportes nesta meta nos próximos 2 meses`,
          estimatedResult: `Acelerar conclusão em aproximadamente 3 meses`
        });
      }

      // Recomendação de otimização
      if (goal.actualMonthly > goal.monthlyTarget * 1.5) {
        recommendations.push({
          goalId: goal.id,
          type: 'optimize',
          title: 'Oportunidade de Redistribuição',
          description: `Você está aportando ${((goal.actualMonthly / goal.monthlyTarget - 1) * 100).toFixed(0)}% acima do necessário nesta meta.`,
          impact: 'Pode acelerar outras metas ou criar nova meta',
          confidence: 90,
          suggestedAction: 'Redistribuir R$ 200/mês para outras metas ou criar nova',
          estimatedResult: 'Conclusão de 1-2 metas adicionais por ano'
        });
      }
    });

    return recommendations;
  }

  // ============ SMART NOTIFICATIONS ============
  generateSmartNotifications(goals: Goal[]): string[] {
    const notifications: string[] = [];
    const today = new Date().getDay(); // 0 = domingo, 1 = segunda, etc.

    // Notificação de fim de semana
    if (today === 0 || today === 6) {
      notifications.push('🏖️ Final de semana é um ótimo momento para planejar a semana! Que tal revisar suas metas e definir os aportes?');
    }

    // Notificação de início de mês
    const dayOfMonth = new Date().getDate();
    if (dayOfMonth <= 3) {
      const totalMonthlyTarget = goals.reduce((sum, g) => sum + g.monthlyTarget, 0);
      notifications.push(`🗓️ Novo mês começou! Sua meta de aportes é R$ ${totalMonthlyTarget.toFixed(0)}. Vamos começar forte?`);
    }

    // Notificação de oportunidade
    const behindGoals = goals.filter(g => {
      const progress = g.saved / g.target;
      const deadline = new Date(g.deadline);
      const daysRemaining = (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return progress < 0.5 && daysRemaining < 180;
    });

    if (behindGoals.length > 0) {
      notifications.push(`⚡ ${behindGoals.length} meta(s) precisam de atenção! Acelere os aportes para não perder o prazo.`);
    }

    return notifications;
  }

  // ============ BEHAVIOR ANALYSIS ============
  analyzeUserBehavior(transactions: any[], goals: Goal[]): any {
    const goalTransactions = transactions.filter(t => 
      t.category === 'Investimento/Poupança' && t.type === 'expense'
    );

    const analysis = {
      totalContributions: goalTransactions.length,
      averageContribution: goalTransactions.reduce((sum, t) => sum + t.amount, 0) / goalTransactions.length || 0,
      consistencyScore: this.calculateConsistencyScore(goalTransactions),
      lastActivity: goalTransactions.length > 0 ? goalTransactions[goalTransactions.length - 1].date : null,
      preferredContributionDay: this.getPreferredDay(goalTransactions),
      riskTolerance: this.assessRiskTolerance(goals),
      insights: this.generateBehaviorInsights(goalTransactions, goals)
    };

    this.userBehaviorSubject.next(analysis);
    this.saveUserBehavior(analysis);
    return analysis;
  }

  private calculateConsistencyScore(transactions: any[]): number {
    if (transactions.length < 2) return 0;
    
    // Calcular a variação entre aportes
    const amounts = transactions.map(t => t.amount);
    const mean = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    const variance = amounts.reduce((sum, amount) => sum + Math.pow(amount - mean, 2), 0) / amounts.length;
    const standardDeviation = Math.sqrt(variance);
    const coefficientOfVariation = standardDeviation / mean;
    
    // Converter para score de 0-100 (menor variação = maior consistência)
    return Math.max(0, Math.min(100, 100 - (coefficientOfVariation * 100)));
  }

  private getPreferredDay(transactions: any[]): string {
    const dayCount: { [key: string]: number } = {};
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    transactions.forEach(t => {
      const dayOfWeek = new Date(t.date).getDay();
      const dayName = days[dayOfWeek];
      dayCount[dayName] = (dayCount[dayName] || 0) + 1;
    });

    return Object.keys(dayCount).reduce((a, b) => dayCount[a] > dayCount[b] ? a : b, 'monday');
  }

  private assessRiskTolerance(goals: Goal[]): string {
    const highPriorityGoals = goals.filter(g => g.priority === 'high').length;
    const totalGoals = goals.length;
    const ratio = highPriorityGoals / totalGoals;

    if (ratio > 0.7) return 'conservative';
    if (ratio > 0.4) return 'moderate';
    return 'aggressive';
  }

  private generateBehaviorInsights(transactions: any[], goals: Goal[]): string[] {
    const insights: string[] = [];
    
    if (transactions.length > 10) {
      insights.push('Você tem um histórico consistente de aportes. Continue assim!');
    }
    
    if (goals.length > 3) {
      insights.push('Você é ambicioso com múltiplas metas. Considere priorizar 2-3 principais.');
    }

    return insights;
  }

  // ============ CRUD OPERATIONS ============
  addInsights(insights: AIInsight[]): void {
    const current = this.insightsSubject.value;
    const updated = [...current, ...insights];
    this.insightsSubject.next(updated);
    this.saveInsights(updated);
  }

  markInsightAsRead(insightId: string): void {
    const insights = this.insightsSubject.value.map(insight =>
      insight.id === insightId ? { ...insight, isRead: true } : insight
    );
    this.insightsSubject.next(insights);
    this.saveInsights(insights);
  }

  clearExpiredInsights(): void {
    const now = new Date();
    const active = this.insightsSubject.value.filter(insight =>
      !insight.expiresAt || new Date(insight.expiresAt) > now
    );
    this.insightsSubject.next(active);
    this.saveInsights(active);
  }

  // ============ STORAGE ============
  private loadInsights(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.INSIGHTS);
      if (stored) {
        this.insightsSubject.next(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar insights:', error);
    }
  }

  private saveInsights(insights: AIInsight[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.INSIGHTS, JSON.stringify(insights));
    } catch (error) {
      console.error('Erro ao salvar insights:', error);
    }
  }

  private loadRecommendations(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.RECOMMENDATIONS);
      if (stored) {
        this.recommendationsSubject.next(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar recomendações:', error);
    }
  }

  private saveRecommendations(recommendations: AIRecommendation[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(recommendations));
    } catch (error) {
      console.error('Erro ao salvar recomendações:', error);
    }
  }

  private loadUserBehavior(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.USER_BEHAVIOR);
      if (stored) {
        this.userBehaviorSubject.next(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar comportamento do usuário:', error);
    }
  }

  private saveUserBehavior(behavior: any): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.USER_BEHAVIOR, JSON.stringify(behavior));
    } catch (error) {
      console.error('Erro ao salvar comportamento do usuário:', error);
    }
  }
}