/**
 * OnboardingSlide - Componente de cada tela do onboarding
 * Renderiza uma tela individual com Checkito e conteúdo
 */

import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');

export interface SlideData {
  id: number;
  checkitoImage: any;
  title: string;
  description: string;
  features?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

interface OnboardingSlideProps {
  slide: SlideData;
}

export default function OnboardingSlide({ slide }: OnboardingSlideProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { width }]}>
      {/* Checkito Character - 40% da tela */}
      <View style={styles.characterSection}>
        <Image
          source={slide.checkitoImage}
          style={styles.checkitoImage}
          resizeMode="contain"
        />
      </View>

      {/* Content Section - 45% da tela */}
      <View style={styles.contentSection}>
        <Text style={[styles.title, { color: colors.text }]}>
          {slide.title}
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {slide.description}
        </Text>

        {/* Features List (se existir) */}
        {slide.features && (
          <View style={styles.featuresList}>
            {slide.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <View style={styles.featureContent}>
                  <Text style={[styles.featureTitle, { color: colors.text }]}>
                    {feature.title}
                  </Text>
                  <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  characterSection: {
    height: '40%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  checkitoImage: {
    width: '80%',
    height: '100%',
  },
  contentSection: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  featuresList: {
    width: '100%',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
});
