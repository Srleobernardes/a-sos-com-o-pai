export const CAUSAS_JEJUM = [
  {
    id: 'família',
    titulo: 'Família',
    icone: 'home',
    cor: '#6A1B9A',
    descricao: 'Ore pela restauração, proteção e unidade da sua família.',
  },
  {
    id: 'saúde',
    titulo: 'Saúde e Cura',
    icone: 'medkit',
    cor: '#E65100',
    descricao: 'Ore por cura física, emocional ou espiritual para você ou alguem que ama.',
  },
  {
    id: 'financas',
    titulo: 'Financas e Provisao',
    icone: 'wallet',
    cor: '#1B5E20',
    descricao: 'Ore por provisao divina, sabedoria financeira e quebra de escassez.',
  },
  {
    id: 'proteção',
    titulo: 'Proteção e Livramento',
    icone: 'shield-checkmark',
    cor: '#0D47A1',
    descricao: 'Ore por proteção divina contra perigos visiveis e invisiveis.',
  },
  {
    id: 'direção',
    titulo: 'Direção e Sabedoria',
    icone: 'compass',
    cor: '#00695C',
    descricao: 'Ore por clareza, direção de Deus e sabedoria para tomar decisões.',
  },
  {
    id: 'libertação',
    titulo: 'Libertação e Vitória',
    icone: 'flash',
    cor: '#B71C1C',
    descricao: 'Ore por libertação de vícios, opressão ou batalhas espirituais.',
  },
  {
    id: 'gratidão',
    titulo: 'Gratidão e Adoração',
    icone: 'heart',
    cor: '#AD1457',
    descricao: 'Dedique este jejum simplesmente para agradecer e adorar a Deus.',
  },
  {
    id: 'outro',
    titulo: 'Outra Causa',
    icone: 'create',
    cor: '#455A64',
    descricao: 'Tenha seu proprio propósito pessoal diante de Deus.',
  },
];

export const REFEICOES = [
  {
    id: 'cafe',
    titulo: 'Cafe da Manhã',
    icone: 'sunny',
    horario: '06h - 09h',
    descricao: 'Pule o cafe da manhã e dedique esse tempo em oração',
  },
  {
    id: 'almoco',
    titulo: 'Almoco',
    icone: 'partly-sunny',
    horario: '11h - 14h',
    descricao: 'Pule o almoco e use esse horário para buscar a Deus',
  },
  {
    id: 'jantar',
    titulo: 'Jantar',
    icone: 'moon',
    horario: '18h - 21h',
    descricao: 'Pule o jantar e encerre o dia em oração e consagração',
  },
];

