/**
 * ====================================
 * TUTORIAL CARD
 * Card de instrução com efeito glassmorphism
 * ====================================
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { TutorialStepConfig, TutorialCardPosition } from '@/types/tutorial.types';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowRight, ArrowLeft, X } from 'lucide-react-native';

interface TutorialCardProps {
  /** Configuração do passo atual */
  step: TutorialStepConfig;
  
  /** Callback ao pressionar "Próximo" */
  onNext: () => void;
  
  /** Callback ao pressionar "Voltar" */
  onPrevious?: () => void;
  
  /** Callback ao pressionar "Pular" */
  onSkip?: () => void;
  
  /** Mostrar botão voltar */
  showPrevious?: boolean;
  
  /** Posição do card */
  position?: TutorialCardPosition;
}

export function TutorialCard({
  step,
  onNext,
  onPrevious,
  onSkip,
  showPrevious = false,
  position = 'bottom'
}: TutorialCardProps) {
  const { colors, isDarkMode } = useTheme();
  
  // Animações
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);
  
  useEffect(() => {
    // Animação de entrada
    translateY.value = withSpring(0, {
      damping: 20,
      stiffness: 150
    });
    
    opacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.ease)
    });
    
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 100
    });
  }, [step.id]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
    opacity: opacity.value,
  }));
  
  // Determina posição do card
  const positionStyle = position === 'top' 
    ? styles.positionTop
    : position === 'center'
    ? styles.positionCenter
    : styles.positionBottom;
  
  return (
    <Animated.View style={[styles.container, positionStyle, animatedStyle]}>
      <BlurView
        intensity={isDarkMode ? 80 : 90}
        tint={isDarkMode ? 'dark' : 'light'}
        style={styles.blurContainer}
      >
        <View style={[
          styles.card,
          {
            backgroundColor: isDarkMode 
              ? 'rgba(31, 41, 55, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            borderColor: isDarkMode
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.05)'
          }
        ]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              {step.emoji && (
                <Text style={styles.emoji}>{step.emoji}</Text>
              )}
              <Text style={[styles.title, { color: colors.text }]}>
                {step.title}
              </Text>
            </View>
            
            {step.skipable && onSkip && (
              <TouchableOpacity
                onPress={onSkip}
                style={styles.skipButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Divisor */}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          {/* Descrição */}
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {step.description}
          </Text>
          
          {/* Dicas */}
          {step.tips && step.tips.length > 0 && (
            <View style={[styles.tipsContainer, { backgroundColor: colors.card }]}>
              <Text style={[styles.tipsTitle, { color: colors.primary }]}>
                💡 Dica:
              </Text>
              {step.tips.map((tip, index) => (
                <Text
                  key={index}
                  style={[styles.tipText, { color: colors.textSecondary }]}
                >
                  • {tip}
                </Text>
              ))}
            </View>
          )}
          
          {/* Botões */}
          <View style={styles.buttonsContainer}>
            {showPrevious && onPrevious && (
              <TouchableOpacity
                onPress={onPrevious}
                style={[
                  styles.button,
                  styles.buttonSecondary,
                  { borderColor: colors.border }
                ]}
              >
                <ArrowLeft size={18} color={colors.text} />
                <Text style={[styles.buttonText, { color: colors.text }]}>
                  Voltar
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              onPress={onNext}
              style={[
                styles.button,
                styles.buttonPrimary,
                { backgroundColor: colors.primary },
                !showPrevious && styles.buttonFullWidth
              ]}
            >
              <Text style={styles.buttonTextPrimary}>
                {step.requiresAction ? 'Continuar' : 'Próximo'}
              </Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  positionTop: {
    top: 100,
  },
  positionCenter: {
    top: '35%',
  },
  positionBottom: {
    bottom: 100,
  },
  blurContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  emoji: {
    fontSize: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  skipButton: {
    padding: 4,
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  tipsContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    flex: 1,
  },
  buttonFullWidth: {
    flex: 1,
  },
  buttonPrimary: {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonSecondary: {
    borderWidth: 1.5,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  buttonTextPrimary: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
