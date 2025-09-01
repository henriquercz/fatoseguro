import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import {
  ArrowLeft,
  BookOpen,
  Shield,
  Eye,
  AlertTriangle,
  CheckCircle,
  Brain,
  Users,
  Search,
  Award,
  ChevronRight,
  Play,
  RotateCcw,
  Home,
} from 'lucide-react-native';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface EducationContent {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string[];
  tips: string[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Qual é o primeiro passo para verificar uma notícia suspeita?",
    options: [
      "Compartilhar imediatamente",
      "Verificar a fonte e data de publicação",
      "Acreditar se parece verdadeira",
      "Ignorar completamente"
    ],
    correctAnswer: 1,
    explanation: "Sempre verifique a fonte, autor e data antes de acreditar ou compartilhar qualquer notícia."
  },
  {
    id: 2,
    question: "O que são 'deepfakes'?",
    options: [
      "Notícias muito profundas",
      "Vídeos ou áudios manipulados por IA",
      "Fotos em alta resolução",
      "Notícias falsas escritas"
    ],
    correctAnswer: 1,
    explanation: "Deepfakes são conteúdos de mídia (vídeo, áudio, imagem) criados ou alterados usando inteligência artificial."
  },
  {
    id: 3,
    question: "Qual dessas NÃO é uma característica de fake news?",
    options: [
      "Linguagem sensacionalista",
      "Fontes verificáveis e múltiplas",
      "Apelo emocional excessivo",
      "Informações vagas ou imprecisas"
    ],
    correctAnswer: 1,
    explanation: "Notícias verdadeiras sempre apresentam fontes verificáveis e múltiplas perspectivas sobre os fatos."
  },
  {
    id: 4,
    question: "Antes de compartilhar uma notícia, você deve:",
    options: [
      "Verificar se é interessante",
      "Checar se seus amigos vão gostar",
      "Confirmar a veracidade em fontes confiáveis",
      "Compartilhar rapidamente antes que outros façam"
    ],
    correctAnswer: 2,
    explanation: "Sempre verifique a veracidade em múltiplas fontes confiáveis antes de compartilhar qualquer informação."
  },
  {
    id: 5,
    question: "O que fazer ao encontrar uma possível fake news?",
    options: [
      "Ignorar e seguir em frente",
      "Compartilhar com aviso de 'não sei se é verdade'",
      "Reportar e não compartilhar",
      "Debater nos comentários"
    ],
    correctAnswer: 2,
    explanation: "O melhor é reportar conteúdo suspeito às plataformas e nunca compartilhar, mesmo com avisos."
  }
];

const educationContent: EducationContent[] = [
  {
    id: 'what-is-fake-news',
    title: 'O que são Fake News?',
    icon: <AlertTriangle size={24} color="#EF4444" />,
    content: [
      'Fake News são informações falsas, enganosas ou distorcidas que são apresentadas como notícias verdadeiras.',
      'Elas podem ser completamente inventadas ou conter elementos de verdade misturados com mentiras.',
      'O objetivo geralmente é influenciar opiniões, gerar cliques, causar pânico ou promover agendas específicas.',
      'As fake news se espalham 6 vezes mais rápido que notícias verdadeiras nas redes sociais.'
    ],
    tips: [
      'Desconfie de manchetes muito sensacionalistas',
      'Verifique se outras fontes confiáveis reportaram o mesmo fato',
      'Observe erros de português ou formatação estranha',
      'Cheque a data da publicação - pode ser conteúdo antigo'
    ]
  },
  {
    id: 'how-to-identify',
    title: 'Como Identificar Fake News',
    icon: <Eye size={24} color="#3B82F6" />,
    content: [
      'Analise a fonte: sites confiáveis têm histórico, contato e transparência sobre seus jornalistas.',
      'Verifique múltiplas fontes: notícias verdadeiras aparecem em vários veículos respeitáveis.',
      'Observe a linguagem: fake news frequentemente usam linguagem emocional e sensacionalista.',
      'Cheque datas e contexto: imagens e vídeos antigos são frequentemente recontextualizados.'
    ],
    tips: [
      'Use ferramentas de fact-checking como Lupa, Aos Fatos e Comprova',
      'Pesquise por palavras-chave da notícia no Google',
      'Verifique se há consenso entre especialistas no assunto',
      'Desconfie de "descobertas" que só um site reporta'
    ]
  },
  {
    id: 'verification-tools',
    title: 'Ferramentas de Verificação',
    icon: <Search size={24} color="#10B981" />,
    content: [
      'Existem várias ferramentas gratuitas para verificar informações online.',
      'Fact-checkers profissionais: Agência Lupa, Aos Fatos, Comprova, E-Farsas.',
      'Busca reversa de imagens: Google Images, TinEye para verificar origem de fotos.',
      'Verificadores de vídeo: InVID, ferramentas que analisam metadados de vídeos.'
    ],
    tips: [
      'Salve nos favoritos sites de fact-checking',
      'Use a busca reversa sempre que suspeitar de uma imagem',
      'Verifique perfis sociais de quem compartilha a informação',
      'Consulte especialistas da área quando possível'
    ]
  },
  {
    id: 'impact-society',
    title: 'Impacto na Sociedade',
    icon: <Users size={24} color="#8B5CF6" />,
    content: [
      'Fake news podem influenciar eleições, causar pânico em saúde pública e prejudicar a democracia.',
      'Elas criam polarização social e destroem a confiança em instituições legítimas.',
      'Durante a pandemia, desinformação sobre saúde causou mortes evitáveis.',
      'O fenômeno afeta especialmente pessoas mais vulneráveis e com menor acesso à educação.'
    ],
    tips: [
      'Eduque familiares e amigos sobre o tema',
      'Não compartilhe informações sem verificar',
      'Promova o pensamento crítico em conversas',
      'Apoie jornalismo de qualidade e independente'
    ]
  },
  {
    id: 'digital-literacy',
    title: 'Letramento Digital',
    icon: <Brain size={24} color="#F59E0B" />,
    content: [
      'Letramento digital é a capacidade de usar tecnologias de forma crítica e responsável.',
      'Inclui entender como algoritmos funcionam e como eles podem criar "bolhas" de informação.',
      'Envolve reconhecer vieses pessoais que podem nos tornar mais suscetíveis a certas fake news.',
      'É uma habilidade essencial no século XXI, tão importante quanto ler e escrever.'
    ],
    tips: [
      'Diversifique suas fontes de informação',
      'Questione suas próprias crenças e preconceitos',
      'Entenda como funcionam os algoritmos das redes sociais',
      'Pratique o ceticismo saudável sem se tornar cínico'
    ]
  }
];

