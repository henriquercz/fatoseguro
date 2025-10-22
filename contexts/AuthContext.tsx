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
  showOnboarding: false,
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
  | { type: 'SHOW_ONBOARDING' }
  | { type: 'HIDE_ONBOARDING' }
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
      return { 
        ...state, 
        isLoading: false, 
        user: action.payload, 
        error: null,
        pendingEmailConfirmation: null  // ✅ Limpa para permitir login automático
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'REGISTER_PENDING_CONFIRMATION':
      return { ...state, isLoading: false, pendingEmailConfirmation: action.payload, error: null };
    case 'SHOW_CONSENT_MODAL':
      return { ...state, showConsentModal: true };
    case 'HIDE_CONSENT_MODAL':
      return { ...state, showConsentModal: false };
    case 'SHOW_ONBOARDING':
      return { ...state, showOnboarding: true };
    case 'HIDE_ONBOARDING':
      return { ...state, showOnboarding: false };
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
  showOnboarding: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  upgradeToPremium: () => Promise<void>;
  hideConsentModal: () => void;
  completeOnboarding: () => Promise<void>;
  skipOnboarding: () => Promise<void>;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  pendingEmailConfirmation: null,
  showConsentModal: false,
  showOnboarding: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  clearError: () => {},
  upgradeToPremium: async () => {},
  hideConsentModal: () => {},
  completeOnboarding: async () => {},
  skipOnboarding: async () => {},
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
      console.log('🔄 Iniciando autenticação...');
      
      // Timeout de segurança: força logout após 30 segundos se travar (aumentado para Expo Go)
      const timeoutId = setTimeout(() => {
        console.warn('⚠️ TIMEOUT: Autenticação travada, forçando logout...');
        if (isMounted.current) {
          safeDispatch({ type: 'LOGOUT' });
        }
      }, 30000);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('📝 Sessão obtida:', session ? 'Existe' : 'Não existe');
        
        if (session?.user && isMounted.current) {
          console.log('👤 Carregando perfil do usuário:', session.user.id);
          await loadUserProfile(session.user.id);
        } else if (isMounted.current) {
          console.log('🚪 Nenhuma sessão encontrada, fazendo logout');
          safeDispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        if (isMounted.current) {
          safeDispatch({ type: 'LOGOUT' });
        }
      } finally {
        // Limpa o timeout se completar antes
        clearTimeout(timeoutId);
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
    console.log('🔍 Iniciando loadUserProfile para userId:', userId);
    try {
      let profile;

      // Buscar perfil do usuário com timeout
      console.log('📊 Buscando perfil no banco...');
      
      // Timeout de 15 segundos na query (aumentado para Expo Go)
      const queryPromise = (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 15000)
      );
      
      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as { data: any, error: any };
      
      console.log('📊 Resultado da busca:', { 
        hasData: !!data, 
        errorCode: error?.code,
        errorMessage: error?.message 
      });

      // Se não existe perfil, cria um novo
      if (error && error.code === 'PGRST116') {
        console.log('🆕 Perfil não encontrado, criando novo perfil...');
        
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

        if (createError) {
          console.error('❌ Erro ao criar perfil:', createError);
          throw createError;
        }
        
        profile = newProfile;
        console.log('✅ Perfil criado com sucesso!');
      } else if (error) {
        // Silenciar warning de timeout se o login funcionou
        if (error.message === 'Query timeout') {
          console.log('⏱️ Query demorou mas continuando...');
          // Tenta novamente sem timeout
          const { data: retryData, error: retryError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
          
          if (retryError) {
            console.error('❌ Erro ao buscar perfil após retry:', retryError);
            throw retryError;
          }
          profile = retryData;
          console.log('✅ Perfil carregado com sucesso após retry!');
        } else {
          console.error('❌ Erro ao buscar perfil:', error);
          throw error;
        }
      } else {
        // Sucesso - perfil encontrado
        profile = data;
        console.log('✅ Perfil carregado com sucesso!');
      }

      // Validar que profile existe
      if (!profile) {
        console.error('❌ Profile é null após busca/criação');
        throw new Error('Perfil não encontrado');
      }

      // Verifica se é um novo usuário (sem consentimentos)
      const { data: consents } = await supabase
        .from('consent_records')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      const isNewUser = !consents || consents.length === 0;
      
      // Verifica onboarding de forma segura (campo pode não existir até executar SQL)
      // Se profile.onboarding_completed não existir, será undefined
      // Só mostra onboarding se for explicitamente false
      const shouldShowOnboarding = profile.onboarding_completed === false;
      
      console.log('📊 Status do usuário:', {
        isNewUser,
        hasOnboardingField: 'onboarding_completed' in profile,
        onboardingCompleted: profile.onboarding_completed,
        shouldShowOnboarding
      });

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

        // Se não completou onboarding, mostra onboarding (tem prioridade)
        if (shouldShowOnboarding) {
          console.log('🎨 Usuário precisa ver onboarding');
          safeDispatch({ type: 'SHOW_ONBOARDING' });
        }
        // Senão, se é um novo usuário, mostra o modal de consentimento
        else if (isNewUser) {
          console.log('🆕 Novo usuário detectado - mostrando modal de consentimento');
          safeDispatch({ type: 'SHOW_CONSENT_MODAL' });
        }
      }
    } catch (error: any) {
      console.error('❌ Error loading user profile:', error);
      console.error('Detalhes do erro:', error.message);
      if (isMounted.current) {
        // Garante que loading seja desligado mesmo com erro
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
      const { error } = await (supabase as any)
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
        
          // Salva senha temporariamente para verificação automática
          await AsyncStorage.setItem('@temp_password', password);
        
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

  const completeOnboarding = async () => {
    if (!state.user) return;

    try {
      console.log('✅ Completando onboarding...');

      // Atualiza no banco de dados
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq('id', state.user.id);

      if (error) {
        console.error('Erro ao completar onboarding:', error);
        throw error;
      }

      // Esconde o onboarding
      if (isMounted.current) {
        safeDispatch({ type: 'HIDE_ONBOARDING' });
        
        // Verifica se precisa mostrar consent modal (usuário novo)
        const { data: consents } = await supabase
          .from('consent_records')
          .select('id')
          .eq('user_id', state.user.id)
          .limit(1);

        const isNewUser = !consents || consents.length === 0;
        
        if (isNewUser) {
          console.log('🔐 Mostrando consent modal após onboarding');
          // Pequeno delay para transição suave
          setTimeout(() => {
            if (isMounted.current) {
              safeDispatch({ type: 'SHOW_CONSENT_MODAL' });
            }
          }, 500);
        }
      }

      console.log('✅ Onboarding completado com sucesso!');
    } catch (error) {
      console.error('Erro ao completar onboarding:', error);
    }
  };

  const skipOnboarding = async () => {
    if (!state.user) return;

    try {
      console.log('⏭️ Pulando onboarding...');

      // Atualiza no banco de dados
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_skipped: true,
          onboarding_completed: true, // Marca como completo para não mostrar novamente
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq('id', state.user.id);

      if (error) {
        console.error('Erro ao pular onboarding:', error);
        throw error;
      }

      // Esconde o onboarding
      if (isMounted.current) {
        safeDispatch({ type: 'HIDE_ONBOARDING' });
        
        // Verifica se precisa mostrar consent modal (usuário novo)
        const { data: consents } = await supabase
          .from('consent_records')
          .select('id')
          .eq('user_id', state.user.id)
          .limit(1);

        const isNewUser = !consents || consents.length === 0;
        
        if (isNewUser) {
          console.log('🔐 Mostrando consent modal após pular onboarding');
          // Pequeno delay para transição suave
          setTimeout(() => {
            if (isMounted.current) {
              safeDispatch({ type: 'SHOW_CONSENT_MODAL' });
            }
          }, 500);
        }
      }

      console.log('✅ Onboarding pulado!');
    } catch (error) {
      console.error('Erro ao pular onboarding:', error);
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
        showOnboarding: state.showOnboarding,
        login,
        register,
        logout,
        clearError,
        upgradeToPremium,
        hideConsentModal,
        completeOnboarding,
        skipOnboarding,
        deleteAccount,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };