// bible-api.js - Sistema multi-API com PRIORIDADE em português

// ============================================================
// 1. LISTA DE APIS (APENAS EM PORTUGUÊS)
// ============================================================
const API_SOURCES = [
  // PRIORIDADE 1: bible-api.com com Almeida (português)
  {
    name: 'Almeida (bible-api.com)',
    url: (book, chapter) => {
      const eng = bookEnglish[book] || book;
      return `https://bible-api.com/${encodeURIComponent(eng)}%20${chapter}?translation=almeida`;
    },
    parse: async (response) => {
      const data = await response.json();
      if (data.verses && Array.isArray(data.verses)) {
        const verses = data.verses.map(v => [String(v.verse), v.text]);
        return {
          reference: data.reference || `${book} ${chapter}`,
          verses: verses,
          source: 'Almeida · bible-api.com'
        };
      }
      throw new Error('Formato inesperado');
    }
  },

  // PRIORIDADE 2: abibliadigital.com.br com NVI (português)
  {
    name: 'NVI (abibliadigital.com.br)',
    url: (book, chapter) => {
      const abbrev = bookAbbrev[book];
      if (!abbrev) throw new Error('Livro não mapeado');
      return `https://www.abibliadigital.com.br/api/verses/nvi/${abbrev}/${chapter}`;
    },
    parse: async (response) => {
      const data = await response.json();
      if (data.verses && Array.isArray(data.verses)) {
        const verses = data.verses.map(v => [String(v.number), v.text]);
        return {
          reference: `${data.book.name} ${data.chapter.number}`,
          verses: verses,
          source: 'NVI · abibliadigital.com.br'
        };
      }
      throw new Error('Formato inesperado');
    }
  },

  // PRIORIDADE 3: abibliadigital.com.br com ARA (português)
  {
    name: 'ARA (abibliadigital.com.br)',
    url: (book, chapter) => {
      const abbrev = bookAbbrev[book];
      if (!abbrev) throw new Error('Livro não mapeado');
      return `https://www.abibliadigital.com.br/api/verses/ara/${abbrev}/${chapter}`;
    },
    parse: async (response) => {
      const data = await response.json();
      if (data.verses && Array.isArray(data.verses)) {
        const verses = data.verses.map(v => [String(v.number), v.text]);
        return {
          reference: `${data.book.name} ${data.chapter.number}`,
          verses: verses,
          source: 'ARA · abibliadigital.com.br'
        };
      }
      throw new Error('Formato inesperado');
    }
  },

  // PRIORIDADE 4: abibliadigital.com.br com ACF (português)
  {
    name: 'ACF (abibliadigital.com.br)',
    url: (book, chapter) => {
      const abbrev = bookAbbrev[book];
      if (!abbrev) throw new Error('Livro não mapeado');
      return `https://www.abibliadigital.com.br/api/verses/acf/${abbrev}/${chapter}`;
    },
    parse: async (response) => {
      const data = await response.json();
      if (data.verses && Array.isArray(data.verses)) {
        const verses = data.verses.map(v => [String(v.number), v.text]);
        return {
          reference: `${data.book.name} ${data.chapter.number}`,
          verses: verses,
          source: 'ACF · abibliadigital.com.br'
        };
      }
      throw new Error('Formato inesperado');
    }
  },

  // PRIORIDADE 5: APEE (abibliadigital.com.br) - português
  {
    name: 'APEE (abibliadigital.com.br)',
    url: (book, chapter) => {
      const abbrev = bookAbbrev[book];
      if (!abbrev) throw new Error('Livro não mapeado');
      return `https://www.abibliadigital.com.br/api/verses/apee/${abbrev}/${chapter}`;
    },
    parse: async (response) => {
      const data = await response.json();
      if (data.verses && Array.isArray(data.verses)) {
        const verses = data.verses.map(v => [String(v.number), v.text]);
        return {
          reference: `${data.book.name} ${data.chapter.number}`,
          verses: verses,
          source: 'APEE · abibliadigital.com.br'
        };
      }
      throw new Error('Formato inesperado');
    }
  }
];

