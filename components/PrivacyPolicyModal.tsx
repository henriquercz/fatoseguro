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
import { X } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface PrivacyPolicyModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ visible, onClose }: PrivacyPolicyModalProps) {
  const { colors } = useTheme();
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Política de Privacidade</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Coleta de Informações</Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Coletamos apenas as informações necessárias para fornecer nossos serviços de verificação de notícias. Isso inclui:
            </Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Endereço de email para criação de conta</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Histórico de verificações realizadas</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Preferências de configuração do aplicativo</Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>2. Uso das Informações</Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Utilizamos suas informações para:
            </Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Fornecer serviços de verificação de notícias</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Manter seu histórico de verificações</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Melhorar nossos serviços e algoritmos</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Comunicar atualizações importantes do serviço</Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>3. Compartilhamento de Dados</Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:
            </Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Quando exigido por lei</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Para proteger nossos direitos legais</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Com provedores de serviços que nos ajudam a operar o aplicativo</Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>4. Segurança dos Dados</Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>5. Seus Direitos</Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Você tem o direito de:
            </Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Acessar suas informações pessoais</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Corrigir informações incorretas</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Solicitar a exclusão de sua conta e dados</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Retirar seu consentimento a qualquer momento</Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>6. Retenção de Dados</Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Mantemos suas informações apenas pelo tempo necessário para fornecer nossos serviços ou conforme exigido por lei.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>7. Alterações na Política</Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Podemos atualizar esta política de privacidade periodicamente. Notificaremos você sobre mudanças significativas através do aplicativo ou por email.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>8. Contato</Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Se você tiver dúvidas sobre esta política de privacidade, entre em contato conosco através do formulário de feedback no aplicativo.
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Última atualização: Junho de 2025
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    // backgroundColor e borderBottomColor aplicadas via tema
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    // color aplicada via tema
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
    // color aplicada via tema
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    marginBottom: 8,
    // color aplicada via tema
  },
  bulletPoint: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    marginBottom: 4,
    paddingLeft: 8,
    // color aplicada via tema
  },
  footer: {
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    // color aplicada via tema
  },
});