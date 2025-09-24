import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Linking,
  Platform,
} from 'react-native';
import { X, Mail, Shield, FileText } from 'lucide-react-native';
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
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'formSheet'}
      onRequestClose={onClose}
      transparent={false}
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
          {/* Seção de Introdução LGPD */}
          <View style={styles.section}>
            <View style={styles.iconHeader}>
              <Shield size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text, marginLeft: 8 }]}>Política de Privacidade - LGPD</Text>
            </View>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018) e descreve como tratamos seus dados pessoais no CheckNow.
            </Text>
            <Text style={[styles.highlightText, { color: colors.primary }]}>
              Versão: 2.0 | Última atualização: 24/09/2025
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Dados Pessoais Coletados</Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Coletamos os seguintes dados pessoais, conforme Art. 5º da LGPD:
            </Text>
            
            <Text style={[styles.subSectionTitle, { color: colors.text }]}>1.1 Dados de Identificação:</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Endereço de e-mail (obrigatório para cadastro)</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• ID único do usuário (UUID gerado automaticamente)</Text>
            
            <Text style={[styles.subSectionTitle, { color: colors.text }]}>1.2 Dados de Uso:</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• URLs de notícias verificadas</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Histórico de verificações realizadas</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Resultados das análises de IA</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Data e hora das verificações</Text>
            
            <Text style={[styles.subSectionTitle, { color: colors.text }]}>1.3 Dados Técnicos:</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Informações de sessão (tokens JWT)</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Preferências do aplicativo (tema, configurações)</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Status da conta (gratuita ou premium)</Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>2. Finalidades e Base Legal (Art. 6º LGPD)</Text>
            
            <Text style={[styles.subSectionTitle, { color: colors.text }]}>2.1 Execução de Contrato:</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Fornecer serviços de verificação de notícias</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Manter seu histórico pessoal de verificações</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Controlar limites de uso (3 verificações/mês gratuitas)</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Gerenciar assinatura premium</Text>
            
            <Text style={[styles.subSectionTitle, { color: colors.text }]}>2.2 Legítimo Interesse:</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Melhorar nossos algoritmos de verificação</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Garantir segurança e integridade do sistema</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Prevenir fraudes e uso indevido</Text>
            
            <Text style={[styles.subSectionTitle, { color: colors.text }]}>2.3 Consentimento (quando aplicável):</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Comunicações de marketing (se autorizado)</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Análises estatísticas avançadas (se autorizado)</Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>3. Compartilhamento de Dados (Art. 26º LGPD)</Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Não vendemos, alugamos ou comercializamos seus dados pessoais. O compartilhamento ocorre apenas nas seguintes situações:
            </Text>
            
            <Text style={[styles.subSectionTitle, { color: colors.text }]}>3.1 Processadores de Dados:</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Supabase (armazenamento de dados) - EUA</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Google Gemini (processamento de IA) - Global</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Brave Search (contexto de notícias) - EUA</Text>
            
            <Text style={[styles.subSectionTitle, { color: colors.text }]}>3.2 Obrigações Legais:</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Quando exigido por autoridades competentes</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Para cumprimento de decisões judiciais</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Em casos de investigações de crimes</Text>
            
            <Text style={[styles.subSectionTitle, { color: colors.text }]}>3.3 Dados Anonimizados:</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Estatísticas agregadas (sem identificação)</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Histórico comunitário (sem dados pessoais)</Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>4. Segurança dos Dados (Art. 46º LGPD)</Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Implementamos as seguintes medidas de segurança:
            </Text>
            
            <Text style={[styles.subSectionTitle, { color: colors.text }]}>4.1 Medidas Técnicas:</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Criptografia TLS 1.3 para transmissão de dados</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Criptografia AES-256 para dados em repouso</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Row Level Security (RLS) no banco de dados</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Autenticação JWT com expiração automática</Text>
            
            <Text style={[styles.subSectionTitle, { color: colors.text }]}>4.2 Medidas Organizacionais:</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Acesso restrito aos dados por desenvolvedores</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Controle de versão e auditoria de código</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Backup automático diário</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Monitoramento de tentativas de acesso</Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>5. Seus Direitos (Art. 18º LGPD)</Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Conforme a LGPD, você possui os seguintes direitos:
            </Text>
            
            <Text style={[styles.subSectionTitle, { color: colors.text }]}>5.1 Direitos Implementados:</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Confirmação da existência de tratamento (Art. 18º, I)</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Acesso aos dados (Art. 18º, II) - Disponível no app</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Correção de dados (Art. 18º, III) - Editar perfil</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Informação sobre compartilhamento (Art. 18º, VII)</Text>
            
            <Text style={[styles.subSectionTitle, { color: colors.text }]}>5.2 Direitos em Implementação:</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Portabilidade dos dados (Art. 18º, V)</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Eliminação dos dados (Art. 18º, VI)</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Revogação do consentimento (Art. 18º, IX)</Text>
            
            <Text style={[styles.subSectionTitle, { color: colors.text }]}>5.3 Como Exercer seus Direitos:</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Através das configurações do aplicativo</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Enviando e-mail para: henriquechagas06@gmail.com</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Prazo de resposta: até 15 dias (Art. 19º LGPD)</Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>6. Retenção de Dados (Art. 15º LGPD)</Text>
            
            <Text style={[styles.subSectionTitle, { color: colors.text }]}>6.1 Períodos de Retenção:</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Dados de conta: Enquanto a conta estiver ativa</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Histórico de verificações: 2 anos após inatividade</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Logs de segurança: 6 meses</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Dados de consentimento: 5 anos (comprovação)</Text>
            
            <Text style={[styles.subSectionTitle, { color: colors.text }]}>6.2 Exclusão Automática:</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Contas inativas por mais de 2 anos</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Dados temporários de processamento (24h)</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Tokens de sessão expirados</Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>7. Transferência Internacional</Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Alguns de nossos provedores estão localizados fora do Brasil:
            </Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Supabase (EUA) - Certificação SOC 2 Type II</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Google Gemini (Global) - Adequação GDPR</Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Garantimos que estes provedores atendem aos padrões de proteção adequados.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>8. Incidentes de Segurança (Art. 48º LGPD)</Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Em caso de incidente de segurança que possa acarretar risco aos seus dados:
            </Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Notificaremos a ANPD em até 72 horas</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Comunicaremos os titulares afetados</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Tomaremos medidas para mitigar os riscos</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Documentaremos o incidente e as ações tomadas</Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>9. Alterações na Política</Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Esta política pode ser atualizada para refletir mudanças em nossas práticas ou na legislação.
            </Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Notificação prévia de 30 dias para mudanças significativas</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Comunicação através do aplicativo</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Versões anteriores disponíveis para consulta</Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>10. Contato e DPO</Text>
            
            <Text style={[styles.subSectionTitle, { color: colors.text }]}>10.1 Controlador de Dados:</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Nome: Henrique Rezende</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• E-mail: henriquechagas06@gmail.com</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Instituição: ETEC Taboão da Serra</Text>
            
            <Text style={[styles.subSectionTitle, { color: colors.text }]}>10.2 Encarregado de Dados (DPO):</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• A ser designado conforme Art. 41º LGPD</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Contato temporário: henriquechagas06@gmail.com</Text>
            
            <Text style={[styles.subSectionTitle, { color: colors.text }]}>10.3 Canais de Atendimento:</Text>
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => Linking.openURL('mailto:henriquechagas06@gmail.com?subject=CheckNow - Exercício de Direitos LGPD')}
            >
              <Mail size={20} color={colors.primary} />
              <Text style={[styles.contactButtonText, { color: colors.primary }]}>Exercer Direitos LGPD</Text>
            </TouchableOpacity>
            
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Formulário de feedback no aplicativo</Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Prazo de resposta: até 15 dias úteis</Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerInfo}>
              <FileText size={16} color={colors.textSecondary} />
              <Text style={[styles.footerText, { color: colors.textSecondary, marginLeft: 8 }]}>
                Versão 2.0 - Última atualização: 24/09/2025
              </Text>
            </View>
            <Text style={[styles.footerSubtext, { color: colors.textSecondary }]}>
              Política em conformidade com a LGPD (Lei 13.709/2018)
            </Text>
            <Text style={[styles.footerSubtext, { color: colors.textSecondary }]}>
              CheckNow - TCC ETEC Taboão da Serra 2025
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
  iconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
    // color aplicada via tema
  },
  subSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginTop: 12,
    marginBottom: 8,
    // color aplicada via tema
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    marginBottom: 8,
    // color aplicada via tema
  },
  highlightText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginTop: 8,
    fontStyle: 'italic',
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
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
    // color aplicada via tema
  },
  footer: {
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    // color aplicada via tema
  },
  footerSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 4,
    // color aplicada via tema
  },
});