import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import KeyboardDismissWrapper from '@/components/KeyboardDismissWrapper';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useVerification } from '@/contexts/VerificationContext';
import { gnewsService, ProcessedNews } from '@/lib/gnews';
import { router } from 'expo-router';
import { Newspaper, Clock, ExternalLink, Search, Filter, TrendingUp, Share2, Bookmark, BookmarkCheck } from 'lucide-react-native';

const categories = [
  { id: 'all', name: 'Todas', icon: '📰' },
  { id: 'Política', name: 'Política', icon: '🏛️' },
  { id: 'Economia', name: 'Economia', icon: '💰' },
  { id: 'Tecnologia', name: 'Tecnologia', icon: '💻' },
  { id: 'Saúde', name: 'Saúde', icon: '🏥' },
  { id: 'Esportes', name: 'Esportes', icon: '⚽' },
  { id: 'Cultura', name: 'Cultura', icon: '🎭' },
];

export default function NewsScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { verifyNews: verifyNewsContext, verificationCount, loading: verificationLoading } = useVerification();
  const [news, setNews] = useState<ProcessedNews[]>([]);
  const [filteredNews, setFilteredNews] = useState<ProcessedNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [bookmarkedNews, setBookmarkedNews] = useState<Set<string>>(new Set());

  const loadNews = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);
      
      setError(null);
      
      const headlines = await gnewsService.getTopHeadlines(30);
      
      if (headlines.length === 0) {
        setError('Nenhuma notícia encontrada. Verifique sua conexão com a internet.');
        return;
      }
      
      setNews(headlines);
      setFilteredNews(headlines);
      
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
      setError('Erro ao carregar notícias. Tente novamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterByCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    if (categoryId === 'all') {
      setFilteredNews(news);
    } else {
      const filtered = news.filter(item => item.category === categoryId);
      setFilteredNews(filtered);
    }
  };

  const openNewsUrl = async (url: string, title: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o link da notícia.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao tentar abrir a notícia.');
    }
  };

  const shareNews = async (newsItem: ProcessedNews) => {
    try {
      await Share.share({
        message: `${newsItem.title}\n\n${newsItem.description}\n\nFonte: ${newsItem.source}\n${newsItem.url}`,
        url: newsItem.url,
        title: newsItem.title,
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar a notícia.');
    }
  };

  const toggleBookmark = (newsId: string) => {
    setBookmarkedNews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(newsId)) {
        newSet.delete(newsId);
      } else {
        newSet.add(newsId);
      }
      return newSet;
    });
  };

  const handleVerifyNews = async (newsItem: ProcessedNews) => {
    // Verifica se o usuário tem verificações disponíveis
    if (!user?.isPremium && verificationCount !== null && verificationCount <= 0) {
      Alert.alert(
        'Limite Atingido',
        'Você atingiu o limite de verificações gratuitas por hoje. Faça login ou assine o plano premium para verificações ilimitadas.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Verificar Notícia',
      `Deseja verificar a veracidade desta notícia?\n\n"${newsItem.title}"`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Verificar',
          onPress: async () => {
            try {
              // Usa o URL se disponível, senão usa o título
              const newsToVerify = newsItem.url || newsItem.title;
              const verificationType = newsItem.url ? 'link' : 'text';
              
              await verifyNewsContext(newsToVerify, verificationType);
              
              // Navega para a tela principal onde o resultado será exibido
              router.push('/');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível verificar a notícia. Tente novamente.');
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    loadNews();
  }, []);

  const renderNewsItem = ({ item }: { item: ProcessedNews }) => (
    <TouchableOpacity
      style={[styles.newsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => openNewsUrl(item.url, item.title)}
      activeOpacity={0.8}
    >
      <View style={styles.newsContent}>
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.newsImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.newsImagePlaceholder, { backgroundColor: colors.border }]}>
            <Newspaper size={32} color={colors.textSecondary} />
          </View>
        )}
        
        <View style={styles.newsInfo}>
          <View style={styles.newsHeader}>
            <View style={[styles.categoryBadge, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.categoryText, { color: colors.primary }]}>
                {item.category}
              </Text>
            </View>
            {item.isRecent && (
              <View style={[styles.recentBadge, { backgroundColor: colors.success || colors.primary }]}>
                <Text style={[styles.recentText, { color: colors.surface }]}>
                  Recente
                </Text>
              </View>
            )}
          </View>
          
          <Text style={[styles.newsTitle, { color: colors.text }]} numberOfLines={3}>
            {item.title}
          </Text>
          
          <Text style={[styles.newsDescription, { color: colors.textSecondary }]} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.newsFooter}>
            <View style={styles.sourceInfo}>
              <Text style={[styles.sourceText, { color: colors.textSecondary }]}>
                {item.source}
              </Text>
              <View style={styles.timeContainer}>
                <Clock size={12} color={colors.textSecondary} />
                <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                  {item.timeAgo}
                </Text>
              </View>
            </View>
            
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.primary + '15' }]}
                onPress={() => handleVerifyNews(item)}
              >
                <Search size={16} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.primary }]}>
                  Verificar
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.border }]}
                onPress={() => shareNews(item)}
              >
                <Share2 size={16} color={colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.border }]}
                onPress={() => toggleBookmark(item.id)}
              >
                {bookmarkedNews.has(item.id) ? (
                  <BookmarkCheck size={16} color={colors.primary} />
                ) : (
                  <Bookmark size={16} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.border }]}
                onPress={() => openNewsUrl(item.url, item.title)}
              >
                <ExternalLink size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoriesContainer}
      contentContainerStyle={styles.categoriesContent}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryButton,
            {
              backgroundColor: selectedCategory === category.id ? colors.primary : colors.surface,
              borderColor: colors.border,
            }
          ]}
          onPress={() => filterByCategory(category.id)}
        >
          <Text style={styles.categoryEmoji}>{category.icon}</Text>
          <Text
            style={[
              styles.categoryButtonText,
              {
                color: selectedCategory === category.id ? colors.surface : colors.text,
              }
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Carregando notícias...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Newspaper size={64} color={colors.textSecondary} />
          <Text style={[styles.errorTitle, { color: colors.text }]}>
            Ops! Algo deu errado
          </Text>
          <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => loadNews()}
          >
            <Text style={[styles.retryButtonText, { color: colors.surface }]}>
              Tentar Novamente
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardDismissWrapper>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTitle}>
              <TrendingUp size={24} color={colors.primary} />
              <Text style={[styles.title, { color: colors.text }]}>
                Notícias em Destaque
              </Text>
            </View>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {filteredNews.length} notícias • Brasil
            </Text>
          </View>
        </View>

        {renderCategoryFilter()}

        <FlatList
          data={filteredNews}
          renderItem={renderNewsItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.newsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadNews(true)}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Filter size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                Nenhuma notícia encontrada
              </Text>
              <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
                Tente selecionar uma categoria diferente
              </Text>
            </View>
          }
        />
      </KeyboardDismissWrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerContent: {
    gap: 4,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginLeft: 34,
    opacity: 0.7,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    minHeight: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    letterSpacing: -0.2,
  },
  newsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 4,
  },
  newsCard: {
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  newsContent: {
    padding: 16,
  },
  newsImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  newsImagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsInfo: {
    gap: 8,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    letterSpacing: -0.1,
  },
  recentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  recentText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    letterSpacing: 0.2,
  },
  newsTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  newsDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: 4,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
    gap: 12,
  },
  sourceInfo: {
    flex: 1,
    gap: 4,
  },
  sourceText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    opacity: 0.7,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    opacity: 0.6,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    flexShrink: 0,
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    minHeight: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    letterSpacing: -0.1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  errorTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    textAlign: 'center',
  },
  errorMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 6,
  },
  retryButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    letterSpacing: -0.2,
  },
  emptyMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },
});
