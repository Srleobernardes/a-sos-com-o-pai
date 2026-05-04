import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://wvyptqmrufxxdlooqity.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_KfqAucp_6Cmq0g_qd8lArQ_Act-6e93';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Busca o registro do assinante pelo email
export async function buscarAssinante(email) {
  const { data, error } = await supabase
    .from('assinantes')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .single();

  if (error) return null;
  return data;
}

// Verifica se a assinatura está ativa (trial ou ativo, e dentro do prazo)
export function assinaturaAtiva(assinante) {
  if (!assinante) return false;

  const agora = new Date();

  if (assinante.status === 'trial') {
    return new Date(assinante.trial_fim) > agora;
  }

  if (assinante.status === 'ativo') {
    if (!assinante.assinatura_fim) return true;
    return new Date(assinante.assinatura_fim) > agora;
  }

  return false;
}
