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

type FormMode = 'login' | 'register';

export default function AuthForm() {
  const [mode, setMode] = useState<FormMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, register, loading, error } = useAuth();

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
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            {mode === 'login' ? 'Entrar' : 'Criar Conta'}
          </Text>
          
          <Text style={styles.subtitle}>
            {mode === 'login'
              ? 'Acesse sua conta para continuar'
              : 'Crie uma conta para começar'}
          </Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <View style={styles.inputContainer}>
              <Mail size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {email && !isEmailValid(email) && (
              <Text style={styles.validationError}>
                Digite um e-mail válido
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder={mode === 'login' ? 'Sua senha' : 'Mínimo 6 caracteres'}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
            {password && !isPasswordValid(password) && (
              <Text style={styles.validationError}>
                A senha precisa ter pelo menos 6 caracteres
              </Text>
            )}
          </View>

          {mode === 'register' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar Senha</Text>
              <View style={styles.inputContainer}>
                <Lock size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirme sua senha"
                  secureTextEntry={!showPassword}
                />
              </View>
              {confirmPassword && confirmPassword !== password && (
                <Text style={styles.validationError}>
                  As senhas não coincidem
                </Text>
              )}
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, !canSubmit && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={!canSubmit || loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF\" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>
                {mode === 'login' ? 'Entrar' : 'Criar Conta'}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.switchModeContainer}>
            <Text style={styles.switchModeText}>
              {mode === 'login'
                ? 'Ainda não tem uma conta?'
                : 'Já tem uma conta?'}
            </Text>
            <TouchableOpacity onPress={toggleMode}>
              <Text style={styles.switchModeButton}>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
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
    color: '#EF4444',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#93C5FD',
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
    color: '#6B7280',
  },
  switchModeButton: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#2563EB',
    marginLeft: 4,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#B91C1C',
  },
});