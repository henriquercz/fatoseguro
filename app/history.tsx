import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import NewsItem from '@/components/NewsItem';
import { useVerification } from '@/hooks/useVerification';
import VerificationResult from '@/components/VerificationResult';
import { NewsVerification } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { colors } = useTheme();

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
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Carregando histórico...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {!currentVerification ? (
        <>
          <View style={styles.header}>
            {/* <Text style={styles.headerText}>Verificações Recentes</Text> -- Título principal já vem do _layout.tsx */}
            <Text style={[styles.headerSubtext, { color: colors.textSecondary }]}>
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
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
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
    // backgroundColor aplicada via tema
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16, 
    paddingBottom: 8,
  },
  headerText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    // color aplicada via tema
  },
  headerSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    // color aplicada via tema
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
    textAlign: 'center',
    // color aplicada via tema
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor aplicada via tema
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginTop: 16,
    // color aplicada via tema
  },
});