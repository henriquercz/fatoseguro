import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VerificationResult from '@/components/VerificationResult';
import CustomHeader from '@/components/CustomHeader';
import FirstVerificationModal from '@/components/FirstVerificationModal';
import { useVerification } from '@/hooks/useVerification';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const FIRST_VERIFICATION_KEY = '@CheckNow:firstVerification';

export default function VerificationResultScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { currentVerification, clearCurrentVerification } = useVerification();
  const [showFirstVerificationModal, setShowFirstVerificationModal] = useState(false);

  // Verificar se é a primeira verificação
  useEffect(() => {
    const checkFirstVerification = async () => {
      if (currentVerification && user) {
        try {
          const hasVerified = await AsyncStorage.getItem(`${FIRST_VERIFICATION_KEY}_${user.id}`);
          if (!hasVerified) {
            // É a primeira verificação!
            setShowFirstVerificationModal(true);
            await AsyncStorage.setItem(`${FIRST_VERIFICATION_KEY}_${user.id}`, 'true');
          }
        } catch (error) {
          console.error('Erro ao verificar primeira verificação:', error);
        }
      }
    };

    checkFirstVerification();
  }, [currentVerification, user]);

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
      
      {/* Modal de Primeira Verificação */}
      <FirstVerificationModal
        visible={showFirstVerificationModal}
        onClose={() => setShowFirstVerificationModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
