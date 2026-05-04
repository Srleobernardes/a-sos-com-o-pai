export const VERSICULOS = [
  {
    texto: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
    referencia: 'João 3:16',
  },
  {
    texto: 'O Senhor é o meu pastor; nada me faltará.',
    referencia: 'Salmo 23:1',
  },
  {
    texto: 'Tudo posso naquele que me fortalece.',
    referencia: 'Filipenses 4:13',
  },
  {
    texto: 'Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.',
    referencia: 'Provérbios 3:5',
  },
  {
    texto: 'Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.',
    referencia: 'Jeremias 29:11',
  },
  {
    texto: 'Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.',
    referencia: 'Isaías 41:10',
  },
  {
    texto: 'Mas os que esperam no Senhor renovarão as suas forças; subirão com asas como águias; correrão e não se cansarão; caminharão e não se fatigarão.',
    referencia: 'Isaías 40:31',
  },
  {
    texto: 'Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.',
    referencia: 'Salmo 37:5',
  },
  {
    texto: 'Sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus.',
    referencia: 'Romanos 8:28',
  },
  {
    texto: 'O Senhor é a minha luz e a minha salvação; a quem temerei? O Senhor é a força da minha vida; de quem me recearei?',
    referencia: 'Salmo 27:1',
  },
  {
    texto: 'Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.',
    referencia: '1 Pedro 5:7',
  },
  {
    texto: 'Jesus disse: Eu sou o caminho, a verdade e a vida. Ninguém vem ao Pai senão por mim.',
    referencia: 'João 14:6',
  },
  {
    texto: 'Buscai primeiro o Reino de Deus e a sua justiça, e todas estas coisas vos serão acrescentadas.',
    referencia: 'Mateus 6:33',
  },
  {
    texto: 'Deem graças ao Senhor, pois ele é bom; o seu amor dura para sempre.',
    referencia: 'Salmo 136:1',
  },
  {
    texto: 'Alegrem-se sempre no Senhor. Novamente direi: alegrem-se!',
    referencia: 'Filipenses 4:4',
  },
  {
    texto: 'Pois onde estiverem dois ou três reunidos em meu nome, ali eu estou no meio deles.',
    referencia: 'Mateus 18:20',
  },
  {
    texto: 'Sede fortes e corajosos. Não temam nem fiquem apavorados, pois o Senhor, o seu Deus, vai com vocês; nunca os deixará, nunca os abandonará.',
    referencia: 'Deuteronômio 31:6',
  },
  {
    texto: 'A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza.',
    referencia: '2 Coríntios 12:9',
  },
  {
    texto: 'Clamei ao Senhor na minha angústia, e ele me respondeu.',
    referencia: 'Salmo 120:1',
  },
  {
    texto: 'Deleita-te também no Senhor, e ele te concederá os desejos do teu coração.',
    referencia: 'Salmo 37:4',
  },
  {
    texto: 'Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar e nos purificar de toda injustiça.',
    referencia: '1 João 1:9',
  },
  {
    texto: 'Eis que estou à porta e bato. Se alguém ouvir a minha voz e abrir a porta, entrarei e cearei com ele, e ele comigo.',
    referencia: 'Apocalipse 3:20',
  },
  {
    texto: 'Porque o Senhor dá a sabedoria; da sua boca vem o conhecimento e o entendimento.',
    referencia: 'Provérbios 2:6',
  },
  {
    texto: 'Portanto, se alguém está em Cristo, é nova criação. As coisas antigas já passaram; eis que surgiram coisas novas!',
    referencia: '2 Coríntios 5:17',
  },
  {
    texto: 'Pois Deus não nos deu o espírito de covardia, mas de poder, de amor e de equilíbrio.',
    referencia: '2 Timóteo 1:7',
  },
  {
    texto: 'O Senhor é bom, uma fortaleza no dia da angústia; e conhece os que nele confiam.',
    referencia: 'Naum 1:7',
  },
  {
    texto: 'Clama a mim e te responderei; anunciar-te-ei coisas grandes e firmes que não sabes.',
    referencia: 'Jeremias 33:3',
  },
  {
    texto: 'A fé é a certeza daquilo que esperamos e a prova das coisas que não vemos.',
    referencia: 'Hebreus 11:1',
  },
  {
    texto: 'Ensina-me, Senhor, o teu caminho, e guia-me pela vereda direita.',
    referencia: 'Salmo 27:11',
  },
  {
    texto: 'Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.',
    referencia: 'Mateus 11:28',
  },
];

export function getVersiculoDoDia() {
  const hoje = new Date();
  const diaDoAno = Math.floor(
    (hoje - new Date(hoje.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  const index = diaDoAno % VERSICULOS.length;
  return VERSICULOS[index];
}
