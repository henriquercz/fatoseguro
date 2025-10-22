/**
 * 🎨 OnboardingScreen - Design Profissional 100% Premium
 * Onboarding espetacular com animações suaves e UX impecável
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
  Platform,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import OnboardingSlide, { SlideData } from './OnboardingSlide';
import { Sparkles, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const SLIDES: SlideData[] = [
  {
    id: 1,
    checkitoImage: require('@/assets/images/checkito/checkito_tela1.png'),
    title: 'Bem-vindo ao Check Now! 👋',
    description: 'A desinformação está em todo lugar. Vamos te ajudar a combater isso e ficar por dentro da verdade!',
  },
  {
    id: 2,
    checkitoImage: require('@/assets/images/checkito/checkito_tela2.png'),
    title: 'Como funciona?',
    description: 'Verificar notícias nunca foi tão fácil!',
    features: [
      {
        icon: '1️⃣',
        title: 'Cole um link ou texto',
        description: 'Cole a notícia que quer verificar',
      },
      {
        icon: '2️⃣',
        title: 'Checkito analisa',
        description: 'Inteligência Artificial analisa em segundos',
      },
      {
        icon: '3️⃣',
        title: 'Receba o resultado',
        description: 'Verdadeiro ✅, Verificar ⚠️ ou Falso ❌',
      },
    ],
  },
  {
    id: 3,
    checkitoImage: require('@/assets/images/checkito/checkito_tela3.png'),
    title: 'Mais recursos pra você',
    description: 'Explore todas as funcionalidades:',
    features: [
      {
        icon: '📰',
        title: 'Notícias',
        description: 'Feed confiável do Brasil em tempo real',
      },
      {
        icon: '📊',
        title: 'Histórico',
        description: 'Suas verificações e da comunidade',
      },
      {
        icon: '🎓',
        title: 'Educação',
        description: 'Aprenda a identificar fake news',
      },
    ],
  },
  {
    id: 4,
    checkitoImage: require('@/assets/images/checkito/checkito_tela4.png'),
    title: 'Escolha seu plano',
    description: 'Comece grátis ou desbloqueie todos os recursos!',
    features: [
      {
        icon: '✨',
        title: 'GRATUITO',
        description: '3 verificações/dia • Todas as features',
      },
      {
        icon: '💎',
        title: 'PREMIUM',
        description: 'Ilimitado • Sem anúncios • Suporte prioritário',
      },
    ],
  },
];

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const { completeOnboarding, skipOnboarding } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === SLIDES.length - 1;

  // Animação de entrada
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex]);

  // Navegar para próximo slide
  const goToNextSlide = () => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: width * nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }
  };

  // Navegar para slide anterior
  const goToPreviousSlide = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      scrollViewRef.current?.scrollTo({
        x: width * prevIndex,
        animated: true,
      });
      setCurrentIndex(prevIndex);
    }
  };

  // Detecta scroll manual
  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    if (index !== currentIndex && index >= 0 && index < SLIDES.length) {
      setCurrentIndex(index);
    }
  };

  // Finalizar onboarding
  const handleFinish = async () => {
    await completeOnboarding();
  };

  // Pular onboarding
  const handleSkip = async () => {
    await skipOnboarding();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header com botão Pular */}
        <Animated.View 
          style={[
            styles.header,
            { opacity: fadeAnim }
          ]}
        >
          <TouchableOpacity 
            onPress={handleSkip} 
            style={styles.skipButton}
            activeOpacity={0.7}
          >
            <X size={20} color="#64748B" strokeWidth={2.5} />
          </TouchableOpacity>
        </Animated.View>

        {/* Slides com ScrollView */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          bounces={false}
          style={styles.scrollView}
        >
          {SLIDES.map((slide, index) => (
            <Animated.View
              key={slide.id}
              style={[
                styles.slideWrapper,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <OnboardingSlide slide={slide} />
            </Animated.View>
          ))}
        </ScrollView>

        {/* Footer com navegação e progress dots */}
        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          {/* Progress Dots Customizados */}
          <View style={styles.dotsContainer}>
            {SLIDES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex && styles.dotActive,
                  {
                    backgroundColor: index === currentIndex ? '#3B82F6' : '#E2E8F0',
                    width: index === currentIndex ? 32 : 8,
                  },
                ]}
              />
            ))}
          </View>

          {/* Botões de navegação */}
          <View style={styles.navigationButtons}>
            {/* Botão Voltar */}
            {!isFirstSlide && (
              <TouchableOpacity
                onPress={goToPreviousSlide}
                style={[styles.navButton, styles.backButton]}
                activeOpacity={0.8}
              >
                <ChevronLeft size={20} color="#64748B" strokeWidth={2.5} />
                <Text style={styles.navButtonText}>Voltar</Text>
              </TouchableOpacity>
            )}

            {/* Espaçador */}
            {isFirstSlide && <View style={{ flex: 1 }} />}

            {/* Botão Próximo/Começar */}
            <TouchableOpacity
              onPress={isLastSlide ? handleFinish : goToNextSlide}
              style={[
                styles.navButton,
                styles.nextButton,
                !isFirstSlide && { flex: 1 },
              ]}
              activeOpacity={0.8}
            >
              {isLastSlide ? (
                <>
                  <Sparkles size={20} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={styles.nextButtonText}>Começar</Text>
                </>
              ) : (
                <>
                  <Text style={styles.nextButtonText}>Próximo</Text>
                  <ArrowRight size={20} color="#FFFFFF" strokeWidth={2.5} />
                </>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Fundo branco clean
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 10,
    zIndex: 10,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  skipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  scrollView: {
    flex: 1,
  },
  slideWrapper: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'android' ? 20 : 12,
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingTop: 16,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    // Estilo aplicado dinamicamente
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    backgroundColor: '#F1F5F9',
    borderWidth: 0,
    flex: 1,
  },
  nextButton: {
    backgroundColor: '#3B82F6',
    flex: 1,
  },
  navButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#64748B',
    letterSpacing: 0.5,
  },
  nextButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
