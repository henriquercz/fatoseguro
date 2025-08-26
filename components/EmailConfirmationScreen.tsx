import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Mail, RefreshCw, AlertCircle } from 'lucide-react-native';
import KeyboardDismissWrapper from '@/components/KeyboardDismissWrapper';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

interface EmailConfirmationScreenProps {
  email: string;
}

export default function EmailConfirmationScreen({ email }: EmailConfirmationScreenProps) {
  const { colors } = useTheme();
  const { logout } = useAuth();

  const handleBackToLogin = () => {
    logout();
  };

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
                  Retorne ao app - você será automaticamente logado
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

          {/* Botões de ação */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: colors.border }]}
              onPress={handleBackToLogin}
            >
              <RefreshCw size={20} color={colors.textSecondary} />
              <Text style={[styles.secondaryButtonText, { color: colors.textSecondary }]}>
                Voltar ao Login
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
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mainTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 24,
  },
  instructionsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  instructionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  emailText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  stepsContainer: {
    width: '100%',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  stepNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  stepText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 32,
    width: '100%',
  },
  warningText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  secondaryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
});
