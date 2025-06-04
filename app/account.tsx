import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image, Alert } from 'react-native';
import { LogOut, Shield, Settings, CircleHelp as HelpCircle, MessageSquare, Gift } from 'lucide-react-native';
import PremiumCard from '@/components/PremiumCard';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/contexts/AuthContext';

export default function AccountScreen() {
  const { user, logout, upgradeToPremium } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: logout,
          style: 'destructive',
        },
      ]
    );
  };

  const handleUpgrade = (plan: string) => {
    Alert.alert(
      'Assinar Plano Premium',
      `Você selecionou o plano ${plan}. No app real, aqui seria integrado um sistema de pagamento.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Simular Upgrade',
          onPress: upgradeToPremium,
        },
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authHeader}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.authText}>
            Entre ou crie uma conta para acessar todos os recursos
          </Text>
        </View>
        <AuthForm />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>{/* Remove whitespace between View elements */}
          <View>
            <Text style={styles.welcomeText}>Bem-vindo(a)</Text>
            <Text style={styles.emailText}>{user.email}</Text>
            <View style={styles.badgeContainer}>
              <View style={[styles.badge, user.isPremium ? styles.premiumBadge : styles.freeBadge]}>
                <Text style={[styles.badgeText, user.isPremium ? styles.premiumBadgeText : styles.freeBadgeText]}>
                  {user.isPremium ? 'Premium' : 'Gratuito'}
                </Text>
              </View>
            </View>
          </View><TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {!user.isPremium ? (
          <View style={styles.premiumSection}>
            <Text style={styles.sectionTitle}>Assine o Premium</Text>
            <Text style={styles.sectionDescription}>
              Tenha acesso ilimitado a verificações de notícias, sem anúncios!
            </Text>
            
            <PremiumCard
              title="Mensal"
              price="9,90"
              period="por mês"
              features={[
                { text: "Verificações ilimitadas" },
                { text: "Sem anúncios" },
                { text: "Histórico completo" },
                { text: "Suporte prioritário" }
              ]}
              onPress={() => handleUpgrade("Mensal")}
            />
            
            <PremiumCard
              title="Anual"
              price="89,90"
              period="por ano (25% de desconto)"
              features={[
                { text: "Verificações ilimitadas" },
                { text: "Sem anúncios" },
                { text: "Histórico completo" },
                { text: "Suporte prioritário" },
                { text: "Recursos premium futuros" }
              ]}
              highlighted={true}
              onPress={() => handleUpgrade("Anual")}
            />
          </View>
        ) : (
          <View style={styles.premiumThankYou}>
            <Shield color="#22C55E" size={40} />
            <Text style={styles.thankYouTitle}>Obrigado por ser Premium!</Text>
            <Text style={styles.thankYouText}>
              Você tem acesso ilimitado a todas as funcionalidades do FatoSeguro.
            </Text>
          </View>
        )}
        
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Configurações e Ajuda</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Settings size={20} color="#6B7280" />
            <Text style={styles.menuItemText}>Configurações</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <HelpCircle size={20} color="#6B7280" />
            <Text style={styles.menuItemText}>Ajuda e Suporte</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <MessageSquare size={20} color="#6B7280" />
            <Text style={styles.menuItemText}>Enviar Feedback</Text>
          </TouchableOpacity>
          
          {!user.isPremium && (
            <TouchableOpacity style={styles.menuItem}>
              <Gift size={20} color="#6B7280" />
              <Text style={styles.menuItemText}>Convidar Amigos</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>FatoSeguro v1.0.0</Text>
          <Text style={styles.footerText}>© 2025 FatoSeguro</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  emailText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginTop: 2,
  },
  badgeContainer: {
    marginTop: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  freeBadge: {
    backgroundColor: '#F3F4F6',
  },
  premiumBadge: {
    backgroundColor: '#FEF9C3',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  freeBadgeText: {
    color: '#6B7280',
  },
  premiumBadgeText: {
    color: '#B45309',
  },
  logoutButton: {
    padding: 10,
  },
  premiumSection: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 8,
  },
  sectionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  premiumThankYou: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20, // Padding ajustado para consistência
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // Sombra ajustada para maior elevação
    shadowOpacity: 0.08, // Sombra ajustada
    shadowRadius: 12, // Sombra ajustada
    elevation: 5, // Sombra ajustada para Android
  },
  thankYouTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  thankYouText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
  },
  menuSection: {
    padding: 20,
  },
  menuTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000', // Sombra adicionada
    shadowOffset: { width: 0, height: 2 }, // Sombra adicionada
    shadowOpacity: 0.06, // Sombra adicionada
    shadowRadius: 8, // Sombra adicionada
    elevation: 3, // Sombra adicionada para Android
  },
  menuItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#111827',
    marginLeft: 12,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  authHeader: {
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    height: 160,
    width: 1000,
  },
  authText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});