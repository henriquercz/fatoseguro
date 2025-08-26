import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity, Animated } from 'react-native';
import { Users, User, Filter } from 'lucide-react-native';
import NewsItem from '@/components/NewsItem';
import KeyboardDismissWrapper from '@/components/KeyboardDismissWrapper';
import { useVerification } from '@/hooks/useVerification';
import VerificationResult from '@/components/VerificationResult';
import { NewsVerification } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

export default function HistoryScreen() {
  const { 
    verifications, 
    loading, 
    error, 
    loadHistory,
    loadCommunityHistory,
    currentVerification, 
    clearCurrentVerification, 
    setViewingVerification 
  } = useVerification();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [filterMode, setFilterMode] = useState<'community' | 'personal'>('community');
  const [slideAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (filterMode === 'community') {
      loadCommunityHistory();
    } else {
      loadHistory();
    }
  }, [filterMode]);

  const handleFilterToggle = (mode: 'community' | 'personal') => {
    if (mode !== filterMode) {
      setFilterMode(mode);
      Animated.timing(slideAnimation, {
        toValue: mode === 'community' ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

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
      <KeyboardDismissWrapper>
        {!currentVerification ? (
          <>
            <View style={styles.header}>
              <Text style={[styles.headerSubtext, { color: colors.textSecondary }]}>
                {filterMode === 'community' 
                  ? 'Confira as notícias verificadas pela comunidade'
                  : 'Suas verificações pessoais'
                }
              </Text>
              
              {user && (
                <View style={[styles.filterContainer, { backgroundColor: colors.surface }]}>
                  <Animated.View 
                    style={[
                      styles.filterSlider,
                      { 
                        backgroundColor: colors.primary,
                        transform: [{
                          translateX: slideAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [2, 102], // Ajustar conforme largura dos botões
                          })
                        }]
                      }
                    ]} 
                  />
                  
                  <TouchableOpacity
                    style={[styles.filterButton, filterMode === 'community' && styles.activeFilterButton]}
                    onPress={() => handleFilterToggle('community')}
                    activeOpacity={0.7}
                  >
                    <Users 
                      size={16} 
                      color={filterMode === 'community' ? colors.surface : colors.textSecondary} 
                    />
                    <Text style={[
                      styles.filterButtonText,
                      { color: filterMode === 'community' ? colors.surface : colors.textSecondary }
                    ]}>
                      Comunidade
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.filterButton, filterMode === 'personal' && styles.activeFilterButton]}
                    onPress={() => handleFilterToggle('personal')}
                    activeOpacity={0.7}
                  >
                    <User 
                      size={16} 
                      color={filterMode === 'personal' ? colors.surface : colors.textSecondary} 
                    />
                    <Text style={[
                      styles.filterButtonText,
                      { color: filterMode === 'personal' ? colors.surface : colors.textSecondary }
                    ]}>
                      Minhas
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
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
                  <Filter size={48} color={colors.textSecondary} style={styles.emptyIcon} />
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    {filterMode === 'community' 
                      ? 'Nenhuma verificação da comunidade encontrada.'
                      : user 
                        ? 'Você ainda não verificou nenhuma notícia.'
                        : 'Faça login para ver seu histórico pessoal.'
                    }
                  </Text>
                  {filterMode === 'personal' && !user && (
                    <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                      Entre na sua conta para acessar suas verificações.
                    </Text>
                  )}
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
    marginBottom: 16,
    // color aplicada via tema
  },
  filterContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 2,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  filterSlider: {
    position: 'absolute',
    top: 2,
    left: 2,
    bottom: 2,
    width: 98,
    borderRadius: 10,
    zIndex: 0,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 6,
    zIndex: 1,
    minWidth: 98,
  },
  activeFilterButton: {
    // Estilo aplicado via animação
  },
  filterButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    // color aplicada dinamicamente
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    // color aplicada via tema
  },
  emptySubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
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