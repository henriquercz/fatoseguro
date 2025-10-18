import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Share, Alert } from 'react-native';
import { CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle, ArrowLeft, Share2 } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NewsVerification } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

interface VerificationResultProps {
  result: NewsVerification;
  onClose: () => void;
}

export default function VerificationResult({ result, onClose }: VerificationResultProps) {
  const { colors } = useTheme();
  const [showFullContent, setShowFullContent] = useState(false);
  const viewShotRef = useRef<View>(null);

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

  const handleShare = async () => {
    try {
      if (!viewShotRef.current) {
        Alert.alert('Erro', 'Não foi possível capturar a tela.');
        return;
      }

      // Capturar screenshot da view
      const uri = await captureRef(viewShotRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      const statusText = 
        result.verification_status === 'VERDADEIRO' ? 'VERDADEIRA' : 
        result.verification_status === 'FALSO' ? 'FALSA' : 'INDETERMINADA';
      
      const hashtags = generateHashtags();
      const shareMessage = `✅ Verificado por CheckNow\n📍 Instagram: @checknow.br\n\n${hashtags}`;

      // Verificar se o dispositivo suporta compartilhamento
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: `CheckNow - Notícia ${statusText}`,
          UTI: 'public.png',
        });
      } else {
        // Fallback para Share nativo (apenas texto)
        const newsTitle = result.news_title || result.news_content?.substring(0, 100) || 'Notícia verificada';
        const summary = result.verification_summary?.substring(0, 150) || '';
        const statusEmoji = result.verification_status === 'VERDADEIRO' ? '✅' : result.verification_status === 'FALSO' ? '❌' : '⚠️';
        
        await Share.share({
          message: `${statusEmoji} NOTÍCIA ${statusText}\n\n"📰 ${newsTitle}"\n\n🔍 Análise: ${summary}${summary.length >= 150 ? '...' : ''}\n\n${shareMessage}`,
          title: `CheckNow - Notícia ${statusText}`,
        });
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      Alert.alert('Erro', 'Não foi possível compartilhar a verificação.');
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
          <Text style={styles.statusText}>
            {result.verification_status === 'VERDADEIRO' ? 'Notícia Verdadeira' : 
             result.verification_status === 'INDETERMINADO' ? 'Notícia Indeterminada' : 
             'Notícia Falsa'}
          </Text>
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

      {/* View capturável para screenshot */}
      <View ref={viewShotRef} collapsable={false} style={{ flex: 1, backgroundColor: colors.background }}>
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
      </View>
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
    borderRadius: 8,
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
    marginLeft: 8,
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
});