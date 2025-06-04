import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Shield, Link, TriangleAlert as AlertTriangle, RefreshCcw } from 'lucide-react-native';
import { useVerification } from '@/hooks/useVerification';

export default function VerifyForm() {
  const [newsInput, setNewsInput] = useState('');
  const [inputType, setInputType] = useState<'text' | 'link'>('text');
  const [isInputFocused, setIsInputFocused] = useState(false); // Estado para foco do input
  const { verifyNews, loading, error, verificationCount } = useVerification();

  const handleVerify = async () => {
    if (!newsInput.trim()) return;
    
    await verifyNews(newsInput, inputType);
    setNewsInput('');
  };

  const toggleInputType = () => {
    setInputType(prev => (prev === 'text' ? 'link' : 'text'));
    setNewsInput('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Shield color="#2563EB" size={24} />
          <Text style={styles.title}>Verificar Notícia</Text>
        </View>

        <View style={styles.inputTypeToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              inputType === 'text' && styles.activeToggle,
            ]}
            onPress={() => setInputType('text')}>
            <Text
              style={[
                styles.toggleText,
                inputType === 'text' && styles.activeToggleText,
              ]}>
              Texto
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              inputType === 'link' && styles.activeToggle,
            ]}
            onPress={() => setInputType('link')}>
            <Text
              style={[
                styles.toggleText,
                inputType === 'link' && styles.activeToggleText,
              ]}>
              Link
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              isInputFocused && styles.inputFocused, // Estilo condicional para foco
              inputType === 'text' ? { height: 100, textAlignVertical: 'top' } : { height: 50 } // Ajuste de altura dinâmico
            ]}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            value={newsInput}
            onChangeText={setNewsInput}
            placeholder={
              inputType === 'text'
                ? 'Digite o título ou conteúdo da notícia...'
                : 'Cole o link da notícia...'
            }
            multiline={inputType === 'text'}
            // numberOfLines é gerenciado pela altura dinâmica e multiline
            // numberOfLines={inputType === 'text' ? 4 : 1}
            keyboardType={inputType === 'link' ? 'url' : 'default'}
            autoCapitalize="none"
          />
          {inputType === 'link' && <Link color="#6B7280\" size={20} style={styles.inputIcon} />}
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <AlertTriangle color="#EF4444" size={16} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.verifyButton, !newsInput.trim() && styles.disabledButton]}
          onPress={handleVerify}
          disabled={!newsInput.trim() || loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF\" size="small" />
          ) : (
            <>
              <RefreshCcw color="#FFFFFF\" size={18} />
              <Text style={styles.buttonText}>Verificar</Text>
            </>
          )}
        </TouchableOpacity>

        {verificationCount !== null && (
          <Text style={styles.verificationCount}>
            Verificações restantes hoje: {verificationCount}/3
          </Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20, // Aumentado o padding
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // Sombra ajustada
    shadowOpacity: 0.08, // Sombra ajustada
    shadowRadius: 12, // Sombra ajustada
    elevation: 5, // Sombra ajustada para Android
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
    color: '#111827',
  },
  inputTypeToggle: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    // backgroundColor: '#F3F4F6', // Removido o fundo do container
    padding: 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1, // Adicionada borda para o estado inativo
    borderColor: '#D1D5DB', // Cor da borda para o estado inativo
  },
  activeToggle: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB', // Borda da mesma cor do fundo para o estado ativo
  },
  toggleText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
  },
  activeToggleText: {
    color: '#FFFFFF',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8, // Ajuste de padding vertical para melhor alinhamento em ambas as plataformas
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#F9FAFB',
    textAlignVertical: 'top', // Mantido para multiline, mas altura controlada dinamicamente
    paddingRight: 40, // Espaço para o ícone de link
  },
  inputFocused: {
    borderColor: '#2563EB', // Cor da borda azul quando focado
    // Opcional: adicionar uma sombra sutil de foco se desejado
    // shadowColor: '#2563EB',
    // shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3,
  },
  inputIcon: {
    position: 'absolute',
    right: 12,
    top: Platform.OS === 'ios' ? 14 : 12, // Ajuste fino da posição do ícone
  },
  verifyButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#93C5FD',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#B91C1C',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  verificationCount: {
    textAlign: 'center',
    marginTop: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});