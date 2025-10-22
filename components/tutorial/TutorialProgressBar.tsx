/**
 * ====================================
 * TUTORIAL PROGRESS BAR
 * Barra de progresso animada do tutorial
 * ====================================
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTutorial } from '@/contexts/TutorialContext';
import { useTheme } from '@/contexts/ThemeContext';

const LEVEL_EMOJIS = {
  1: '🥉',
  2: '🥈',
  3: '🥇',
  4: '💎'
};

const LEVEL_NAMES = {
  1: 'Verificador Iniciante',
  2: 'Explorador',
  3: 'Estudante Digital',
  4: 'Mestre CheckNow'
};

const LEVEL_COLORS = {
  1: '#CD7F32', // Bronze
  2: '#C0C0C0', // Prata
  3: '#FFD700', // Ouro
  4: '#B9F2FF'  // Diamante
};

export function TutorialProgressBar() {
  const { state, progressPercentage, currentLevelReward } = useTutorial();
  const { colors } = useTheme();
  
  // Animações
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);
  
  useEffect(() => {
    // Anima o progresso
    progress.value = withSpring(progressPercentage / 100, {
      damping: 15,
      stiffness: 100
    });
    
    // Pequeno bounce quando muda de passo
    scale.value = withTiming(1.05, { duration: 150 }, () => {
      scale.value = withSpring(1);
    });
  }, [progressPercentage]);
  
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
    backgroundColor: LEVEL_COLORS[state.currentLevel as keyof typeof LEVEL_COLORS]
  }));
  
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));
  
  const levelEmoji = LEVEL_EMOJIS[state.currentLevel as keyof typeof LEVEL_EMOJIS];
  const levelName = LEVEL_NAMES[state.currentLevel as keyof typeof LEVEL_NAMES];
  
  return (
    <Animated.View 
      style={[
        styles.container, 
        { backgroundColor: colors.background },
        containerStyle
      ]}
    >
      {/* Header com nível atual */}
      <View style={styles.header}>
        <Text style={[styles.levelText, { color: colors.text }]}>
          Nível {state.currentLevel}: {levelName} {levelEmoji}
        </Text>
        
        <Text style={[styles.stepsText, { color: colors.textSecondary }]}>
          {state.currentStepIndex + 1}/{state.totalSteps}
        </Text>
      </View>
      
      {/* Barra de progresso */}
      <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
        <Animated.View style={[styles.progressBarFill, progressStyle]} />
      </View>
      
      {/* Percentual */}
      <Text style={[styles.percentageText, { color: colors.textSecondary }]}>
        {Math.round(progressPercentage)}% completo
      </Text>
      
      {/* Recompensa do nível */}
      {currentLevelReward && (
        <View style={styles.rewardContainer}>
          <Text style={[styles.rewardText, { color: colors.textSecondary }]}>
            🎁 Recompensa: +{currentLevelReward.verificationCredits} verificações
            {currentLevelReward.premiumDays && ` | ${currentLevelReward.premiumDays} dias Premium`}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  stepsText: {
    fontSize: 13,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 11,
    textAlign: 'right',
  },
  rewardContainer: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  rewardText: {
    fontSize: 11,
    textAlign: 'center',
  },
});
