import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart3, CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import SkeletonLoader from './SkeletonLoader';
import AnimatedView from './AnimatedView';

interface StatsData {
  total: number;
  verdadeiro: number;
  falso: number;
  indeterminado: number;
}

export default function UserStats() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Buscar todas as verificações do usuário
      const { data, error } = await supabase
        .from('verifications')
        .select('verification_status')
        .eq('user_id', user?.id || '');

      if (error) throw error;

      // Calcular estatísticas
      const verifications = (data || []) as Array<{ verification_status: string }>;
      const statsData: StatsData = {
        total: verifications.length,
        verdadeiro: verifications.filter(v => v.verification_status === 'VERDADEIRO').length,
        falso: verifications.filter(v => v.verification_status === 'FALSO').length,
        indeterminado: verifications.filter(v => v.verification_status === 'INDETERMINADO').length,
      };

      setStats(statsData);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        {/* Header Skeleton */}
        <View style={styles.header}>
          <SkeletonLoader width={24} height={24} borderRadius={12} />
          <SkeletonLoader width={150} height={20} borderRadius={4} />
        </View>

        {/* Total Skeleton */}
        <View style={styles.totalCard}>
          <SkeletonLoader width={80} height={48} borderRadius={8} style={{ marginBottom: 8 }} />
          <SkeletonLoader width={180} height={14} borderRadius={4} />
        </View>

        {/* Stats Skeleton */}
        <View style={styles.statsGrid}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={[styles.statCard, { backgroundColor: colors.background }]}>
              <SkeletonLoader width={48} height={48} borderRadius={24} style={{ marginBottom: 12 }} />
              <SkeletonLoader width={60} height={32} borderRadius={4} style={{ marginBottom: 4 }} />
              <SkeletonLoader width={100} height={14} borderRadius={4} style={{ marginBottom: 12 }} />
              <SkeletonLoader width="100%" height={6} borderRadius={3} style={{ marginBottom: 8 }} />
              <SkeletonLoader width={50} height={16} borderRadius={4} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (!stats) {
    return null;
  }

  const getPercentage = (value: number) => {
    if (stats.total === 0) return 0;
    return Math.round((value / stats.total) * 100);
  };

  return (
    <AnimatedView type="slideUp" duration={400}>
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Header */}
      <View style={styles.header}>
        <BarChart3 size={24} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>Suas Estatísticas</Text>
      </View>

      {/* Total de Verificações */}
      <View style={styles.totalCard}>
        <Text style={[styles.totalNumber, { color: colors.primary }]}>{stats.total}</Text>
        <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>
          {stats.total === 1 ? 'Verificação realizada' : 'Verificações realizadas'}
        </Text>
      </View>

      {/* Estatísticas por Status */}
      <View style={styles.statsGrid}>
        {/* Verdadeiro */}
        <View style={[styles.statCard, { backgroundColor: colors.background }]}>
          <View style={[styles.statIcon, { backgroundColor: '#22C55E20' }]}>
            <CheckCircle size={24} color="#22C55E" />
          </View>
          <Text style={[styles.statNumber, { color: colors.text }]}>{stats.verdadeiro}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Verdadeiras</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: '#22C55E',
                  width: `${getPercentage(stats.verdadeiro)}%`
                }
              ]} 
            />
          </View>
          <Text style={[styles.statPercentage, { color: '#22C55E' }]}>
            {getPercentage(stats.verdadeiro)}%
          </Text>
        </View>

        {/* Falso */}
        <View style={[styles.statCard, { backgroundColor: colors.background }]}>
          <View style={[styles.statIcon, { backgroundColor: '#EF444420' }]}>
            <XCircle size={24} color="#EF4444" />
          </View>
          <Text style={[styles.statNumber, { color: colors.text }]}>{stats.falso}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Falsas</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: '#EF4444',
                  width: `${getPercentage(stats.falso)}%`
                }
              ]} 
            />
          </View>
          <Text style={[styles.statPercentage, { color: '#EF4444' }]}>
            {getPercentage(stats.falso)}%
          </Text>
        </View>

        {/* Indeterminado */}
        <View style={[styles.statCard, { backgroundColor: colors.background }]}>
          <View style={[styles.statIcon, { backgroundColor: '#F59E0B20' }]}>
            <AlertCircle size={24} color="#F59E0B" />
          </View>
          <Text style={[styles.statNumber, { color: colors.text }]}>{stats.indeterminado}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Indeterminadas</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: '#F59E0B',
                  width: `${getPercentage(stats.indeterminado)}%`
                }
              ]} 
            />
          </View>
          <Text style={[styles.statPercentage, { color: '#F59E0B' }]}>
            {getPercentage(stats.indeterminado)}%
          </Text>
        </View>
      </View>
      </View>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  totalCard: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
  },
  totalNumber: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 12,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  statPercentage: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
