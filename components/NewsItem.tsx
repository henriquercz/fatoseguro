import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleCheck as CheckCircle, Circle as XCircle, ChevronRight } from 'lucide-react-native';
import { NewsVerification } from '@/types';

interface NewsItemProps {
  news: NewsVerification;
  onPress: (news: NewsVerification) => void;
}

export default function NewsItem({ news, onPress }: NewsItemProps) {
  // Limit text to a certain length
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(news)}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        <View style={styles.statusIconContainer}>
          {news.isTrue ? (
            <CheckCircle size={24} color="#22C55E" />
          ) : (
            <XCircle size={24} color="#EF4444" />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.newsText}>
            {truncateText(news.news_content, 100)}
          </Text>
          <Text style={styles.dateText}>
            {new Date(news.verified_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </Text>
        </View>
        <ChevronRight size={18} color="#6B7280" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // Sombra ajustada
    shadowOpacity: 0.06, // Sombra ajustada
    shadowRadius: 8, // Sombra ajustada
    elevation: 3, // Sombra ajustada para Android
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
    color: '#1F2937',
    marginBottom: 4,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
});