export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  points: number;
  rarity: AchievementRarity;
  
  // Critérios para desbloqueio
  criteria: AchievementCriteria;
  
  // Estado do usuário
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress?: AchievementProgress;
}

export type AchievementCategory = 'starter' | 'consistency' | 'financial' | 'goals' | 'special';
export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface AchievementCriteria {
  type: CriteriaType;
  target: number;
  description: string;
}

export type CriteriaType = 
  | 'goals_created'           // Número de metas criadas
  | 'total_saved'            // Valor total economizado
  | 'goals_completed'        // Metas completadas
  | 'consecutive_months'     // Meses consecutivos contribuindo
  | 'monthly_consistency'    // Consistência mensal
  | 'goal_ahead_schedule'    // Meta completada antes do prazo
  | 'first_contribution'     // Primeira contribuição
  | 'large_contribution'     // Contribuição grande
  | 'multiple_goals_active'; // Várias metas ativas simultâneas

export interface AchievementProgress {
  current: number;
  target: number;
  percentage: number;
}

export interface UserLevel {
  level: number;
  name: string;
  minPoints: number;
  maxPoints: number;
  benefits: string[];
}

export interface UserProgress {
  totalPoints: number;
  currentLevel: number;
  levelProgress: number; // 0-100
  unlockedAchievements: string[];
  recentAchievements: RecentAchievement[];
}

export interface RecentAchievement {
  achievementId: string;
  unlockedAt: Date;
}