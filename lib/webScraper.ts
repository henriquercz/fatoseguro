/**
 * Serviço de extração de conteúdo web para verificação de notícias
 * Extrai conteúdo real de links para análise mais precisa pela IA
 * 
 * @author CheckNow Team
 * @version 1.0.0
 */

interface ExtractedContent {
  title: string;
  content: string;
  description?: string;
  author?: string;
  publishedDate?: string;
  siteName?: string;
  url: string;
  wordCount: number;
  extractedAt: string;
}

interface ScrapingResult {
  success: boolean;
  data?: ExtractedContent;
  error?: string;
  fallbackUsed?: boolean;
}

class WebScraperService {
  private readonly USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  private readonly TIMEOUT = 10000; // 10 segundos
  private readonly MAX_CONTENT_LENGTH = 50000; // 50KB de texto

  /**
   * Extrai conteúdo principal de uma URL
   */
  async extractContent(url: string): Promise<ScrapingResult> {
    try {
      console.log('🔍 Iniciando extração de conteúdo:', url);

      // Valida URL
      if (!this.isValidUrl(url)) {
        return {
          success: false,
          error: 'URL inválida fornecida'
        };
      }

      // Tenta extração direta primeiro
      const directResult = await this.directExtraction(url);
      if (directResult.success) {
        console.log('✅ Extração direta bem-sucedida');
        return directResult;
      }

      // Se falhar, tenta método alternativo
      console.log('⚠️ Extração direta falhou, tentando método alternativo...');
      const fallbackResult = await this.fallbackExtraction(url);

      return {
        ...fallbackResult,
        fallbackUsed: true
      };

    } catch (error) {
      console.error('❌ Erro na extração de conteúdo:', error);
      return {
        success: false,
        error: `Erro ao extrair conteúdo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Verifica se é uma URL do Twitter/X
   */
  private isTwitterUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace('www.', '');
      return hostname === 'twitter.com' || hostname === 'x.com';
    } catch {
      return false;
    }
  }

  /**
   * Extrai conteúdo do Twitter/X usando oEmbed API (Bypass de bloqueio)
   */
  private async extractTwitterContent(url: string): Promise<ScrapingResult> {
    try {
      console.log('🐦 Detectado link do Twitter/X, usando estratégia oEmbed...');

      // Normaliza URL para garantir que funcione na API
      const cleanUrl = url.split('?')[0]; // Remove query params que podem atrapalhar
      const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(cleanUrl)}&lang=pt`;

      const response = await fetch(oembedUrl);

      if (!response.ok) {
        throw new Error(`Twitter oEmbed API error: ${response.status}`);
      }

      const data = await response.json();

      // O HTML vem com o texto do tweet dentro de um blockquote/p
      // Vamos limpar as tags para pegar o texto puro
      const rawHtml = data.html || '';

      // Extrai apenas o texto do tweet (remove tags HTML)
      const tweetText = rawHtml
        .replace(/<a[^>]*>.*?<\/a>/g, '') // Remove links (geralmente datas/nomes no final)
        .replace(/<[^>]*>/g, ' ') // Remove outras tags
        .replace(/\s+/g, ' ') // Normaliza espaços
        .trim();

      const authorName = data.author_name || 'Usuário do X';
      const title = `Post de ${authorName} no X`;

      const extractedContent: ExtractedContent = {
        title: title,
        content: `AUTOR: ${authorName}\n\nCONTEÚDO DO TWEET:\n"${tweetText}"\n\nURL ORIGINAL: ${url}`,
        description: `Post de ${authorName} na rede social X (antigo Twitter)`,
        author: authorName,
        siteName: 'X (Twitter)',
        url: url,
        wordCount: tweetText.split(/\s+/).length,
        extractedAt: new Date().toISOString()
      };

      console.log('✅ Tweet extraído com sucesso via oEmbed');

      return {
        success: true,
        data: extractedContent
      };

    } catch (error) {
      console.warn('⚠️ Falha na estratégia oEmbed do Twitter:', error);
      // Se falhar, deixa cair para o fallback padrão, mas loga o erro
      throw error;
    }
  }

  /**
   * Método principal de extração usando fetch
   */
  private async directExtraction(url: string): Promise<ScrapingResult> {
    try {
      // 1. Estratégia Especializada para Twitter/X
      if (this.isTwitterUrl(url)) {
        try {
          return await this.extractTwitterContent(url);
        } catch (e) {
          console.log('⚠️ Fallback de Twitter falhou, tentando método padrão...');
          // Continua para o método padrão se oEmbed falhar
        }
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': this.USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      return this.parseHtmlContent(html, url);

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: 'Timeout na requisição - site muito lento'
        };
      }

      return {
        success: false,
        error: `Erro na requisição: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Método alternativo usando API de proxy (se necessário)
   */
  private async fallbackExtraction(url: string): Promise<ScrapingResult> {
    try {
      // Para React Native, podemos usar uma API de proxy simples
      // ou tentar extrair metadados básicos
      const basicInfo = this.extractBasicInfoFromUrl(url);

      return {
        success: true,
        data: {
          title: basicInfo.title,
          content: `Link para análise: ${url}\n\nDomínio: ${basicInfo.domain}\nPath: ${basicInfo.path}`,
          siteName: basicInfo.domain,
          url: url,
          wordCount: 0,
          extractedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Falha no método alternativo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Processa HTML e extrai conteúdo estruturado
   */
  private parseHtmlContent(html: string, url: string): ScrapingResult {
    try {
      // Remove scripts e estilos
      const cleanHtml = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '');

      // Extrai metadados
      const title = this.extractTitle(cleanHtml);
      const description = this.extractDescription(cleanHtml);
      const author = this.extractAuthor(cleanHtml);
      const publishedDate = this.extractPublishedDate(cleanHtml);
      const siteName = this.extractSiteName(cleanHtml, url);

      // Extrai conteúdo principal
      const content = this.extractMainContent(cleanHtml);

      if (!content || content.length < 100) {
        return {
          success: false,
          error: 'Conteúdo insuficiente extraído da página'
        };
      }

      const extractedContent: ExtractedContent = {
        title: title || this.extractBasicInfoFromUrl(url).title,
        content: content.substring(0, this.MAX_CONTENT_LENGTH),
        description,
        author,
        publishedDate,
        siteName,
        url,
        wordCount: content.split(/\s+/).length,
        extractedAt: new Date().toISOString()
      };

      console.log(`📄 Conteúdo extraído: ${extractedContent.wordCount} palavras`);

      return {
        success: true,
        data: extractedContent
      };

    } catch (error) {
      return {
        success: false,
        error: `Erro ao processar HTML: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Extrai título da página
   */
  private extractTitle(html: string): string {
    // Prioridade: og:title > twitter:title > title tag
    const ogTitle = html.match(/<meta[^>]*property=["\']og:title["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i);
    if (ogTitle && ogTitle[1]) return this.cleanText(ogTitle[1]);

    const twitterTitle = html.match(/<meta[^>]*name=["\']twitter:title["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i);
    if (twitterTitle && twitterTitle[1]) return this.cleanText(twitterTitle[1]);

    const titleTag = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (titleTag && titleTag[1]) return this.cleanText(titleTag[1]);

    return '';
  }

  /**
   * Extrai descrição da página
   */
  private extractDescription(html: string): string {
    const ogDescription = html.match(/<meta[^>]*property=["\']og:description["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i);
    if (ogDescription && ogDescription[1]) return this.cleanText(ogDescription[1]);

    const metaDescription = html.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i);
    if (metaDescription && metaDescription[1]) return this.cleanText(metaDescription[1]);

    return '';
  }

  /**
   * Extrai autor do artigo
   */
  private extractAuthor(html: string): string {
    const authorMeta = html.match(/<meta[^>]*name=["\']author["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i);
    if (authorMeta && authorMeta[1]) return this.cleanText(authorMeta[1]);

    const articleAuthor = html.match(/<meta[^>]*property=["\']article:author["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i);
    if (articleAuthor && articleAuthor[1]) return this.cleanText(articleAuthor[1]);

    return '';
  }

  /**
   * Extrai data de publicação
   */
  private extractPublishedDate(html: string): string {
    const publishedTime = html.match(/<meta[^>]*property=["\']article:published_time["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i);
    if (publishedTime && publishedTime[1]) return publishedTime[1];

    const datePublished = html.match(/<meta[^>]*property=["\']datePublished["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i);
    if (datePublished && datePublished[1]) return datePublished[1];

    return '';
  }

  /**
   * Extrai nome do site
   */
  private extractSiteName(html: string, url: string): string {
    const ogSiteName = html.match(/<meta[^>]*property=["\']og:site_name["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i);
    if (ogSiteName && ogSiteName[1]) return this.cleanText(ogSiteName[1]);

    // Fallback para hostname
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return '';
    }
  }

  /**
   * Extrai conteúdo principal do artigo
   */
  private extractMainContent(html: string): string {
    // Remove tags HTML e extrai texto
    const textContent = html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Filtra parágrafos longos (provavelmente conteúdo principal)
    const paragraphs = textContent
      .split(/[.!?]+\s+/)
      .filter(p => p.length > 50)
      .slice(0, 20); // Primeiros 20 parágrafos relevantes

    return paragraphs.join('. ').trim();
  }

  /**
   * Extrai informações básicas da URL
   */
  private extractBasicInfoFromUrl(url: string): { title: string; domain: string; path: string } {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');
      const path = urlObj.pathname;

      // Lógica especial para Twitter/X se cair no fallback
      if (domain === 'twitter.com' || domain === 'x.com') {
        // Tenta extrair o nome de usuário da URL (ex: /elonmusk/status/...)
        const segments = path.split('/').filter(s => s.length > 0);
        const username = segments[0] || 'Usuário';

        return {
          title: `Post de @${username} no X`,
          domain: 'X (Twitter)',
          path
        };
      }

      // Gera título baseado no path
      const pathTitle = path
        .split('/')
        .filter(segment => segment.length > 0)
        .pop()
        ?.replace(/[-_]/g, ' ')
        ?.replace(/\.(html|php|aspx?)$/i, '') || '';

      // Se o pathTitle for apenas números (como um ID), evite usar como título principal
      const isNumericId = /^\d+$/.test(pathTitle);

      const title = (pathTitle && !isNumericId)
        ? `${pathTitle} - ${domain}`
        : `Notícia de ${domain}`;

      return { title, domain, path };
    } catch {
      return {
        title: 'Link para verificação',
        domain: 'site desconhecido',
        path: ''
      };
    }
  }

  /**
   * Limpa texto removendo caracteres especiais
   */
  private cleanText(text: string): string {
    return text
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Valida se a URL é válida
   */
  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Formata conteúdo extraído para análise da IA
   */
  formatForAI(extractedContent: ExtractedContent): string {
    let formattedContent = `\n\n=== CONTEÚDO EXTRAÍDO DO LINK ===\n`;
    formattedContent += `URL: ${extractedContent.url}\n`;
    formattedContent += `Título: ${extractedContent.title}\n`;

    if (extractedContent.siteName) {
      formattedContent += `Site: ${extractedContent.siteName}\n`;
    }

    if (extractedContent.author) {
      formattedContent += `Autor: ${extractedContent.author}\n`;
    }

    if (extractedContent.publishedDate) {
      formattedContent += `Data de publicação: ${extractedContent.publishedDate}\n`;
    }

    if (extractedContent.description) {
      formattedContent += `Descrição: ${extractedContent.description}\n`;
    }

    formattedContent += `Palavras: ${extractedContent.wordCount}\n`;
    formattedContent += `Extraído em: ${new Date(extractedContent.extractedAt).toLocaleString('pt-BR')}\n\n`;
    formattedContent += `CONTEÚDO PRINCIPAL:\n${extractedContent.content}\n`;
    formattedContent += `=== FIM DO CONTEÚDO EXTRAÍDO ===\n\n`;

    return formattedContent;
  }
}

// Instância singleton do serviço
export const webScraperService = new WebScraperService();

// Exporta tipos para uso em outros módulos
export type { ExtractedContent, ScrapingResult };
