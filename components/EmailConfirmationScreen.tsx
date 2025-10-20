import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mail, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react-native';
import KeyboardDismissWrapper from '@/components/KeyboardDismissWrapper';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface EmailConfirmationScreenProps {
  email: string;
}

export default function EmailConfirmationScreen({ email }: EmailConfirmationScreenProps) {
  const { colors } = useTheme();
  const { logout } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [checkMessage, setCheckMessage] = useState<string | null>(null);
  const [storedPassword, setStoredPassword] = useState<string | null>(null);

  // Salva a senha temporariamente do AsyncStorage
  useEffect(() => {
    const loadPassword = async () => {
      try {
        const pwd = await AsyncStorage.getItem('@temp_password');
        if (pwd) setStoredPassword(pwd);
      } catch (e) {
        console.log('Sem senha salva temporariamente');
      }
    };
    loadPassword();
  }, []);

  const handleBackToLogin = () => {
    logout();
  };

  const checkEmailConfirmation = async (showFeedback: boolean = true) => {
    if (showFeedback) {
      setIsChecking(true);
      setCheckMessage(null);
    }
    
    try {
      if (!storedPassword) {
        if (showFeedback) {
          setCheckMessage('Erro: Senha não encontrada. Volte ao login.');
        }
        return;
      }

      // Tenta fazer login - se email foi confirmado, vai funcionar
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: storedPassword,
      });
      
      if (data.session && data.user) {
        console.log('✅ Email confirmado! Login automático...');
        if (showFeedback) {
          setCheckMessage('Email confirmado! Entrando...');
        }
        // Remove senha temporária
        await AsyncStorage.removeItem('@temp_password');
        // onAuthStateChange vai detectar e logar automaticamente
        return true;
      }
      
      if (error?.message?.includes('Email not confirmed')) {
        // Email ainda não confirmado - normal
        if (showFeedback) {
          setCheckMessage('Email ainda não confirmado. Clique no link do email.');
        }
        return false;
      }
      
      if (error) {
        console.log('⚠️ Erro ao verificar:', error.message);
        if (showFeedback) {
          setCheckMessage('Erro ao verificar. Tente novamente.');
        }
        return false;
      }
    } catch (error: any) {
      console.error('❌ Erro ao verificar confirmação:', error);
      if (showFeedback) {
        setCheckMessage('Erro ao verificar. Tente novamente.');
      }
      return false;
    } finally {
      if (showFeedback) {
        setIsChecking(false);
      }
    }
  };

  // Polling automático SILENCIOSO a cada 3 segundos
  useEffect(() => {
    if (!storedPassword) return;

    const interval = setInterval(async () => {
      // Verifica SEM mostrar feedback (silencioso)
      await checkEmailConfirmation(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [storedPassword]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardDismissWrapper>
        <View style={styles.content}>
          {/* Header com logo */}
          <View style={styles.header}>
            <Image
              source={require('../assets/images/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.title, { color: colors.text }]}>
              CheckNow
            </Text>
          </View>

          {/* Ícone principal */}
          <View style={[styles.iconContainer, { backgroundColor: colors.surface }]}>
            <Mail size={64} color={colors.primary} />
          </View>

          {/* Título principal */}
          <Text style={[styles.mainTitle, { color: colors.text }]}>
            Verifique seu email
          </Text>

          {/* Instruções */}
          <View style={styles.instructionsContainer}>
            <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
              Enviamos um email de confirmação para:
            </Text>
            <Text style={[styles.emailText, { color: colors.primary }]}>
              {email}
            </Text>
            
            <View style={styles.stepsContainer}>
              <View style={styles.step}>
                <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.stepNumberText, { color: colors.surface }]}>1</Text>
                </View>
                <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                  Procure por um email da <Text style={{ fontWeight: 'bold' }}>Supabase</Text> com o título <Text style={{ fontWeight: 'bold' }}>"CheckNow"</Text>
                </Text>
              </View>

              <View style={styles.step}>
                <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.stepNumberText, { color: colors.surface }]}>2</Text>
                </View>
                <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                  Clique no link de confirmação dentro do email
                </Text>
              </View>

              <View style={styles.step}>
                <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.stepNumberText, { color: colors.surface }]}>3</Text>
                </View>
                <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                  Após confirmar, volte ao app e você será <Text style={{ fontWeight: 'bold', color: colors.primary }}>automaticamente logado</Text>
                </Text>
              </View>
            </View>
          </View>

          {/* Aviso importante */}
          <View style={[styles.warningContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <AlertCircle size={20} color={colors.primary} />
            <Text style={[styles.warningText, { color: colors.textSecondary }]}>
              Não recebeu o email? Verifique sua caixa de spam ou lixo eletrônico.
            </Text>
          </View>

          {/* Mensagem de status - só quando usuário clica */}
          {checkMessage && (
            <View style={[styles.statusContainer, { 
              backgroundColor: checkMessage.includes('confirmado') ? colors.success + '20' : colors.surface,
              borderColor: checkMessage.includes('confirmado') ? colors.success : colors.border 
            }]}>
              {checkMessage.includes('confirmado') ? (
                <CheckCircle size={20} color={colors.success || colors.primary} />
              ) : (
                <AlertCircle size={20} color={colors.primary} />
              )}
              <Text style={[styles.statusText, { 
                color: checkMessage.includes('confirmado') ? colors.success || colors.primary : colors.textSecondary 
              }]}>
                {checkMessage}
              </Text>
            </View>
          )}

          {/* Botões de ação */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={() => checkEmailConfirmation(true)}
              disabled={isChecking}
            >
              {isChecking ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <>
                  <RefreshCw size={20} color={colors.surface} />
                  <Text style={[styles.primaryButtonText, { color: colors.surface }]}>
                    Já confirmei
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: colors.border }]}
              onPress={handleBackToLogin}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.textSecondary }]}>
                Voltar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardDismissWrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mainTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  instructionsContainer: {
    width: '100%',
    marginBottom: 16,
  },
  instructionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 6,
  },
  emailText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  stepsContainer: {
    width: '100%',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  stepNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
  },
  stepText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
    width: '100%',
  },
  warningText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 10,
    flex: 1,
    lineHeight: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    width: '100%',
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginLeft: 10,
    flex: 1,
    lineHeight: 16,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 10,
    gap: 6,
  },
  primaryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  secondaryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
  },
});
