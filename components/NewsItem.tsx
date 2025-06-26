import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleCheck as CheckCircle, Circle as XCircle, ChevronRight } from 'lucide-react-native';
import { NewsVerification } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

interface NewsItemProps {
  news: NewsVerification;
  onPress: (news: NewsVerification) => void;
}

export default function NewsItem({ news, onPress }: NewsItemProps) {
  const { colors } = useTheme();
  
  // Limit text to a certain length
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface }]}
      onPress={() => onPress(news)}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        <View style={styles.statusIconContainer}>
          {news.isTrue ? (
            <CheckCircle size={24} color={colors.success || "#22C55E"} />
          ) : (
            <XCircle size={24} color={colors.error || "#EF4444"} />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.newsText, { color: colors.text }]}>
            {truncateText(news.news_content, 100)}
          </Text>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            {new Date(news.verified_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </Text>
        </View>
        <ChevronRight size={18} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  contentContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  statusIconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  newsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    marginBottom: 4,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
});