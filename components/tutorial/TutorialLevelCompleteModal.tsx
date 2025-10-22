/**
 * ====================================
 * TUTORIAL LEVEL COMPLETE MODAL
 * Modal de celebração ao completar um nível
 * ====================================
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/contexts/ThemeContext';
import { TutorialLevelReward } from '@/types/tutorial.types';
import { ArrowRight } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TutorialLevelCompleteModalProps {
  /** Modal visível */
  visible: boolean;
  
  /** Recompensa do nível */
  reward: TutorialLevelReward;
  
  /** Callback ao continuar */
  onContinue: () => void;
}

const LEVEL_EMOJIS = {
  1: '🥉',
  2: '🥈',
  3: '🥇',
  4: '💎'
};

const LEVEL_COLORS = {
  1: '#CD7F32',
  2: '#C0C0C0',
  3: '#FFD700',
  4: '#B9F2FF'
};

export function TutorialLevelCompleteModal({
  visible,
  reward,
  onContinue
}: TutorialLevelCompleteModalProps) {
  const { colors, isDarkMode } = useTheme();
  
  // Animações
  const scale = useSharedValue(0);
  const badgeScale = useSharedValue(0);
  const badgeRotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    if (visible) {
      // Animação de entrada
      opacity.value = withTiming(1, { duration: 300 });
      
      scale.value = withSpring(1, {
        damping: 12,
        stiffness: 100
      });
      
      // Badge com delay e rotação
      badgeScale.value = withDelay(
        300,
        withSpring(1, { damping: 10, stiffness: 120 })
      );
      
      badgeRotate.value = withDelay(
        300,
        withSequence(
          withTiming(360, { duration: 600, easing: Easing.out(Easing.ease) }),
          withSpring(0, { damping: 8 })
        )
      );
    } else {
      // Reset
      scale.value = 0;
      badgeScale.value = 0;
      badgeRotate.value = 0;
      opacity.value = 0;
    }
  }, [visible]);
  
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  
  const badgeStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: badgeScale.value },
      { rotate: `${badgeRotate.value}deg` }
    ],
  }));
  
  const levelEmoji = LEVEL_EMOJIS[reward.level as keyof typeof LEVEL_EMOJIS];
  const levelColor = LEVEL_COLORS[reward.level as keyof typeof LEVEL_COLORS];
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* Confetti */}
        {visible && (
          <ConfettiCannon
            count={150}
            origin={{ x: SCREEN_WIDTH / 2, y: -10 }}
            fadeOut
            autoStart
            fallSpeed={2500}
          />
        )}
        
        {/* Backdrop */}
        <BlurView
          intensity={isDarkMode ? 90 : 95}
          tint={isDarkMode ? 'dark' : 'light'}
          style={styles.blurView}
        >
          <Animated.View style={[styles.container, containerStyle]}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDarkMode
                    ? 'rgba(31, 41, 55, 0.98)'
                    : 'rgba(255, 255, 255, 0.98)',
                }
              ]}
            >
              {/* Badge */}
              <Animated.View style={[styles.badgeContainer, badgeStyle]}>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: levelColor }
                  ]}
                >
                  <Text style={styles.badgeEmoji}>{levelEmoji}</Text>
                </View>
              </Animated.View>
              
              {/* Título */}
              <Text style={[styles.title, { color: colors.text }]}>
                Nível {reward.level} Completo!
              </Text>
              
              {/* Mensagem */}
              <Text style={[styles.message, { color: colors.textSecondary }]}>
                {reward.celebrationMessage}
              </Text>
              
              {/* Divisor */}
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              
              {/* Recompensas */}
              <View style={styles.rewardsContainer}>
                <Text style={[styles.rewardsTitle, { color: colors.text }]}>
                  🎁 Recompensas Desbloqueadas:
                </Text>
                
                {reward.verificationCredits > 0 && (
                  <View style={styles.rewardItem}>
                    <Text style={styles.rewardEmoji}>✅</Text>
                    <Text style={[styles.rewardText, { color: colors.textSecondary }]}>
                      +{reward.verificationCredits} verificações extras
                    </Text>
                  </View>
                )}
                
                {reward.premiumDays && (
                  <View style={styles.rewardItem}>
                    <Text style={styles.rewardEmoji}>⭐</Text>
                    <Text style={[styles.rewardText, { color: colors.textSecondary }]}>
                      {reward.premiumDays} dias de Premium GRÁTIS
                    </Text>
                  </View>
                )}
                
                {reward.unlocks && reward.unlocks.includes('certificate') && (
                  <View style={styles.rewardItem}>
                    <Text style={styles.rewardEmoji}>📜</Text>
                    <Text style={[styles.rewardText, { color: colors.textSecondary }]}>
                      Certificado de Conclusão
                    </Text>
                  </View>
                )}
              </View>
              
              {/* Botão */}
              <TouchableOpacity
                onPress={onContinue}
                style={[styles.button, { backgroundColor: colors.primary }]}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>
                  {reward.level < 4 ? 'Continuar para Nível ' + (reward.level + 1) : 'Finalizar Tutorial'}
                </Text>
                <ArrowRight size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </BlurView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    maxWidth: 400,
  },
  card: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  badgeContainer: {
    marginBottom: 20,
  },
  badge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  badgeEmoji: {
    fontSize: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 20,
  },
  rewardsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  rewardsTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingLeft: 20,
  },
  rewardEmoji: {
    fontSize: 18,
    marginRight: 10,
  },
  rewardText: {
    fontSize: 14,
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    gap: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