// ============================================================
// 2. MAPEAMENTOS
// ============================================================
const bookAbbrev = {
  'Gênesis': 'gn', 'Êxodo': 'ex', 'Levítico': 'lv', 'Números': 'nm',
  'Deuteronômio': 'dt', 'Josué': 'js', 'Juízes': 'jz', 'Rute': 'rt',
  '1 Samuel': '1sm', '2 Samuel': '2sm', '1 Reis': '1rs', '2 Reis': '2rs',
  '1 Crônicas': '1cr', '2 Crônicas': '2cr', 'Esdras': 'ed', 'Neemias': 'ne',
  'Ester': 'et', 'Jó': 'jo', 'Salmos': 'sl', 'Provérbios': 'pv',
  'Eclesiastes': 'ec', 'Cantares': 'ct', 'Isaías': 'is', 'Jeremias': 'jr',
  'Lamentações': 'lm', 'Ezequiel': 'ez', 'Daniel': 'dn', 'Oséias': 'os',
  'Joel': 'jl', 'Amós': 'am', 'Obadias': 'ob', 'Jonas': 'jn',
  'Miquéias': 'mq', 'Naum': 'na', 'Habacuque': 'hc', 'Sofonias': 'sf',
  'Ageu': 'ag', 'Zacarias': 'zc', 'Malaquias': 'ml',
  'Mateus': 'mt', 'Marcos': 'mc', 'Lucas': 'lc', 'João': 'jo',
  'Atos': 'at', 'Romanos': 'rm', '1 Coríntios': '1co', '2 Coríntios': '2co',
  'Gálatas': 'gl', 'Efésios': 'ef', 'Filipenses': 'fp', 'Colossenses': 'cl',
  '1 Tessalonicenses': '1ts', '2 Tessalonicenses': '2ts', '1 Timóteo': '1tm',
  '2 Timóteo': '2tm', 'Tito': 'tt', 'Filemom': 'fm', 'Hebreus': 'hb',
  'Tiago': 'tg', '1 Pedro': '1pd', '2 Pedro': '2pd', '1 João': '1jo',
  '2 João': '2jo', '3 João': '3jo', 'Judas': 'jd', 'Apocalipse': 'ap'
};

const bookEnglish = {
  'Gênesis': 'Genesis', 'Êxodo': 'Exodus', 'Levítico': 'Leviticus',
  'Números': 'Numbers', 'Deuteronômio': 'Deuteronomy', 'Josué': 'Joshua',
  'Juízes': 'Judges', 'Rute': 'Ruth', '1 Samuel': '1 Samuel',
  '2 Samuel': '2 Samuel', '1 Reis': '1 Kings', '2 Reis': '2 Kings',
  '1 Crônicas': '1 Chronicles', '2 Crônicas': '2 Chronicles',
  'Esdras': 'Ezra', 'Neemias': 'Nehemiah', 'Ester': 'Esther',
  'Jó': 'Job', 'Salmos': 'Psalms', 'Provérbios': 'Proverbs',
  'Eclesiastes': 'Ecclesiastes', 'Cantares': 'Song of Solomon',
  'Isaías': 'Isaiah', 'Jeremias': 'Jeremiah', 'Lamentações': 'Lamentations',
  'Ezequiel': 'Ezekiel', 'Daniel': 'Daniel', 'Oséias': 'Hosea',
  'Joel': 'Joel', 'Amós': 'Amos', 'Obadias': 'Obadiah',
  'Jonas': 'Jonah', 'Miquéias': 'Micah', 'Naum': 'Nahum',
  'Habacuque': 'Habakkuk', 'Sofonias': 'Zephaniah', 'Ageu': 'Haggai',
  'Zacarias': 'Zechariah', 'Malaquias': 'Malachi',
  'Mateus': 'Matthew', 'Marcos': 'Mark', 'Lucas': 'Luke',
  'João': 'John', 'Atos': 'Acts', 'Romanos': 'Romans',
  '1 Coríntios': '1 Corinthians', '2 Coríntios': '2 Corinthians',
  'Gálatas': 'Galatians', 'Efésios': 'Ephesians', 'Filipenses': 'Philippians',
  'Colossenses': 'Colossians', '1 Tessalonicenses': '1 Thessalonians',
  '2 Tessalonicenses': '2 Thessalonians', '1 Timóteo': '1 Timothy',
  '2 Timóteo': '2 Timothy', 'Tito': 'Titus', 'Filemom': 'Philemon',
  'Hebreus': 'Hebrews', 'Tiago': 'James', '1 Pedro': '1 Peter',
  '2 Pedro': '2 Peter', '1 João': '1 John', '2 João': '2 John',
  '3 João': '3 John', 'Judas': 'Jude', 'Apocalipse': 'Revelation'
};

