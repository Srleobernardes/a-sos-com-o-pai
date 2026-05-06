export const PLANOS = [
  {
    id: 'mensal',
    nome: 'Mensal',
    subtitulo: 'Comece sua jornada',
    precoOriginal: 'R$ 197/mês',
    preco: 'R$ 67,90',
    periodo: '/mês',
    destaque: false,
    tag: null,
    economia: null,
    // Substituir pela URL real do checkout da Hubla
    checkoutUrl: 'https://payfast.greenn.com.br/9x5yedt/offer/P1P5Ua?ch_id=137178',
    features: [
      'Oração diária guiada',
      'Versículo do dia',
      'Devocional diário',
      'Oração de Emergência',
      'Jejum tradicional para iniciantes',
      '10 orações em áudio + 10 em vídeo',
      'Calendário devocional semanal',
    ],
    acessos: [
      'versiculo',
      'devocional',
      'oracaoGuiada',
      'oracaoEmergencia',
      'jejumNormal',
      'oracoes',
      'calendarioSemanal',
    ],
  },
  {
    id: 'semestral',
    nome: 'Semestral',
    subtitulo: 'Vá além do básico',
    precoOriginal: 'R$ 697',
    preco: '6x R$ 59,90',
    periodo: ' · 6 meses',
    destaque: false,
    tag: null,
    economia: null,
    // Substituir pela URL real do checkout da Hubla
    checkoutUrl: 'https://payfast.greenn.com.br/h928ytk/offer/H2YIwR?ch_id=137178',
    features: [
      'Tudo do plano Mensal',
      'Oração Guiada e de Glorificação',
      'Calendário mensal e anual',
      '30 orações em áudio + 60 em vídeo',
      '4 Jejuns Bíblicos (formato livre)',
      'Devocionais inspiradores',
      'Medalhas e conquistas',
    ],
    acessos: [
      'versiculo',
      'devocional',
      'oracaoGuiada',
      'oracaoEmergencia',
      'jejumNormal',
      'oracoes',
      'calendarioSemanal',
      'oracaoGlorificacao',
      'calendario',
      'jejumBiblico',
      'medalhas',
    ],
  },
  {
    id: 'anual',
    nome: 'Anual',
    subtitulo: 'A jornada completa',
    precoOriginal: 'R$ 997',
    preco: '12x R$ 39,90',
    periodo: '/ano',
    destaque: true,
    tag: 'MAIS POPULAR',
    economia: 'economize R$ 336',
    // Substituir pela URL real do checkout da Hubla
    checkoutUrl: 'https://payfast.greenn.com.br/sxkhrp3/offer/njKhBD?ch_id=137178',
    features: [
      'Tudo do plano Semestral',
      'Jejuns Intencionais Guiados',
      '4 intenções: Financeiro, Proteção, Cura e Família',
      '3 níveis: 12, 24 ou 36 horas',
      'Aulas em áudio e vídeo durante o jejum',
      'Ebook exclusivo por intenção',
      'Comunidade exclusiva de oração',
      'Notificação diária com versículo',
      'Guia espiritual completo',
    ],
    acessos: [
      'versiculo',
      'devocional',
      'oracaoGuiada',
      'oracaoEmergencia',
      'jejumNormal',
      'oracoes',
      'calendarioSemanal',
      'oracaoGlorificacao',
      'calendario',
      'jejumBiblico',
      'medalhas',
      'jejumIntencional',
      'comunidade',
      'guia',
    ],
  },
];

export function temAcesso(plano, recurso) {
  const planoData = PLANOS.find((p) => p.id === plano);
  if (!planoData) return false;
  return planoData.acessos.includes(recurso);
}

export function getPlanoPorId(id) {
  return PLANOS.find((p) => p.id === id) || null;
}
