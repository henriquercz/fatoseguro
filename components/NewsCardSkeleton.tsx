import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonLoader from './SkeletonLoader';
import { useTheme } from '@/contexts/ThemeContext';

export default function NewsCardSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      {/* Imagem */}
      <SkeletonLoader width="100%" height={200} borderRadius={12} style={styles.image} />
      
      {/* Conteúdo */}
      <View style={styles.content}>
        {/* Título */}
        <SkeletonLoader width="100%" height={20} style={styles.title} />
        <SkeletonLoader width="80%" height={20} style={styles.titleSecond} />
        
        {/* Descrição */}
        <SkeletonLoader width="100%" height={14} style={styles.description} />
        <SkeletonLoader width="90%" height={14} style={styles.description} />
        <SkeletonLoader width="60%" height={14} style={styles.description} />
        
        {/* Footer */}
        <View style={styles.footer}>
          <SkeletonLoader width={80} height={12} borderRadius={4} />
          <SkeletonLoader width={100} height={12} borderRadius={4} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    marginBottom: 0,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  titleSecond: {
    marginBottom: 16,
  },
  description: {
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
