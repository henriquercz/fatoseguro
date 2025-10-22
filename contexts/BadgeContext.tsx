/**
 * ====================================
 * BADGE CONTEXT
 * Gerencia sistema de badges e conquistas
 * ====================================
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Badge, BadgeCollection, BadgeUnlockedNotification } from '@/types/badge.types';

/**
 * Definição dos badges disponíveis
 */
export const AVAILABLE_BADGES: Badge[] = [
  // Tutorial Badges
  {
    id: 'verificador_iniciante',
    name: 'Verificador Iniciante',
    description: 'Completou o Nível 1 do tutorial',
    icon: '🥉',
    rarity: 'common',
    category: 'tutorial',
    requirement: 'Complete o Nível 1 do tutorial',
    unlocked: false,
    color: '#CD7F32'
  },
  {
    id: 'explorador',
    name: 'Explorador',
    description: 'Completou o Nível 2 do tutorial',
    icon: '🥈',
    rarity: 'rare',
    category: 'tutorial',
    requirement: 'Complete o Nível 2 do tutorial',
    unlocked: false,
    color: '#C0C0C0'
  },
  {
    id: 'estudante_digital',
    name: 'Estudante Digital',
    description: 'Completou o Nível 3 do tutorial',
    icon: '🥇',
    rarity: 'epic',
    category: 'tutorial',
    requirement: 'Complete o Nível 3 do tutorial',
    unlocked: false,
    color: '#FFD700'
  },
  {
    id: 'mestre_checknow',
    name: 'Mestre CheckNow',
    description: 'Dominou todas as funcionalidades do app!',
    icon: '💎',
    rarity: 'legendary',
    category: 'tutorial',
    requirement: 'Complete todo o tutorial',
    unlocked: false,
    color: '#B9F2FF'
  },
  
  // Verification Badges
  {
    id: 'primeira_verificacao',
    name: 'Primeira Verificação',
    description: 'Verificou sua primeira notícia',
    icon: '✅',
    rarity: 'common',
    category: 'verification',
    requirement: 'Verifique 1 notícia',
    unlocked: false,
    color: '#10B981'
  },
  {
    id: 'verificador_ativo',
    name: 'Verificador Ativo',
    description: 'Verificou 10 notícias',
    icon: '🔍',
    rarity: 'rare',
    category: 'verification',
    requirement: 'Verifique 10 notícias',
    unlocked: false,
    color: '#3B82F6'
  },
  {
    id: 'caçador_fake_news',
    name: 'Caçador de Fake News',
    description: 'Identificou 5 notícias falsas',
    icon: '🎯',
    rarity: 'epic',
    category: 'verification',
    requirement: 'Identifique 5 fake news',
    unlocked: false,
    color: '#EF4444'
  },
  
  // Education Badges
  {
    id: 'estudante',
    name: 'Estudante',
    description: 'Leu 1 guia educacional',
    icon: '📚',
    rarity: 'common',
    category: 'education',
    requirement: 'Leia 1 guia',
    unlocked: false,
    color: '#8B5CF6'
  },
  {
    id: 'aprovado_quiz',
    name: 'Aprovado no Quiz',
    description: 'Passou no quiz com 70%+',
    icon: '🎓',
    rarity: 'rare',
    category: 'education',
    requirement: 'Passe no quiz',
    unlocked: false,
    color: '#F59E0B'
  },
];

interface BadgeContextType {
  /** Coleção de badges do usuário */
  collection: BadgeCollection;
  
  /** Desbloquear um badge */
  unlockBadge: (badgeId: string) => Promise<void>;
  
  /** Verificar se badge está desbloqueado */
  isBadgeUnlocked: (badgeId: string) => boolean;
  
  /** Atualizar progresso de um badge */
  updateBadgeProgress: (badgeId: string, progress: number) => Promise<void>;
  
  /** Obter badge por ID */
  getBadgeById: (badgeId: string) => Badge | undefined;
  
  /** Notificação de badge desbloqueado */
  notification: BadgeUnlockedNotification | null;
  
  /** Limpar notificação */
  clearNotification: () => void;
  
  /** Recarregar badges do storage */
  reloadBadges: () => Promise<void>;
}

const BadgeContext = createContext<BadgeContextType | undefined>(undefined);

const STORAGE_KEY = '@checknow:badges';

