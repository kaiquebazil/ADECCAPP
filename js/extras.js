// Complementos de interface independentes: mantém os dados pessoais visíveis e persistentes.
const get = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem("vp_" + key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
document.addEventListener("click", (event) => {
  if (event.target.dataset.action !== "bible-notes") return;
  const notes = get("notes", []),
    favorites = get("favorites", []),
    history = get("history", []);
  document.querySelector("#modal-root").innerHTML =
    '<div class="modal-backdrop" data-close><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><h2>Sua biblioteca</h2><button class="icon-btn" data-close>×</button></div><div class="list"><article class="card"><h3>Favoritos</h3><p class="meta">' +
    (favorites.length
      ? favorites.map(esc).join("<br>")
      : "Nenhum versículo favoritado ainda.") +
    '</p></article><article class="card"><h3>Anotações</h3><p class="meta">' +
    (notes.length
      ? notes
          .map((note) => "<b>" + esc(note.ref) + "</b>: " + esc(note.note))
          .join("<br><br>")
      : "Nenhuma anotação salva ainda.") +
    '</p></article><article class="card"><h3>Histórico de leitura</h3><p class="meta">' +
    (history.length
      ? history.map(esc).join(" · ")
      : "Seu histórico aparecerá aqui.") +
    "</p></article></div></section></div>";
});
document.addEventListener("click", (event) => {
  const view = event.target.dataset.view;
  const target = document.querySelector("#agenda-view");
  if (!view || !target) return;
  document
    .querySelectorAll("[data-view]")
    .forEach((button) =>
      button.classList.toggle("active", button === event.target),
    );
  if (view === "calendar") {
    const cells = Array.from({ length: 35 }, (_, index) => {
      const day = index - 5;
      const event = {
        2: ["2", "Conferência", 2],
        9: ["9", "Ação social", 3],
        14: ["14", "Curso", 4],
        27: ["27", "Culto", 1],
      }[day];
      return (
        '<button style="min-height:43px;border:0;border-radius:10px;background:' +
        (event ? "var(--soft)" : "transparent") +
        ';color:var(--ink);font:inherit;cursor:pointer" ' +
        (event ? 'data-event="' + event[2] + '"' : "") +
        ">" +
        (day > 0 && day < 32 ? day : "") +
        (event
          ? '<small style="display:block;font-size:.48rem">' +
            event[1] +
            "</small>"
          : "") +
        "</button>"
      );
    }).join("");
    target.innerHTML =
      '<div class="card"><h3>Agosto 2026</h3><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-top:12px">' +
      ["D", "S", "T", "Q", "Q", "S", "S"]
        .map(
          (day) =>
            '<b style="text-align:center;color:var(--muted);font-size:.72rem">' +
            day +
            "</b>",
        )
        .join("") +
      cells +
      "</div></div>";
  } else {
    target.innerHTML =
      '<div class="list" id="event-list"><article class="card event"><div class="date-box">JUL<b>27</b></div><div><span class="pill">Culto</span><h3>Culto de Celebração</h3><button class="link-btn" data-event="1">Ver detalhes e inscrição</button></div></article><article class="card event"><div class="date-box">AGO<b>02</b></div><div><span class="pill">Conferência</span><h3>Conferência Raízes</h3><button class="link-btn" data-event="2">Ver detalhes e inscrição</button></div></article><article class="card event"><div class="date-box">AGO<b>09</b></div><div><span class="pill">Ação social</span><h3>Ação Solidária no Bairro</h3><button class="link-btn" data-event="3">Ver detalhes e inscrição</button></div></article><article class="card event"><div class="date-box">AGO<b>14</b></div><div><span class="pill">Curso</span><h3>Curso de Noivos</h3><button class="link-btn" data-event="4">Ver detalhes e inscrição</button></div></article></div>';
  }
});
