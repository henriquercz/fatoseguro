import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import {
  X,
  Moon,
  Sun,
  Globe,
  Shield,
  Smartphone,
  Trash2,
  LogOut,
  Instagram,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import PrivacyPolicyModal from '@/components/PrivacyPolicyModal';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { logout, user } = useAuth();
  const { isDarkMode, toggleDarkMode, colors } = useTheme();
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);

  const handleOpenInstagram = async () => {
    const instagramUrl = 'https://instagram.com/checknow.br';
    try {
      const supported = await Linking.canOpenURL(instagramUrl);
      if (supported) {
        await Linking.openURL(instagramUrl);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o Instagram.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao tentar abrir o Instagram.');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            // Implementar lógica de exclusão de conta
            Alert.alert('Funcionalidade em desenvolvimento');
          },
        },
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showSwitch = false, 
    switchValue = false, 
    onSwitchChange 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
  }) => (
    <TouchableOpacity 
      style={[styles.settingItem, { backgroundColor: colors.surface }]} 
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: colors.background }]}>
          {icon}
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      {showSwitch && (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={switchValue ? '#FFFFFF' : '#FFFFFF'}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Configurações</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Aparência */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Aparência</Text>
              
              <SettingItem
                icon={isDarkMode ? <Moon size={20} color={colors.textSecondary} /> : <Sun size={20} color={colors.textSecondary} />}
                title="Modo Escuro"
                subtitle="Ativar tema escuro"
                showSwitch
                switchValue={isDarkMode}
                onSwitchChange={toggleDarkMode}
              />
              
              <SettingItem
                icon={<Globe size={20} color={colors.textSecondary} />}
                title="Idioma"
                subtitle="Português (Brasil)"
                onPress={() => Alert.alert('Funcionalidade em desenvolvimento')}
              />
            </View>

            {/* Redes Sociais */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Redes Sociais</Text>
              
              <SettingItem
                icon={<Instagram size={20} color="#E4405F" />}
                title="Siga-nos no Instagram"
                subtitle="@checknow.br"
                onPress={handleOpenInstagram}
              />
            </View>

            {/* Privacidade e Dados */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Privacidade e Dados</Text>
              
              <SettingItem
                icon={<Shield size={20} color={colors.textSecondary} />}
                title="Política de Privacidade"
                subtitle="Veja como protegemos seus dados"
                onPress={() => setPrivacyModalVisible(true)}
              />
            </View>

            {/* Informações da Conta */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Informações da Conta</Text>
              
              <View style={[styles.accountInfo, { backgroundColor: colors.surface }]}>
                <View style={styles.accountRow}>
                  <Text style={[styles.accountLabel, { color: colors.textSecondary }]}>Email:</Text>
                  <Text style={[styles.accountValue, { color: colors.text }]}>{user?.email}</Text>
                </View>
                <View style={styles.accountRow}>
                  <Text style={[styles.accountLabel, { color: colors.textSecondary }]}>Plano:</Text>
                  <Text style={[styles.accountValue, { color: colors.text }, user?.isPremium && { color: colors.success || '#059669' }]}>
                    {user?.isPremium ? 'Premium' : 'Gratuito'}
                  </Text>
                </View>
                <View style={styles.accountRow}>
                  <Text style={[styles.accountLabel, { color: colors.textSecondary }]}>Plataforma:</Text>
                  <Text style={[styles.accountValue, { color: colors.text }]}>Web</Text>
                </View>
              </View>
            </View>

            {/* Zona de Perigo */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Zona de Perigo</Text>
              
              <SettingItem
                icon={<Trash2 size={20} color="#EF4444" />}
                title="Excluir Conta"
                subtitle="Remover permanentemente sua conta e dados"
                onPress={handleDeleteAccount}
              />
            </View>

            {/* Botão de Logout */}
            <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={logout}>
              <LogOut size={20} color="#EF4444" />
              <Text style={[styles.logoutText, { color: colors.text }]}>Sair da Conta</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      <PrivacyPolicyModal
        visible={privacyModalVisible}
        onClose={() => setPrivacyModalVisible(false)}
      />
    </>
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
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  accountInfo: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  accountLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  accountValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  premiumText: {
    // Cor aplicada via tema
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 24,
    marginBottom: 40,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
});