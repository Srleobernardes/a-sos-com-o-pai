export const CONEXOES = [
  {
    dia: 1,
    titulo: '1 minuto com Deus',
    corpo: [
      'Pare por um momento. Respire fundo. Feche seus olhos.',
      'Sinta a presença de Deus ao seu redor. Ele está aqui, agora, com você.',
      'Diga em voz alta ou em seu coração:',
    ],
    frase: '"Pai, eu estou aqui. Obrigado por mais um dia. Obrigado pelo Teu amor. Guia meus passos hoje. Em nome de Jesus, amém."',
  },
  {
    dia: 2,
    titulo: 'Gratidão que abre portas',
    corpo: [
      'Antes de começar o seu dia, pense em três coisas pelas quais você é grato.',
      'A gratidão não é apenas um sentimento — é uma postura espiritual que abre o coração para receber mais de Deus.',
      'Agradeça agora, com sinceridade:',
    ],
    frase: '"Pai, obrigado pela minha vida, pela Tua fidelidade e pela Tua presença. Que eu nunca perca o dom de enxergar o que tenho. Amém."',
  },
  {
    dia: 3,
    titulo: 'Silêncio sagrado',
    corpo: [
      'O mundo faz muito barulho. As notificações não param, as cobranças não param, os pensamentos não param.',
      'Deus sussurra. E para ouvi-Lo, precisamos aprender a silenciar.',
      'Fique em silêncio por um momento. Respire. Deixe Ele falar ao seu coração:',
    ],
    frase: '"Senhor, aquieto minha alma diante de Ti. Não tenho pressa. Fala ao meu coração — estou te ouvindo. Amém."',
  },
  {
    dia: 4,
    titulo: 'Você não está sozinho',
    corpo: [
      'Às vezes a vida pesa. Às vezes o cansaço é grande e a solidão aperta o peito.',
      'Mas saiba: Deus está com você agora. Ele vê cada lágrima, conhece cada dor, e nunca te abandona.',
      'Receba o abraço do Pai hoje:',
    ],
    frase: '"Pai, obrigado por estar comigo. Mesmo quando não Te sinto, sei que Tu estás aqui. Enche meu coração com Tua presença. Amém."',
  },
  {
    dia: 5,
    titulo: 'Entregue o dia a Ele',
    corpo: [
      'Antes de entrar na correria do dia, faça uma pausa intencional.',
      'Entregue a Deus cada compromisso, cada desafio, cada conversa que você vai ter hoje.',
      'Deixe que Ele seja o Senhor do seu dia:',
    ],
    frase: '"Senhor, este dia é Teu. Minhas reuniões, minhas decisões, meus relacionamentos — entrego tudo a Ti. Usa-me hoje para a Tua glória. Amém."',
  },
  {
    dia: 6,
    titulo: 'A voz do Pai',
    corpo: [
      'Deus quer falar com você. Não por trovões ou visões extraordinárias — mas por Sua Palavra, pelo Espírito Santo, pela paz no coração.',
      'Você tem ouvidado a voz d\'Ele? Neste momento, abra o coração e deixe-O falar:',
    ],
    frase: '"Pai, quero ouvir a Tua voz. Afia meus ouvidos espirituais. Que eu reconheça quando és Tu que fala e tenha coragem de obedecer. Amém."',
  },
  {
    dia: 7,
    titulo: 'Força renovada',
    corpo: [
      'Talvez você esteja cansado. Cansaço físico, emocional, espiritual. A vida cobra um preço alto.',
      'Mas há uma fonte de força que nunca se esgota. Deus renova as forças de quem espera n\'Ele.',
      'Receba essa renovação agora:',
    ],
    frase: '"Senhor, estou cansado. Mas confio que Tu renova as minhas forças. Enche-me do Teu Espírito e me dá fôlego para seguir. Em nome de Jesus, amém."',
  },
  {
    dia: 8,
    titulo: 'Perdão que liberta',
    corpo: [
      'Carregar mágoa é como beber veneno esperando que o outro sofra. O perdão não é pela outra pessoa — é por você.',
      'Deus nos perdoou tudo. Ele nos pede que passemos esse perdão adiante.',
      'Se há alguém que você precisa perdoar, diga a Deus agora:',
    ],
    frase: '"Pai, escolho perdoar. Não porque é fácil, mas porque Tu me perdoaste primeiro. Libera meu coração de toda mágoa e amargura. Em nome de Jesus, amém."',
  },
  {
    dia: 9,
    titulo: 'Confiança inabalável',
    corpo: [
      'A vida raramente segue o roteiro que planejamos. Planos mudam, sonhos são adiados, o inesperado acontece.',
      'Mas Deus nunca é pego de surpresa. Ele estava lá antes do problema e já preparou a solução.',
      'Renove sua confiança n\'Ele hoje:',
    ],
    frase: '"Senhor, confio em Ti. Mesmo sem entender tudo, sei que Tu és bom e que Teus planos são perfeitos. Descanso em Tuas mãos. Amém."',
  },
  {
    dia: 10,
    titulo: 'Amor em ação',
    corpo: [
      'O maior mandamento é amar — a Deus e ao próximo. Mas o amor verdadeiro vai além das palavras, ele se mostra em ações.',
      'Quem você pode abençoar hoje? Uma mensagem, uma ajuda, um sorriso sincero pode mudar o dia de alguém.',
      'Peça a Deus que use você como instrumento do Seu amor:',
    ],
    frase: '"Pai, que eu seja Tuas mãos e Teu coração hoje. Mostra-me quem precisa de amor e me dá coragem para agir. Em nome de Jesus, amém."',
  },
];

export function getConexaoDoDia() {
  const hoje = new Date();
  const diaDoAno = Math.floor(
    (hoje - new Date(hoje.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  const index = diaDoAno % CONEXOES.length;
  return CONEXOES[index];
}
