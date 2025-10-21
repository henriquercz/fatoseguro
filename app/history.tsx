import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity, Animated, SectionList, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { Users, User, Filter, Plus } from 'lucide-react-native';
import NewsItem from '@/components/NewsItem';
import KeyboardDismissWrapper from '@/components/KeyboardDismissWrapper';
import CustomHeader from '@/components/CustomHeader';
import { useVerification } from '@/hooks/useVerification';
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setCurrentPage(0);
    setHasMoreData(true);
    if (filterMode === 'community') {
      loadCommunityHistory(0, true);
    } else {
      loadHistory();
    }
  }, [filterMode]);

  const handleFilterToggle = useCallback((mode: 'community' | 'personal') => {
    if (mode !== filterMode) {
      setFilterMode(mode);
      Animated.timing(slideAnimation, {
        toValue: mode === 'community' ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [filterMode, slideAnimation]);

  const loadMoreData = useCallback(async () => {
    if (loadingMore || !hasMoreData || filterMode !== 'community') return;
    
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    const newData = await loadCommunityHistory(nextPage, false);
    
    if (!newData || newData.length === 0) {
      setHasMoreData(false);
    } else {
      setCurrentPage(nextPage);
    }
    setLoadingMore(false);
  }, [loadingMore, hasMoreData, filterMode, currentPage, loadCommunityHistory]);

  // Ensure verifications is always an array for safe access
  const safeVerifications = Array.isArray(verifications) ? verifications : [];

  // Group verifications by date
  const groupedVerifications = useMemo(() => {
    const groups: { [key: string]: NewsVerification[] } = {};
    
    safeVerifications.forEach(verification => {
      const date = new Date(verification.verified_at);
      const dateKey = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(verification);
    });
    
    // Convert to sections array and sort by date (newest first)
    return Object.entries(groups)
      .map(([date, data]) => ({ title: date, data }))
      .sort((a, b) => {
        const dateA = new Date(a.data[0].verified_at);
        const dateB = new Date(b.data[0].verified_at);
        return dateB.getTime() - dateA.getTime();
      });
  }, [safeVerifications]);

  const handleNewsPress = useCallback((newsItem: NewsVerification) => {
    setViewingVerification(newsItem);
    router.push('/verification-result');
  }, [setViewingVerification]);

  const renderSectionHeader = useCallback(({ section }: { section: { title: string } }) => (
    <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
      <Text style={[styles.sectionHeaderText, { color: colors.text }]}>
        {section.title}
      </Text>
    </View>
  ), [colors]);

  const renderNewsItem = useCallback(({ item }: { item: NewsVerification }) => (
    <NewsItem news={item} onPress={handleNewsPress} />
  ), [handleNewsPress]);

  const renderLoadMoreButton = useCallback(() => {
    if (filterMode !== 'community' || !hasMoreData) return null;
    
    return (
      <TouchableOpacity 
        style={[styles.loadMoreButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={loadMoreData}
        disabled={loadingMore}
      >
        {loadingMore ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Plus size={20} color={colors.primary} />
        )}
        <Text style={[styles.loadMoreText, { color: colors.primary }]}>
          {loadingMore ? 'Carregando...' : 'Ver mais verificações'}
        </Text>
      </TouchableOpacity>
    );
  }, [filterMode, hasMoreData, loadingMore, colors, loadMoreData]);

  const handleEducationPress = () => {
    router.push('/education');
  };

  if (loading && safeVerifications.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <CustomHeader 
          title="Histórico" 
          onEducationPress={handleEducationPress}
        />
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Carregando histórico...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader 
        title="Histórico" 
        onEducationPress={handleEducationPress}
      />
      <KeyboardDismissWrapper>
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
                        outputRange: [4, 150], // Usar valor fixo para evitar erro de tipo
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

        <SectionList
          sections={groupedVerifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNewsItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              {filterMode === 'personal' && user ? (
                // Checkito Confuso para histórico pessoal vazio
                <>
                  <Image 
                    source={require('@/assets/images/checkito/checkito_confuso.png')}
                    style={styles.checkitoEmpty}
                    resizeMode="contain"
                  />
                  <View style={[styles.messageBalloon, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={[styles.balloonTail, { borderTopColor: colors.surface }]} />
                    <Text style={[styles.balloonText, { color: colors.text }]}>
                      Você ainda não fez nenhuma verificação
                    </Text>
                  </View>
                  <Text style={[styles.emptySubtext, { color: colors.textSecondary, marginTop: 16 }]}>
                    Comece agora a verificar notícias e combater a desinformação!
                  </Text>
                </>
              ) : (
                // Empty state padrão para outros casos
                <>
                  <Filter size={48} color={colors.textSecondary} style={styles.emptyIcon} />
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    {filterMode === 'community' 
                      ? 'Nenhuma verificação da comunidade encontrada.'
                      : 'Faça login para ver seu histórico pessoal.'
                    }
                  </Text>
                  {filterMode === 'personal' && !user && (
                    <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                      Entre na sua conta para acessar suas verificações.
                    </Text>
                  )}
                </>
              )}
            </View>
          }
          ListFooterComponent={renderLoadMoreButton}
        />
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
    padding: 4,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignSelf: 'center',
    width: '80%',
  },
  filterSlider: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
    width: '48%',
    borderRadius: 8,
    zIndex: 0,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    zIndex: 1,
    flex: 1,
  },
  activeFilterButton: {
    // Estilo aplicado via animação
  },
  filterButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    // color aplicada dinamicamente
  },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionHeaderText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    opacity: 0.8,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  loadMoreText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    paddingBottom: 110, // Espaço para o FloatingTabBar
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  checkitoEmpty: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  messageBalloon: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 2,
    position: 'relative',
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  balloonTail: {
    position: 'absolute',
    top: -8,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  balloonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
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