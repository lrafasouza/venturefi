import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService, Goal } from '../../shared/services/data.service';

@Component({
  selector: 'app-dream-pursuit-super',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="modern-dream-pursuit">
      <!-- Header -->
      <header class="dream-header">
        <div class="header-content">
          <div class="title-section">
            <h1 class="page-title">Em Busca do Sonho</h1>
            <p class="page-subtitle">Transforme seus objetivos em conquistas reais</p>
          </div>
          <div class="header-stats">
            <div class="stat-item">
              <span class="stat-value">{{ getActiveGoals() }}</span>
              <span class="stat-label">Metas Ativas</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ getProgressAverage() }}%</span>
              <span class="stat-label">Progresso Médio</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ getTotalSaved() }}</span>
              <span class="stat-label">Total Guardado</span>
            </div>
          </div>
        </div>
      </header>

      <!-- AI Assistant Section -->
      <section class="ai-assistant-section">
        <div class="ai-assistant-card-new">
          <div class="ai-header-section">
            <div class="ai-avatar-new">
              <div class="avatar-glow">
                <div class="avatar-core">🤖</div>
              </div>
              <div class="ai-pulse-indicator">
                <div class="pulse-dot"></div>
                <span class="status-text">IA Ativo</span>
              </div>
            </div>
            <div class="ai-stats-grid">
              <div class="stat-pill">
                <span class="stat-icon">🧠</span>
                <span class="stat-number">97%</span>
                <span class="stat-label">Precisão</span>
              </div>
              <div class="stat-pill">
                <span class="stat-icon">⚡</span>
                <span class="stat-number">12</span>
                <span class="stat-label">Insights</span>
              </div>
            </div>
          </div>

          <div class="ai-content-section">
            <h3 class="ai-title">Assistente Financeiro IA</h3>
            <p class="ai-subtitle">Análise inteligente em tempo real do seu portfólio</p>
            
            <div class="ai-insights-row">
              <div class="insight-chip active">
                <span class="chip-icon">💡</span>
                <span class="chip-text">Otimização detectada</span>
              </div>
              <div class="insight-chip">
                <span class="chip-icon">📊</span>
                <span class="chip-text">Performance +12%</span>
              </div>
              <div class="insight-chip">
                <span class="chip-icon">🎯</span>
                <span class="chip-text">Meta antecipada</span>
              </div>
            </div>
          </div>

          <div class="ai-actions-section">
            <button class="ai-chat-btn-new primary" (click)="openAIChat()">
              <span class="btn-icon">💬</span>
              <span>Conversar com IA</span>
            </button>
            <button class="ai-chat-btn-new secondary">
              <span class="btn-icon">📈</span>
              <span>Relatório</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Performance Dashboard -->
      <section class="performance-section">
        <h2 class="section-title">📊 Performance Geral</h2>
        <div class="performance-grid">
          <div class="performance-card discipline">
            <div class="perf-icon">💪</div>
            <div class="perf-content">
              <h3>Disciplina Financeira</h3>
              <div class="score-circle">
                <svg class="progress-ring" width="80" height="80">
                  <circle class="progress-ring-bg" cx="40" cy="40" r="35"></circle>
                  <circle class="progress-ring-progress" cx="40" cy="40" r="35" [attr.stroke-dashoffset]="getCircleOffset(89)"></circle>
                </svg>
                <div class="score-text">89%</div>
              </div>
              <p>Excelente consistência nos aportes</p>
            </div>
          </div>

          <div class="performance-card efficiency">
            <div class="perf-icon">⚡</div>
            <div class="perf-content">
              <h3>Eficiência de Metas</h3>
              <div class="score-circle">
                <svg class="progress-ring" width="80" height="80">
                  <circle class="progress-ring-bg" cx="40" cy="40" r="35"></circle>
                  <circle class="progress-ring-progress" cx="40" cy="40" r="35" [attr.stroke-dashoffset]="getCircleOffset(76)"></circle>
                </svg>
                <div class="score-text">76%</div>
              </div>
              <p>Tempo médio 8% menor que previsto</p>
            </div>
          </div>

          <div class="performance-card growth">
            <div class="perf-icon">📈</div>
            <div class="perf-content">
              <h3>Crescimento Patrimonial</h3>
              <div class="score-circle">
                <svg class="progress-ring" width="80" height="80">
                  <circle class="progress-ring-bg" cx="40" cy="40" r="35"></circle>
                  <circle class="progress-ring-progress" cx="40" cy="40" r="35" [attr.stroke-dashoffset]="getCircleOffset(92)"></circle>
                </svg>
                <div class="score-text">92%</div>
              </div>
              <p>Superando metas de crescimento</p>
            </div>
          </div>

          <div class="performance-card prediction">
            <div class="perf-icon">🔮</div>
            <div class="perf-content">
              <h3>Precisão de Previsões</h3>
              <div class="score-circle">
                <svg class="progress-ring" width="80" height="80">
                  <circle class="progress-ring-bg" cx="40" cy="40" r="35"></circle>
                  <circle class="progress-ring-progress" cx="40" cy="40" r="35" [attr.stroke-dashoffset]="getCircleOffset(84)"></circle>
                </svg>
                <div class="score-text">84%</div>
              </div>
              <p>IA está aprendendo seu padrão</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Smart Insights Section -->
      <section class="insights-section">
        <h2 class="section-title">🧠 Insights Inteligentes</h2>
        <div class="insights-grid">
          <div class="insight-card opportunity">
            <div class="insight-header">
              <span class="insight-emoji">💰</span>
              <div class="insight-priority high">Alta Prioridade</div>
            </div>
            <h3>Oportunidade de Otimização</h3>
            <p>Detectamos que você pode acelerar sua meta "Casa dos Sonhos" em 3 meses redirecionando R$ 500 da reserva de emergência excedente.</p>
            <div class="insight-actions">
              <button class="insight-btn primary">Aplicar Sugestão</button>
              <button class="insight-btn secondary">Saiba Mais</button>
            </div>
          </div>

          <div class="insight-card trend">
            <div class="insight-header">
              <span class="insight-emoji">📈</span>
              <div class="insight-priority medium">Informativo</div>
            </div>
            <h3>Tendência Positiva</h3>
            <p>Seu padrão de gastos melhorou 15% nos últimos 3 meses. Continue assim e você antecipará todas as metas em média 2.3 meses.</p>
            <div class="insight-chart">
              <div class="mini-chart">
                <div class="chart-bar" style="height: 40%"></div>
                <div class="chart-bar" style="height: 65%"></div>
                <div class="chart-bar" style="height: 80%"></div>
                <div class="chart-bar" style="height: 95%"></div>
              </div>
            </div>
          </div>

          <div class="insight-card warning">
            <div class="insight-header">
              <span class="insight-emoji">⚠️</span>
              <div class="insight-priority warning">Atenção</div>
            </div>
            <h3>Risco Detectado</h3>
            <p>A meta "Viagem Europa" pode atrasar 1 mês devido ao aumento de gastos variáveis. Recomendamos ajustar o orçamento ou aporte.</p>
            <div class="insight-actions">
              <button class="insight-btn warning">Ver Detalhes</button>
              <button class="insight-btn secondary">Ignorar</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Actions Enhanced -->
      <section class="actions-section">
        <h2 class="section-title">⚡ Ações Rápidas</h2>
        <div class="quick-actions-grid">
          <button class="action-card primary">
            <div class="action-icon">🎯</div>
            <div class="action-content">
              <h3>Nova Meta</h3>
              <p>Criar objetivo financeiro</p>
            </div>
          </button>

          <button class="action-card secondary">
            <div class="action-icon">📊</div>
            <div class="action-content">
              <h3>Relatórios</h3>
              <p>Ver análises detalhadas</p>
            </div>
          </button>

          <button class="action-card tertiary">
            <div class="action-icon">🧮</div>
            <div class="action-content">
              <h3>Simulador</h3>
              <p>Testar cenários</p>
            </div>
          </button>

          <button class="action-card quaternary" >
            <div class="action-icon">⚡</div>
            <div class="action-content">
              <h3>Otimizar IA</h3>
              <p>Melhorar cronogramas</p>
            </div>
          </button>
        </div>
      </section>

      <!-- Notifications Center -->
      <section class="notifications-section">
        <h2 class="section-title">🔔 Central de Notificações</h2>
        <div class="notifications-container">
          <div class="notification-item success">
            <div class="notif-icon">🎉</div>
            <div class="notif-content">
              <h4>Marco Atingido!</h4>
              <p>Você completou 50% da meta "Casa dos Sonhos". Parabéns!</p>
              <span class="notif-time">Há 2 horas</span>
            </div>
            <button class="notif-close">×</button>
          </div>

          <div class="notification-item info">
            <div class="notif-icon">📱</div>
            <div class="notif-content">
              <h4>Lembrete WhatsApp</h4>
              <p>Mensagem enviada: "Faltam 3 dias para seu aporte de R$ 2.800"</p>
              <span class="notif-time">Há 1 dia</span>
            </div>
            <button class="notif-close">×</button>
          </div>

          <div class="notification-item warning">
            <div class="notif-icon">💡</div>
            <div class="notif-content">
              <h4>Nova Recomendação IA</h4>
              <p>Otimização detectada para acelerar suas metas em 2 meses</p>
              <span class="notif-time">Há 2 dias</span>
            </div>
            <button class="notif-close">×</button>
          </div>
        </div>
      </section>

      <!-- Goals Grid -->
      <section class="goals-section">
        <h2 class="section-title">Suas Metas</h2>

        <div class="goals-grid">
          <!-- Example Advanced Card - Compact & Beautiful -->
          <div class="goal-card advanced-example">
            <div class="goal-header-compact">
              <div class="goal-title-section">
                <h3 class="goal-name">Casa dos Sonhos 🏡</h3>
                <div class="badges-row">
                  <span class="badge earned">🌟</span>
                  <span class="badge earned">💪</span>
                  <span class="badge earned">🏆</span>
                  <span class="badge-count">+3</span>
                </div>
              </div>
              <div class="goal-amount-compact">
                <span class="current">R$ 180k</span>
                <span class="target">/ 350k</span>
              </div>
            </div>

            <div class="progress-section-compact">
              <div class="progress-wrapper">
                <div class="progress-bar-enhanced">
                  <div class="progress-fill" style="width: 51.4%"></div>
                  <!-- Checkpoints -->
                  <!-- <div class="checkpoint" style="left: 25%"><span class="checkpoint-icon completed">✓</span></div>
                  <div class="checkpoint" style="left: 50%"><span class="checkpoint-icon completed">🏆</span></div>
                  <div class="checkpoint" style="left: 75%"><span class="checkpoint-icon next">🎯</span></div> -->
                </div>
                <div class="progress-info">
                  <span class="progress-text">51.4%</span>
                  <span class="ai-insight">🤖 3m adiantado</span>
                </div>
              </div>
            </div>

            <div class="goal-actions-compact">
              <button class="card-btn-compact primary" (click)="addContributionAdvanced()">
                💰 Aportar R$ 2.800
              </button>
            </div>
          </div>

          <!-- Regular Goals -->
          <div *ngFor="let goal of getGoals()" class="goal-card" [class.completed]="goal.completed">
            <div class="goal-header">
              <div class="goal-info">
                <h3 class="goal-name">{{ goal.name }}</h3>
                <span class="goal-priority priority-{{ goal.priority }}">
                  {{ getPriorityLabel(goal.priority) }}
                </span>
              </div>
              <div class="goal-amount">
                <span class="current">{{ formatCurrency(goal.saved) }}</span>
                <span class="target">de {{ formatCurrency(goal.target) }}</span>
              </div>
            </div>

            <div class="progress-section">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="getProgressPercentage(goal)"></div>
              </div>
              <span class="progress-text">{{ getProgressPercentage(goal) }}% completo</span>
            </div>

            <div class="goal-footer">
              <span class="time-remaining">{{ getTimeRemaining(goal) }}</span>
              <div class="goal-actions">
                <button class="card-btn secondary" (click)="viewDetails(goal)">Detalhes</button>
                <button class="card-btn primary" (click)="addContribution(goal)">Aportar</button>
              </div>
            </div>
          </div>

          <!-- Add New Goal Card -->
          <div class="goal-card add-card" (click)="addNewGoal()">
            <div class="add-content">
              <div class="add-icon">➕</div>
              <h3>Adicionar Meta</h3>
              <p>Crie uma nova meta financeira</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Statistics -->
      <section class="stats-section">
        <h2 class="section-title">Estatísticas</h2>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-icon">🎯</span>
              <h3>Metas Concluídas</h3>
            </div>
            <div class="stat-value">{{ getCompletedGoals() }}</div>
            <div class="stat-change positive">+2 este mês</div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-icon">💰</span>
              <h3>Total Poupado</h3>
            </div>
            <div class="stat-value">{{ getTotalSaved() }}</div>
            <div class="stat-change positive">+8% vs mês anterior</div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-icon">📈</span>
              <h3>Progresso Médio</h3>
            </div>
            <div class="stat-value">{{ getProgressAverage() }}%</div>
            <div class="stat-change positive">+12% este mês</div>
          </div>
        </div>
      </section>
    </div>

    <!-- Advanced Goal Details Modal - Ultra Modern -->
    <div class="modal-overlay" [class.active]="showAdvancedModal" (click)="closeAdvancedModal()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title">
            <h2>🏡 Casa dos Sonhos - Detalhes Completos</h2>
            <span class="ai-badge">🤖 IA Ativa</span>
          </div>
          <button class="modal-close" (click)="closeAdvancedModal()">✕</button>
        </div>

        <div class="modal-content">
          <!-- AI Insights Expanded -->
          <section class="modal-section">
            <h3>🧠 Análise Inteligente</h3>
            <div class="ai-insight-expanded">
              <div class="insight-card primary">
                <div class="insight-header">
                  <span class="insight-emoji">🎯</span>
                  <div>
                    <h4>Status Atual</h4>
                    <p>Você está 3 meses adiantado no cronograma!</p>
                  </div>
                </div>
                <div class="insight-details">
                  <p>Baseado no seu histórico de aportes e padrão de gastos, você está superando as expectativas. Continue com R$ 2.800/mês e antecipará a compra em 8 meses.</p>
                </div>
              </div>

              <div class="insight-card secondary">
                <div class="insight-header">
                  <span class="insight-emoji">💡</span>
                  <div>
                    <h4>Oportunidade Detectada</h4>
                    <p>Reserva de emergência acima do ideal</p>
                  </div>
                </div>
                <div class="insight-details">
                  <p>Você possui R$ 5.000 excedentes na reserva. Considere investir esse valor para acelerar sua meta em 2 meses adicionais.</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Detailed Progress Timeline -->
          <section class="modal-section">
            <h3>📈 Cronograma Detalhado</h3>
            <div class="timeline-container">
              <div class="timeline-item completed">
                <div class="timeline-marker">✓</div>
                <div class="timeline-content">
                  <h4>Marco 25% - R$ 87.500</h4>
                  <p class="timeline-date">Concluído em Mar/2024</p>
                  <p>Primeira conquista! Você desbloqueou o badge "Primeira Meta" 🌟</p>
                </div>
              </div>

              <div class="timeline-item completed current">
                <div class="timeline-marker">🏆</div>
                <div class="timeline-content">
                  <h4>Marco 50% - R$ 175.000</h4>
                  <p class="timeline-date">Concluído em Set/2024</p>
                  <p>Meio caminho andado! Badge "Marco 50%" conquistado 🏆</p>
                </div>
              </div>

              <div class="timeline-item next">
                <div class="timeline-marker">🎯</div>
                <div class="timeline-content">
                  <h4>Marco 75% - R$ 262.500</h4>
                  <p class="timeline-date">Previsto para Maio/2025</p>
                  <p>Próximo marco! Faltam apenas 8 meses para essa conquista.</p>
                </div>
              </div>

              <div class="timeline-item">
                <div class="timeline-marker">🏡</div>
                <div class="timeline-content">
                  <h4>Meta Completa - R$ 350.000</h4>
                  <p class="timeline-date">Previsto para Set/2025</p>
                  <p>Conquista final! Sua casa dos sonhos será realidade.</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Scenario Simulations -->
          <section class="modal-section">
            <h3>📊 Simulações de Cenário</h3>
            <div class="scenarios-detailed">
              <div class="scenario-card optimistic">
                <div class="scenario-header">
                  <span class="scenario-emoji">🚀</span>
                  <h4>Cenário Otimista</h4>
                  <span class="scenario-time">2 anos 4 meses</span>
                </div>
                <div class="scenario-details">
                  <p><strong>Aporte mensal:</strong> R$ 3.500 (+25%)</p>
                  <p><strong>Economia adicional:</strong> R$ 700/mês</p>
                  <p><strong>Data prevista:</strong> Janeiro/2027</p>
                </div>
              </div>

              <div class="scenario-card realistic selected">
                <div class="scenario-header">
                  <span class="scenario-emoji">🎯</span>
                  <h4>Cenário Realista</h4>
                  <span class="scenario-time">2 anos 8 meses</span>
                </div>
                <div class="scenario-details">
                  <p><strong>Aporte mensal:</strong> R$ 2.800 (atual)</p>
                  <p><strong>Consistência:</strong> Mantendo o ritmo</p>
                  <p><strong>Data prevista:</strong> Maio/2027</p>
                </div>
              </div>

              <div class="scenario-card conservative">
                <div class="scenario-header">
                  <span class="scenario-emoji">🐌</span>
                  <h4>Cenário Conservador</h4>
                  <span class="scenario-time">3 anos 2 meses</span>
                </div>
                <div class="scenario-details">
                  <p><strong>Aporte mensal:</strong> R$ 2.200 (-20%)</p>
                  <p><strong>Margem de segurança:</strong> Maior</p>
                  <p><strong>Data prevista:</strong> Novembro/2027</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Gamification Details -->
          <section class="modal-section">
            <h3>🏆 Conquistas e Gamificação</h3>
            <div class="gamification-detailed">
              <div class="achievements-grid">
                <div class="achievement-item earned">
                  <div class="achievement-icon">🌟</div>
                  <div class="achievement-info">
                    <h4>Primeira Meta</h4>
                    <p>Conquistado em Mar/2024</p>
                    <span class="rarity common">Comum</span>
                  </div>
                </div>

                <div class="achievement-item earned">
                  <div class="achievement-icon">💪</div>
                  <div class="achievement-info">
                    <h4>Disciplina Financeira</h4>
                    <p>6 meses consecutivos</p>
                    <span class="rarity rare">Raro</span>
                  </div>
                </div>

                <div class="achievement-item earned">
                  <div class="achievement-icon">🏆</div>
                  <div class="achievement-info">
                    <h4>Marco 50%</h4>
                    <p>Meio caminho conquistado</p>
                    <span class="rarity epic">Épico</span>
                  </div>
                </div>

                <div class="achievement-item pending">
                  <div class="achievement-icon">💎</div>
                  <div class="achievement-info">
                    <h4>Super Poupador</h4>
                    <p>Próximo marco: 75%</p>
                    <span class="rarity legendary">Lendário</span>
                  </div>
                </div>
              </div>

              <div class="streak-detailed">
                <div class="streak-info">
                  <span class="streak-icon">🔥</span>
                  <div>
                    <h4>Sequência Atual</h4>
                    <p>23 aportes consecutivos</p>
                    <small>Seu melhor: 25 aportes</small>
                  </div>
                </div>
                <div class="streak-progress">
                  <div class="streak-bar">
                    <div class="streak-fill" style="width: 92%"></div>
                  </div>
                  <span class="streak-next">Faltam 2 para bater seu recorde!</span>
                </div>
              </div>
            </div>
          </section>

          <!-- WhatsApp Integration -->
          <section class="modal-section">
            <h3>📱 Integração WhatsApp</h3>
            <div class="whatsapp-detailed">
              <div class="whatsapp-config">
                <div class="config-item">
                  <span class="config-icon">📅</span>
                  <div class="config-info">
                    <h4>Lembretes de Aporte</h4>
                    <p>Todo dia 5 de cada mês às 09:00</p>
                  </div>
                  <span class="config-status active">Ativo</span>
                </div>

                <div class="config-item">
                  <span class="config-icon">🎉</span>
                  <div class="config-info">
                    <h4>Celebrações de Marco</h4>
                    <p>Notificações ao atingir marcos</p>
                  </div>
                  <span class="config-status active">Ativo</span>
                </div>

                <div class="config-item">
                  <span class="config-icon">📈</span>
                  <div class="config-info">
                    <h4>Relatório Semanal</h4>
                    <p>Resumo de progresso aos domingos</p>
                  </div>
                  <span class="config-status inactive">Inativo</span>
                </div>
              </div>

              <div class="message-examples">
                <h4>Exemplos de Mensagens</h4>
                <div class="message-example">
                  <span class="message-type">Lembrete</span>
                  <p>"🏡 Faltam 3 dias para seu aporte de R$ 2.800! Sua casa está cada vez mais próxima 💪"</p>
                </div>
                <div class="message-example">
                  <span class="message-type">Conquista</span>
                  <p>"🏆 PARABÉNS! Você atingiu o marco de 50% da sua meta! Está no meio do caminho para sua casa dos sonhos! 🎉"</p>
                </div>
                <div class="message-example">
                  <span class="message-type">Motivação</span>
                  <p>"🔥 Que sequência incrível! 23 aportes seguidos. Você está destruindo suas metas! Continue assim! 💪"</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="modal-footer">
          <button class="modal-btn secondary" (click)="exportGoalData()">
            <span class="btn-icon">📊</span>
            Exportar Dados
          </button>
          <button class="modal-btn secondary" (click)="shareGoal()">
            <span class="btn-icon">📤</span>
            Compartilhar
          </button>
          <button class="modal-btn primary" (click)="addContributionAdvanced()">
            <span class="btn-icon">💰</span>
            Fazer Aporte
          </button>
        </div>
      </div>
    </div>

    <!-- New Goal Modal -->
    <div class="modal-overlay" [class.active]="showNewGoalModal" (click)="closeNewGoalModal()">
      <div class="modal-container new-goal-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title">
            <h2>🎯 Criar Nova Meta</h2>
          </div>
          <button class="modal-close" (click)="closeNewGoalModal()">✕</button>
        </div>

        <div class="modal-content">
          <div class="goal-wizard">
            <!-- Step 1: Basic Info -->
            <div class="wizard-step active">
              <h3>📝 Informações Básicas</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label>Nome da Meta</label>
                  <input type="text" placeholder="Ex: Casa própria, Viagem para Europa..." class="form-input">
                </div>

                <div class="form-group">
                  <label>Categoria</label>
                  <select class="form-select">
                    <option>🏠 Imóvel</option>
                    <option>🚗 Veículo</option>
                    <option>✈️ Viagem</option>
                    <option>🎓 Educação</option>
                    <option>💰 Investimento</option>
                    <option>🎉 Outros</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Valor Total</label>
                  <input type="text" placeholder="R$ 0,00" class="form-input currency">
                </div>

                <div class="form-group">
                  <label>Data Limite</label>
                  <input type="date" class="form-input">
                </div>
              </div>

              <!-- AI Suggestions -->
              <div class="ai-suggestions-box">
                <div class="ai-suggestion-header">
                  <span class="ai-icon">🤖</span>
                  <h4>Sugestões da IA</h4>
                </div>
                <div class="suggestions-list">
                  <div class="suggestion-item" (click)="selectSuggestion('casa')">
                    <span class="suggestion-emoji">🏠</span>
                    <div class="suggestion-content">
                      <strong>Casa Própria</strong>
                      <p>Meta média: R$ 350.000 em 4 anos</p>
                    </div>
                  </div>
                  <div class="suggestion-item" (click)="selectSuggestion('viagem')">
                    <span class="suggestion-emoji">✈️</span>
                    <div class="suggestion-content">
                      <strong>Viagem Internacional</strong>
                      <p>Meta média: R$ 15.000 em 2 anos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Financial Planning -->
            <div class="wizard-step">
              <h3>💰 Planejamento Financeiro</h3>
              <div class="financial-calculator">
                <div class="calc-result">
                  <h4>Resultado do Cálculo IA</h4>
                  <div class="calc-grid">
                    <div class="calc-item">
                      <span class="calc-label">Aporte Mensal Sugerido</span>
                      <span class="calc-value">R$ 2.800</span>
                    </div>
                    <div class="calc-item">
                      <span class="calc-label">Tempo Estimado</span>
                      <span class="calc-value">3 anos 2 meses</span>
                    </div>
                    <div class="calc-item">
                      <span class="calc-label">Rendimento Estimado</span>
                      <span class="calc-value">12% a.a.</span>
                    </div>
                  </div>
                </div>

                <div class="priority-selector">
                  <label>Prioridade da Meta</label>
                  <div class="priority-options">
                    <button class="priority-btn high">🔴 Alta</button>
                    <button class="priority-btn medium selected">🟡 Média</button>
                    <button class="priority-btn low">🟢 Baixa</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="modal-btn secondary" (click)="previousStep()">⬅️ Anterior</button>
          <button class="modal-btn primary" (click)="nextStep()">Próximo ➡️</button>
          <button class="modal-btn success" (click)="createGoal()">✅ Criar Meta</button>
        </div>
      </div>
    </div>

    <!-- Simulator Modal -->
    <div class="modal-overlay" [class.active]="showSimulatorModal" (click)="closeSimulatorModal()">
      <div class="modal-container simulator-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title">
            <h2>🧮 Simulador de Cenários</h2>
          </div>
          <button class="modal-close" (click)="closeSimulatorModal()">✕</button>
        </div>

        <div class="modal-content">
          <!-- Simulation Controls -->
          <div class="simulation-controls">
            <h3>🎛️ Parâmetros da Simulação</h3>
            <div class="controls-grid">
              <div class="control-group">
                <label>Meta Selecionada</label>
                <select class="form-select">
                  <option>🏠 Casa dos Sonhos - R$ 350.000</option>
                  <option>✈️ Viagem Europa - R$ 25.000</option>
                  <option>🚗 Carro Novo - R$ 80.000</option>
                </select>
              </div>

              <div class="control-group">
                <label>Aporte Mensal</label>
                <input type="range" min="500" max="5000" value="2800" class="range-slider" (input)="updateSimulation($event)">
                <span class="range-value">R$ 2.800</span>
              </div>

              <div class="control-group">
                <label>Taxa de Juros Anual</label>
                <input type="range" min="6" max="18" value="12" step="0.5" class="range-slider">
                <span class="range-value">12%</span>
              </div>

              <div class="control-group">
                <label>Aporte Extra Anual</label>
                <input type="range" min="0" max="20000" value="5000" step="1000" class="range-slider">
                <span class="range-value">R$ 5.000</span>
              </div>
            </div>
          </div>

          <!-- Simulation Results -->
          <div class="simulation-results">
            <h3>📊 Resultados da Simulação</h3>
            <div class="results-grid">
              <div class="scenario-card optimistic">
                <div class="scenario-header">
                  <span class="scenario-emoji">🚀</span>
                  <h4>Cenário Otimista</h4>
                  <span class="scenario-probability">30% chance</span>
                </div>
                <div class="scenario-details">
                  <div class="detail-item">
                    <span class="detail-label">Tempo:</span>
                    <span class="detail-value">2 anos 4 meses</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Rendimento:</span>
                    <span class="detail-value">15% a.a.</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Economia:</span>
                    <span class="detail-value">R$ 18.400</span>
                  </div>
                </div>
              </div>

              <div class="scenario-card realistic selected">
                <div class="scenario-header">
                  <span class="scenario-emoji">🎯</span>
                  <h4>Cenário Realista</h4>
                  <span class="scenario-probability">60% chance</span>
                </div>
                <div class="scenario-details">
                  <div class="detail-item">
                    <span class="detail-label">Tempo:</span>
                    <span class="detail-value">2 anos 8 meses</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Rendimento:</span>
                    <span class="detail-value">12% a.a.</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Total poupado:</span>
                    <span class="detail-value">R$ 350.000</span>
                  </div>
                </div>
              </div>

              <div class="scenario-card conservative">
                <div class="scenario-header">
                  <span class="scenario-emoji">🐌</span>
                  <h4>Cenário Conservador</h4>
                  <span class="scenario-probability">10% chance</span>
                </div>
                <div class="scenario-details">
                  <div class="detail-item">
                    <span class="detail-label">Tempo:</span>
                    <span class="detail-value">3 anos 2 meses</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Rendimento:</span>
                    <span class="detail-value">8% a.a.</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Risco:</span>
                    <span class="detail-value">Muito baixo</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Interactive Chart Placeholder -->
            <div class="chart-container">
              <h4>📈 Evolução Patrimonial</h4>
              <div class="chart-placeholder">
                <div class="chart-lines">
                  <div class="chart-line optimistic"></div>
                  <div class="chart-line realistic"></div>
                  <div class="chart-line conservative"></div>
                </div>
                <div class="chart-legend">
                  <span class="legend-item optimistic">🚀 Otimista</span>
                  <span class="legend-item realistic">🎯 Realista</span>
                  <span class="legend-item conservative">🐌 Conservador</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="modal-btn secondary" (click)="exportSimulation()">📊 Exportar</button>
          <button class="modal-btn primary" (click)="applyScenario()">✅ Aplicar Cenário</button>
        </div>
      </div>
    </div>

    <!-- AI Chat Modal -->
    <div class="modal-overlay" [class.active]="showAIChatModal" (click)="closeAIChatModal()">
      <div class="modal-container ai-chat-modal" (click)="$event.stopPropagation()">
        <div class="modal-header ai-header-modern">
          <div class="ai-modal-branding">
            <div class="ai-avatar-modern">
              <div class="avatar-glow-modal">
                <span class="avatar-emoji">🤖</span>
              </div>
              <div class="ai-pulse-ring"></div>
            </div>
            <div class="ai-identity">
              <h2 class="ai-modal-title">Assistente Financeiro IA</h2>
              <div class="ai-status-modern">
                <div class="status-indicator active"></div>
                <span class="status-label">Online - Pronto para ajudar</span>
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-controls">
            <button class="control-btn minimize">−</button>
            <button class="control-btn close" (click)="closeAIChatModal()">✕</button>
          </div>
        </div>

        <div class="modal-content chat-content-modern">
          <!-- Welcome Message -->
          <div class="welcome-section">
            <div class="welcome-avatar">
              <div class="avatar-modern-chat">🤖</div>
              <div class="welcome-pulse"></div>
            </div>
            <div class="welcome-text">
              <h3>Olá! 👋</h3>
              <p>Sou seu assistente financeiro IA. Como posso ajudar você hoje?</p>
            </div>
          </div>

          <!-- Quick Suggestions -->
          <div class="suggestions-grid">
            <button class="suggestion-card">
              <div class="suggestion-icon">💡</div>
              <div class="suggestion-content">
                <span class="suggestion-title">Otimizar Metas</span>
                <span class="suggestion-desc">Acelere seus objetivos</span>
              </div>
            </button>
            <button class="suggestion-card">
              <div class="suggestion-icon">📊</div>
              <div class="suggestion-content">
                <span class="suggestion-title">Análise Gastos</span>
                <span class="suggestion-desc">Encontre economias</span>
              </div>
            </button>
            <button class="suggestion-card">
              <div class="suggestion-icon">🎯</div>
              <div class="suggestion-content">
                <span class="suggestion-title">Nova Meta</span>
                <span class="suggestion-desc">Criar objetivo</span>
              </div>
            </button>
            <button class="suggestion-card">
              <div class="suggestion-icon">💰</div>
              <div class="suggestion-content">
                <span class="suggestion-title">Aumentar Renda</span>
                <span class="suggestion-desc">Estratégias extras</span>
              </div>
            </button>
          </div>

          <!-- Chat Messages Container -->
          <div class="chat-messages-container">
            <!-- AI Message -->
            <div class="message-wrapper ai-wrapper">
              <div class="message-avatar-modern">
                <div class="avatar-chat-ai">🤖</div>
              </div>
              <div class="message-bubble ai-bubble">
                <div class="message-header">
                  <span class="message-sender">VentureFi AI</span>
                  <span class="message-timestamp">Agora</span>
                </div>
                <div class="message-text">
                  <p>Analisei seu perfil financeiro e identifiquei algumas oportunidades interessantes para acelerar sua meta da <strong>Casa dos Sonhos</strong> 🏡</p>
                </div>
                <div class="ai-insights-modern">
                  <div class="insight-card">
                    <div class="insight-header">
                      <span class="insight-icon">💎</span>
                      <span class="insight-title">Reserva Otimizada</span>
                    </div>
                    <p>Você tem R$ 5.000 excedentes na reserva. Redirecionando, antecipa em <strong>2 meses</strong></p>
                    <div class="insight-impact positive">+R$ 5.000</div>
                  </div>
                  <div class="insight-card">
                    <div class="insight-header">
                      <span class="insight-icon">📉</span>
                      <span class="insight-title">Gastos Otimizáveis</span>
                    </div>
                    <p>Detectei R$ 400/mês otimizáveis. Reduzindo 50% libera R$ 200 extras mensais</p>
                    <div class="insight-impact positive">+R$ 200/mês</div>
                  </div>
                </div>
                <div class="message-actions">
                  <button class="action-btn primary">✓ Aplicar Sugestões</button>
                  <button class="action-btn secondary">📊 Ver Detalhes</button>
                </div>
              </div>
            </div>

            <!-- User Message -->
            <div class="message-wrapper user-wrapper">
              <div class="message-bubble user-bubble">
                <div class="message-text">
                  <p>Perfeito! Como posso implementar essas mudanças de forma prática?</p>
                </div>
                <span class="message-timestamp">Agora</span>
              </div>
              <div class="message-avatar-modern user-avatar">
                <div class="avatar-chat-user">👤</div>
              </div>
            </div>

            <!-- Typing Indicator -->
            <div class="message-wrapper ai-wrapper typing-wrapper">
              <div class="message-avatar-modern">
                <div class="avatar-chat-ai">🤖</div>
              </div>
              <div class="typing-bubble">
                <div class="typing-animation">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modern Chat Input -->
        <div class="chat-input-modern">
          <div class="input-container-modern">
            <button class="attachment-btn">📎</button>
            <div class="input-wrapper">
              <textarea 
                placeholder="Digite sua mensagem..." 
                class="message-input-modern"
                rows="1"></textarea>
              <div class="input-actions">
                <button class="voice-btn">🎤</button>
                <button class="send-btn-modern">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div class="input-footer">
            <span class="ai-disclaimer">IA pode cometer erros. Considere verificar informações importantes.</span>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Optimizer Modal -->
    <div class="modal-overlay" [class.active]="showOptimizerModal" (click)="closeOptimizerModal()">
      <div class="modal-container optimizer-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title">
            <h2>⚡ Otimizador IA</h2>
            <span class="ai-badge">🤖 IA</span>
          </div>
          <button class="modal-close" (click)="closeOptimizerModal()">✕</button>
        </div>

        <div class="modal-content">
          <!-- Optimization Analysis -->
          <div class="optimization-analysis">
            <h3>🔍 Análise de Otimização</h3>
            <div class="analysis-results">
              <div class="analysis-card success">
                <div class="analysis-icon">✅</div>
                <div class="analysis-content">
                  <h4>3 Oportunidades Encontradas</h4>
                  <p>A IA identificou melhorias que podem acelerar suas metas em até 4 meses</p>
                </div>
                <div class="analysis-impact">+4 meses</div>
              </div>

              <div class="analysis-card info">
                <div class="analysis-icon">📊</div>
                <div class="analysis-content">
                  <h4>Eficiência Atual: 76%</h4>
                  <p>Sua performance está acima da média, mas há espaço para melhorias</p>
                </div>
                <div class="analysis-impact">+24%</div>
              </div>
            </div>
          </div>

          <!-- Optimization Suggestions -->
          <div class="optimization-suggestions">
            <h3>💡 Sugestões de Otimização</h3>
            <div class="suggestions-list">
              <div class="optimization-item">
                <div class="opt-checkbox">
                  <input type="checkbox" id="opt1" checked>
                  <label for="opt1"></label>
                </div>
                <div class="opt-content">
                  <div class="opt-header">
                    <h4>Rebalanceamento de Metas</h4>
                    <span class="opt-impact high">Alto Impacto</span>
                  </div>
                  <p>Rebalancear prioridades entre "Casa dos Sonhos" e "Viagem Europa" para otimizar cronograma geral</p>
                  <div class="opt-details">
                    <span class="opt-saving">💰 Economia: R$ 12.400</span>
                    <span class="opt-time">⏰ Antecipação: 3 meses</span>
                  </div>
                </div>
              </div>

              <div class="optimization-item">
                <div class="opt-checkbox">
                  <input type="checkbox" id="opt2" checked>
                  <label for="opt2"></label>
                </div>
                <div class="opt-content">
                  <div class="opt-header">
                    <h4>Otimização de Investimentos</h4>
                    <span class="opt-impact medium">Médio Impacto</span>
                  </div>
                  <p>Migrar 30% dos aportes para investimentos de maior rentabilidade (12% → 15% a.a.)</p>
                  <div class="opt-details">
                    <span class="opt-saving">💰 Rendimento extra: R$ 8.200</span>
                    <span class="opt-time">⏰ Antecipação: 1.5 meses</span>
                  </div>
                </div>
              </div>

              <div class="optimization-item">
                <div class="opt-checkbox">
                  <input type="checkbox" id="opt3">
                  <label for="opt3"></label>
                </div>
                <div class="opt-content">
                  <div class="opt-header">
                    <h4>Automação de Aportes</h4>
                    <span class="opt-impact low">Baixo Impacto</span>
                  </div>
                  <p>Configurar aportes automáticos para evitar esquecimentos e manter disciplina</p>
                  <div class="opt-details">
                    <span class="opt-saving">📈 Consistência: +15%</span>
                    <span class="opt-time">⏰ Redução de risco</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Optimization Preview -->
          <div class="optimization-preview">
            <h3>🎯 Prévia dos Resultados</h3>
            <div class="preview-comparison">
              <div class="comparison-item current">
                <h4>📊 Situação Atual</h4>
                <div class="comparison-stats">
                  <div class="stat">
                    <span class="stat-label">Tempo médio</span>
                    <span class="stat-value">2a 8m</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Eficiência</span>
                    <span class="stat-value">76%</span>
                  </div>
                </div>
              </div>

              <div class="comparison-arrow">➤</div>

              <div class="comparison-item optimized">
                <h4>⚡ Após Otimização</h4>
                <div class="comparison-stats">
                  <div class="stat">
                    <span class="stat-label">Tempo médio</span>
                    <span class="stat-value improved">2a 4m</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Eficiência</span>
                    <span class="stat-value improved">92%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="modal-btn secondary" (click)="previewOptimization()">👁️ Prévia Detalhada</button>
          <button class="modal-btn primary" (click)="applyOptimization()">⚡ Aplicar Otimizações</button>
        </div>
      </div>
    </div>

    <!-- Reports Modal -->
    <div class="modal-overlay" [class.active]="showReportsModal" (click)="closeReportsModal()">
      <div class="modal-container reports-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title">
            <h2>📊 Relatórios Detalhados</h2>
          </div>
          <button class="modal-close" (click)="closeReportsModal()">✕</button>
        </div>

        <div class="modal-content">
          <!-- Report Filters -->
          <div class="report-filters">
            <div class="filter-group">
              <label>Período</label>
              <select class="form-select">
                <option>📅 Últimos 30 dias</option>
                <option>📅 Últimos 3 meses</option>
                <option>📅 Últimos 6 meses</option>
                <option>📅 Último ano</option>
                <option>📅 Personalizado</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Tipo de Relatório</label>
              <select class="form-select">
                <option>📊 Performance Geral</option>
                <option>🎯 Evolução de Metas</option>
                <option>💰 Análise Financeira</option>
                <option>🤖 Insights IA</option>
              </select>
            </div>
          </div>

          <!-- Report Content -->
          <div class="report-content">
            <!-- Executive Summary -->
            <div class="report-section">
              <h3>📋 Resumo Executivo</h3>
              <div class="executive-cards">
                <div class="exec-card">
                  <div class="exec-icon">🎯</div>
                  <div class="exec-content">
                    <h4>Metas Ativas</h4>
                    <span class="exec-value">3</span>
                    <span class="exec-change positive">+1 vs mês anterior</span>
                  </div>
                </div>

                <div class="exec-card">
                  <div class="exec-icon">💰</div>
                  <div class="exec-content">
                    <h4>Total Poupado</h4>
                    <span class="exec-value">R$ 285.400</span>
                    <span class="exec-change positive">+12% vs mês anterior</span>
                  </div>
                </div>

                <div class="exec-card">
                  <div class="exec-icon">📈</div>
                  <div class="exec-content">
                    <h4>Performance</h4>
                    <span class="exec-value">89%</span>
                    <span class="exec-change positive">+5% vs mês anterior</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Detailed Metrics -->
            <div class="report-section">
              <h3>📈 Métricas Detalhadas</h3>
              <div class="metrics-table">
                <div class="table-header">
                  <div class="table-cell">Meta</div>
                  <div class="table-cell">Progresso</div>
                  <div class="table-cell">Aporte Mensal</div>
                  <div class="table-cell">Prazo Restante</div>
                  <div class="table-cell">Status</div>
                </div>

                <div class="table-row">
                  <div class="table-cell">
                    <div class="goal-info-mini">
                      <span class="goal-emoji">🏠</span>
                      <span>Casa dos Sonhos</span>
                    </div>
                  </div>
                  <div class="table-cell">
                    <div class="progress-mini">
                      <div class="progress-bar-mini">
                        <div class="progress-fill-mini" style="width: 51.4%"></div>
                      </div>
                      <span>51.4%</span>
                    </div>
                  </div>
                  <div class="table-cell">R$ 2.800</div>
                  <div class="table-cell">2a 8m</div>
                  <div class="table-cell">
                    <span class="status-badge ahead">🟢 Adiantado</span>
                  </div>
                </div>

                <div class="table-row">
                  <div class="table-cell">
                    <div class="goal-info-mini">
                      <span class="goal-emoji">✈️</span>
                      <span>Viagem Europa</span>
                    </div>
                  </div>
                  <div class="table-cell">
                    <div class="progress-mini">
                      <div class="progress-bar-mini">
                        <div class="progress-fill-mini" style="width: 32%"></div>
                      </div>
                      <span>32%</span>
                    </div>
                  </div>
                  <div class="table-cell">R$ 800</div>
                  <div class="table-cell">1a 4m</div>
                  <div class="table-cell">
                    <span class="status-badge ontrack">🟡 No prazo</span>
                  </div>
                </div>

                <div class="table-row">
                  <div class="table-cell">
                    <div class="goal-info-mini">
                      <span class="goal-emoji">🚗</span>
                      <span>Carro Novo</span>
                    </div>
                  </div>
                  <div class="table-cell">
                    <div class="progress-mini">
                      <div class="progress-bar-mini">
                        <div class="progress-fill-mini" style="width: 15%"></div>
                      </div>
                      <span>15%</span>
                    </div>
                  </div>
                  <div class="table-cell">R$ 1.200</div>
                  <div class="table-cell">4a 2m</div>
                  <div class="table-cell">
                    <span class="status-badge behind">🔴 Atrasado</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- AI Insights -->
            <div class="report-section">
              <h3>🤖 Insights da IA</h3>
              <div class="ai-insights-report">
                <div class="insight-report-item positive">
                  <div class="insight-report-icon">📈</div>
                  <div class="insight-report-content">
                    <h4>Tendência Positiva</h4>
                    <p>Sua disciplina financeira melhorou 15% nos últimos 3 meses. Continue mantendo a consistência nos aportes.</p>
                  </div>
                </div>

                <div class="insight-report-item warning">
                  <div class="insight-report-icon">⚠️</div>
                  <div class="insight-report-content">
                    <h4>Atenção Necessária</h4>
                    <p>A meta "Carro Novo" está 2 meses atrasada. Considere aumentar o aporte ou revisar a prioridade.</p>
                  </div>
                </div>

                <div class="insight-report-item opportunity">
                  <div class="insight-report-icon">💡</div>
                  <div class="insight-report-content">
                    <h4>Oportunidade</h4>
                    <p>Com R$ 5.000 excedentes na reserva, você pode acelerar uma meta em 3 meses.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="modal-btn secondary" (click)="exportReport()">📄 Exportar PDF</button>
          <button class="modal-btn secondary" (click)="scheduleReport()">📅 Agendar Relatório</button>
          <button class="modal-btn primary" (click)="createCustomReport()">⚙️ Relatório Personalizado</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modern-dream-pursuit {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 2rem;
    }

    /* Header Styles */
    .dream-header {
      background: linear-gradient(135deg, #3b82f6, #1e40af);
      border-radius: 20px;
      padding: 3rem 2rem;
      margin-bottom: 2rem;
      color: white;
      position: relative;
      overflow: hidden;
    }

    .dream-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%);
      pointer-events: none;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .page-title {
      font-size: 3rem;
      font-weight: 800;
      margin: 0 0 0.5rem 0;
      background: linear-gradient(45deg, #ffffff, #e0f2fe);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .page-subtitle {
      font-size: 1.25rem;
      opacity: 0.9;
      margin: 0;
      font-weight: 500;
    }

    .header-stats {
      display: flex;
      gap: 2rem;
    }

    .stat-item {
      text-align: center;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .stat-value {
      display: block;
      font-size: 2rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.875rem;
      opacity: 0.8;
      font-weight: 500;
    }

    /* AI Assistant Section */
    .ai-assistant-section {
      margin-bottom: 3rem;
    }

    .ai-assistant-card {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      border-radius: 20px;
      padding: 2rem;
      color: white;
      display: flex;
      align-items: center;
      gap: 2rem;
      position: relative;
      overflow: hidden;
    }

    .ai-assistant-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%);
      pointer-events: none;
    }

    .ai-avatar {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .avatar-icon {
      width: 4rem;
      height: 4rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    .ai-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      opacity: 0.9;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    .ai-content {
      flex: 1;
    }

    .ai-content h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .ai-content p {
      margin: 0 0 1rem 0;
      opacity: 0.9;
      font-size: 1.1rem;
    }

    .ai-suggestions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .suggestion-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.95rem;
      opacity: 0.9;
    }

    .suggestion-icon {
      font-size: 1.25rem;
    }

    .ai-chat-btn {
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .ai-chat-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
    }

    /* New AI Assistant Design */
    .ai-assistant-card-new {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      padding: 1.5rem;
      color: white;
      position: relative;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
    }

    .ai-assistant-card-new::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
      pointer-events: none;
      border-radius: 20px;
    }

    .ai-header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .ai-avatar-new {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .avatar-glow {
      position: relative;
      width: 3.5rem;
      height: 3.5rem;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: glow-pulse 3s ease-in-out infinite;
    }

    @keyframes glow-pulse {
      0%, 100% { 
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        transform: scale(1);
      }
      50% { 
        box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
        transform: scale(1.05);
      }
    }

    .avatar-core {
      font-size: 1.5rem;
    }

    .ai-pulse-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      animation: pulse-dot 2s infinite;
    }

    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.2); }
    }

    .status-text {
      font-size: 0.75rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
    }

    .ai-stats-grid {
      display: flex;
      gap: 0.75rem;
    }

    .stat-pill {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 0.75rem 0.5rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      min-width: 4rem;
    }

    .stat-icon {
      font-size: 1.25rem;
      margin-bottom: 0.25rem;
    }

    .stat-number {
      font-size: 1rem;
      font-weight: 700;
      color: white;
    }

    .stat-label {
      font-size: 0.625rem;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
    }

    .ai-content-section {
      margin: 1rem 0;
    }

    .ai-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0 0 0.25rem 0;
      color: white;
    }

    .ai-subtitle {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.8);
      margin: 0 0 1rem 0;
    }

    .ai-insights-row {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .insight-chip {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 0.375rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .insight-chip.active {
      background: rgba(16, 185, 129, 0.2);
      border-color: rgba(16, 185, 129, 0.4);
      animation: chip-highlight 2s ease-in-out infinite alternate;
    }

    @keyframes chip-highlight {
      0% { transform: scale(1); }
      100% { transform: scale(1.02); }
    }

    .chip-icon {
      font-size: 0.875rem;
    }

    .chip-text {
      color: rgba(255, 255, 255, 0.95);
    }

    .ai-actions-section {
      display: flex;
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .ai-chat-btn-new {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .ai-chat-btn-new.primary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .ai-chat-btn-new.primary:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(255, 255, 255, 0.2);
    }

    .ai-chat-btn-new.secondary {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .ai-chat-btn-new.secondary:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-1px);
    }

    .btn-icon {
      font-size: 1rem;
    }

    /* Performance Section */
    .performance-section {
      margin-bottom: 3rem;
    }

    .performance-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }

    .performance-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      gap: 1.5rem;
      transition: all 0.3s ease;
    }

    .performance-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }

    .perf-icon {
      font-size: 2.5rem;
    }

    .perf-content {
      flex: 1;
    }

    .perf-content h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      font-weight: 700;
      color: #1e293b;
    }

    .perf-content p {
      margin: 0;
      color: #6b7280;
      font-size: 0.95rem;
    }

    .score-circle {
      position: relative;
      width: 80px;
      height: 80px;
    }

    .progress-ring {
      transform: rotate(-90deg);
    }

    .progress-ring-bg {
      fill: none;
      stroke: #e5e7eb;
      stroke-width: 6;
    }

    .progress-ring-progress {
      fill: none;
      stroke: #3b82f6;
      stroke-width: 6;
      stroke-linecap: round;
      stroke-dasharray: 220;
      transition: stroke-dashoffset 1s ease-in-out;
    }

    .performance-card.discipline .progress-ring-progress {
      stroke: #10b981;
    }

    .performance-card.efficiency .progress-ring-progress {
      stroke: #f59e0b;
    }

    .performance-card.growth .progress-ring-progress {
      stroke: #ef4444;
    }

    .performance-card.prediction .progress-ring-progress {
      stroke: #8b5cf6;
    }

    .score-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.25rem;
      font-weight: 800;
      color: #1e293b;
    }

    /* Insights Section */
    .insights-section {
      margin-bottom: 3rem;
    }

    .insights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .insight-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      position: relative;
    }

    .insight-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }

    .insight-card.opportunity {
      border-left: 4px solid #10b981;
    }

    .insight-card.trend {
      border-left: 4px solid #3b82f6;
    }

    .insight-card.warning {
      border-left: 4px solid #f59e0b;
    }

    .insight-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .insight-emoji {
      font-size: 2rem;
    }

    .insight-priority {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .insight-priority.high {
      background: #fecaca;
      color: #dc2626;
    }

    .insight-priority.medium {
      background: #dbeafe;
      color: #1d4ed8;
    }

    .insight-priority.warning {
      background: #fde68a;
      color: #d97706;
    }

    .insight-card h3 {
      margin: 0 0 1rem 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
    }

    .insight-card p {
      margin: 0 0 1.5rem 0;
      color: #374151;
      line-height: 1.6;
    }

    .insight-actions {
      display: flex;
      gap: 0.75rem;
    }

    .insight-btn {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
    }

    .insight-btn.primary {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }

    .insight-btn.primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .insight-btn.warning {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
    }

    .insight-btn.warning:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    }

    .insight-btn.secondary {
      background: #f8fafc;
      color: #374151;
      border: 1px solid #e5e7eb;
    }

    .insight-btn.secondary:hover {
      background: #f1f5f9;
      border-color: #3b82f6;
    }

    .insight-chart {
      margin-top: 1rem;
    }

    .mini-chart {
      display: flex;
      align-items: end;
      gap: 0.5rem;
      height: 60px;
    }

    .chart-bar {
      flex: 1;
      background: linear-gradient(180deg, #3b82f6, #1d4ed8);
      border-radius: 4px 4px 0 0;
      min-height: 20px;
      animation: growBar 2s ease-out;
    }

    @keyframes growBar {
      from { height: 0; }
      to { height: var(--final-height); }
    }

    /* Enhanced Actions Section */
    .actions-section {
      margin-bottom: 3rem;
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .action-card {
      background: white;
      border: none;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      text-align: left;
    }

    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }

    .action-card.primary {
      border: 2px solid #10b981;
    }

    .action-card.primary:hover {
      border-color: #059669;
      background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    }

    .action-card.secondary {
      border: 2px solid #3b82f6;
    }

    .action-card.secondary:hover {
      border-color: #1d4ed8;
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
    }

    .action-card.tertiary {
      border: 2px solid #f59e0b;
    }

    .action-card.tertiary:hover {
      border-color: #d97706;
      background: linear-gradient(135deg, #fef3c7, #fde68a);
    }

    .action-card.quaternary {
      border: 2px solid #8b5cf6;
    }

    .action-card.quaternary:hover {
      border-color: #7c3aed;
      background: linear-gradient(135deg, #f3e8ff, #e9d5ff);
    }

    .action-icon {
      font-size: 2.5rem;
      flex-shrink: 0;
    }

    .action-content h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
    }

    .action-content p {
      margin: 0;
      color: #6b7280;
      font-size: 0.95rem;
    }

    /* Notifications Section */
    .notifications-section {
      margin-bottom: 3rem;
    }

    .notifications-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .notification-item {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      gap: 1rem;
      position: relative;
      transition: all 0.3s ease;
    }

    .notification-item:hover {
      transform: translateX(4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }

    .notification-item.success {
      border-left: 4px solid #10b981;
    }

    .notification-item.info {
      border-left: 4px solid #3b82f6;
    }

    .notification-item.warning {
      border-left: 4px solid #f59e0b;
    }

    .notif-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }

    .notif-content {
      flex: 1;
    }

    .notif-content h4 {
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      font-weight: 700;
      color: #1e293b;
    }

    .notif-content p {
      margin: 0 0 0.5rem 0;
      color: #374151;
      line-height: 1.4;
    }

    .notif-time {
      font-size: 0.75rem;
      color: #9ca3af;
      font-weight: 500;
    }

    .notif-close {
      background: none;
      border: none;
      color: #9ca3af;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      transition: all 0.3s ease;
      position: absolute;
      top: 1rem;
      right: 1rem;
    }

    .notif-close:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.3s ease;
      cursor: pointer;
      border: none;
      text-decoration: none;
    }

    .action-btn.primary {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }

    .action-btn.primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
    }

    .action-btn.secondary {
      background: white;
      color: #374151;
      border: 2px solid #e5e7eb;
    }

    .action-btn.secondary:hover {
      border-color: #3b82f6;
      color: #3b82f6;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
    }

    .btn-icon {
      font-size: 1.25rem;
    }

    /* Goals Section */
    .goals-section {
      margin-bottom: 3rem;
    }

    .section-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 1.5rem 0;
    }

    .goals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.25rem;
    }

    .goal-card {
      background: white;
      border-radius: 16px;
      padding: 1.25rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      border: 1px solid rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .goal-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
    }

    .goal-card.completed {
      background: linear-gradient(135deg, #f0fdf4, #dcfce7);
      border-color: #16a34a;
    }

    .goal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .goal-name {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }

    .goal-priority {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .priority-high {
      background: #fef2f2;
      color: #dc2626;
    }

    .priority-medium {
      background: #fffbeb;
      color: #d97706;
    }

    .priority-low {
      background: #f0fdf4;
      color: #16a34a;
    }

    .goal-amount {
      text-align: right;
    }

    .goal-amount .current {
      display: block;
      font-size: 1.25rem;
      font-weight: 800;
      color: #1f2937;
    }

    .goal-amount .target {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .progress-section {
      margin-bottom: 1rem;
    }

    .progress-bar {
      height: 8px;
      background: #f3f4f6;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #1d4ed8);
      transition: width 0.5s ease;
    }

    .progress-text {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 600;
    }

    /* Compact Goal Card Styles */
    .goal-header-compact {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }

    .goal-title-section {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .badges-row {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .badge {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      background: rgba(0, 0, 0, 0.05);
    }

    .badge.earned {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      animation: badge-glow 2s ease-in-out infinite alternate;
    }

    .badge-count {
      font-size: 0.625rem;
      color: #6b7280;
      font-weight: 600;
      background: rgba(107, 114, 128, 0.1);
      padding: 0.125rem 0.375rem;
      border-radius: 8px;
    }

    @keyframes badge-glow {
      0% { box-shadow: 0 2px 4px rgba(251, 191, 36, 0.3); }
      100% { box-shadow: 0 4px 12px rgba(251, 191, 36, 0.5); }
    }

    .goal-amount-compact {
      text-align: right;
      display: flex;
      flex-direction: column;
    }

    .goal-amount-compact .current {
      font-size: 1rem;
      font-weight: 700;
      color: #059669;
    }

    .goal-amount-compact .target {
      font-size: 0.75rem;
      color: #6b7280;
      font-weight: 500;
    }

    .progress-section-compact {
      margin: 0.75rem 0;
    }

    .progress-wrapper {
      position: relative;
    }

    .progress-bar-enhanced {
      height: 8px;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 10px;
      position: relative;
      overflow: visible;
      margin-bottom: 0.5rem;
    }

    .checkpoint {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 2;
    }

    .checkpoint-icon {
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.625rem;
      font-weight: 600;
      background: white;
      border: 2px solid #e5e7eb;
      color: #6b7280;
      position: relative;
      left: -0.625rem;
    }

    .checkpoint-icon.completed {
      background: #10b981;
      color: white;
      border-color: #10b981;
    }

    .checkpoint-icon.next {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
      animation: pulse-checkpoint 2s infinite;
    }

    @keyframes pulse-checkpoint {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .ai-insight {
      font-size: 0.625rem;
      color: #8b5cf6;
      font-weight: 600;
      background: rgba(139, 92, 246, 0.1);
      padding: 0.125rem 0.5rem;
      border-radius: 6px;
    }

    .goal-actions-compact {
      margin-top: 0.75rem;
    }

    .card-btn-compact {
      width: 100%;
      padding: 0.625rem 1rem;
      border: none;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.375rem;
    }

    .card-btn-compact.primary {
      background: linear-gradient(135deg, #059669, #047857);
      color: white;
    }

    .card-btn-compact.primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
    }

    .goal-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .time-remaining {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .goal-actions {
      display: flex;
      gap: 0.75rem;
    }

    .card-btn {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
    }

    .card-btn.primary {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
    }

    .card-btn.primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .card-btn.secondary {
      background: #f8fafc;
      color: #1e293b;
      border: 1px solid #e2e8f0;
    }

    .card-btn.secondary:hover {
      background: #f1f5f9;
      border-color: #3b82f6;
    }

    .add-card {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 300px;
      cursor: pointer;
      border: 2px dashed #e2e8f0;
      background: #f8fafc;
    }

    .add-card:hover {
      border-color: #3b82f6;
      background: rgba(59, 130, 246, 0.02);
    }

    .add-content {
      text-align: center;
    }

    .add-icon {
      font-size: 3rem;
      color: #94a3b8;
      margin-bottom: 1rem;
    }

    .add-card h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .add-card p {
      color: #64748b;
      margin: 0;
    }

    /* Statistics Section */
    .stats-section {
      margin-bottom: 3rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
    }

    .stat-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .stat-icon {
      font-size: 1.5rem;
    }

    .stat-header h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #64748b;
      margin: 0;
    }

    .stat-card .stat-value {
      font-size: 2rem;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .stat-change {
      font-size: 0.875rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 8px;
    }

    .stat-change.positive {
      background: rgba(16, 185, 129, 0.1);
      color: #059669;
    }

    /* Advanced Example Card Styles - Concise Version */
    .advanced-example {
      position: relative;
      border: 2px solid #3b82f6;
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      box-shadow: 0 8px 32px rgba(59, 130, 246, 0.15);
    }

    /* Quick AI Insight */
    .ai-insight-quick {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      color: white;
      padding: 0.75rem;
      border-radius: 8px;
      margin: 1rem 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
    }

    .ai-insight-quick .insight-icon {
      font-size: 1.25rem;
    }

    /* Progress Header with Badges */
    .badges-preview {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .badge-mini {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
    }

    .badge-mini.earned {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
    }

    .badge-counter {
      font-size: 0.75rem;
      color: #6b7280;
      font-weight: 600;
    }

    /* Simple Progress Bar */
    .progress-bar-simple {
      position: relative;
      margin: 1rem 0;
    }

    .checkpoint-marker {
      position: absolute;
      top: -8px;
      transform: translateX(-50%);
    }

    .checkpoint-mini {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      background: #e5e7eb;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .checkpoint-mini.completed {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }

    .checkpoint-mini.next {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      animation: pulse 2s infinite;
    }

    /* Quick Stats */
    .quick-stats {
      display: flex;
      justify-content: space-between;
      margin: 1.5rem 0;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 8px;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .stat-icon {
      font-size: 1.25rem;
    }

    .stat-text {
      font-size: 0.75rem;
      color: #6b7280;
      font-weight: 500;
      text-align: center;
    }

    .goal-title-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }

    .ai-badge {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      animation: pulse-ai 2s infinite;
    }

    @keyframes pulse-ai {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .goal-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .goal-category {
      background: #eff6ff;
      color: #1e40af;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .checkpoint-badge {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      animation: glow-badge 3s infinite;
    }

    @keyframes glow-badge {
      0%, 100% { box-shadow: 0 0 0 rgba(245, 158, 11, 0.4); }
      50% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.6); }
    }

    .completion-rate {
      font-size: 1rem;
      font-weight: 700;
      color: #059669;
      background: rgba(16, 185, 129, 0.1);
      padding: 0.25rem 0.75rem;
      border-radius: 8px;
      margin-top: 0.5rem;
      display: inline-block;
    }

    /* AI Insight Card */
    .ai-insight-card {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      color: white;
      padding: 1rem;
      border-radius: 12px;
      margin: 1.5rem 0;
      display: flex;
      align-items: center;
      gap: 1rem;
      position: relative;
      overflow: hidden;
    }

    .ai-insight-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%);
      pointer-events: none;
    }

    .insight-icon {
      font-size: 1.5rem;
      animation: think-pulse 1.5s infinite;
    }

    @keyframes think-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .insight-content {
      flex: 1;
      font-size: 0.95rem;
      line-height: 1.4;
    }

    /* Advanced Progress Section */
    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .next-checkpoint {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .progress-bar-advanced {
      position: relative;
      margin: 1rem 0;
    }

    .checkpoint-markers {
      display: flex;
      justify-content: space-between;
      position: relative;
      margin-bottom: 1rem;
    }

    .checkpoint {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      z-index: 2;
    }

    .checkpoint-icon {
      width: 2.5rem;
      height: 2.5rem;
      background: #e5e7eb;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      margin-bottom: 0.5rem;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .checkpoint-completed .checkpoint-icon {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      transform: scale(1.1);
    }

    .checkpoint-next .checkpoint-icon {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      animation: next-checkpoint-pulse 2s infinite;
    }

    @keyframes next-checkpoint-pulse {
      0%, 100% { transform: scale(1.1); box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3); }
      50% { transform: scale(1.2); box-shadow: 0 4px 16px rgba(59, 130, 246, 0.5); }
    }

    .checkpoint-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
    }

    .checkpoint-completed .checkpoint-label {
      color: #059669;
      font-weight: 700;
    }

    .checkpoint-next .checkpoint-label {
      color: #1d4ed8;
      font-weight: 700;
    }

    .progress-glow {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 51.4%;
      background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
      border-radius: 10px;
      animation: progress-shimmer 3s infinite;
    }

    @keyframes progress-shimmer {
      0% { opacity: 0; }
      50% { opacity: 1; }
      100% { opacity: 0; }
    }

    /* Smart Recommendations */
    .smart-recommendations {
      background: #f8fafc;
      border-radius: 12px;
      padding: 1.5rem;
      margin: 1.5rem 0;
      border-left: 4px solid #3b82f6;
    }

    .smart-recommendations h4 {
      margin: 0 0 1rem 0;
      font-size: 1rem;
      font-weight: 700;
      color: #1e293b;
    }

    .recommendation-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .recommendation-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
      color: #374151;
      line-height: 1.4;
    }

    .rec-icon {
      font-size: 1rem;
      flex-shrink: 0;
    }

    /* Gamification Section */
    .gamification-section {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      border-radius: 12px;
      padding: 1.5rem;
      margin: 1.5rem 0;
    }

    .badges-earned {
      margin-bottom: 1rem;
    }

    .badge-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #92400e;
      margin-bottom: 0.5rem;
      display: block;
    }

    .badges-list {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .badge {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .badge.earned {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    }

    .badge.pending {
      background: #e5e7eb;
      color: #9ca3af;
      opacity: 0.7;
    }

    .badge:hover {
      transform: scale(1.2);
    }

    .streak-counter {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #92400e;
    }

    .streak-icon {
      font-size: 1rem;
      animation: fire-flicker 1s infinite alternate;
    }

    @keyframes fire-flicker {
      0% { transform: scale(1) rotate(-1deg); }
      100% { transform: scale(1.05) rotate(1deg); }
    }

    /* Scenario Simulation */
    .scenario-preview {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      margin: 1.5rem 0;
      border: 2px solid #e5e7eb;
    }

    .scenario-preview h4 {
      margin: 0 0 1rem 0;
      font-size: 1rem;
      font-weight: 700;
      color: #1e293b;
    }

    .scenario-options {
      display: flex;
      gap: 0.75rem;
    }

    .scenario-btn {
      flex: 1;
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .scenario-btn:hover {
      border-color: #3b82f6;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
    }

    .scenario-btn.selected {
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .scenario-emoji {
      font-size: 1.5rem;
    }

    .scenario-info {
      text-align: center;
    }

    .scenario-name {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.25rem;
    }

    .scenario-result {
      font-size: 0.75rem;
      color: #6b7280;
    }

    /* WhatsApp Integration */
    .whatsapp-integration {
      background: linear-gradient(135deg, #dcfce7, #bbf7d0);
      border-radius: 12px;
      padding: 1.5rem;
      margin: 1.5rem 0;
    }

    .whatsapp-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .whatsapp-icon {
      font-size: 1.25rem;
    }

    .whatsapp-title {
      font-size: 1rem;
      font-weight: 600;
      color: #166534;
    }

    .whatsapp-status {
      background: #16a34a;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-left: auto;
    }

    .message-preview {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(255, 255, 255, 0.7);
      padding: 1rem;
      border-radius: 8px;
    }

    .message-icon {
      font-size: 1.25rem;
    }

    .message-text {
      font-size: 0.875rem;
      color: #166534;
      font-style: italic;
    }

    /* Advanced Footer */
    .advanced-example .goal-footer {
      border-top: 1px solid #e5e7eb;
      padding-top: 1.5rem;
      margin-top: 1.5rem;
    }

    .time-remaining {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .time-icon {
      font-size: 1rem;
    }

    .ahead-schedule {
      font-size: 0.75rem;
      background: rgba(16, 185, 129, 0.1);
      color: #059669;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-weight: 600;
      display: inline-block;
      width: fit-content;
    }

    .btn-icon {
      font-size: 0.875rem;
      margin-right: 0.25rem;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .modal-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    .modal-container {
      background: white;
      border-radius: 20px;
      width: 100%;
      max-width: 900px;
      max-height: 90vh;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      transform: translateY(30px);
      transition: transform 0.3s ease;
    }

    .modal-overlay.active .modal-container {
      transform: translateY(0);
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2rem;
      border-bottom: 1px solid #e5e7eb;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
    }

    .modal-title {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .modal-title h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .modal-close {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1.25rem;
      transition: all 0.3s ease;
    }

    .modal-close:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .modal-content {
      max-height: 60vh;
      overflow-y: auto;
      padding: 2rem;
    }

    .modal-section {
      margin-bottom: 2rem;
    }

    .modal-section h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 1.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* AI Insights Expanded */
    .ai-insight-expanded {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .insight-card {
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid #e5e7eb;
    }

    .insight-card.primary {
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
      border-color: #3b82f6;
    }

    .insight-card.secondary {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      border-color: #f59e0b;
    }

    .insight-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .insight-emoji {
      font-size: 2rem;
    }

    .insight-header h4 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 700;
      color: #1e293b;
    }

    .insight-header p {
      margin: 0;
      color: #6b7280;
      font-weight: 500;
    }

    .insight-details {
      color: #374151;
      line-height: 1.6;
    }

    /* Timeline */
    .timeline-container {
      position: relative;
      padding-left: 2rem;
    }

    .timeline-container::before {
      content: '';
      position: absolute;
      left: 1rem;
      top: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(180deg, #10b981, #3b82f6);
    }

    .timeline-item {
      position: relative;
      margin-bottom: 2rem;
      padding-left: 2rem;
    }

    .timeline-marker {
      position: absolute;
      left: -2rem;
      top: 0;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .timeline-item.completed .timeline-marker {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }

    .timeline-item.current .timeline-marker {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
      animation: glow 2s infinite;
    }

    .timeline-item.next .timeline-marker {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
    }

    @keyframes glow {
      0%, 100% { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
      50% { box-shadow: 0 4px 20px rgba(245, 158, 11, 0.5); }
    }

    .timeline-content h4 {
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      font-weight: 700;
      color: #1e293b;
    }

    .timeline-date {
      color: #6b7280;
      font-size: 0.875rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
    }

    .timeline-content p {
      color: #374151;
      margin: 0;
      line-height: 1.5;
    }

    /* Scenarios Detailed */
    .scenarios-detailed {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .scenario-card {
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }

    .scenario-card:hover {
      border-color: #3b82f6;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
    }

    .scenario-card.selected {
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .scenario-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .scenario-header h4 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      color: #1e293b;
    }

    .scenario-time {
      background: #3b82f6;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .scenario-details p {
      margin: 0.5rem 0;
      font-size: 0.875rem;
      color: #374151;
    }

    /* Gamification Detailed */
    .gamification-detailed {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .achievements-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .achievement-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 12px;
      border: 2px solid #e5e7eb;
      transition: all 0.3s ease;
    }

    .achievement-item.earned {
      border-color: #f59e0b;
      background: linear-gradient(135deg, #fef3c7, #fde68a);
    }

    .achievement-item.pending {
      opacity: 0.6;
    }

    .achievement-icon {
      font-size: 2rem;
    }

    .achievement-info h4 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      color: #1e293b;
    }

    .achievement-info p {
      margin: 0.25rem 0;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .rarity {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .rarity.common {
      background: #e5e7eb;
      color: #6b7280;
    }

    .rarity.rare {
      background: #dbeafe;
      color: #1d4ed8;
    }

    .rarity.epic {
      background: #fde68a;
      color: #d97706;
    }

    .rarity.legendary {
      background: #fecaca;
      color: #dc2626;
    }

    /* Streak Detailed */
    .streak-detailed {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      border-radius: 12px;
      padding: 1.5rem;
    }

    .streak-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .streak-info h4 {
      margin: 0;
      color: #92400e;
    }

    .streak-info p {
      margin: 0;
      color: #92400e;
      font-weight: 600;
    }

    .streak-info small {
      color: #a16207;
    }

    .streak-progress {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .streak-bar {
      height: 8px;
      background: #fed7aa;
      border-radius: 4px;
      overflow: hidden;
    }

    .streak-fill {
      height: 100%;
      background: linear-gradient(90deg, #f59e0b, #d97706);
      transition: width 0.3s ease;
    }

    .streak-next {
      font-size: 0.875rem;
      color: #92400e;
      font-weight: 600;
    }

    /* WhatsApp Detailed */
    .whatsapp-detailed {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .whatsapp-config {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .config-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }

    .config-icon {
      font-size: 1.5rem;
    }

    .config-info {
      flex: 1;
    }

    .config-info h4 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
    }

    .config-info p {
      margin: 0;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .config-status {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .config-status.active {
      background: #dcfce7;
      color: #166534;
    }

    .config-status.inactive {
      background: #fecaca;
      color: #991b1b;
    }

    .message-examples h4 {
      margin: 0 0 1rem 0;
      color: #1e293b;
    }

    .message-example {
      margin-bottom: 1rem;
      padding: 1rem;
      background: #dcfce7;
      border-radius: 8px;
      border-left: 4px solid #16a34a;
    }

    .message-type {
      font-size: 0.75rem;
      font-weight: 600;
      color: #166534;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
      display: block;
    }

    .message-example p {
      margin: 0;
      color: #166534;
      font-style: italic;
    }

    /* Modal Footer */
    .modal-footer {
      padding: 1.5rem 2rem;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    .modal-btn {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .modal-btn.primary {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
    }

    .modal-btn.primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .modal-btn.secondary {
      background: #f8fafc;
      color: #374151;
      border: 1px solid #e5e7eb;
    }

    .modal-btn.secondary:hover {
      background: #f1f5f9;
      border-color: #3b82f6;
    }

    /* Modern AI Modal Styles */
    .ai-header-modern {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1.5rem 2rem;
      border-bottom: none;
      position: relative;
      overflow: hidden;
    }

    .ai-header-modern::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
      pointer-events: none;
    }

    .ai-modal-branding {
      display: flex;
      align-items: center;
      gap: 1rem;
      z-index: 1;
      position: relative;
    }

    .ai-avatar-modern {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-glow-modal {
      width: 3rem;
      height: 3rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      animation: modal-avatar-glow 3s ease-in-out infinite;
    }

    @keyframes modal-avatar-glow {
      0%, 100% { 
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        transform: scale(1);
      }
      50% { 
        box-shadow: 0 0 30px rgba(255, 255, 255, 0.6);
        transform: scale(1.05);
      }
    }

    .avatar-emoji {
      font-size: 1.25rem;
    }

    .ai-pulse-ring {
      position: absolute;
      width: 3.5rem;
      height: 3.5rem;
      border: 2px solid rgba(16, 185, 129, 0.6);
      border-radius: 50%;
      animation: pulse-ring-modal 2s ease-out infinite;
    }

    @keyframes pulse-ring-modal {
      0% {
        transform: scale(0.9);
        opacity: 1;
      }
      100% {
        transform: scale(1.3);
        opacity: 0;
      }
    }

    .ai-identity {
      color: white;
    }

    .ai-modal-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0 0 0.25rem 0;
      color: white;
    }

    .ai-status-modern {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      animation: status-pulse 2s infinite;
    }

    @keyframes status-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .status-label {
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
    }

    .typing-indicator {
      display: none;
      gap: 0.25rem;
      margin-left: 0.5rem;
    }

    .typing-indicator.active {
      display: flex;
    }

    .typing-indicator span {
      width: 4px;
      height: 4px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      animation: typing-dot 1.4s infinite ease-in-out;
    }

    .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
    .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes typing-dot {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }

    .modal-controls {
      display: flex;
      gap: 0.5rem;
      z-index: 1;
      position: relative;
    }

    .control-btn {
      width: 2rem;
      height: 2rem;
      border: none;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .control-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.05);
    }

    .control-btn.close:hover {
      background: rgba(239, 68, 68, 0.8);
      border-color: rgba(239, 68, 68, 1);
    }

    /* Modern Chat Interface Styles */
    .chat-content-modern {
      display: flex;
      flex-direction: column;
      height: 70vh;
      background: #f8fafc;
    }

    .welcome-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 2rem;
      background: white;
      border-bottom: 1px solid #e2e8f0;
    }

    .welcome-avatar {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-modern-chat {
      width: 3rem;
      height: 3rem;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .welcome-pulse {
      position: absolute;
      width: 3.5rem;
      height: 3.5rem;
      border: 2px solid rgba(102, 126, 234, 0.4);
      border-radius: 50%;
      animation: welcome-pulse 2s infinite;
    }

    @keyframes welcome-pulse {
      0% { transform: scale(0.9); opacity: 1; }
      100% { transform: scale(1.3); opacity: 0; }
    }

    .welcome-text h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 0.25rem 0;
    }

    .welcome-text p {
      color: #64748b;
      margin: 0;
      font-size: 0.875rem;
    }

    .suggestions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.75rem;
      padding: 1.5rem 2rem;
      background: white;
      border-bottom: 1px solid #e2e8f0;
    }

    .suggestion-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }

    .suggestion-card:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .suggestion-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .suggestion-content {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .suggestion-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1e293b;
    }

    .suggestion-desc {
      font-size: 0.75rem;
      color: #64748b;
    }

    .chat-messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .message-wrapper {
      display: flex;
      gap: 0.75rem;
      max-width: 85%;
    }

    .message-wrapper.ai-wrapper {
      align-self: flex-start;
    }

    .message-wrapper.user-wrapper {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .message-avatar-modern {
      flex-shrink: 0;
    }

    .avatar-chat-ai {
      width: 2rem;
      height: 2rem;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      color: white;
    }

    .avatar-chat-user {
      width: 2rem;
      height: 2rem;
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      color: white;
    }

    .message-bubble {
      background: white;
      border-radius: 16px;
      padding: 1rem 1.25rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
      position: relative;
    }

    .ai-bubble {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-color: #e2e8f0;
    }

    .ai-bubble::before {
      content: '';
      position: absolute;
      left: -6px;
      top: 12px;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 6px 6px 6px 0;
      border-color: transparent #f8fafc transparent transparent;
    }

    .user-bubble {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      border-color: #2563eb;
    }

    .user-bubble::before {
      content: '';
      position: absolute;
      right: -6px;
      top: 12px;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 6px 0 6px 6px;
      border-color: transparent transparent transparent #3b82f6;
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .message-sender {
      font-size: 0.75rem;
      font-weight: 600;
      color: #6366f1;
    }

    .message-timestamp {
      font-size: 0.625rem;
      color: #94a3b8;
    }

    .user-bubble .message-timestamp {
      color: rgba(255, 255, 255, 0.8);
    }

    .message-text p {
      margin: 0 0 0.75rem 0;
      font-size: 0.875rem;
      line-height: 1.5;
      color: #334155;
    }

    .user-bubble .message-text p {
      color: white;
      margin-bottom: 0.5rem;
    }

    .ai-insights-modern {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin: 1rem 0;
    }

    .insight-card {
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 0.875rem;
      backdrop-filter: blur(10px);
    }

    .insight-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .insight-icon {
      font-size: 1rem;
    }

    .insight-title {
      font-size: 0.75rem;
      font-weight: 600;
      color: #1e293b;
    }

    .insight-card p {
      font-size: 0.75rem;
      color: #475569;
      margin: 0 0 0.5rem 0;
      line-height: 1.4;
    }

    .insight-impact {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-size: 0.625rem;
      font-weight: 600;
    }

    .insight-impact.positive {
      background: rgba(16, 185, 129, 0.1);
      color: #059669;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .message-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .action-btn {
      padding: 0.5rem 0.875rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .action-btn.primary {
      background: #3b82f6;
      color: white;
    }

    .action-btn.primary:hover {
      background: #2563eb;
      transform: translateY(-1px);
    }

    .action-btn.secondary {
      background: rgba(71, 85, 105, 0.1);
      color: #475569;
      border: 1px solid #e2e8f0;
    }

    .action-btn.secondary:hover {
      background: rgba(71, 85, 105, 0.15);
    }

    .typing-bubble {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 1rem 1.25rem;
      position: relative;
    }

    .typing-bubble::before {
      content: '';
      position: absolute;
      left: -6px;
      top: 12px;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 6px 6px 6px 0;
      border-color: transparent white transparent transparent;
    }

    .typing-animation {
      display: flex;
      gap: 0.25rem;
      align-items: center;
    }

    .typing-animation span {
      width: 6px;
      height: 6px;
      background: #cbd5e1;
      border-radius: 50%;
      animation: typing-bounce 1.4s infinite ease-in-out;
    }

    .typing-animation span:nth-child(1) { animation-delay: -0.32s; }
    .typing-animation span:nth-child(2) { animation-delay: -0.16s; }
    .typing-animation span:nth-child(3) { animation-delay: 0s; }

    @keyframes typing-bounce {
      0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
      40% { transform: scale(1); opacity: 1; }
    }

    .chat-input-modern {
      background: white;
      border-top: 1px solid #e2e8f0;
      padding: 1rem 2rem 1.5rem;
    }

    .input-container-modern {
      display: flex;
      align-items: flex-end;
      gap: 0.75rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 0.75rem 1rem;
      transition: all 0.2s ease;
    }

    .input-container-modern:focus-within {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .attachment-btn, .voice-btn {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 6px;
      transition: background 0.2s ease;
    }

    .attachment-btn:hover, .voice-btn:hover {
      background: rgba(71, 85, 105, 0.1);
    }

    .input-wrapper {
      flex: 1;
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
    }

    .message-input-modern {
      flex: 1;
      border: none;
      background: transparent;
      resize: none;
      outline: none;
      font-size: 0.875rem;
      line-height: 1.5;
      color: #1e293b;
      min-height: 1.5rem;
      max-height: 6rem;
      font-family: inherit;
    }

    .message-input-modern::placeholder {
      color: #94a3b8;
    }

    .input-actions {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .send-btn-modern {
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .send-btn-modern:hover {
      background: #2563eb;
      transform: scale(1.05);
    }

    .input-footer {
      text-align: center;
      margin-top: 0.75rem;
    }

    .ai-disclaimer {
      font-size: 0.625rem;
      color: #94a3b8;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .header-content {
        flex-direction: column;
        text-align: center;
        gap: 2rem;
      }

      .header-stats {
        justify-content: center;
      }

      .goals-grid {
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .modern-dream-pursuit {
        padding: 1rem;
      }

      .dream-header {
        padding: 2rem;
      }

      .page-title {
        font-size: 2rem;
      }

      .header-stats {
        flex-direction: column;
        width: 100%;
      }

      .stat-item {
        padding: 1rem;
      }

      .quick-actions {
        flex-direction: column;
      }

      .action-btn {
        justify-content: center;
      }

      .goals-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .goal-card {
        padding: 1.5rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }

    .modal {
      background: white;
      border-radius: 20px;
      max-width: 900px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
      animation: modalSlideIn 0.3s ease-out;
    }

    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .modal-header {
      padding: 2rem;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h2 {
      margin: 0;
      color: #1e293b;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #64748b;
      padding: 0.5rem;
      border-radius: 50%;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: #f1f5f9;
      color: #1e293b;
    }

    .modal-content {
      padding: 2rem;
    }

    .modal-footer {
      padding: 1.5rem 2rem;
      border-top: 1px solid #f0f0f0;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    /* New Goal Modal Styles */
    .wizard-steps {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2rem;
      position: relative;
    }

    .wizard-steps::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 0;
      right: 0;
      height: 2px;
      background: #e2e8f0;
      z-index: 1;
    }

    .wizard-step {
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: #64748b;
      position: relative;
      z-index: 2;
    }

    .wizard-step.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: #667eea;
      color: white;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #1e293b;
    }

    .form-input {
      width: 100%;
      padding: 0.875rem;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.2s;
      box-sizing: border-box;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-select {
      width: 100%;
      padding: 0.875rem;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 1rem;
      background: white;
      cursor: pointer;
      box-sizing: border-box;
    }

    .ai-suggestions {
      background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
      border-radius: 12px;
      padding: 1.5rem;
      margin-top: 1rem;
    }

    .ai-suggestions h4 {
      margin: 0 0 1rem 0;
      color: #667eea;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .suggestion-item {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .suggestion-item:hover {
      border-color: #667eea;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
    }

    /* Simulator Modal Styles */
    .scenario-tabs {
      display: flex;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 2rem;
    }

    .scenario-tab {
      padding: 1rem 1.5rem;
      border: none;
      background: none;
      cursor: pointer;
      color: #64748b;
      font-weight: 500;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
    }

    .scenario-tab.active {
      color: #667eea;
      border-bottom-color: #667eea;
    }

    .range-group {
      margin-bottom: 1.5rem;
    }

    .range-input {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: #e2e8f0;
      outline: none;
      -webkit-appearance: none;
      margin: 0.5rem 0;
    }

    .range-input::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
    }

    .range-input::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
    }

    .range-values {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      color: #64748b;
    }

    .chart-container {
      background: #f8fafc;
      border-radius: 12px;
      padding: 1.5rem;
      margin: 1.5rem 0;
      text-align: center;
      color: #64748b;
    }

    /* AI Chat Modal Styles */
    .chat-container {
      height: 400px;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
    }

    .chat-messages {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      background: #f8fafc;
    }

    .chat-message {
      margin-bottom: 1rem;
      display: flex;
      gap: 0.75rem;
    }

    .chat-message.user {
      flex-direction: row-reverse;
    }

    .message-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      flex-shrink: 0;
    }

    .message-avatar.ai {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .message-avatar.user {
      background: #e2e8f0;
      color: #1e293b;
    }

    .message-bubble {
      max-width: 70%;
      padding: 0.875rem 1rem;
      border-radius: 16px;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .message-bubble.ai {
      background: white;
      border: 1px solid #e2e8f0;
      color: #1e293b;
    }

    .message-bubble.user {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #64748b;
      font-style: italic;
      padding: 0.5rem 1rem;
    }

    .typing-dots {
      display: flex;
      gap: 3px;
    }

    .typing-dot {
      width: 6px;
      height: 6px;
      background: #64748b;
      border-radius: 50%;
      animation: typingPulse 1.5s infinite;
    }

    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typingPulse {
      0%, 60%, 100% { opacity: 0.3; }
      30% { opacity: 1; }
    }

    .chat-input {
      padding: 1rem;
      border-top: 1px solid #e2e8f0;
      background: white;
      border-radius: 0 0 12px 12px;
    }

    .chat-input-group {
      display: flex;
      gap: 0.75rem;
      align-items: flex-end;
    }

    .chat-textarea {
      flex: 1;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 0.75rem;
      resize: none;
      font-family: inherit;
      font-size: 0.9rem;
      max-height: 100px;
    }

    .send-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 0.75rem 1rem;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .send-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .quick-questions {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .quick-question {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .quick-question:hover {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    /* AI Optimizer Modal Styles */
    .optimization-sections {
      display: grid;
      gap: 1.5rem;
    }

    .optimization-section {
      background: #f8fafc;
      border-radius: 12px;
      padding: 1.5rem;
    }

    .optimization-section h4 {
      margin: 0 0 1rem 0;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .optimization-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .optimization-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid #e2e8f0;
    }

    .optimization-item:last-child {
      border-bottom: none;
    }

    .optimization-checkbox {
      width: 18px;
      height: 18px;
      border: 2px solid #e2e8f0;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .optimization-checkbox.checked {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: #667eea;
      color: white;
    }

    .optimization-text {
      flex: 1;
      font-size: 0.9rem;
      color: #1e293b;
    }

    .optimization-impact {
      font-size: 0.8rem;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-weight: 500;
    }

    .optimization-impact.high {
      background: #fef2f2;
      color: #dc2626;
    }

    .optimization-impact.medium {
      background: #fffbeb;
      color: #d97706;
    }

    .optimization-impact.low {
      background: #f0fdf4;
      color: #16a34a;
    }

    .before-after {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin: 1.5rem 0;
    }

    .before-after-item {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
      border: 1px solid #e2e8f0;
    }

    .before-after-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #64748b;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .before-after-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
    }

    /* Reports Modal Styles */
    .report-filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: 150px;
    }

    .filter-group label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #64748b;
    }

    .report-summary {
      background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .report-summary h4 {
      margin: 0 0 1rem 0;
      color: #1e293b;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .summary-item {
      text-align: center;
    }

    .summary-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }

    .summary-label {
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 500;
    }

    .report-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .report-table th {
      background: #f8fafc;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #1e293b;
      font-size: 0.875rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .report-table td {
      padding: 1rem;
      border-bottom: 1px solid #f1f5f9;
      color: #1e293b;
      font-size: 0.9rem;
    }

    .report-table tr:hover {
      background: #f8fafc;
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.active {
      background: #dcfce7;
      color: #166534;
    }

    .status-badge.completed {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-badge.delayed {
      background: #fee2e2;
      color: #991b1b;
    }

    /* Modal Button Styles */
    .modal-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      font-size: 0.9rem;
    }

    .modal-btn.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .modal-btn.primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .modal-btn.secondary {
      background: #f1f5f9;
      color: #64748b;
      border: 1px solid #e2e8f0;
    }

    .modal-btn.secondary:hover {
      background: #e2e8f0;
      color: #1e293b;
    }

    .modal-btn.success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }

    .modal-btn.success:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    /* Responsive Modal Styles */
    @media (max-width: 768px) {
      .modal {
        margin: 1rem;
        max-height: calc(100vh - 2rem);
      }

      .modal-header, .modal-content, .modal-footer {
        padding: 1.5rem;
      }

      .before-after {
        grid-template-columns: 1fr;
      }

      .report-filters {
        flex-direction: column;
      }

      .summary-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .scenario-tabs {
        flex-direction: column;
      }

      .wizard-steps {
        justify-content: center;
        gap: 1rem;
      }

      .chat-container {
        height: 300px;
      }
    }
  `]
})
export class DreamPursuitSuperComponent implements OnInit {
  showAdvancedModal = false;
  showNewGoalModal = false;
  showSimulatorModal = false;
  showAIChatModal = false;
  showOptimizerModal = false;
  showReportsModal = false;

  constructor(private dataService: DataService) { }

  ngOnInit(): void { }

  getGoals(): Goal[] {
    return this.dataService.getGoals();
  }

  getActiveGoals(): number {
    return this.getGoals().filter(goal => !goal.completed).length;
  }

  getCompletedGoals(): number {
    return this.getGoals().filter(goal => goal.completed).length;
  }

  getTotalSaved(): string {
    const total = this.getGoals().reduce((sum, goal) => sum + goal.saved, 0);
    return this.formatCurrency(total);
  }

  getProgressAverage(): number {
    const goals = this.getGoals().filter(goal => !goal.completed);
    if (goals.length === 0) return 0;
    const totalProgress = goals.reduce((sum, goal) => sum + this.getProgressPercentage(goal), 0);
    return Math.round(totalProgress / goals.length);
  }

  getProgressPercentage(goal: Goal): number {
    return Math.round((goal.saved / goal.target) * 100);
  }

  getPriorityLabel(priority: string): string {
    const labels: { [key: string]: string } = {
      'high': 'Alta',
      'medium': 'Média',
      'low': 'Baixa'
    };
    return labels[priority] || priority;
  }

  getTimeRemaining(goal: Goal): string {
    const now = new Date();
    const deadline = new Date(goal.deadline);
    const diffTime = deadline.getTime() - now.getTime();
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));

    if (diffMonths <= 0) return 'Vencida';
    if (diffMonths === 1) return '1 mês restante';
    if (diffMonths < 12) return `${diffMonths} meses restantes`;

    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;
    if (years === 1 && months === 0) return '1 ano restante';
    if (months === 0) return `${years} anos restantes`;
    return `${years}a ${months}m restantes`;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  }

  formatNumber(amount: number): string {
    return new Intl.NumberFormat('pt-BR').format(amount);
  }

  // Mock functions for UI interactions
  addNewGoal(): void {
    console.log('Add new goal clicked');
  }

  importGoals(): void {
    console.log('Import goals clicked');
  }

  viewReports(): void {
    console.log('View reports clicked');
  }

  addContribution(goal: Goal): void {
    console.log('Add contribution clicked for goal:', goal.name);
  }

  viewDetails(goal: Goal): void {
    console.log('View details clicked for goal:', goal.name);
    this.showAdvancedModal = true;
  }

  // Advanced example methods
  viewAnalytics(): void {
    console.log('View analytics clicked - would show detailed charts and insights');
  }

  configureWhatsApp(): void {
    console.log('Configure WhatsApp clicked - would open WhatsApp integration modal');
  }

  addContributionAdvanced(): void {
    console.log('Advanced contribution clicked - would open smart contribution modal with AI suggestions');
  }

  // Modal control methods
  openAdvancedModal(): void {
    this.showAdvancedModal = true;
  }

  closeAdvancedModal(): void {
    this.showAdvancedModal = false;
  }

  exportGoalData(): void {
    console.log('Export goal data clicked - would generate CSV/PDF report');
  }

  shareGoal(): void {
    console.log('Share goal clicked - would open share modal with social media options');
  }

  // New functionality methods
  getCircleOffset(percentage: number): number {
    const circumference = 2 * Math.PI * 35; // radius = 35
    return circumference - (percentage / 100) * circumference;
  }

  // Modal Control Methods
  openNewGoalModal(): void {
    this.showNewGoalModal = true;
  }

  closeNewGoalModal(): void {
    this.showNewGoalModal = false;
  }

  openSimulatorModal(): void {
    this.showSimulatorModal = true;
  }

  closeSimulatorModal(): void {
    this.showSimulatorModal = false;
  }

  openAIChatModal(): void {
    this.showAIChatModal = true;
  }

  closeAIChatModal(): void {
    this.showAIChatModal = false;
  }

  openOptimizerModal(): void {
    this.showOptimizerModal = true;
  }

  closeOptimizerModal(): void {
    this.showOptimizerModal = false;
  }

  openReportsModal(): void {
    this.showReportsModal = true;
  }

  closeReportsModal(): void {
    this.showReportsModal = false;
  }

  // New Goal Wizard Methods
  currentWizardStep = 1;
  maxWizardSteps = 4;

  nextWizardStep(): void {
    if (this.currentWizardStep < this.maxWizardSteps) {
      this.currentWizardStep++;
    }
  }

  prevWizardStep(): void {
    if (this.currentWizardStep > 1) {
      this.currentWizardStep--;
    }
  }

  // Aliases for template compatibility
  nextStep(): void {
    this.nextWizardStep();
  }

  previousStep(): void {
    this.prevWizardStep();
  }

  createGoal(): void {
    console.log('Creating new goal with wizard data');
    this.closeNewGoalModal();
    this.currentWizardStep = 1;
  }

  selectSuggestion(suggestion: string): void {
    console.log('AI suggestion selected:', suggestion);
  }

  // Simulator Methods
  currentScenario = 'conservative';
  monthlyAmount = 500;
  interestRate = 12;
  timeHorizon = 24;

  changeScenario(scenario: string): void {
    this.currentScenario = scenario;
    switch (scenario) {
      case 'conservative':
        this.interestRate = 8;
        break;
      case 'moderate':
        this.interestRate = 12;
        break;
      case 'aggressive':
        this.interestRate = 18;
        break;
    }
  }

  updateSimulation(event?: any): void {
    if (event) {
      // Update the appropriate parameter based on the event target
      console.log('Updating simulation with new value:', event.target.value);
    }
    console.log('Updating simulation with current parameters');
  }

  applySimulation(): void {
    console.log('Applying simulation results to goals');
    this.closeSimulatorModal();
  }

  exportSimulation(): void {
    console.log('Exporting simulation data');
  }

  applyScenario(): void {
    console.log('Applying current scenario to all goals');
    this.closeSimulatorModal();
  }

  // AI Chat Methods
  chatMessages = [
    {
      type: 'ai',
      text: 'Olá! Sou seu assistente financeiro inteligente. Como posso ajudá-lo com suas metas hoje?',
      timestamp: new Date()
    }
  ];

  chatInput = '';
  isTyping = false;

  sendMessage(): void {
    if (this.chatInput.trim()) {
      this.chatMessages.push({
        type: 'user',
        text: this.chatInput,
        timestamp: new Date()
      });

      const userMessage = this.chatInput;
      this.chatInput = '';
      this.isTyping = true;

      setTimeout(() => {
        this.isTyping = false;
        this.chatMessages.push({
          type: 'ai',
          text: this.generateAIResponse(userMessage),
          timestamp: new Date()
        });
      }, 2000);
    }
  }

  askQuickQuestion(question: string): void {
    this.chatInput = question;
    this.sendMessage();
  }

  generateAIResponse(userMessage: string): string {
    const responses = [
      'Com base no seu perfil, recomendo ajustar seus aportes mensais para otimizar o cronograma.',
      'Analisando suas metas, identifiquei uma oportunidade de economia de R$ 2.500 nos próximos 6 meses.',
      'Sugiro priorizar sua meta de "Casa Própria" pois está com melhor potencial de retorno no cenário atual.',
      'Baseado no seu histórico, você pode acelerar esta meta em 3 meses com pequenos ajustes.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Optimizer Methods
  optimizations = [
    { text: 'Realocar R$ 200 da meta "Viagem" para "Casa Própria"', impact: 'high', checked: false },
    { text: 'Aumentar aporte mensal em 15% baseado na renda atual', impact: 'medium', checked: false },
    { text: 'Alterar cronograma de "Carro" para 18 meses', impact: 'medium', checked: false },
    { text: 'Aplicar bônus anual diretamente nas metas prioritárias', impact: 'high', checked: false },
    { text: 'Reduzir taxa de administração mudando investimento', impact: 'low', checked: false }
  ];

  currentTimeToGoal = 24;
  optimizedTimeToGoal = 18;
  currentMonthlyAmount = 1200;
  optimizedMonthlyAmount = 1350;

  toggleOptimization(index: number): void {
    this.optimizations[index].checked = !this.optimizations[index].checked;
    this.recalculateOptimizations();
  }

  recalculateOptimizations(): void {
    const selectedCount = this.optimizations.filter(opt => opt.checked).length;
    this.optimizedTimeToGoal = Math.max(12, this.currentTimeToGoal - (selectedCount * 2));
    this.optimizedMonthlyAmount = this.currentMonthlyAmount + (selectedCount * 50);
  }

  applyOptimizations(): void {
    console.log('Applying selected optimizations to goals');
    this.closeOptimizerModal();
  }

  previewOptimization(): void {
    console.log('Previewing optimization effects');
  }

  applyOptimization(): void {
    console.log('Applying optimization to goals');
    this.closeOptimizerModal();
  }

  // Reports Methods
  reportPeriod = 'last3months';
  reportType = 'summary';

  generateReport(): void {
    console.log('Generating report for period:', this.reportPeriod, 'type:', this.reportType);
  }

  exportReport(): void {
    console.log('Exporting report as PDF');
  }

  scheduleReport(): void {
    console.log('Scheduling automatic report generation');
  }

  createCustomReport(): void {
    console.log('Opening custom report builder');
  }

  // Legacy methods for backward compatibility
  openAIChat(): void {
    this.openAIChatModal();
  }

  openSimulator(): void {
    this.openSimulatorModal();
  }

  optimizeMetas(): void {
    this.openOptimizerModal();
  }
}