export const ORACOES_POR_REFEICAO = {
  cafe: [
    {
      horario: '06h00',
      periodo: 'Despertar',
      titulo: 'Consagração do Dia',
      referencia: 'Salmo 5:3 e Lamentações 3:22-23',
      texto: 'De manhã, Senhor, ouves a minha voz; de manhã te apresento a minha oração e aguardo com esperança. As misericórdias do Senhor são a causa de não sermos consumidos; porque as suas misericórdias não tem fim. Novas são cada manhã; grande e a Tua fidelidade. Consagro este dia e este jejum a Ti. Em vez de alimento, alimento-me da Tua Palavra. Amém.',
    },
    {
      horario: '08h00',
      periodo: 'Manhã',
      titulo: 'Entrega da Causa',
      referencia: 'Filipenses 4:6-7 e 1 Pedro 5:7',
      texto: 'Não andeis ansiosos por coisa alguma; antes, em tudo, sejam os vossos pedidos conhecidos diante de Deus pela oração e suplica, com acao de graças. E a paz de Deus, que excede todo o entendimento, guardara os vossos corações e as vossas mentes em Cristo Jesus. Lanço sobre Ti, Senhor, toda a minha ansiedade, porque Tu tens cuidado de mim. Entrego-Té a causa deste jejum. Amém.',
    },
    {
      horario: '09h00',
      periodo: 'Meio da Manhã',
      titulo: 'Declaração de Fé',
      referencia: 'Hebreus 11:1,6 e Marcos 11:24',
      texto: 'A fé e a certeza daquilo que esperamos e a prova das coisas que não vemos. Sem fé e impossível agradar a Deus, pois quem dele se aproxima precisa crer que ele existe e que recompensa aqueles que o buscam. Tudo o que pedirdes em oração, crede que já o recebestes, e assim será. Eu creio, Senhor! Declaro pela fé que Tu estás agindo nesta causa. Amém.',
    },
  ],
  almoco: [
    {
      horario: '11h00',
      periodo: 'Antes do Almoco',
      titulo: 'Preparação do Coração',
      referencia: 'Salmo 139:23-24 e Salmo 51:10',
      texto: 'Sonda-me, o Deus, e conhece o meu coração; prova-me e conhece os meus pensamentos. Vê se há em mim algum caminho mau e guia-me pelo caminho eterno. Cria em mim, o Deus, um coração puro e renova dentro de mim um Espírito inabalavel. Neste momento de jejum, preparo meu coração para estar diante de Ti com sinceridade. Amém.',
    },
    {
      horario: '12h00',
      periodo: 'Meio-Dia',
      titulo: 'Clamor pela Causa',
      referencia: 'Jeremias 33:3 e Isaías 65:24',
      texto: 'Clama a mim e eu te responderei e te anunciarei coisas grandes e ocultas, que você não conhece. Antes de clamarem, eu responderei; ainda não estarão falando e eu já terei ouvido. Senhor, nesta hora em que meu corpo sente fome, minha alma se alimenta de Ti. Clamo pela causa que trouxe diante de Ti neste jejum. Tu es fiel e já estás respondendo. Amém.',
    },
    {
      horario: '13h00',
      periodo: 'Depois do Almoco',
      titulo: 'Fortalecimento na Espera',
      referencia: 'Isaías 40:31 e Salmo 27:14',
      texto: 'Mas os que esperam no Senhor renovarão as suas forças, subiram com asas como águias, correrão e não se cansarão, caminharão e não se fatigarão. Espere no Senhor, seja forte, coragem! Espere no Senhor. Mesmo quando meu corpo enfraquece no jejum, meu Espírito se fortalece em Ti. Continuo firme na espera, confiando na Tua resposta. Amém.',
    },
  ],
  jantar: [
    {
      horario: '18h00',
      periodo: 'Início da Noite',
      titulo: 'Oferta da Tarde',
      referencia: 'Salmo 141:2 e Romanos 12:1',
      texto: 'Suba a minha oração perante a Tua face como incenso, e as minhas mãos levantadas sejam como o sacrifício da tarde. Rogo-vos, pelas misericórdias de Deus, que apresenteis os vossos corpos em sacrifício vivo, Santo e agradável a Deus, que e o vosso culto racional. Esta noite, em vez de me alimentar, ofereço este jejum como sacrifício de adoração. Amém.',
    },
    {
      horario: '19h00',
      periodo: 'Noite',
      titulo: 'Intercessão Profunda',
      referencia: 'Mateus 6:6 e Tiago 5:16',
      texto: 'Tu, porém, quando orares, entra no teu aposento e, fechada a porta, ora a teu Pai, que esta em secreto; e teu Pai, que vê em secreto, te recompensara. A oração de um justo e poderosa e eficaz. Neste momento de recolhimento, intercedo pela causa que me trouxe a este jejum. O Senhor conhece cada detalhe. Confio na Tua resposta. Amém.',
    },
    {
      horario: '20h00',
      periodo: 'Encerramento',
      titulo: 'Gratidão e Descanso',
      referencia: 'Salmo 4:8 e Salmo 91:1-2',
      texto: 'Em paz me deito e logo adormeço, pois só tu, Senhor, me fazes viver em segurança. Aquele que habita no abrigo do Altíssimo e descansa a sombra do Todo-Poderoso pode dizer ao Senhor: Tu es o meu refúgio e a minha fortaleza, o meu Deus, em quem confio. Agradeço por este dia de jejum. Entrego-me ao Teu descanso, confiando que Tu ages enquanto durmo. Amém.',
    },
  ],
};
