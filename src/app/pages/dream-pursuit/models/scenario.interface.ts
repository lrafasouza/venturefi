export interface ScenarioSimulation {
  goalId: string;
  scenarios: Scenario[];
  customScenario?: CustomScenario;
}

export interface Scenario {
  id: string;
  name: string;
  type: ScenarioType;
  monthlyAmount: number;
  projectedMonths: number;
  projectedCompletionDate: Date;
  totalInterest?: number;
  monthsSaved: number; // Comparado com cenário atual
  badge: ScenarioBadge;
}

export type ScenarioType = 'current' | 'conservative' | 'moderate' | 'aggressive' | 'custom';
export type ScenarioBadge = 'current' | 'optimized' | 'aggressive' | 'unrealistic';

export interface CustomScenario {
  monthlyAmount: number;
  projectedMonths: number;
  projectedCompletionDate: Date;
  feasibilityScore: number; // 0-100
  monthsSaved: number;
  recommendations: string[];
}

export interface ScenarioRecommendation {
  type: 'increase_amount' | 'extend_deadline' | 'reduce_target' | 'add_income_stream';
  title: string;
  description: string;
  impact: string;
  feasibility: number; // 0-100
}