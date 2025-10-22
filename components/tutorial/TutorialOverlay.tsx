/**
 * ====================================
 * TUTORIAL OVERLAY
 * Componente principal que gerencia o overlay do tutorial
 * ====================================
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableWithoutFeedback } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTutorial } from '@/contexts/TutorialContext';
import { useTheme } from '@/contexts/ThemeContext';
import { TutorialProgressBar } from './TutorialProgressBar';
import { TutorialCard } from './TutorialCard';
import { TutorialSpotlight } from './TutorialSpotlight';
import { TutorialMascot } from './TutorialMascot';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TutorialOverlayProps {
  /** Posição do spotlight (opcional) */
  spotlightPosition?: { x: number; y: number; radius: number };
}

export function TutorialOverlay({ spotlightPosition }: TutorialOverlayProps) {
  // Uso seguro dos contexts
  let tutorialContext, themeContext;
  
  try {
    tutorialContext = useTutorial();
    themeContext = useTheme();
  } catch (error) {
    console.error('Erro ao carregar contexts do tutorial:', error);
    return null; // Não renderiza se houver erro
  }
  
  const { state, nextStep, previousStep, skipTutorial, currentStepConfig } = tutorialContext;
  const { colors, isDarkMode } = themeContext;
  
  const [visible, setVisible] = useState(false);
  
  // Animação do backdrop
  const backdropOpacity = useSharedValue(0);
  
  useEffect(() => {
    if (state.isActive) {
      setVisible(true);
      backdropOpacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.ease)
      });
    } else {
      backdropOpacity.value = withTiming(0, {
        duration: 300,
        easing: Easing.in(Easing.ease)
      }, () => {
        setVisible(false);
      });
    }
  }, [state.isActive]);
  
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));
  
  if (!visible || !currentStepConfig) {
    return null;
  }
  
  // Calcula posição do spotlight baseado no targetComponent
  const defaultSpotlight = {
    x: SCREEN_WIDTH / 2,
    y: SCREEN_HEIGHT / 2,
    radius: 0
  };
  
  const spotlight = spotlightPosition || (
    currentStepConfig.targetComponent ? {
      x: SCREEN_WIDTH / 2,
      y: currentStepConfig.position === 'top' ? 150 : SCREEN_HEIGHT / 2,
      radius: currentStepConfig.spotlightRadius || 80
    } : defaultSpotlight
  );
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={skipTutorial}
    >
      {/* Backdrop com gradiente */}
      <Animated.View style={[styles.container, backdropStyle]}>
        <LinearGradient
          colors={
            isDarkMode
              ? ['rgba(0, 0, 0, 0.7)', 'rgba(17, 24, 39, 0.8)']
              : ['rgba(0, 0, 0, 0.6)', 'rgba(37, 99, 235, 0.15)']
          }
          style={styles.gradient}
        >
          {/* Progress Bar no topo */}
          <View style={styles.progressBarContainer}>
            <TutorialProgressBar />
          </View>
          
          {/* Spotlight (se houver targetComponent) */}
          {currentStepConfig.targetComponent && spotlight.radius > 0 && (
            <TutorialSpotlight
              x={spotlight.x}
              y={spotlight.y}
              radius={spotlight.radius}
              borderColor={colors.primary}
              showPulse
            />
          )}
          
          {/* Mascote */}
          <View style={styles.mascotContainer}>
            <TutorialMascot
              emotion={
                state.levelsCompleted.includes(state.currentLevel)
                  ? 'happy'
                  : 'neutral'
              }
            />
          </View>
          
          {/* Card de instrução */}
          <TutorialCard
            step={currentStepConfig}
            onNext={nextStep}
            onPrevious={state.currentStepIndex > 0 ? previousStep : undefined}
            onSkip={currentStepConfig.skipable ? skipTutorial : undefined}
            showPrevious={state.currentStepIndex > 0}
            position={currentStepConfig.position}
          />
          
          {/* Área clicável para fechar (apenas se skipable) */}
          {currentStepConfig.skipable && (
            <TouchableWithoutFeedback onPress={skipTutorial}>
              <View style={styles.closeArea} />
            </TouchableWithoutFeedback>
          )}
        </LinearGradient>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  progressBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1001,
  },
  mascotContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    zIndex: 999,
  },
  closeArea: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
});
