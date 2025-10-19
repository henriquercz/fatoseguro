import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Share, Alert, Image, Linking, Modal, ActivityIndicator } from 'react-native';
import { CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle, ArrowLeft, Share2, Instagram } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NewsVerification } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

interface VerificationResultProps {
  result: NewsVerification;
  onClose: () => void;
}

export default function VerificationResult({ result, onClose }: VerificationResultProps) {
  const { colors } = useTheme();
  const [showFullContent, setShowFullContent] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const viewShotRef = useRef<View>(null);
  const capturedImageUri = useRef<string | null>(null);

  // Garantir que o card esteja renderizado antes de permitir captura
  useEffect(() => {
    const timer = setTimeout(() => {
      setCardReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const generateHashtags = () => {
    const newsTitle = result.news_title || result.news_content || '';
    const hashtags = ['CheckNow'];
    
    // Adicionar hashtag baseada no status
    if (result.verification_status === 'VERDADEIRO') {
      hashtags.push('NotíciaVerdadeira');
    } else if (result.verification_status === 'FALSO') {
      hashtags.push('FakeNews', 'NotíciaFalsa');
    } else {
      hashtags.push('Verificação');
    }
    
    // Extrair palavras-chave do título (palavras com mais de 5 letras)
    const words = newsTitle
      .toLowerCase()
      .replace(/[^a-záéíóúâêîôûãõç\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 5);
    
    // Adicionar até 2 palavras-chave relevantes
    const relevantWords = [...new Set(words)].slice(0, 2);
    relevantWords.forEach(word => {
      const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
      hashtags.push(capitalized);
    });
    
    return hashtags.map(tag => `#${tag}`).join(' ');
  };

  const captureImage = async () => {
    // Android: Usar abordagem mais estável
    if (Platform.OS === 'android') {
      return await captureImageAndroid();
    }
    // iOS: Manter abordagem original
    return await captureImageIOS();
  };

  const captureImageIOS = async () => {
    try {
      if (!viewShotRef.current || !cardReady) {
        console.log('⚠️ iOS: View não está pronta para captura');
        return null;
      }

      console.log('📸 iOS: Capturando screenshot do card...');
      const uri = await captureRef(viewShotRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });
      
      console.log('✅ iOS: Screenshot capturado:', uri);
      return uri;
    } catch (error) {
      console.error('❌ iOS: Erro ao capturar imagem:', error);
      return null;
    }
  };

  const captureImageAndroid = async () => {
    // Android: DESABILITADO - Sempre retorna null para evitar travamentos
    // O compartilhamento no Android será APENAS TEXTO
    console.log('📱 Android: Screenshot desabilitado, usando apenas texto');
    return null;
  };

  const shareToInstagramStories = async () => {
    try {
      console.log('📱 Iniciando compartilhamento para Instagram Stories...');
      
      // Android: Sempre usa texto
      if (Platform.OS === 'android') {
        console.log('📱 Android: Compartilhando apenas texto');
        await shareTextOnly();
        return;
      }
      
      // iOS: Tenta usar imagem
      setIsCapturing(true);
      const uri = capturedImageUri.current || await captureImage();
      
      if (!uri) {
        console.log('⚠️ iOS: Sem imagem, compartilhando apenas texto');
        setIsCapturing(false);
        await shareTextOnly();
        return;
      }

      // Verificar se o Instagram está instalado
      const canOpen = await Linking.canOpenURL('instagram://story-camera');
      
      if (canOpen) {
        console.log('✅ Instagram detectado, compartilhando...');
        
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          UTI: 'public.png',
        });
        
        setShowShareModal(false);
        setIsCapturing(false);
      } else {
        setIsCapturing(false);
        Alert.alert(
          'Instagram não encontrado',
          'Instale o Instagram para compartilhar nos Stories.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Instalar', 
              onPress: () => {
                const storeUrl = Platform.OS === 'ios' 
                  ? 'https://apps.apple.com/app/instagram/id389801252'
                  : 'https://play.google.com/store/apps/details?id=com.instagram.android';
                Linking.openURL(storeUrl);
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('❌ Erro ao compartilhar no Instagram:', error);
      setIsCapturing(false);
      Alert.alert('Erro', 'Não foi possível compartilhar no Instagram Stories.');
    }
  };

  const shareNormal = async () => {
    try {
      console.log('📤 Iniciando compartilhamento normal...');
      
      const statusText = 
        result.verification_status === 'VERDADEIRO' ? 'VERDADEIRA' : 
        result.verification_status === 'FALSO' ? 'FALSA' : 'INDETERMINADA';
      
      const newsTitle = result.news_title || result.news_content?.substring(0, 100) || 'Notícia verificada';
      const summary = result.verification_summary?.substring(0, 150) || '';
      const statusEmoji = result.verification_status === 'VERDADEIRO' ? '✅' : result.verification_status === 'FALSO' ? '❌' : '⚠️';
      const hashtags = generateHashtags();
      
      const shareMessage = `${statusEmoji} NOTÍCIA ${statusText}\n\n"📰 ${newsTitle}"\n\n🔍 Análise: ${summary}${summary.length >= 150 ? '...' : ''}\n\n✅ Verificado por CheckNow\n📍 Instagram: @checknow.br\n\n${hashtags}`;

      // Android: SEMPRE compartilha apenas texto (sem imagem)
      if (Platform.OS === 'android') {
        console.log('📱 Android: Compartilhando apenas texto');
        await Share.share(
          {
            message: shareMessage,
            title: `CheckNow - Notícia ${statusText}`,
          },
          {
            dialogTitle: `CheckNow - Notícia ${statusText}`,
          }
        );
        setShowShareModal(false);
        return;
      }
      
      // iOS: Tenta usar imagem
      setIsCapturing(true);
      const uri = capturedImageUri.current || await captureImage();
      
      if (!uri) {
        console.log('⚠️ iOS: Sem imagem, compartilhando apenas texto');
        await Share.share(
          {
            message: shareMessage,
            title: `CheckNow - Notícia ${statusText}`,
          },
          {
            dialogTitle: `CheckNow - Notícia ${statusText}`,
          }
        );
      } else {
        console.log('✅ iOS: Compartilhando com imagem:', uri);
        await Share.share(
          {
            message: shareMessage,
            url: uri,
            title: `CheckNow - Notícia ${statusText}`,
          },
          {
            dialogTitle: `CheckNow - Notícia ${statusText}`,
          }
        );
      }
      
      setShowShareModal(false);
      setIsCapturing(false);
    } catch (error) {
      console.error('❌ Erro ao compartilhar:', error);
      setIsCapturing(false);
      Alert.alert('Erro', 'Não foi possível compartilhar a verificação.');
    }
  };

  const shareTextOnly = async () => {
    try {
      const statusText = 
        result.verification_status === 'VERDADEIRO' ? 'VERDADEIRA' : 
        result.verification_status === 'FALSO' ? 'FALSA' : 'INDETERMINADA';
      
      const newsTitle = result.news_title || result.news_content?.substring(0, 100) || 'Notícia verificada';
      const summary = result.verification_summary?.substring(0, 150) || '';
      const statusEmoji = result.verification_status === 'VERDADEIRO' ? '✅' : result.verification_status === 'FALSO' ? '❌' : '⚠️';
      const hashtags = generateHashtags();
      
      const shareMessage = `${statusEmoji} NOTÍCIA ${statusText}\n\n"📰 ${newsTitle}"\n\n🔍 Análise: ${summary}${summary.length >= 150 ? '...' : ''}\n\n✅ Verificado por CheckNow\n📍 Instagram: @checknow.br\n\n${hashtags}`;

      await Share.share(
        {
          message: shareMessage,
          title: `CheckNow - Notícia ${statusText}`,
        },
        {
          dialogTitle: `CheckNow - Notícia ${statusText}`,
        }
      );
      
      setShowShareModal(false);
    } catch (error) {
      console.error('❌ Erro ao compartilhar texto:', error);
      Alert.alert('Erro', 'Não foi possível compartilhar.');
    }
  };

  const handleShare = async () => {
    console.log('🎯 Botão de compartilhar clicado');

    // FLUXO NATIVO PARA ANDROID: SEM MODAL
    if (Platform.OS === 'android') {
      console.log('📱 Android: Iniciando fluxo de compartilhamento nativo direto...');
      await shareTextOnly();
      return;
    }

    // FLUXO CUSTOMIZADO PARA IOS: COM MODAL E IMAGEM
    try {
      setShowShareModal(true);
      if (cardReady) {
        console.log('📸 iOS: Capturando imagem em background...');
        const uri = await captureImage();
        if (uri) {
          capturedImageUri.current = uri;
          console.log('✅ iOS: Imagem capturada e armazenada');
        }
      }
    } catch (error) {
      console.error('❌ iOS: Erro ao preparar compartilhamento:', error);
      setShowShareModal(true);
    }
  };
  
  // Detectar se é um link (URL) ou texto
  const isUrl = result.news_url ? true : false;
  const content = result.news_content || '';
  const contentLength = content.length;
  // Só truncar se não tiver título e o conteúdo for longo
  const shouldTruncate = !result.news_title && contentLength > 150;

  const displayContent = () => {
    // Priorizar título se disponível, independente de ser URL ou não
    if (result.news_title) {
      return result.news_title;
    }
    
    // Se não tem título, usar o conteúdo
    if (shouldTruncate && !showFullContent) {
      return content.substring(0, 150) + '...';
    }
    
    return content;
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.statusContainer}>
        <View 
          style={[
            styles.statusBanner, 
            result.verification_status === 'VERDADEIRO' ? styles.trueBanner : 
            result.verification_status === 'INDETERMINADO' ? styles.indeterminateBanner : 
            styles.falseBanner
          ]}>
          {result.verification_status === 'VERDADEIRO' ? (
            <CheckCircle size={24} color="#FFFFFF" />
          ) : result.verification_status === 'INDETERMINADO' ? (
            <AlertCircle size={24} color="#FFFFFF" />
          ) : (
            <XCircle size={24} color="#FFFFFF" />
          )}
          <View style={styles.statusTextContainer}>
            <Text style={styles.statusText}>
              {result.verification_status === 'VERDADEIRO' ? 'Notícia Verdadeira' : 
               result.verification_status === 'INDETERMINADO' ? 'Notícia Indeterminada' : 
               'Notícia Falsa'}
            </Text>
            {result.fromCache && (
              <Text style={styles.cacheBadge}>⚡ Resultado instantâneo</Text>
            )}
          </View>
        </View>
        
        {/* Botão de compartilhamento compacto */}
        <TouchableOpacity 
          style={[styles.shareButtonCompact, { backgroundColor: colors.primary }]}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Share2 size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notícia analisada:</Text>
          <Text style={[styles.newsContent, { color: colors.text, fontSize: isUrl ? 16 : 14 }]}>
            {displayContent()}
          </Text>
          {shouldTruncate && (
            <TouchableOpacity onPress={() => setShowFullContent(!showFullContent)}>
              <Text style={[styles.readMoreText, { color: colors.primary }]}>
                {showFullContent ? 'Ler menos' : 'Ler mais'}
              </Text>
            </TouchableOpacity>
          )}
          {result.source && (
            <Text style={[styles.source, { color: colors.textSecondary }]}>Fonte: {result.source}</Text>
          )}
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Análise:</Text>
          <Text style={[styles.analysisText, { color: colors.text }]}>{result.verification_summary || result.explanation}</Text>
        </View>

        {result.related_facts && result.related_facts.length > 0 && (
          <>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Fatos relacionados:</Text>
              {result.related_facts.map((fact: string, index: number) => (
                <View key={index} style={[styles.factItem, { backgroundColor: colors.surface }]}>
                  <AlertCircle size={16} color={colors.textSecondary} />
                  <Text style={[styles.factText, { color: colors.text }]}>{fact}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={styles.verifiedAt}>
          <Text style={[styles.verifiedAtText, { color: colors.textSecondary }]}>
            Verificado em: {new Date(result.verified_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </ScrollView>

      {/* Modal de escolha de compartilhamento (APENAS iOS) */}
      {Platform.OS === 'ios' && (
      <Modal
        visible={showShareModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isCapturing) {
            setShowShareModal(false);
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Compartilhar Verificação</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>Escolha onde deseja compartilhar</Text>
            
            {isCapturing && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Preparando imagem...</Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={[styles.shareOption, { backgroundColor: colors.background, opacity: isCapturing ? 0.5 : 1 }]}
              onPress={shareToInstagramStories}
              disabled={isCapturing}
            >
              <View style={styles.instagramGradient}>
                <Instagram size={28} color="#FFFFFF" />
              </View>
              <View style={styles.shareOptionText}>
                <Text style={[styles.shareOptionTitle, { color: colors.text }]}>Instagram Stories</Text>
                <Text style={[styles.shareOptionSubtitle, { color: colors.textSecondary }]}>Compartilhar como sticker interativo</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.shareOption, { backgroundColor: colors.background, opacity: isCapturing ? 0.5 : 1 }]}
              onPress={shareNormal}
              disabled={isCapturing}
            >
              <View style={[styles.shareOptionIcon, { backgroundColor: colors.primary }]}>
                <Share2 size={24} color="#FFFFFF" />
              </View>
              <View style={styles.shareOptionText}>
                <Text style={[styles.shareOptionTitle, { color: colors.text }]}>Outros Apps</Text>
                <Text style={[styles.shareOptionSubtitle, { color: colors.textSecondary }]}>WhatsApp, Telegram, etc.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.cancelButton, { borderColor: colors.border }]}
              onPress={() => {
                if (!isCapturing) {
                  setShowShareModal(false);
                }
              }}
              disabled={isCapturing}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      )}

      {/* Card customizado para screenshot (oculto) - APENAS iOS */}
      {Platform.OS === 'ios' && (
        <View style={styles.hiddenCard} pointerEvents="none">
          <View 
            ref={viewShotRef} 
            collapsable={false}
            style={[styles.shareCard, { backgroundColor: colors.surface }]}
          >
          {/* Header com logo */}
          <View style={styles.shareCardHeader}>
            <Image 
              source={require('@/assets/images/icon.png')} 
              style={styles.shareCardLogoImage}
              resizeMode="contain"
            />
          </View>

          {/* Status */}
          <View style={[
            styles.shareCardStatus,
            result.verification_status === 'VERDADEIRO' ? { backgroundColor: '#22C55E' } :
            result.verification_status === 'FALSO' ? { backgroundColor: '#EF4444' } :
            { backgroundColor: '#F59E0B' }
          ]}>
            {result.verification_status === 'VERDADEIRO' ? (
              <CheckCircle size={32} color="#FFFFFF" />
            ) : result.verification_status === 'FALSO' ? (
              <XCircle size={32} color="#FFFFFF" />
            ) : (
              <AlertCircle size={32} color="#FFFFFF" />
            )}
            <Text style={styles.shareCardStatusText}>
              {result.verification_status === 'VERDADEIRO' ? 'NOTÍCIA VERDADEIRA' :
               result.verification_status === 'FALSO' ? 'NOTÍCIA FALSA' :
               'NOTÍCIA INDETERMINADA'}
            </Text>
          </View>

          {/* Conteúdo */}
          <View style={styles.shareCardContent}>
            <Text style={[styles.shareCardTitle, { color: colors.text }]} numberOfLines={3}>
              {result.news_title || result.news_content?.substring(0, 120) || 'Notícia verificada'}
            </Text>
            <Text style={[styles.shareCardSummary, { color: colors.textSecondary }]} numberOfLines={4}>
              {result.verification_summary?.substring(0, 180) || ''}
            </Text>
          </View>

          {/* Footer */}
          <View style={[styles.shareCardFooter, { borderTopColor: colors.border }]}>
            <Text style={[styles.shareCardFooterText, { color: colors.textSecondary }]}>
              📍 Instagram: @checknow.br
            </Text>
          </View>
        </View>
      </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    gap: 8,
  },
  statusBanner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 12,
  },
  shareButtonCompact: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  trueBanner: {
    backgroundColor: '#22C55E',
  },
  falseBanner: {
    backgroundColor: '#EF4444',
  },
  indeterminateBanner: {
    backgroundColor: '#F59E0B',
  },
  statusText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 8,
  },
  newsContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  source: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  analysisText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  factItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  factText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  verifiedAt: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  verifiedAtText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  readMoreText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  scrollContent: {
    paddingBottom: 140, // Espaço para o FloatingTabBar (100px) + margem extra (40px)
  },
  hiddenCard: {
    position: 'absolute',
    left: -9999,
    top: -9999,
    opacity: 0,
  },
  shareCard: {
    width: 400,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  shareCardHeader: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  shareCardLogoImage: {
    width: 100,
    height: 100,
  },
  shareCardStatus: {
    padding: 14,
    alignItems: 'center',
    gap: 12,
  },
  shareCardStatusText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  statusTextContainer: {
    alignItems: 'center',
  },
  cacheBadge: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 2,
  },
  shareCardContent: {
    padding: 20,
    gap: 12,
  },
  shareCardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    lineHeight: 24,
  },
  shareCardSummary: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  shareCardFooter: {
    padding: 16,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  shareCardFooterText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 24,
    textAlign: 'center',
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 16,
  },
  instagramGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E4405F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareOptionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareOptionText: {
    flex: 1,
  },
  shareOptionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  shareOptionSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  cancelButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});