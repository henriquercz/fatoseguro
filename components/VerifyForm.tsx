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
import { useTheme } from '@/contexts/ThemeContext';

export default function VerifyForm() {
  const [newsInput, setNewsInput] = useState('');
  const [inputType, setInputType] = useState<'text' | 'link'>('text');
  const [isInputFocused, setIsInputFocused] = useState(false); // Estado para foco do input
  const { verifyNews, loading, error, verificationCount } = useVerification();
  const { colors } = useTheme();

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
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.header}>
          <Shield color={colors.primary} size={24} />
          <Text style={[styles.title, { color: colors.text }]}>Verificar Notícia</Text>
        </View>

        <View style={styles.inputTypeToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              { borderColor: colors.border },
              inputType === 'text' && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => setInputType('text')}>
            <Text
              style={[
                styles.toggleText,
                { color: colors.textSecondary },
                inputType === 'text' && styles.activeToggleText,
              ]}>
              Texto
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              { borderColor: colors.border },
              inputType === 'link' && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => setInputType('link')}>
            <Text
              style={[
                styles.toggleText,
                { color: colors.textSecondary },
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
              { borderColor: colors.border, backgroundColor: colors.background, color: colors.text },
              isInputFocused && { borderColor: colors.primary }, // Estilo condicional para foco
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
            placeholderTextColor={colors.textSecondary}
            multiline={inputType === 'text'}
            // numberOfLines é gerenciado pela altura dinâmica e multiline
            // numberOfLines={inputType === 'text' ? 4 : 1}
            keyboardType={inputType === 'link' ? 'url' : 'default'}
            autoCapitalize="none"
          />
          {inputType === 'link' && <Link color={colors.textSecondary} size={20} style={styles.inputIcon} />}
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <AlertTriangle color="#EF4444" size={16} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.verifyButton, { backgroundColor: colors.primary }, !newsInput.trim() && { backgroundColor: colors.textSecondary }]}
          onPress={handleVerify}
          disabled={!newsInput.trim() || loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <RefreshCcw color="#FFFFFF" size={18} />
              <Text style={styles.buttonText}>Verificar</Text>
            </>
          )}
        </TouchableOpacity>

        {verificationCount !== null && (
          <Text style={[styles.verificationCount, { color: colors.textSecondary }]}>
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
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
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
  },
  inputTypeToggle: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
  },
  activeToggle: {
    // Styles applied via theme colors
  },
  toggleText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
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
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlignVertical: 'top',
    paddingRight: 40,
  },
  inputFocused: {
    // Styles applied via theme colors
  },
  inputIcon: {
    position: 'absolute',
    right: 12,
    top: Platform.OS === 'ios' ? 14 : 12,
  },
  verifyButton: {
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    // Styles applied via theme colors
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
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});