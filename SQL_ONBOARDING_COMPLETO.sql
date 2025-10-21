-- =====================================================
-- SQL COMPLETO PARA ONBOARDING - CHECK NOW
-- Execute este código no SQL Editor do Supabase
-- Data: 2025-10-20
-- =====================================================

-- =====================================================
-- PARTE 1: ADICIONAR COLUNAS DE ONBOARDING
-- =====================================================

-- Adicionar colunas de onboarding na tabela profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS onboarding_skipped BOOLEAN DEFAULT false;

-- =====================================================
-- PARTE 2: CRIAR ÍNDICE PARA PERFORMANCE
-- =====================================================

-- Criar índice para melhorar performance de consultas
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding 
ON profiles(onboarding_completed);

-- =====================================================
-- PARTE 3: ADICIONAR COMENTÁRIOS (DOCUMENTAÇÃO)
-- =====================================================

COMMENT ON COLUMN profiles.onboarding_completed IS 
'Indica se o usuário completou o onboarding';

COMMENT ON COLUMN profiles.onboarding_completed_at IS 
'Data e hora que o usuário completou o onboarding';

COMMENT ON COLUMN profiles.onboarding_skipped IS 
'Indica se o usuário pulou o onboarding';

-- =====================================================
-- PARTE 4: ATUALIZAR USUÁRIOS EXISTENTES
-- =====================================================

-- IMPORTANTE: Marcar usuários EXISTENTES como tendo completado
-- para que apenas NOVOS usuários vejam o onboarding
UPDATE profiles
SET onboarding_completed = true,
    onboarding_completed_at = NOW()
WHERE onboarding_completed IS NULL 
   OR onboarding_completed = false;

-- =====================================================
-- PARTE 5: VERIFICAR ALTERAÇÕES
-- =====================================================

-- Verificar se as colunas foram criadas corretamente
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name IN ('onboarding_completed', 'onboarding_completed_at', 'onboarding_skipped')
ORDER BY ordinal_position;

-- =====================================================
-- PARTE 6: TESTAR CONSULTA (OPCIONAL)
-- =====================================================

-- Ver quantos usuários completaram onboarding
SELECT 
  COUNT(*) FILTER (WHERE onboarding_completed = true) as completaram,
  COUNT(*) FILTER (WHERE onboarding_completed = false) as nao_completaram,
  COUNT(*) FILTER (WHERE onboarding_skipped = true) as pularam,
  COUNT(*) as total
FROM profiles;

-- Ver últimos usuários e status de onboarding
SELECT 
  id,
  email,
  onboarding_completed,
  onboarding_skipped,
  onboarding_completed_at,
  created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- FIM DO SQL - TUDO PRONTO!
-- =====================================================

-- ✅ RESULTADO ESPERADO:
-- 1. 3 colunas novas na tabela profiles
-- 2. Índice criado para performance
-- 3. Usuários existentes marcados como "completado"
-- 4. Novos usuários verão o onboarding automaticamente
