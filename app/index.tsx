import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, SafeAreaView } from 'react-native';
import VerifyForm from '@/components/VerifyForm';
import VerificationResult from '@/components/VerificationResult';
import AdDisplay from '@/components/AdDisplay';
import { useVerification } from '@/hooks/useVerification';

export default function HomeScreen() {
  const { 
    currentVerification,
    clearCurrentVerification,
    showAd,
    hideAd
  } = useVerification();

  const [formKey, setFormKey] = useState(0);

  const handleCloseResult = () => {
    clearCurrentVerification();
    setFormKey(prevKey => prevKey + 1); // Increment key to force VerifyForm remount
  };

  return (
    <SafeAreaView style={styles.container}>

      {!currentVerification && (
        <View style={styles.content}>
          <VerifyForm key={formKey} />
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Como funciona:</Text>
            <View style={styles.infoStep}>
              <View style={styles.infoNumber}>
                <Text style={styles.infoNumberText}>1</Text>
              </View>
              <Text style={styles.infoText}>Cole um link ou texto de notícia que deseja verificar</Text>
            </View>
            <View style={styles.infoStep}>
              <View style={styles.infoNumber}>
                <Text style={styles.infoNumberText}>2</Text>
              </View>
              <Text style={styles.infoText}>Nossa IA analisará a informação comparando com fontes confiáveis</Text>
            </View>
            <View style={styles.infoStep}>
              <View style={styles.infoNumber}>
                <Text style={styles.infoNumberText}>3</Text>
              </View>
              <Text style={styles.infoText}>Você receberá uma análise detalhada e saberá se a notícia é verdadeira ou falsa</Text>
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
    backgroundColor: '#F9FAFB',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    height: 400,
    width: 160,
  },
  tagline: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoContainer: {
    marginTop: 32,
    padding: 20, // Aumentado o padding interno
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // Sombra ajustada
    shadowOpacity: 0.06, // Sombra ajustada
    shadowRadius: 8, // Sombra ajustada
    elevation: 3, // Sombra ajustada para Android
  },
  infoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 16,
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
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
});