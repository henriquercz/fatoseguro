/**
 * Serviço de integração com GNews API
 * Busca notícias recentes do Brasil em português
 * 
 * @author CheckNow Team
 * @version 1.0.0
 */

interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}

interface ProcessedNews {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  publishedDate: Date;
  source: string;
  sourceUrl: string;
  category?: string;
  isRecent: boolean;
  timeAgo: string;
}

class GNewsService {
  private apiKey: string;
  private baseUrl = 'https://gnews.io/api/v4';

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_GNEWS_API_KEY || '';
    console.log('📰 GNews API Key status:', this.apiKey ? 'Configurada' : 'NÃO CONFIGURADA');
    if (!this.apiKey) {
      console.warn('⚠️ GNews API key não configurada - verifique o arquivo .env');
    }
  }

  /**
   * Calcula tempo decorrido desde publicação
   */
  private getTimeAgo(publishedAt: string): string {
    const now = new Date();
    const published = new Date(publishedAt);
    const diffMs = now.getTime() - published.getTime();
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes}min atrás`;
    } else if (diffHours < 24) {
      return `${diffHours}h atrás`;
    } else if (diffDays === 1) {
      return 'Ontem';
    } else if (diffDays < 7) {
      return `${diffDays} dias atrás`;
    } else {
      return published.toLocaleDateString('pt-BR');
    }
  }

  /**
   * Determina categoria da notícia baseada no título e conteúdo
   */
  private categorizeNews(title: string, description: string): string {
    const text = `${title} ${description}`.toLowerCase();
    
    if (text.includes('política') || text.includes('governo') || text.includes('presidente') || text.includes('eleição')) {
      return 'Política';
    } else if (text.includes('economia') || text.includes('mercado') || text.includes('dólar') || text.includes('inflação')) {
      return 'Economia';
    } else if (text.includes('saúde') || text.includes('covid') || text.includes('vacina') || text.includes('hospital')) {
      return 'Saúde';
    } else if (text.includes('tecnologia') || text.includes('internet') || text.includes('digital') || text.includes('app')) {
      return 'Tecnologia';
    } else if (text.includes('esporte') || text.includes('futebol') || text.includes('copa') || text.includes('jogador')) {
      return 'Esportes';
    } else if (text.includes('cultura') || text.includes('música') || text.includes('filme') || text.includes('arte')) {
      return 'Cultura';
    } else {
      return 'Geral';
    }
  }

  /**
   * Processa artigos da API para formato padronizado
   */
  private processArticles(articles: GNewsArticle[]): ProcessedNews[] {
    return articles.map((article, index) => {
      const publishedDate = new Date(article.publishedAt);
      const now = new Date();
      const isRecent = (now.getTime() - publishedDate.getTime()) < (24 * 60 * 60 * 1000); // Últimas 24h

      return {
        id: `gnews_${Date.now()}_${index}`,
        title: article.title,
        description: article.description || 'Descrição não disponível',
        content: article.content || article.description || '',
        url: article.url,
        imageUrl: article.image || '',
        publishedAt: article.publishedAt,
        publishedDate,
        source: article.source.name,
        sourceUrl: article.source.url,
        category: this.categorizeNews(article.title, article.description || ''),
        isRecent,
        timeAgo: this.getTimeAgo(article.publishedAt)
      };
    });
  }

  /**
   * Busca principais notícias do Brasil
   */
  async getTopHeadlines(limit: number = 20): Promise<ProcessedNews[]> {
    if (!this.apiKey) {
      console.error('❌ GNews API key não configurada');
      return [];
    }

    try {
      const params = new URLSearchParams({
        country: 'br',
        lang: 'pt',
        max: limit.toString(),
        apikey: this.apiKey
      });

      console.log('📰 Buscando notícias principais do Brasil...');
      
      const response = await fetch(`${this.baseUrl}/top-headlines?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`GNews API error: ${response.status} ${response.statusText}`);
      }

      const data: GNewsResponse = await response.json();
      console.log(`✅ Encontradas ${data.articles.length} notícias principais`);

      return this.processArticles(data.articles);

    } catch (error) {
      console.error('❌ Erro ao buscar notícias:', error);
      return [];
    }
  }

  /**
   * Busca notícias por categoria específica
   */
  async getNewsByCategory(category: string, limit: number = 10): Promise<ProcessedNews[]> {
    if (!this.apiKey) {
      console.error('❌ GNews API key não configurada');
      return [];
    }

    try {
      const params = new URLSearchParams({
        q: category,
        country: 'br',
        lang: 'pt',
        max: limit.toString(),
        apikey: this.apiKey
      });

      console.log(`📰 Buscando notícias de ${category}...`);
      
      const response = await fetch(`${this.baseUrl}/search?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`GNews API error: ${response.status} ${response.statusText}`);
      }

      const data: GNewsResponse = await response.json();
      console.log(`✅ Encontradas ${data.articles.length} notícias de ${category}`);

      return this.processArticles(data.articles);

    } catch (error) {
      console.error(`❌ Erro ao buscar notícias de ${category}:`, error);
      return [];
    }
  }

  /**
   * Busca notícias por termo específico
   */
  async searchNews(query: string, limit: number = 10): Promise<ProcessedNews[]> {
    if (!this.apiKey) {
      console.error('❌ GNews API key não configurada');
      return [];
    }

    try {
      const params = new URLSearchParams({
        q: query,
        country: 'br',
        lang: 'pt',
        max: limit.toString(),
        sortby: 'publishedAt',
        apikey: this.apiKey
      });

      console.log(`🔍 Buscando notícias sobre "${query}"...`);
      
      const response = await fetch(`${this.baseUrl}/search?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`GNews API error: ${response.status} ${response.statusText}`);
      }

      const data: GNewsResponse = await response.json();
      console.log(`✅ Encontradas ${data.articles.length} notícias sobre "${query}"`);

      return this.processArticles(data.articles);

    } catch (error) {
      console.error(`❌ Erro ao buscar notícias sobre "${query}":`, error);
      return [];
    }
  }
}

// Instância singleton do serviço
export const gnewsService = new GNewsService();

// Exporta tipos para uso em outros módulos
export type { ProcessedNews, GNewsArticle };
