/**
 * OnboardingScreen - Tela principal do onboarding
 * Gerencia navegação entre slides e conclusão
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ViewToken,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import OnboardingSlide, { SlideData } from './OnboardingSlide';
import ProgressDots from './ProgressDots';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

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
        title: 'Central de Notícias',
        description: 'Feed confiável do Brasil em tempo real',
      },
      {
        icon: '📊',
        title: 'Histórico Completo',
        description: 'Suas verificações e da comunidade',
      },
      {
        icon: '🎓',
        title: 'Educação Digital',
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
  const flatListRef = useRef<FlatList>(null);

  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === SLIDES.length - 1;

  // Detecta mudança de slide
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  // Navegar para próximo slide
  const goToNextSlide = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  // Navegar para slide anterior
  const goToPreviousSlide = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header com botão Pular */}
      <View style={styles.header}>
        <View style={{ width: 60 }} />
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>
            Pular
          </Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={({ item }) => <OnboardingSlide slide={item} />}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
        scrollEventThrottle={32}
      />

      {/* Footer com navegação */}
      <View style={styles.footer}>
        {/* Progress Dots */}
        <ProgressDots currentIndex={currentIndex} totalSlides={SLIDES.length} />

        {/* Botões de navegação */}
        <View style={styles.navigationButtons}>
          {/* Botão Voltar */}
          {!isFirstSlide && (
            <TouchableOpacity
              onPress={goToPreviousSlide}
              style={[styles.navButton, styles.backButton, { borderColor: colors.border }]}
            >
              <ChevronLeft size={20} color={colors.textSecondary} />
              <Text style={[styles.navButtonText, { color: colors.textSecondary }]}>
                Voltar
              </Text>
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
              { backgroundColor: colors.primary },
              !isFirstSlide && { flex: 1 },
            ]}
          >
            <Text style={[styles.navButtonText, { color: colors.surface }]}>
              {isLastSlide ? 'Começar' : 'Próximo'}
            </Text>
            {!isLastSlide && <ChevronRight size={20} color={colors.surface} />}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  backButton: {
    borderWidth: 1,
    flex: 1,
  },
  nextButton: {
    minWidth: 120,
  },
  navButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
});
