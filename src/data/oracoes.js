const diaDoAno = () => {
  const hoje = new Date();
  return Math.floor((hoje - new Date(hoje.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
};

export function getOracaoDoDia(oracao) {
  const index = diaDoAno() % oracao.versoes.length;
  const versao = oracao.versoes[index];
  return { id: oracao.id, icone: oracao.icone, cor: oracao.cor, ...versao };
}

export const ORACOES = [
  {
    id: '1',
    icone: 'shield-checkmark',
    cor: '#4A90D9',
    versoes: [
      {
        titulo: 'Oração de Proteção',
        subtitulo: 'Salmo 91 - O abrigo do Altíssimo',
        duracao: '5 min',
        texto: `Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará.

Direi do Senhor: Ele é o meu Deus, o meu refúgio, a minha fortaleza, e nele confiarei.

Porque ele te livrará do laço do passarinheiro, e da peste perniciosa.

Ele te cobrirá com as suas penas, e debaixo das suas asas te confiarás; a sua verdade será o teu escudo e broquel.

Não terás medo do terror de noite nem da seta que voa de dia, nem da peste que anda na escuridão, nem da mortandade que assola ao meio-dia.

Mil cairão ao teu lado, e dez mil à tua direita, mas não chegará a ti.

Senhor, eu me refugio em Ti. Cobre-me com Tua proteção divina. Afasta de mim todo mal, toda armadilha do inimigo. Eu declaro que estou seguro em Tuas mãos. Em nome de Jesus, amém.`,
      },
      {
        titulo: 'Proteção na Jornada',
        subtitulo: 'Guardado em cada caminho',
        duracao: '4 min',
        texto: `Senhor, hoje eu saio sob a Tua cobertura.

Cada caminho que eu percorrer, que seja pavimentado pelas Tuas mãos. Cada decisão que eu tomar, que seja iluminada pela Tua sabedoria.

"O Senhor é o teu guarda; o Senhor é a tua sombra, à tua mão direita." (Salmo 121:5)

Protege-me nas estradas, nos lugares de trabalho, nos relacionamentos. Que os anjos acampem ao meu redor e nenhum mal chegue perto de mim.

Que a Tua presença vá à minha frente e prepare o caminho. Que quando eu entrar, haja paz. Que quando eu sair, haja proteção.

Eu não temo o que está pela frente, porque Tu já estás lá. Eu não temo o que está atrás, porque Tu me guardas.

Que Tua mão poderosa seja sobre mim hoje. Em nome de Jesus, amém.`,
      },
      {
        titulo: 'Escudo Contra o Mal',
        subtitulo: 'A armadura de Deus sobre minha vida',
        duracao: '4 min',
        texto: `Pai, hoje me revisto com a Tua armadura completa.

Não há esquema do inimigo que prospere contra mim, pois eu estou posicionado debaixo das Tuas asas. Tu és o meu escudo, a minha fortaleza, a minha rocha.

"Mas o Senhor me defenderá e me livrará de toda obra maligna." (2 Timóteo 4:18)

Eu cancelo todo plano que as trevas tramaram contra minha vida, minha família e meu ministério. O fogo que tentou me queimar não me consumirá.

Que toda palavra negativa pronunciada contra mim caia por terra. Que toda intenção maligna seja devolvida ao remetente. Que o sangue de Jesus forme uma barreira invisível ao redor da minha vida.

Senhor, eu confio no Teu escudo. Nada me separará do Teu amor.

Em nome de Jesus, estou protegido. Amém.`,
      },
    ],
  },
  {
    id: '2',
    icone: 'sunny',
    cor: '#F5A623',
    versoes: [
      {
        titulo: 'Oração da Madrugada',
        subtitulo: 'Primeiro fruto do dia ao Senhor',
        duracao: '7 min',
        texto: `Senhor, antes que o sol nasça, eu levanto minha voz a Ti.

Tu és o Deus que me sustenta, que me dá forças para cada novo dia.

Nesta madrugada, eu consagro meu dia a Ti. Cada passo que eu der, cada palavra que eu falar, cada decisão que eu tomar — que tudo seja guiado pela Tua sabedoria.

Pai, eu entrego meus planos, meus sonhos, minhas preocupações em Tuas mãos. Sei que Tu és fiel e que cuidas de mim.

Abre portas que nenhum homem pode fechar. Fecha portas que não são da Tua vontade.

Derrama sobre mim o Teu Espírito Santo. Que eu caminhe hoje na Tua presença, sentindo Teu amor a cada momento.

Em nome de Jesus, eu declaro que este dia é abençado. Amém.`,
      },
      {
        titulo: 'Bênção da Manhã',
        subtitulo: 'Misericórdias que se renovam a cada amanhecer',
        duracao: '5 min',
        texto: `Senhor, a manhã chegou e eu a recebo como presente das Tuas mãos.

As Tuas misericórdias se renovam a cada amanhecer. Obrigado por mais uma oportunidade de caminhar com o Senhor.

"As misericórdias do Senhor são a causa de não sermos consumidos; porque as suas misericórdias não têm fim. Renovam-se cada manhã." (Lamentações 3:22-23)

Abençoa este dia, Pai. Que o sol que nasce seja símbolo da Tua luz iluminando minha vida.

Enche minha boca de louvor antes mesmo que as preocupações do dia apareçam. Que o meu primeiro pensamento seja em Ti.

Guia cada conversa, cada reunião, cada encontro deste dia. Que eu seja instrumento de Tua graça onde quer que eu vá.

Que este dia glorifique o Teu nome. Em nome de Jesus, amém.`,
      },
      {
        titulo: 'Consagração do Novo Dia',
        subtitulo: 'Este dia pertence ao Senhor',
        duracao: '5 min',
        texto: `Pai celestial, este novo dia pertence a Ti.

Antes que o mundo reclame minha atenção, eu a entrego voluntariamente ao meu Criador. Este dia, com todas as suas possibilidades e desafios, eu o consagro ao Senhor.

"Este é o dia que o Senhor fez; regozijemo-nos e nos alegremos nele." (Salmo 118:24)

Que nada neste dia me roube a alegria que vem de Ti. Que as dificuldades me aproximem mais de Tua presença, não me afastem.

Enche-me do Teu Espírito Santo desde este momento. Que eu caminhe no fruto do Espírito: amor, alegria, paz, paciência, bondade, benignidade, fidelidade, mansidão e domínio próprio.

Que ao final deste dia eu possa dizer: servi ao Senhor com todo o meu coração.

Em nome de Jesus, amém.`,
      },
    ],
  },
  {
    id: '3',
    icone: 'heart',
    cor: '#7B68EE',
    versoes: [
      {
        titulo: 'Oração contra Ansiedade',
        subtitulo: 'Paz que excede todo entendimento',
        duracao: '6 min',
        texto: `Senhor, meu coração está pesado e minha mente não para.

Mas eu sei que Tu disseste: "Não andeis ansiosos por coisa alguma." (Filipenses 4:6)

Então, Pai, eu trago diante de Ti todas as minhas preocupações, todos os meus medos, todas as coisas que tiram minha paz.

Tu és o Deus da paz. Derrama sobre mim agora a Tua tranquilidade. Acalma minha mente, acalma meu coração.

Eu escolho confiar em Ti. Eu escolho crer que Tu estás no controle. Eu escolho descansar em Tua fidelidade.

"A paz de Deus, que excede todo entendimento, guardará os vossos corações e os vossos pensamentos em Cristo Jesus." (Filipenses 4:7)

Recebo Tua paz agora. Em nome de Jesus, amém.`,
      },
      {
        titulo: 'Descanso na Tempestade',
        subtitulo: 'Tu reinas sobre as águas e os ventos',
        duracao: '5 min',
        texto: `Senhor, as ondas estão altas e meu barco parece prestes a afundar.

Mas então eu me lembro: Tu estás comigo neste barco. E onde Tu estás, a tempestade tem que obedecer.

"Levantando-se, repreendeu o vento e disse ao mar: Aquieta-te, sossega! O vento ficou em calma e fez-se grande bonança." (Marcos 4:39)

Pai, fala paz sobre as tempestades da minha vida agora. Aquieta o que está turbulento dentro de mim. Acalma o que está agitado na minha mente.

Eu escolho não olhar para a altura das ondas, mas olhar para a Tua face. Eu escolho não calcular o tamanho do problema, mas meditar na imensidão do meu Deus.

Tu reinas sobre as águas, sobre os ventos, sobre todas as circunstâncias da minha vida.

Eu descanso em Ti. Em nome de Jesus, amém.`,
      },
      {
        titulo: 'Paz Interior',
        subtitulo: 'A paz que o mundo não pode dar',
        duracao: '5 min',
        texto: `Senhor, eu preciso da Tua paz.

Não a paz que o mundo oferece — superficial e temporária — mas a paz que excede todo entendimento. A paz que guarda o coração mesmo quando tudo ao redor parece caótico.

"Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize." (João 14:27)

Entra nos compartimentos do meu coração onde guardo os medos escondidos. Entra nas áreas onde a preocupação habita. Leva tudo isso e substitui por Tua paz.

Que eu aprenda a habitar no presente, não no futuro incerto ou no passado doloroso. Tu és o Deus do agora, e no agora eu estou seguro em Tuas mãos.

Respiro fundo. Recebo Tua paz. Ela é minha por direito, pelo sangue de Jesus.

Em nome de Jesus, amém.`,
      },
    ],
  },
  {
    id: '4',
    icone: 'flash',
    cor: '#E53935',
    versoes: [
      {
        titulo: 'Oração por Libertação',
        subtitulo: 'Quebrando cadeias espirituais',
        duracao: '8 min',
        texto: `Em nome de Jesus, eu me posiciono contra toda obra das trevas.

"Porque não temos que lutar contra carne e sangue, mas contra os principados, contra as potestades, contra os poderes deste mundo tenebroso." (Efésios 6:12)

Senhor, eu me revisto da Tua armadura completa. Coloco o capacete da salvação, o escudo da fé, a couraça da justiça e a espada do Espírito.

Todo laço, toda prisão, toda corrente que o inimigo colocou sobre minha vida — EU QUEBRO AGORA em nome de Jesus!

Eu declaro liberdade sobre minha mente, sobre minhas emoções, sobre minha saúde, sobre minhas finanças, sobre minha família.

"Se o Filho vos libertar, verdadeiramente sereis livres." (João 8:36)

Eu sou livre! Livre pelo poder do sangue de Jesus! Amém!`,
      },
      {
        titulo: 'Quebrando o Cativeiro',
        subtitulo: 'Nova criatura em Cristo Jesus',
        duracao: '6 min',
        texto: `Em nome de Jesus, eu me levanto contra todo cativeiro espiritual.

Há correntes que tentaram me prender — hábitos, pensamentos e padrões de comportamento que não refletem a nova criatura que sou em Cristo.

"Portanto, se alguém está em Cristo, é nova criatura; as coisas antigas já passaram; eis que tudo se tornou novo." (2 Coríntios 5:17)

Hoje eu declaro que sou livre. Livre da escravidão do pecado, livre da opinião alheia, livre de todo peso que me faz andar curvado.

Quebro na autoridade de Jesus todo padrão que se repetiu na minha vida. Quebro toda herança maldita, todo voto quebrado, toda porta aberta ao inimigo.

Eu escolho andar na liberdade que Cristo conquistou para mim. Não serei mais escravo do que já fui liberto.

A verdade me libertou. Em nome de Jesus, amém.`,
      },
      {
        titulo: 'Declaração de Vitória',
        subtitulo: 'Mais que vencedor por meio de Cristo',
        duracao: '6 min',
        texto: `Pai, eu não vim orar de vencido — vim declarar a Tua vitória sobre minha vida!

"Graças a Deus, que nos dá a vitória por nosso Senhor Jesus Cristo." (1 Coríntios 15:57)

Eu sou mais que vencedor por meio d'Aquele que me amou. Não me renderei, não recuarei, não desistirei.

Declaro vitória sobre a enfermidade — pelas chagas de Jesus, sou curado.
Declaro vitória sobre a escassez — Cristo se fez pobre para que eu me tornasse rico.
Declaro vitória sobre o medo — o amor perfeito lança fora todo temor.
Declaro vitória sobre a morte — Cristo ressuscitou e eu ressuscitarei com Ele.

Cada gigante que se levanta contra mim, levanta-se contra Deus. E Deus nunca perde.

Eu marcho para o campo de batalha sabendo que já venci, pois Cristo venceu.

Em nome de Jesus, a vitória é minha. Amém!`,
      },
    ],
  },
  {
    id: '5',
    icone: 'star',
    cor: '#4CAF50',
    versoes: [
      {
        titulo: 'Oração de Gratidão',
        subtitulo: 'Reconhecendo as bênçãos de Deus',
        duracao: '4 min',
        texto: `Pai celestial, eu venho diante de Ti com um coração grato.

Obrigado por mais um dia de vida. Obrigado pelo ar que respiro, pela saúde, pela família, pelos amigos.

Obrigado pelas bênçãos que eu vejo e por aquelas que eu nem percebo.

Tu és bom, Senhor. Tua misericórdia dura para sempre.

Eu reconheço que tudo que tenho vem de Ti. Cada conquista, cada vitória, cada momento de alegria — tudo é graça Tua.

"Deem graças ao Senhor, pois ele é bom; o seu amor dura para sempre." (Salmo 136:1)

Que meu coração seja sempre grato. Que eu nunca me esqueça das Tuas maravilhas.

Obrigado, Pai. Em nome de Jesus, amém.`,
      },
      {
        titulo: 'Contando as Bênçãos',
        subtitulo: 'Toda boa dádiva vem do alto',
        duracao: '4 min',
        texto: `Senhor, hoje eu escolho contar as Tuas bênçãos, uma por uma.

Obrigado pela saúde — há quem não a tenha.
Obrigado pelo teto — há quem durma ao relento.
Obrigado pela comida — há quem vá dormir com fome.
Obrigado pelos que me amam — há quem esteja completamente sozinho.
Obrigado por mais um amanhecer — há quem não viu o sol nascer hoje.

"Toda boa dádiva e todo dom perfeito vêm do alto, descendo do Pai das luzes." (Tiago 1:17)

Que meus olhos nunca se fechem para as Tuas bênçãos por causa da ingratidão.

Eu não mereço nada do que tenho — tudo é graça. Tudo é favor imerecido. Tudo vem da Tua mão generosa.

Obrigado, Pai. Do fundo do coração, obrigado.

Em nome de Jesus, amém.`,
      },
      {
        titulo: 'Louvor e Adoração',
        subtitulo: 'Grande é o Senhor e mui digno de louvor',
        duracao: '5 min',
        texto: `Senhor, não tenho palavras suficientes para Te adorar.

Tu és maior do que qualquer problema que eu enfrento. Tu és mais rico do que qualquer carência que eu sinto. Tu és mais forte do que qualquer inimigo que se levanta.

"Grande é o Senhor e mui digno de louvor, e a sua grandeza é insondável." (Salmo 145:3)

Hoje eu não venho com lista de pedidos — venho simplesmente para adorar. Para contemplar Tua beleza, Tua santidade, Tua glória.

Tu és o Criador do universo e ainda assim cuidas dos detalhes da minha vida. Tu és eterno e ainda assim me conheces pelo nome.

Que minha adoração Te agrade. Que o louvor dos meus lábios seja como incenso diante do Teu trono.

Que toda a Terra Te adore.

Em nome de Jesus, amém.`,
      },
    ],
  },
  {
    id: '6',
    icone: 'people',
    cor: '#FF9800',
    versoes: [
      {
        titulo: 'Oração pela Família',
        subtitulo: 'Cobertura espiritual para seu lar',
        duracao: '6 min',
        texto: `Senhor, eu levanto minha família diante de Ti.

Cobre com Teu sangue precioso cada membro da minha família. Protege meus pais, meus filhos, meu cônjuge, meus irmãos.

Que a paz reine em nosso lar. Que o amor seja a base de todos os nossos relacionamentos.

Afasta toda discórdia, toda divisão, toda influência maligna que tente destruir minha família.

"Creia no Senhor Jesus, e serás salvo, tu e a tua casa." (Atos 16:31)

Eu declaro salvação sobre cada membro da minha família. Eu declaro que minha casa serve ao Senhor.

Restaura o que foi quebrado. Une o que foi separado. Cura o que foi ferido.

Em nome de Jesus, minha família é do Senhor. Amém.`,
      },
      {
        titulo: 'Clamando pelo Lar',
        subtitulo: 'Que o Espírito Santo habite neste lugar',
        duracao: '5 min',
        texto: `Senhor, eu clamo pelo meu lar.

Que a Tua presença habite em cada cômodo da minha casa. Que quando alguém entrar, sinta que há algo diferente aqui — que o Espírito Santo mora neste lugar.

"Quanto a mim e à minha casa, serviremos ao Senhor." (Josué 24:15)

Afasta de dentro do meu lar toda influência contrária a Ti. Que não haja espaço para a amargura, para o ressentimento, para a frieza. Que o amor de Deus flua livremente entre nós.

Protege meu lar das armadilhas do inimigo. Que nenhuma divisão, nenhuma confusão, nenhuma mentira penetre estas paredes.

Que minha casa seja um lugar de repouso, de cura e de hospitalidade. Um lugar onde o nome de Jesus é exaltado.

Consagro este lar ao Senhor. Em nome de Jesus, amém.`,
      },
      {
        titulo: 'Unidade Familiar',
        subtitulo: 'Mantendo a unidade pelo vínculo da paz',
        duracao: '5 min',
        texto: `Pai, que eu seja um instrumento de paz dentro da minha família.

Muitas vezes as palavras ferem mais do que deveriam. Muitas vezes os silêncios duram mais do que o amor permitiria. Muitas vezes as mágoas se acumulam e erguem muros.

"Suportai-vos uns aos outros em amor, esforçando-vos por manter a unidade do Espírito pelo vínculo da paz." (Efésios 4:2-3)

Senhor, ensina-me a amar minha família como Tu me amas — com paciência, sem guardar rancor, procurando sempre o melhor para o outro.

Onde há feridas, traz cura. Onde há distância, traz aproximação. Onde há incompreensão, traz entendimento.

Que cada refeição seja comunhão. Que cada conversa construa pontes. Que cada abraço transmita amor genuíno.

Une minha família, Senhor. Em nome de Jesus, amém.`,
      },
    ],
  },
];
