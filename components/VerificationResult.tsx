import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Share, Alert } from 'react-native';
import { CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle, ArrowLeft, Share2 } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NewsVerification } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

interface VerificationResultProps {
  result: NewsVerification;
  onClose: () => void;
}

export default function VerificationResult({ result, onClose }: VerificationResultProps) {
  const { colors } = useTheme();
  const [showFullContent, setShowFullContent] = useState(false);

  const handleShare = async () => {
    try {
      const statusEmoji = 
        result.verification_status === 'VERDADEIRO' ? '✅' : 
        result.verification_status === 'FALSO' ? '❌' : '⚠️';
      
      const statusText = 
        result.verification_status === 'VERDADEIRO' ? 'VERDADEIRA' : 
        result.verification_status === 'FALSO' ? 'FALSA' : 'INDETERMINADA';
      
      const newsTitle = result.news_title || result.news_content?.substring(0, 100) || 'Notícia verificada';
      
      const shareMessage = `${statusEmoji} NOTÍCIA ${statusText}\n\n“${newsTitle}”\n\n🔍 Verificado por: CheckNow\n🤖 Análise com IA e checagem de fontes\n\n📱 Baixe o app e verifique suas notícias!\n📍 Instagram: @checknow.br\n\n#CheckNow #FakeNews #Verificação`;
      
      await Share.share({
        message: shareMessage,
        title: `CheckNow - Notícia ${statusText}`,
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
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
      {/* Botão de voltar removido - agora está no header */}

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

        {/* Botão de compartilhamento */}
        <TouchableOpacity 
          style={[styles.shareButton, { backgroundColor: colors.primary }]}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Share2 size={20} color="#FFFFFF" />
          <Text style={styles.shareButtonText}>Compartilhar Verificação</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    marginBottom: 16,
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
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginLeft: 8,
  },
});