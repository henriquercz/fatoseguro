/**
 * 🎨 OnboardingSlide - Design CLEAN tipo Revolut
 * Minimalista, soft, fundo branco, sem cards
 */

import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Link, 
  Sparkles, 
  Search, 
  Newspaper, 
  History, 
  GraduationCap,
  Shield,
  Zap,
  Award
} from 'lucide-react-native';

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
  // Renderiza layout específico para cada tela
  const renderLayout = () => {
    switch (slide.id) {
      case 1:
        // TELA 1: Conteúdo em cima, Checkito EMBAIXO e MAIOR
        return (
          <View style={styles.layout1}>
            <View style={styles.contentTop1}>
              <Text style={styles.title1}>{slide.title}</Text>
              <Text style={styles.subtitle1}>{slide.description}</Text>
            </View>
            <Image source={slide.checkitoImage} style={styles.checkito1} resizeMode="contain" />
          </View>
        );

      case 2:
        // TELA 2: Checkito de FUNDO grande, cards profissionais na frente
        return (
          <View style={styles.layout2}>
            <Image source={slide.checkitoImage} style={styles.checkito2Background} resizeMode="contain" />
            <View style={styles.content2}>
              <Text style={styles.title2}>{slide.title}</Text>
              <Text style={styles.subtitle2}>{slide.description}</Text>
              {slide.features && slide.features.length > 0 && (
                <View style={styles.features2}>
                  {/* Card 1: Cole link */}
                  <View style={styles.featureCard2}>
                    <View style={styles.featureIconCircle}>
                      <Link size={20} color="#3B82F6" strokeWidth={2.5} />
                    </View>
                    <View style={styles.featureContent2}>
                      <Text style={styles.featureTitle2}>Cole um link ou texto</Text>
                      <Text style={styles.featureDesc2}>Adicione a notícia que deseja verificar</Text>
                    </View>
                  </View>
                  
                  {/* Card 2: Checkito analisa */}
                  <View style={styles.featureCard2}>
                    <View style={styles.featureIconCircle}>
                      <Search size={20} color="#3B82F6" strokeWidth={2.5} />
                    </View>
                    <View style={styles.featureContent2}>
                      <Text style={styles.featureTitle2}>Checkito analisa</Text>
                      <Text style={styles.featureDesc2}>IA verifica veracidade em segundos</Text>
                    </View>
                  </View>
                  
                  {/* Card 3: Resultado */}
                  <View style={styles.featureCard2}>
                    <View style={styles.featureIconCircle}>
                      <Sparkles size={20} color="#3B82F6" strokeWidth={2.5} />
                    </View>
                    <View style={styles.featureContent2}>
                      <Text style={styles.featureTitle2}>Receba o resultado</Text>
                      <Text style={styles.featureDesc2}>Veja análise completa e detalhada</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        );

      case 3:
        // TELA 3: Conteúdo e cards em cima, Checkito EMBAIXO e MAIOR
        const icons3 = [Newspaper, History, GraduationCap];
        return (
          <View style={styles.layout3}>
            {/* Bola de luz azul sutil no fundo */}
            <LinearGradient
              colors={['rgba(59, 130, 246, 0.15)', 'rgba(59, 130, 246, 0.05)', 'rgba(59, 130, 246, 0)']}
              start={{ x: 0.2, y: 0.3 }}
              end={{ x: 0.8, y: 0.7 }}
              style={styles.blueGlowBall}
            />
            
            <View style={styles.contentTop3}>
              <Text style={styles.title3}>{slide.title}</Text>
              <Text style={styles.subtitle3}>{slide.description}</Text>
              {slide.features && slide.features.length > 0 && (
                <View style={styles.features3}>
                  {slide.features.slice(0, 3).map((feature, index) => {
                    const Icon = icons3[index];
                    return (
                      <View key={index} style={styles.featureCard3}>
                        <View style={styles.featureIconContainer3}>
                          <Icon size={28} color="#3B82F6" strokeWidth={2} />
                        </View>
                        <Text style={styles.featureTitle3}>{feature.title}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
            <Image source={slide.checkitoImage} style={styles.checkito3} resizeMode="contain" />
          </View>
        );

      case 4:
        // TELA 4: Layout com cards premium
        return (
          <View style={styles.layout4}>
            <Image source={slide.checkitoImage} style={styles.checkito4} resizeMode="contain" />
            <Text style={styles.title4}>{slide.title}</Text>
            <Text style={styles.subtitle4}>{slide.description}</Text>
            
            {/* Cards de planos - DESIGN BONITO */}
            <View style={styles.plansContainer}>
              {/* Card Free - ELEGANTE */}
              <View style={[styles.planCard, styles.planCardFree]}>
                <View style={styles.planHeader}>
                  <View style={styles.planIconContainerFree}>
                    <Shield size={22} color="#64748B" strokeWidth={2.5} />
                  </View>
                </View>
                <Text style={styles.planTitleFree}>Gratuito</Text>
                <View style={styles.planFeatures}>
                  <View style={styles.planFeatureRow}>
                    <View style={styles.checkDot} />
                    <Text style={styles.planFeatureText}>3 verificações por mês</Text>
                  </View>
                  <View style={styles.planFeatureRow}>
                    <View style={styles.checkDot} />
                    <Text style={styles.planFeatureText}>Anúncios</Text>
                  </View>
                </View>
              </View>
              
              {/* Card Premium - DESTAQUE MÁXIMO */}
              <View style={[styles.planCard, styles.planCardPremium]}>
                <View style={styles.premiumRibbon}>
                  <Sparkles size={12} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={styles.ribbonText}>POPULAR</Text>
                </View>
                <View style={styles.planHeader}>
                  <View style={styles.planIconContainerPremium}>
                    <Award size={32} color="#FFFFFF" strokeWidth={2.5} />
                  </View>
                </View>
                <Text style={styles.planTitlePremium}>Premium</Text>
                <View style={styles.planFeatures}>
                  <View style={styles.planFeatureRow}>
                    <Sparkles size={14} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.planFeatureTextPremium}>Ilimitado</Text>
                  </View>
                  <View style={styles.planFeatureRow}>
                    <Zap size={14} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.planFeatureTextPremium}>Sem anúncios</Text>
                  </View>
                  <View style={styles.planFeatureRow}>
                    <Shield size={14} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.planFeatureTextPremium}>Suporte VIP</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { width }]}>
      {renderLayout()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingTop: Platform.OS === 'android' ? 60 : 80,
    paddingBottom: 140,
  },

  // ==================== LAYOUT 1: Conteúdo em cima, Checkito embaixo ====================
  layout1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentTop1: {
    paddingTop: 20,
    alignItems: 'center',
  },
  checkito1: {
    width: width * 0.85,
    height: height * 0.5,
    marginBottom: -20,
  },
  title1: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
    paddingHorizontal: 20,
  },
  subtitle1: {
    fontFamily: 'Inter-Regular',
    fontSize: 17,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
  },

  // ==================== LAYOUT 2: Background ====================
  layout2: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  checkito2Background: {
    position: 'absolute',
    top: -20,
    right: -40,
    width: width * 0.85,
    height: height * 0.6,
    opacity: 0.15,
  },
  content2: {
    zIndex: 10,
    paddingBottom: 40,
  },
  title2: {
    fontFamily: 'Inter-Bold',
    fontSize: 38,
    color: '#1E293B',
    marginBottom: 16,
    letterSpacing: -0.5,
    lineHeight: 44,
  },
  subtitle2: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    marginBottom: 32,
    lineHeight: 24,
  },
  features2: {
    gap: 14,
  },
  featureCard2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    gap: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  featureIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent2: {
    flex: 1,
  },
  featureTitle2: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 4,
  },
  featureDesc2: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },

  // ==================== LAYOUT 3: Conteúdo em cima, Checkito embaixo ====================
  layout3: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  blueGlowBall: {
    position: 'absolute',
    top: '25%',
    right: '-20%',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    zIndex: 0,
  },
  contentTop3: {
    paddingTop: 10,
    alignItems: 'center',
    width: '100%',
    zIndex: 1,
  },
  checkito3: {
    width: width * 0.75,
    height: height * 0.38,
    marginTop: -30,
  },
  title3: {
    fontFamily: 'Inter-Bold',
    fontSize: 34,
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle3: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  features3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  featureCard3: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  featureIconContainer3: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#BFDBFE',
  },
  featureTitle3: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: '#334155',
    textAlign: 'center',
    lineHeight: 18,
  },

  // ==================== LAYOUT 4: Lateral ====================
  layout4: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 0,
  },
  content4: {
    marginBottom: 40,
  },
  title4: {
    fontFamily: 'Inter-Bold',
    fontSize: 34,
    color: '#1E293B',
    marginBottom: 12,
    letterSpacing: -0.5,
    lineHeight: 40,
    textAlign: 'center',
  },
  subtitle4: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
    textAlign: 'center',
  },
  checkito4: {
    width: width * 0.5,
    height: height * 0.25,
    alignSelf: 'center',
    marginBottom: 0,
  },
  plansContainer: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 20,
    marginBottom: 160,
  },
  planCard: {
    borderRadius: 24,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  planCardFree: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  planCardPremium: {
    flex: 1.4,
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#2563EB',
    ...Platform.select({
      ios: {
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  premiumRibbon: {
    position: 'absolute',
    top: -2,
    right: 12,
    backgroundColor: '#1E40AF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ribbonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 9,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  planIconContainerFree: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planIconContainerPremium: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planTitleFree: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 12,
  },
  planTitlePremium: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  planFeatures: {
    gap: 10,
    width: '100%',
  },
  planFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#64748B',
  },
  planFeatureText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#64748B',
    flex: 1,
  },
  planFeatureTextPremium: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
});
