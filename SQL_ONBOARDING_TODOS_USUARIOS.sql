-- =====================================================
-- SQL ONBOARDING - TODOS OS USUÁRIOS VERÃO
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
-- PARTE 4: GARANTIR QUE TODOS VEJAM ONBOARDING
-- =====================================================

-- ✅ DEIXAR TODOS OS USUÁRIOS COM onboarding_completed = false
-- Para que TODOS vejam o onboarding (inclusive existentes)
UPDATE profiles
SET onboarding_completed = false,
    onboarding_completed_at = NULL,
    onboarding_skipped = false
WHERE onboarding_completed IS NULL 
   OR onboarding_completed = true;

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
-- PARTE 6: VERIFICAR STATUS DOS USUÁRIOS
-- =====================================================

-- Ver status de todos os usuários
SELECT 
  id,
  email,
  onboarding_completed,
  onboarding_skipped,
  onboarding_completed_at,
  created_at
FROM profiles
ORDER BY created_at DESC;

-- Ver contagem
SELECT 
  COUNT(*) FILTER (WHERE onboarding_completed = true) as completaram,
  COUNT(*) FILTER (WHERE onboarding_completed = false) as nao_completaram,
  COUNT(*) FILTER (WHERE onboarding_skipped = true) as pularam,
  COUNT(*) as total
FROM profiles;

-- =====================================================
-- RESULTADO ESPERADO:
-- =====================================================
-- ✅ Todos os usuários com onboarding_completed = false
-- ✅ Todos verão o onboarding no próximo login
-- ✅ Incluindo usuários que já existiam antes

-- =====================================================
-- FIM DO SQL
-- =====================================================