// ============================================================
// 3. FALLBACK OFFLINE (português)
// ============================================================
const offlineChapters = {
  'Gênesis': {
    1: [
      ['1', 'No princípio Deus criou os céus e a terra.'],
      ['2', 'A terra era sem forma e vazia; trevas cobriam a face do abismo, e o Espírito de Deus se movia sobre a face das águas.'],
      ['3', 'Disse Deus: "Haja luz", e houve luz.'],
      ['4', 'Deus viu que a luz era boa, e separou a luz das trevas.'],
      ['5', 'Deus chamou a luz "dia" e às trevas "noite". Passaram-se a tarde e a manhã; esse foi o primeiro dia.'],
      ['6', 'Disse Deus: "Haja uma expansão entre as águas, e separe águas de águas."'],
      ['7', 'Deus fez a expansão e separou as águas que estavam debaixo da expansão das que estavam por cima. E assim foi.'],
      ['8', 'Deus chamou à expansão "céu". Passaram-se a tarde e a manhã; esse foi o segundo dia.'],
      ['9', 'Disse Deus: "Ajuntem-se as águas debaixo do céu num só lugar, e apareça a parte seca." E assim foi.'],
      ['10', 'Deus chamou à parte seca "terra" e ao ajuntamento de águas "mares". E Deus viu que isso era bom.'],
      ['11', 'Disse Deus: "Produza a terra vegetação: plantas que dêem sementes e árvores que dêem fruto com semente, conforme as suas espécies." E assim foi.'],
      ['12', 'A terra produziu vegetação: plantas que dão semente conforme as suas espécies, e árvores que dão fruto com semente conforme as suas espécies. E Deus viu que isso era bom.'],
      ['13', 'Passaram-se a tarde e a manhã; esse foi o terceiro dia.'],
      ['14', 'Disse Deus: "Haja luzes no firmamento do céu para separar o dia da noite. Que sirvam como sinais para marcar estações, dias e anos.'],
      ['15', 'Sirvam de luzes no firmamento do céu para iluminar a terra." E assim foi.'],
      ['16', 'Deus fez duas grandes luzes: a maior para governar o dia e a menor para governar a noite. Fez também as estrelas.'],
      ['17', 'Deus as colocou no firmamento do céu para iluminar a terra,'],
      ['18', 'governar o dia e a noite, e separar a luz das trevas. E Deus viu que isso era bom.'],
      ['19', 'Passaram-se a tarde e a manhã; esse foi o quarto dia.'],
      ['20', 'Disse Deus: "Encham-se as águas de seres vivos, e voem as aves sobre a terra, sob o firmamento do céu."'],
      ['21', 'Deus criou os grandes monstros marinhos, todos os seres vivos que se movem e com que as águas fervilham conforme as suas espécies, e todas as aves conforme as suas espécies. E Deus viu que isso era bom.'],
      ['22', 'Deus os abençoou, dizendo: "Sejam férteis e multipliquem-se! Encham as águas dos mares! E multipliquem-se as aves sobre a terra."'],
      ['23', 'Passaram-se a tarde e a manhã; esse foi o quinto dia.'],
      ['24', 'Disse Deus: "Produza a terra seres vivos conforme as suas espécies: animais domésticos, répteis e animais selvagens, conforme as suas espécies." E assim foi.'],
      ['25', 'Deus fez os animais selvagens conforme as suas espécies, os domésticos conforme as suas espécies e todos os répteis conforme as suas espécies. E Deus viu que isso era bom.'],
      ['26', 'Disse Deus: "Façamos o homem à nossa imagem, conforme a nossa semelhança. Domine ele sobre os peixes do mar, sobre as aves do céu, sobre os animais domésticos, sobre toda a terra e sobre todos os répteis que se arrastam sobre a terra."'],
      ['27', 'Deus criou o homem à sua imagem, à imagem de Deus o criou; homem e mulher os criou.'],
      ['28', 'Deus os abençoou e lhes disse: "Sejam férteis e multipliquem-se! Encham a terra e subjuguem-na! Domine sobre os peixes do mar, sobre as aves do céu e sobre todo ser vivo que se move sobre a terra."'],
      ['29', 'Disse Deus: "Eis que dou a vocês todas as plantas que dão semente em toda a terra e todas as árvores que dão fruto com semente. Elas servirão de alimento para vocês.'],
      ['30', 'E a todos os animais selvagens, às aves do céu e a todos os seres vivos que se movem sobre a terra, dou todas as plantas verdes como alimento." E assim foi.'],
      ['31', 'Deus viu tudo o que havia feito, e tudo era muito bom. Passaram-se a tarde e a manhã; esse foi o sexto dia.']
    ],
    3: [
      ['1', 'Ora, a serpente era mais astuta que todas as alimárias do campo que o SENHOR Deus tinha feito. E ela disse à mulher: É assim que Deus disse: Não comereis de toda árvore do jardim?'],
      ['2', 'E disse a mulher à serpente: Do fruto das árvores do jardim comeremos,'],
      ['3', 'mas do fruto da árvore que está no meio do jardim, disse Deus: Não comereis dele, nem nele tocareis, para que não morrais.'],
      ['4', 'Então a serpente disse à mulher: Certamente não morrereis.'],
      ['5', 'Porque Deus sabe que no dia em que dele comerdes se abrirão os vossos olhos, e sereis como Deus, sabendo o bem e o mal.'],
      ['6', 'E viu a mulher que aquela árvore era boa para se comer, e agradável aos olhos, e árvore desejável para dar entendimento; tomou do seu fruto, e comeu, e deu também a seu marido, e ele comeu com ela.'],
      ['7', 'Então foram abertos os olhos de ambos, e conheceram que estavam nus; e coseram folhas de figueira, e fizeram para si aventais.'],
      ['8', 'E ouviram a voz do SENHOR Deus, que passeava no jardim na viração do dia; e esconderam-se Adão e sua mulher da presença do SENHOR Deus, entre as árvores do jardim.'],
      ['9', 'E chamou o SENHOR Deus a Adão, e disse-lhe: Onde estás?'],
      ['10', 'E ele disse: Ouvi a tua voz no jardim, e temi, porque estava nu, e escondi-me.'],
      ['11', 'E Deus disse: Quem te mostrou que estavas nu? Comeste tu da árvore de que te ordenei que não comesses?'],
      ['12', 'Então disse Adão: A mulher que me deste por companheira, ela me deu da árvore, e comi.'],
      ['13', 'E disse o SENHOR Deus à mulher: Por que fizeste isto? E disse a mulher: A serpente me enganou, e eu comi.'],
      ['14', 'Então o SENHOR Deus disse à serpente: Porquanto fizeste isto, maldita serás mais que toda a fera, e mais que todos os animais do campo; sobre o teu ventre andarás, e pó comerás todos os dias da tua vida.'],
      ['15', 'E porei inimizade entre ti e a mulher, e entre a tua semente e a sua semente; esta te ferirá a cabeça, e tu lhe ferirás o calcanhar.'],
      ['16', 'E à mulher disse: Multiplicarei grandemente a tua dor, e a tua conceição; com dor terás filhos; e o teu desejo será para o teu marido, e ele te dominará.'],
      ['17', 'E a Adão disse: Porquanto deste ouvidos à voz de tua mulher, e comeste da árvore de que te ordenei, dizendo: Não comerás dela; maldita é a terra por causa de ti; com dor comerás dela todos os dias da tua vida.'],
      ['18', 'Espinhos e cardos também te produzirá; e comerás a erva do campo.'],
      ['19', 'No suor do teu rosto comerás o teu pão, até que te tornes à terra; porque dela foste tomado, porquanto és pó, e em pó te tornarás.'],
      ['20', 'E chamou Adão o nome de sua mulher Eva, porquanto era a mãe de todos os viventes.'],
      ['21', 'E fez o SENHOR Deus a Adão e a sua mulher túnicas de peles, e os vestiu.'],
      ['22', 'Então disse o SENHOR Deus: Eis que o homem é como um de nós, sabendo o bem e o mal; ora, para que não estenda a sua mão, e tome também da árvore da vida, e coma, e viva eternamente,'],
      ['23', 'O SENHOR Deus, pois, o lançou fora do jardim do Éden, para lavrar a terra de que fora tomado.'],
      ['24', 'E havendo lançado fora o homem, pôs querubins ao oriente do jardim do Éden, e uma espada inflamada que andava ao redor, para guardar o caminho da árvore da vida.']
    ]
  },
  'João': {
    3: [
      ['1', 'Havia um homem dos fariseus, chamado Nicodemos, um dos principais dos judeus.'],
      ['2', 'Este foi ter com Jesus de noite e disse-lhe: Rabi, sabemos que és Mestre vindo de Deus; porque ninguém pode fazer estes sinais que tu fazes, se Deus não estiver com ele.'],
      ['3', 'Jesus respondeu: Em verdade, em verdade te digo que, se alguém não nascer de novo, não pode ver o reino de Deus.'],
      ['4', 'Disse-lhe Nicodemos: Como pode um homem nascer, sendo velho? Porventura pode tornar a entrar no ventre de sua mãe e nascer?'],
      ['5', 'Jesus respondeu: Em verdade, em verdade te digo que, se alguém não nascer da água e do Espírito, não pode entrar no reino de Deus.'],
      ['6', 'O que é nascido da carne é carne; e o que é nascido do Espírito é espírito.'],
      ['7', 'Não te admires de que te disse: Necessário vos é nascer de novo.'],
      ['8', 'O vento assopra onde quer, e ouves a sua voz, mas não sabes de onde vem, nem para onde vai; assim é todo aquele que é nascido do Espírito.'],
      ['9', 'Nicodemos respondeu e disse-lhe: Como pode ser isto?'],
      ['10', 'Jesus respondeu e disse-lhe: Tu és mestre de Israel e não sabes estas coisas?'],
      ['11', 'Em verdade, em verdade te digo que nós dizemos o que sabemos e testificamos o que vimos; e não recebeis o nosso testemunho.'],
      ['12', 'Se vos falei das coisas terrenas e não credes, como crereis, se vos falar das celestiais?'],
      ['13', 'Ora, ninguém subiu ao céu, senão o que desceu do céu, o Filho do Homem, que está no céu.'],
      ['14', 'E como Moisés levantou a serpente no deserto, assim importa que o Filho do Homem seja levantado,'],
      ['15', 'para que todo aquele que nele crê não pereça, mas tenha a vida eterna.'],
      ['16', 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.'],
      ['17', 'Pois Deus enviou o seu Filho ao mundo, não para condenar o mundo, mas para que o mundo fosse salvo por ele.'],
      ['18', 'Quem nele crê não é condenado; mas quem não crê já está condenado, porquanto não crê no nome do unigênito Filho de Deus.'],
      ['19', 'E o julgamento é este: que a luz veio ao mundo, e os homens amaram mais as trevas do que a luz, porque as suas obras eram más.'],
      ['20', 'Pois todo aquele que pratica o mal aborrece a luz e não se chega para a luz, para que as suas obras não sejam reprovadas.'],
      ['21', 'Mas aquele que pratica a verdade chega-se para a luz, para que as suas obras sejam manifestas, porque são feitas em Deus.'],
      ['22', 'Depois disso, foi Jesus com os seus discípulos para a terra da Judeia; e ali permaneceu com eles e batizava.'],
      ['23', 'Ora, João também estava batizando em Enom, perto de Salim, porque havia ali muitas águas; e o povo vinha e era batizado.'],
      ['24', 'Pois João ainda não tinha sido lançado na prisão.'],
      ['25', 'Ora, surgiu uma discussão entre alguns dos discípulos de João e os judeus acerca da purificação.'],
      ['26', 'E foram ter com João e disseram-lhe: Rabi, aquele que estava contigo além do Jordão, de quem tu deste testemunho, está batizando, e todos vão ter com ele.'],
      ['27', 'Respondeu João: O homem não pode receber coisa alguma, se do céu não lhe for dada.'],
      ['28', 'Vós mesmos me sois testemunhas de que eu disse: Não sou o Cristo, mas sou enviado adiante dele.'],
      ['29', 'O que tem a noiva é o noivo; mas o amigo do noivo, que está presente e o ouve, alegra-se muito com a voz do noivo. Pois esta minha alegria está completa.'],
      ['30', 'É necessário que ele cresça, e que eu diminua.'],
      ['31', 'Aquele que vem de cima é sobre todos; aquele que vem da terra é da terra e fala da terra. Aquele que vem do céu é sobre todos.'],
      ['32', 'Ele testifica o que viu e ouviu, e ninguém recebe o seu testemunho.'],
      ['33', 'Aquele que recebeu o seu testemunho confirmou que Deus é verdadeiro.'],
      ['34', 'Porque aquele que Deus enviou fala as palavras de Deus; pois Deus não dá o Espírito por medida.'],
      ['35', 'O Pai ama o Filho e entregou todas as coisas nas suas mãos.'],
      ['36', 'Quem crê no Filho tem a vida eterna; mas quem não crê no Filho não verá a vida, mas a ira de Deus sobre ele permanece.']
    ]
  },
  'Salmos': {
    23: [
      ['1', 'O SENHOR é o meu pastor; nada me faltará.'],
      ['2', 'Ele me faz repousar em pastos verdejantes. Leva-me para junto das águas tranquilas.'],
      ['3', 'Refrigera-me a alma. Guia-me pelas veredas da justiça por amor do seu nome.'],
      ['4', 'Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.'],
      ['5', 'Preparas-me uma mesa na presença dos meus inimigos; unges-me a cabeça com óleo; o meu cálice transborda.'],
      ['6', 'Certamente que a bondade e a misericórdia me seguirão todos os dias da minha vida; e habitarei na casa do SENHOR por longos dias.']
    ]
  },
  'Romanos': {
    8: [
      ['1', 'Portanto, agora nenhuma condenação há para os que estão em Cristo Jesus.'],
      ['2', 'Porque a lei do Espírito da vida, em Cristo Jesus, me livrou da lei do pecado e da morte.'],
      ['3', 'Porquanto o que era impossível à lei, visto como estava enferma pela carne, Deus, enviando o seu próprio Filho em semelhança de carne pecaminosa e por causa do pecado, na carne condenou o pecado,'],
      ['4', 'para que a justiça da lei se cumprisse em nós, que não andamos segundo a carne, mas segundo o Espírito.'],
      ['5', 'Porque os que são segundo a carne inclinam-se para as coisas da carne; mas os que são segundo o Espírito, para as coisas do Espírito.'],
      ['6', 'Porque a inclinação da carne é morte; mas a inclinação do Espírito é vida e paz.'],
      ['7', 'Porquanto a inclinação da carne é inimizade contra Deus, pois não é sujeita à lei de Deus, nem em verdade o pode ser.'],
      ['8', 'Portanto, os que estão na carne não podem agradar a Deus.'],
      ['9', 'Vós, porém, não estais na carne, mas no Espírito, se é que o Espírito de Deus habita em vós. Mas, se alguém não tem o Espírito de Cristo, esse tal não é dele.'],
      ['10', 'E, se Cristo está em vós, o corpo, na verdade, está morto por causa do pecado, mas o espírito vive por causa da justiça.'],
      ['11', 'E, se o Espírito daquele que ressuscitou Jesus dentre os mortos habita em vós, aquele que ressuscitou Cristo Jesus dentre os mortos vivificará também os vossos corpos mortais, pelo seu Espírito que em vós habita.'],
      ['12', 'Portanto, irmãos, somos devedores, não à carne, para viver segundo a carne;'],
      ['13', 'porque, se viverdes segundo a carne, haveis de morrer; mas, se pelo Espírito mortificardes as obras do corpo, vivereis.'],
      ['14', 'Porque todos os que são guiados pelo Espírito de Deus, esses são filhos de Deus.'],
      ['15', 'Porque não recebestes o espírito de escravidão, para outra vez estardes em temor, mas recebestes o espírito de adoção, pelo qual clamamos: Aba, Pai.'],
      ['16', 'O próprio Espírito testifica com o nosso espírito que somos filhos de Deus.'],
      ['17', 'E, se somos filhos, somos também herdeiros, herdeiros de Deus e co-herdeiros de Cristo; se é certo que com ele padecemos, para que também com ele sejamos glorificados.'],
      ['18', 'Porque para mim tenho por certo que as aflições deste tempo presente não são para comparar com a glória que em nós há de ser revelada.'],
      ['19', 'Porque a ardente expectação da criatura espera a manifestação dos filhos de Deus.'],
      ['20', 'Porque a criação foi sujeita à vaidade, não por sua vontade, mas por causa do que a sujeitou,'],
      ['21', 'Na esperança de que também a mesma criatura será libertada da servidão da corrupção, para a liberdade da glória dos filhos de Deus.'],
      ['22', 'Porque sabemos que toda a criação geme e está juntamente com dores de parto até agora.'],
      ['23', 'E não só ela, mas também nós, que temos as primícias do Espírito, também gememos em nós mesmos, esperando a adoção, a saber, a redenção do nosso corpo.'],
      ['24', 'Porque em esperança somos salvos. Ora, a esperança que se vê não é esperança; pois o que alguém vê, como o espera?'],
      ['25', 'Mas, se esperamos o que não vemos, com paciência o aguardamos.'],
      ['26', 'E da mesma maneira também o Espírito nos ajuda em nossa fraqueza; porque não sabemos o que havemos de pedir como convém, mas o mesmo Espírito intercede por nós com gemidos inexprimíveis.'],
      ['27', 'E aquele que sonda os corações sabe qual é a intenção do Espírito; e que ele segundo Deus intercede pelos santos.'],
      ['28', 'E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.'],
      ['29', 'Porque os que dantes conheceu, também os predestinou para serem conformes à imagem de seu Filho, a fim de que ele seja o primogênito entre muitos irmãos.'],
      ['30', 'E aos que predestinou, a estes também chamou; e aos que chamou, a estes também justificou; e aos que justificou, a estes também glorificou.'],
      ['31', 'Que diremos, pois, a estas coisas? Se Deus é por nós, quem será contra nós?'],
      ['32', 'Aquele que não poupou o seu próprio Filho, antes o entregou por todos nós, como não nos dará também com ele todas as coisas?'],
      ['33', 'Quem intentará acusação contra os escolhidos de Deus? É Deus quem os justifica.'],
      ['34', 'Quem é que condena? É Cristo quem morreu, ou antes quem ressuscitou, o qual está à direita de Deus, e também intercede por nós.'],
      ['35', 'Quem nos separará do amor de Cristo? A tribulação, ou a angústia, ou a perseguição, ou a fome, ou a nudez, ou o perigo, ou a espada?'],
      ['36', 'Como está escrito: Por amor de ti somos entregues à morte todo o dia; fomos considerados como ovelhas para o matadouro.'],
      ['37', 'Mas em todas estas coisas somos mais do que vencedores, por aquele que nos amou.'],
      ['38', 'Porque estou certo de que, nem a morte, nem a vida, nem os anjos, nem os principados, nem as potestades, nem o presente, nem o porvir,'],
      ['39', 'Nem a altura, nem a profundidade, nem alguma outra criatura nos poderá separar do amor de Deus, que está em Cristo Jesus nosso Senhor.']
    ]
  }
};

// ============================================================
// 4. FUNÇÃO PRINCIPAL
// ============================================================
export async function getChapter(book = 'João', chapter = 3, version = 'almeida') {
  // Tenta as APIs em português (ordem de prioridade)
  for (const source of API_SOURCES) {
    try {
      console.log(`🔍 Tentando: ${source.name}`);
      const url = source.url(book, chapter);
      console.log(`   URL: ${url}`);
      
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`   ❌ Falhou (${response.status}): ${source.name}`);
        continue;
      }
      
      const result = await source.parse(response);
      console.log(`   ✅ Sucesso: ${source.name}`);
      return result;
    } catch (error) {
      console.warn(`   ❌ Erro em ${source.name}:`, error.message);
    }
  }

  // Se todas as APIs falharem, usa fallback offline
  console.warn('⚠️ Todas as APIs falharam. Usando fallback offline.');
  const fallbackVerses = getOfflineChapter(book, chapter);
  return {
    reference: `${book} ${chapter}`,
    verses: fallbackVerses,
    source: 'Fallback offline (português)'
  };
}

// ============================================================
// 5. FALLBACK OFFLINE
// ============================================================
function getOfflineChapter(book, chapter) {
  // Verifica se existe fallback específico
  if (offlineChapters[book] && offlineChapters[book][chapter]) {
    return offlineChapters[book][chapter];
  }

  // Fallback genérico (apenas para não quebrar)
  const verses = [];
  for (let i = 1; i <= 20; i++) {
    verses.push([String(i), `Versículo ${i} do capítulo ${chapter} de ${book} (offline).`]);
  }
  return verses;
}

// ============================================================
// 6. FUNÇÃO DE BUSCA (desativada)
// ============================================================
export async function searchBible() {
  return [];
}