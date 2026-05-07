import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const GREENN_TOKEN = Deno.env.get('GREENN_WEBHOOK_TOKEN') ?? '';

function validarToken(req: Request, body: any): boolean {
  const authHeader = req.headers.get('Authorization') ?? '';
  const tokenHeader = req.headers.get('X-Greenn-Token') ?? '';
  const tokenBody = String(body?.token ?? '');
  const recebido = authHeader.replace('Bearer ', '') || tokenHeader || tokenBody;
  return recebido === GREENN_TOKEN;
}

function getPlanoPorProduto(_produtoId: string, produtoNome: string): string {
  const nome = produtoNome.toLowerCase();
  if (nome.includes('anual')) return 'anual';
  if (nome.includes('semestral')) return 'semestral';
  return 'mensal';
}

function calcularFimAssinatura(plano: string): string {
  const agora = new Date();
  if (plano === 'anual') agora.setFullYear(agora.getFullYear() + 1);
  else if (plano === 'semestral') agora.setMonth(agora.getMonth() + 6);
  else agora.setMonth(agora.getMonth() + 1);
  return agora.toISOString();
}

// Mesma lógica do app para gerar código de indicação
function gerarCodigoRef(email: string): string {
  const base = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6) || 'AMIGO';
  const hash = [...email].reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
  return `${base}${(hash % 9000) + 1000}`;
}

// Extrai o código de referral do payload (Greenn pode enviá-lo em campos diferentes)
function extrairCodigoRef(payload: any): string {
  return (
    payload.utm_content ||
    payload.tracking?.utm_content ||
    payload.metadata?.utm_content ||
    payload.custom_data?.utm_content ||
    payload.extra?.utm_content ||
    payload.source?.utm_content ||
    ''
  ).toString().trim();
}

const INDICACOES_PARA_RECOMPENSA = 3;

async function processarIndicacao(emailIndicado: string, codigoRef: string, plano: string) {
  if (!codigoRef) return;

  const { data: indicador } = await supabase
    .from('assinantes')
    .select('email, trial_fim')
    .eq('codigo_indicacao', codigoRef)
    .maybeSingle();

  if (!indicador) {
    console.log(`Código de indicação não encontrado: ${codigoRef}`);
    return;
  }

  // Registra a indicação (sem recompensa ainda)
  await supabase.from('indicacoes').insert({
    indicador_email:     indicador.email,
    indicado_email:      emailIndicado,
    codigo_ref:          codigoRef,
    plano_indicado:      plano,
    recompensa_aplicada: false,
  });

  // Conta o total de indicações deste indicador
  const { count } = await supabase
    .from('indicacoes')
    .select('*', { count: 'exact', head: true })
    .eq('indicador_email', indicador.email);

  const total = count ?? 0;

  // Recompensa apenas a cada múltiplo de 3 indicações
  if (total % INDICACOES_PARA_RECOMPENSA === 0) {
    const base = indicador.trial_fim ? new Date(indicador.trial_fim) : new Date();
    if (base < new Date()) base.setTime(new Date().getTime());
    base.setDate(base.getDate() + 30);

    await supabase
      .from('assinantes')
      .update({ trial_fim: base.toISOString() })
      .eq('email', indicador.email);

    // Marca as indicações pendentes deste ciclo como recompensadas
    await supabase
      .from('indicacoes')
      .update({ recompensa_aplicada: true })
      .eq('indicador_email', indicador.email)
      .eq('recompensa_aplicada', false);

    console.log(`Recompensa aplicada: ${indicador.email} atingiu ${total} indicações → +30 dias`);
  } else {
    console.log(`Indicação registrada: ${indicador.email} → ${emailIndicado} (${total}/${INDICACOES_PARA_RECOMPENSA} para recompensa)`);
  }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  console.log('Greenn webhook recebido:', JSON.stringify(payload));

  if (GREENN_TOKEN && !validarToken(req, payload)) {
    console.warn('Token inválido rejeitado');
    return new Response('Unauthorized', { status: 401 });
  }

  const evento    = payload.event || payload.type || payload.status || '';
  const cliente   = payload.customer || payload.buyer || payload.client || {};
  const produto   = payload.product || payload.plan || payload.offer || {};
  const codigoRef = extrairCodigoRef(payload);

  const email = (
    cliente.email || payload.email || payload.customer_email || ''
  ).toLowerCase().trim();

  if (!email) {
    console.warn('Email não encontrado no payload:', JSON.stringify(payload));
    return new Response('Email não encontrado', { status: 422 });
  }

  const produtoId   = String(produto.id   || payload.product_id   || '');
  const produtoNome = String(produto.name || produto.title || payload.product_name || '');
  const plano       = getPlanoPorProduto(produtoId, produtoNome);

  const eventosAprovacao = [
    'purchase_approved', 'approved', 'subscription_activated',
    'order_paid', 'checkout_completed', 'paid', 'sale_approved',
  ];

  const eventosCancelamento = [
    'subscription_cancelled', 'cancelled', 'subscription_expired',
    'charge_failed', 'refund_approved', 'refunded', 'chargeback',
  ];

  if (eventosAprovacao.includes(evento)) {
    const trialFim = new Date();
    trialFim.setDate(trialFim.getDate() + 7);

    const { error } = await supabase
      .from('assinantes')
      .upsert(
        {
          email,
          plano,
          status: 'trial',
          trial_fim: trialFim.toISOString(),
          assinatura_fim: calcularFimAssinatura(plano),
          criado_em: new Date().toISOString(),
        },
        { onConflict: 'email' }
      );

    if (error) {
      console.error('Erro ao inserir assinante:', error);
      return new Response('Erro interno', { status: 500 });
    }

    // Salva código de indicação do novo assinante (se ainda não tiver)
    await supabase
      .from('assinantes')
      .update({ codigo_indicacao: gerarCodigoRef(email) })
      .eq('email', email)
      .is('codigo_indicacao', null);

    // Processa indicação se veio por referral
    await processarIndicacao(email, codigoRef, plano);

    console.log(`Assinante criado/atualizado: ${email} → plano ${plano}${codigoRef ? ` (ref: ${codigoRef})` : ''}`);
    return new Response(JSON.stringify({ ok: true, email, plano }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (eventosCancelamento.includes(evento)) {
    const { error } = await supabase
      .from('assinantes')
      .update({ status: 'cancelado' })
      .eq('email', email);

    if (error) {
      console.error('Erro ao cancelar assinante:', error);
      return new Response('Erro interno', { status: 500 });
    }

    console.log(`Assinante cancelado: ${email}`);
    return new Response(JSON.stringify({ ok: true, cancelado: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  console.log(`Evento ignorado: ${evento}`);
  return new Response(JSON.stringify({ ok: true, ignorado: true, evento }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
