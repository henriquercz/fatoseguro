/**
 * Cache Service - Sistema inteligente de cache de verificações
 * 
 * Funcionalidades:
 * - Cache de verificações recentes para economia de API calls
 * - Detecção de notícias duplicadas/similares
 * - Expiração automática baseada no status da verificação
 * - Estatísticas de uso do cache
 * 
 * @author CheckNow Team
 * @version 1.0.0
 */

import { supabase } from './supabase';
import { NewsVerification } from '@/types';
import CryptoJS from 'crypto-js';

interface CachedVerification {
  id: string;
  content_hash: string;
  url_normalized?: string;
  verification_data: NewsVerification;
  cached_at: string;
  expires_at: string;
  hit_count: number;
  last_hit_at?: string;
}

interface CacheStats {
  totalCached: number;
  hitRate: number;
  apiCallsSaved: number;
}

class CacheService {
  /**
   * Normaliza URL removendo query params e fragmentos
   */
  private normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Remove query params e hash
      return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`.toLowerCase();
    } catch {
      return url.toLowerCase();
    }
  }

  /**
   * Gera hash SHA-256 do conteúdo
   */
  private generateContentHash(content: string): string {
    // Normaliza o conteúdo: remove espaços extras, lowercase
    const normalized = content.trim().toLowerCase().replace(/\s+/g, ' ');
    return CryptoJS.SHA256(normalized).toString();
  }

  /**
   * Calcula tempo de expiração baseado no status da verificação
   */
  private calculateExpiration(status: NewsVerification['verification_status']): Date {
    const now = new Date();
    
    switch (status) {
      case 'VERDADEIRO':
        // Notícias verdadeiras: cache de 7 dias
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      case 'FALSO':
        // Fake news: cache permanente (30 dias)
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      case 'INDETERMINADO':
        // Indeterminadas: cache curto (12 horas)
        return new Date(now.getTime() + 12 * 60 * 60 * 1000);
      
      default:
        // Padrão: 24 horas
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  }

  /**
   * Busca verificação no cache
   * Retorna null se não encontrar ou se expirado
   */
  async findInCache(
    content: string,
    type: 'text' | 'link'
  ): Promise<NewsVerification | null> {
    try {
      let query = supabase
        .from('verification_cache')
        .select('*')
        .gt('expires_at', new Date().toISOString())
        .limit(1);

      if (type === 'link') {
        const normalizedUrl = this.normalizeUrl(content);
        query = query.eq('url_normalized', normalizedUrl);
      } else {
        const contentHash = this.generateContentHash(content);
        query = query.eq('content_hash', contentHash);
      }

      const { data, error } = await query.single();

      if (error || !data) {
        console.log('🔍 Cache miss - verificação não encontrada');
        return null;
      }

      const cachedData = data as unknown as CachedVerification;

      // Incrementa contador de hits
      await this.incrementHitCount(cachedData.id);

      console.log('✅ Cache hit! Retornando verificação em cache');
      console.log(`📊 Esta verificação foi reutilizada ${cachedData.hit_count + 1} vezes`);

      return cachedData.verification_data as NewsVerification;
    } catch (error) {
      console.error('❌ Erro ao buscar no cache:', error);
      return null;
    }
  }

  /**
   * Salva verificação no cache
   */
  async saveToCache(
    verification: NewsVerification,
    content: string,
    type: 'text' | 'link'
  ): Promise<void> {
    try {
      const contentHash = this.generateContentHash(content);
      const expiresAt = this.calculateExpiration(verification.verification_status);

      const cacheData = {
        content_hash: contentHash,
        url_normalized: type === 'link' ? this.normalizeUrl(content) : null,
        verification_data: verification,
        expires_at: expiresAt.toISOString(),
        original_verification_id: verification.id,
      };

      const { error } = await supabase
        .from('verification_cache')
        .upsert(cacheData as any, {
          onConflict: type === 'link' ? 'url_normalized' : 'content_hash',
        });

      if (error) {
        console.error('❌ Erro ao salvar no cache:', error);
        return;
      }

      console.log('💾 Verificação salva no cache');
      console.log(`⏰ Expira em: ${expiresAt.toLocaleString('pt-BR')}`);
    } catch (error) {
      console.error('❌ Erro ao salvar no cache:', error);
    }
  }

  /**
   * Incrementa contador de hits do cache
   */
  private async incrementHitCount(cacheId: string): Promise<void> {
    try {
      await supabase.rpc('increment_cache_hit', { cache_id: cacheId } as any);
    } catch (error) {
      console.error('Erro ao incrementar hit count:', error);
    }
  }

  /**
   * Limpa cache expirado
   */
  async cleanExpiredCache(): Promise<void> {
    try {
      await supabase.rpc('clean_expired_cache');
      console.log('🧹 Cache expirado limpo com sucesso');
    } catch (error) {
      console.error('❌ Erro ao limpar cache expirado:', error);
    }
  }

  /**
   * Obtém estatísticas do cache
   */
  async getCacheStats(): Promise<CacheStats> {
    try {
      const { data, error } = await supabase
        .from('verification_cache')
        .select('hit_count')
        .gt('expires_at', new Date().toISOString());

      if (error || !data) {
        return { totalCached: 0, hitRate: 0, apiCallsSaved: 0 };
      }

      const cacheData = data as unknown as Array<{ hit_count: number }>;
      const totalCached = cacheData.length;
      const totalHits = cacheData.reduce((sum, item) => sum + item.hit_count, 0);
      const apiCallsSaved = totalHits;

      return {
        totalCached,
        hitRate: totalCached > 0 ? (totalHits / totalCached) * 100 : 0,
        apiCallsSaved,
      };
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas do cache:', error);
      return { totalCached: 0, hitRate: 0, apiCallsSaved: 0 };
    }
  }

  /**
   * Invalida cache de uma verificação específica
   */
  async invalidateCache(content: string, type: 'text' | 'link'): Promise<void> {
    try {
      let query = supabase.from('verification_cache').delete();

      if (type === 'link') {
        const normalizedUrl = this.normalizeUrl(content);
        query = query.eq('url_normalized', normalizedUrl);
      } else {
        const contentHash = this.generateContentHash(content);
        query = query.eq('content_hash', contentHash);
      }

      await query;
      console.log('🗑️ Cache invalidado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao invalidar cache:', error);
    }
  }
}

// Exporta instância única do serviço
export const cacheService = new CacheService();
