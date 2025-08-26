import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleCheck as CheckCircle, CircleX, CircleHelp, ChevronRight } from 'lucide-react-native';
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
          {news.verification_status === 'VERDADEIRO' ? (
            <View style={[styles.statusIcon, styles.trueIcon]}>
              <CheckCircle size={20} color="#FFFFFF" fill="#22C55E" />
            </View>
          ) : news.verification_status === 'FALSO' ? (
            <View style={[styles.statusIcon, styles.falseIcon]}>
              <CircleX size={20} color="#FFFFFF" fill="#EF4444" />
            </View>
          ) : (
            <View style={[styles.statusIcon, styles.indeterminateIcon]}>
              <CircleHelp size={20} color="#FFFFFF" fill="#F59E0B" />
            </View>
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
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  trueIcon: {
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#16A34A',
  },
  falseIcon: {
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  indeterminateIcon: {
    backgroundColor: '#F59E0B',
    borderWidth: 2,
    borderColor: '#D97706',
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