-- Tabela de cache de verificações
-- Armazena resultados de verificações recentes para economia de API calls
CREATE TABLE IF NOT EXISTS verification_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificadores únicos para busca
  content_hash TEXT NOT NULL,
  url_normalized TEXT,
  
  -- Dados da verificação em cache
  verification_data JSONB NOT NULL,
  
  -- Metadados do cache
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  hit_count INTEGER DEFAULT 0,
  last_hit_at TIMESTAMP WITH TIME ZONE,
  
  -- Estatísticas
  original_verification_id UUID,
  
  -- Índices para busca rápida
  CONSTRAINT unique_content_hash UNIQUE (content_hash),
  CONSTRAINT unique_url UNIQUE (url_normalized)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_cache_content_hash ON verification_cache(content_hash);
CREATE INDEX IF NOT EXISTS idx_cache_url ON verification_cache(url_normalized) WHERE url_normalized IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cache_expires ON verification_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_cache_hit_count ON verification_cache(hit_count DESC);

-- Função para limpar cache expirado automaticamente
CREATE OR REPLACE FUNCTION clean_expired_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM verification_cache
  WHERE expires_at < NOW();
END;
$$;

-- Função para incrementar hit count
CREATE OR REPLACE FUNCTION increment_cache_hit(cache_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE verification_cache
  SET 
    hit_count = hit_count + 1,
    last_hit_at = NOW()
  WHERE id = cache_id;
END;
$$;

-- Comentários para documentação
COMMENT ON TABLE verification_cache IS 'Cache de verificações de notícias para economia de API calls';
COMMENT ON COLUMN verification_cache.content_hash IS 'Hash SHA-256 do conteúdo da notícia';
COMMENT ON COLUMN verification_cache.url_normalized IS 'URL normalizada (sem query params) para links';
COMMENT ON COLUMN verification_cache.verification_data IS 'Dados completos da verificação em formato JSON';
COMMENT ON COLUMN verification_cache.hit_count IS 'Número de vezes que este cache foi reutilizado';
COMMENT ON COLUMN verification_cache.expires_at IS 'Data/hora de expiração do cache';

-- RLS (Row Level Security) - Cache é público para leitura
ALTER TABLE verification_cache ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ler o cache
CREATE POLICY "Cache é público para leitura"
  ON verification_cache
  FOR SELECT
  TO public
  USING (true);

-- Política: Apenas sistema pode inserir/atualizar cache
CREATE POLICY "Sistema pode gerenciar cache"
  ON verification_cache
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
