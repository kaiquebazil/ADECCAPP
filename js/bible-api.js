/** Public WEB adapter. Licensed translations should be fetched through a serverless proxy. */
export const BIBLE_API = { baseUrl: 'https://bible-api.com' };

const fallback = [
  ['16','Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo o que nele crê não pereça, mas tenha a vida eterna.'],
  ['17','Pois Deus enviou o seu Filho ao mundo, não para condenar o mundo, mas para que este fosse salvo por meio dele.'],
  ['18','Quem nele crê não é condenado; mas quem não crê já está condenado, por não crer no nome do Filho unigênito de Deus.']
];

export async function getChapter(book = 'João', chapter = 3, version = 'web') {
  const ref = `${book} ${chapter}`;
  if (version !== 'web') return { reference: ref, verses: fallback, source: 'Demonstração offline' };
  try {
    const response = await fetch(`${BIBLE_API.baseUrl}/${encodeURIComponent(ref)}?translation=web`);
    if (!response.ok) throw new Error('indisponível');
    const data = await response.json();
    return { reference: data.reference, verses: data.verses.map(v => [String(v.verse), v.text.trim()]), source: 'WEB · Bible API' };
  } catch { return { reference: ref, verses: fallback, source: 'Demonstração offline' }; }
}

export async function searchBible(query, version = 'web') {
  if (!query || version !== 'web') return [];
  try { const r = await fetch(`${BIBLE_API.baseUrl}/${encodeURIComponent(query)}?translation=web`); const d = await r.json(); return d.verses || []; } catch { return []; }
}
