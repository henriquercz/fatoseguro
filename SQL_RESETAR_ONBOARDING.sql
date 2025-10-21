-- =====================================================
-- SQL PARA RESETAR ONBOARDING DE TODOS OS USUÁRIOS
-- Use este SQL SE você já executou o SQL anterior
-- e quer que TODOS os usuários vejam o onboarding
-- =====================================================

-- =====================================================
-- RESETAR ONBOARDING DE TODOS OS USUÁRIOS
-- =====================================================

-- Marcar TODOS os usuários para verem o onboarding novamente
UPDATE profiles
SET 
  onboarding_completed = false,
  onboarding_completed_at = NULL,
  onboarding_skipped = false;

-- =====================================================
-- VERIFICAR RESULTADO
-- =====================================================

-- Verificar se todos estão com onboarding_completed = false
SELECT 
  COUNT(*) as total_usuarios,
  COUNT(*) FILTER (WHERE onboarding_completed = false) as vao_ver_onboarding,
  COUNT(*) FILTER (WHERE onboarding_completed = true) as ja_completaram
FROM profiles;

-- Ver detalhes de cada usuário
SELECT 
  email,
  onboarding_completed,
  onboarding_skipped,
  created_at
FROM profiles
ORDER BY created_at DESC;

-- =====================================================
-- RESULTADO ESPERADO:
-- ✅ Todos os usuários com onboarding_completed = false
-- ✅ Todos verão o onboarding no próximo login
-- =====================================================
