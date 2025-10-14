/**
 * Tela de Splash personalizada do CheckNow
 * Autor: Capitão Henrique
 * Data: Janeiro 2025
 * Versão: 1.0.0
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
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Shield, CheckCircle } from 'lucide-react-native';

interface SplashScreenProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animação de entrada
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss após 2.5 segundos
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, slideAnim, onFinish]);

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

      {/* Logo e ícone principal */}
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <View style={[styles.iconWrapper, { backgroundColor: colors.primary }]}>
          {/* <Shield size={48} color="#FFFFFF" /> */}
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
            transform: [{ translateY: slideAnim }]
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
            transform: [{ translateY: slideAnim }]
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
          v2.7.1
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
    width: 48,
    height: 48,
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
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appName: {
    fontSize: Platform.OS === 'android' ? 28 : 32,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    letterSpacing: Platform.OS === 'android' ? 0 : -0.5,
    textAlign: 'center',
  },
  checkIconContainer: {
    position: 'absolute',
    top: 70,
    right: -10,
  },
  sloganContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  slogan: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subSlogan: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 120,
    width: '100%',
  },
  loadingBar: {
    width: 200,
    height: 4,
    borderRadius: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    width: '70%',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  versionContainer: {
    position: 'absolute',
    bottom: 40,
    right: 20,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});
