/**
 * ====================================
 * TUTORIAL CONTEXT
 * Gerencia estado e lógica do tutorial completo
 * ====================================
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  TutorialState, 
  TutorialStepConfig, 
  TutorialLevelReward,
  TutorialLevel,
  TutorialStepId 
} from '@/types/tutorial.types';
import { useBadges } from './BadgeContext';

/**
 * Configuração completa dos 15 passos do tutorial
 */
const TUTORIAL_STEPS: TutorialStepConfig[] = [
  // ========== NÍVEL 1: VERIFICADOR INICIANTE ==========
  {
    id: 'welcome',
    level: 1,
    stepInLevel: 1,
    title: 'Tutorial Completo CheckNow',
    description: 'Você está prestes a se tornar um MESTRE em verificação de notícias!\n\n📊 15 passos para dominar\n🏆 4 badges para desbloquear\n🎁 Recompensas em cada nível',
    position: 'center',
    skipable: true,
    emoji: '🎓'
  },
  {
    id: 'verify_text',
    level: 1,
    stepInLevel: 2,
    title: 'Sua Primeira Verificação',
    description: 'Cole ou digite uma notícia aqui para verificar sua veracidade.',
    targetComponent: 'verifyInput',
    targetScreen: 'home',
    position: 'top',
    spotlightRadius: 100,
    requiresAction: false,
    actionType: 'input',
    skipable: false,
    tips: ['Experimente com: "Governo anuncia vacina contra câncer"'],
    emoji: '📝'
  },
  {
    id: 'verify_url',
    level: 1,
    stepInLevel: 3,
    title: 'Verificação de Links',
    description: 'Você também pode verificar links de notícias! Toque no botão URL.',
    targetComponent: 'urlButton',
    targetScreen: 'home',
    position: 'top',
    spotlightRadius: 60,
    skipable: false,
    tips: ['Cole qualquer link de notícia e veja a mágica!'],
    emoji: '🔗'
  },
  {
    id: 'results',
    level: 1,
    stepInLevel: 4,
    title: 'Entendendo Resultados',
    description: '✅ VERDADEIRO: Notícia confirmada\n❌ FALSO: Fake news detectada\n⚠️ INDETERMINADO: Precisa de mais contexto\n\nRole para baixo e veja as FONTES e ANÁLISE completa!',
    position: 'center',
    skipable: false,
    emoji: '🎯'
  },
  
  // ========== NÍVEL 2: EXPLORADOR ==========
  {
    id: 'history_personal',
    level: 2,
    stepInLevel: 1,
    title: 'Seu Histórico',
    description: 'Todas suas verificações ficam salvas aqui! Toque na aba HISTÓRICO.',
    targetComponent: 'historyTab',
    targetScreen: 'history',
    position: 'top',
    spotlightRadius: 70,
    skipable: false,
    tips: ['Veja suas verificações passadas, datas e status'],
    emoji: '📚'
  },
  {
    id: 'history_community',
    level: 2,
    stepInLevel: 2,
    title: 'Histórico Comunitário',
    description: 'Veja o que OUTROS usuários estão verificando! Troque para "Comunidade".',
    targetComponent: 'communityToggle',
    targetScreen: 'history',
    position: 'top',
    spotlightRadius: 80,
    skipable: false,
    tips: ['Descubra trending fakes e notícias virais'],
    emoji: '🌍'
  },
  {
    id: 'feed',
    level: 2,
    stepInLevel: 3,
    title: 'Central de Notícias',
    description: 'Notícias verificadas do Brasil! Toque na aba NOTÍCIAS.',
    targetComponent: 'feedTab',
    targetScreen: 'feed',
    position: 'top',
    spotlightRadius: 70,
    skipable: false,
    tips: [
      'Leia notícias confiáveis',
      'Puxe para atualizar',
      'Toque para ler completa'
    ],
    emoji: '📰'
  },
  {
    id: 'news_detail',
    level: 2,
    stepInLevel: 4,
    title: 'Detalhes da Notícia',
    description: 'Toque em qualquer notícia para ler o conteúdo completo, ver a fonte e a data de publicação.',
    position: 'center',
    skipable: false,
    tips: ['Você pode verificar qualquer notícia do feed!'],
    emoji: '📖'
  },
  
  // ========== NÍVEL 3: ESTUDANTE DIGITAL ==========
  {
    id: 'education',
    level: 3,
    stepInLevel: 1,
    title: 'Educação Digital',
    description: 'Aprenda a identificar fake news como um PRO! Toque no ícone Educação.',
    targetComponent: 'educationButton',
    position: 'top',
    spotlightRadius: 60,
    skipable: false,
    tips: [
      'Guias de fact-checking',
      'Técnicas de verificação',
      'Quiz interativo'
    ],
    emoji: '📚'
  },
  {
    id: 'education_sections',
    level: 3,
    stepInLevel: 2,
    title: 'Guias Disponíveis',
    description: 'Navegue pelas seções educacionais:\n\n1️⃣ O que é Fake News\n2️⃣ Como Identificar\n3️⃣ Técnicas de Manipulação\n4️⃣ Checklist de Verificação\n5️⃣ Deepfakes e IA',
    position: 'center',
    skipable: false,
    tips: ['Leia pelo menos uma seção!'],
    emoji: '📖'
  },
  {
    id: 'quiz',
    level: 3,
    stepInLevel: 3,
    title: 'Teste Seus Conhecimentos',
    description: 'Hora de mostrar o que aprendeu!\n\n📊 10 perguntas\n✅ Múltipla escolha\n💡 Feedback imediato\n🏆 Mínimo 70% para passar',
    targetComponent: 'quizButton',
    position: 'center',
    spotlightRadius: 80,
    skipable: false,
    emoji: '🎯'
  },
  {
    id: 'quiz_complete',
    level: 3,
    stepInLevel: 4,
    title: 'Aprovado no Quiz!',
    description: '🎉 Parabéns! Você passou no quiz!\n\nVocê pode refazer quantas vezes quiser para melhorar sua nota.',
    position: 'center',
    skipable: false,
    emoji: '📊'
  },
  
  // ========== NÍVEL 4: MESTRE CHECKNOW ==========
  {
    id: 'account',
    level: 4,
    stepInLevel: 1,
    title: 'Personalize Sua Experiência',
    description: 'Gerencie sua conta, veja estatísticas e ajuste preferências. Toque na aba CONTA.',
    targetComponent: 'accountTab',
    targetScreen: 'account',
    position: 'top',
    spotlightRadius: 70,
    skipable: false,
    tips: [
      'Ver perfil',
      'Alterar tema',
      'Gerenciar Premium',
      'Ver badges conquistados'
    ],
    emoji: '⚙️'
  },
  {
    id: 'theme',
    level: 4,
    stepInLevel: 2,
    title: 'Modo Escuro',
    description: 'Proteja seus olhos! Experimente trocar entre:\n\n☀️ Modo Claro (dia)\n🌙 Modo Escuro (noite)\n\nSua preferência é salva automaticamente.',
    targetComponent: 'themeToggle',
    targetScreen: 'account',
    position: 'center',
    spotlightRadius: 70,
    skipable: false,
    emoji: '🌓'
  },
  {
    id: 'premium',
    level: 4,
    stepInLevel: 3,
    title: 'CheckNow Premium',
    description: '🎁 Seu presente especial:\n3 DIAS DE PREMIUM GRÁTIS!\n\n✅ Verificações ilimitadas\n✅ Sem anúncios\n✅ Suporte prioritário\n✅ Acesso antecipado',
    position: 'center',
    skipable: false,
    emoji: '⭐'
  }
];

