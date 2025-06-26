import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { X, Send, Star } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ visible, onClose }: FeedbackModalProps) {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Bug/Erro',
    'Sugestão de Melhoria',
    'Nova Funcionalidade',
    'Problema de Performance',
    'Interface/Design',
    'Outro',
  ];

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('Erro', 'Por favor, escreva sua mensagem.');
      return;
    }

    if (!category) {
      Alert.alert('Erro', 'Por favor, selecione uma categoria.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Aqui você pode implementar o envio do feedback para o backend
      // Por exemplo, usando Supabase ou uma API
      const feedbackData = {
        user_id: user?.id,
        user_email: user?.email,
        rating,
        category,
        message: message.trim(),
        created_at: new Date().toISOString(),
        app_version: '1.0.1',
        platform: Platform.OS,
      };

      // Simular envio (substituir por implementação real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Feedback enviado:', feedbackData);
      
      Alert.alert(
        'Feedback Enviado!',
        'Obrigado pelo seu feedback. Nossa equipe irá analisá-lo em breve.',
        [{ text: 'OK', onPress: handleClose }]
      );
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      Alert.alert(
        'Erro',
        'Não foi possível enviar o feedback. Tente novamente mais tarde.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setCategory('');
    setMessage('');
    onClose();
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <Star
              size={32}
              color={star <= rating ? '#FFD700' : '#E5E7EB'}
              fill={star <= rating ? '#FFD700' : 'transparent'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Enviar Feedback</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Avaliação */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Como você avalia o app?</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>Opcional</Text>
            {renderStars()}
          </View>

          {/* Categoria */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Categoria *</Text>
            <View style={styles.categoriesContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    category === cat && [styles.categoryButtonSelected, { backgroundColor: colors.primary, borderColor: colors.primary }],
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      { color: colors.textSecondary },
                      category === cat && [styles.categoryTextSelected, { color: colors.surface }],
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Mensagem */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Sua mensagem *</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Descreva detalhadamente seu feedback, sugestão ou problema
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              multiline
              numberOfLines={6}
              placeholder="Digite sua mensagem aqui..."
              placeholderTextColor={colors.textSecondary}
              value={message}
              onChangeText={setMessage}
              textAlignVertical="top"
            />
          </View>

          {/* Informações do usuário */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Informações</Text>
            <View style={[styles.infoContainer, { backgroundColor: colors.surface }]}>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>Email: {user?.email}</Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>Versão: 1.0.1</Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>Plataforma: {Platform.OS}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: colors.primary },
              (!message.trim() || !category || isSubmitting) && [styles.submitButtonDisabled, { backgroundColor: colors.textSecondary }],
            ]}
            onPress={handleSubmit}
            disabled={!message.trim() || !category || isSubmitting}
          >
            <Send size={20} color={colors.surface} />
            <Text style={[styles.submitButtonText, { color: colors.surface }]}>
              {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  starButton: {
    padding: 4,
    marginHorizontal: 4,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryButtonSelected: {
    // Styles applied via theme colors
  },
  categoryText: {
    fontSize: 14,
  },
  categoryTextSelected: {
    // Styles applied via theme colors
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
  },
  infoContainer: {
    padding: 12,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  submitButtonDisabled: {
    // Styles applied via theme colors
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});