/**
 * ====================================
 * TUTORIAL SPOTLIGHT
 * Componente que destaca elementos com efeito spotlight
 * ====================================
 */

import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Defs, Mask, Rect, Circle, RadialGradient, Stop } from 'react-native-svg';

interface TutorialSpotlightProps {
  /** Posição X do centro do spotlight */
  x: number;
  
  /** Posição Y do centro do spotlight */
  y: number;
  
  /** Raio do spotlight */
  radius: number;
  
  /** Cor da borda */
  borderColor?: string;
  
  /** Largura da borda */
  borderWidth?: number;
  
  /** Mostrar animação de pulso */
  showPulse?: boolean;
}

export function TutorialSpotlight({
  x,
  y,
  radius,
  borderColor = '#2563EB',
  borderWidth = 3,
  showPulse = true
}: TutorialSpotlightProps) {
  // Animação de pulso
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  useEffect(() => {
    if (showPulse) {
      // Animação de pulso infinita
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1, // Infinito
        false
      );
      
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        false
      );
    }
  }, [showPulse]);
  
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  
  return (
    <>
      {/* Círculo de destaque animado */}
      <Animated.View
        style={[
          styles.spotlightCircle,
          {
            left: x - radius,
            top: y - radius,
            width: radius * 2,
            height: radius * 2,
            borderRadius: radius,
            borderColor,
            borderWidth,
          },
          pulseStyle
        ]}
      />
      
      {/* Glow effect (círculo maior semi-transparente) */}
      <Animated.View
        style={[
          styles.glowCircle,
          {
            left: x - radius - 10,
            top: y - radius - 10,
            width: radius * 2 + 20,
            height: radius * 2 + 20,
            borderRadius: radius + 10,
            borderColor: borderColor,
            borderWidth: 1,
            opacity: 0.3,
          },
          pulseStyle
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  spotlightCircle: {
    position: 'absolute',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  glowCircle: {
    position: 'absolute',
  },
});
