
---

# ANÁLISE DOS CONCEITOS-CHAVE

(PREPARANDO A POLÍTICA DE SEGURANÇA)

## 1. Segurança da Informação (SI)

**Objetivo:** Proteger informações contra ameaças (acesso não autorizado, modificação, destruição)

**Tríade CIA:**

* **Confidencialidade:** Acesso apenas para autorizados
* **Integridade:** Dados precisos e completos
* **Disponibilidade:** Acesso quando necessário

Evolução constante para ambientes híbridos e multinuvem

## 2. LGPD na Prática

**Caso Real MegaShop:** Multa por não oferecer controles de privacidade (exclusão, consentimento)

**Direitos dos Titulares:** Consentimento, exclusão, retificação, transparência

**Visão Ética:**

*"Dados são o novo petróleo" - precisam de "refino ético"*

## 3. UML para SI/LGPD

* `<<include>>`: Comportamento obrigatório (exemplo: login sempre verifica autenticação)
* `<<extend>>`: Comportamento opcional (exemplo: login pode ter 2FA)

Diagrama = Compromisso Ético: Mostrar fluxos de consentimento, segurança e direitos

## 4. Implementação Técnica

**Casos de Uso Essenciais:**

* SI: Criptografia, logs, varredura de vulnerabilidades
* LGPD: Consentimento, exclusão, relatórios de tratamento

**Ferramentas:** Amazon Inspector (varreduras), EventBridge (agendamento)

## Princípio Central (IMPORTANTE)

*"Codar é fácil, o desafio é construir sistemas éticos, seguros e alinhados com LGPD desde a base."* — Dan Gussoni

Os documentos reforçam que diagramas UML bem feitos são a materialização visual das políticas de segurança e privacidade.

---

# ROTEIRO: ADAPTAÇÃO DA POLÍTICA DE SEGURANÇA PARA LGPD

## 1. INTRODUÇÃO - Contextualizar com LGPD

O que incluir:

* "Esta política incorpora os princípios da Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018)"
* "Nosso sistema [Nome do Sistema] foi modelado para garantir conformidade desde a concepção"

**Exemplo prático:**

*"O sistema Lavi (localizador de lavanderias) implementa controles técnicos e organizacionais alinhados à tríade CIA (Confidencialidade, Integridade, Disponibilidade) e aos direitos dos titulares estabelecidos na LGPD."*

---

## 2. OBJETIVO - Explicitar a Proteção de Dados Pessoais

O que incluir:

* "Garantir o tratamento ético de dados pessoais, conforme Artigo 6º da LGPD"
* "Implementar privacy by design nos casos de uso do sistema"

**Vincular com casos de uso:**

*"O objetivo é materializar funcionalidades como [Solicitar Consentimento], [Excluir Conta] e [Criptografar Dados] presentes em nosso diagrama de casos de uso."*

---

## 3. CLASSIFICAÇÃO “TRIPLA” DA INFORMAÇÃO - Especificar Dados Pessoais

A tabela abaixo deve ser interpretada da seguinte forma:

**Colunas:** Nível | Tipo de Dado | Exemplos | Casos de Uso Relacionados

**Descrição:** Essa tabela classifica tipos de informações segundo níveis de acesso e contexto LGPD.

| Nível       | Tipo de Dado        | Exemplos                 | Casos de Uso Relacionados   |
| ------------ | ------------------- | ------------------------ | --------------------------- |
| Público     | Dados não-pessoais | Endereço lavanderia     | Visualizar no mapa          |
| Confidencial | Dados pessoais      | Nome, e-mail, tel        | Criptografar Dados Pessoais |
| Restrito     | Dados sensíveis    | Avaliações, histórico | Gerenciar Consentimento     |

---

## NÍVEL PÚBLICO

**O que são:** Informações não-pessoais de domínio público

**Exemplos:** Endereço comercial, horário de funcionamento, preços dos serviços

**Riscos se vazados:** Impacto comercial mínimo

**Proteção no sistema:**

* Acesso livre sem autenticação
* Caso de uso: Visualizar Lavanderias no Mapa

*"Como a localização de uma lavanderia no Lavi - qualquer usuário pode ver sem restrições."*

## NÍVEL CONFIDENCIAL - Dados Pessoais

**O que são:** Informações básicas de identificação do titular

**Exemplos:** Nome completo, e-mail, telefone, endereço residencial

**Riscos se vazados:** Exposição de identidade, spam, phishing, fraudes

**Proteção no sistema:**

* Criptografia em repouso e trânsito
* Acesso baseado em necessidade
* Caso de uso: Criptografar Dados Pessoais

*"Como os dados de cadastro do cliente - necessários para o serviço, mas protegidos."*

## NÍVEL RESTRITO - Dados Sensíveis

**O que são:** Informações que revelam aspectos íntimos da personalidade

**Exemplos:** Avaliações, histórico de pedidos, preferências pessoais

**Riscos se vazados:** Discriminação, manipulação, constrangimento público

**Proteção no sistema:**

* Consentimento explícito obrigatório
* Anonimização quando possível
* Acesso extremamente limitado
* Caso de uso: Gerenciar Consentimento

*"Como o histórico alimentar no Nutri.IA - revela hábitos pessoais que exigem proteção máxima."*

---

## DIFERENÇA PRÁTICA

Tabela descrita: Três colunas representando Público, Confidencial, Restrito

| Público                | Confidencial       | Restrito                       |
| ----------------------- | ------------------ | ------------------------------ |
| O que a empresa oferece | Quem você é      | O que você faz/pensa          |
| Acesso livre            | Acesso autenticado | Consentimento explícito       |
| Sem proteção especial | Criptografia       | Anonimização + consentimento |
| Visualizar no Mapa      | Criptografar Dados | Gerenciar Consentimento        |

