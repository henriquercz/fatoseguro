/**
 * ProgressDots - DEPRECATED
 * Dots agora estão integrados no OnboardingScreen
 * Este arquivo existe apenas para compatibilidade
 */

import React from 'react';
import { View } from 'react-native';

interface ProgressDotsProps {
  currentIndex: number;
  totalSlides: number;
}

export default function ProgressDots({ currentIndex, totalSlides }: ProgressDotsProps) {
  return <View />;
}
