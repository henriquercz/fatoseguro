import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

type FormMode = 'login' | 'register';

export default function AuthForm() {
  const [mode, setMode] = useState<FormMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, register, loading, error } = useAuth();
  const { colors } = useTheme();

  const toggleMode = () => {
    setMode(prev => (prev === 'login' ? 'register' : 'login'));
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async () => {
    if (mode === 'register' && password !== confirmPassword) {
      return; // We'll handle this with form validation
    }
    
    if (mode === 'login') {
      await login(email, password);
    } else {
      await register(email, password);
    }
  };

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isPasswordValid = (password: string) => {
    return password.length >= 6;
  };

  const canSubmit = 
    email.trim() !== '' && 
    isEmailValid(email) && 
    isPasswordValid(password) && 
    (mode === 'login' || confirmPassword === password);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.formContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            {mode === 'login' ? 'Entrar' : 'Criar Conta'}
          </Text>
          
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {mode === 'login'
              ? 'Acesse sua conta para continuar'
              : 'Crie uma conta para começar'}
          </Text>

          {error ? (
            <View style={[styles.errorContainer, { backgroundColor: colors.surface, borderColor: colors.error || '#EF4444' }]}>
              <Text style={[styles.errorText, { color: colors.error || '#EF4444' }]}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>E-mail</Text>
            <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <Mail size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {email && !isEmailValid(email) && (
              <Text style={[styles.validationError, { color: colors.error || '#EF4444' }]}>
                Digite um e-mail válido
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Senha</Text>
            <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <Lock size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={password}
                onChangeText={setPassword}
                placeholder={mode === 'login' ? 'Sua senha' : 'Mínimo 6 caracteres'}
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
            {password && !isPasswordValid(password) && (
              <Text style={[styles.validationError, { color: colors.error || '#EF4444' }]}>
                A senha precisa ter pelo menos 6 caracteres
              </Text>
            )}
          </View>

          {mode === 'register' && (
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Confirmar Senha</Text>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <Lock size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirme sua senha"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showPassword}
                />
              </View>
              {confirmPassword && confirmPassword !== password && (
                <Text style={[styles.validationError, { color: colors.error || '#EF4444' }]}>
                  As senhas não coincidem
                </Text>
              )}
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.primary }, !canSubmit && { backgroundColor: colors.textSecondary }]}
            onPress={handleSubmit}
            disabled={!canSubmit || loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>
                {mode === 'login' ? 'Entrar' : 'Criar Conta'}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.switchModeContainer}>
            <Text style={[styles.switchModeText, { color: colors.textSecondary }]}>
              {mode === 'login'
                ? 'Ainda não tem uma conta?'
                : 'Já tem uma conta?'}
            </Text>
            <TouchableOpacity onPress={toggleMode}>
              <Text style={[styles.switchModeButton, { color: colors.primary }]}>
                {mode === 'login' ? 'Criar Conta' : 'Entrar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  formContainer: {
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  inputIcon: {
    marginHorizontal: 12,
  },
  passwordToggle: {
    padding: 12,
  },
  validationError: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  switchModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  switchModeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  switchModeButton: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginLeft: 4,
  },
  errorContainer: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});