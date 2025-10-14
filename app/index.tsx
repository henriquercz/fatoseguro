import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, SafeAreaView, Alert } from 'react-native';
import { router } from 'expo-router';
import VerifyForm from '@/components/VerifyForm';
import AdDisplay from '@/components/AdDisplay';
import KeyboardDismissWrapper from '@/components/KeyboardDismissWrapper';
import CustomHeader from '@/components/CustomHeader';
import { useVerification } from '@/hooks/useVerification';
import { useTheme } from '@/contexts/ThemeContext';

export default function HomeScreen() {
  const { 
    currentVerification,
    clearCurrentVerification,
    showAd,
    hideAd,
    loading: verificationLoading
  } = useVerification();
  const { colors } = useTheme();

  const [formKey, setFormKey] = useState(0);

  const handleEducationPress = () => {
    router.push('/education');
  };

  // Navegar para tela de resultado quando verificação estiver completa
  useEffect(() => {
    if (currentVerification && !verificationLoading && !showAd) {
      router.push('/verification-result');
    }
  }, [currentVerification, verificationLoading, showAd]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader 
        title="Verificar" 
        onEducationPress={handleEducationPress}
      />
      <KeyboardDismissWrapper>
        <View style={styles.content}>
          <VerifyForm key={formKey} />
          
          <View style={[styles.infoContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>Como funciona:</Text>
            <View style={styles.infoStep}>
              <View style={[styles.infoNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.infoNumberText}>1</Text>
              </View>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>Cole um link ou texto de notícia que deseja verificar</Text>
            </View>
            <View style={styles.infoStep}>
              <View style={[styles.infoNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.infoNumberText}>2</Text>
              </View>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>Nossa IA analisará a informação comparando com fontes confiáveis</Text>
            </View>
            <View style={styles.infoStep}>
              <View style={[styles.infoNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.infoNumberText}>3</Text>
              </View>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>Você receberá uma análise detalhada e saberá se a notícia é verdadeira ou falsa</Text>
            </View>
          </View>
        </View>

        {showAd && (
          <AdDisplay onClose={hideAd} />
        )}
      </KeyboardDismissWrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor aplicada via tema
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    // borderBottomColor e backgroundColor aplicadas via tema
  },
  logo: {
    height: 400,
    width: 160,
  },
  tagline: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 4,
    // color aplicada via tema
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 130, // Espaço para o FloatingTabBar
  },
  infoContainer: {
    marginTop: 32,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    // backgroundColor aplicada via tema
  },
  infoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 16,
    // color aplicada via tema
  },
  infoStep: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  infoNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    // backgroundColor aplicada via tema
  },
  infoNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    flex: 1,
    // color aplicada via tema
  },
});