/**
 * CustomHeader - Header moderno com logo, título e elementos contextuais
 * Design limpo e profissional para o Check Now
 * 
 * @author CheckNow Team
 * @version 1.0.0
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Crown, Zap } from 'lucide-react-native';

interface CustomHeaderProps {
  title: string;
  showEducationIcon?: boolean;
  onEducationPress?: () => void;
}

export default function CustomHeader({ 
  title, 
  showEducationIcon = true, 
  onEducationPress 
}: CustomHeaderProps) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: colors.surface,
        borderBottomColor: colors.border,
        paddingTop: insets.top,
        // paddingTop: 16, esse pro meui ios
      }
    ]}>
      <View style={styles.content}>
        {/* Logo + Nome do App */}
        <View style={styles.leftSection}>
          <Image
            source={require('@/assets/images/logozinha.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.appName, { color: colors.text }]}>
            Check Now
          </Text>
          <Text style={[styles.separator, { color: colors.textSecondary }]}>
            •
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>
            {title}
          </Text>
        </View>

        {/* Seção Direita */}
        <View style={styles.rightSection}>
          {/* Badge Premium/Free */}
          {user && (
            <View style={[
              styles.badge,
              {
                backgroundColor: user.isPremium 
                  ? colors.primary + '20' 
                  : colors.textSecondary + '15',
              }
            ]}>
              {user.isPremium ? (
                <Crown size={12} color={colors.primary} />
              ) : (
                <Zap size={12} color={colors.textSecondary} />
              )}
              <Text style={[
                styles.badgeText,
                {
                  color: user.isPremium ? colors.primary : colors.textSecondary,
                }
              ]}>
                {user.isPremium ? 'Premium' : 'Free'}
              </Text>
            </View>
          )}

          {/* Ícone Educativo */}
          {showEducationIcon && (
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors.primary + '15' }]}
              onPress={onEducationPress}
              activeOpacity={0.7}
            >
              <BookOpen size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  appName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    letterSpacing: -0.5,
  },
  separator: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginHorizontal: 8,
    opacity: 0.6,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    letterSpacing: -0.3,
    opacity: 0.8,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    letterSpacing: -0.1,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
