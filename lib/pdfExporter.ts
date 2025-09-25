import { Share, Alert, Platform } from 'react-native';

interface UserData {
  profile: any;
  verifications: any[];
  consents: any[];
  statistics: any;
}

export const exportUserDataToPDF = async (userData: UserData) => {
  try {
    // Gera o conteúdo em Markdown bem formatado
    const markdownContent = generateMarkdownReport(userData);
    
    // Compartilha o Markdown formatado
    await Share.share({
      message: markdownContent,
      title: 'CheckNow - Relatório de Dados Pessoais (LGPD)',
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    return { success: false, error };
  }
};

const generateMarkdownReport = (userData: UserData): string => {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `# 📱 CheckNow - Relatório de Dados Pessoais

**Conformidade LGPD - Art. 18º, V**  
**Gerado em:** ${currentDate}

---

## 🛡️ Conformidade LGPD

Este relatório foi gerado conforme o **Art. 18º, V da Lei Geral de Proteção de Dados (LGPD)**, garantindo seu direito à portabilidade dos dados.

### 📋 Informações Básicas
- **📧 E-mail:** ${userData.profile?.email || 'N/A'}
- **🆔 ID do Usuário:** ${userData.profile?.id || 'N/A'}
- **📅 Data de Geração:** ${currentDate}

---

## 📊 Informações da Conta

| Campo | Valor |
|-------|-------|
| 📧 **E-mail** | ${userData.profile?.email || 'N/A'} |
| 💎 **Plano** | ${userData.profile?.is_premium ? 'Premium' : 'Gratuito'} |
| 👑 **Administrador** | ${userData.profile?.is_admin ? 'Sim' : 'Não'} |
| 📅 **Conta criada em** | ${userData.profile?.created_at ? new Date(userData.profile.created_at).toLocaleDateString('pt-BR') : 'N/A'} |
| 🔄 **Última atualização** | ${userData.profile?.updated_at ? new Date(userData.profile.updated_at).toLocaleDateString('pt-BR') : 'N/A'} |
| 📈 **Total de verificações** | ${userData.statistics?.total_verifications || 0} |

---

## ✅ Consentimentos LGPD

${userData.consents.length > 0 ? userData.consents.map(consent => `### ${getConsentTitle(consent.purpose)}
- **Status:** ${consent.granted && !consent.revoked_at ? '✅ Ativo' : '❌ Revogado'}
- **Base Legal:** ${getConsentLegalBasis(consent.legal_basis)}
- **Concedido em:** ${new Date(consent.granted_at).toLocaleDateString('pt-BR')}${consent.revoked_at ? `
- **Revogado em:** ${new Date(consent.revoked_at).toLocaleDateString('pt-BR')}` : ''}
- **Versão:** ${consent.version}
`).join('\n') : '📝 Nenhum consentimento registrado.'}

---

## 🔍 Histórico de Verificações

**📈 Total de verificações:** ${userData.statistics?.total_verifications || 0}

${userData.verifications.length > 0 ? userData.verifications.slice(0, 10).map((verification, index) => `### ${index + 1}. ${verification.is_true ? '✅ VERDADEIRA' : '❌ FALSA'}

**📰 Notícia:** ${verification.news.substring(0, 300)}${verification.news.length > 300 ? '...' : ''}

${verification.source ? `**🔗 Fonte:** ${verification.source}
` : ''}**📅 Verificada em:** ${new Date(verification.verified_at).toLocaleDateString('pt-BR')}

**💬 Explicação:** ${verification.explanation.substring(0, 400)}${verification.explanation.length > 400 ? '...' : ''}

---
`).join('') : '📝 Nenhuma verificação encontrada.'}

${userData.verifications.length > 10 ? `> ⚠️ **Nota:** Mostrando apenas as 10 verificações mais recentes de ${userData.verifications.length} total.

` : ''}

---

## 🛡️ Seus Direitos LGPD

Conforme a Lei Geral de Proteção de Dados, você possui os seguintes direitos:

- ✅ **I - Confirmação da existência de tratamento**
- ✅ **II - Acesso aos dados**
- ✅ **III - Correção de dados incompletos, inexatos ou desatualizados**
- ✅ **IV - Anonimização, bloqueio ou eliminação**
- ✅ **V - Portabilidade dos dados** (este relatório)
- ✅ **VI - Eliminação dos dados**
- ✅ **VII - Informação sobre compartilhamento**
- ✅ **VIII - Informação sobre possibilidade de não fornecer consentimento**
- ✅ **IX - Revogação do consentimento**

---

## 📞 Contato e Suporte

### CheckNow - Verificador de Notícias

- **📧 DPO (Encarregado):** henriquechagas06@gmail.com
- **🎓 Projeto TCC:** Etec Taboão da Serra 2025
- **⚖️ Conformidade:** Desenvolvido conforme a LGPD

Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de seus dados, entre em contato conosco através do e-mail acima.

---

## ⚠️ Importante

> **Aviso de Segurança:** Este relatório contém informações pessoais sensíveis. Mantenha-o em local seguro e não compartilhe com terceiros não autorizados.

**Gerado automaticamente pelo sistema CheckNow em ${currentDate}**

---

*Relatório gerado em conformidade com a Lei Geral de Proteção de Dados (LGPD) - Lei nº 13.709/2018*
  `;
};

const getConsentTitle = (purpose: string): string => {
  const titles: Record<string, string> = {
    essential: 'Funcionalidades Essenciais',
    terms_of_service: 'Termos de Uso',
    privacy_policy: 'Política de Privacidade',
    analytics: 'Melhorias e Análises',
    marketing: 'Comunicações e Marketing',
  };
  return titles[purpose] || purpose;
};

const getConsentLegalBasis = (legalBasis: string): string => {
  const bases: Record<string, string> = {
    contract: 'Execução de contrato',
    consent: 'Consentimento do titular',
    legitimate_interest: 'Legítimo interesse',
  };
  return bases[legalBasis] || legalBasis;
};
