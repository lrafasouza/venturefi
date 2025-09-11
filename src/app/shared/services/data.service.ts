import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  origin: 'personal' | 'business';
  date: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  icon: string;
  origin: 'personal' | 'business';
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  completed: boolean;
  monthlyTarget: number;
  actualMonthly: number;
  lastKnownPercentage?: number;
  isFavorite?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly STORAGE_KEYS = {
    TRANSACTIONS: 'venturefi_transactions',
    GOALS: 'venturefi_goals',
    USER_PROFILE: 'venturefi_user'
  };

  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  private goalsSubject = new BehaviorSubject<Goal[]>([]);

  public transactions$ = this.transactionsSubject.asObservable();
  public goals$ = this.goalsSubject.asObservable();

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    this.loadTransactions();
    this.loadGoals();
    
    // Se não houver dados, criar dados iniciais
    if (this.transactionsSubject.value.length === 0) {
      this.createInitialTransactions();
    }
    
    if (this.goalsSubject.value.length === 0) {
      this.createInitialGoals();
    }
  }

  // ============ TRANSAÇÕES ============
  getTransactions(): Transaction[] {
    return this.transactionsSubject.value;
  }

  addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): void {
    const newTransaction: Transaction = {
      ...transaction,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };

    const transactions = [...this.transactionsSubject.value, newTransaction];
    this.transactionsSubject.next(transactions);
    this.saveTransactions(transactions);
  }

  updateTransaction(id: string, updates: Partial<Transaction>): void {
    const transactions = this.transactionsSubject.value.map(t => 
      t.id === id ? { ...t, ...updates } : t
    );
    this.transactionsSubject.next(transactions);
    this.saveTransactions(transactions);
  }

  deleteTransaction(id: string): void {
    const transactions = this.transactionsSubject.value.filter(t => t.id !== id);
    this.transactionsSubject.next(transactions);
    this.saveTransactions(transactions);
  }

  private loadTransactions(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.TRANSACTIONS);
      if (stored) {
        const transactions = JSON.parse(stored);
        this.transactionsSubject.next(transactions);
      }
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    }
  }

  private saveTransactions(transactions: Transaction[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (error) {
      console.error('Erro ao salvar transações:', error);
    }
  }

  // ============ METAS ============
  getGoals(): Goal[] {
    return this.goalsSubject.value;
  }

  addGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'saved' | 'completed' | 'actualMonthly'>): void {
    const newGoal: Goal = {
      ...goal,
      id: this.generateId(),
      saved: 0,
      completed: false,
      actualMonthly: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const goals = [...this.goalsSubject.value, newGoal];
    this.goalsSubject.next(goals);
    this.saveGoals(goals);
  }

  updateGoal(id: string, updates: Partial<Goal>): void {
    const goals = this.goalsSubject.value.map(g => 
      g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
    );
    this.goalsSubject.next(goals);
    this.saveGoals(goals);
  }

  deleteGoal(id: string): void {
    const goals = this.goalsSubject.value.filter(g => g.id !== id);
    this.goalsSubject.next(goals);
    this.saveGoals(goals);
  }

  addToGoalSavings(goalId: string, amount: number): void {
    const goals = this.goalsSubject.value.map(goal => {
      if (goal.id === goalId) {
        const newSaved = goal.saved + amount;
        const completed = newSaved >= goal.target;
        return {
          ...goal,
          saved: newSaved,
          completed,
          actualMonthly: this.calculateActualMonthlyContribution(goal),
          updatedAt: new Date().toISOString()
        };
      }
      return goal;
    });
    
    this.goalsSubject.next(goals);
    this.saveGoals(goals);
    
    // Criar transação automática para o aporte
    this.createGoalContributionTransaction(goalId, amount);
  }

  private createGoalContributionTransaction(goalId: string, amount: number): void {
    const goal = this.goalsSubject.value.find(g => g.id === goalId);
    if (!goal) return;

    this.addTransaction({
      description: `Aporte - ${goal.name}`,
      amount: amount,
      type: 'expense',
      category: 'Investimento/Poupança',
      origin: goal.origin,
      date: new Date().toISOString().split('T')[0]
    });
  }

  private calculateActualMonthlyContribution(goal: Goal): number {
    const transactions = this.transactionsSubject.value;
    const goalTransactions = transactions.filter(t => 
      t.description.includes(goal.name) && 
      t.category === 'Investimento/Poupança' &&
      t.type === 'expense'
    );

    if (goalTransactions.length === 0) return 0;

    const createdAt = new Date(goal.createdAt);
    const now = new Date();
    const monthsElapsed = Math.max(1, (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    const totalContributed = goalTransactions.reduce((sum, t) => sum + t.amount, 0);
    return totalContributed / monthsElapsed;
  }

  private loadGoals(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.GOALS);
      if (stored) {
        const goals = JSON.parse(stored);
        this.goalsSubject.next(goals);
      }
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    }
  }

  private saveGoals(goals: Goal[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.GOALS, JSON.stringify(goals));
    } catch (error) {
      console.error('Erro ao salvar metas:', error);
    }
  }

  // ============ UTILITÁRIOS ============
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  clearAllData(): void {
    localStorage.removeItem(this.STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(this.STORAGE_KEYS.GOALS);
    this.transactionsSubject.next([]);
    this.goalsSubject.next([]);
  }

  exportData(): string {
    const data = {
      transactions: this.transactionsSubject.value,
      goals: this.goalsSubject.value,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.transactions && Array.isArray(data.transactions)) {
        this.transactionsSubject.next(data.transactions);
        this.saveTransactions(data.transactions);
      }
      
      if (data.goals && Array.isArray(data.goals)) {
        this.goalsSubject.next(data.goals);
        this.saveGoals(data.goals);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  }

  // ============ DADOS INICIAIS ============
  private createInitialTransactions(): void {
    const initialTransactions: Transaction[] = [
      {
        id: '1',
        description: 'Freelance - Desenvolvimento Web',
        amount: 3500.00,
        type: 'income',
        category: 'Freelance',
        origin: 'business',
        date: '2025-01-28',
        createdAt: '2025-01-28T10:00:00.000Z'
      },
      {
        id: '2',
        description: 'Salário - Empresa Tech',
        amount: 5200.00,
        type: 'income',
        category: 'Salário',
        origin: 'personal',
        date: '2025-01-25',
        createdAt: '2025-01-25T09:00:00.000Z'
      },
      {
        id: '3',
        description: 'Consultoria - Projeto Mobile',
        amount: 2800.00,
        type: 'income',
        category: 'Consultoria',
        origin: 'business',
        date: '2025-01-20',
        createdAt: '2025-01-20T14:30:00.000Z'
      },
      {
        id: '4',
        description: 'Aluguel Apartamento',
        amount: 1800.00,
        type: 'expense',
        category: 'Moradia',
        origin: 'personal',
        date: '2025-01-05',
        createdAt: '2025-01-05T08:00:00.000Z'
      },
      {
        id: '5',
        description: 'Supermercado - Compras Mensais',
        amount: 680.50,
        type: 'expense',
        category: 'Alimentação',
        origin: 'personal',
        date: '2025-01-15',
        createdAt: '2025-01-15T16:45:00.000Z'
      },
      {
        id: '6',
        description: 'Software Adobe Creative Suite',
        amount: 150.00,
        type: 'expense',
        category: 'Ferramentas',
        origin: 'business',
        date: '2025-01-10',
        createdAt: '2025-01-10T11:20:00.000Z'
      },
      {
        id: '7',
        description: 'Gasolina e Transporte',
        amount: 420.30,
        type: 'expense',
        category: 'Transporte',
        origin: 'personal',
        date: '2025-01-18',
        createdAt: '2025-01-18T19:15:00.000Z'
      },
      {
        id: '8',
        description: 'Jantar com Clientes',
        amount: 280.00,
        type: 'expense',
        category: 'Alimentação',
        origin: 'business',
        date: '2025-01-22',
        createdAt: '2025-01-22T21:00:00.000Z'
      },
      {
        id: '9',
        description: 'Plano de Saúde',
        amount: 350.00,
        type: 'expense',
        category: 'Saúde',
        origin: 'personal',
        date: '2025-01-12',
        createdAt: '2025-01-12T12:00:00.000Z'
      },
      {
        id: '10',
        description: 'Cinema e Lazer',
        amount: 120.00,
        type: 'expense',
        category: 'Lazer',
        origin: 'personal',
        date: '2025-01-30',
        createdAt: '2025-01-30T18:30:00.000Z'
      }
    ];

    this.transactionsSubject.next(initialTransactions);
    this.saveTransactions(initialTransactions);
  }

  private createInitialGoals(): void {
    const initialGoals: Goal[] = [
      {
        id: '1',
        name: 'Carro Novo',
        target: 45000,
        saved: 15000,
        icon: '🚗',
        origin: 'business',
        priority: 'high',
        deadline: '2026-06-30',
        description: 'Comprar um carro seminovo para facilitar o trabalho',
        monthlyTarget: 1667,
        actualMonthly: 1800,
        completed: false,
        createdAt: '2024-12-01T10:00:00.000Z',
        updatedAt: '2025-01-30T18:00:00.000Z'
      },
      {
        id: '2',
        name: 'Viagem Europa',
        target: 12000,
        saved: 7800,
        icon: '✈️',
        origin: 'personal',
        priority: 'medium',
        deadline: '2025-09-15',
        description: 'Viagem de 15 dias pela Europa com a família',
        monthlyTarget: 1500,
        actualMonthly: 1300,
        completed: false,
        createdAt: '2024-11-15T14:30:00.000Z',
        updatedAt: '2025-01-28T20:15:00.000Z'
      },
      {
        id: '3',
        name: 'Reserva de Emergência',
        target: 25000,
        saved: 5000,
        icon: '🛡️',
        origin: 'personal',
        priority: 'high',
        deadline: '2025-12-31',
        description: 'Reserva de emergência de 6 meses de despesas',
        monthlyTarget: 2000,
        actualMonthly: 800,
        completed: false,
        createdAt: '2024-10-01T09:00:00.000Z',
        updatedAt: '2025-01-25T11:30:00.000Z'
      }
    ];

    this.goalsSubject.next(initialGoals);
    this.saveGoals(initialGoals);
  }
}