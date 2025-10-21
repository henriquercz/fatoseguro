/**
 * Modal de Conquista - Primeira Verificação
 * 
 * Popup celebrando a primeira verificação do usuário
 * Com Checkito da tela 4 e mensagem de parabéns
 * 
 * @author Capitão Henrique
 * @version 2.8
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { X, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface FirstVerificationModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export default function FirstVerificationModal({ visible, onClose }: FirstVerificationModalProps) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animação de entrada
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Animação contínua de brilho
      Animated.loop(
        Animated.sequence([
          Animated.timing(sparkleAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View 
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        <TouchableOpacity 
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={handleClose}
        />
        
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Botão Fechar */}
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.surface }]}
            onPress={handleClose}
          >
            <X size={20} color={colors.text} />
          </TouchableOpacity>

          {/* Sparkles Animadas */}
          <Animated.View
            style={[
              styles.sparklesContainer,
              {
                opacity: sparkleAnim,
              },
            ]}
          >
            <Sparkles size={32} color="#FFD700" style={styles.sparkle1} />
            <Sparkles size={24} color="#FFD700" style={styles.sparkle2} />
            <Sparkles size={28} color="#FFD700" style={styles.sparkle3} />
          </Animated.View>

          {/* Checkito Comemorando */}
          <Image 
            source={require('@/assets/images/checkito/checkito_tela4.png')}
            style={styles.checkito}
            resizeMode="contain"
          />

          {/* Badge de Conquista */}
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>🏆</Text>
          </View>

          {/* Mensagem de Parabéns */}
          <Text style={[styles.title, { color: colors.text }]}>
            Parabéns! 🎉
          </Text>
          
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Você completou sua primeira verificação!
          </Text>

          <View style={[styles.messageBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.messageText, { color: colors.text }]}>
              Você deu o primeiro passo para combater a desinformação! Continue verificando notícias e ajude a construir um mundo mais informado. 💪
            </Text>
          </View>

          {/* Botão de Ação */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleClose}
          >
            <Text style={styles.buttonText}>Continuar Verificando!</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: width - 40,
    maxWidth: 400,
    borderRadius: 24,
    borderWidth: 2,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sparklesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkle1: {
    position: 'absolute',
    top: 40,
    left: 30,
  },
  sparkle2: {
    position: 'absolute',
    top: 60,
    right: 40,
  },
  sparkle3: {
    position: 'absolute',
    bottom: 100,
    left: 50,
  },
  checkito: {
    width: 160,
    height: 160,
    marginTop: 20,
    marginBottom: 16,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  badgeText: {
    fontSize: 32,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  messageBox: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    width: '100%',
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
