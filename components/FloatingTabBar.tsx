/**
 * FloatingTabBar - Menu de navegação simples e funcional
 * Design limpo adaptado à paleta do app
 * 
 * @author CheckNow Team
 * @version 2.0.0
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { ShieldCheck, History, User, Newspaper } from 'lucide-react-native';

interface TabItem {
  key: string;
  title: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  route: string;
}

interface FloatingTabBarProps {
  activeTab: string;
  onTabPress: (route: string) => void;
}

const tabs: TabItem[] = [
  {
    key: 'verify',
    title: 'Verificar',
    icon: ShieldCheck,
    route: 'index',
  },
  {
    key: 'history',
    title: 'Histórico',
    icon: History,
    route: 'history',
  },
  {
    key: 'news',
    title: 'Notícias',
    icon: Newspaper,
    route: 'news',
  },
  {
    key: 'account',
    title: 'Conta',
    icon: User,
    route: 'account',
  },
];

export default function FloatingTabBar({ activeTab, onTabPress }: FloatingTabBarProps) {
  const { colors, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();

  const handleTabPress = (route: string) => {
    console.log('🎯 FloatingTabBar: Clique na aba', route);
    onTabPress(route);
  };

  const renderTab = (tab: TabItem, index: number) => {
    const isActive = activeTab === tab.route;
    const IconComponent = tab.icon;

    return (
      <TouchableOpacity
        key={tab.key}
        style={styles.tabItem}
        onPress={() => handleTabPress(tab.route)}
        activeOpacity={0.6}
      >
        <View style={[
          styles.tabContainer,
          isActive && {
            backgroundColor: isDarkMode ? colors.primary + '20' : colors.primary + '15',
          }
        ]}>
          {/* Indicador da aba ativa */}
          {isActive && (
            <View 
              style={[
                styles.activeIndicator,
                { backgroundColor: colors.primary }
              ]} 
            />
          )}

          {/* Ícone */}
          <View style={styles.iconContainer}>
            <IconComponent 
              size={24} 
              color={isActive ? colors.primary : colors.textSecondary}
            />
          </View>

          {/* Texto do título */}
          <Text
            style={[
              styles.tabText,
              {
                color: isActive ? colors.primary : colors.textSecondary,
                fontWeight: isActive ? '600' : '500',
              },
            ]}
          >
            {tab.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          bottom: insets.bottom + 16,
          backgroundColor: isDarkMode ? colors.surface : colors.background,
          borderColor: isDarkMode ? colors.border : colors.primary + '20',
        },
      ]}
    >
      {/* Container das abas */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab, index) => renderTab(tab, index))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    borderRadius: 24,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowColor: '#000',
      },
      android: {
        elevation: 4,
      },
    }),
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    minHeight: 56,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -12,
    width: 24,
    height: 3,
    borderRadius: 2,
  },
  iconContainer: {
    marginBottom: 4,
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
});
