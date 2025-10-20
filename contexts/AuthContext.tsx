import React, { createContext, useReducer, ReactNode, useEffect, useRef } from 'react';
import { AuthState, User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, checkAuthSettings } from '@/lib/supabase';


const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
  pendingEmailConfirmation: null,
  showConsentModal: false,
};

type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_REQUEST' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'REGISTER_PENDING_CONFIRMATION'; payload: string }
  | { type: 'SHOW_CONSENT_MODAL' }
  | { type: 'HIDE_CONSENT_MODAL' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'REGISTER_REQUEST':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return { ...state, isLoading: false, user: action.payload, error: null };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'REGISTER_PENDING_CONFIRMATION':
      return { ...state, isLoading: false, pendingEmailConfirmation: action.payload, error: null };
    case 'SHOW_CONSENT_MODAL':
      return { ...state, showConsentModal: true };
    case 'HIDE_CONSENT_MODAL':
      return { ...state, showConsentModal: false };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  pendingEmailConfirmation: string | null;
  showConsentModal: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  upgradeToPremium: () => Promise<void>;
  hideConsentModal: () => void;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  pendingEmailConfirmation: null,
  showConsentModal: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  clearError: () => {},
  upgradeToPremium: async () => {},
  hideConsentModal: () => {},
  deleteAccount: async () => {},
});

