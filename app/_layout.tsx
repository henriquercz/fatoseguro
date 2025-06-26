import React, { useEffect } from 'react';
import { Platform, Image, ActivityIndicator, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ShieldCheck, History, User as UserIconLucide } from 'lucide-react-native';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { VerificationProvider } from '@/contexts/VerificationContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import AuthForm from '@/components/AuthForm';
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
  const { user, loading: authLoading } = useAuth(); // Corrigido: isLoading para loading
  const { colors } = useTheme();
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

  if (!user) {
    // Tela de Autenticação para usuários não logados
    return (
      <SafeAreaView style={[styles.authContainer, { backgroundColor: colors.background }]}>
        <View style={styles.authHeader}>
          <Image
            source={require('../assets/images/icon.png')} // Caminho relativo de _layout.tsx para assets
            style={styles.authLogo}
            resizeMode="contain"
          />
          <Text style={[styles.authText, { color: colors.textSecondary }]}>
            Entre ou crie uma conta para verificar notícias e acessar seu histórico.
          </Text>
        </View>
        <AuthForm />
      </SafeAreaView>
    );
  }

  // Usuário logado, mostra as abas principais.
  // AuthProvider, VerificationProvider, GestureHandlerRootView e StatusBar são agora gerenciados por AppLayout.
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Verificar',
          headerTitle: 'Verificar',
          tabBarIcon: ({ color, size }) => (
            <ShieldCheck size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Histórico',
          headerTitle: 'Histórico de Verificações',
          tabBarIcon: ({ color, size }) => (
            <History size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Conta',
          headerTitle: 'Minha Conta',
          tabBarIcon: ({ color, size }) => (
            <UserIconLucide size={size} color={color} />
          ),
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
    </Tabs>
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
    justifyContent: 'center',
    padding: 20,
    // backgroundColor aplicada via tema
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  authLogo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  authText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    // color aplicada via tema
  },
});