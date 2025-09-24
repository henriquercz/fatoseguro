import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Info, RefreshCw } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { checkAuthSettings } from '@/lib/supabase';

interface AuthDebugInfoProps {
  visible: boolean;
  onClose: () => void;
}

export default function AuthDebugInfo({ visible, onClose }: AuthDebugInfoProps) {
  const { colors } = useTheme();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadDebugInfo = async () => {
    setIsLoading(true);
    try {
      const authSettings = await checkAuthSettings();
      
      const info = {
        timestamp: new Date().toISOString(),
        supabase: authSettings,
        environment: {
          supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ? 'Configurada' : 'Não configurada',
          supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? 'Configurada' : 'Não configurada',
        },
        recommendations: []
      };

      // Adiciona recomendações baseadas na análise
      if (!authSettings.connected) {
        info.recommendations.push('Verificar conectividade com Supabase');
      }
      
      if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
        info.recommendations.push('Configurar EXPO_PUBLIC_SUPABASE_URL');
      }
      
      if (!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
        info.recommendations.push('Configurar EXPO_PUBLIC_SUPABASE_ANON_KEY');
      }

      info.recommendations.push('Verificar se "Enable email confirmations" está habilitado no painel do Supabase');
      info.recommendations.push('Verificar se há templates de email configurados');
      info.recommendations.push('Verificar se o domínio de email não está em spam/blacklist');

      setDebugInfo(info);
    } catch (error) {
      console.error('Erro ao carregar debug info:', error);
      setDebugInfo({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      loadDebugInfo();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Info size={24} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>
            Debug - Confirmação de Email
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.closeButton, { color: colors.primary }]}>
              Fechar
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {isLoading ? (
            <View style={styles.loading}>
              <RefreshCw size={24} color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.text }]}>
                Carregando informações...
              </Text>
            </View>
          ) : debugInfo ? (
            <View>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Configurações do Supabase
                </Text>
                <Text style={[styles.info, { color: colors.textSecondary }]}>
                  URL: {debugInfo.environment?.supabaseUrl}
                </Text>
                <Text style={[styles.info, { color: colors.textSecondary }]}>
                  Anon Key: {debugInfo.environment?.supabaseKey}
                </Text>
                <Text style={[styles.info, { color: colors.textSecondary }]}>
                  Conectividade: {debugInfo.supabase?.connected ? '✅ OK' : '❌ Erro'}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Possíveis Causas
                </Text>
                <Text style={[styles.cause, { color: colors.textSecondary }]}>
                  1. Confirmação de email desabilitada no Supabase
                </Text>
                <Text style={[styles.cause, { color: colors.textSecondary }]}>
                  2. Templates de email não configurados
                </Text>
                <Text style={[styles.cause, { color: colors.textSecondary }]}>
                  3. Domínio de email em blacklist
                </Text>
                <Text style={[styles.cause, { color: colors.textSecondary }]}>
                  4. Configurações de SMTP incorretas
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Como Resolver
                </Text>
                <Text style={[styles.solution, { color: colors.textSecondary }]}>
                  1. Acesse o painel do Supabase
                </Text>
                <Text style={[styles.solution, { color: colors.textSecondary }]}>
                  2. Vá em Authentication → Settings
                </Text>
                <Text style={[styles.solution, { color: colors.textSecondary }]}>
                  3. Verifique se "Enable email confirmations" está ON
                </Text>
                <Text style={[styles.solution, { color: colors.textSecondary }]}>
                  4. Configure templates em Email Templates
                </Text>
                <Text style={[styles.solution, { color: colors.textSecondary }]}>
                  5. Teste com um email diferente
                </Text>
              </View>

              {debugInfo.recommendations && debugInfo.recommendations.length > 0 && (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Recomendações
                  </Text>
                  {debugInfo.recommendations.map((rec: string, index: number) => (
                    <Text key={index} style={[styles.recommendation, { color: colors.primary }]}>
                      • {rec}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <Text style={[styles.error, { color: colors.error }]}>
              Erro ao carregar informações de debug
            </Text>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.refreshButton, { backgroundColor: colors.primary }]}
            onPress={loadDebugInfo}
            disabled={isLoading}
          >
            <RefreshCw size={16} color="#FFFFFF" />
            <Text style={styles.refreshButtonText}>Atualizar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
    marginLeft: 12,
  },
  closeButton: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  content: {
    maxHeight: 400,
    paddingHorizontal: 20,
  },
  loading: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginTop: 12,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  cause: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 6,
    paddingLeft: 8,
  },
  solution: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 6,
    paddingLeft: 8,
  },
  recommendation: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 6,
    paddingLeft: 8,
  },
  error: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    padding: 20,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
});
