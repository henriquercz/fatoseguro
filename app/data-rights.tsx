import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Share,
  Linking,
} from 'react-native';
import {
  Download,
  Trash2,
  Eye,
  Shield,
  FileText,
  Mail,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowLeft,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useConsent } from '@/contexts/ConsentContext';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import ConsentManager from '@/components/ConsentManager';
import { exportUserDataToPDF } from '@/lib/pdfExporter';

export default function DataRightsScreen() {
  const { colors } = useTheme();
  const { user, deleteAccount } = useAuth();
  const { consents, loadConsents } = useConsent();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadUserData();
      loadConsents();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      // Carrega dados do perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Carrega verificações
      const { data: verifications } = await supabase
        .from('verifications')
        .select('*')
        .eq('user_id', user.id)
        .order('verified_at', { ascending: false });

      setUserData({
        profile,
        verifications: verifications || [],
        verificationsCount: verifications?.length || 0,
      });
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      // Monta dados para exportação
      const exportData = {
        profile: userData.profile,
        verifications: userData.verifications || [],
        consents: consents,
        statistics: {
          total_verifications: userData.verificationsCount || 0,
          account_age_days: userData.profile?.created_at ? Math.floor(
            (new Date().getTime() - new Date(userData.profile.created_at).getTime()) / 
            (1000 * 60 * 60 * 24)
          ) : 0,
        },
      };

      // Usa o novo exportador de PDF
      const result = await exportUserDataToPDF(exportData);
      
      if (result.success) {
        Alert.alert(
          'Dados Exportados',
          'Seu relatório de dados pessoais foi gerado com sucesso conforme a LGPD. O documento contém todas as informações que temos sobre você.',
          [{ text: 'OK' }]
        );
      } else {
        throw new Error('Falha na exportação');
      }
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      Alert.alert(
        'Erro na Exportação', 
        'Não foi possível gerar o relatório de dados. Tente novamente ou entre em contato conosco.',
        [
          { text: 'OK' },
          {
            text: 'Contatar Suporte',
            onPress: () => Linking.openURL('mailto:henriquechagas06@gmail.com?subject=CheckNow - Erro na Exportação de Dados&body=Ocorreu um erro ao tentar exportar meus dados pessoais.'),
          },
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir Conta',
      'Esta ação irá excluir permanentemente sua conta e todos os dados associados. Esta ação não pode ser desfeita.\n\nConforme Art. 18º, VI da LGPD, você tem o direito à eliminação dos dados.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: confirmDeleteAccount,
        },
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    Alert.alert(
      'Confirmação Final',
      'Esta ação irá excluir PERMANENTEMENTE sua conta e todos os dados associados. Esta ação NÃO PODE ser desfeita.\n\nTem certeza que deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'EXCLUIR CONTA',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteAccount();
              
              Alert.alert(
                'Conta Excluída',
                'Sua conta foi excluída com sucesso. Todos os seus dados foram removidos permanentemente.',
                [
                  {
                    text: 'OK',
                    onPress: () => router.replace('/'),
                  },
                ]
              );
            } catch (error: any) {
              console.error('Erro ao excluir conta:', error);
              Alert.alert(
                'Erro na Exclusão',
                'Não foi possível excluir sua conta. Tente novamente ou entre em contato conosco.',
                [
                  { text: 'OK' },
                  {
                    text: 'Contatar Suporte',
                    onPress: () => Linking.openURL('mailto:henriquechagas06@gmail.com?subject=CheckNow - Erro na Exclusão de Conta&body=Ocorreu um erro ao tentar excluir minha conta. Detalhes do erro: ' + error.message),
                  },
                ]
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleContactDPO = () => {
    Linking.openURL(
      'mailto:henriquechagas06@gmail.com?subject=CheckNow - Exercício de Direitos LGPD&body=Gostaria de exercer meus direitos conforme a LGPD. Detalhes:'
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.notLoggedIn}>
          <Shield size={48} color={colors.textSecondary} />
          <Text style={[styles.notLoggedInText, { color: colors.text }]}>
            Faça login para acessar seus direitos de dados
          </Text>
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/account')}
          >
            <Text style={[styles.loginButtonText, { color: colors.background }]}>
              Fazer Login
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerIcon}>
            <Shield size={32} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            Meus Direitos de Dados
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Exercite seus direitos conforme a LGPD
          </Text>
        </View>

        {/* Status dos Dados */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.cardHeader}>
            <Info size={24} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Status dos Seus Dados
            </Text>
          </View>
          
          {userData && (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  {userData.verificationsCount}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Verificações
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  {consents.length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Consentimentos
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  {userData.profile?.is_premium ? 'Premium' : 'Gratuito'}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Plano
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Gerenciar Consentimentos */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <ConsentManager 
            consents={consents} 
            onUpdate={() => {
              loadConsents();
              loadUserData();
            }} 
          />
        </View>

        {/* Direitos Implementados */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Direitos Disponíveis
          </Text>
          
          {/* Acesso aos Dados */}
          <TouchableOpacity
            style={[styles.rightItem, { borderBottomColor: colors.border }]}
            onPress={() => router.push('/account')}
          >
            <View style={styles.rightIcon}>
              <Eye size={24} color={colors.primary} />
            </View>
            <View style={styles.rightContent}>
              <Text style={[styles.rightTitle, { color: colors.text }]}>
                Acessar Meus Dados
              </Text>
              <Text style={[styles.rightDescription, { color: colors.textSecondary }]}>
                Visualizar informações do perfil e histórico (Art. 18º, II)
              </Text>
            </View>
            <CheckCircle size={20} color={colors.success} />
          </TouchableOpacity>

          {/* Exportar Dados */}
          <TouchableOpacity
            style={[styles.rightItem, { borderBottomColor: colors.border }]}
            onPress={handleExportData}
            disabled={isLoading}
          >
            <View style={styles.rightIcon}>
              <Download size={24} color={colors.primary} />
            </View>
            <View style={styles.rightContent}>
              <Text style={[styles.rightTitle, { color: colors.text }]}>
                Exportar Meus Dados
              </Text>
              <Text style={[styles.rightDescription, { color: colors.textSecondary }]}>
                Baixar todos os dados em formato estruturado (Art. 18º, V)
              </Text>
            </View>
            <CheckCircle size={20} color={colors.success} />
          </TouchableOpacity>

          {/* Corrigir Dados */}
          <TouchableOpacity
            style={[styles.rightItem, { borderBottomColor: colors.border }]}
            onPress={() => router.push('/account')}
          >
            <View style={styles.rightIcon}>
              <FileText size={24} color={colors.primary} />
            </View>
            <View style={styles.rightContent}>
              <Text style={[styles.rightTitle, { color: colors.text }]}>
                Corrigir Dados
              </Text>
              <Text style={[styles.rightDescription, { color: colors.textSecondary }]}>
                Editar informações incorretas do perfil (Art. 18º, III)
              </Text>
            </View>
            <CheckCircle size={20} color={colors.success} />
          </TouchableOpacity>

          {/* Excluir Conta */}
          <TouchableOpacity
            style={[styles.rightItem, { borderBottomColor: 'transparent' }]}
            onPress={handleDeleteAccount}
          >
            <View style={styles.rightIcon}>
              <Trash2 size={24} color={colors.error} />
            </View>
            <View style={styles.rightContent}>
              <Text style={[styles.rightTitle, { color: colors.error }]}>
                Excluir Conta
              </Text>
              <Text style={[styles.rightDescription, { color: colors.textSecondary }]}>
                Eliminação permanente de todos os dados (Art. 18º, VI)
              </Text>
            </View>
            <AlertCircle size={20} color={colors.error} />
          </TouchableOpacity>
        </View>

        {/* Consentimentos */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Meus Consentimentos
          </Text>
          
          {consents.length > 0 ? (
            consents.map((consent) => (
              <View key={consent.id} style={[styles.consentItem, { borderBottomColor: colors.border }]}>
                <View style={styles.consentContent}>
                  <Text style={[styles.consentPurpose, { color: colors.text }]}>
                    {consent.purpose === 'essential' ? 'Funcionalidades Essenciais' : 
                     consent.purpose === 'analytics' ? 'Análises e Melhorias' :
                     consent.purpose === 'marketing' ? 'Comunicações de Marketing' : 
                     consent.purpose}
                  </Text>
                  <Text style={[styles.consentStatus, { color: colors.textSecondary }]}>
                    {consent.granted && !consent.revoked_at ? 'Concedido' : 'Revogado'} • {
                      new Date(consent.granted_at).toLocaleDateString('pt-BR')
                    }
                  </Text>
                </View>
                <View style={[
                  styles.consentIndicator,
                  { backgroundColor: consent.granted && !consent.revoked_at ? colors.success : colors.error }
                ]} />
              </View>
            ))
          ) : (
            <Text style={[styles.noConsents, { color: colors.textSecondary }]}>
              Nenhum consentimento registrado
            </Text>
          )}
        </View>

        {/* Contato */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Precisa de Ajuda?
          </Text>
          
          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: colors.primary + '20' }]}
            onPress={handleContactDPO}
          >
            <Mail size={24} color={colors.primary} />
            <View style={styles.contactContent}>
              <Text style={[styles.contactTitle, { color: colors.primary }]}>
                Contatar Encarregado de Dados
              </Text>
              <Text style={[styles.contactDescription, { color: colors.textSecondary }]}>
                Para exercer outros direitos ou tirar dúvidas
              </Text>
            </View>
          </TouchableOpacity>
          
          <Text style={[styles.responseTime, { color: colors.textSecondary }]}>
            ⏱️ Prazo de resposta: até 15 dias úteis (Art. 19º LGPD)
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Seus direitos são garantidos pela Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notLoggedIn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  notLoggedInText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  loginButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 24,
    padding: 8,
    borderRadius: 8,
    zIndex: 1,
  },
  headerIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  rightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  rightIcon: {
    marginRight: 16,
  },
  rightContent: {
    flex: 1,
  },
  rightTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  rightDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  consentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  consentContent: {
    flex: 1,
  },
  consentPurpose: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  consentStatus: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  consentIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  noConsents: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    paddingVertical: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  contactContent: {
    marginLeft: 16,
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  responseTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
});