---

## 4. CONTROLE DE ACESSO - Vincular aos Casos de Uso

Exemplo de adaptação:

* "O acesso segue o princípio do menor privilégio, implementado no caso de uso [Gerenciar Controle de Acessos]"
* "Autenticação de dois fatores disponível como extensão opcional ([<`<extend>`>]) no login"

---

## 5. SEÇÃO ESPECÍFICA LGPD - Direitos dos Titulares

Adicionar novo capítulo:

## 5.1. Direitos dos Titulares de Dados

Conforme Artigo 18 da LGPD, nossos usuários podem:

* Acessar seus dados ([Consultar Dados Pessoais])
* Corrigir informações ([Retificar Dados])
* Revogar consentimento ([Gerenciar Preferências])
* Excluir conta e dados ([Excluir Conta])

## 5.2. Bases Legais do Tratamento

* Consentimento: Obtido via [Solicitar Consentimento] no primeiro acesso
* Legítimo interesse: Para [Registrar Logs] de segurança

---

## 6. SEGURANÇA TÉCNICA - LGPD Artigo 46

Vincular às medidas técnicas:

* "Criptografia de dados implementada em [Criptografar Dados Pessoais]"
* "Varreduras regulares via [Executar Varredura de Vulnerabilidades]"
* "Logs de auditoria em [Registrar Log de Atividades]"

---

## 7. TREINAMENTO - Incluir Conscientização LGPD

Adaptar o item 9:

* "Treinamentos incluem princípios LGPD e casos de uso de privacidade do sistema"
* "Funcionários aprendem a operar [Atender Solicitação de Titular] corretamente"

---

## 8. MODELO DE COMUNICAÇÃO AO USUÁRIO

Adicionar como anexo ou seção:

> "Prezado usuário, seus dados são nosso novo petróleo e merecem refino ético. Nosso sistema [Nome] implementa [Número] casos de uso específicos para proteger suas informações, incluindo [listar 2-3 principais]. Consulte nosso diagrama completo em [link]."

---

# CHECKLIST

* Introdução menciona LGPD e casos de uso do sistema
* Objetivo cita privacy by design e artigos específicos
* Tabela de classificação inclui dados pessoais
* Controles de acesso vinculados a casos de uso UML
* Seção específica sobre direitos do titular (Artigo 18)
* Medidas técnicas referenciam Artigo 46 da LGPD
* Treinamento inclui conscientização sobre privacidade
* Linguagem acessível que transmite confiança

---

## DICA FINAL

*"Transformem o documento técnico em uma declaração de valores - mostrem que proteção de dados não é só compliance*, mas sim um diferencial competitivo no mercado!"*

*Compliance é o conjunto de ações e procedimentos que uma organização implementa para cumprir leis, regulamentos, normas e políticas aplicáveis ao seu negócio.

Em outras palavras, é estar em conformidade com as regras, sejam elas legais, setoriais ou internas, para evitar riscos, multas e danos à reputação.

No contexto de LGPD e Segurança da Informação, compliance significa agir de acordo com a lei, garantindo que o tratamento de dados e as práticas de segurança estejam alinhados com o que a legislação exige.

---

## ANALOGIA DO PETRÓLEO

Tabela conceitual, sem colunas fixas, sugestão de formato explicativo:

* **Público:** Poço de petróleo visível a todos
* **Confidencial:** Petróleo bruto extraído (precisa de refinaria)
* **Restrito:** Gera derivados (gasolina premium) exigem processamento extra

---

Caro aluno, resumidamente, o sucesso do seu trabalho depende de entender que a classificação tripla é essencial para a conformidade com a LGPD! Garanta que irá finalizar o TCC de forma impactante, para que seu trabalho seja lembrado pela preocupação com os detalhes e pelo compromisso com a proteção de dados.

Que esta jornada não seja apenas sobre cumprir requisitos acadêmicos na minha disciplina, mas sobre construir um legado de ética digital!

*"Dados são o novo petróleo, e vocês estão refinando com responsabilidade!"*

---

# Atividade Prática: Da UML à Política de Segurança Conforme LGPD

**Agora é o momento de transformar sua modelagem UML em um documento real de Política de Segurança.**

Como fazer:

Adapte conforme o diagrama de casos de uso que você criou para seu sistema (Segurança da Informação - Diagrama de Caso de Uso UML).

O objetivo é demonstrar como cada elemento da UML se materializa em diretrizes práticas alinhadas à LGPD.

**Cronograma:**

* 01/10: Entrega do esboço (estrutura básica do documento)
* 08/10: Documento completo com mapeamento LGPD x UML + ajustes finais
* 17/10: Apresentação final do trabalho

**Minhas Dicas (O que venho insistindo durante as aulas):**

Cada caso de uso do seu diagrama (como "Criptografar Dados", "Gerenciar Consentimento") deve encontrar eco direto nas seções da política, lembrando de relacionar as leis vigentes. Mostre essa conexão de forma clara!

Esta é sua oportunidade de provar que entendeu a importância de integrar técnica e conformidade desde a concepção do sistema.

**Orientação da Coordenadora Nathane:**

Acrescentar ao trabalho a elaboração da Política de Privacidade e Termos de Uso que seus softwares deverão conter, incluindo os mecanismos de consentimento dos usuários e a utilização de cookies.

(Lembram daquela caixinha "concordo" que sempre comento em aula? Pois bem, ela será materializada agora!)

Isso significa que vocês deverão:

* Criar seções específicas sobre consentimento explícito
* Incluir modelos de termo de aceitação
* Explicar a utilização de cookies no sistema
* Demonstrar como os casos de uso "Solicitar Consentimento" e "Gerenciar Preferências" se traduzem na prática

Esses elementos serão a materialização jurídica do seu diagrama UML!
