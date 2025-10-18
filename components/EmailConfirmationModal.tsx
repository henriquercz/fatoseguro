/**
 * Modal de confirmação de email antes do cadastro
 * Previne uso de emails falsos e informa sobre verificação
 * 
 * @author CheckNow Team
 * @version 1.0.0
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Mail, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface EmailConfirmationModalProps {
  visible: boolean;
  email: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function EmailConfirmationModal({
  visible,
  email,
  onConfirm,
  onCancel,
}: EmailConfirmationModalProps) {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.surface }]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Ícone principal */}
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
              <Mail size={48} color={colors.primary} />
            </View>

            {/* Título */}
            <Text style={[styles.title, { color: colors.text }]}>
              Confirme seu Email
            </Text>

            {/* Email informado */}
            <View style={[styles.emailContainer, { backgroundColor: colors.background }]}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Email informado:
              </Text>
              <Text style={[styles.email, { color: colors.primary }]}>
                {email}
              </Text>
            </View>

            {/* Aviso importante */}
            <View style={[styles.warningBox, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
              <AlertCircle size={24} color="#F59E0B" style={styles.warningIcon} />
              <View style={styles.warningTextContainer}>
                <Text style={[styles.warningTitle, { color: '#F59E0B' }]}>
                  ⚠️ Importante
                </Text>
                <Text style={[styles.warningText, { color: colors.textSecondary }]}>
                  • Use um email <Text style={styles.bold}>REAL e válido</Text>
                  {'\n'}• Você receberá um <Text style={styles.bold}>link de verificação</Text>
                  {'\n'}• Sem verificação, <Text style={styles.bold}>não poderá usar o app</Text>
                  {'\n'}• Emails falsos serão <Text style={styles.bold}>bloqueados</Text>
                </Text>
              </View>
            </View>

            {/* Informação adicional */}
            <View style={[styles.infoBox, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '20' }]}>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                📧 O email será enviado pela <Text style={[styles.bold, { color: colors.primary }]}>Supabase</Text>.
                {'\n'}Verifique também sua caixa de spam.
              </Text>
            </View>

            {/* Botões */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                onPress={onCancel}
                activeOpacity={0.7}
              >
                <ArrowLeft size={18} color={colors.textSecondary} />
                <Text style={[styles.buttonText, { color: colors.textSecondary }]}>
                  Voltar e Alterar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.confirmButton, { backgroundColor: colors.primary }]}
                onPress={onConfirm}
                activeOpacity={0.7}
              >
                <Text style={[styles.buttonText, styles.confirmButtonText]}>
                  Prosseguir
                </Text>
                <ArrowRight size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  scrollContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  emailContainer: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 8,
  },
  email: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    textAlign: 'center',
  },
  warningBox: {
    width: '100%',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  warningIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: 8,
  },
  warningText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 22,
  },
  bold: {
    fontFamily: 'Inter-Bold',
  },
  infoBox: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 24,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  confirmButtonText: {
    color: '#FFFFFF',
  },
});
