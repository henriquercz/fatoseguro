/**
 * FloatingTabBar - Menu de navegação moderno e adaptativo
 * Design compacto: apenas ícones nas abas inativas, ícone + título na aba ativa
 * Bordas mais arredondadas e tamanho otimizado
 * 
 * @author CheckNow Team
 * @version 3.0.0
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
import { selectionHaptic } from '@/utils/haptics';

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
    selectionHaptic(); // Feedback háptico ao trocar de aba
    onTabPress(route);
  };

  const renderTab = (tab: TabItem, index: number) => {
    const isActive = activeTab === tab.route;
    const IconComponent = tab.icon;

    return (
      <TouchableOpacity
        key={tab.key}
        style={[
          styles.tabItem,
          isActive ? styles.activeTabItem : styles.inactiveTabItem
        ]}
        onPress={() => handleTabPress(tab.route)}
        activeOpacity={0.7}
      >
        <View style={[
          styles.tabContainer,
          isActive && [
            styles.activeTabContainer,
            {
              backgroundColor: isDarkMode ? colors.primary + '20' : colors.primary + '15',
            }
          ]
        ]}>
          {/* Ícone */}
          <View style={[
            styles.iconContainer,
            isActive && styles.activeIconContainer
          ]}>
            <IconComponent 
              size={isActive ? 22 : 20} 
              color={isActive ? colors.primary : colors.textSecondary}
            />
          </View>

          {/* Texto do título - apenas para aba ativa */}
          {isActive && (
            <Text
              style={[
                styles.tabText,
                {
                  color: colors.primary,
                  fontWeight: '600',
                },
              ]}
            >
              {tab.title}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          bottom: insets.bottom + 12,
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
    left: 24,
    right: 24,
    borderRadius: 32, // Mais arredondado
    borderWidth: 1,
    paddingVertical: 6, // Menor altura
    paddingHorizontal: 12,
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowColor: '#000',
      },
      android: {
        elevation: 6,
      },
    }),
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabItem: {
    flex: 2, // Aba ativa ocupa mais espaço
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveTabItem: {
    flex: 1, // Abas inativas ocupam menos espaço
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 20, // Mais arredondado
    minHeight: 44, // Menor altura
    position: 'relative',
  },
  activeTabContainer: {
    flexDirection: 'row', // Ícone e texto lado a lado
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    minHeight: 44,
    gap: 8, // Espaço entre ícone e texto
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
});
