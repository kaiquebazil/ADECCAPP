import { getChapter } from "./bible-api.js";

const $ = (s) => document.querySelector(s);
const store = {
  get(k, fallback) {
    try {
      return JSON.parse(localStorage.getItem("vp_" + k)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(k, v) {
    localStorage.setItem("vp_" + k, JSON.stringify(v));
  },
};
const data = {
  events: [
    {
      id: 1,
      name: "Culto de Celebração",
      date: "27 Jul",
      time: "19:00",
      place: "Templo ADECC",
      cat: "Culto",
      desc: "Uma noite de adoração, Palavra e comunhão.",
    },
    {
      id: 2,
      name: "Conferência Raízes",
      date: "02 Ago",
      time: "09:00",
      place: "Auditório Central",
      cat: "Conferência",
      desc: "Um dia para crescer profundamente na fé.",
    },
    {
      id: 3,
      name: "Ação Solidária no Bairro",
      date: "09 Ago",
      time: "08:30",
      place: "Praça da Esperança",
      cat: "Ação social",
      desc: "Serviço, escuta e cuidado com a nossa comunidade.",
    },
    {
      id: 4,
      name: "Curso de Noivos",
      date: "14 Ago",
      time: "20:00",
      place: "Sala 3",
      cat: "Curso",
      desc: "Conversas que fortalecem a jornada a dois.",
    },
  ],
  projects: [
    {
      id: 1,
      name: "Portas Abertas",
      icon: "◒",
      desc: "Curso de inglês gratuito que amplia horizontes.",
      aud: "Jovens e adultos",
      when: "Terças, 19h",
      lead: "Ana Martins",
    },
    {
      id: 2,
      name: "Conecta",
      icon: "⌘",
      desc: "Aulas de informática para inclusão digital.",
      aud: "Todas as idades",
      when: "Sábados, 10h",
      lead: "Lucas Ribeiro",
    },
    {
      id: 3,
      name: "Som que Abraça",
      icon: "♫",
      desc: "Iniciação musical para crianças da comunidade.",
      aud: "Crianças de 7 a 12",
      when: "Quintas, 16h",
      lead: "Beatriz Costa",
    },
  ],
  ministries: [
    ["Música e louvor", "Servimos conduzindo a igreja em adoração."],
    ["Recepção", "Acolhemos cada pessoa com alegria e cuidado."],
    ["Crianças", "Semeamos fé com criatividade e segurança."],
    ["Mídia", "Contamos histórias que inspiram e aproximam."],
    ["Ação social", "Servimos a cidade com presença e dignidade."],
    ["Intercessão", "Sustentamos a comunidade em oração."],
  ],
  sermons: [
    ["Graça que nos encontra", "Pr. Samuel Azevedo", "Pregação", "42 min"],
    ["A paz em meio ao caminho", "Pra. Marina Alves", "Devocional", "18 min"],
    [
      "Uma igreja para a cidade",
      "Pr. Rafael Nunes",
      "Estudo bíblico",
      "35 min",
    ],
  ],
};
const titles = {
  home: ["Comunidade", "ADECC"],
  bible: ["Palavra que transforma", "Bíblia"],
  agenda: ["Nossa caminhada juntos", "Agenda"],
  prayer: ["Cuidamos uns dos outros", "Pedidos de Oração"],
  menu: ["Tudo em um só lugar", "Menu"],
  sermons: ["Encontre conteúdo para crescer", "Cultos e Pregações"],
  projects: ["Fé que alcança a cidade", "Projetos Sociais"],
  volunteering: ["Servir é fazer parte", "Quero Servir"],
  donations: ["Generosidade com propósito", "Dízimos e Ofertas"],
  profile: ["Sua jornada na comunidade", "Meu Perfil"],
  notifications: ["Fique por dentro", "Notificações"],
  settings: ["Do seu jeito", "Configurações"],
  admin: ["Gestão da comunidade", "Painel administrativo"],
};
let current = "home",
  bibleState = { book: "João", chapter: 3, version: "almeida" },
  bibleRequest = 0;

const chapterCounts = {
  "Gênesis": 50, "Êxodo": 40, "Levítico": 27, "Números": 36, "Deuteronômio": 34,
  "Josué": 24, "Juízes": 21, "Rute": 4, "1 Samuel": 31, "2 Samuel": 24,
  "1 Reis": 22, "2 Reis": 25, "1 Crônicas": 29, "2 Crônicas": 36, "Esdras": 10,
  "Neemias": 13, "Ester": 10, "Jó": 42, "Salmos": 150, "Provérbios": 31,
  "Eclesiastes": 12, "Cantares": 8, "Isaías": 66, "Jeremias": 52, "Lamentações": 5,
  "Ezequiel": 48, "Daniel": 12, "Oséias": 14, "Joel": 3, "Amós": 9,
  "Obadias": 1, "Jonas": 4, "Miquéias": 7, "Naum": 3, "Habacuque": 3,
  "Sofonias": 3, "Ageu": 2, "Zacarias": 14, "Malaquias": 4,
  "Mateus": 28, "Marcos": 16, "Lucas": 24, "João": 21, "Atos": 28,
  "Romanos": 16, "1 Coríntios": 16, "2 Coríntios": 13, "Gálatas": 6,
  "Efésios": 6, "Filipenses": 4, "Colossenses": 4, "1 Tessalonicenses": 5,
  "2 Tessalonicenses": 3, "1 Timóteo": 6, "2 Timóteo": 4, "Tito": 3,
  "Filemom": 1, "Hebreus": 13, "Tiago": 5, "1 Pedro": 5, "2 Pedro": 3,
  "1 João": 5, "2 João": 1, "3 João": 1, "Judas": 1, "Apocalipse": 22
};

const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const button = (label, nav, cl = "btn") =>
  '<button class="' + cl + '" data-nav="' + nav + '">' + label + "</button>";
function toast(msg) {
  const e = document.createElement("div");
  e.className = "toast";
  e.textContent = msg;
  $("#toast-root").append(e);
  setTimeout(() => e.remove(), 3200);
}
function notify(text) {
  let n = store.get("notifications", seedNotifications());
  n.unshift({ id: Date.now(), text, read: false, time: "Agora" });
  store.set("notifications", n);
  badge();
}
function seedNotifications() {
  return [
    {
      id: 1,
      text: "O culto começa em 1 hora.",
      read: false,
      time: "Hoje, 18:00",
    },
    {
      id: 2,
      text: "Novo devocional disponível.",
      read: false,
      time: "Hoje, 08:30",
    },
    {
      id: 3,
      text: "Inscrições para a Conferência Raízes estão abertas.",
      read: false,
      time: "Ontem",
    },
  ];
}
function badge() {
  const n = store
    .get("notifications", seedNotifications())
    .filter((x) => !x.read).length;
  $("#notification-badge").textContent = n;
  $("#notification-badge").style.display = n ? "block" : "none";
}
function modal(title, body) {
  $("#modal-root").innerHTML =
    '<div class="modal-backdrop" data-close><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><h2>' +
    title +
    '</h2><button class="icon-btn" data-close>×</button></div>' +
    body +
    "</section></div>";
}
function closeModal() {
  $("#modal-root").innerHTML = "";
}
function setPage(name) {
  current = name;
  const [kick, title] = titles[name] || titles.home;
  $("#page-kicker").textContent = kick;
  $("#page-title").textContent = title;
  document
    .querySelectorAll("[data-nav]")
    .forEach((x) => x.classList.toggle("active", x.dataset.nav === name));
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function layout(title, sub, body) {
  return (
    "<section><h2>" +
    title +
    '</h2><p class="page-intro">' +
    sub +
    "</p>" +
    body +
    "</section>"
  );
}
function home() {
  return (
    '<section class="hero"><p>Que bom ter você aqui</p><h2>Olá. Há um lugar para você.</h2><p>Vamos caminhar juntos em fé, esperança e amor.</p><div style="margin-top:16px">' +
    button("Assistir ao vivo", "sermons", "btn gold") +
    '</div></section><section class="section"><div class="section-title"><h2>Versículo do dia</h2>' +
    button("Ler na Bíblia", "bible", "link-btn") +
    '</div><article class="card quote">“Alegrem-se na esperança, sejam pacientes na tribulação, perseverem na oração.”<small>Romanos 12:12</small></article></section><section class="section"><div class="section-title"><h2>Acesso rápido</h2></div><div class="grid">' +
    [
      ["✧", "Bíblia", "bible"],
      ["♡", "Oração", "prayer"],
      ["□", "Agenda", "agenda"],
      ["▷", "Pregações", "sermons"],
      ["◒", "Projetos", "projects"],
      ["✦", "Servir", "volunteering"],
      ["◇", "Doações", "donations"],
      ["☰", "Mais", "menu"],
    ]
      .map(
        (x) =>
          '<button class="quick" data-nav="' +
          x[2] +
          '"><span>' +
          x[0] +
          "</span>" +
          x[1] +
          "</button>",
      )
      .join("") +
    '</div></section><section class="section"><div class="section-title"><h2>Próximo culto</h2>' +
    button("Agenda", "agenda", "link-btn") +
    '</div><article class="card event"><div class="date-box">JUL<b>27</b></div><div><span class="pill">Culto presencial</span><h3 style="margin:5px 0">Culto de Celebração</h3><p class="meta">19:00 · Templo ADECC</p></div></article></section><section class="section"><article class="hero"><p>Campanha do mês</p><h2>Uma mesa para todos</h2><p>Doe alimentos e ajude a transformar encontros em cuidado.</p>' +
    button("Conhecer projeto", "projects", "btn gold") +
    "</article></section>"
  );
}
function agenda() {
  return layout(
    "Agenda da igreja",
    "Encontros que fazem a nossa comunidade florescer.",
    '<div class="toolbar"><button class="filter active" data-filter="all">Todos</button>' +
      ["Culto", "Conferência", "Ação social", "Curso"]
        .map(
          (x) =>
            '<button class="filter" data-filter="' + x + '">' + x + "</button>",
        )
        .join("") +
      '</div><div class="toolbar"><button class="filter active" data-view="list">Lista</button><button class="filter" data-view="calendar">Calendário</button></div><div id="agenda-view"><div class="list" id="event-list">' +
      eventCards(data.events) +
      "</div></div>",
  );
}
function eventCards(events) {
  return events.length
    ? events
        .map(
          (e) =>
            '<article class="card event"><div class="date-box">' +
            e.date.slice(0, 3).toUpperCase() +
            "<b>" +
            e.date.slice(-2) +
            '</b></div><div style="flex:1"><span class="pill">' +
            e.cat +
            '</span><h3 style="margin:4px 0">' +
            e.name +
            '</h3><p class="meta">' +
            e.time +
            " · " +
            e.place +
            '</p><button class="link-btn" data-event="' +
            e.id +
            '">Ver detalhes e inscrição</button></div></article>',
        )
        .join("")
    : '<div class="empty">Nenhum evento nesta categoria.</div>';
}
function calendarView() {
  const dates = {
    27: data.events[0],
    2: data.events[1],
    9: data.events[2],
    14: data.events[3],
  };
  return (
    '<div class="card"><h3>Agosto 2026</h3><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-top:12px">' +
    ["D", "S", "T", "Q", "Q", "S", "S"]
      .map(
        (x) =>
          '<b style="text-align:center;color:var(--muted);font-size:.72rem">' +
          x +
          "</b>",
      )
      .join("") +
    Array.from({ length: 35 }, (_, i) => {
      const day = i - 5;
      const event = dates[day];
      return (
        '<button style="min-height:43px;border:0;border-radius:10px;background:' +
        (event ? "var(--soft)" : "transparent") +
        ';color:var(--ink);font:inherit;cursor:pointer" ' +
        (event ? 'data-event="' + event.id + '"' : "") +
        ">" +
        (day > 0 && day <= 31 ? day : "") +
        (event
          ? '<small style="display:block;font-size:.48rem">' +
            event.cat +
            "</small>"
          : "") +
        "</button>"
      );
    }).join("") +
    "</div></div>"
  );
}
function prayer() {
  const requests = store.get("prayers", []).filter((p) => p.public);
  return layout(
    "Pedidos de oração",
    "Compartilhe o que está no seu coração. Estaremos com você em oração.",
    '<button class="btn" data-action="new-prayer">Fazer um pedido de oração</button><section class="section"><div class="section-title"><h2>Orando juntos</h2></div><div class="list">' +
      (requests.length
        ? requests
            .map(
              (p) =>
                '<article class="card public-prayer"><div><span class="pill">' +
                esc(p.category) +
                '</span><p style="margin-top:7px">' +
                esc(p.text) +
                '</p><small class="meta">— ' +
                esc(p.anonymous ? "Pedido anônimo" : p.name) +
                '</small></div><button class="btn secondary" data-pray="' +
                p.id +
                '">🙏 <span>' +
                p.prayers +
                "</span></button></article>",
            )
            .join("")
        : '<div class="card empty">Seja o primeiro a compartilhar um pedido público. Você não está só.</div>') +
      "</div></section>",
  );
}
function bible() {
  const old = [
    "Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio",
    "Josué", "Juízes", "Rute", "1 Samuel", "2 Samuel",
    "1 Reis", "2 Reis", "1 Crônicas", "2 Crônicas",
    "Esdras", "Neemias", "Ester", "Jó", "Salmos", "Provérbios",
    "Eclesiastes", "Cantares", "Isaías", "Jeremias", "Lamentações",
    "Ezequiel", "Daniel", "Oséias", "Joel", "Amós", "Obadias",
    "Jonas", "Miquéias", "Naum", "Habacuque", "Sofonias",
    "Ageu", "Zacarias", "Malaquias"
  ];
  const newer = [
    "Mateus", "Marcos", "Lucas", "João", "Atos",
    "Romanos", "1 Coríntios", "2 Coríntios", "Gálatas",
    "Efésios", "Filipenses", "Colossenses", "1 Tessalonicenses",
    "2 Tessalonicenses", "1 Timóteo", "2 Timóteo", "Tito",
    "Filemom", "Hebreus", "Tiago", "1 Pedro", "2 Pedro",
    "1 João", "2 João", "3 João", "Judas", "Apocalipse"
  ];
  const books =
    '<optgroup label="Antigo Testamento">' +
    old
      .map(
        (x) =>
          "<option " +
          (x === bibleState.book ? "selected" : "") +
          ">" +
          x +
          "</option>",
      )
      .join("") +
    '</optgroup><optgroup label="Novo Testamento">' +
    newer
      .map(
        (x) =>
          "<option " +
          (x === bibleState.book ? "selected" : "") +
          ">" +
          x +
          "</option>",
      )
      .join("") +
    "</optgroup>";
  const chapters = Array.from(
    { length: chapterCounts[bibleState.book] || 50 },
    (_, i) =>
      '<option value="' +
      (i + 1) +
      '" ' +
      (i + 1 === bibleState.chapter ? "selected" : "") +
      ">Capítulo " +
      (i + 1) +
      "</option>",
  ).join("");
  return layout(
    "Bíblia",
    "Leia, guarde e volte à Palavra sempre que precisar.",
    '<div class="reader-controls"><select id="bible-book" aria-label="Livro da Bíblia">' +
      books +
      '</select><select id="bible-chapter" aria-label="Capítulo">' +
      chapters +
      '</select><select id="bible-version" aria-label="Versão"><option value="nvi">NVI</option><option value="ara">ARA</option><option value="acf">ACF</option><option value="apee">APEE</option></select></div><section class="section"><div id="reader" class="card bible-reader"><div class="skeleton"></div></div><div class="verse-actions"><button class="btn secondary" data-action="prev-chapter">← Capítulo</button><button class="btn secondary" data-action="next-chapter">Próximo →</button><button class="btn" data-action="bible-notes">Favoritos e notas</button></div></section>',
  );
}
function sermons() {
  return layout(
    "Cultos e Pregações",
    "Palavras para acompanhar sua semana.",
    '<div class="toolbar"><button class="filter active">Todos</button><button class="filter">Pregações</button><button class="filter">Devocionais</button><button class="filter">Áudios</button></div><div class="list">' +
      data.sermons
        .map(
          (s, i) =>
            '<article class="card media-card"><div class="cover">▷</div><div class="card-body"><span class="pill">' +
            s[2] +
            '</span><h3 style="margin:6px 0">' +
            s[0] +
            '</h3><p class="meta">' +
            s[1] +
            " · " +
            s[3] +
            '</p><button class="btn" style="margin-top:12px" data-watch="' +
            i +
            '">Assistir</button></div></article>',
        )
        .join("") +
      "</div>",
  );
}
function projects() {
  return layout(
    "Projetos Sociais",
    "Conheça iniciativas que unem talento, cuidado e oportunidade.",
    '<div class="list">' +
      data.projects
        .map(
          (p) =>
            '<article class="card project-card"><div class="cover">' +
            p.icon +
            '</div><div class="card-body"><h3>' +
            p.name +
            '</h3><p class="meta" style="margin:6px 0">' +
            p.desc +
            "</p><p><b>Público:</b> " +
            p.aud +
            "<br><b>Quando:</b> " +
            p.when +
            "<br><b>Responsável:</b> " +
            p.lead +
            '</p><button class="btn" data-project="' +
            p.id +
            '">Quero participar</button></div></article>',
        )
        .join("") +
      "</div>",
  );
}
function volunteering() {
  return layout(
    "Quero Servir",
    "Cada dom encontra um lugar quando servimos juntos.",
    '<div class="list">' +
      data.ministries
        .map(
          (m, i) =>
            '<article class="card"><h3>' +
            m[0] +
            '</h3><p class="meta" style="margin:6px 0 10px">' +
            m[1] +
            '</p><button class="btn secondary" data-ministry="' +
            i +
            '">Tenho interesse</button></article>',
        )
        .join("") +
      "</div>",
  );
}
function donations() {
  return layout(
    "Dízimos e Ofertas",
    "Sua generosidade sustenta pessoas, projetos e esperança.",
    '<article class="hero"><p>Uma oferta com propósito</p><h2>Compartilhe o que Deus colocou em suas mãos.</h2></article><section class="section"><div class="card"><h3>PIX ADECC</h3><p class="meta">Chave aleatória · Banco do Brasil</p><p id="pix-key">vida.plena@exemplo.org</p><button class="btn" data-action="copy-pix">Copiar chave PIX</button><button class="btn secondary" data-action="show-qr">Ver QR Code</button></div></section><p class="meta">Demonstração: pagamentos reais devem ser iniciados por um gateway em servidor seguro.</p>',
  );
}
function profile() {
  const u = store.get("profile", {
    name: "Kaique Bazil",
    email: "kaique@exemplo.com",
    phone: "(21) 977297049",
    birth: "14/11/2003",
  });
  const favorites = store.get("favorites", []).length;
  return layout(
    "Meu Perfil",
    "Sua história na ADECC.",
    '<article class="card" style="text-align:center"><div style="font-size:3rem">◉</div><h2>' +
      u.name +
      '</h2><p class="meta">' +
      u.email +
      "<br>" +
      u.phone +
      '</p><button class="link-btn" data-action="edit-profile">Editar perfil</button></article><section class="section"><div class="grid stats"><div class="card stat"><b>' +
      store.get("events", []).length +
      '</b>Eventos</div><div class="card stat"><b>' +
      store.get("prayers", []).length +
      '</b>Pedidos</div><div class="card stat"><b>' +
      favorites +
      '</b>Favoritos</div><div class="card stat"><b>' +
      store.get("volunteers", []).length +
      "</b>Serviços</div></div></section>",
  );
}
function notifications() {
  let n = store.get("notifications", seedNotifications());
  return layout(
    "Notificações",
    "Novidades e lembretes da sua comunidade.",
    '<button class="link-btn" data-action="read-all">Marcar todas como lidas</button><div class="list section">' +
      n
        .map(
          (x) =>
            '<article class="card" style="' +
            (x.read ? "opacity:.65" : "border-color:#9fc6b5") +
            '"><h3>' +
            x.text +
            '</h3><p class="meta">' +
            x.time +
            (x.read ? " · Lida" : " · Nova") +
            "</p></article>",
        )
        .join("") +
      "</div>",
  );
}
function settings() {
  const prefs = store.get("prefs", { dark: false, size: 17 });
  return layout(
    "Configurações",
    "Ajuste sua experiência no aplicativo.",
    '<div class="list"><label class="card check">Tema preto <input type="checkbox" id="dark-mode" ' +
      (prefs.dark ? "checked" : "") +
      '></label><p class="meta">Use um visual preto profundo, confortável para leituras à noite.</p><label class="card">Tamanho da fonte da Bíblia <input type="range" id="font-size" min="15" max="24" value="' +
      prefs.size +
      '"></label><label class="card check">Receber lembretes de cultos <input type="checkbox" checked></label><button class="menu-item">Privacidade <span>›</span></button><button class="menu-item">Termos de uso <span>›</span></button></div>',
  );
}
function admin() {
  return layout(
    "Painel administrativo",
    "Visão demonstrativa de conteúdos e participação.",
    '<section class="hero admin-hero"><p>Visão geral</p><h2>Bom dia, administração.</h2></section><section class="section"><div class="grid stats">' +
      [
        ["Membros", "1.248"],
        ["Pedidos", "86"],
        ["Inscrições", "214"],
        ["Voluntários", "97"],
      ]
        .map(
          (x) => '<div class="card stat"><b>' + x[1] + "</b>" + x[0] + "</div>",
        )
        .join("") +
      '</div></section><section class="section"><div class="card"><h3>Engajamento semanal</h3><div class="chart">' +
      [55, 85, 42, 70, 95, 65, 78]
        .map((x) => '<i class="bar" style="height:' + x + '%"></i>')
        .join("") +
      '</div></div></section><section class="section"><div class="menu-list">' +
      [
        "Usuários",
        "Eventos",
        "Cultos e pregações",
        "Pedidos de oração",
        "Projetos sociais",
        "Banners da Home",
      ]
        .map(
          (x) =>
            '<button class="menu-item"><span>◈</span>' +
            x +
            "<small>Pronto para conectar ao painel real</small></button>",
        )
        .join("") +
      "</div></section>",
  );
}
function menu() {
  return layout(
    "Menu",
    "Encontre tudo que faz parte da ADECC.",
    '<div class="menu-list">' +
      [
        ["▷", "Cultos e Pregações", "Conteúdos para sua jornada", "sermons"],
        ["◒", "Projetos Sociais", "Impacto que alcança a cidade", "projects"],
        ["✦", "Quero Servir", "Use seus dons", "volunteering"],
        ["◇", "Dízimos e Ofertas", "Generosidade com propósito", "donations"],
        ["◉", "Meu Perfil", "Sua jornada", "profile"],
        ["♧", "Notificações", "Novidades da comunidade", "notifications"],
        ["⚙", "Configurações", "Ajustes e preferências", "settings"],
        ["▦", "Painel administrativo", "Demonstração de gestão", "admin"],
      ]
        .map(
          (x) =>
            '<button class="menu-item" data-nav="' +
            x[3] +
            '"><span>' +
            x[0] +
            "</span><div>" +
            x[1] +
            "<small>" +
            x[2] +
            "</small></div></button>",
        )
        .join("") +
      "</div>",
  );
}
function render() {
  const views = {
    home,
    agenda,
    prayer,
    bible,
    sermons,
    projects,
    volunteering,
    donations,
    profile,
    notifications,
    settings,
    admin,
    menu,
  };
  $("#app-content").innerHTML = (views[current] || home)();
  if (current === "bible") loadBible();
}
async function loadBible() {
  const reader = $("#reader");
  if (!reader) return;
  const request = ++bibleRequest;
  reader.innerHTML = '<div class="skeleton"></div>';
  const d = await getChapter(
    bibleState.book,
    bibleState.chapter,
    bibleState.version,
  );
  if (request !== bibleRequest) return;
  
  // Garantir que verses é um array
  const verses = Array.isArray(d.verses) ? d.verses : [];
  if (verses.length === 0) {
    reader.innerHTML = '<div class="empty">Nenhum versículo encontrado para este capítulo.</div>';
    return;
  }
  
  const fav = store.get("favorites", []);
  reader.innerHTML =
    '<p class="meta">' +
    d.reference +
    " · " +
    d.source +
    "</p>" +
    verses
      .map(
        (v) =>
          '<p class="verse" data-verse="' +
          esc(d.reference + ":" + v[0]) +
          '"><sup>' +
          v[0] +
          "</sup>" +
          esc(v[1]) +
          "</p>",
      )
      .join("");
  store.set(
    "history",
    [
      d.reference,
      ...store.get("history", []).filter((x) => x !== d.reference),
    ].slice(0, 20),
  );
}
function eventModal(id) {
  const e = data.events.find((x) => x.id === +id);
  modal(
    e.name,
    '<p class="meta">' +
      e.date +
      " · " +
      e.time +
      " · " +
      e.place +
      '</p><p style="margin:15px 0">' +
      e.desc +
      '</p><button class="btn" data-action="register-event" data-id="' +
      e.id +
      '">Confirmar inscrição</button>',
  );
}
function prayerModal() {
  modal(
    "Novo pedido de oração",
    '<form id="prayer-form" class="form-grid"><label>Nome<input name="name" required></label><label>Categoria<select name="category">' +
      [
        "Família",
        "Saúde",
        "Vida espiritual",
        "Trabalho",
        "Finanças",
        "Relacionamentos",
        "Outros",
      ]
        .map((x) => "<option>" + x + "</option>")
        .join("") +
      '</select></label><label>Seu pedido<textarea name="text" required placeholder="Escreva com liberdade; estaremos com você."></textarea></label><label class="check"><input name="anonymous" type="checkbox"> Enviar anonimamente</label><label class="check"><input name="public" type="checkbox"> Tornar público para receber oração</label><button class="btn">Enviar pedido</button></form>',
  );
}
function interestModal(type, id) {
  const name =
    type === "ministry"
      ? data.ministries[id][0]
      : data.projects.find((x) => x.id === +id).name;
  modal(
    "Quero participar",
    "<p>Que alegria! Conte-nos um pouco sobre sua disponibilidade para <b>" +
      name +
      '</b>.</p><form id="interest-form" class="form-grid" style="margin-top:14px"><input type="hidden" name="area" value="' +
      name +
      '"><label>Nome<input name="name" required></label><label>Telefone<input name="phone" required></label><label>Horários disponíveis<input name="time" placeholder="Ex.: sábados pela manhã" required></label><button class="btn">Enviar interesse</button></form>',
  );
}
function handleClick(e) {
  const nav = e.target.closest("[data-nav]");
  if (nav) {
    setPage(nav.dataset.nav);
    return;
  }
  // Fecha somente ao tocar no botão X ou no fundo, nunca no conteúdo do modal.
  if (
    e.target.dataset.close !== undefined ||
    e.target.classList.contains("modal-backdrop")
  )
    return closeModal();
  const act = e.target.dataset.action;
  if (act === "new-prayer") prayerModal();
  if (act === "register-event") {
    let a = store.get("events", []);
    if (!a.includes(+e.target.dataset.id)) a.push(+e.target.dataset.id);
    store.set("events", a);
    closeModal();
    notify("Inscrição confirmada. Esperamos você!");
    toast("Inscrição confirmada!");
  }
  if (act === "copy-pix") {
    navigator.clipboard?.writeText($("#pix-key").textContent);
    toast("Chave PIX copiada.");
  }
  if (act === "show-qr")
    modal(
      "QR Code PIX",
      '<div class="card" style="text-align:center;font-size:8rem">▦</div><p class="meta" style="margin-top:10px">QR demonstrativo. Integre um gateway para gerar cobranças reais.</p>',
    );
  if (act === "read-all") {
    store.set(
      "notifications",
      store
        .get("notifications", seedNotifications())
        .map((n) => ({ ...n, read: true })),
    );
    badge();
    render();
  }
  if (act === "prev-chapter") {
    bibleState.chapter = Math.max(1, bibleState.chapter - 1);
    loadBible();
  }
  if (act === "next-chapter") {
    bibleState.chapter++;
    loadBible();
  }
  if (act === "bible-notes")
    modal(
      "Minhas anotações",
      '<div class="empty">Toque em um versículo para salvar uma anotação ou favorito.</div>',
    );
  // CORREÇÃO: removi o '}' extra que estava aqui
  if (act === "edit-profile")
    modal(
      "Editar perfil",
      '<form id="profile-form" class="form-grid"><label>Nome<input name="name" value="' +
        store.get("profile", {}).name +
        '"></label><label>E-mail<input name="email" value="' +
        store.get("profile", {}).email +
        '"></label><label>Telefone<input name="phone" value="' +
        store.get("profile", {}).phone +
        '"></label><button class="btn">Salvar</button></form>',
    );
  if (e.target.dataset.event) eventModal(e.target.dataset.event);
  if (e.target.dataset.pray) {
    let p = store.get("prayers", []);
    let x = p.find((x) => x.id === +e.target.dataset.pray);
    if (x) {
      x.prayers++;
      store.set("prayers", p);
      render();
      toast("Obrigado por orar!");
    }
  }
  if (e.target.dataset.project)
    interestModal("project", e.target.dataset.project);
  if (e.target.dataset.ministry)
    interestModal("ministry", e.target.dataset.ministry);
  if (e.target.dataset.watch)
    modal(
      "Reprodução",
      '<div class="cover" style="height:230px">▷</div><p style="margin-top:14px">Demonstração de player. Conecte aqui vídeos do YouTube, Instagram, Facebook ou servidor próprio.</p>',
    );
  if (e.target.closest(".verse")) verseModal(e.target.closest(".verse"));
}
function verseModal(el) {
  const ref = el.dataset.verse;
  modal(
    ref,
    "<p>" +
      el.textContent.replace(/^\d+/, "") +
      '</p><div class="verse-actions"><button class="btn" data-favorite="' +
      esc(ref) +
      '">Favoritar</button><button class="btn secondary" data-share="' +
      esc(ref) +
      '">Compartilhar</button></div><form id="note-form" class="form-grid" style="margin-top:12px"><input type="hidden" name="ref" value="' +
      esc(ref) +
      '"><textarea name="note" placeholder="Sua anotação pessoal"></textarea><button class="link-btn">Salvar anotação</button></form>',
  );
}
function bibleLibrary() {
  const notes = store.get("notes", []),
    favorites = store.get("favorites", []),
    history = store.get("history", []);
  modal(
    "Sua biblioteca",
    '<div class="list"><article class="card"><h3>Favoritos</h3><p class="meta">' +
      (favorites.length
        ? favorites.map(esc).join("<br>")
        : "Nenhum versículo favoritado ainda.") +
      '</p></article><article class="card"><h3>Anotações</h3><p class="meta">' +
      (notes.length
        ? notes
            .map((n) => "<b>" + esc(n.ref) + "</b>: " + esc(n.note))
            .join("<br><br>")
        : "Nenhuma anotação salva ainda.") +
      '</p></article><article class="card"><h3>Histórico de leitura</h3><p class="meta">' +
      (history.length
        ? history.map(esc).join(" · ")
        : "Seu histórico aparecerá aqui.") +
      "</p></article></div>",
  );
}
function handleSubmit(e) {
  e.preventDefault();
  const f = e.target,
    fd = Object.fromEntries(new FormData(f));
  if (f.id === "prayer-form") {
    let p = store.get("prayers", []);
    p.unshift({
      id: Date.now(),
      name: fd.name,
      text: fd.text,
      category: fd.category,
      anonymous: !!f.anonymous.checked,
      public: !!f.public.checked,
      prayers: 0,
    });
    store.set("prayers", p);
    closeModal();
    notify("Seu pedido de oração foi recebido com carinho.");
    toast("Recebemos seu pedido. Estamos com você.");
    render();
  }
  if (f.id === "interest-form") {
    let a = store.get("volunteers", []);
    a.push(fd);
    store.set("volunteers", a);
    closeModal();
    toast("Recebemos seu interesse. Em breve falaremos com você!");
  }
  if (f.id === "profile-form") {
    store.set("profile", fd);
    closeModal();
    render();
    toast("Perfil atualizado.");
  }
  if (f.id === "note-form") {
    let a = store.get("notes", []);
    a.push(fd);
    store.set("notes", a);
    toast("Anotação salva.");
    closeModal();
  }
}
document.addEventListener("click", handleClick);
document.addEventListener("submit", handleSubmit);
document.addEventListener("change", (e) => {
  if (
    e.target.id === "bible-book" ||
    e.target.id === "bible-chapter" ||
    e.target.id === "bible-version"
  ) {
    bibleState.book = $("#bible-book").value;
    bibleState.chapter = +$("#bible-chapter").value;
    bibleState.version = $("#bible-version").value;
    if (bibleState.chapter > (chapterCounts[bibleState.book] || 50))
      bibleState.chapter = 1;
    if (e.target.id === "bible-book") {
      render();
      return;
    }
    loadBible();
  }
  if (e.target.id === "dark-mode") {
    let p = store.get("prefs", {});
    p.dark = e.target.checked;
    store.set("prefs", p);
    document.body.classList.toggle("dark", p.dark);
  }
  if (e.target.id === "font-size") {
    let p = store.get("prefs", {});
    p.size = e.target.value;
    store.set("prefs", p);
    document.documentElement.style.setProperty("--bible-size", p.size + "px");
  }
});
document.addEventListener("click", (e) => {
  if (e.target.dataset.filter) {
    document
      .querySelectorAll("[data-filter]")
      .forEach((x) => x.classList.toggle("active", x === e.target));
    $("#event-list").innerHTML = eventCards(
      e.target.dataset.filter === "all"
        ? data.events
        : data.events.filter((x) => x.cat === e.target.dataset.filter),
    );
  }
  if (e.target.dataset.favorite) {
    let f = store.get("favorites", []);
    if (!f.includes(e.target.dataset.favorite))
      f.push(e.target.dataset.favorite);
    store.set("favorites", f);
    toast("Versículo favoritado.");
    closeModal();
  }
  if (e.target.dataset.share) {
    navigator
      .share?.({ title: e.target.dataset.share, text: e.target.dataset.share })
      .catch(() => {});
    toast("Referência pronta para compartilhar.");
  }
});
const prefs = store.get("prefs", { dark: false, size: 17 });
document.body.classList.toggle("dark", prefs.dark);
document.documentElement.style.setProperty("--bible-size", prefs.size + "px");
badge();
render();
if ("serviceWorker" in navigator)
  navigator.serviceWorker.register("./service-worker.js");