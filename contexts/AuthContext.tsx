import React, { createContext, useReducer, ReactNode, useEffect, useRef } from 'react';
import { AuthState, User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';


const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
  pendingEmailConfirmation: null,
};

type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_REQUEST' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'REGISTER_PENDING_CONFIRMATION'; payload: string }
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
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  upgradeToPremium: () => Promise<void>; // Adicionado para upgrade de usuário
};

const AuthContext = createContext<AuthContextType>({
  // Mantive AuthContext com 'const' para que useAuth possa ser definido abaixo antes da exportação do Provider
  // Se AuthContext fosse exportado diretamente aqui, useAuth teria que ser definido em outro lugar ou AuthProvider teria que importar useContext diretamente.
  // Esta abordagem mantém useAuth junto com a definição do contexto.
  user: null,
  loading: false,
  error: null,
  pendingEmailConfirmation: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  clearError: () => {},
  upgradeToPremium: async () => {}, // Adicionado para upgrade de usuário
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
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Se o usuário não foi confirmado automaticamente, significa que precisa confirmar email
      if (data.user && !data.user.email_confirmed_at) {
        if (isMounted.current) {
          safeDispatch({
            type: 'REGISTER_PENDING_CONFIRMATION',
            payload: email,
          });
        }
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

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.isLoading,
        error: state.error,
        pendingEmailConfirmation: state.pendingEmailConfirmation,
        login,
        register,
        logout,
        clearError,
        upgradeToPremium, // Adicionado para upgrade de usuário
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };