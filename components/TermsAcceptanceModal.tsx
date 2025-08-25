import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { X, FileText, Shield } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface TermsAcceptanceModalProps {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function TermsAcceptanceModal({ visible, onAccept, onDecline }: TermsAcceptanceModalProps) {
  const { colors } = useTheme();
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onDecline}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onDecline} style={styles.closeButton}>
            <X size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Termos de Uso</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Introdução */}
          <View style={styles.introSection}>
            <View style={styles.iconContainer}>
              <FileText size={32} color={colors.primary} />
            </View>
            <Text style={[styles.introTitle, { color: colors.text }]}>
              Bem-vindo ao CheckNow
            </Text>
            <Text style={[styles.introText, { color: colors.textSecondary }]}>
              Para criar sua conta, você precisa aceitar nossos Termos de Uso e Política de Privacidade.
            </Text>
          </View>

          {/* Termos de Uso */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Termos de Uso</Text>
            
            <Text style={[styles.subsectionTitle, { color: colors.text }]}>1. Aceitação dos Termos</Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Ao usar o CheckNow, você concorda com estes termos de uso e nossa política de privacidade.
            </Text>

            <Text style={[styles.subsectionTitle, { color: colors.text }]}>2. Uso do Serviço</Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              O CheckNow é uma ferramenta de verificação de notícias que utiliza inteligência artificial. Você concorda em:
            </Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Usar o serviço de forma responsável e ética</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Não tentar burlar os limites de verificação</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Não usar o serviço para fins ilegais ou prejudiciais</Text>

            <Text style={[styles.subsectionTitle, { color: colors.text }]}>3. Limitações do Serviço</Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              O CheckNow fornece análises baseadas em IA que podem não ser 100% precisas. Recomendamos sempre verificar informações importantes através de múltiplas fontes confiáveis.
            </Text>

            <Text style={[styles.subsectionTitle, { color: colors.text }]}>4. Conta de Usuário</Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Você é responsável por manter a segurança de sua conta e senha. Notifique-nos imediatamente sobre qualquer uso não autorizado.
            </Text>
          </View>

          {/* Política de Privacidade Resumida */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Política de Privacidade (Resumo)</Text>
            
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Coletamos apenas as informações necessárias para fornecer nossos serviços:
            </Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Endereço de email para criação de conta</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Histórico de verificações realizadas</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Preferências de configuração do aplicativo</Text>

            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto quando exigido por lei.
            </Text>
          </View>

          {/* Botões de Ação */}
          <View style={styles.actionSection}>
            <View style={[styles.warningBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Shield size={20} color={colors.primary} />
              <Text style={[styles.warningText, { color: colors.textSecondary }]}>
                Ao aceitar, você confirma que leu e concorda com nossos Termos de Uso e Política de Privacidade.
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.declineButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={onDecline}
              >
                <Text style={[styles.declineButtonText, { color: colors.textSecondary }]}>
                  Recusar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.acceptButton, { backgroundColor: colors.primary }]}
                onPress={onAccept}
              >
                <Text style={styles.acceptButtonText}>
                  Aceitar e Continuar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  introSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
  },
  iconContainer: {
    marginBottom: 16,
  },
  introTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  introText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
    marginTop: 16,
  },
  text: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    marginBottom: 6,
    paddingLeft: 8,
  },
  actionSection: {
    marginBottom: 40,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  warningText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  declineButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  declineButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  acceptButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});
