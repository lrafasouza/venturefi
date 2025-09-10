import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'milestone' | 'streak' | 'achievement' | 'mission';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  reward: string;
  xp: number;
  deadline?: string;
  isCompleted: boolean;
  progress: number;
  maxProgress: number;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'savings' | 'consistency' | 'milestone' | 'special';
  xp: number;
  badge?: Badge;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalBadges: number;
  streakDays: number;
  longestStreak: number;
  goalsCompleted: number;
  totalSaved: number;
  rank: string;
}

@Injectable({
  providedIn: 'root'
})
export class GamificationService {
  private readonly STORAGE_KEYS = {
    BADGES: 'venturefi_badges',
    MISSIONS: 'venturefi_missions',
    ACHIEVEMENTS: 'venturefi_achievements',
    USER_STATS: 'venturefi_user_stats'
  };

  private badgesSubject = new BehaviorSubject<Badge[]>([]);
  private missionsSubject = new BehaviorSubject<Mission[]>([]);
  private achievementsSubject = new BehaviorSubject<Achievement[]>([]);
  private userStatsSubject = new BehaviorSubject<UserStats>({
    level: 1,
    xp: 0,
    xpToNextLevel: 1000,
    totalBadges: 0,
    streakDays: 0,
    longestStreak: 0,
    goalsCompleted: 0,
    totalSaved: 0,
    rank: 'Iniciante'
  });

  public badges$ = this.badgesSubject.asObservable();
  public missions$ = this.missionsSubject.asObservable();
  public achievements$ = this.achievementsSubject.asObservable();
  public userStats$ = this.userStatsSubject.asObservable();

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    this.loadBadges();
    this.loadMissions();
    this.loadAchievements();
    this.loadUserStats();

