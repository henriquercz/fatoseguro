import React, { createContext, useReducer, ReactNode, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// Tipos para consentimento
export interface ConsentRecord {
  id: string;
  user_id: string;
  purpose: string;
  legal_basis: string;
  granted: boolean;
  granted_at: string;
  revoked_at?: string;
  expires_at?: string;
  version: string;
  created_at: string;
  updated_at: string;
}

export interface ConsentState {
  consents: ConsentRecord[];
  isLoading: boolean;
  error: string | null;
  hasRequiredConsents: boolean;
}

const initialState: ConsentState = {
  consents: [],
  isLoading: false,
  error: null,
  hasRequiredConsents: false,
};

type ConsentAction =
  | { type: 'LOAD_CONSENTS_REQUEST' }
  | { type: 'LOAD_CONSENTS_SUCCESS'; payload: ConsentRecord[] }
  | { type: 'LOAD_CONSENTS_FAILURE'; payload: string }
  | { type: 'GRANT_CONSENT_SUCCESS'; payload: ConsentRecord }
  | { type: 'REVOKE_CONSENT_SUCCESS'; payload: string }
  | { type: 'CLEAR_ERROR' };

const consentReducer = (state: ConsentState, action: ConsentAction): ConsentState => {
  switch (action.type) {
    case 'LOAD_CONSENTS_REQUEST':
      return { ...state, isLoading: true, error: null };
    case 'LOAD_CONSENTS_SUCCESS':
      const hasRequired = action.payload.some(
        consent => consent.purpose === 'essential' && consent.granted && !consent.revoked_at
      );
      return {
        ...state,
        isLoading: false,
        consents: action.payload,
        hasRequiredConsents: hasRequired,
        error: null,
      };
    case 'LOAD_CONSENTS_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'GRANT_CONSENT_SUCCESS':
      const updatedConsents = [...state.consents, action.payload];
      const hasRequiredAfterGrant = updatedConsents.some(
        consent => consent.purpose === 'essential' && consent.granted && !consent.revoked_at
      );
      return {
        ...state,
        consents: updatedConsents,
        hasRequiredConsents: hasRequiredAfterGrant,
      };
    case 'REVOKE_CONSENT_SUCCESS':
      const revokedConsents = state.consents.map(consent =>
        consent.id === action.payload
          ? { ...consent, granted: false, revoked_at: new Date().toISOString() }
          : consent
      );
      const hasRequiredAfterRevoke = revokedConsents.some(
        consent => consent.purpose === 'essential' && consent.granted && !consent.revoked_at
      );
      return {
        ...state,
        consents: revokedConsents,
        hasRequiredConsents: hasRequiredAfterRevoke,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

type ConsentContextType = {
  consents: ConsentRecord[];
  isLoading: boolean;
  error: string | null;
  hasRequiredConsents: boolean;
  loadConsents: () => Promise<void>;
  grantConsent: (purpose: string, legalBasis?: string) => Promise<void>;
  revokeConsent: (consentId: string) => Promise<void>;
  checkConsentStatus: (purpose: string) => boolean;
  clearError: () => void;
};

const ConsentContext = createContext<ConsentContextType>({
  consents: [],
  isLoading: false,
  error: null,
  hasRequiredConsents: false,
  loadConsents: async () => {},
  grantConsent: async () => {},
  revokeConsent: async () => {},
  checkConsentStatus: () => false,
  clearError: () => {},
});

export const useConsent = () => {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent deve ser usado dentro de um ConsentProvider');
  }
  return context;
};

export const ConsentProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(consentReducer, initialState);

  // Carrega consentimentos quando usuário faz login
  useEffect(() => {
    if (user) {
      loadConsents();
    }
  }, [user]);

  const loadConsents = async () => {
    if (!user) return;

    dispatch({ type: 'LOAD_CONSENTS_REQUEST' });
    try {
      const { data, error } = await supabase
        .from('consent_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      dispatch({ type: 'LOAD_CONSENTS_SUCCESS', payload: data || [] });
    } catch (error: any) {
      console.error('Erro ao carregar consentimentos:', error);
      dispatch({ type: 'LOAD_CONSENTS_FAILURE', payload: error.message });
    }
  };

  const grantConsent = async (purpose: string, legalBasis: string = 'consent') => {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      // Verifica se já existe consentimento ativo para este propósito
      const existingConsent = state.consents.find(
        consent => consent.purpose === purpose && consent.granted && !consent.revoked_at
      );

      if (existingConsent) {
        console.log(`Consentimento para ${purpose} já existe`);
        return;
      }

      const newConsent = {
        user_id: user.id,
        purpose,
        legal_basis: legalBasis,
        granted: true,
        version: '1.0',
        ip_address: null, // Em produção, capturar IP real
        user_agent: navigator.userAgent || null,
      };

      const { data, error } = await supabase
        .from('consent_records')
        .insert(newConsent)
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: 'GRANT_CONSENT_SUCCESS', payload: data });
      console.log(`Consentimento concedido para: ${purpose}`);
    } catch (error: any) {
      console.error('Erro ao conceder consentimento:', error);
      dispatch({ type: 'LOAD_CONSENTS_FAILURE', payload: error.message });
    }
  };

  const revokeConsent = async (consentId: string) => {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      const { error } = await supabase
        .from('consent_records')
        .update({
          granted: false,
          revoked_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', consentId)
        .eq('user_id', user.id);

      if (error) throw error;

      dispatch({ type: 'REVOKE_CONSENT_SUCCESS', payload: consentId });
      console.log(`Consentimento revogado: ${consentId}`);
    } catch (error: any) {
      console.error('Erro ao revogar consentimento:', error);
      dispatch({ type: 'LOAD_CONSENTS_FAILURE', payload: error.message });
    }
  };

  const checkConsentStatus = (purpose: string): boolean => {
    return state.consents.some(
      consent => consent.purpose === purpose && consent.granted && !consent.revoked_at
    );
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <ConsentContext.Provider
      value={{
        consents: state.consents,
        isLoading: state.isLoading,
        error: state.error,
        hasRequiredConsents: state.hasRequiredConsents,
        loadConsents,
        grantConsent,
        revokeConsent,
        checkConsentStatus,
        clearError,
      }}>
      {children}
    </ConsentContext.Provider>
  );
};
