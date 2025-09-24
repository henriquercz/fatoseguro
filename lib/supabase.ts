import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Força o envio de email de confirmação
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  }
});

// Função para verificar configurações de auth
export const checkAuthSettings = async () => {
  try {
    console.log('🔧 Verificando configurações do Supabase Auth...');
    console.log('📍 URL:', supabaseUrl);
    console.log('🔑 Anon Key:', supabaseAnonKey ? 'Configurada' : 'Não configurada');
    
    // Tenta fazer uma operação simples para verificar conectividade
    const { data, error } = await supabase.auth.getSession();
    console.log('🔗 Conectividade:', error ? 'Erro' : 'OK');
    
    return { connected: !error, url: supabaseUrl };
  } catch (error) {
    console.error('❌ Erro ao verificar configurações:', error);
    return { connected: false, error };
  }
};