    // Se não houver dados, criar dados iniciais
    if (this.badgesSubject.value.length === 0) {
      this.createInitialBadges();
    }
    if (this.missionsSubject.value.length === 0) {
      this.createInitialMissions();
    }
    if (this.achievementsSubject.value.length === 0) {
      this.createInitialAchievements();
    }
  }

  // ============ BADGES ============
  getBadges(): Badge[] {
    return this.badgesSubject.value;
  }

  unlockBadge(badgeId: string): boolean {
    const badges = this.badgesSubject.value.map(badge => {
      if (badge.id === badgeId && !badge.isUnlocked) {
        return {
          ...badge,
          isUnlocked: true,
          unlockedAt: new Date().toISOString()
        };
      }
      return badge;
    });

    this.badgesSubject.next(badges);
    this.saveBadges(badges);
    
    const unlockedBadge = badges.find(b => b.id === badgeId);
    if (unlockedBadge) {
      this.addXP(100); // Ganhar XP por desbloquear badge
      return true;
    }
    return false;
  }

  checkMilestoneBadges(goalProgress: number, goalValue: number): Badge[] {
    const newBadges: Badge[] = [];
    
    // Badges de progresso
    const progressPercentage = (goalProgress / goalValue) * 100;
    
    if (progressPercentage >= 25 && this.unlockBadge('milestone_25')) {
      newBadges.push(this.getBadges().find(b => b.id === 'milestone_25')!);
    }
    if (progressPercentage >= 50 && this.unlockBadge('milestone_50')) {
      newBadges.push(this.getBadges().find(b => b.id === 'milestone_50')!);
    }
    if (progressPercentage >= 75 && this.unlockBadge('milestone_75')) {
      newBadges.push(this.getBadges().find(b => b.id === 'milestone_75')!);
    }
    if (progressPercentage >= 100 && this.unlockBadge('milestone_100')) {
      newBadges.push(this.getBadges().find(b => b.id === 'milestone_100')!);
    }

    return newBadges;
  }

  // ============ MISSIONS ============
  getMissions(): Mission[] {
    return this.missionsSubject.value;
  }

  completeMission(missionId: string): boolean {
    const missions = this.missionsSubject.value.map(mission => {
      if (mission.id === missionId && !mission.isCompleted) {
        this.addXP(mission.xp);
        return { ...mission, isCompleted: true, progress: mission.maxProgress };
      }
      return mission;
    });

    this.missionsSubject.next(missions);
    this.saveMissions(missions);
    return true;
  }

  updateMissionProgress(missionId: string, progress: number): void {
    const missions = this.missionsSubject.value.map(mission => {
      if (mission.id === missionId) {
        const newProgress = Math.min(progress, mission.maxProgress);
        const isCompleted = newProgress >= mission.maxProgress;
        
        if (isCompleted && !mission.isCompleted) {
          this.addXP(mission.xp);
        }
        
        return { ...mission, progress: newProgress, isCompleted };
      }
      return mission;
    });

    this.missionsSubject.next(missions);
    this.saveMissions(missions);
  }

  // ============ USER STATS ============
  getUserStats(): UserStats {
    return this.userStatsSubject.value;
  }

  addXP(amount: number): void {
    const currentStats = this.userStatsSubject.value;
    const newXP = currentStats.xp + amount;
    
    // Cálculo de level (sistema exponencial)
    const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
    const xpForCurrentLevel = Math.pow(newLevel - 1, 2) * 100;
    const xpForNextLevel = Math.pow(newLevel, 2) * 100;
    const xpToNextLevel = xpForNextLevel - newXP;

    // Atualizar rank baseado no level
    let rank = 'Iniciante';
    if (newLevel >= 20) rank = 'Lenda';
    else if (newLevel >= 15) rank = 'Mestre';
    else if (newLevel >= 10) rank = 'Especialista';
    else if (newLevel >= 5) rank = 'Intermediário';

    const updatedStats: UserStats = {
      ...currentStats,
      xp: newXP,
      level: newLevel,
      xpToNextLevel,
      rank
    };

    this.userStatsSubject.next(updatedStats);
    this.saveUserStats(updatedStats);
  }

  updateGoalStats(goalsCompleted: number, totalSaved: number): void {
    const currentStats = this.userStatsSubject.value;
    const updatedStats: UserStats = {
      ...currentStats,
      goalsCompleted,
      totalSaved,
      totalBadges: this.getBadges().filter(b => b.isUnlocked).length
    };

    this.userStatsSubject.next(updatedStats);
    this.saveUserStats(updatedStats);
  }

  updateStreak(streakDays: number): void {
    const currentStats = this.userStatsSubject.value;
    const updatedStats: UserStats = {
      ...currentStats,
      streakDays,
      longestStreak: Math.max(currentStats.longestStreak, streakDays)
    };

    this.userStatsSubject.next(updatedStats);
    this.saveUserStats(updatedStats);

    // Badges de streak
    if (streakDays >= 7) this.unlockBadge('streak_week');
    if (streakDays >= 30) this.unlockBadge('streak_month');
    if (streakDays >= 100) this.unlockBadge('streak_legendary');
  }

  // ============ STORAGE ============
  private loadBadges(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.BADGES);
      if (stored) {
        this.badgesSubject.next(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar badges:', error);
    }
  }

  private saveBadges(badges: Badge[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.BADGES, JSON.stringify(badges));
    } catch (error) {
      console.error('Erro ao salvar badges:', error);
    }
  }

  private loadMissions(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.MISSIONS);
      if (stored) {
        this.missionsSubject.next(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar missões:', error);
    }
  }

  private saveMissions(missions: Mission[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
    } catch (error) {
      console.error('Erro ao salvar missões:', error);
    }
  }

  private loadAchievements(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.ACHIEVEMENTS);
      if (stored) {
        this.achievementsSubject.next(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar conquistas:', error);
    }
  }

  private saveAchievements(achievements: Achievement[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (error) {
      console.error('Erro ao salvar conquistas:', error);
    }
  }

  private loadUserStats(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.USER_STATS);
      if (stored) {
        this.userStatsSubject.next(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }

  private saveUserStats(stats: UserStats): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Erro ao salvar estatísticas:', error);
    }
  }

  // ============ INITIAL DATA ============
  private createInitialBadges(): void {
    const initialBadges: Badge[] = [
      // Badges de milestone
      {
        id: 'milestone_25',
        name: 'Primeiro Passo',
        description: 'Alcançou 25% de uma meta',
        icon: '🎯',
        type: 'milestone',
        rarity: 'common',
        isUnlocked: false
      },
      {
        id: 'milestone_50',
        name: 'Meio Caminho',
        description: 'Alcançou 50% de uma meta',
        icon: '🏃‍♂️',
        type: 'milestone',
        rarity: 'common',
        isUnlocked: false
      },
      {
        id: 'milestone_75',
        name: 'Quase Lá',
        description: 'Alcançou 75% de uma meta',
        icon: '🔥',
        type: 'milestone',
        rarity: 'rare',
        isUnlocked: false
      },
      {
        id: 'milestone_100',
        name: 'Sonho Realizado',
        description: 'Concluiu uma meta completa',
        icon: '🏆',
        type: 'milestone',
        rarity: 'epic',
        isUnlocked: false
      },
      // Badges de streak
      {
        id: 'streak_week',
        name: 'Consistente',
        description: '7 dias consecutivos com aportes',
        icon: '📅',
        type: 'streak',
        rarity: 'common',
        isUnlocked: false
      },
      {
        id: 'streak_month',
        name: 'Disciplinado',
        description: '30 dias consecutivos com aportes',
        icon: '💪',
        type: 'streak',
        rarity: 'rare',
        isUnlocked: false
      },
      {
        id: 'streak_legendary',
        name: 'Lenda da Disciplina',
        description: '100 dias consecutivos com aportes',
        icon: '👑',
        type: 'streak',
        rarity: 'legendary',
        isUnlocked: false
      },
      // Badges especiais
      {
        id: 'first_goal',
        name: 'Primeira Meta',
        description: 'Criou sua primeira meta',
        icon: '🌟',
        type: 'achievement',
        rarity: 'common',
        isUnlocked: false
      },
      {
        id: 'big_saver',
        name: 'Grande Poupador',
        description: 'Economizou R$ 10.000 total',
        icon: '💰',
        type: 'achievement',
        rarity: 'epic',
        isUnlocked: false
      }
    ];

    this.badgesSubject.next(initialBadges);
    this.saveBadges(initialBadges);
  }

  private createInitialMissions(): void {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const initialMissions: Mission[] = [
      {
        id: 'daily_contribution',
        title: 'Aporte do Dia',
        description: 'Faça um aporte para qualquer meta hoje',
        type: 'daily',
        reward: 'Badge + 50 XP',
        xp: 50,
        deadline: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        isCompleted: false,
        progress: 0,
        maxProgress: 1,
        icon: '💸'
      },
      {
        id: 'weekly_streak',
        title: 'Semana Consistente',
        description: 'Faça aportes em 5 dias desta semana',
        type: 'weekly',
        reward: 'Badge Especial + 200 XP',
        xp: 200,
        deadline: nextWeek.toISOString(),
        isCompleted: false,
        progress: 0,
        maxProgress: 5,
        icon: '🔥'
      },
      {
        id: 'milestone_hunter',
        title: 'Caçador de Marcos',
        description: 'Alcance um checkpoint em qualquer meta',
        type: 'weekly',
        reward: 'Badge Raro + 150 XP',
        xp: 150,
        deadline: nextWeek.toISOString(),
        isCompleted: false,
        progress: 0,
        maxProgress: 1,
        icon: '🎯'
      },
      {
        id: 'smart_saver',
        title: 'Poupador Inteligente',
        description: 'Economize R$ 1.000 este mês',
        type: 'monthly',
        reward: 'Badge Épico + 500 XP',
        xp: 500,
        deadline: nextMonth.toISOString(),
        isCompleted: false,
        progress: 0,
        maxProgress: 1000,
        icon: '🧠'
      }
    ];

    this.missionsSubject.next(initialMissions);
    this.saveMissions(initialMissions);
  }

  private createInitialAchievements(): void {
    const initialAchievements: Achievement[] = [
      {
        id: 'first_steps',
        title: 'Primeiros Passos',
        description: 'Bem-vindo ao VentureFi! Criou sua primeira meta.',
        category: 'special',
        xp: 100,
        isUnlocked: false
      },
      {
        id: 'savings_master',
        title: 'Mestre da Poupança',
        description: 'Economizou mais de R$ 50.000 em metas',
        category: 'savings',
        xp: 1000,
        isUnlocked: false
      },
      {
        id: 'consistency_king',
        title: 'Rei da Consistência',
        description: 'Manteve streak de aportes por 90 dias',
        category: 'consistency',
        xp: 800,
        isUnlocked: false
      }
    ];

    this.achievementsSubject.next(initialAchievements);
    this.saveAchievements(initialAchievements);
  }

  // ============ NOTIFICATION SYSTEM ============
  getNewUnlocks(): { badges: Badge[], achievements: Achievement[], missions: Mission[] } {
    // Retorna conquistas recentes para mostrar notificações
    const recentBadges = this.getBadges().filter(b => 
      b.isUnlocked && b.unlockedAt && 
      new Date(b.unlockedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    const completedMissions = this.getMissions().filter(m => m.isCompleted);

    return {
      badges: recentBadges,
      achievements: [],
      missions: completedMissions
    };
  }
}