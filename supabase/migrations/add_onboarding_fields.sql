-- =====================================================
-- MIGRATION: Adicionar campos de onboarding
-- Descrição: Adiciona controle de onboarding completado
-- Data: 2025-10-20
-- =====================================================

-- 1. Adicionar colunas de onboarding na tabela profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS onboarding_skipped BOOLEAN DEFAULT false;

-- 2. Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding 
ON profiles(onboarding_completed);

-- 3. Comentários para documentação
COMMENT ON COLUMN profiles.onboarding_completed IS 
'Indica se o usuário completou o onboarding';

COMMENT ON COLUMN profiles.onboarding_completed_at IS 
'Data e hora que o usuário completou o onboarding';

COMMENT ON COLUMN profiles.onboarding_skipped IS 
'Indica se o usuário pulou o onboarding';

-- 4. Atualizar usuários existentes (considerar como já tendo visto)
-- Para que apenas NOVOS usuários vejam o onboarding
UPDATE profiles
SET onboarding_completed = true,
    onboarding_completed_at = NOW()
WHERE onboarding_completed IS NULL 
   OR onboarding_completed = false;

-- 5. Verificar alterações
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
-- FIM DA MIGRATION
-- =====================================================
