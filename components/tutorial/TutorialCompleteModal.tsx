/**
 * ====================================
 * TUTORIAL COMPLETE MODAL
 * Modal de celebração ao completar TODO o tutorial
 * ====================================
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/contexts/ThemeContext';
import { useTutorial } from '@/contexts/TutorialContext';
import { Check, Download, Share2 } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TutorialCompleteModalProps {
  /** Modal visível */
  visible: boolean;
  
  /** Callback ao começar a usar */
  onStart: () => void;
  
  /** Callback ao baixar certificado */
  onDownloadCertificate?: () => void;
  
  /** Callback ao compartilhar */
  onShare?: () => void;
}

export function TutorialCompleteModal({
  visible,
  onStart,
  onDownloadCertificate,
  onShare
}: TutorialCompleteModalProps) {
  const { colors, isDarkMode } = useTheme();
  const { state } = useTutorial();
  
  // Animações
  const scale = useSharedValue(0);
  const badgesOpacity = useSharedValue(0);
  const badgesTranslateY = useSharedValue(30);
  
  useEffect(() => {
    if (visible) {
      // Container
      scale.value = withSpring(1, {
        damping: 12,
        stiffness: 100
      });
      
      // Badges com delay
      badgesOpacity.value = withDelay(
        400,
        withTiming(1, { duration: 500 })
      );
      
      badgesTranslateY.value = withDelay(
        400,
        withSpring(0, { damping: 15, stiffness: 120 })
      );
    } else {
      scale.value = 0;
      badgesOpacity.value = 0;
      badgesTranslateY.value = 30;
    }
  }, [visible]);
  
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const badgesStyle = useAnimatedStyle(() => ({
    opacity: badgesOpacity.value,
    transform: [{ translateY: badgesTranslateY.value }],
  }));
  
  // Calcula tempo gasto
  const timeSpent = state.completedAt && state.startedAt
    ? Math.floor((state.completedAt - state.startedAt) / 1000 / 60)
    : 0;
  
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
          <>
            <ConfettiCannon
              count={200}
              origin={{ x: SCREEN_WIDTH / 2, y: -10 }}
              fadeOut
              autoStart
              fallSpeed={2500}
              colors={['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181']}
            />
            {/* Segundo confetti atrasado */}
            <ConfettiCannon
              count={100}
              origin={{ x: 0, y: SCREEN_WIDTH / 2 }}
              fadeOut
              autoStartDelay={500}
              fallSpeed={2000}
            />
          </>
        )}
        
        {/* Backdrop */}
        <BlurView
          intensity={isDarkMode ? 90 : 95}
          tint={isDarkMode ? 'dark' : 'light'}
          style={styles.blurView}
        >
          <Animated.View style={[styles.container, containerStyle]}>
            <ScrollView
              style={[
                styles.card,
                {
                  backgroundColor: isDarkMode
                    ? 'rgba(31, 41, 55, 0.98)'
                    : 'rgba(255, 255, 255, 0.98)',
                }
              ]}
              contentContainerStyle={styles.cardContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Ícone de sucesso */}
              <View style={[styles.successIcon, { backgroundColor: colors.primary }]}>
                <Check size={50} color="#FFFFFF" strokeWidth={3} />
              </View>
              
              {/* Título */}
              <Text style={[styles.title, { color: colors.text }]}>
                💎 Mestre CheckNow!
              </Text>
              
              {/* Mensagem */}
              <Text style={[styles.message, { color: colors.textSecondary }]}>
                🎉 Parabéns!{'\n'}
                Você dominou todas as funcionalidades do app!
              </Text>
              
              {/* Stats */}
              <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.text }]}>15/15</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Passos</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.text }]}>4/4</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Níveis</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.text }]}>{timeSpent}min</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Tempo</Text>
                </View>
              </View>
              
              {/* Badges conquistados */}
              <Animated.View style={[styles.badgesSection, badgesStyle]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  🏆 Badges Conquistados:
                </Text>
                
                <View style={styles.badgesGrid}>
                  <View style={styles.badgeItem}>
                    <Text style={styles.badgeEmoji}>🥉</Text>
                    <Text style={[styles.badgeName, { color: colors.textSecondary }]}>
                      Verificador Iniciante
                    </Text>
                  </View>
                  
                  <View style={styles.badgeItem}>
                    <Text style={styles.badgeEmoji}>🥈</Text>
                    <Text style={[styles.badgeName, { color: colors.textSecondary }]}>
                      Explorador
                    </Text>
                  </View>
                  
                  <View style={styles.badgeItem}>
                    <Text style={styles.badgeEmoji}>🥇</Text>
                    <Text style={[styles.badgeName, { color: colors.textSecondary }]}>
                      Estudante Digital
                    </Text>
                  </View>
                  
                  <View style={styles.badgeItem}>
                    <Text style={styles.badgeEmoji}>💎</Text>
                    <Text style={[styles.badgeName, { color: colors.textSecondary }]}>
                      Mestre CheckNow
                    </Text>
                  </View>
                </View>
              </Animated.View>
              
              {/* Recompensas totais */}
              <View style={[styles.rewardsSection, { backgroundColor: colors.card }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  🎁 Recompensas Totais:
                </Text>
                
                <View style={styles.rewardsList}>
                  <View style={styles.rewardItem}>
                    <Text style={styles.rewardEmoji}>✅</Text>
                    <Text style={[styles.rewardText, { color: colors.textSecondary }]}>
                      +6 verificações extras
                    </Text>
                  </View>
                  
                  <View style={styles.rewardItem}>
                    <Text style={styles.rewardEmoji}>⭐</Text>
                    <Text style={[styles.rewardText, { color: colors.textSecondary }]}>
                      3 dias de Premium GRÁTIS
                    </Text>
                  </View>
                  
                  <View style={styles.rewardItem}>
                    <Text style={styles.rewardEmoji}>📜</Text>
                    <Text style={[styles.rewardText, { color: colors.textSecondary }]}>
                      Certificado de Conclusão
                    </Text>
                  </View>
                </View>
              </View>
              
              {/* Botões */}
              <View style={styles.buttonsContainer}>
                {/* Botão principal */}
                <TouchableOpacity
                  onPress={onStart}
                  style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>
                    🎊 Começar a Usar!
                  </Text>
                </TouchableOpacity>
                
                {/* Botões secundários */}
                <View style={styles.secondaryButtons}>
                  {onDownloadCertificate && (
                    <TouchableOpacity
                      onPress={onDownloadCertificate}
                      style={[styles.secondaryButton, { borderColor: colors.border }]}
                      activeOpacity={0.7}
                    >
                      <Download size={18} color={colors.text} />
                      <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
                        Certificado
                      </Text>
                    </TouchableOpacity>
                  )}
                  
                  {onShare && (
                    <TouchableOpacity
                      onPress={onShare}
                      style={[styles.secondaryButton, { borderColor: colors.border }]}
                      activeOpacity={0.7}
                    >
                      <Share2 size={18} color={colors.text} />
                      <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
                        Compartilhar
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </ScrollView>
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
    width: '90%',
    maxWidth: 420,
    maxHeight: '85%',
  },
  card: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  cardContent: {
    padding: 28,
    alignItems: 'center',
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: '100%',
    marginHorizontal: 12,
  },
  badgesSection: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  badgeItem: {
    alignItems: 'center',
    width: '40%',
  },
  badgeEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  badgeName: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
  rewardsSection: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  rewardsList: {
    gap: 10,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardEmoji: {
    fontSize: 18,
    marginRight: 10,
    width: 24,
  },
  rewardText: {
    fontSize: 14,
    flex: 1,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 6,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