// Hook customizado para usar o AuthContext
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const safeDispatch = (action: AuthAction) => {
    if (isMounted.current) {
      dispatch(action);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && isMounted.current) {
          await loadUserProfile(session.user.id);
        } else if (isMounted.current) {
          safeDispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted.current) {
          safeDispatch({ type: 'LOGOUT' });
        }
      }
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user && isMounted.current) {
        await loadUserProfile(session.user.id);
      } else if (isMounted.current) {
        safeDispatch({ type: 'LOGOUT' });
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single() as { data: any, error: any };

      // Se não existe perfil, cria um novo
      if (error && error.code === 'PGRST116') {
        console.log('👤 Perfil não encontrado, criando novo perfil...');
        
        const { data: user } = await supabase.auth.getUser();
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: userId,
            email: user.user?.email || '',
            is_premium: false,
            is_admin: false,
          }] as any)
          .select()
          .single() as { data: any, error: any };

        if (createError) throw createError;
        profile = newProfile;
        console.log('✅ Perfil criado com sucesso!');
      } else if (error) {
        throw error;
      }

      // Validar que profile não é null
      if (!profile) {
        throw new Error('Perfil não encontrado após criação');
      }

      // Verifica se é um novo usuário (sem consentimentos)
      const { data: consents } = await supabase
        .from('consent_records')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      const isNewUser = !consents || consents.length === 0;

      if (isMounted.current) {
        safeDispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            id: profile.id,
            email: profile.email,
            isPremium: profile.is_premium,
            isAdmin: profile.is_admin,
          },
        });

        // Se é um novo usuário, mostra o modal de consentimento
        if (isNewUser) {
          console.log('🆕 Novo usuário detectado - mostrando modal de consentimento');
          safeDispatch({ type: 'SHOW_CONSENT_MODAL' });
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      if (isMounted.current) {
        safeDispatch({ type: 'LOGOUT' });
      }
    }
  };

  const upgradeToPremium = async () => {
    if (!state.user) {
      console.error("Usuário não logado, não é possível fazer upgrade para premium.");
      // Opcionalmente, despachar um erro ou lidar com este caso
      return;
    }
    try {
      // @ts-expect-error Tipos do Supabase precisam ser regenerados
      const { error } = await supabase
        .from('profiles')
        .update({ is_premium: true })
        .eq('id', state.user.id);

      if (error) throw error;

      if (isMounted.current) {
        safeDispatch({
          type: 'UPDATE_USER',
          payload: { isPremium: true },
        });
      }
    } catch (error: any) {
      console.error('Erro ao fazer upgrade para premium:', error);
      // Opcionalmente, despachar um erro para ser mostrado na UI
      // if (isMounted.current) {
      //   safeDispatch({ type: 'PREMIUM_UPGRADE_FAILURE', payload: error.message });
      // }
    }
  };

  const login = async (email: string, password: string) => {
    safeDispatch({ type: 'LOGIN_REQUEST' });
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      if (isMounted.current) {
        safeDispatch({
          type: 'LOGIN_FAILURE',
          payload: error.message || 'Erro ao fazer login',
        });
      }
    }
  };

  const register = async (email: string, password: string) => {
    safeDispatch({ type: 'REGISTER_REQUEST' });
    try {
      console.log('🔐 Iniciando cadastro para:', email);
      
      // Verifica configurações do Supabase
      await checkAuthSettings();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined, // Força o envio de email de confirmação
        }
      });

      console.log('📧 Resposta do Supabase:', { data, error });

      if (error) {
        console.error('❌ Erro no cadastro:', error);
        
        // Tratar erro de email já existente
        if (error.message?.includes('already registered') || 
            error.message?.includes('already been registered') ||
            error.message?.includes('User already registered')) {
          throw new Error('Este email já está cadastrado. Por favor, faça login ou use outro email.');
        }
        
        throw error;
      }

      if (data.user) {
        console.log('👤 Usuário criado:', {
          id: data.user.id,
          email: data.user.email,
          email_confirmed_at: data.user.email_confirmed_at,
          confirmation_sent_at: data.user.confirmation_sent_at
        });

        // Se o usuário não foi confirmado automaticamente, significa que precisa confirmar email
        if (!data.user.email_confirmed_at) {
          console.log('📨 Email de confirmação deve ser enviado');
          if (isMounted.current) {
            safeDispatch({
              type: 'REGISTER_PENDING_CONFIRMATION',
              payload: email,
            });
          }
        } else {
          console.log('✅ Usuário confirmado automaticamente');
          // Usuário criado e confirmado automaticamente - mostrar ConsentModal
          if (isMounted.current) {
            safeDispatch({ type: 'SHOW_CONSENT_MODAL' });
          }
        }
      } else {
        console.warn('⚠️ Nenhum usuário retornado do Supabase');
      }
    } catch (error: any) {
      if (isMounted.current) {
        safeDispatch({
          type: 'REGISTER_FAILURE',
          payload: error.message || 'Erro ao criar conta',
        });
      }
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error && isMounted.current) {
      safeDispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = () => {
    if (isMounted.current) {
      safeDispatch({ type: 'CLEAR_ERROR' });
    }
  };

  const hideConsentModal = () => {
    if (isMounted.current) {
      safeDispatch({ type: 'HIDE_CONSENT_MODAL' });
    }
  };

  const deleteAccount = async () => {
    if (!state.user) throw new Error('Usuário não autenticado');

    try {
      console.log('🗑️ Iniciando exclusão da conta...');
      
      // Chama a função do banco que deleta tudo
      const { error: deleteError } = await supabase.rpc('delete_user_account');

      if (deleteError) {
        console.error('Erro na função de exclusão:', deleteError);
        
        // Fallback: tentar deletar manualmente
        console.log('Tentando exclusão manual...');
        
        const { error: verificationsError } = await supabase
          .from('verifications')
          .delete()
          .eq('user_id', state.user.id);

        const { error: consentsError } = await supabase
          .from('consent_records')
          .delete()
          .eq('user_id', state.user.id);

        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', state.user.id);

        if (profileError) {
          console.error('Erro ao deletar perfil:', profileError);
          throw profileError;
        }
      }

      // Fazer logout
      await supabase.auth.signOut();
      
      if (isMounted.current) {
        safeDispatch({ type: 'LOGOUT' });
      }

      console.log('✅ Conta excluída com sucesso');
    } catch (error: any) {
      console.error('❌ Erro ao excluir conta:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.isLoading,
        error: state.error,
        pendingEmailConfirmation: state.pendingEmailConfirmation,
        showConsentModal: state.showConsentModal,
        login,
        register,
        logout,
        clearError,
        upgradeToPremium,
        hideConsentModal,
        deleteAccount,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };