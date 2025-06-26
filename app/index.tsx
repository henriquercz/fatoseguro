import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, SafeAreaView } from 'react-native';
import VerifyForm from '@/components/VerifyForm';
import VerificationResult from '@/components/VerificationResult';
import AdDisplay from '@/components/AdDisplay';
import { useVerification } from '@/hooks/useVerification';
import { useTheme } from '@/contexts/ThemeContext';

export default function HomeScreen() {
  const { 
    currentVerification,
    clearCurrentVerification,
    showAd,
    hideAd
  } = useVerification();
  const { colors } = useTheme();

  const [formKey, setFormKey] = useState(0);

  const handleCloseResult = () => {
    clearCurrentVerification();
    setFormKey(prevKey => prevKey + 1); // Increment key to force VerifyForm remount
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

      {!currentVerification && (
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
      )}

      {currentVerification && !showAd && (
        <VerificationResult 
          result={currentVerification}
          onClose={handleCloseResult} // Use the new handler
        />
      )}

      {showAd && (
        <AdDisplay onClose={hideAd} />
      )}
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