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
          <SkeletonLoader width={20} height={20} borderRadius={10} />
          <SkeletonLoader width={100} height={16} borderRadius={4} style={{ flex: 1 }} />
          <SkeletonLoader width={40} height={24} borderRadius={12} />
        </View>

        {/* Stats Skeleton em linha */}
        <View style={styles.statsGrid}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={[styles.statCard, { backgroundColor: colors.background }]}>
              <SkeletonLoader width={36} height={36} borderRadius={18} style={{ marginBottom: 8 }} />
              <SkeletonLoader width={40} height={20} borderRadius={4} style={{ marginBottom: 2 }} />
              <SkeletonLoader width={70} height={11} borderRadius={4} style={{ marginBottom: 8 }} />
              <SkeletonLoader width="100%" height={4} borderRadius={2} style={{ marginBottom: 6 }} />
              <SkeletonLoader width={35} height={13} borderRadius={4} />
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
        {/* Header Compacto */}
        <View style={styles.header}>
          <BarChart3 size={20} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>Estatísticas</Text>
          <View style={styles.totalBadge}>
            <Text style={[styles.totalNumber, { color: colors.primary }]}>{stats.total}</Text>
          </View>
        </View>

        {/* Estatísticas em Grid Horizontal */}
        <View style={styles.statsGrid}>
          {/* Verdadeiro */}
          <View style={[styles.statCard, { backgroundColor: colors.background }]}>
            <View style={[styles.statIcon, { backgroundColor: '#22C55E20' }]}>
              <CheckCircle size={18} color="#22C55E" />
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
              <XCircle size={18} color="#EF4444" />
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
              <AlertCircle size={18} color="#F59E0B" />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>{stats.indeterminado}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Indetermin.</Text>
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
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  totalBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  totalNumber: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    minWidth: 0,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  statPercentage: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
  },
});
