/**
 * ====================================
 * TUTORIAL MASCOT
 * Mascote animado "Check" do tutorial
 * ====================================
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';

type MascotEmotion = 'neutral' | 'happy' | 'excited' | 'thinking';

interface TutorialMascotProps {
  /** Emoção do mascote */
  emotion?: MascotEmotion;
  
  /** Tamanho do mascote */
  size?: number;
  
  /** Mostrar balão de fala */
  showSpeechBubble?: boolean;
  
  /** Texto do balão */
  speechText?: string;
}

const MASCOT_FACES = {
  neutral: {
    eyes: '• •',
    mouth: '▽',
    color: '#2563EB'
  },
  happy: {
    eyes: '^ ^',
    mouth: '▼',
    color: '#10B981'
  },
  excited: {
    eyes: '★ ★',
    mouth: 'O',
    color: '#F59E0B'
  },
  thinking: {
    eyes: '◉ ◉',
    mouth: '~',
    color: '#8B5CF6'
  }
};

export function TutorialMascot({
  emotion = 'neutral',
  size = 60,
  showSpeechBubble = false,
  speechText = 'Olá! Sou o Check, seu guia!'
}: TutorialMascotProps) {
  const { colors } = useTheme();
  
  const face = MASCOT_FACES[emotion];
  
  // Animações
  const bounce = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);
  
  useEffect(() => {
    // Animação de flutuação contínua
    bounce.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    
    // Pequena rotação
    rotate.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(5, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);
  
  // Bounce ao mudar de emoção
  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.2, { damping: 5, stiffness: 200 }),
      withSpring(1, { damping: 8, stiffness: 150 })
    );
  }, [emotion]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bounce.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value }
    ],
  }));
  
  return (
    <View style={styles.container}>
      {/* Balão de fala */}
      {showSpeechBubble && (
        <View style={[styles.speechBubble, { backgroundColor: colors.card }]}>
          <Text style={[styles.speechText, { color: colors.text }]}>
            {speechText}
          </Text>
          <View style={[styles.speechTail, { borderTopColor: colors.card }]} />
        </View>
      )}
      
      {/* Mascote */}
      <Animated.View style={[animatedStyle]}>
        <View
          style={[
            styles.mascot,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: face.color
            }
          ]}
        >
          {/* Olhos */}
          <Text style={[styles.eyes, { fontSize: size * 0.25 }]}>
            {face.eyes}
          </Text>
          
          {/* Boca */}
          <Text style={[styles.mouth, { fontSize: size * 0.3 }]}>
            {face.mouth}
          </Text>
        </View>
        
        {/* Sombra */}
        <View style={[styles.shadow, { width: size * 0.8, marginTop: 4 }]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  speechBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  speechText: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  speechTail: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  mascot: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  eyes: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 4,
  },
  mouth: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  shadow: {
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 100,
    transform: [{ scaleX: 1.2 }],
  },
});
