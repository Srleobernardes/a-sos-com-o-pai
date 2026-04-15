export const DEVOCIONAIS = [
  {
    dia: 1,
    titulo: 'O Inicio da Jornada',
    versiculo: 'Jeremias 29:11',
    textoVersiculo: 'Porque eu sei os planos que tenho para voces, diz o Senhor, planos de prosperidade e nao de calamidade, para dar-lhes um futuro e uma esperanca.',
    reflexao: `Hoje voce comeca uma nova jornada espiritual. Deus tem planos incriveis para sua vida, muito maiores do que voce pode imaginar.

Muitas vezes, nos sentimos perdidos, sem direcao, sem proposito. Mas Deus ja escreveu cada capitulo da sua historia antes mesmo de voce nascer.

Hoje, escolha confiar. Escolha crer que o melhor esta por vir. Entregue seus medos, suas duvidas e suas insegurancas nas maos dAquele que nunca falha.

Sua jornada espiritual comeca agora. Um passo de cada vez, um dia de cada vez, na presenca do Pai.`,
    oracao: 'Senhor, hoje eu comeco essa jornada. Guia meus passos, abre meus olhos espirituais e transforma meu coracao. Em nome de Jesus, amem.',
  },
  {
    dia: 2,
    titulo: 'A Forca da Oracao',
    versiculo: 'Filipenses 4:6-7',
    textoVersiculo: 'Nao andeis ansiosos de coisa alguma; em tudo, porem, sejam conhecidas, diante de Deus, as vossas peticoes, pela oracao e pela suplica, com acoes de gracas.',
    reflexao: `A oracao e a arma mais poderosa que um cristao possui. Atraves dela, nos conectamos diretamente com o Criador do universo.

Nao importa o tamanho do seu problema - Deus e maior. Nao importa a profundidade da sua dor - o amor de Deus e mais profundo.

Quando voce ora, coisas acontecem no mundo espiritual. Portas se abrem, cadeias se quebram, milagres acontecem.

Faca da oracao o seu habito diario. Converse com Deus como conversa com seu melhor amigo - porque e exatamente isso que Ele e.`,
    oracao: 'Pai, ensina-me a orar. Que a oracao seja meu primeiro recurso, nao o ultimo. Fortalece minha vida de oracao. Em nome de Jesus, amem.',
  },
  {
    dia: 3,
    titulo: 'Fe que Move Montanhas',
    versiculo: 'Hebreus 11:1',
    textoVersiculo: 'Ora, a fe e a certeza daquilo que esperamos e a prova das coisas que nao vemos.',
    reflexao: `Fe nao e ausencia de duvida - e a decisao de confiar mesmo quando nao entendemos.

Abraao saiu de sua terra sem saber para onde ia. Moises enfrentou o mar sem saber como atravessar. Davi enfrentou um gigante com uma pedra.

Todos tinham algo em comum: fe inabalavel no Deus que os chamou.

Hoje, Deus esta te chamando para confiar. Talvez voce esteja diante de um mar, um gigante, ou um deserto. Mas o mesmo Deus que foi fiel com eles sera fiel com voce.

De o proximo passo pela fe. Deus fara o resto.`,
    oracao: 'Senhor, aumenta minha fe. Ajuda-me a confiar em Ti mesmo quando nao vejo o caminho. Eu creio, Senhor, ajuda a minha incredulidade. Em nome de Jesus, amem.',
  },
];

export function getDevocionalDoDia() {
  const hoje = new Date();
  const diaDoAno = Math.floor(
    (hoje - new Date(hoje.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  const index = diaDoAno % DEVOCIONAIS.length;
  return DEVOCIONAIS[index];
}
