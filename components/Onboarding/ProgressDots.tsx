/**
 * ProgressDots - Indicador de progresso do onboarding
 * Mostra bolinhas indicando a tela atual
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ProgressDotsProps {
  currentIndex: number;
  totalSlides: number;
}

export default function ProgressDots({ currentIndex, totalSlides }: ProgressDotsProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSlides }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: index === currentIndex ? colors.primary : colors.border,
              width: index === currentIndex ? 24 : 8,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