/**
 * Recompensas por nível
 */
const LEVEL_REWARDS: TutorialLevelReward[] = [
  {
    level: 1,
    badgeId: 'verificador_iniciante',
    verificationCredits: 1,
    celebrationMessage: '🥉 Nível 1 Completo!\nVocê é um Verificador Iniciante!'
  },
  {
    level: 2,
    badgeId: 'explorador',
    verificationCredits: 2,
    celebrationMessage: '🥈 Nível 2 Completo!\nVocê é um Explorador!'
  },
  {
    level: 3,
    badgeId: 'estudante_digital',
    verificationCredits: 3,
    celebrationMessage: '🥇 Nível 3 Completo!\nVocê é um Estudante Digital!'
  },
  {
    level: 4,
    badgeId: 'mestre_checknow',
    verificationCredits: 0,
    premiumDays: 3,
    unlocks: ['certificate'],
    celebrationMessage: '💎 Parabéns!\nVocê é um Mestre CheckNow!'
  }
];

interface TutorialContextType {
  state: TutorialState;
  startTutorial: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTutorial: () => void;
  skipStep: () => void;
  completeTutorial: () => void;
  completeStep: (stepId: TutorialStepId) => void;
  resetTutorial: () => void;
  currentStepConfig: TutorialStepConfig | null;
  progressPercentage: number;
  currentLevelReward: TutorialLevelReward | null;
  allSteps: TutorialStepConfig[];
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

const STORAGE_KEY = '@checknow:tutorial_state';
const CREDITS_KEY = '@checknow:verification_credits_bonus';

export function TutorialProvider({ children }: { children: ReactNode }) {
  // Uso seguro do BadgeContext (pode não estar disponível imediatamente)
  let badgeContext: ReturnType<typeof useBadges> | undefined;
  try {
    badgeContext = useBadges();
  } catch (error) {
    console.warn('BadgeContext não disponível ainda');
    badgeContext = undefined;
  }
  
  const [state, setState] = useState<TutorialState>({
    isActive: false,
    currentStep: 'welcome',
    currentStepIndex: 0,
    totalSteps: TUTORIAL_STEPS.length,
    currentLevel: 1,
    completed: false,
    skipped: false,
    levelsCompleted: [],
    stepsCompleted: []
  });

  // Carrega estado salvo
  useEffect(() => {
    loadTutorialState();
  }, []);

  /**
   * Carrega estado do AsyncStorage
   */
  const loadTutorialState = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erro ao carregar tutorial:', error);
    }
  };

  /**
   * Salva estado no AsyncStorage
   */
  const saveTutorialState = async (newState: TutorialState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error('Erro ao salvar tutorial:', error);
    }
  };

  /**
   * Inicia o tutorial
   */
  const startTutorial = () => {
    const newState: TutorialState = {
      ...state,
      isActive: true,
      startedAt: Date.now(),
      currentStepIndex: 0,
      currentStep: TUTORIAL_STEPS[0].id,
      currentLevel: 1
    };
    
    setState(newState);
    saveTutorialState(newState);
    
    console.log('🎓 Tutorial iniciado!');
  };

  /**
   * Próximo passo
   */
  const nextStep = () => {
    const nextIndex = state.currentStepIndex + 1;
    
    // Completa passo atual
    const currentStep = TUTORIAL_STEPS[state.currentStepIndex];
    completeStep(currentStep.id);
    
    // Verifica se terminou
    if (nextIndex >= TUTORIAL_STEPS.length) {
      completeTutorial();
      return;
    }
    
    const nextStepConfig = TUTORIAL_STEPS[nextIndex];
    const newState: TutorialState = {
      ...state,
      currentStepIndex: nextIndex,
      currentStep: nextStepConfig.id,
      currentLevel: nextStepConfig.level
    };
    
    setState(newState);
    saveTutorialState(newState);
    
    // Verifica completude de nível
    checkLevelCompletion(nextStepConfig.level);
  };

  /**
   * Passo anterior
   */
  const previousStep = () => {
    if (state.currentStepIndex === 0) return;
    
    const prevIndex = state.currentStepIndex - 1;
    const prevStepConfig = TUTORIAL_STEPS[prevIndex];
    
    const newState: TutorialState = {
      ...state,
      currentStepIndex: prevIndex,
      currentStep: prevStepConfig.id,
      currentLevel: prevStepConfig.level
    };
    
    setState(newState);
    saveTutorialState(newState);
  };

  /**
   * Pular tutorial completo
   */
  const skipTutorial = async () => {
    const newState: TutorialState = {
      ...state,
      isActive: false,
      skipped: true
    };
    
    setState(newState);
    await saveTutorialState(newState);
    
    console.log('⏭️ Tutorial pulado');
  };

  /**
   * Pular passo atual
   */
  const skipStep = () => {
    nextStep();
  };

  /**
   * Completa um passo específico
   */
  const completeStep = (stepId: TutorialStepId) => {
    if (state.stepsCompleted.includes(stepId)) return;
    
    const newState: TutorialState = {
      ...state,
      stepsCompleted: [...state.stepsCompleted, stepId]
    };
    
    setState(newState);
    saveTutorialState(newState);
  };

  /**
   * Verifica se nível foi completado
   */
  const checkLevelCompletion = async (level: TutorialLevel) => {
    // Já completou esse nível?
    if (state.levelsCompleted.includes(level)) return;
    
    // Pega todos os passos do nível
    const levelSteps = TUTORIAL_STEPS.filter(s => s.level === level);
    
    // Verifica se todos foram completados
    const allCompleted = levelSteps.every(step => 
      state.stepsCompleted.includes(step.id) || 
      TUTORIAL_STEPS.findIndex(s => s.id === step.id) < state.currentStepIndex
    );
    
    if (allCompleted) {
      await completeLevel(level);
    }
  };

  /**
   * Completa um nível
   */
  const completeLevel = async (level: TutorialLevel) => {
    console.log(`🎉 Nível ${level} completado!`);
    
    const reward = LEVEL_REWARDS.find(r => r.level === level);
    
    if (reward) {
      // Desbloqueia badge (se BadgeContext disponível)
      if (badgeContext?.unlockBadge) {
        try {
          await badgeContext.unlockBadge(reward.badgeId);
        } catch (error) {
          console.error('Erro ao desbloquear badge:', error);
        }
      }
      
      // Adiciona créditos de verificação
      if (reward.verificationCredits > 0) {
        await addVerificationCredits(reward.verificationCredits);
      }
      
      // Ativa premium trial
      if (reward.premiumDays) {
        await activatePremiumTrial(reward.premiumDays);
      }
    }
    
    const newState: TutorialState = {
      ...state,
      levelsCompleted: [...state.levelsCompleted, level]
    };
    
    setState(newState);
    await saveTutorialState(newState);
  };

  /**
   * Completa tutorial
   */
  const completeTutorial = async () => {
    console.log('🎊 Tutorial completado!');
    
    const newState: TutorialState = {
      ...state,
      isActive: false,
      completed: true,
      completedAt: Date.now()
    };
    
    setState(newState);
    await saveTutorialState(newState);
    
    // Gera certificado (implementar depois)
    // await generateCertificate();
  };

  /**
   * Reseta tutorial (apenas para debug)
   */
  const resetTutorial = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    await AsyncStorage.removeItem(CREDITS_KEY);
    
    setState({
      isActive: false,
      currentStep: 'welcome',
      currentStepIndex: 0,
      totalSteps: TUTORIAL_STEPS.length,
      currentLevel: 1,
      completed: false,
      skipped: false,
      levelsCompleted: [],
      stepsCompleted: []
    });
    
    console.log('🔄 Tutorial resetado');
  };

  /**
   * Adiciona créditos de verificação
   */
  const addVerificationCredits = async (credits: number) => {
    try {
      const current = await AsyncStorage.getItem(CREDITS_KEY);
      const currentCredits = current ? parseInt(current) : 0;
      const newCredits = currentCredits + credits;
      
      await AsyncStorage.setItem(CREDITS_KEY, newCredits.toString());
      
      console.log(`✨ +${credits} verificações extras!`);
    } catch (error) {
      console.error('Erro ao adicionar créditos:', error);
    }
  };

  /**
   * Ativa trial premium
   */
  const activatePremiumTrial = async (days: number) => {
    try {
      const expiresAt = Date.now() + (days * 24 * 60 * 60 * 1000);
      await AsyncStorage.setItem('@checknow:premium_trial_expires', expiresAt.toString());
      
      console.log(`⭐ ${days} dias de Premium ativados!`);
    } catch (error) {
      console.error('Erro ao ativar premium trial:', error);
    }
  };

  // Valores computados
  const currentStepConfig = TUTORIAL_STEPS[state.currentStepIndex] || null;
  const progressPercentage = (state.currentStepIndex / state.totalSteps) * 100;
  const currentLevelReward = LEVEL_REWARDS.find(r => r.level === state.currentLevel) || null;

  return (
    <TutorialContext.Provider
      value={{
        state,
        startTutorial,
        nextStep,
        previousStep,
        skipTutorial,
        skipStep,
        completeTutorial,
        completeStep,
        resetTutorial,
        currentStepConfig,
        progressPercentage,
        currentLevelReward,
        allSteps: TUTORIAL_STEPS
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

/**
 * Hook para usar o TutorialContext
 */
export function useTutorial() {
  const context = useContext(TutorialContext);
  
  if (!context) {
    throw new Error('useTutorial deve ser usado dentro de TutorialProvider');
  }
  
  return context;
}
