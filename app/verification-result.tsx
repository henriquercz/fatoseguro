import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import VerificationResult from '@/components/VerificationResult';
import CustomHeader from '@/components/CustomHeader';
import { useVerification } from '@/hooks/useVerification';
import { useTheme } from '@/contexts/ThemeContext';

export default function VerificationResultScreen() {
  const { colors } = useTheme();
  const { currentVerification, clearCurrentVerification } = useVerification();

  const handleClose = () => {
    clearCurrentVerification();
    // Usar o gesto nativo do iOS para voltar
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/history');
    }
  };

  // Usar useEffect para navegação para evitar setState durante render
  useEffect(() => {
    if (!currentVerification) {
      router.replace('/history');
    }
  }, [currentVerification]);

  if (!currentVerification) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader 
        title="Resultado"
        showBackButton={true}
        onBackPress={handleClose}
        showEducationIcon={false}
      />
      <VerificationResult 
        result={currentVerification} 
        onClose={handleClose} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
