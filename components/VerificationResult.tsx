import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle, ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NewsVerification } from '@/types';

interface VerificationResultProps {
  result: NewsVerification;
  onClose: () => void;
}

export default function VerificationResult({ result, onClose }: VerificationResultProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onClose}>
        <ArrowLeft size={24} color="#2563EB" />
        <Text style={styles.backText}>Nova verificação</Text>
      </TouchableOpacity>

      <View 
        style={[
          styles.statusBanner, 
          result.isTrue ? styles.trueBanner : styles.falseBanner
        ]}>
        {result.isTrue ? (
          <CheckCircle size={24} color="#FFFFFF" />
        ) : (
          <XCircle size={24} color="#FFFFFF" />
        )}
        <Text style={styles.statusText}>
          {result.isTrue ? 'Notícia Verdadeira' : 'Notícia Falsa'}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notícia analisada:</Text>
          <Text style={styles.newsContent}>{result.news}</Text>
          {result.source && (
            <Text style={styles.source}>Fonte: {result.source}</Text>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Análise:</Text>
          <Text style={styles.analysisText}>{result.explanation}</Text>
        </View>

        {result.relatedFacts && result.relatedFacts.length > 0 && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fatos relacionados:</Text>
              {result.relatedFacts.map((fact, index) => (
                <View key={index} style={styles.factItem}>
                  <AlertCircle size={16} color="#6B7280" />
                  <Text style={styles.factText}>{fact}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={styles.verifiedAt}>
          <Text style={styles.verifiedAtText}>
            Verificado em: {new Date(result.verifiedAt).toLocaleDateString('pt-BR', {
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backText: {
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
    fontSize: 16,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  trueBanner: {
    backgroundColor: '#22C55E',
  },
  falseBanner: {
    backgroundColor: '#EF4444',
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
    color: '#111827',
    marginBottom: 8,
  },
  newsContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
  },
  source: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  analysisText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
  },
  factItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  factText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1F2937',
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
    color: '#6B7280',
  },
});