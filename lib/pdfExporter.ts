import { Share, Alert, Platform } from 'react-native';

interface UserData {
  profile: any;
  verifications: any[];
  consents: any[];
  statistics: any;
}

export const exportUserDataToPDF = async (userData: UserData) => {
  try {
    // Gera o conteúdo HTML profissional
    const htmlContent = generateHTMLReport(userData);
    
    // Compartilha o HTML formatado
    await Share.share({
      message: htmlContent,
      title: 'CheckNow - Relatório de Dados Pessoais (LGPD)',
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
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CheckNow - Relatório de Dados Pessoais (LGPD)</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f8f9fa;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
        }
        .section {
            background: white;
            padding: 25px;
            margin-bottom: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .section-title {
            color: #667eea;
            font-size: 1.4em;
            font-weight: bold;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #667eea;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .info-item {
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .info-label {
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }
        .consent-item {
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }
        .consent-active {
            background: #d4edda;
            border-color: #28a745;
        }
        .consent-revoked {
            background: #f8d7da;
            border-color: #dc3545;
        }
        .verification-item {
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            background: #f8f9fa;
        }
        .verification-true {
            border-left-color: #28a745;
        }
        .verification-false {
            border-left-color: #dc3545;
        }
        .footer {
            background: #343a40;
            color: white;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            margin-top: 30px;
        }
        .rights-list {
            list-style: none;
            padding: 0;
        }
        .rights-list li {
            padding: 10px;
            margin-bottom: 8px;
            background: #e3f2fd;
            border-radius: 5px;
            border-left: 4px solid #2196f3;
        }
        @media print {
            body { background: white; }
            .section { box-shadow: none; border: 1px solid #ddd; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">📱 CheckNow</div>
        <div class="subtitle">Relatório de Dados Pessoais - LGPD</div>
        <p>Gerado em ${currentDate}</p>
    </div>

    <div class="section">
        <div class="section-title">🛡️ Conformidade LGPD</div>
        <p>Este relatório foi gerado conforme o <strong>Art. 18º, V da Lei Geral de Proteção de Dados (LGPD)</strong>, garantindo seu direito à portabilidade dos dados.</p>
        
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">📧 E-mail</div>
                <div>${userData.profile?.email || 'N/A'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">🆔 ID do Usuário</div>
                <div>${userData.profile?.id || 'N/A'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">📅 Data de Geração</div>
                <div>${currentDate}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">📊 Informações da Conta</div>
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">📧 E-mail</div>
                <div>${userData.profile?.email || 'N/A'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">💎 Plano</div>
                <div>${userData.profile?.is_premium ? 'Premium' : 'Gratuito'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">👑 Administrador</div>
                <div>${userData.profile?.is_admin ? 'Sim' : 'Não'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">📅 Conta criada em</div>
                <div>${userData.profile?.created_at ? new Date(userData.profile.created_at).toLocaleDateString('pt-BR') : 'N/A'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">🔄 Última atualização</div>
                <div>${userData.profile?.updated_at ? new Date(userData.profile.updated_at).toLocaleDateString('pt-BR') : 'N/A'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">📈 Total de verificações</div>
                <div>${userData.statistics?.total_verifications || 0}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">✅ Consentimentos LGPD</div>
        ${userData.consents.length > 0 ? userData.consents.map(consent => `
            <div class="consent-item ${consent.granted && !consent.revoked_at ? 'consent-active' : 'consent-revoked'}">
                <h4>${getConsentTitle(consent.purpose)}</h4>
                <p><strong>Status:</strong> ${consent.granted && !consent.revoked_at ? '✅ Ativo' : '❌ Revogado'}</p>
                <p><strong>Base Legal:</strong> ${getConsentLegalBasis(consent.legal_basis)}</p>
                <p><strong>Concedido em:</strong> ${new Date(consent.granted_at).toLocaleDateString('pt-BR')}</p>
                ${consent.revoked_at ? `<p><strong>Revogado em:</strong> ${new Date(consent.revoked_at).toLocaleDateString('pt-BR')}</p>` : ''}
                <p><strong>Versão:</strong> ${consent.version}</p>
            </div>
        `).join('') : '<p>📝 Nenhum consentimento registrado.</p>'}
    </div>

    <div class="section">
        <div class="section-title">🔍 Histórico de Verificações</div>
        <p><strong>📈 Total de verificações:</strong> ${userData.statistics?.total_verifications || 0}</p>
        
        ${userData.verifications.length > 0 ? userData.verifications.slice(0, 10).map((verification, index) => `
            <div class="verification-item ${verification.is_true ? 'verification-true' : 'verification-false'}">
                <h4>${index + 1}. ${verification.is_true ? '✅ VERDADEIRA' : '❌ FALSA'}</h4>
                <p><strong>📰 Notícia:</strong> ${verification.news.substring(0, 200)}${verification.news.length > 200 ? '...' : ''}</p>
                ${verification.source ? `<p><strong>🔗 Fonte:</strong> ${verification.source}</p>` : ''}
                <p><strong>📅 Verificada em:</strong> ${new Date(verification.verified_at).toLocaleDateString('pt-BR')}</p>
                <p><strong>💬 Explicação:</strong> ${verification.explanation.substring(0, 300)}${verification.explanation.length > 300 ? '...' : ''}</p>
            </div>
        `).join('') : '<p>📝 Nenhuma verificação encontrada.</p>'}
        
        ${userData.verifications.length > 10 ? `<p><em>⚠️ Mostrando apenas as 10 verificações mais recentes de ${userData.verifications.length} total.</em></p>` : ''}
    </div>

    <div class="section">
        <div class="section-title">🛡️ Seus Direitos LGPD</div>
        <p>Conforme a Lei Geral de Proteção de Dados, você possui os seguintes direitos:</p>
        <ul class="rights-list">
            <li><strong>I - Confirmação da existência de tratamento</strong> ✅</li>
            <li><strong>II - Acesso aos dados</strong> ✅</li>
            <li><strong>III - Correção de dados incompletos, inexatos ou desatualizados</strong> ✅</li>
            <li><strong>IV - Anonimização, bloqueio ou eliminação</strong> ✅</li>
            <li><strong>V - Portabilidade dos dados</strong> ✅ (este relatório)</li>
            <li><strong>VI - Eliminação dos dados</strong> ✅</li>
            <li><strong>VII - Informação sobre compartilhamento</strong> ✅</li>
            <li><strong>VIII - Informação sobre possibilidade de não fornecer consentimento</strong> ✅</li>
            <li><strong>IX - Revogação do consentimento</strong> ✅</li>
        </ul>
    </div>

    <div class="footer">
        <h3>📞 CheckNow - Verificador de Notícias</h3>
        <p><strong>📧 DPO (Encarregado):</strong> henriquechagas06@gmail.com</p>
        <p><strong>🎓 Projeto TCC</strong> - Etec Taboão da Serra 2025</p>
        <p><strong>⚖️ Desenvolvido em conformidade com a LGPD</strong></p>
        <br>
        <p><em>⚠️ Este relatório contém informações pessoais sensíveis. Mantenha-o em local seguro.</em></p>
        <p>Gerado automaticamente pelo sistema CheckNow em ${currentDate}</p>
    </div>

</body>
</html>
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
