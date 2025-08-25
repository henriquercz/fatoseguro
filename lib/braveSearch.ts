/**
 * Serviço de integração com Brave Search API
 * Fornece contexto web atualizado para análise de notícias
 * 
 * @author CheckNow Team
 * @version 1.0.0
 */

interface BraveSearchResult {
  title: string;
  url: string;
  description: string;
  snippet?: string;
  published_date?: string;
}

interface BraveSearchResponse {
  web?: {
    results: Array<{
      title: string;
      url: string;
      description: string;
      extra_snippets?: string[];
      published_date?: string;
    }>;
  };
  news?: {
    results: Array<{
      title: string;
      url: string;
      description: string;
      published_date?: string;
    }>;
  };
}

interface SearchContextData {
  results: BraveSearchResult[];
  searchQuery: string;
  totalResults: number;
  searchTimestamp: string;
}

class BraveSearchService {
  private apiKey: string;
  private baseUrl = 'https://api.search.brave.com/res/v1';

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_BRAVE_SEARCH_API_KEY || '';
    console.log('🔑 Brave Search API Key status:', this.apiKey ? 'Configurada' : 'NÃO CONFIGURADA');
    console.log('🔍 API Key preview:', this.apiKey ? `${this.apiKey.substring(0, 8)}...` : 'undefined');
    if (!this.apiKey) {
      console.warn('⚠️ Brave Search API key não configurada - verifique o arquivo .env');
    }
  }

  /**
   * Extrai palavras-chave relevantes do texto da notícia
   * Remove stopwords e foca em substantivos e nomes próprios
   */
  private extractKeywords(newsText: string): string[] {
    // Stopwords em português para filtrar
    const stopwords = new Set([
      'a', 'o', 'e', 'de', 'do', 'da', 'em', 'um', 'uma', 'para', 'com', 'por',
      'que', 'se', 'na', 'no', 'as', 'os', 'ao', 'dos', 'das', 'pela', 'pelo',
      'foi', 'ser', 'ter', 'está', 'são', 'tem', 'mais', 'muito', 'pode', 'vai',
      'disse', 'diz', 'segundo', 'sobre', 'após', 'durante', 'entre', 'contra'
    ]);

    // Limpa e normaliza o texto
    const cleanText = newsText
      .toLowerCase()
      .replace(/[^\w\sáàâãéèêíìîóòôõúùûç]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Extrai palavras de 3+ caracteres que não são stopwords
    const words = cleanText
      .split(' ')
      .filter(word => word.length >= 3 && !stopwords.has(word))
      .slice(0, 10); // Limita a 10 palavras-chave principais

    // Remove duplicatas e retorna
    return [...new Set(words)];
  }

  /**
   * Constrói query de busca otimizada para verificação de notícias
   */
  private buildSearchQuery(keywords: string[]): string {
    // Pega as 5 palavras-chave mais relevantes
    const mainKeywords = keywords.slice(0, 5);
    
    // Adiciona operadores de busca para melhor precisão
    const query = mainKeywords.join(' ');
    
    // Adiciona filtros temporais para notícias recentes (últimos 30 dias)
    return `${query} site:g1.com OR site:folha.uol.com.br OR site:estadao.com.br OR site:uol.com.br OR site:cnn.com.br`;
  }

  /**
   * Realiza busca no Brave Search com contexto otimizado para notícias
   */
  async searchNewsContext(newsText: string): Promise<SearchContextData | null> {
    if (!this.apiKey) {
      console.error('❌ Brave Search API key não configurada');
      return null;
    }

    try {
      // Extrai palavras-chave do texto da notícia
      const keywords = this.extractKeywords(newsText);
      if (keywords.length === 0) {
        console.warn('⚠️ Nenhuma palavra-chave extraída do texto');
        return null;
      }

      // Constrói query de busca otimizada
      const searchQuery = this.buildSearchQuery(keywords);
      console.log('🔍 Buscando contexto:', searchQuery);

      // Parâmetros da requisição para Brave Search
      const params = new URLSearchParams({
        q: searchQuery,
        count: '10', // Máximo 10 resultados
        offset: '0',
        safesearch: 'moderate',
        freshness: 'pm', // Últimos 30 dias (past month)
        text_decorations: 'false',
        extra_snippets: 'true' // Solicita snippets extras para mais contexto
      });

      // Faz requisição para API do Brave Search
      const response = await fetch(`${this.baseUrl}/web/search?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Brave Search API error: ${response.status} ${response.statusText}`);
      }

      const data: BraveSearchResponse = await response.json();
      
      // Processa resultados da busca web
      const webResults = data.web?.results || [];
      
      // Converte para formato padronizado
      const results: BraveSearchResult[] = webResults.map(result => ({
        title: result.title,
        url: result.url,
        description: result.description,
        snippet: result.extra_snippets?.[0] || result.description,
        published_date: result.published_date
      }));

      console.log(`✅ Encontrados ${results.length} resultados relevantes`);

      return {
        results,
        searchQuery,
        totalResults: results.length,
        searchTimestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Erro na busca Brave Search:', error);
      return null;
    }
  }

  /**
   * Formata contexto web para envio ao Gemini
   * Cria resumo estruturado dos resultados encontrados
   */
  formatContextForAI(contextData: SearchContextData): string {
    if (!contextData || contextData.results.length === 0) {
      return '';
    }

    const { results, searchQuery, searchTimestamp } = contextData;

    let contextText = `\n\n=== CONTEXTO WEB ATUAL ===\n`;
    contextText += `Busca realizada: "${searchQuery}"\n`;
    contextText += `Data da busca: ${new Date(searchTimestamp).toLocaleString('pt-BR')}\n`;
    contextText += `Resultados encontrados: ${results.length}\n\n`;

    results.forEach((result, index) => {
      contextText += `--- FONTE ${index + 1} ---\n`;
      contextText += `Título: ${result.title}\n`;
      contextText += `URL: ${result.url}\n`;
      contextText += `Conteúdo: ${result.snippet || result.description}\n`;
      if (result.published_date) {
        contextText += `Data de publicação: ${result.published_date}\n`;
      }
      contextText += `\n`;
    });

    contextText += `=== FIM DO CONTEXTO WEB ===\n\n`;

    return contextText;
  }

  /**
   * Método principal: busca contexto e formata para IA
   */
  async getEnrichedContext(newsText: string): Promise<string> {
    try {
      const contextData = await this.searchNewsContext(newsText);
      
      if (!contextData) {
        console.log('ℹ️ Nenhum contexto web encontrado, prosseguindo sem enriquecimento');
        return '';
      }

      return this.formatContextForAI(contextData);
      
    } catch (error) {
      console.error('❌ Erro ao obter contexto enriquecido:', error);
      return '';
    }
  }
}

// Instância singleton do serviço
export const braveSearchService = new BraveSearchService();

// Exporta tipos para uso em outros módulos
export type { SearchContextData, BraveSearchResult };
