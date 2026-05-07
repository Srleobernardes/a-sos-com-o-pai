import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wvyptqmrufxxdlooqity.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_KfqAucp_6Cmq0g_qd8lArQ_Act-6e93';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

// Busca o registro do assinante pelo email
// Lança erros distintos para cada situação
export async function buscarAssinante(email) {
  let data, error;

  try {
    ({ data, error } = await supabase
      .from('assinantes')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single());
  } catch {
    const err = new Error('Sem conexão com a internet. Verifique sua rede e tente novamente.');
    err.code = 'SEM_CONEXAO';
    throw err;
  }

  // PGRST116 = nenhuma linha encontrada (email não cadastrado)
  if (error?.code === 'PGRST116') return null;

  if (error) {
    const err = new Error('Nossos servidores estão temporariamente indisponíveis. Tente novamente em instantes.');
    err.code = 'SERVIDOR_INDISPONIVEL';
    throw err;
  }

  return data;
}

// Salva o código de indicação do usuário (apenas se ainda não tiver um)
export async function salvarCodigoIndicacao(email, codigo) {
  try {
    await supabase
      .from('assinantes')
      .update({ codigo_indicacao: codigo })
      .eq('email', email.toLowerCase().trim())
      .is('codigo_indicacao', null);
  } catch {
    // Falha silenciosa — não impede o login
  }
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
