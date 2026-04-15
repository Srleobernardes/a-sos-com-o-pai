export const VERSICULOS = [
  {
    texto: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigenito, para que todo aquele que nele cre nao pereca, mas tenha a vida eterna.',
    referencia: 'Joao 3:16',
  },
  {
    texto: 'O Senhor e o meu pastor; nada me faltara.',
    referencia: 'Salmo 23:1',
  },
  {
    texto: 'Tudo posso naquele que me fortalece.',
    referencia: 'Filipenses 4:13',
  },
  {
    texto: 'Confia no Senhor de todo o teu coracao e nao te estribes no teu proprio entendimento.',
    referencia: 'Proverbios 3:5',
  },
  {
    texto: 'Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e nao de mal, para vos dar o fim que esperais.',
    referencia: 'Jeremias 29:11',
  },
  {
    texto: 'Nao temas, porque eu sou contigo; nao te assombres, porque eu sou o teu Deus; eu te fortaleco, e te ajudo, e te sustento com a destra da minha justica.',
    referencia: 'Isaias 41:10',
  },
  {
    texto: 'Mas os que esperam no Senhor renovarao as suas forcas; subiram com asas como aguias; correrao e nao se cansarao; caminharao e nao se fatigarao.',
    referencia: 'Isaias 40:31',
  },
  {
    texto: 'Entrega o teu caminho ao Senhor; confia nele, e ele tudo fara.',
    referencia: 'Salmo 37:5',
  },
  {
    texto: 'E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus.',
    referencia: 'Romanos 8:28',
  },
  {
    texto: 'O Senhor e a minha luz e a minha salvacao; a quem temerei? O Senhor e a forca da minha vida; de quem me recearei?',
    referencia: 'Salmo 27:1',
  },
  {
    texto: 'Lancando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vos.',
    referencia: '1 Pedro 5:7',
  },
  {
    texto: 'Jesus disse: Eu sou o caminho, a verdade e a vida. Ninguem vem ao Pai senao por mim.',
    referencia: 'Joao 14:6',
  },
  {
    texto: 'Buscai primeiro o Reino de Deus e a sua justica, e todas estas coisas vos serao acrescentadas.',
    referencia: 'Mateus 6:33',
  },
  {
    texto: 'Deem gracas ao Senhor, pois ele e bom; o seu amor dura para sempre.',
    referencia: 'Salmo 136:1',
  },
  {
    texto: 'Alegrem-se sempre no Senhor. Novamente direi: alegrem-se!',
    referencia: 'Filipenses 4:4',
  },
  {
    texto: 'Pois onde estiverem dois ou tres reunidos em meu nome, ali eu estou no meio deles.',
    referencia: 'Mateus 18:20',
  },
  {
    texto: 'Sede fortes e corajosos. Nao temam nem fiquem apavorados, pois o Senhor, o seu Deus, vai com voces; nunca os deixara, nunca os abandonara.',
    referencia: 'Deuteronomio 31:6',
  },
  {
    texto: 'A minha graca te basta, porque o meu poder se aperfeiçoa na fraqueza.',
    referencia: '2 Corintios 12:9',
  },
  {
    texto: 'Clamei ao Senhor na minha angustia, e ele me respondeu.',
    referencia: 'Salmo 120:1',
  },
  {
    texto: 'Deleita-te tambem no Senhor, e ele te concedera os desejos do teu coracao.',
    referencia: 'Salmo 37:4',
  },
  {
    texto: 'Se confessarmos os nossos pecados, ele e fiel e justo para nos perdoar e nos purificar de toda injustica.',
    referencia: '1 Joao 1:9',
  },
  {
    texto: 'Eis que estou a porta e bato. Se alguem ouvir a minha voz e abrir a porta, entrarei e cearei com ele, e ele comigo.',
    referencia: 'Apocalipse 3:20',
  },
  {
    texto: 'Porque o Senhor da a sabedoria; da sua boca vem o conhecimento e o entendimento.',
    referencia: 'Proverbios 2:6',
  },
  {
    texto: 'Portanto, se alguem esta em Cristo, e nova criacao. As coisas antigas ja passaram; eis que surgiram coisas novas!',
    referencia: '2 Corintios 5:17',
  },
  {
    texto: 'Pois Deus nao nos deu o espirito de covardia, mas de poder, de amor e de equilibrio.',
    referencia: '2 Timoteo 1:7',
  },
  {
    texto: 'O Senhor e bom, uma fortaleza no dia da angustia; e conhece os que nele confiam.',
    referencia: 'Naum 1:7',
  },
  {
    texto: 'Clama a mim e te responderei; anunciar-te-ei coisas grandes e firmes que nao sabes.',
    referencia: 'Jeremias 33:3',
  },
  {
    texto: 'A fe e a certeza daquilo que esperamos e a prova das coisas que nao vemos.',
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
