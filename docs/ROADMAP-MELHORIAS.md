# 🚀 ROADMAP DE MELHORIAS - CheckNow

**Documento de Planejamento de Novas Funcionalidades**  
Data: 21/10/2025  
Versão: 1.0

---

## 📋 ÍNDICE

1. [Análise do Sistema Atual](#análise-do-sistema-atual)
2. [Fila de Processamento](#fila-de-processamento)
3. [Funcionalidades por Complexidade](#funcionalidades-por-complexidade)
4. [Cronograma Sugerido](#cronograma-sugerido)

---

## 🔍 ANÁLISE DO SISTEMA ATUAL

### ✅ O QUE JÁ FUNCIONA BEM

```typescript
// Sistema atual de verificação
verifyNews() {
  1. Dispatch VERIFY_REQUEST (isLoading = true)
  2. Verifica limite de uso
  3. Busca no cache
  4. Se não encontrar: chama APIs (Gemini, Brave, WebScraper)
  5. Salva no Supabase
  6. Salva no cache
  7. Dispatch VERIFY_SUCCESS
}
```

**Pontos Fortes:**
- ✅ Sistema de cache implementado
- ✅ Integração com múltiplas APIs
- ✅ Controle de limites mensais
- ✅ Suporte a usuários premium
- ✅ Histórico salvo no banco

### ⚠️ PROBLEMAS IDENTIFICADOS

#### **1. Concorrência Não Controlada**
```typescript
// PROBLEMA: Se usuário clicar 3x rápido no botão "Verificar"
onClick() {
  verifyNews(); // Request 1 - isLoading = true
  verifyNews(); // Request 2 - isLoading = true (sobrescreve)
  verifyNews(); // Request 3 - isLoading = true (sobrescreve)
  // Resultado: 3 chamadas para Gemini API ($$$ gasto triplo)
  // Estado confuso, contador de verificações errado
}
```

**Impacto:**
- 💸 Gasto desnecessário de API (Gemini cobra por request)
- 🐛 Race conditions no estado
- 📉 Contador de verificações inconsistente
- 🔥 Possível crash em uso intenso

#### **2. Sem Controle de Carga**
```typescript
// PROBLEMA: 100 usuários verificando ao mesmo tempo
// Todas as 100 requests vão para Gemini simultaneamente
// Possíveis erros:
// - Rate limit exceeded (429)
// - Timeout
// - Memory overflow
```

#### **3. Sem Sistema de Retry**
```typescript
// PROBLEMA: Se Gemini API falhar (network error)
// Usuário perde 1 verificação do limite
// Não há retry automático
```

#### **4. Sem Priorização**
```typescript
// PROBLEMA: Request de usuário FREE tem mesma prioridade que PREMIUM
// Usuário premium paga mas não tem benefício de velocidade
```

---

## 🔧 SOLUÇÃO: FILA DE PROCESSAMENTO

### **Por Que Implementar?**

✅ **Previne duplicatas** - Usuário não pode fazer 3 requests iguais  
✅ **Prioriza premium** - Fila prioritária para quem paga  
✅ **Controla carga** - Máximo de N verificações simultâneas  
✅ **Retry automático** - Tenta novamente se falhar  
✅ **Melhor UX** - Feedback de "posição na fila"  
✅ **Escalabilidade** - Suporta 1000+ usuários

### **Quando NÃO Implementar?**

❌ Se app terá no máximo 10-20 usuários simultâneos  
❌ Se orçamento de APIs é ilimitado  
❌ Se projeto é apenas acadêmico sem uso real  

### **RECOMENDAÇÃO: IMPLEMENTAR AGORA**

**Motivos:**
1. 🎓 **Diferencial para TCC** - Mostra conhecimento avançado
2. 💰 **Economia de API** - Evita gastos desnecessários
3. 🚀 **Preparado para escalar** - Se app viralizar, já está pronto
4. 🐛 **Previne bugs** - Elimina race conditions

---

## 📊 IMPLEMENTAÇÃO DA FILA

### **Arquitetura Proposta**

```
┌─────────────┐
│   USUÁRIO   │
└──────┬──────┘
       │
       │ verifyNews()
       ▼
┌─────────────────────┐
│  FILA PRIORITÁRIA   │
│                     │
│ 1. Premium (alta)   │
│ 2. Free (normal)    │
│ 3. Retry (baixa)    │
└──────┬──────────────┘
       │
       │ Processa 5 por vez (configurável)
       ▼
┌─────────────────────┐
│   WORKERS (5)       │
│                     │
│ Worker 1 → Gemini   │
│ Worker 2 → Gemini   │
│ Worker 3 → Gemini   │
│ Worker 4 → Gemini   │
│ Worker 5 → Gemini   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│   RESULTADO         │
│   + Cache           │
│   + Supabase        │
└─────────────────────┘
```

### **Tecnologias**

#### **Opção 1: Fila Local (React Native)**
```typescript
// Simples, roda no app
// Bom para MVP e TCC
import Queue from 'async-await-queue';

Prós:
✅ Fácil de implementar (1-2 horas)
✅ Sem infraestrutura extra
✅ Funciona offline

Contras:
❌ Fila morre se app fechar
❌ Não compartilhada entre usuários
❌ Sem persistência
```

#### **Opção 2: Bull/BullMQ (Requer Backend)**
```typescript
// Profissional, requer Redis
import Bull from 'bull';

Prós:
✅ Persistente (fila sobrevive a crashes)
✅ Compartilhada (todos os usuários)
✅ Dashboard de monitoramento
✅ Retry automático avançado

Contras:
❌ Requer backend Node.js
❌ Requer Redis (servidor)
❌ Mais complexo (5-10 horas)
```

### **RECOMENDAÇÃO: Opção 1 (Fila Local)**

**Por quê?**
- ✅ Suficiente para TCC
- ✅ Resolve 90% dos problemas
- ✅ Rápido de implementar
- ✅ Sem custo de infraestrutura
- ⚠️ Futuramente migrar para Opção 2 se necessário

---

## 🎯 FUNCIONALIDADES POR COMPLEXIDADE

### **NÍVEL 1: FÁCIL (1-4 horas cada)**

#### **1.1 Sistema de Fila Local**
**Complexidade:** ⭐ (1-2h)  
**Impacto:** 🔥🔥🔥🔥🔥  
**Prioridade:** CRÍTICA

```typescript
// Estrutura
interface QueueItem {
  id: string;
  userId: string;
  news: string;
  type: 'text' | 'link';
  priority: 'high' | 'normal' | 'low';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retries: number;
  createdAt: Date;
}

// Funcionalidades
- Adicionar à fila
- Processar com limite de concorrência
- Remover duplicatas
- Feedback de posição na fila
```

**Arquivos a criar:**
- `lib/verificationQueue.ts`
- `contexts/QueueContext.tsx`

**Modificações:**
- `contexts/VerificationContext.tsx` (usar fila)

---

#### **1.2 Debounce no Botão de Verificar**
**Complexidade:** ⭐ (30min)  
**Impacto:** 🔥🔥🔥  
**Prioridade:** ALTA

```typescript
// Previne cliques múltiplos
const [isDebouncing, setIsDebouncing] = useState(false);

const handleVerify = async () => {
  if (isDebouncing) return; // Ignora cliques repetidos
  
  setIsDebouncing(true);
  await verifyNews();
  
  setTimeout(() => setIsDebouncing(false), 2000); // 2s cooldown
};
```

**Arquivos a modificar:**
- `components/VerifyForm.tsx`

---

#### **1.3 Indicador de "Verificando..." Melhorado**
**Complexidade:** ⭐ (1h)  
**Impacto:** 🔥🔥🔥  
**Prioridade:** ALTA

```typescript
// Feedback visual melhor
<View>
  {queuePosition > 0 && (
    <Text>Posição na fila: {queuePosition}</Text>
  )}
  
  {isProcessing && (
    <View>
      <ActivityIndicator />
      <Text>Analisando com IA...</Text>
      <Text>{progress}% concluído</Text>
    </View>
  )}
</View>
```

**Arquivos a modificar:**
- `components/VerifyForm.tsx`
- `app/index.tsx` (tela home)

---

#### **1.4 Cache Automático de Links Populares**
**Complexidade:** ⭐⭐ (2h)  
**Impacto:** 🔥🔥🔥🔥  
**Prioridade:** ALTA

```typescript
// Pre-carrega links que estão bombando
interface TrendingCache {
  url: string;
  verificationCount: number; // Quantas vezes foi verificado
  lastVerified: Date;
  result: NewsVerification;
}

// Se link foi verificado 5+ vezes hoje, mantém no cache quente
```

**Arquivos a criar:**
- `lib/trendingCache.ts`

**Modificações:**
- `lib/cacheService.ts`

---

### **NÍVEL 2: MÉDIO (4-8 horas cada)**

#### **2.1 Sistema de Gamificação Básico**
**Complexidade:** ⭐⭐⭐ (6h)  
**Impacto:** 🔥🔥🔥🔥🔥  
**Prioridade:** ALTA

```typescript
// Badges e conquistas
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number; // 0-100
}

// Exemplos de conquistas
const achievements = [
  {
    id: 'first_check',
    title: 'Primeira Verificação',
    description: 'Verificou sua primeira notícia',
    icon: '🔍',
    requirement: { verifications: 1 }
  },
  {
    id: 'fact_hunter',
    title: 'Caçador de Fakes',
    description: 'Verificou 10 notícias',
    icon: '🎯',
    requirement: { verifications: 10 }
  },
  {
    id: 'week_streak',
    title: 'Dedicado',
    description: 'Usou o app 7 dias seguidos',
    icon: '🔥',
    requirement: { streak: 7 }
  }
];

// Sistema de streak (dias consecutivos)
interface UserStreak {
  current: number;
  longest: number;
  lastCheckDate: Date;
}
```

**Arquivos a criar:**
- `lib/achievements.ts`
- `contexts/AchievementContext.tsx`
- `components/AchievementBadge.tsx`
- `components/AchievementModal.tsx`
- `app/(tabs)/achievements.tsx` (nova tela)

**Banco de dados:**
```sql
-- Nova tabela
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  progress INTEGER DEFAULT 0
);

CREATE TABLE user_stats (
  user_id UUID PRIMARY KEY REFERENCES profiles(id),
  total_verifications INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_check_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

#### **2.2 Notificações Push Inteligentes**
**Complexidade:** ⭐⭐⭐ (6h)  
**Impacto:** 🔥🔥🔥🔥  
**Prioridade:** MÉDIA

```typescript
// Notifica quando notícia verificada foi atualizada
interface PushNotification {
  type: 'update' | 'trending_fake' | 'achievement' | 'reminder';
  title: string;
  body: string;
  data: any;
}

// Exemplos:
// - "Uma notícia que você verificou foi atualizada"
// - "Fake news viral detectada: [título]"
// - "Nova conquista desbloqueada! 🎉"
// - "Você não verifica notícias há 3 dias"
```

**Arquivos a criar:**
- `lib/notifications.ts`
- `hooks/useNotifications.ts`

**Dependências:**
- `expo-notifications`
- Configurar Firebase Cloud Messaging

---

#### **2.3 Modo Offline Inteligente**
**Complexidade:** ⭐⭐⭐ (8h)  
**Impacto:** 🔥🔥🔥🔥  
**Prioridade:** MÉDIA

```typescript
// TensorFlow Lite - modelo leve para análise offline
interface OfflineML {
  model: TensorFlowLiteModel;
  
  predict(text: string): {
    status: 'VERDADEIRO' | 'FALSO' | 'INDETERMINADO';
    confidence: number; // 0-100
    needsOnlineCheck: boolean;
  };
}

// Funcionalidades:
// - Cache de últimas 100 verificações
// - Modelo ML local treinado com histórico
// - Fila de sincronização quando voltar online
// - Indicador visual "Modo Offline"
```

**Arquivos a criar:**
- `lib/offlineML.ts`
- `lib/syncQueue.ts`
- `models/verification_model.tflite` (modelo treinado)

**Dependências:**
- `@tensorflow/tfjs`
- `@tensorflow/tfjs-react-native`

---

### **NÍVEL 3: DIFÍCIL (8-16 horas cada)**

#### **3.1 Verificação de Imagens e Vídeos**
**Complexidade:** ⭐⭐⭐⭐⭐ (16h)  
**Impacto:** 🔥🔥🔥🔥🔥  
**Prioridade:** MUITO ALTA (Diferencial Técnico)

```typescript
// Análise multimodal
interface MediaVerification {
  type: 'image' | 'video';
  file: File | URI;
  
  analysis: {
    // Busca reversa de imagem
    reverseImageSearch: {
      provider: 'Google Vision' | 'TinEye';
      results: Array<{
        url: string;
        title: string;
        date: Date;
        similarity: number;
      }>;
    };
    
    // Detecção de manipulação
    manipulation: {
      isEdited: boolean;
      confidence: number;
      areas?: BoundingBox[]; // Áreas manipuladas
      techniques?: string[]; // 'deepfake', 'photoshop', etc
    };
    
    // Metadados EXIF
    metadata: {
      camera: string;
      location?: { lat: number; lng: number };
      timestamp: Date;
      software?: string;
    };
    
    // Análise contextual
    context: {
      description: string;
      tags: string[];
      aiAnalysis: string;
    };
  };
}
```

**APIs Necessárias:**
- Google Vision API (reverse image search)
- DeepWare API (deepfake detection)
- Hugging Face (análise de imagem com IA)

**Arquivos a criar:**
- `lib/imageVerification.ts`
- `lib/videoVerification.ts`
- `components/MediaUploader.tsx`
- `components/MediaAnalysisResult.tsx`

**Fluxo:**
```
1. Usuário seleciona imagem/vídeo
2. Upload para Supabase Storage
3. Extrai metadados (EXIF)
4. Faz busca reversa (Google Vision)
5. Analisa com IA (Gemini Vision)
6. Detecta deepfake (se vídeo)
7. Gera relatório completo
```

---

#### **3.2 Extensão de Navegador (Chrome/Firefox)**
**Complexidade:** ⭐⭐⭐⭐ (12h)  
**Impacto:** 🔥🔥🔥🔥🔥  
**Prioridade:** ALTA (Alcance Massivo)

```typescript
// Manifest V3 (Chrome)
{
  "manifest_version": 3,
  "name": "CheckNow - Verificador de Notícias",
  "version": "1.0",
  "permissions": ["activeTab", "storage"],
  
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"]
  }],
  
  "action": {
    "default_popup": "popup.html"
  }
}

// Funcionalidades:
// 1. Usuário seleciona texto → botão flutuante aparece
// 2. Clica no botão → verificação instantânea
// 3. Destaca notícias falsas em vermelho
// 4. Badge com contador de fakes na página
// 5. Lista de sites não confiáveis
```

**Estrutura do Projeto:**
```
extension/
├── manifest.json
├── popup/
│   ├── popup.html
│   ├── popup.tsx
│   └── popup.css
├── content/
│   ├── content.ts (injeta no site)
│   └── FloatingButton.tsx
├── background/
│   └── background.ts (service worker)
└── assets/
    └── icons/
```

**Distribuição:**
- Chrome Web Store
- Firefox Add-ons
- Edge Add-ons

---

#### **3.3 Bot para WhatsApp/Telegram**
**Complexidade:** ⭐⭐⭐⭐ (10h)  
**Impacto:** 🔥🔥🔥🔥🔥  
**Prioridade:** MUITO ALTA (Impacto Social)

```typescript
// Twilio para WhatsApp
interface WhatsAppBot {
  handleMessage(from: string, message: string): Promise<void>;
  sendVerification(to: string, result: NewsVerification): Promise<void>;
}

// Fluxo:
// 1. Usuário envia link/texto para o bot
// 2. Bot responde: "🔍 Verificando..."
// 3. Processa verificação
// 4. Bot responde com resultado formatado
// 5. Usuário pode pedir mais detalhes
```

**Exemplo de Conversa:**
```
Usuário: https://g1.globo.com/noticia-qualquer

Bot: 🔍 Verificando notícia...

Bot: ✅ VERDADEIRO
"Governo anuncia novo programa social"

📊 Análise: Esta notícia foi confirmada por múltiplas 
fontes jornalísticas confiáveis.

🔗 Fontes: G1, Folha, Estadão
⏰ Verificado há 2 minutos

Digite "detalhes" para mais informações
Digite "fonte" para ver as fontes completas
```

**Arquivos a criar:**
- `backend/bots/whatsapp.ts`
- `backend/bots/telegram.ts`
- `backend/utils/messageFormatter.ts`

**Infraestrutura:**
- Twilio (WhatsApp Business API)
- Telegram Bot API (gratuito)
- Webhook endpoint no backend

---

#### **3.4 Dashboard Web Administrativo**
**Complexidade:** ⭐⭐⭐⭐ (12h)  
**Impacto:** 🔥🔥🔥🔥  
**Prioridade:** MÉDIA

```typescript
// Next.js 14 App Router
app/
├── (dashboard)/
│   ├── layout.tsx
│   ├── page.tsx (overview)
│   ├── users/
│   ├── verifications/
│   ├── analytics/
│   └── settings/
└── api/
    └── admin/

// Funcionalidades:
// - Estatísticas em tempo real
// - Gráficos de uso (Chart.js)
// - Gerenciamento de usuários
// - Moderação de conteúdo
// - Logs do sistema
// - Configurações globais
```

**Métricas:**
- Total de verificações (hoje, semana, mês)
- Taxa de cache hit
- Custo de APIs
- Usuários ativos
- Top fake news do momento
- Performance das APIs

---

### **NÍVEL 4: AVANÇADO (16+ horas cada)**

#### **4.1 Machine Learning Próprio**
**Complexidade:** ⭐⭐⭐⭐⭐ (40h+)  
**Impacto:** 🔥🔥🔥🔥🔥  
**Prioridade:** BAIXA (Longo Prazo)

```python
# Treinamento do modelo
# 1. Coleta dados (10k+ verificações do CheckNow)
# 2. Treina modelo BERT fine-tuned
# 3. Deploy no TensorFlow Serving
# 4. Integra no app

# Pipeline:
# Texto → Tokenização → BERT → Classificação
# Output: [VERDADEIRO, FALSO, INDETERMINADO] + confidence

# Vantagens:
# - Reduz 80% de custo com Gemini
# - 3x mais rápido
# - Funciona offline
# - Aprende com contexto brasileiro
```

**Tecnologias:**
- Python + PyTorch/TensorFlow
- Hugging Face Transformers
- TensorFlow Serving (deploy)
- Google Colab (treinamento gratuito)

---

#### **4.2 Blockchain para Auditoria**
**Complexidade:** ⭐⭐⭐⭐⭐ (20h)  
**Impacto:** 🔥🔥🔥  
**Prioridade:** BAIXA (Inovação)

```solidity
// Smart Contract (Polygon)
contract CheckNowAudit {
  struct Verification {
    bytes32 newsHash;    // SHA-256 do conteúdo
    string status;       // VERDADEIRO/FALSO/INDETERMINADO
    uint256 timestamp;
    string aiVersion;
  }
  
  mapping(bytes32 => Verification) public verifications;
  
  function recordVerification(
    bytes32 newsHash,
    string memory status
  ) public {
    verifications[newsHash] = Verification({
      newsHash: newsHash,
      status: status,
      timestamp: block.timestamp,
      aiVersion: "gemini-2.5-flash"
    });
  }
}
```

**Benefícios:**
- Transparência total
- Prova de que verificação não foi alterada
- Auditoria pública
- Diferencial técnico para TCC

---

## 📅 CRONOGRAMA SUGERIDO

### **FASE 1: MELHORIAS CRÍTICAS (1 semana)**

| Dia | Tarefa | Horas |
|-----|--------|-------|
| 1 | Sistema de Fila Local | 2h |
| 1 | Debounce no Botão | 0.5h |
| 1 | Indicador Melhorado | 1h |
| 2 | Cache de Links Populares | 2h |
| 3-5 | Verificação de Imagens | 16h |
| 6 | Testes e Ajustes | 4h |
| 7 | Documentação | 2h |

**Total:** ~28 horas

---

### **FASE 2: ENGAJAMENTO (1 semana)**

| Dia | Tarefa | Horas |
|-----|--------|-------|
| 1-2 | Sistema de Gamificação | 6h |
| 3-4 | Notificações Push | 6h |
| 5-6 | Modo Offline | 8h |
| 7 | Testes e Ajustes | 4h |

**Total:** ~24 horas

---

### **FASE 3: EXPANSÃO (2 semanas)**

| Dia | Tarefa | Horas |
|-----|--------|-------|
| 1-3 | Extensão de Navegador | 12h |
| 4-5 | Bot WhatsApp/Telegram | 10h |
| 6-8 | Dashboard Web | 12h |
| 9-10 | API Pública + Docs | 8h |
| 11-14 | Testes, Deploy, Ajustes | 16h |

**Total:** ~58 horas

---

## 🎯 RECOMENDAÇÃO FINAL

### **PARA O TCC (Próximas 2 semanas):**

**IMPLEMENTAR AGORA:**
1. ✅ Sistema de Fila Local (2h) - **CRÍTICO**
2. ✅ Verificação de Imagens (16h) - **DIFERENCIAL TÉCNICO**
3. ✅ Gamificação Básica (6h) - **ENGAJAMENTO**

**IMPLEMENTAR SE DER TEMPO:**
4. ⚠️ Bot WhatsApp (10h) - **IMPACTO SOCIAL**
5. ⚠️ Extensão Browser (12h) - **ALCANCE**

**DEIXAR PARA DEPOIS DO TCC:**
6. 📅 Dashboard Web
7. 📅 API Pública
8. 📅 ML Próprio
9. 📅 Blockchain

---

## 📝 PRÓXIMOS PASSOS

1. **Decidir** quais funcionalidades implementar
2. **Começar** pela Fila Local (resolve problema atual)
3. **Testar** com cenários de uso intenso
4. **Documentar** para o TCC
5. **Apresentar** como diferencial técnico

---

**Questões para decidir:**

❓ Implementar Fila Local agora? (RECOMENDADO: SIM)  
❓ Qual funcionalidade tem maior impacto para o TCC?  
❓ Quanto tempo disponível até entrega do TCC?  
❓ Focar em "quantidade de features" ou "qualidade de 2-3 features"?

**Aguardando suas decisões para começar! 🚀**
