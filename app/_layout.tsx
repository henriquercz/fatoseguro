import React, { useEffect } from 'react';
import { Platform, Image, ActivityIndicator, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ShieldCheck, History, User as UserIconLucide, Newspaper } from 'lucide-react-native';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { VerificationProvider } from '@/contexts/VerificationContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import AuthForm from '@/components/AuthForm';
import EmailConfirmationScreen from '@/components/EmailConfirmationScreen';
import FloatingTabBar from '@/components/FloatingTabBar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

function RootLayoutNav() {
  const { user, loading: authLoading, pendingEmailConfirmation } = useAuth(); // Corrigido: isLoading para loading
  const { colors } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded && Platform.OS !== 'web') {
      SplashScreen.hideAsync().catch(() => {
        /* reloading the app might trigger some race conditions, ignore them */
      });
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if ((fontsLoaded || authLoading === false) && Platform.OS !== 'web') {
      SplashScreen.hideAsync().catch(() => {
        /* reloading the app might trigger some race conditions, ignore them */
      });
    }
  }, [fontsLoaded, authLoading]);

  if (!fontsLoaded || authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Se há um email aguardando confirmação, mostra a tela de confirmação
  if (pendingEmailConfirmation) {
    return <EmailConfirmationScreen email={pendingEmailConfirmation} />;
  }

  if (!user) {
    // Tela de Autenticação para usuários não logados
    return (
      <SafeAreaView style={[styles.authContainer, { backgroundColor: colors.background }]}>
        <AuthForm />
      </SafeAreaView>
    );
  }

  // Função para lidar com navegação do FloatingTabBar
  const handleTabPress = (route: string) => {
    console.log('🔄 Navegando para:', route);
    try {
      if (route === 'index') {
        router.replace('/');
      } else {
        router.replace(`/${route}` as any);
      }
    } catch (error) {
      console.error('❌ Erro na navegação:', error);
    }
  };

  // Determina a aba ativa baseada no pathname
  const getActiveTab = () => {
    if (pathname === '/') return 'index';
    if (pathname.startsWith('/history')) return 'history';
    if (pathname.startsWith('/news')) return 'news';
    if (pathname.startsWith('/account')) return 'account';
    return 'index';
  };

  // Verifica se deve mostrar o FloatingTabBar
  const shouldShowFloatingTabBar = () => {
    return !pathname.startsWith('/education');
  };

  // Usuário logado, mostra as abas principais com FloatingTabBar customizado
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarStyle: { display: 'none' }, // Esconde a tab bar padrão
          headerShown: false, // Desabilita header padrão para usar CustomHeader
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Verificar',
            headerTitle: 'Verificar',
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'Histórico',
            headerTitle: 'Histórico de Verificações',
          }}
        />
        <Tabs.Screen
          name="news"
          options={{
            title: 'Notícias',
            headerTitle: 'Notícias em Destaque',
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: 'Conta',
            headerTitle: 'Minha Conta',
          }}
        />
        <Tabs.Screen
          name="home"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="+not-found"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="education"
          options={{
            href: null,
          }}
        />
      </Tabs>
      
      {/* FloatingTabBar customizado - oculto na tela de educação */}
      {shouldShowFloatingTabBar() && (
        <FloatingTabBar
          activeTab={getActiveTab()}
          onTabPress={handleTabPress}
        />
      )}
    </View>
  );
}

export default function AppLayout() {
  useFrameworkReady(); // Mantém o hook de inicialização do framework aqui se necessário globalmente

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <VerificationProvider>
            <RootLayoutNav />
            {/* A StatusBar foi movida de RootLayoutNav para cá para evitar duplicação e centralizar */}
            <StatusBar style="auto" /> 
          </VerificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

// Estilos para a tela de autenticação (podem ser movidos/refinados)
const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
  },
});