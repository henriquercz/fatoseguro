import React, { createContext, useReducer, ReactNode, useEffect, useContext } from 'react';
import { VerificationState, NewsVerification } from '@/types'; // User type will come from AuthContext
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase'; // Import Supabase client
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth hook
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { braveSearchService } from '@/lib/braveSearch';
import { webScraperService } from '@/lib/webScraper';

const MAX_FREE_VERIFICATIONS = 3;

const initialState: VerificationState = {
  verifications: [], // This will hold history for logged-in users
  currentVerification: null,
  verificationCount: MAX_FREE_VERIFICATIONS, // Default for guests or initial load
  isLoading: false,
  error: null,
  showAd: false,
};

type VerificationAction =
  | { type: 'VERIFY_REQUEST' }
  | { type: 'VERIFY_SUCCESS'; payload: NewsVerification }
  | { type: 'VERIFY_FAILURE'; payload: string }
  | { type: 'LOAD_HISTORY'; payload: NewsVerification[] }
  | { type: 'SET_VERIFICATION_COUNT'; payload: number | null }
  | { type: 'CLEAR_CURRENT_VERIFICATION' }
  | { type: 'SHOW_AD' }
  | { type: 'HIDE_AD' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_VIEWING_VERIFICATION'; payload: NewsVerification };

const verificationReducer = (state: VerificationState, action: VerificationAction): VerificationState => {
  switch (action.type) {
    case 'VERIFY_REQUEST':
      return { ...state, isLoading: true, error: null };
    case 'VERIFY_SUCCESS':
      return {
        ...state,
        isLoading: false,
        currentVerification: action.payload,
        verifications: [action.payload, ...(Array.isArray(state.verifications) ? state.verifications : [])],
        verificationCount: state.verificationCount !== null 
          ? Math.max(0, state.verificationCount - 1) 
          : null,
        error: null,
      };
    case 'VERIFY_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'LOAD_HISTORY':
      return { ...state, verifications: action.payload };
    case 'SET_VERIFICATION_COUNT':
      return { ...state, verificationCount: action.payload };
    case 'CLEAR_CURRENT_VERIFICATION':
      return { ...state, currentVerification: null };
    case 'SHOW_AD':
      return { ...state, showAd: true };
    case 'HIDE_AD':
      return { ...state, showAd: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_VIEWING_VERIFICATION':
      return {
        ...state,
        currentVerification: action.payload,
        isLoading: false,
        error: null,
        showAd: false, // Explicitly hide ad when viewing from history
      };
    default:
      return state;
  }
};

type VerificationContextType = {
  verifications: NewsVerification[];
  currentVerification: NewsVerification | null;
  verificationCount: number | null;
  loading: boolean;
  error: string | null;
  showAd: boolean;
  verifyNews: (news: string, type: 'text' | 'link') => Promise<void>;
  loadHistory: () => void;
  loadCommunityHistory: (page?: number, reset?: boolean) => Promise<NewsVerification[] | void>;
  clearCurrentVerification: () => void;
  hideAd: () => void;
  clearError: () => void;
  setViewingVerification: (verification: NewsVerification) => void;
};

export const VerificationContext = createContext<VerificationContextType>({
  verifications: [],
  currentVerification: null,
  verificationCount: null,
  loading: false,
  error: null,
  showAd: false,
  verifyNews: async () => {},
  loadHistory: () => {},
  loadCommunityHistory: async () => {},
  clearCurrentVerification: () => {},
  hideAd: () => {},
  clearError: () => {},
  setViewingVerification: () => {},
});

export const useVerification = () => {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
};

export const VerificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth(); // Get user from AuthContext
  const [state, dispatch] = useReducer(verificationReducer, initialState);

  const loadVerificationCount = async () => {
    try {
      if (user) { // User is logged in
        if (user.isPremium) {
          dispatch({ type: 'SET_VERIFICATION_COUNT', payload: null }); // null for unlimited premium users
        } else {
          const todayStart = new Date().setHours(0, 0, 0, 0);
          const todayEnd = new Date().setHours(23, 59, 59, 999);

          const { count, error } = await supabase
            .from('verifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('verified_at', new Date(todayStart).toISOString())
            .lte('verified_at', new Date(todayEnd).toISOString());

          if (error) {
            console.error('Error fetching verification count:', error);
            dispatch({ type: 'SET_VERIFICATION_COUNT', payload: state.verificationCount !== null ? state.verificationCount : MAX_FREE_VERIFICATIONS });
            return;
          }
          const remainingVerifications = MAX_FREE_VERIFICATIONS - (count || 0);
          dispatch({ type: 'SET_VERIFICATION_COUNT', payload: Math.max(0, remainingVerifications) });
        }
      } else { // Guest user
        const guestData = await AsyncStorage.getItem('verificationCount_guest');
        if (guestData) {
          const { count, date } = JSON.parse(guestData);
          if (date === new Date().toDateString()) {
            dispatch({ type: 'SET_VERIFICATION_COUNT', payload: count });
          } else {
            await AsyncStorage.setItem('verificationCount_guest', JSON.stringify({ count: MAX_FREE_VERIFICATIONS, date: new Date().toDateString() }));
            dispatch({ type: 'SET_VERIFICATION_COUNT', payload: MAX_FREE_VERIFICATIONS });
          }
        } else {
          await AsyncStorage.setItem('verificationCount_guest', JSON.stringify({ count: MAX_FREE_VERIFICATIONS, date: new Date().toDateString() }));
          dispatch({ type: 'SET_VERIFICATION_COUNT', payload: MAX_FREE_VERIFICATIONS });
        }
      }
    } catch (error) {
      console.error('Failed to load verification count:', error);
      dispatch({ type: 'SET_VERIFICATION_COUNT', payload: state.verificationCount !== null ? state.verificationCount : MAX_FREE_VERIFICATIONS });
    }
  };
  
  useEffect(() => {
    loadVerificationCount();
  }, [user]);

  const loadHistory = async () => {
    if (user) {
      try {
        const { data, error } = await supabase
          .from('verifications')
          .select('*')
          .eq('user_id', user.id)
          .order('verified_at', { ascending: false });

        if (error) {
          throw error;
        }
        const historyData: NewsVerification[] = data.map((item: any) => ({
          id: item.id,
          user_id: item.user_id,
          news_content: item.news_content || item.news_title || item.news_url || 'Conteúdo não disponível',
          news_url: item.news_url,
          news_title: item.news_title,
          news_text_snippet: item.news_text_snippet,
          source: item.source || (item.news_url ? new URL(item.news_url).hostname : undefined),
          verification_status: item.verification_status as NewsVerification['verification_status'],
          verification_summary: item.verification_summary || item.explanation,
          related_facts: item.related_facts || [],
          raw_ai_response: item.raw_ai_response,
          error_message: item.error_message,
          verified_at: item.verified_at,
          isTrue: item.verification_status === 'VERDADEIRO' || item.is_true,
          explanation: item.verification_summary || item.explanation,
        }));
        dispatch({ type: 'LOAD_HISTORY', payload: historyData });
      } catch (error) {
        console.error('Error loading verification history:', error);
        dispatch({ type: 'LOAD_HISTORY', payload: [] });
      }
    } else {
      dispatch({ type: 'LOAD_HISTORY', payload: [] });
    }
  };

  const loadCommunityHistory = async (page: number = 0, reset: boolean = true): Promise<NewsVerification[] | void> => {
    try {
      const pageSize = 20;
      const offset = page * pageSize;
      
      const { data, error } = await supabase
        .from('verifications')
        .select('*')
        .order('verified_at', { ascending: false })
        .range(offset, offset + pageSize - 1);

      if (error) {
        throw error;
      }
      
      const historyData: NewsVerification[] = data.map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        news_content: item.news_content || item.news_title || item.news_url || 'Conteúdo não disponível',
        news_url: item.news_url,
        news_title: item.news_title,
        news_text_snippet: item.news_text_snippet,
        source: item.source || (item.news_url ? new URL(item.news_url).hostname : undefined),
        verification_status: item.verification_status as NewsVerification['verification_status'],
        verification_summary: item.verification_summary || item.explanation,
        related_facts: item.related_facts || [],
        raw_ai_response: item.raw_ai_response,
        error_message: item.error_message,
        verified_at: item.verified_at,
        isTrue: item.verification_status === 'VERDADEIRO' || item.is_true,
        explanation: item.verification_summary || item.explanation,
      }));
      
      if (reset || page === 0) {
        dispatch({ type: 'LOAD_HISTORY', payload: historyData });
      } else {
        // Append new data to existing
        dispatch({ type: 'LOAD_HISTORY', payload: [...(state.verifications || []), ...historyData] });
      }
      
      return historyData;
    } catch (error) {
      console.error('Error loading community verification history:', error);
      if (reset || page === 0) {
        dispatch({ type: 'LOAD_HISTORY', payload: [] });
      }
      return [];
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user]);

  const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  const callGeminiAPI = async (newsTextOrUrl: string, type: 'text' | 'link') => {
    if (!GEMINI_API_KEY) {
      return {
        verification_status: 'ERRO' as NewsVerification['verification_status'],
        verification_summary: 'API Key da Gemini não configurada. Verifique o arquivo .env',
        related_facts: [],
        raw_response: { error: 'Missing API Key' },
        original_input_for_title: newsTextOrUrl,
        error_message: 'API Key da Gemini não configurada. Verifique o arquivo .env'
      };
    }

    let extractedContent = '';
    let webContext = '';
    let newsTitle = '';
    let newsSource = '';

    if (type === 'link') {
      // 🆕 NOVA FUNCIONALIDADE: Extração direta de conteúdo do link
      console.log('🔗 Extraindo conteúdo do link:', newsTextOrUrl);
      const scrapingResult = await webScraperService.extractContent(newsTextOrUrl);
      
      if (scrapingResult.success && scrapingResult.data) {
        extractedContent = webScraperService.formatForAI(scrapingResult.data);
        newsTitle = scrapingResult.data.title;
        newsSource = scrapingResult.data.siteName || '';
        console.log('✅ Conteúdo extraído com sucesso:', scrapingResult.data.wordCount, 'palavras');
      } else {
        console.log('⚠️ Falha na extração, usando método tradicional:', scrapingResult.error);
      }
    }

    // 🔍 Busca contexto web adicional com Brave Search
    console.log('🚀 Iniciando busca de contexto web...');
    const searchText = type === 'link' && newsTitle ? newsTitle : newsTextOrUrl;
    webContext = await braveSearchService.getEnrichedContext(searchText);
    console.log('📊 Contexto web obtido:', webContext ? 'Sucesso' : 'Nenhum contexto encontrado');

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    });

    // 🧠 PROMPT APRIMORADO: Inclui conteúdo extraído e contexto web para análise mais precisa
    const inputText = type === 'link' 
      ? `Link da notícia: ${newsTextOrUrl}${extractedContent ? '\n\nConteúdo extraído do link:\n' + extractedContent : ''}` 
      : newsTextOrUrl;
    
    const prompt = `
      Você é um assistente de verificação de fatos altamente preciso e imparcial especializado em análise de notícias.
      
      NOTÍCIA PARA ANÁLISE:
      ${inputText}
      ${webContext}
      
      INSTRUÇÕES DE ANÁLISE:
      ${type === 'link' ? '- Analise o conteúdo COMPLETO extraído do link fornecido acima' : ''}
      - Use o contexto web fornecido para verificar a veracidade da notícia
      - Compare as informações da notícia com as fontes web atuais encontradas
      - Se houver contradições, priorize as fontes mais confiáveis e recentes
      - Para links, considere tanto o conteúdo extraído quanto o contexto web adicional
      
      Por favor, forneça sua análise estritamente no seguinte formato JSON. Não adicione nenhum texto explicativo antes ou depois do JSON:
      {
        "verification_status": "VERDADEIRO | FALSO | INDETERMINADO",
        "verification_summary": "Uma explicação concisa e neutra da sua análise, baseada nos fatos encontrados e no contexto web atual. Limite a 2-3 frases. Mencione se usou fontes web para a verificação.",
        "related_facts": ["Fato relevante 1 encontrado nas fontes web", "Fato relevante 2 (se houver)", "Contradições encontradas (se houver)"],
        "confidence_score": "ALTA | MÉDIA | BAIXA (sua confiança na verificação baseada no contexto disponível)",
        "sources_used": ${webContext || extractedContent ? 'true' : 'false'},
        "content_extracted": ${extractedContent ? 'true' : 'false'}
      }
      
      CRITÉRIOS DE VERIFICAÇÃO:
      - VERDADEIRO: A notícia é confirmada por múltiplas fontes confiáveis ou pelo conteúdo extraído
      - FALSO: A notícia é contradita por fontes confiáveis ou contém informações comprovadamente incorretas
      - INDETERMINADO: Informações insuficientes, contraditórias ou não verificáveis
      
      INSTRUÇÕES IMPORTANTES:
      ${type === 'link' ? '- Para links, priorize o conteúdo EXTRAÍDO DIRETAMENTE sobre o contexto web' : ''}
      - Se não houver contexto suficiente, seja mais conservador na classificação
      - Priorize fontes jornalísticas estabelecidas e sites oficiais
      - Se encontrar informações conflitantes, explique as contradições em related_facts
      - O campo "confidence_score" deve refletir a qualidade das fontes e conteúdo disponível
      - Para links com conteúdo extraído, a confiança deve ser ALTA se o conteúdo for completo
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      const jsonMatch = responseText.match(/\{.*\}/s);

      if (!jsonMatch || !jsonMatch[0]) {
        console.error('Gemini response was not valid JSON:', responseText);
        return {
          verification_status: 'INDETERMINADO' as NewsVerification['verification_status'],
          verification_summary: 'A resposta da IA não estava no formato JSON esperado.',
          related_facts: [],
          raw_response: responseText,
          original_input_for_title: newsTitle || newsTextOrUrl,
          extracted_title: newsTitle,
          extracted_source: newsSource,
          error_message: 'Resposta da IA em formato inválido.'
        };
      }
      const parsedJson = JSON.parse(jsonMatch[0]);
      return {
        verification_status: parsedJson.verification_status || 'INDETERMINADO',
        verification_summary: parsedJson.verification_summary || 'Sem resumo da IA.',
        related_facts: parsedJson.related_facts || [],
        confidence_score: parsedJson.confidence_score,
        raw_response: parsedJson,
        original_input_for_title: newsTitle || newsTextOrUrl,
        extracted_title: newsTitle,
        extracted_source: newsSource,
        error_message: undefined
      };
    } catch (error: any) {
      console.error('Error calling Gemini API:', error);
      let errorMessage = 'Erro ao processar a solicitação com a IA.';
      
      // Tratamento específico para bloqueio de segurança
      if (error.message && error.message.includes('Candidate was blocked due to SAFETY')) {
        console.log('⚠️ Conteúdo bloqueado por segurança, tentando análise mais conservadora...');
        return {
          verification_status: 'INDETERMINADO' as NewsVerification['verification_status'],
          verification_summary: 'Não foi possível analisar este conteúdo devido às políticas de segurança da IA. Recomendamos verificar a informação através de fontes jornalísticas confiáveis.',
          related_facts: ['Conteúdo bloqueado por políticas de segurança', 'Recomenda-se verificação manual em fontes confiáveis'],
          raw_response: { safety_blocked: true, original_error: error.message },
          original_input_for_title: newsTitle || newsTextOrUrl,
          extracted_title: newsTitle,
          extracted_source: newsSource,
          error_message: undefined // Não é um erro técnico, é uma limitação de segurança
        };
      }
      
      if (error.message && error.message.includes('API key not valid')) {
        errorMessage = 'Chave de API da Gemini inválida. Verifique sua configuração.';
      } else if (error.message && error.message.includes('exceeded your current quota')) {
        console.log('⚠️ Quota da API Gemini esgotada, usando análise básica...');
        return {
          verification_status: 'INDETERMINADO' as NewsVerification['verification_status'],
          verification_summary: 'Limite diário da API Gemini atingido (50 consultas gratuitas). A análise será retomada amanhã ou considere fazer upgrade para plano pago.',
          related_facts: ['Quota da API Gemini esgotada', 'Limite: 50 consultas gratuitas por dia', 'Considere upgrade para plano pago para uso ilimitado'],
          raw_response: { quota_exceeded: true, original_error: error.message },
          original_input_for_title: newsTitle || newsTextOrUrl,
          extracted_title: newsTitle,
          extracted_source: newsSource,
          error_message: undefined
        };
      }
      
      const details = error.details || (error.cause && error.cause.details);
      if (details) errorMessage += ` Detalhes: ${JSON.stringify(details)}`;
      
      return {
        verification_status: 'ERRO' as NewsVerification['verification_status'],
        verification_summary: errorMessage,
        related_facts: [],
        raw_response: { error: error.message, details },
        original_input_for_title: newsTitle || newsTextOrUrl,
        extracted_title: newsTitle,
        extracted_source: newsSource,
        error_message: errorMessage
      };
    }
  };

  const verifyNews = async (news: string, type: 'text' | 'link') => {
    dispatch({ type: 'VERIFY_REQUEST' });
    try {
      const isPremium = user ? user.isPremium : false;
      if (!isPremium && state.verificationCount !== null && state.verificationCount <= 0) {
        dispatch({ type: 'VERIFY_FAILURE', payload: 'Você atingiu o limite de verificações gratuitas para hoje.' });
        return;
      }
      if (!isPremium) {
        dispatch({ type: 'SHOW_AD' });
      }

      const geminiResult = await callGeminiAPI(news, type);

      if (geminiResult.verification_status === 'ERRO' || geminiResult.error_message) {
        dispatch({ type: 'VERIFY_FAILURE', payload: geminiResult.verification_summary || geminiResult.error_message || 'Erro ao processar com IA.' });
        return;
      }

      // Usa dados extraídos quando disponíveis
      const extractedTitle = geminiResult.extracted_title || '';
      const extractedSource = geminiResult.extracted_source || '';
      
      const tempNewsContent = type === 'text' ? news : (extractedTitle || geminiResult.original_input_for_title || news);
      const tempSummary = geminiResult.verification_summary || 'Não foi possível obter um resumo.';
      let tempSnippet = '';
      if (tempSummary && tempSummary !== 'Não foi possível obter um resumo.' && tempSummary.length > 0) {
        tempSnippet = tempSummary.substring(0, 120);
        if (tempSummary.length > 120) tempSnippet += '...';
      } else if (tempNewsContent && tempNewsContent.length > 0) {
        tempSnippet = tempNewsContent.substring(0,120);
        if (tempNewsContent.length > 120) tempSnippet += '...';
      }

      const coreVerificationData = {
        news_content: tempNewsContent,
        news_url: type === 'link' ? news : undefined,
        news_title: type === 'text' 
          ? (news.substring(0, 50) + (news.length > 50 ? '...' : ''))
          : (extractedTitle || (type === 'link' && news ? (new URL(news).hostname) : "Título da IA")),
        news_text_snippet: tempSnippet,
        verification_status: geminiResult.verification_status as NewsVerification['verification_status'] || 'INDETERMINADO',
        verification_summary: tempSummary,
        related_facts: geminiResult.related_facts || [],
        source: extractedSource || (type === 'link' && news ? (new URL(news).hostname) : 'Análise de IA (Gemini)'),
        verified_at: new Date().toISOString(),
        raw_ai_response: geminiResult.raw_response || { error: 'No raw response from Gemini', details: geminiResult },
        error_message: geminiResult.error_message,
      };
      console.log('[VerificationContext] coreVerificationData:', JSON.stringify(coreVerificationData, null, 2));

      let finalVerificationResult: NewsVerification;

      if (user) {
        const payloadToSave = {
          user_id: user.id,
          ...coreVerificationData
        };
        console.log('[VerificationContext] payloadToSave to Supabase:', JSON.stringify(payloadToSave, null, 2));
        const { data, error: dbError } = await supabase
          .from('verifications')
          .insert(payloadToSave)
          .select()
          .single();

        console.log('[VerificationContext] Supabase response data:', JSON.stringify(data, null, 2));
        console.log('[VerificationContext] Supabase response dbError:', JSON.stringify(dbError, null, 2));

        if (dbError) {
          console.error('Error saving verification to Supabase:', dbError);
          dispatch({ type: 'VERIFY_FAILURE', payload: 'Erro ao salvar sua verificação.' });
          return;
        }
        finalVerificationResult = {
          id: data.id,
          user_id: data.user_id,
          news_content: data.news_content || '',
          news_url: data.news_url,
          news_title: data.news_title,
          news_text_snippet: data.news_text_snippet, // This might be null if not in coreVerificationData or DB
          source: data.source,
          verification_status: data.verification_status as NewsVerification['verification_status'],
          verification_summary: data.verification_summary,
          related_facts: data.related_facts || [],
          raw_ai_response: data.raw_ai_response,
          error_message: data.error_message,
          verified_at: data.verified_at,
          isTrue: data.verification_status === 'VERDADEIRO',
          explanation: data.verification_summary,
        };
        console.log('[VerificationContext] finalVerificationResult (logged in):', JSON.stringify(finalVerificationResult, null, 2));

        if (!isPremium) {
          // Count is updated via reducer, no need to manually set AsyncStorage for logged-in user here
          // It's handled by loadVerificationCount and the VERIFY_SUCCESS action
        }
      } else {
        finalVerificationResult = {
          id: Math.random().toString(36).substring(2, 15),
          user_id: undefined,
          ...coreVerificationData,
          isTrue: coreVerificationData.verification_status === 'VERDADEIRO',
          explanation: coreVerificationData.verification_summary,
        };
        console.log('[VerificationContext] finalVerificationResult (guest):', JSON.stringify(finalVerificationResult, null, 2));
        // For guest users, verificationCount is handled by the reducer based on VERIFY_SUCCESS
        // and AsyncStorage is updated by loadVerificationCount for persistence across sessions.
        // We still need to update the count for the current session for guests.
        const newCount = Math.max(0, (state.verificationCount || MAX_FREE_VERIFICATIONS) - 1);
        // Update AsyncStorage for guest for next session start
        await AsyncStorage.setItem('verificationCount_guest', JSON.stringify({ count: newCount, date: new Date().toDateString() }));
      }
      // The reducer will handle decrementing the count for both user types upon VERIFY_SUCCESS
      dispatch({ type: 'VERIFY_SUCCESS', payload: finalVerificationResult });

    } catch (error: any) {
      console.error('Error in verifyNews:', error);
      dispatch({ type: 'VERIFY_FAILURE', payload: error.message || 'Ocorreu um erro inesperado durante a verificação.' });
    }
  };

  const clearCurrentVerification = () => dispatch({ type: 'CLEAR_CURRENT_VERIFICATION' });
  const hideAd = () => dispatch({ type: 'HIDE_AD' });
  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  const setViewingVerification = (verification: NewsVerification) => {
    dispatch({ type: 'SET_VIEWING_VERIFICATION', payload: verification });
  };

  return (
    <VerificationContext.Provider
      value={{
        verifications: state.verifications,
        currentVerification: state.currentVerification,
        verificationCount: state.verificationCount,
        loading: state.isLoading,
        error: state.error,
        showAd: state.showAd,
        verifyNews,
        loadHistory,
        loadCommunityHistory,
        clearCurrentVerification,
        hideAd,
        clearError,
        setViewingVerification,
      }}>
      {children}
    </VerificationContext.Provider>
  );
};