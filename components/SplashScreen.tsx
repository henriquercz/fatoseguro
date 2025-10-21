/**
 * Tela de Splash Profissional do CheckNow
 * 
 * Design moderno com animações suaves e timing perfeito.
 * Inspirado nos melhores apps do mercado.
 * 
 * MELHORIAS IMPLEMENTADAS:
 * ✨ Animações sequenciais suaves e clean
 * 💫 Efeito de pulso sutil no ícone
 * 📐 Espaçamento hierárquico profissional
 * ⚡ Timing otimizado (3s total)
 * 🎨 Sombras e elevações aprimoradas
 * 🎯 Design minimalista e focado
 * 
 * @author Capitão Henrique
 * @version 2.8
 * @date Janeiro 2025
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  Platform,
  Easing,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Shield, CheckCircle } from 'lucide-react-native';

interface SplashScreenProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const { colors } = useTheme();
  
  // Animações principais com valores iniciais otimizados
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current; // Começa menor para efeito suave
  const slideUpAnim = useRef(new Animated.Value(60)).current; // Slogan sobe
  const pulseAnim = useRef(new Animated.Value(1)).current; // Pulso contínuo suave

  useEffect(() => {
    // Sequência de animações clean e suave
    Animated.sequence([
      // 1. Fade in suave (500ms)
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      
      // 2. Logo aparece com escala suave (700ms)
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
      
      // 3. Slogan sobe suavemente (500ms)
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Animação contínua de pulso suave no ícone
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Auto-dismiss após 3 segundos (timing ideal para splash profissional)
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 400,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.background,
          opacity: fadeAnim 
        }
      ]}
    >
      {/* Gradiente de fundo decorativo */}
      <View style={[styles.gradientCircle, { backgroundColor: colors.primary + '20' }]} />
      <View style={[styles.gradientCircle2, { backgroundColor: colors.success + '15' }]} />

      {/* Logo e ícone principal com animações suaves */}
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            transform: [
              { scale: Animated.multiply(scaleAnim, pulseAnim) }
            ]
          }
        ]}
      >
        <View style={[styles.iconWrapper, { backgroundColor: colors.primary }]}>
          <Image source={require('../assets/images/logozinha.png')} style={styles.icon} />
        </View>
        
        <Text style={[styles.appName, { color: colors.text }]}>
          CheckNow
        </Text>
        
        <View style={styles.checkIconContainer}>
          <CheckCircle size={20} color={colors.success} />
        </View>
      </Animated.View>

      {/* Slogan */}
      <Animated.View 
        style={[
          styles.sloganContainer,
          {
            transform: [{ translateY: slideUpAnim }]
          }
        ]}
      >
        <Text style={[styles.slogan, { color: colors.textSecondary }]}>
          Verificação de notícias com IA
        </Text>
        <Text style={[styles.subSlogan, { color: colors.textSecondary }]}>
          Combatendo a desinformação no Brasil
        </Text>
      </Animated.View>

      {/* Indicador de carregamento */}
      <Animated.View 
        style={[
          styles.loadingContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }]
          }
        ]}
      >
        <View style={[styles.loadingBar, { backgroundColor: colors.border }]}>
          <Animated.View 
            style={[
              styles.loadingProgress, 
              { backgroundColor: colors.primary }
            ]} 
          />
        </View>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Carregando...
        </Text>
      </Animated.View>

      {/* Versão */}
      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, { color: colors.textSecondary }]}>
          v2.8
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    width: 58,
    height: 58,
  },
  gradientCircle: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    top: -width * 0.5,
    left: -width * 0.25,
  },
  gradientCircle2: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    bottom: -width * 0.4,
    right: -width * 0.3,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  iconWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  appName: {
    fontSize: Platform.OS === 'android' ? 34 : 38,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
    letterSpacing: -1,
    textAlign: 'center',
  },
  checkIconContainer: {
    position: 'absolute',
    top: 80,
    right: -5,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sloganContainer: {
    alignItems: 'center',
    marginBottom: 80,
    paddingHorizontal: 30,
  },
  slogan: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subSlogan: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    opacity: 0.8,
  },
  loadingContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 100,
    width: '100%',
    paddingHorizontal: 50,
  },
  loadingBar: {
    width: '100%',
    maxWidth: 220,
    height: 5,
    borderRadius: 2.5,
    marginBottom: 14,
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    width: '75%',
    borderRadius: 2.5,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  versionContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    opacity: 0.6,
  },
});
