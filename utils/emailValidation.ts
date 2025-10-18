/**
 * Validação robusta de emails
 * Previne uso de emails temporários e inválidos
 * 
 * @author CheckNow Team
 * @version 1.0.0
 */

// Lista de domínios de email temporário conhecidos
const TEMP_EMAIL_DOMAINS = [
  'guerrillamail.com',
  'guerrillamail.info',
  'guerrillamail.biz',
  'guerrillamail.de',
  'guerrillamail.net',
  'guerrillamail.org',
  'grr.la',
  'sharklasers.com',
  'tempmail.com',
  'temp-mail.org',
  'temp-mail.io',
  '10minutemail.com',
  '10minutemail.net',
  'throwaway.email',
  'mailinator.com',
  'trashmail.com',
  'trashmail.net',
  'yopmail.com',
  'yopmail.net',
  'fakeinbox.com',
  'maildrop.cc',
  'getnada.com',
  'mohmal.com',
  'spam4.me',
  'getairmail.com',
  'dispostable.com',
  'emailondeck.com',
  'mintemail.com',
  'mytemp.email',
  'tempail.com',
  'tempr.email',
  'throwawaymail.com',
  'mailnesia.com',
  'mailcatch.com',
  'mailsac.com',
  'guerrillamailblock.com',
  'pokemail.net',
  'spamgourmet.com',
  'incognitomail.org',
  'anonymbox.com',
  'mailforspam.com',
  'spambox.us',
  'spamfree24.org',
  'tempemail.net',
  'tempinbox.com',
  'jetable.org',
  'wegwerfmail.de',
  'trashmail.de',
  'emailtemporanea.com',
  'correotemporal.org',
];

// Regex robusto para validação de email (RFC 5322 simplificado)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
  isTemporary?: boolean;
  suggestion?: string;
}

/**
 * Valida um endereço de email
 * @param email - Email a ser validado
 * @returns Resultado da validação com detalhes
 */
export const validateEmail = (email: string): EmailValidationResult => {
  // 1. Verificar se o email não está vazio
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      error: 'Email é obrigatório',
    };
  }

  const trimmedEmail = email.trim().toLowerCase();

  // 2. Verificar formato básico
  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return {
      isValid: false,
      error: 'Formato de email inválido',
      suggestion: 'Use o formato: exemplo@dominio.com',
    };
  }

  // 3. Verificar se tem @ e domínio
  const parts = trimmedEmail.split('@');
  if (parts.length !== 2) {
    return {
      isValid: false,
      error: 'Email deve conter apenas um @',
    };
  }

  const [localPart, domain] = parts;

  // 4. Verificar parte local (antes do @)
  if (localPart.length === 0) {
    return {
      isValid: false,
      error: 'Email inválido: parte antes do @ está vazia',
    };
  }

  if (localPart.length > 64) {
    return {
      isValid: false,
      error: 'Email muito longo (máximo 64 caracteres antes do @)',
    };
  }

  // 5. Verificar domínio
  if (!domain || domain.length < 4) {
    return {
      isValid: false,
      error: 'Domínio de email inválido',
      suggestion: 'Use um domínio válido como gmail.com, outlook.com, etc.',
    };
  }

  if (!domain.includes('.')) {
    return {
      isValid: false,
      error: 'Domínio deve conter pelo menos um ponto (.)',
    };
  }

  // 6. Verificar se é domínio temporário
  if (TEMP_EMAIL_DOMAINS.includes(domain)) {
    return {
      isValid: false,
      error: 'Emails temporários não são permitidos',
      isTemporary: true,
      suggestion: 'Use um email permanente como Gmail, Outlook, etc.',
    };
  }

  // 7. Verificar TLD (Top Level Domain)
  const tld = domain.split('.').pop();
  if (!tld || tld.length < 2) {
    return {
      isValid: false,
      error: 'Extensão de domínio inválida',
      suggestion: 'Use extensões válidas como .com, .br, .org, etc.',
    };
  }

  // 8. Verificar caracteres consecutivos suspeitos
  if (localPart.includes('..') || domain.includes('..')) {
    return {
      isValid: false,
      error: 'Email contém pontos consecutivos inválidos',
    };
  }

  // 9. Verificar se começa ou termina com ponto
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return {
      isValid: false,
      error: 'Email não pode começar ou terminar com ponto',
    };
  }

  // ✅ Email válido
  return {
    isValid: true,
  };
};

/**
 * Verifica se um domínio é temporário
 * @param email - Email a ser verificado
 * @returns true se for domínio temporário
 */
export const isTemporaryEmail = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  return TEMP_EMAIL_DOMAINS.includes(domain);
};

/**
 * Obtém sugestões de domínios populares
 * @returns Lista de domínios recomendados
 */
export const getPopularDomains = (): string[] => {
  return [
    'gmail.com',
    'outlook.com',
    'hotmail.com',
    'yahoo.com',
    'icloud.com',
    'protonmail.com',
    'live.com',
    'msn.com',
  ];
};
