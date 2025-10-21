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
  Image,
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
      'O CheckNow já faz toda essa verificação automaticamente para você!',
      'Nossa IA analisa múltiplas fontes em segundos',
      'Verifique se há consenso entre especialistas no assunto',
      'Desconfie de "descobertas" que só um site reporta'
    ]
  },
  {
    id: 'verification-tools',
    title: 'CheckNow: Sua Ferramenta Definitiva',
    icon: <Search size={24} color="#10B981" />,
    content: [
      'O CheckNow é a ferramenta mais avançada para verificação de notícias no Brasil.',
      'Nossa IA integra múltiplas fontes confiáveis em uma única análise completa.',
      'Verificação instantânea: textos, links e contexto em segundos.',
      'Tecnologia de ponta que supera métodos tradicionais de fact-checking.'
    ],
    tips: [
      'Use o CheckNow como sua primeira e principal ferramenta',
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
  const [completedContents, setCompletedContents] = useState<string[]>([]);

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

  const markContentAsCompleted = (contentId: string) => {
    if (!completedContents.includes(contentId)) {
      setCompletedContents(prev => [...prev, contentId]);
    }
  };

  const isContentUnlocked = (contentIndex: number) => {
    if (contentIndex === 0) return true; // Primeiro conteúdo sempre desbloqueado
    const previousContentId = educationContent[contentIndex - 1].id;
    return completedContents.includes(previousContentId);
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
    
    // Mensagens variadas para cada faixa de pontuação
    const messagesExcellent = [
      "Incrível! Você domina a arte de identificar fake news!",
      "Perfeito! Você é um verdadeiro detetive de notícias!",
      "Uau! Você está pronto para combater a desinformação!",
      "Excelente! Nada escapa do seu olhar crítico!",
      "Sensacional! Você é um expert em verificação de notícias!",
      "Parabéns! Seu conhecimento é impressionante!",
      "Mandou bem! Você sabe mesmo identificar fake news!",
    ];
    
    const messagesGood = [
      "Bom trabalho! Você está no caminho certo!",
      "Nada mal! Continue praticando para melhorar ainda mais.",
      "Você foi bem! Está quase virando um expert!",
      "Legal! Já consegue identificar muitas fake news.",
      "Boa! Com mais prática você será imbatível!",
      "Interessante! Você tem potencial para ser expert!",
      "Bacana! Continue estudando, você está progredindo!",
    ];
    
    const messagesNeedsImprovement = [
      "Continue estudando! A prática leva à perfeição.",
      "Não desista! Cada erro é um aprendizado.",
      "Vamos lá! Revise o conteúdo e tente novamente.",
      "Você consegue! É só praticar um pouco mais.",
      "Tente de novo! O importante é aprender.",
      "Sem problemas! Revise as dicas e faça outro quiz.",
      "Continue tentando! A experiência vem com o tempo.",
    ];
    
    // Seleciona mensagem aleatória
    const randomIndex = Math.floor(Math.random() * 7);
    
    if (percentage === 100) {
      return { 
        message: messagesExcellent[randomIndex],
        emoji: "🏆",
        checkitoImage: require('@/assets/images/checkito/checkito_tela4.png'),
        color: colors.success || "#10B981"
      };
    } else if (percentage >= 80) {
      return { 
        message: messagesExcellent[randomIndex],
        emoji: "🎉",
        checkitoImage: require('@/assets/images/checkito/checkito_tela3.png'),
        color: colors.success || "#10B981"
      };
    } else if (percentage >= 60) {
      return { 
        message: messagesGood[randomIndex],
        emoji: "👍",
        checkitoImage: require('@/assets/images/checkito/checkito_tela3.png'),
        color: colors.primary
      };
    } else {
      return { 
        message: messagesNeedsImprovement[randomIndex],
        emoji: "📚",
        checkitoImage: require('@/assets/images/checkito/checkito_confuso.png'),
        color: "#EF4444"
      };
    }
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
        {educationContent.map((content, index) => {
          const isUnlocked = isContentUnlocked(index);
          const isCompleted = completedContents.includes(content.id);
          
          return (
            <TouchableOpacity
              key={content.id}
              style={[
                styles.menuItem, 
                { 
                  backgroundColor: colors.surface, 
                  borderColor: colors.border,
                  opacity: isUnlocked ? 1 : 0.5
                }
              ]}
              onPress={() => isUnlocked && handleContentSelect(content)}
              activeOpacity={isUnlocked ? 0.7 : 1}
              disabled={!isUnlocked}
            >
              <View style={styles.menuItemIcon}>
                {isCompleted ? (
                  <View style={[styles.completedBadge, { backgroundColor: colors.success || '#10B981' }]}>
                    <Text style={styles.completedBadgeText}>✓</Text>
                  </View>
                ) : isUnlocked ? (
                  content.icon
                ) : (
                  <View style={[styles.lockedIcon, { backgroundColor: colors.textSecondary + '20' }]}>
                    <Text style={[styles.lockedIconText, { color: colors.textSecondary }]}>🔒</Text>
                  </View>
                )}
              </View>
              <View style={styles.menuItemContent}>
                <Text style={[
                  styles.menuItemTitle, 
                  { color: isUnlocked ? colors.text : colors.textSecondary }
                ]}>
                  {content.title} {isCompleted && '✓'}
                </Text>
                <Text style={[
                  styles.menuItemDescription, 
                  { color: colors.textSecondary }
                ]}>
                  {isUnlocked 
                    ? content.content[0].substring(0, 80) + '...' 
                    : 'Complete o conteúdo anterior para desbloquear'
                  }
                </Text>
              </View>
              {isUnlocked && <ChevronRight size={20} color={colors.textSecondary} />}
            </TouchableOpacity>
          );
        })}
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

          <View style={styles.contentContainer}>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.contentScrollView}>
              <View style={styles.contentPadding}>
                {selectedContent.content.map((paragraph, index) => (
                  <Text key={index} style={[styles.contentText, { color: colors.text }]}>
                    {paragraph}
                  </Text>
                ))}
                
                <View style={[styles.tipsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={[styles.tipsTitle, { color: colors.primary }]}>💡 Dicas Importantes:</Text>
                  {selectedContent.tips.map((tip, index) => (
                    <Text key={index} style={[styles.tipText, { color: colors.text }]}>
                      • {tip}
                    </Text>
                  ))}
                </View>

                {!completedContents.includes(selectedContent.id) ? (
                  <TouchableOpacity 
                    style={[styles.completeButton, { backgroundColor: colors.primary }]}
                    onPress={() => {
                      markContentAsCompleted(selectedContent.id);
                      setCurrentSection('menu');
                      setSelectedContent(null);
                    }}
                  >
                    <Text style={styles.completeButtonText}>✓ Marcar como Concluído</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.completedIndicator, { backgroundColor: colors.success || '#10B981' }]}>
                    <Text style={styles.completedIndicatorText}>✓ Conteúdo Concluído</Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderQuiz = () => {
    if (!quizStarted) return null;

    if (quizCompleted) {
      const scoreData = getScoreMessage();
      const percentage = (score / quizQuestions.length) * 100;
      
      return (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.quizCompletedCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {/* Checkito no Resultado */}
            <View style={styles.resultCheckitoContainer}>
              <Image 
                source={scoreData.checkitoImage}
                style={styles.checkitoResult}
                resizeMode="contain"
              />
              <View style={[styles.resultBalloon, { backgroundColor: colors.surface, borderColor: scoreData.color }]}>
                <View style={[styles.resultBalloonTail, { borderTopColor: colors.surface }]} />
                <Text style={[styles.resultBalloonText, { color: colors.text }]}>
                  {scoreData.message}
                </Text>
              </View>
            </View>
            
            {/* Badge de Pontuação */}
            <View style={[styles.scoreBadge, { backgroundColor: scoreData.color }]}>
              <Text style={styles.scoreBadgeEmoji}>{scoreData.emoji}</Text>
            </View>
            
            <Text style={[styles.quizCompletedTitle, { color: colors.text }]}>
              Quiz Concluído!
            </Text>
            
            <Text style={[styles.scoreText, { color: colors.text }]}>
              Sua pontuação: {score}/{quizQuestions.length}
            </Text>
            
            {/* Barra de Progresso Visual */}
            <View style={styles.scoreBarContainer}>
              <View style={[styles.scoreBar, { backgroundColor: colors.border }]}>
                <View 
                  style={[styles.scoreBarFill, { 
                    backgroundColor: scoreData.color,
                    width: `${percentage}%`
                  }]} 
                />
              </View>
              <Text style={[styles.percentageText, { color: scoreData.color }]}>
                {percentage.toFixed(0)}%
              </Text>
            </View>
            
            {/* Feedback por Faixa */}
            {percentage === 100 && (
              <View style={[styles.perfectScore, { backgroundColor: scoreData.color + '20', borderColor: scoreData.color }]}>
                <Text style={[styles.perfectScoreText, { color: scoreData.color }]}>
                  ✨ Pontuação Perfeita! Você acertou tudo! ✨
                </Text>
              </View>
            )}
            
            {percentage >= 80 && percentage < 100 && (
              <View style={[styles.feedbackBox, { backgroundColor: scoreData.color + '15', borderColor: scoreData.color }]}>
                <Text style={[styles.feedbackText, { color: colors.text }]}>
                  🎯 Quase perfeito! Você está muito bem preparado!
                </Text>
              </View>
            )}
            
            {percentage >= 60 && percentage < 80 && (
              <View style={[styles.feedbackBox, { backgroundColor: scoreData.color + '15', borderColor: scoreData.color }]}>
                <Text style={[styles.feedbackText, { color: colors.text }]}>
                  💪 Você está no caminho certo! Continue praticando!
                </Text>
              </View>
            )}
            
            {percentage < 60 && (
              <View style={[styles.feedbackBox, { backgroundColor: scoreData.color + '15', borderColor: scoreData.color }]}>
                <Text style={[styles.feedbackText, { color: colors.text }]}>
                  📖 Revise o conteúdo educativo e tente novamente!
                </Text>
              </View>
            )}
            
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
        </ScrollView>
      );
    }

    const currentQuestion = quizQuestions[currentQuestionIndex];
    
    return (
      <View style={styles.content}>
        {/* Checkito no Quiz */}
        {currentQuestionIndex === 0 && selectedAnswer === null && (
          <View style={styles.quizCheckitoContainer}>
            <Image 
              source={require('@/assets/images/checkito/checkito_tela3.png')}
              style={styles.checkitoQuiz}
              resizeMode="contain"
            />
            <View style={[styles.quizBalloon, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.quizBalloonTail, { borderTopColor: colors.surface }]} />
              <Text style={[styles.quizBalloonText, { color: colors.text }]}>
                Vamos ver se você realmente aprendeu
              </Text>
            </View>
          </View>
        )}
        
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
              const baseStyle = [styles.optionButton, { borderColor: colors.border }];
              let dynamicStyle = {};
              let textColor = colors.text;

              if (selectedAnswer !== null) {
                if (index === currentQuestion.correctAnswer) {
                  const successColor = colors.success || "#10B981";
                  dynamicStyle = {
                    backgroundColor: successColor + '20',
                    borderColor: successColor
                  };
                  textColor = successColor;
                } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                  const errorColor = "#EF4444";
                  dynamicStyle = {
                    backgroundColor: errorColor + '20',
                    borderColor: errorColor
                  };
                  textColor = errorColor;
                }  
              }

              return (
                <TouchableOpacity
                  key={index}
                  style={[...baseStyle, dynamicStyle]}
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
        {currentSection !== 'menu' && (
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
        )}
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {currentSection === 'menu' ? 'Educação Digital' : 
           currentSection === 'content' ? selectedContent?.title : 
           'Quiz Educativo'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Botão flutuante de home - apenas no menu principal */}
      {currentSection === 'menu' && (
        <TouchableOpacity 
          style={[styles.floatingHomeButton, { backgroundColor: colors.primary }]}
          onPress={handleBackPress}
          activeOpacity={0.8}
        >
          <Home size={28} color="#FFFFFF" />
        </TouchableOpacity>
      )}

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
  floatingHomeButton: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  completeButton: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  lockedIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedIconText: {
    fontSize: 12,
  },
  menuItem: {
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
  menuItemIcon: {
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  menuItemDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  contentContainer: {
    flex: 1,
  },
  contentText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  tipsContainer: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  contentScrollView: {
    flex: 1,
  },
  contentPadding: {
    padding: 20,
  },
  quizCheckitoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  checkitoQuiz: {
    width: 140,
    height: 140,
    marginBottom: 16,
  },
  quizBalloon: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 2,
    position: 'relative',
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quizBalloonTail: {
    position: 'absolute',
    top: -8,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  quizBalloonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 21,
  },
  resultCheckitoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  checkitoResult: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  resultBalloon: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 2,
    position: 'relative',
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  resultBalloonTail: {
    position: 'absolute',
    top: -8,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  resultBalloonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  scoreBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  scoreBadgeEmoji: {
    fontSize: 36,
  },
  scoreBarContainer: {
    width: '100%',
    marginTop: 16,
    marginBottom: 20,
  },
  scoreBar: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  percentageText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    textAlign: 'center',
  },
  perfectScore: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 16,
    width: '100%',
  },
  perfectScoreText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  feedbackBox: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 16,
    width: '100%',
  },
  feedbackText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  completedIndicator: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  completedIndicatorText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