export default function EducationScreen() {
  const { colors } = useTheme();
  const [currentSection, setCurrentSection] = useState<'menu' | 'content' | 'quiz'>('menu');
  const [selectedContent, setSelectedContent] = useState<EducationContent | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  const handleBackPress = () => {
    if (currentSection === 'content' || currentSection === 'quiz') {
      setCurrentSection('menu');
      setSelectedContent(null);
      setQuizStarted(false);
      setQuizCompleted(false);
      setCurrentQuestionIndex(0);
      setScore(0);
    } else {
      router.replace('/');
    }
  };

  const handleContentSelect = (content: EducationContent) => {
    setSelectedContent(content);
    setCurrentSection('content');
  };

  const startQuiz = () => {
    setCurrentSection('quiz');
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setShowExplanation(true);
      if (answerIndex === quizQuestions[currentQuestionIndex].correctAnswer) {
        setScore(score + 1);
      }
    }, 500);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 80) return { message: "Excelente! Você é um expert em identificar fake news!", color: colors.success || "#10B981" };
    if (percentage >= 60) return { message: "Bom trabalho! Continue praticando para melhorar ainda mais.", color: colors.primary };
    return { message: "Continue estudando! A prática leva à perfeição.", color: "#EF4444" };
  };

  const renderMenu = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.welcomeSection}>
        <View style={[styles.welcomeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Shield size={48} color={colors.primary} />
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            Centro de Educação Digital
          </Text>
          <Text style={[styles.welcomeDescription, { color: colors.textSecondary }]}>
            Aprenda a identificar fake news e se tornar um cidadão mais informado e crítico no mundo digital.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          📚 Conteúdos Educativos
        </Text>
        {educationContent.map((content) => (
          <TouchableOpacity
            key={content.id}
            style={[styles.contentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => handleContentSelect(content)}
          >
            <View style={styles.contentHeader}>
              {content.icon}
              <Text style={[styles.contentTitle, { color: colors.text }]}>
                {content.title}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          🧠 Teste seus Conhecimentos
        </Text>
        <TouchableOpacity
          style={[styles.quizCard, { backgroundColor: colors.primary + '15', borderColor: colors.primary }]}
          onPress={startQuiz}
        >
          <View style={styles.quizHeader}>
            <Award size={32} color={colors.primary} />
            <View style={styles.quizInfo}>
              <Text style={[styles.quizTitle, { color: colors.text }]}>
                Quiz Interativo
              </Text>
              <Text style={[styles.quizDescription, { color: colors.textSecondary }]}>
                {quizQuestions.length} perguntas sobre verificação de notícias
              </Text>
            </View>
          </View>
          <View style={[styles.playButton, { backgroundColor: colors.primary }]}>
            <Play size={20} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    if (!selectedContent) return null;

    return (
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.contentDetailCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.contentDetailHeader}>
            {selectedContent.icon}
            <Text style={[styles.contentDetailTitle, { color: colors.text }]}>
              {selectedContent.title}
            </Text>
          </View>

          <View style={styles.contentBody}>
            {selectedContent.content.map((paragraph, index) => (
              <Text key={index} style={[styles.paragraph, { color: colors.text }]}>
                {paragraph}
              </Text>
            ))}
          </View>

          <View style={[styles.tipsSection, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.tipsTitle, { color: colors.primary }]}>
              💡 Dicas Práticas
            </Text>
            {selectedContent.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <CheckCircle size={16} color={colors.success || colors.primary} />
                <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderQuiz = () => {
    if (!quizStarted) return null;

    if (quizCompleted) {
      const scoreData = getScoreMessage();
      return (
        <View style={styles.content}>
          <View style={[styles.quizCompletedCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Award size={64} color={scoreData.color} />
            <Text style={[styles.quizCompletedTitle, { color: colors.text }]}>
              Quiz Concluído!
            </Text>
            <Text style={[styles.scoreText, { color: colors.text }]}>
              Sua pontuação: {score}/{quizQuestions.length}
            </Text>
            <Text style={[styles.scoreMessage, { color: scoreData.color }]}>
              {scoreData.message}
            </Text>
            
            <View style={styles.quizActions}>
              <TouchableOpacity
                style={[styles.restartButton, { backgroundColor: colors.primary }]}
                onPress={restartQuiz}
              >
                <RotateCcw size={20} color="#FFFFFF" />
                <Text style={styles.restartButtonText}>Tentar Novamente</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    const currentQuestion = quizQuestions[currentQuestionIndex];
    
    return (
      <View style={styles.content}>
        <View style={[styles.quizProgress, { backgroundColor: colors.surface }]}>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            Pergunta {currentQuestionIndex + 1} de {quizQuestions.length}
          </Text>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: colors.primary,
                  width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`
                }
              ]} 
            />
          </View>
        </View>

        <Animated.View 
          style={[
            styles.questionCard, 
            { backgroundColor: colors.surface, borderColor: colors.border },
            { opacity: fadeAnim }
          ]}
        >
          <Text style={[styles.questionText, { color: colors.text }]}>
            {currentQuestion.question}
          </Text>

          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => {
              let optionStyle = [styles.optionButton, { borderColor: colors.border }];
              let textColor = colors.text;

              if (selectedAnswer !== null) {
                if (index === currentQuestion.correctAnswer) {
                  optionStyle.push({
                    backgroundColor: (colors.success || "#10B981") + '20',
                    borderColor: colors.success || "#10B981"
                  });
                  textColor = colors.success || "#10B981";
                } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                  optionStyle.push({
                    backgroundColor: "#EF4444" + '20',
                    borderColor: "#EF4444"
                  });
                  textColor = "#EF4444";
                }  
              }

              return (
                <TouchableOpacity
                  key={index}
                  style={optionStyle}
                  onPress={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                >
                  <Text style={[styles.optionText, { color: textColor }]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {showExplanation && (
            <View style={[styles.explanationCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.explanationTitle, { color: colors.primary }]}>
                💡 Explicação
              </Text>
              <Text style={[styles.explanationText, { color: colors.textSecondary }]}>
                {currentQuestion.explanation}
              </Text>
              <TouchableOpacity
                style={[styles.nextButton, { backgroundColor: colors.primary }]}
                onPress={nextQuestion}
              >
                <Text style={styles.nextButtonText}>
                  {currentQuestionIndex < quizQuestions.length - 1 ? 'Próxima Pergunta' : 'Ver Resultado'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          {currentSection === 'menu' ? (
            <Home size={24} color={colors.primary} />
          ) : (
            <ArrowLeft size={24} color={colors.text} />
          )}
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {currentSection === 'menu' ? 'Educação Digital' : 
           currentSection === 'content' ? selectedContent?.title : 
           'Quiz Educativo'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {currentSection === 'menu' && renderMenu()}
      {currentSection === 'content' && renderContent()}
      {currentSection === 'quiz' && renderQuiz()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 16,
  },
  contentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contentTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginLeft: 12,
  },
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quizInfo: {
    marginLeft: 16,
    flex: 1,
  },
  quizTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  quizDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentDetailCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  contentDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  contentDetailTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginLeft: 12,
  },
  contentBody: {
    padding: 20,
    paddingTop: 0,
  },
  paragraph: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  tipsSection: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  tipsTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  quizProgress: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  progressText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  questionCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  questionText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 20,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  explanationCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  explanationTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: 8,
  },
  explanationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  nextButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  quizCompletedCard: {
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quizCompletedTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginTop: 16,
    marginBottom: 8,
  },
  scoreText: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    marginBottom: 8,
  },
  scoreMessage: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  quizActions: {
    width: '100%',
  },
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  restartButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