export function BadgeProvider({ children }: { children: ReactNode }) {
  const [collection, setCollection] = useState<BadgeCollection>({
    userId: '',
    badges: AVAILABLE_BADGES,
    totalEarned: 0,
    totalAvailable: AVAILABLE_BADGES.length,
    completionPercentage: 0
  });
  
  const [notification, setNotification] = useState<BadgeUnlockedNotification | null>(null);

  // Carrega badges do AsyncStorage ao iniciar
  useEffect(() => {
    loadBadges();
  }, []);

  /**
   * Carrega badges salvos do AsyncStorage
   */
  const loadBadges = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (saved) {
        const savedBadges: Badge[] = JSON.parse(saved);
        
        // Merge com badges disponíveis (caso tenha novos badges)
        const mergedBadges = AVAILABLE_BADGES.map(available => {
          const saved = savedBadges.find(b => b.id === available.id);
          return saved || available;
        });
        
        const totalEarned = mergedBadges.filter(b => b.unlocked).length;
        const completionPercentage = (totalEarned / AVAILABLE_BADGES.length) * 100;
        
        setCollection({
          userId: '',
          badges: mergedBadges,
          totalEarned,
          totalAvailable: AVAILABLE_BADGES.length,
          completionPercentage,
          nextToUnlock: mergedBadges.find(b => !b.unlocked)
        });
      }
    } catch (error) {
      console.error('Erro ao carregar badges:', error);
    }
  };

  /**
   * Salva badges no AsyncStorage
   */
  const saveBadges = async (badges: Badge[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(badges));
    } catch (error) {
      console.error('Erro ao salvar badges:', error);
    }
  };

  /**
   * Desbloqueia um badge
   */
  const unlockBadge = async (badgeId: string) => {
    const badge = collection.badges.find(b => b.id === badgeId);
    
    if (!badge) {
      console.warn(`Badge ${badgeId} não encontrado`);
      return;
    }
    
    if (badge.unlocked) {
      console.log(`Badge ${badgeId} já está desbloqueado`);
      return;
    }
    
    // Atualiza o badge
    const updatedBadges = collection.badges.map(b => 
      b.id === badgeId 
        ? { ...b, unlocked: true, earnedAt: Date.now(), progress: 100 }
        : b
    );
    
    const totalEarned = updatedBadges.filter(b => b.unlocked).length;
    const completionPercentage = (totalEarned / AVAILABLE_BADGES.length) * 100;
    
    setCollection({
      ...collection,
      badges: updatedBadges,
      totalEarned,
      completionPercentage,
      nextToUnlock: updatedBadges.find(b => !b.unlocked)
    });
    
    await saveBadges(updatedBadges);
    
    // Mostra notificação
    setNotification({
      badge: { ...badge, unlocked: true, earnedAt: Date.now() },
      message: `Você desbloqueou: ${badge.name}!`,
      showConfetti: badge.rarity === 'epic' || badge.rarity === 'legendary'
    });
    
    console.log(`✅ Badge desbloqueado: ${badge.name}`);
  };

  /**
   * Verifica se badge está desbloqueado
   */
  const isBadgeUnlocked = (badgeId: string): boolean => {
    return collection.badges.find(b => b.id === badgeId)?.unlocked || false;
  };

  /**
   * Atualiza progresso de um badge
   */
  const updateBadgeProgress = async (badgeId: string, progress: number) => {
    const updatedBadges = collection.badges.map(b =>
      b.id === badgeId ? { ...b, progress: Math.min(100, Math.max(0, progress)) } : b
    );
    
    setCollection({
      ...collection,
      badges: updatedBadges
    });
    
    await saveBadges(updatedBadges);
    
    // Auto-desbloqueia se chegou em 100%
    if (progress >= 100) {
      await unlockBadge(badgeId);
    }
  };

  /**
   * Obtém badge por ID
   */
  const getBadgeById = (badgeId: string): Badge | undefined => {
    return collection.badges.find(b => b.id === badgeId);
  };

  /**
   * Limpa notificação
   */
  const clearNotification = () => {
    setNotification(null);
  };

  /**
   * Recarrega badges
   */
  const reloadBadges = async () => {
    await loadBadges();
  };

  return (
    <BadgeContext.Provider
      value={{
        collection,
        unlockBadge,
        isBadgeUnlocked,
        updateBadgeProgress,
        getBadgeById,
        notification,
        clearNotification,
        reloadBadges
      }}
    >
      {children}
    </BadgeContext.Provider>
  );
}

/**
 * Hook para usar o BadgeContext
 */
export function useBadges() {
  const context = useContext(BadgeContext);
  
  if (!context) {
    throw new Error('useBadges deve ser usado dentro de BadgeProvider');
  }
  
  return context;
}
