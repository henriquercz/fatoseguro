import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonLoader from './SkeletonLoader';
import { useTheme } from '@/contexts/ThemeContext';

export default function HistoryCardSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      {/* Status Badge */}
      <SkeletonLoader width={100} height={24} borderRadius={12} style={styles.badge} />
      
      {/* Título */}
      <SkeletonLoader width="100%" height={18} style={styles.title} />
      <SkeletonLoader width="70%" height={18} style={styles.titleSecond} />
      
      {/* Resumo */}
      <SkeletonLoader width="100%" height={14} style={styles.summary} />
      <SkeletonLoader width="90%" height={14} style={styles.summary} />
      
      {/* Footer */}
      <View style={styles.footer}>
        <SkeletonLoader width={120} height={12} borderRadius={4} />
        <SkeletonLoader width={80} height={12} borderRadius={4} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badge: {
    marginBottom: 12,
  },
  title: {
    marginBottom: 6,
  },
  titleSecond: {
    marginBottom: 12,
  },
  summary: {
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
});
