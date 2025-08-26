import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Share,
  Alert,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { X, Share2, Copy, Users } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface InviteFriendsModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export default function InviteFriendsModal({ visible, onClose }: InviteFriendsModalProps) {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [qrValue, setQrValue] = useState('');
  const [shareText, setShareText] = useState('');

  // URL do app no Expo (substitua pela URL real do seu projeto)
  const expoUrl = 'https://sl1nk.com/checknow';
  const playStoreUrl = 'https://sl1nk.com/checknow';
  const appStoreUrl = 'https://sl1nk.com/checknow';

  useEffect(() => {
    if (visible) {
      // Gerar código de convite único (pode ser implementado com backend)
      const inviteCode = user?.id ? `INVITE_${user.id.slice(0, 8).toUpperCase()}` : 'INVITE_DEMO';
      
      const qrData = {
        type: 'invite',
        code: inviteCode,
        expoUrl,
        playStoreUrl,
        appStoreUrl,
      };
      
      setQrValue(JSON.stringify(qrData));
      
      const text = `🔍 Descubra a verdade sobre as notícias com o Check Now!\n\n` +
        `Eu uso este app incrível para verificar se as notícias são verdadeiras ou falsas. ` +
        `É super fácil e rápido!\n\n` +
        `📱 Baixe agora:\n` +
        `• Expo: ${expoUrl}\n` +
        `• Android: ${playStoreUrl}\n` +
        `• iOS: ${appStoreUrl}\n\n` +
        `🎁 Use meu código de convite: ${inviteCode}\n\n` +
        `#CheckNow #FakeNews #FactCheck`;
      
      setShareText(text);
    }
  }, [visible, user]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: shareText,
        title: 'Convite para o Check Now',
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      Alert.alert('Erro', 'Não foi possível compartilhar o convite.');
    }
  };

  const handleCopyText = async () => {
    try {
      await Clipboard.setStringAsync(shareText);
      Alert.alert('Copiado!', 'Texto do convite copiado para a área de transferência.');
    } catch (error) {
      console.error('Erro ao copiar:', error);
      Alert.alert('Erro', 'Não foi possível copiar o texto.');
    }
  };

  const handleCopyExpoUrl = async () => {
    try {
      await Clipboard.setStringAsync(expoUrl);
      Alert.alert('Copiado!', 'Link do Expo copiado para a área de transferência.');
    } catch (error) {
      console.error('Erro ao copiar:', error);
      Alert.alert('Erro', 'Não foi possível copiar o link.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Convidar Amigos</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Descrição */}
          <View style={styles.section}>
            <View style={styles.iconContainer}>
              <Users size={32} color={colors.primary} />
            </View>
            <Text style={[styles.description, { color: colors.text }]}>
              Convide seus amigos para usar o Check Now e ajude a combater as fake news!
            </Text>
            <Text style={[styles.subdescription, { color: colors.textSecondary }]}>
              Compartilhe o QR Code ou envie o link diretamente.
            </Text>
          </View>

          {/* QR Code */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>QR Code do App</Text>
            <View style={[styles.qrContainer, { backgroundColor: colors.surface }]}>
              {qrValue ? (
                <QRCode
                  value={qrValue}
                  size={200}
                  backgroundColor={colors.surface}
                  color={colors.text}
                  logo={require('@/assets/images/icon.png')}
                  logoSize={40}
                  logoBackgroundColor={colors.surface}
                  logoMargin={2}
                  logoBorderRadius={8}
                />
              ) : (
                <View style={[styles.qrPlaceholder, { backgroundColor: colors.border }]}>
                  <Text style={[styles.qrPlaceholderText, { color: colors.textSecondary }]}>Gerando QR Code...</Text>
                </View>
              )}
            </View>
            <Text style={[styles.qrDescription, { color: colors.textSecondary }]}>
              {Platform.OS === 'ios' 
                ? 'Baixe o Expo Go na App Store e escaneie este código com a câmera do iPhone'
                : 'Baixe o Expo Go na Play Store e escaneie este código dentro do app Expo Go'
              }
            </Text>
          </View>

          {/* Links */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Links Diretos</Text>
            
            <TouchableOpacity style={[styles.linkItem, { backgroundColor: colors.surface }]} onPress={handleCopyExpoUrl}>
              <View style={styles.linkContent}>
                <Text style={[styles.linkTitle, { color: colors.text }]}>Expo Development</Text>
                <Text style={[styles.linkUrl, { color: colors.textSecondary }]}>{expoUrl}</Text>
              </View>
              <Copy size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.linkItem, { backgroundColor: colors.surface }]}>
              <View style={styles.linkContent}>
                <Text style={[styles.linkTitle, { color: colors.text }]}>Google Play Store</Text>
                <Text style={[styles.linkUrl, { color: colors.textSecondary }]}>{playStoreUrl}</Text>
              </View>
              <Copy size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.linkItem, { backgroundColor: colors.surface }]}>
              <View style={styles.linkContent}>
                <Text style={[styles.linkTitle, { color: colors.text }]}>Apple App Store</Text>
                <Text style={[styles.linkUrl, { color: colors.textSecondary }]}>{appStoreUrl}</Text>
              </View>
              <Copy size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Texto de convite */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Mensagem de Convite</Text>
            <View style={[styles.messageContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.messageText, { color: colors.text }]}>{shareText}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Botões de ação */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <TouchableOpacity style={[styles.copyButton, { backgroundColor: colors.background, borderColor: colors.primary }]} onPress={handleCopyText}>
            <Copy size={20} color={colors.primary} />
            <Text style={[styles.copyButtonText, { color: colors.primary }]}>Copiar Texto</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.shareButton, { backgroundColor: colors.primary }]} onPress={handleShare}>
            <Share2 size={20} color={colors.surface} />
            <Text style={[styles.shareButtonText, { color: colors.surface }]}>Compartilhar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  subdescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  qrContainer: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrPlaceholderText: {
    fontSize: 14,
  },
  qrDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  linkUrl: {
    fontSize: 12,
  },
  messageContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    gap: 12,
  },
  copyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  copyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});