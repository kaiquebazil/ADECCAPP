/** Public WEB adapter. Licensed translations should be fetched through a serverless proxy. */
export const BIBLE_API = { baseUrl: 'https://bible-api.com' };
const englishBooks = { 'Gênesis':'Genesis', 'Êxodo':'Exodus', 'Salmos':'Psalms', 'Provérbios':'Proverbs', 'Isaías':'Isaiah', 'Jeremias':'Jeremiah', 'Ezequiel':'Ezekiel', 'Daniel':'Daniel', 'Mateus':'Matthew', 'Marcos':'Mark', 'Lucas':'Luke', 'João':'John', 'Atos':'Acts', 'Romanos':'Romans', '1 Coríntios':'1 Corinthians', 'Efésios':'Ephesians', 'Filipenses':'Philippians', 'Hebreus':'Hebrews', 'Tiago':'James', 'Apocalipse':'Revelation' };

const fallback = [
  ['16','Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo o que nele crê não pereça, mas tenha a vida eterna.'],
  ['17','Pois Deus enviou o seu Filho ao mundo, não para condenar o mundo, mas para que este fosse salvo por meio dele.'],
  ['18','Quem nele crê não é condenado; mas quem não crê já está condenado, por não crer no nome do Filho unigênito de Deus.']
];
const offlineChapters = {
  'Salmos': [['1','O Senhor é o meu pastor; nada me faltará.'],['2','Ele me faz repousar em pastos verdes e me leva a águas tranquilas.'],['3','Refrigera a minha alma e me guia pelas veredas da justiça por amor do seu nome.']],
  'Romanos': [['1','Portanto, agora nenhuma condenação há para os que estão em Cristo Jesus.'],['2','Porque a lei do Espírito da vida, em Cristo Jesus, me livrou da lei do pecado e da morte.']],
  'Filipenses': [['4','Alegrem-se sempre no Senhor. Novamente direi: alegrem-se!'],['6','Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, apresentem seus pedidos a Deus.']],
  'Gênesis': [['1','No princípio Deus criou os céus e a terra.'],['3','E Deus disse: Haja luz. E houve luz.']],
  'Mateus': [['5','Bem-aventurados os humildes de espírito, pois deles é o Reino dos céus.'],['14','Vocês são a luz do mundo. Não se pode esconder uma cidade construída sobre um monte.']]
};

export async function getChapter(book = 'João', chapter = 3, version = 'web') {
  const ref = `${book} ${chapter}`;
  const apiRef = `${englishBooks[book] || book} ${chapter}`;
  const localVerses = offlineChapters[book] || fallback;
  if (version !== 'web') return { reference: ref, verses: localVerses, source: 'Demonstração offline' };
  try {
    const response = await fetch(`${BIBLE_API.baseUrl}/${encodeURIComponent(apiRef)}?translation=web`);
    if (!response.ok) throw new Error('indisponível');
    const data = await response.json();
    return { reference: ref, verses: data.verses.map(v => [String(v.verse), v.text.trim()]), source: 'WEB · Bible API' };
  } catch { return { reference: ref, verses: localVerses, source: 'Demonstração offline' }; }
}

export async function searchBible(query, version = 'web') {
  if (!query || version !== 'web') return [];
  try { const r = await fetch(`${BIBLE_API.baseUrl}/${encodeURIComponent(query)}?translation=web`); const d = await r.json(); return d.verses || []; } catch { return []; }
}
