import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image, Alert } from 'react-native';
import { LogOut, Shield, Settings, CircleHelp as HelpCircle, MessageSquare, Gift } from 'lucide-react-native';
import PremiumCard from '@/components/PremiumCard';
import AuthForm from '@/components/AuthForm';
import FeedbackModal from '@/components/FeedbackModal';
import InviteFriendsModal from '@/components/InviteFriendsModal';
import SettingsModal from '@/components/SettingsModal';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function AccountScreen() {
  const { user, logout, upgradeToPremium } = useAuth();
  const { colors } = useTheme();
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [inviteFriendsModalVisible, setInviteFriendsModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

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
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.authHeader}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.authText, { color: colors.textSecondary }]}>
            Entre ou crie uma conta para acessar todos os recursos
          </Text>
        </View>
        <AuthForm />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>{/* Remove whitespace between View elements */}
          <View>
            <Text style={[styles.welcomeText, { color: colors.text }]}>Bem-vindo(a)</Text>
            <Text style={[styles.emailText, { color: colors.textSecondary }]}>{user.email}</Text>
            <View style={styles.badgeContainer}>
              <View style={[styles.badge, user.isPremium ? styles.premiumBadge : styles.freeBadge]}>
                <Text style={[styles.badgeText, user.isPremium ? styles.premiumBadgeText : styles.freeBadgeText]}>
                  {user.isPremium ? 'Premium' : 'Gratuito'}
                </Text>
              </View>
            </View>
          </View><TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {!user.isPremium ? (
          <View style={styles.premiumSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Assine o Premium</Text>
            <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
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
          <View style={[styles.premiumThankYou, { backgroundColor: colors.surface }]}>
            <Shield color="#22C55E" size={40} />
            <Text style={[styles.thankYouTitle, { color: colors.text }]}>Obrigado por ser Premium!</Text>
            <Text style={[styles.thankYouText, { color: colors.textSecondary }]}>
              Você tem acesso ilimitado a todas as funcionalidades do FatoSeguro.
            </Text>
          </View>
        )}
        
        <View style={styles.menuSection}>
          <Text style={[styles.menuTitle, { color: colors.text }]}>Configurações e Ajuda</Text>
          
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.surface, borderBottomColor: colors.border }]} onPress={() => setSettingsModalVisible(true)}>
            <Settings size={20} color={colors.textSecondary} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Configurações</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.surface, borderBottomColor: colors.border }]} onPress={() => setFeedbackModalVisible(true)}>
            <MessageSquare size={20} color={colors.textSecondary} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Enviar Feedback</Text>
          </TouchableOpacity>
          
          {!user.isPremium && (
            <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.surface, borderBottomColor: colors.border }]} onPress={() => setInviteFriendsModalVisible(true)}>
              <Gift size={20} color={colors.textSecondary} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Convidar Amigos</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>CheckNow v1.1.0</Text>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>© 2025 CheckNow</Text>
        </View>
      </ScrollView>
      
      <FeedbackModal
        visible={feedbackModalVisible}
        onClose={() => setFeedbackModalVisible(false)}
      />
      
      <InviteFriendsModal
        visible={inviteFriendsModalVisible}
        onClose={() => setInviteFriendsModalVisible(false)}
      />
      
      <SettingsModal
        visible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor aplicada via tema
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    // backgroundColor e borderBottomColor aplicadas via tema
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    // color aplicada via tema
  },
  emailText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginTop: 2,
    // color aplicada via tema
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
    marginBottom: 8,
    // color aplicada via tema
  },
  sectionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 20,
    // color aplicada via tema
  },
  premiumThankYou: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    // backgroundColor aplicada via tema
  },
  thankYouTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
    // color aplicada via tema
  },
  thankYouText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    // color aplicada via tema
  },
  menuSection: {
    padding: 20,
  },
  menuTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 12,
    // color aplicada via tema
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    // backgroundColor aplicada via tema
  },
  menuItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    marginLeft: 12,
    // color aplicada via tema
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginBottom: 4,
    // color aplicada via tema
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
    textAlign: 'center',
    // color aplicada via tema
  },
});