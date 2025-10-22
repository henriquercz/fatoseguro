/**
 * ====================================
 * TIPOS DO TUTORIAL INTERATIVO
 * Sistema completo de tutorial gamificado
 * ====================================
 */

/**
 * Níveis do tutorial (1-4)
 */
export type TutorialLevel = 1 | 2 | 3 | 4;

/**
 * IDs únicos de cada passo do tutorial
 */
export type TutorialStepId = 
  | 'welcome'
  | 'verify_text'
  | 'verify_url'
  | 'results'
  | 'history_personal'
  | 'history_community'
  | 'feed'
  | 'news_detail'
  | 'education'
  | 'education_sections'
  | 'quiz'
  | 'quiz_complete'
  | 'account'
  | 'theme'
  | 'premium';

/**
 * Telas do app onde o tutorial pode acontecer
 */
export type TutorialScreen = 'home' | 'history' | 'feed' | 'education' | 'account';

/**
 * Posições possíveis do card de instrução
 */
export type TutorialCardPosition = 'top' | 'center' | 'bottom';

/**
 * Tipos de ação que o usuário precisa realizar
 */
export type TutorialActionType = 'tap' | 'input' | 'navigation' | 'none';

/**
 * Estado completo do tutorial
 */
export interface TutorialState {
  /** Tutorial está ativo no momento */
  isActive: boolean;
  
  /** Passo atual sendo exibido */
  currentStep: TutorialStepId;
  
  /** Índice do passo atual (0-14) */
  currentStepIndex: number;
  
  /** Total de passos do tutorial */
  totalSteps: number;
  
  /** Nível atual (1-4) */
  currentLevel: TutorialLevel;
  
  /** Tutorial foi completado */
  completed: boolean;
  
  /** Tutorial foi pulado pelo usuário */
  skipped: boolean;
  
  /** Timestamp de quando começou (ms) */
  startedAt?: number;
  
  /** Timestamp de quando completou (ms) */
  completedAt?: number;
  
  /** Níveis que já foram completados */
  levelsCompleted: TutorialLevel[];
  
  /** Passos individuais completados */
  stepsCompleted: TutorialStepId[];
}

/**
 * Configuração de cada passo do tutorial
 */
export interface TutorialStepConfig {
  /** ID único do passo */
  id: TutorialStepId;
  
  /** Nível ao qual pertence (1-4) */
  level: TutorialLevel;
  
  /** Número do passo dentro do nível */
  stepInLevel: number;
  
  /** Título do passo */
  title: string;
  
  /** Descrição/instruções */
  description: string;
  
  /** ID do componente a destacar (opcional) */
  targetComponent?: string;
  
  /** Tela onde o passo acontece (opcional) */
  targetScreen?: TutorialScreen;
  
  /** Posição do card de instrução */
  position: TutorialCardPosition;
  
  /** Raio do spotlight em pixels (opcional) */
  spotlightRadius?: number;
  
  /** Usuário precisa realizar uma ação */
  requiresAction?: boolean;
  
  /** Tipo de ação requerida */
  actionType?: TutorialActionType;
  
  /** Passo pode ser pulado */
  skipable: boolean;
  
  /** Dicas extras (opcional) */
  tips?: string[];
  
  /** Emoji do passo (opcional) */
  emoji?: string;
}

/**
 * Recompensas por completar um nível
 */
export interface TutorialLevelReward {
  /** Nível que dá a recompensa */
  level: TutorialLevel;
  
  /** ID do badge desbloqueado */
  badgeId: string;
  
  /** Créditos de verificação ganhos */
  verificationCredits: number;
  
  /** Dias de premium ganhos (opcional) */
  premiumDays?: number;
  
  /** Features desbloqueadas (opcional) */
  unlocks?: string[];
  
  /** Mensagem de celebração */
  celebrationMessage: string;
}

/**
 * Progresso detalhado do tutorial
 */
export interface TutorialProgress {
  /** Passos completados */
  stepsCompleted: TutorialStepId[];
  
  /** Tempo total gasto (ms) */
  timeSpent: number;
  
  /** Ações completadas */
  actionsCompleted: string[];
  
  /** Percentual de conclusão (0-100) */
  completionPercentage: number;
}

/**
 * Estatísticas do tutorial
 */
export interface TutorialStats {
  /** Total de usuários que iniciaram */
  totalStarted: number;
  
  /** Total que completaram */
  totalCompleted: number;
  
  /** Total que pularam */
  totalSkipped: number;
  
  /** Taxa de conclusão (%) */
  completionRate: number;
  
  /** Tempo médio de conclusão (ms) */
  averageCompletionTime: number;
}

/**
 * Evento de analytics do tutorial
 */
export interface TutorialAnalyticsEvent {
  /** Tipo do evento */
  type: 'started' | 'step_viewed' | 'step_completed' | 'level_completed' | 'completed' | 'skipped';
  
  /** Passo relacionado (opcional) */
  stepId?: TutorialStepId;
  
  /** Nível relacionado (opcional) */
  level?: TutorialLevel;
  
  /** Timestamp do evento */
  timestamp: number;
  
  /** Dados extras (opcional) */
  metadata?: Record<string, any>;
}
