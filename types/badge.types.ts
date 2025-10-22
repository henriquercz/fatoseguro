/**
 * ====================================
 * TIPOS DO SISTEMA DE BADGES
 * Sistema de conquistas e gamificação
 * ====================================
 */

/**
 * Raridade do badge
 */
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

/**
 * Categoria do badge
 */
export type BadgeCategory = 'tutorial' | 'verification' | 'education' | 'community' | 'premium' | 'special';

/**
 * Badge/Conquista do usuário
 */
export interface Badge {
  /** ID único do badge */
  id: string;
  
  /** Nome do badge */
  name: string;
  
  /** Descrição do badge */
  description: string;
  
  /** Ícone (emoji ou caminho da imagem) */
  icon: string;
  
  /** Raridade do badge */
  rarity: BadgeRarity;
  
  /** Categoria do badge */
  category: BadgeCategory;
  
  /** Timestamp quando foi conquistado (opcional) */
  earnedAt?: number;
  
  /** Progresso para desbloquear (0-100) */
  progress?: number;
  
  /** Requisito para desbloquear */
  requirement?: string;
  
  /** Badge está desbloqueado */
  unlocked: boolean;
  
  /** Cor primária do badge */
  color?: string;
}

/**
 * Coleção de badges do usuário
 */
export interface BadgeCollection {
  /** ID do usuário */
  userId: string;
  
  /** Lista de badges */
  badges: Badge[];
  
  /** Total de badges conquistados */
  totalEarned: number;
  
  /** Total de badges disponíveis */
  totalAvailable: number;
  
  /** Próximo badge a desbloquear */
  nextToUnlock?: Badge;
  
  /** Percentual de conclusão (0-100) */
  completionPercentage: number;
}

/**
 * Cores por raridade
 */
export const BADGE_RARITY_COLORS: Record<BadgeRarity, string> = {
  common: '#94A3B8',    // Cinza
  rare: '#3B82F6',      // Azul
  epic: '#A855F7',      // Roxo
  legendary: '#F59E0B'  // Dourado
};

/**
 * Emojis por raridade
 */
export const BADGE_RARITY_EMOJIS: Record<BadgeRarity, string> = {
  common: '🥉',
  rare: '🥈',
  epic: '🥇',
  legendary: '💎'
};

/**
 * Notificação de badge desbloqueado
 */
export interface BadgeUnlockedNotification {
  /** Badge desbloqueado */
  badge: Badge;
  
  /** Mensagem de celebração */
  message: string;
  
  /** Mostrar confetti */
  showConfetti: boolean;
  
  /** Som de celebração */
  soundEffect?: string;
}
