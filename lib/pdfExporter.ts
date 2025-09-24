import { Share } from 'react-native';

interface UserData {
  profile: any;
  verifications: any[];
  consents: any[];
  statistics: any;
}

export const exportUserDataToPDF = async (userData: UserData) => {
  try {
    // Gera o conteúdo HTML para o PDF
    const htmlContent = generateHTMLReport(userData);
    
    // Por enquanto, compartilha como texto formatado
    // Em produção, seria ideal usar uma biblioteca como react-native-html-to-pdf
    await Share.share({
      message: htmlContent,
      title: 'CheckNow - Exportação de Dados Pessoais (LGPD)',
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    return { success: false, error };
  }
};

const generateHTMLReport = (userData: UserData): string => {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
📱 CHECKNOW - RELATÓRIO DE DADOS PESSOAIS
═══════════════════════════════════════════

🛡️ CONFORMIDADE LGPD
Este relatório foi gerado conforme o Art. 18º, V da Lei Geral de Proteção de Dados (LGPD).

📅 Data de Geração: ${currentDate}
👤 Usuário: ${userData.profile?.email || 'N/A'}
🆔 ID do Usuário: ${userData.profile?.id || 'N/A'}

═══════════════════════════════════════════
📊 INFORMAÇÕES DA CONTA
═══════════════════════════════════════════

📧 E-mail: ${userData.profile?.email || 'N/A'}
💎 Plano: ${userData.profile?.is_premium ? 'Premium' : 'Gratuito'}
👑 Admin: ${userData.profile?.is_admin ? 'Sim' : 'Não'}
📅 Conta criada em: ${userData.profile?.created_at ? new Date(userData.profile.created_at).toLocaleDateString('pt-BR') : 'N/A'}
🔄 Última atualização: ${userData.profile?.updated_at ? new Date(userData.profile.updated_at).toLocaleDateString('pt-BR') : 'N/A'}

═══════════════════════════════════════════
✅ CONSENTIMENTOS LGPD
═══════════════════════════════════════════

${userData.consents.length > 0 ? userData.consents.map(consent => `
🔹 ${getConsentTitle(consent.purpose)}
   └ Status: ${consent.granted && !consent.revoked_at ? '✅ Ativo' : '❌ Revogado'}
   └ Base Legal: ${getConsentLegalBasis(consent.legal_basis)}
   └ Concedido em: ${new Date(consent.granted_at).toLocaleDateString('pt-BR')}
   ${consent.revoked_at ? `└ Revogado em: ${new Date(consent.revoked_at).toLocaleDateString('pt-BR')}` : ''}
   └ Versão: ${consent.version}
`).join('') : '📝 Nenhum consentimento registrado.'}

═══════════════════════════════════════════
🔍 HISTÓRICO DE VERIFICAÇÕES
═══════════════════════════════════════════

📈 Total de verificações: ${userData.statistics?.total_verifications || 0}

${userData.verifications.length > 0 ? userData.verifications.slice(0, 10).map((verification, index) => `
${index + 1}. ${verification.is_true ? '✅ VERDADEIRA' : '❌ FALSA'}
   📰 Notícia: ${verification.news.substring(0, 100)}${verification.news.length > 100 ? '...' : ''}
   ${verification.source ? `🔗 Fonte: ${verification.source}` : ''}
   📅 Verificada em: ${new Date(verification.verified_at).toLocaleDateString('pt-BR')}
   💬 Explicação: ${verification.explanation.substring(0, 150)}${verification.explanation.length > 150 ? '...' : ''}
`).join('') : '📝 Nenhuma verificação encontrada.'}

${userData.verifications.length > 10 ? `\n⚠️ Mostrando apenas as 10 verificações mais recentes de ${userData.verifications.length} total.` : ''}

═══════════════════════════════════════════
📊 ESTATÍSTICAS DE USO
═══════════════════════════════════════════

📈 Total de verificações: ${userData.statistics?.total_verifications || 0}
📅 Idade da conta: ${userData.statistics?.account_age_days || 0} dias
💎 Plano atual: ${userData.profile?.is_premium ? 'Premium (Verificações ilimitadas)' : 'Gratuito (3 verificações/dia)'}

═══════════════════════════════════════════
🛡️ SEUS DIREITOS LGPD
═══════════════════════════════════════════

Conforme a Lei Geral de Proteção de Dados, você possui os seguintes direitos:

📋 Art. 18º - Direitos do titular:
I - Confirmação da existência de tratamento ✅
II - Acesso aos dados ✅
III - Correção de dados incompletos, inexatos ou desatualizados ✅
IV - Anonimização, bloqueio ou eliminação ✅
V - Portabilidade dos dados ✅ (este relatório)
VI - Eliminação dos dados ✅
VII - Informação sobre compartilhamento ✅
VIII - Informação sobre possibilidade de não fornecer consentimento ✅
IX - Revogação do consentimento ✅

═══════════════════════════════════════════
📞 CONTATO E SUPORTE
═══════════════════════════════════════════

🏢 CheckNow - Verificador de Notícias
📧 DPO (Encarregado): henriquechagas06@gmail.com
🎓 Projeto TCC - Etec Taboão da Serra 2025
⚖️ Desenvolvido em conformidade com a LGPD

Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de seus dados, entre em contato conosco através do e-mail acima.

═══════════════════════════════════════════
⚠️ IMPORTANTE
═══════════════════════════════════════════

Este relatório contém informações pessoais sensíveis. Mantenha-o em local seguro e não compartilhe com terceiros não autorizados.

Gerado automaticamente pelo sistema CheckNow em ${currentDate}.

═══════════════════════════════════════════
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
