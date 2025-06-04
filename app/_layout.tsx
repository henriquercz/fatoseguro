import { useEffect } from 'react';
import { Platform, Image, ActivityIndicator, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ShieldCheck, History, User as UserIconLucide } from 'lucide-react-native';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { VerificationProvider } from '@/contexts/VerificationContext';
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!user) {
    // Tela de Autenticação para usuários não logados
    return (
      <SafeAreaView style={styles.authContainer}>
        <View style={styles.authHeader}>
          <Image
            source={require('../assets/images/icon.png')} // Caminho relativo de _layout.tsx para assets
            style={styles.authLogo}
            resizeMode="contain"
          />
          <Text style={styles.authText}>
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
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
          fontSize: 18,
        },
        headerTitleAlign: 'center',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Verificar',
          headerTitle: () => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={require('../assets/images/icon.png')}
                style={{ width: 30, height: 30, resizeMode: 'contain' }}
              />
            </View>
          ),
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
      <AuthProvider>
        <VerificationProvider>
          <RootLayoutNav />
          {/* A StatusBar foi movida de RootLayoutNav para cá para evitar duplicação e centralizar */}
          <StatusBar style="auto" /> 
        </VerificationProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

// Estilos para a tela de autenticação (podem ser movidos/refinados)
const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    padding: 20,
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  authLogo: {
    width: 120, // Ajuste o tamanho conforme necessário
    height: 120, // Ajuste o tamanho conforme necessário
    marginBottom: 24,
  },
  authText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});