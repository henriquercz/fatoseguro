import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import NewsItem from '@/components/NewsItem';
import { useVerification } from '@/hooks/useVerification';
import VerificationResult from '@/components/VerificationResult';
import { NewsVerification } from '@/types';

export default function HistoryScreen() {
  const { 
    verifications, 
    loading, 
    error, 
    loadHistory,
    currentVerification, 
    clearCurrentVerification, 
    setViewingVerification 
  } = useVerification();

  useEffect(() => {
    loadHistory();
  }, []);

  // Ensure verifications is always an array for safe access
  const safeVerifications = Array.isArray(verifications) ? verifications : [];

  const handleNewsPress = (newsItem: NewsVerification) => {
    setViewingVerification(newsItem);
    // Assuming navigation to the result display (e.g., home screen) is handled by the global state change
    // or you might need to add router.push('/') or similar here if using expo-router
    // For now, let's assume the context update triggers the UI change elsewhere.
  };

  if (loading && safeVerifications.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Carregando histórico...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!currentVerification ? (
        <>
          <View style={styles.header}>
            {/* <Text style={styles.headerText}>Verificações Recentes</Text> -- Título principal já vem do _layout.tsx */}
            <Text style={styles.headerSubtext}>
              Confira as notícias verificadas pela comunidade
            </Text>
          </View>

          <FlatList
            data={safeVerifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NewsItem news={item} onPress={handleNewsPress} />
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Nenhuma notícia verificada ainda.
                </Text>
              </View>
            }
          />
        </>
      ) : (
        <VerificationResult 
          result={currentVerification} 
          onClose={clearCurrentVerification} 
        />
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
    paddingHorizontal: 16,
    paddingTop: 16, 
    paddingBottom: 8, // Reduzido para melhor fluxo com a lista
    // backgroundColor: '#FFFFFF', // Removido
    // borderBottomWidth: 1, // Removido
    // borderBottomColor: '#E5E7EB', // Removido
  },
  headerText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#111827',
    // marginBottom: 4, // Estilo não mais usado diretamente aqui
  },
  headerSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
});