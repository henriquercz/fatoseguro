import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { X, Shield, CheckCircle, Circle, Info } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useConsent } from '@/contexts/ConsentContext';

interface ConsentModalProps {
  visible: boolean;
  onComplete: () => void;
  onSkip?: () => void;
}

interface ConsentOption {
  id: string;
  purpose: string;
  title: string;
  description: string;
  required: boolean;
  legalBasis: string;
}

const consentOptions: ConsentOption[] = [
  {
    id: 'essential',
    purpose: 'essential',
    title: 'Funcionalidades Essenciais',
    description: 'Necessário para o funcionamento básico do app: autenticação, verificações de notícias e histórico pessoal.',
    required: true,
    legalBasis: 'contract',
  },
  {
    id: 'analytics',
    purpose: 'analytics',
    title: 'Melhorias e Análises',
    description: 'Nos ajuda a melhorar o app analisando como você usa as funcionalidades (dados anonimizados).',
    required: false,
    legalBasis: 'consent',
  },
  {
    id: 'marketing',
    purpose: 'marketing',
    title: 'Comunicações',
    description: 'Receber notificações sobre atualizações importantes, novos recursos e dicas de uso.',
    required: false,
    legalBasis: 'consent',
  },
];

export default function ConsentModal({ visible, onComplete, onSkip }: ConsentModalProps) {
  const { colors } = useTheme();
  const { grantConsent } = useConsent();
  const [selectedConsents, setSelectedConsents] = useState<Set<string>>(
    new Set(['essential']) // Essential sempre selecionado
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleConsent = (consentId: string, required: boolean) => {
    if (required) return; // Não permite desmarcar essenciais

    const newConsents = new Set(selectedConsents);
    if (newConsents.has(consentId)) {
      newConsents.delete(consentId);
    } else {
      newConsents.add(consentId);
    }
    setSelectedConsents(newConsents);
  };

  const handleSaveConsents = async () => {
    setIsProcessing(true);
    try {
      // Concede consentimentos selecionados
      for (const consentId of selectedConsents) {
        const option = consentOptions.find(opt => opt.id === consentId);
        if (option) {
          await grantConsent(option.purpose, option.legalBasis);
        }
      }
      
      console.log('Consentimentos salvos:', Array.from(selectedConsents));
      onComplete();
    } catch (error) {
      console.error('Erro ao salvar consentimentos:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkip = () => {
    // Mesmo se pular, precisa conceder o essencial
    grantConsent('essential', 'contract');
    onSkip?.();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'formSheet'}
      onRequestClose={handleSkip}
      transparent={false}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          {onSkip && (
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>
                Pular
              </Text>
            </TouchableOpacity>
          )}
          <Text style={[styles.title, { color: colors.text }]}>
            Consentimentos LGPD
          </Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Introdução */}
          <View style={styles.introSection}>
            <View style={styles.iconContainer}>
              <Shield size={48} color={colors.primary} />
            </View>
            <Text style={[styles.introTitle, { color: colors.text }]}>
              Seus Dados, Suas Escolhas
            </Text>
            <Text style={[styles.introText, { color: colors.textSecondary }]}>
              Conforme a LGPD, você tem controle sobre como seus dados são tratados. 
              Escolha as finalidades que você autoriza:
            </Text>
          </View>

          {/* Opções de Consentimento */}
          <View style={styles.optionsSection}>
            {consentOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  { 
                    backgroundColor: colors.card,
                    borderColor: selectedConsents.has(option.id) ? colors.primary : colors.border,
                    borderWidth: selectedConsents.has(option.id) ? 2 : 1,
                  }
                ]}
                onPress={() => toggleConsent(option.id, option.required)}
                disabled={option.required}
              >
                <View style={styles.optionHeader}>
                  <View style={styles.optionTitleContainer}>
                    <Text style={[styles.optionTitle, { color: colors.text }]}>
                      {option.title}
                    </Text>
                    {option.required && (
                      <View style={[styles.requiredBadge, { backgroundColor: colors.primary + '20' }]}>
                        <Text style={[styles.requiredText, { color: colors.primary }]}>
                          Obrigatório
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.checkboxContainer}>
                    {selectedConsents.has(option.id) ? (
                      <CheckCircle size={24} color={colors.primary} />
                    ) : (
                      <Circle size={24} color={colors.textSecondary} />
                    )}
                  </View>
                </View>

                <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                  {option.description}
                </Text>

                <View style={styles.legalBasisContainer}>
                  <Info size={14} color={colors.textSecondary} />
                  <Text style={[styles.legalBasisText, { color: colors.textSecondary }]}>
                    Base legal: {
                      option.legalBasis === 'contract' ? 'Execução de contrato' :
                      option.legalBasis === 'consent' ? 'Consentimento' :
                      'Legítimo interesse'
                    }
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Informações Adicionais */}
          <View style={[styles.infoBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Info size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                Seus Direitos
              </Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Você pode alterar estes consentimentos a qualquer momento nas configurações 
                do app ou exercer seus direitos LGPD na seção "Meus Dados".
              </Text>
            </View>
          </View>

          {/* Botões de Ação */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: colors.primary },
                isProcessing && { opacity: 0.7 }
              ]}
              onPress={handleSaveConsents}
              disabled={isProcessing}
            >
              <Text style={styles.saveButtonText}>
                {isProcessing ? 'Salvando...' : 'Salvar Preferências'}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Ao continuar, você confirma que leu nossa Política de Privacidade 
              e concorda com o tratamento de dados conforme selecionado acima.
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  skipButton: {
    padding: 8,
  },
  skipButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  introSection: {
    alignItems: 'center',
    paddingVertical: 32,
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
  optionsSection: {
    marginBottom: 24,
  },
  optionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  optionTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 6,
  },
  requiredBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  requiredText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  checkboxContainer: {
    marginTop: 2,
  },
  optionDescription: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    marginBottom: 12,
  },
  legalBasisContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legalBasisText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    marginLeft: 6,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  actionSection: {
    paddingBottom: 40,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  footerText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});
