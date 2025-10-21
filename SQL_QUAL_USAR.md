# 🗂️ QUAL SQL USAR PARA ONBOARDING?

## 🎯 **3 OPÇÕES DE SQL:**

---

## **OPÇÃO 1: SQL_ONBOARDING_COMPLETO.sql** ❌ (NÃO USE ESTE)

### **O que faz:**
- Cria colunas de onboarding ✅
- Marca usuários **EXISTENTES** como `onboarding_completed = true` ❌
- Apenas **NOVOS** usuários verão onboarding

### **Quando usar:**
- Se você quer que apenas cadastros **FUTUROS** vejam onboarding
- Usuários atuais NÃO verão

### **Resultado:**
```sql
-- Usuários existentes
onboarding_completed = true  ❌ (já viu, não mostra)

-- Usuários novos (a partir de agora)
onboarding_completed = false ✅ (vai ver onboarding)
```

---

## **OPÇÃO 2: SQL_ONBOARDING_TODOS_USUARIOS.sql** ✅ (USE ESTE!)

### **O que faz:**
- Cria colunas de onboarding ✅
- Marca **TODOS** usuários como `onboarding_completed = false` ✅
- **TODOS** verão onboarding (existentes + novos)

### **Quando usar:**
- Se você quer que **TODOS** vejam o onboarding
- Incluindo usuários que já existiam antes
- **RECOMENDADO PARA VOCÊ!** 🎯

### **Resultado:**
```sql
-- Todos os usuários (existentes + novos)
onboarding_completed = false ✅ (todos vão ver)
```

### **Como executar:**
```
1. Supabase → SQL Editor
2. Cole o conteúdo de SQL_ONBOARDING_TODOS_USUARIOS.sql
3. RUN
4. ✅ Pronto!
```

---

## **OPÇÃO 3: SQL_RESETAR_ONBOARDING.sql** 🔄 (SE JÁ EXECUTOU O PRIMEIRO)

### **O que faz:**
- **APENAS** reseta onboarding de todos para `false`
- Não cria colunas (assume que já existem)

### **Quando usar:**
- Se você **JÁ EXECUTOU** o `SQL_ONBOARDING_COMPLETO.sql`
- E agora quer que todos vejam onboarding de novo

### **Resultado:**
```sql
-- Reseta todos
onboarding_completed = false ✅
onboarding_completed_at = NULL
onboarding_skipped = false
```

---

## 📊 **COMPARAÇÃO:**

| SQL | Cria Colunas | Quem vê Onboarding | Quando Usar |
|-----|--------------|-------------------|-------------|
| **COMPLETO** | ✅ | Apenas novos | Se quer poupar usuários existentes |
| **TODOS_USUARIOS** | ✅ | Todos (existentes + novos) | **✅ RECOMENDADO** |
| **RESETAR** | ❌ | Todos | Se já executou o primeiro e quer mudar |

---

## 🎯 **RECOMENDAÇÃO PARA VOCÊ:**

### **Use: `SQL_ONBOARDING_TODOS_USUARIOS.sql`**

**Por quê:**
- ✅ Todos os usuários verão o onboarding
- ✅ Você pode testar com sua própria conta
- ✅ Boa experiência para todos
- ✅ Apresenta o app mesmo para quem já usa

**Desvantagem:**
- ⚠️ Usuários atuais verão o onboarding (mas é rápido, 30s)

---

## 🚀 **PASSO A PASSO:**

### **1. Escolha o SQL:**
```
✅ SQL_ONBOARDING_TODOS_USUARIOS.sql
   (Todos verão onboarding)
```

### **2. Execute no Supabase:**
```
1. https://supabase.com
2. Seu projeto Check Now
3. SQL Editor
4. New Query
5. Cole o SQL completo
6. RUN
```

### **3. Verifique:**
```sql
-- Todos devem ter onboarding_completed = false
SELECT 
  email,
  onboarding_completed
FROM profiles;
```

### **4. Teste no app:**
```
1. Recarregue app (R no Expo)
2. Faça login
3. ✅ Deve aparecer onboarding
```

---

## 🔄 **SE MUDOU DE IDEIA:**

### **Caso 1: Executou SQL errado**
```sql
-- Use SQL_RESETAR_ONBOARDING.sql
-- Ele reseta todos para verem onboarding
```

### **Caso 2: Quer que alguns não vejam**
```sql
-- Marcar usuários específicos como "completado"
UPDATE profiles
SET onboarding_completed = true,
    onboarding_completed_at = NOW()
WHERE email IN (
  'seuemail@exemplo.com',
  'outroemail@exemplo.com'
);
```

### **Caso 3: Quer testar só com você**
```sql
-- Resetar apenas seu usuário
UPDATE profiles
SET onboarding_completed = false,
    onboarding_completed_at = NULL
WHERE email = 'seuemail@exemplo.com';
```

---

## ✅ **RESUMO:**

```
SITUAÇÃO: Quer que TODOS vejam onboarding
ARQUIVO: SQL_ONBOARDING_TODOS_USUARIOS.sql
AÇÃO: Executar no Supabase SQL Editor
RESULTADO: Todos usuários verão onboarding no próximo login
```

---

## 📝 **NOTA IMPORTANTE:**

O primeiro SQL (`SQL_ONBOARDING_COMPLETO.sql`) foi pensado para:
```
"Não incomodar usuários atuais com onboarding,
 mostrar apenas para quem está chegando agora"
```

Mas como você quer que **TODOS** vejam (incluindo atuais), use:
```
SQL_ONBOARDING_TODOS_USUARIOS.sql ✅
```

---

**Recomendação Final:** Use `SQL_ONBOARDING_TODOS_USUARIOS.sql` 🎯
