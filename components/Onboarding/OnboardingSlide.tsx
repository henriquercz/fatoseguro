/**
 * 🎨 OnboardingSlide - Slide Profissional Premium
 * Checkito GRANDE com design moderno e glassmorphism
 */

import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

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
  // Gradientes diferentes para cada tela (mas consistentes na paleta azul)
  const gradients: Record<number, readonly [string, string, string]> = {
    1: ['#3B82F6', '#2563EB', '#1E40AF'] as const, // Azul claro → médio
    2: ['#1E40AF', '#1E3A8A', '#1E293B'] as const, // Azul escuro → navy
    3: ['#6366F1', '#4F46E5', '#4338CA'] as const, // Índigo vibrante
    4: ['#0EA5E9', '#0284C7', '#0369A1'] as const, // Cyan energético
  };

  const currentGradient = gradients[slide.id] || gradients[1];

  // Layouts diferentes para cada tela
  const renderLayout = () => {
    switch (slide.id) {
      case 1:
        // TELA 1: Checkito NO TOPO, conteúdo embaixo
        return (
          <View style={styles.layout1}>
            <Image source={slide.checkitoImage} style={styles.checkitoTop} resizeMode="contain" />
            <BlurView intensity={25} tint="light" style={styles.contentCardTop}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </BlurView>
          </View>
        );

      case 2:
        // TELA 2: Checkito À ESQUERDA, features à direita
        return (
          <View style={styles.layout2}>
            <View style={styles.leftSection}>
              <Image source={slide.checkitoImage} style={styles.checkitoLeft} resizeMode="contain" />
            </View>
            <View style={styles.rightSection}>
              <BlurView intensity={25} tint="light" style={styles.contentCardRight}>
                <Text style={styles.titleSmall}>{slide.title}</Text>
                <Text style={styles.descriptionSmall}>{slide.description}</Text>
                {slide.features && (
                  <View style={styles.featuresCompact}>
                    {slide.features.map((feature, index) => (
                      <View key={index} style={styles.featureItemCompact}>
                        <Text style={styles.featureIconSmall}>{feature.icon}</Text>
                        <Text style={styles.featureTitleCompact}>{feature.title}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </BlurView>
            </View>
          </View>
        );

      case 3:
        // TELA 3: Checkito À DIREITA, features à esquerda
        return (
          <View style={styles.layout3}>
            <View style={styles.leftSection}>
              <BlurView intensity={25} tint="light" style={styles.contentCardLeft}>
                <Text style={styles.titleSmall}>{slide.title}</Text>
                <Text style={styles.descriptionSmall}>{slide.description}</Text>
                {slide.features && (
                  <View style={styles.featuresCompact}>
                    {slide.features.map((feature, index) => (
                      <View key={index} style={styles.featureItemCompact}>
                        <Text style={styles.featureIconSmall}>{feature.icon}</Text>
                        <Text style={styles.featureTitleCompact}>{feature.title}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </BlurView>
            </View>
            <View style={styles.rightSection}>
              <Image source={slide.checkitoImage} style={styles.checkitoRight} resizeMode="contain" />
            </View>
          </View>
        );

      case 4:
        // TELA 4: Checkito NO MEIO, conteúdo ao redor
        return (
          <View style={styles.layout4}>
            <BlurView intensity={25} tint="light" style={styles.contentCardCenter}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </BlurView>
            <Image source={slide.checkitoImage} style={styles.checkitoCenter} resizeMode="contain" />
            {slide.features && (
              <View style={styles.featuresBottom}>
                {slide.features.map((feature, index) => (
                  <BlurView key={index} intensity={20} tint="light" style={styles.featureCardBottom}>
                    <Text style={styles.featureIconLarge}>{feature.icon}</Text>
                    <Text style={styles.featureTitleBottom}>{feature.title}</Text>
                  </BlurView>
                ))}
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <LinearGradient colors={currentGradient} style={[styles.slideContainer, { width }]}>
      {renderLayout()}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  slideContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 20,
  },
  
  // ==================== LAYOUT 1: Checkito NO TOPO ====================
  layout1: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  checkitoTop: {
    width: '100%',
    height: height * 0.5,
  },
  contentCardTop: {
    borderRadius: 28,
    padding: 28,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
  },
  
  // ==================== LAYOUT 2 & 3: LATERAL ====================
  layout2: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  layout3: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'center',
  },
  rightSection: {
    flex: 1,
    justifyContent: 'center',
  },
  checkitoLeft: {
    width: '100%',
    height: height * 0.6,
  },
  checkitoRight: {
    width: '100%',
    height: height * 0.6,
  },
  contentCardRight: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  contentCardLeft: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  
  // ==================== LAYOUT 4: CENTRO ====================
  layout4: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentCardCenter: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
  },
  checkitoCenter: {
    width: '80%',
    height: height * 0.35,
  },
  featuresBottom: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-around',
  },
  featureCardBottom: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    overflow: 'hidden',
  },
  
  // ==================== TEXTOS ====================
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    color: '#FFFFFF',
    opacity: 0.95,
  },
  titleSmall: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 10,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  descriptionSmall: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 16,
  },
  
  // ==================== FEATURES COMPACT ====================
  featuresCompact: {
    gap: 10,
  },
  featureItemCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 12,
    gap: 10,
  },
  featureIconSmall: {
    fontSize: 20,
  },
  featureTitleCompact: {
    flex: 1,
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: '#FFFFFF',
  },
  
  // ==================== FEATURES BOTTOM ====================
  featureIconLarge: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitleBottom: {
    fontFamily: 'Inter-Bold',
    fontSize: 11,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
