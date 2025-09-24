import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { CheckCircle, Circle, Info, RotateCcw } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useConsent, ConsentRecord } from '@/contexts/ConsentContext';

interface ConsentManagerProps {
  consents: ConsentRecord[];
  onUpdate: () => void;
}

const consentLabels: Record<string, { title: string; description: string; required: boolean }> = {
  essential: {
    title: 'Funcionalidades Essenciais',
    description: 'Necessário para o funcionamento básico do app',
    required: true,
  },
  terms_of_service: {
    title: 'Termos de Uso',
    description: 'Aceitação dos termos de uso do CheckNow',
    required: true,
  },
  privacy_policy: {
    title: 'Política de Privacidade',
    description: 'Aceitação da política de privacidade LGPD',
    required: true,
  },
  analytics: {
    title: 'Melhorias e Análises',
    description: 'Dados anonimizados para melhorar o app',
    required: false,
  },
  marketing: {
    title: 'Comunicações',
    description: 'Receber notificações sobre atualizações',
    required: false,
  },
};

export default function ConsentManager({ consents, onUpdate }: ConsentManagerProps) {
  const { colors } = useTheme();
  const { grantConsent, revokeConsent } = useConsent();
  const [isLoading, setIsLoading] = useState(false);

  const getConsentStatus = (purpose: string): boolean => {
    const consent = consents.find(c => c.purpose === purpose && c.granted && !c.revoked_at);
    return !!consent;
  };

  const getConsentRecord = (purpose: string): ConsentRecord | undefined => {
    return consents.find(c => c.purpose === purpose);
  };

  const handleToggleConsent = async (purpose: string, currentStatus: boolean) => {
    const consentInfo = consentLabels[purpose];
    
    if (consentInfo?.required && currentStatus) {
      Alert.alert(
        'Consentimento Obrigatório',
        'Este consentimento é necessário para o funcionamento do app e não pode ser revogado.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsLoading(true);
    try {
      if (currentStatus) {
        // Revogar consentimento
        const record = getConsentRecord(purpose);
        if (record) {
          await revokeConsent(record.id);
          console.log(`Consentimento revogado: ${purpose}`);
        }
      } else {
        // Conceder consentimento
        await grantConsent(purpose, 'consent');
        console.log(`Consentimento concedido: ${purpose}`);
      }
      
      onUpdate();
    } catch (error) {
      console.error('Erro ao alterar consentimento:', error);
      Alert.alert('Erro', 'Não foi possível alterar o consentimento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Info size={20} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>
          Gerenciar Consentimentos
        </Text>
      </View>

      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Conforme a LGPD, você pode gerenciar seus consentimentos a qualquer momento.
      </Text>

      {Object.entries(consentLabels).map(([purpose, info]) => {
        const isGranted = getConsentStatus(purpose);
        const record = getConsentRecord(purpose);

        return (
          <View key={purpose} style={[styles.consentItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.consentHeader}>
              <TouchableOpacity
                style={styles.consentToggle}
                onPress={() => handleToggleConsent(purpose, isGranted)}
                disabled={isLoading || (info.required && isGranted)}
              >
                {isGranted ? (
                  <CheckCircle size={24} color={colors.primary} />
                ) : (
                  <Circle size={24} color={colors.textSecondary} />
                )}
              </TouchableOpacity>

              <View style={styles.consentInfo}>
                <View style={styles.consentTitleRow}>
                  <Text style={[styles.consentTitle, { color: colors.text }]}>
                    {info.title}
                  </Text>
                  {info.required && (
                    <View style={[styles.requiredBadge, { backgroundColor: colors.primary + '20' }]}>
                      <Text style={[styles.requiredText, { color: colors.primary }]}>
                        Obrigatório
                      </Text>
                    </View>
                  )}
                </View>

                <Text style={[styles.consentDescription, { color: colors.textSecondary }]}>
                  {info.description}
                </Text>

                {record && (
                  <View style={styles.consentDetails}>
                    <Text style={[styles.consentDate, { color: colors.textSecondary }]}>
                      {isGranted ? 'Concedido' : 'Revogado'} em: {formatDate(record.granted_at)}
                    </Text>
                    {record.revoked_at && (
                      <Text style={[styles.consentDate, { color: colors.error }]}>
                        Revogado em: {formatDate(record.revoked_at)}
                      </Text>
                    )}
                    <Text style={[styles.legalBasis, { color: colors.textSecondary }]}>
                      Base legal: {record.legal_basis === 'contract' ? 'Execução de contrato' : 
                                  record.legal_basis === 'consent' ? 'Consentimento' : 
                                  'Legítimo interesse'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        );
      })}

      <View style={[styles.footer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <RotateCcw size={16} color={colors.primary} />
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Alterações nos consentimentos são aplicadas imediatamente e registradas conforme a LGPD.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
    lineHeight: 20,
  },
  consentItem: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  consentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  consentToggle: {
    marginRight: 12,
    marginTop: 2,
  },
  consentInfo: {
    flex: 1,
  },
  consentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  consentTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  requiredBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  requiredText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  consentDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 8,
  },
  consentDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  consentDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  legalBasis: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
});
