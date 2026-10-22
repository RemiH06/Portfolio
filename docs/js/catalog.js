// Constelación de software. Dos vistas (constelación / índice), filtros por
// ícono de tecnología y por status, detalle en overlay. Lee la ruta del JSON
// de <body data-src="...">.

const GITHUB_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.25 3.44 9.68 8.19 11.29.6.11.81-.26.81-.58v-2.06c-3.33.72-4.03-1.61-4.03-1.61-.54-1.36-1.33-1.73-1.33-1.73-1.09-.74.08-.73.08-.73 1.21.09 1.85 1.24 1.85 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.77.42-1.3.76-1.6-2.67-.3-5.46-1.34-5.46-5.97 0-1.32.47-2.4 1.25-3.24-.13-.31-.54-1.56.12-3.25 0 0 1.02-.32 3.34 1.24a11.51 11.51 0 0 1 3.03-.41c1.02 0 2.05.14 3.02.41 2.32-1.56 3.34-1.24 3.34-1.24.67 1.69.25 2.94.12 3.25.78.84 1.25 1.92 1.25 3.24 0 4.64-2.8 5.66-5.48 5.96.43.37.82 1.1.82 2.22v3.28c0 .32.2.69.81.58 4.76-1.61 8.19-6.03 8.19-11.28 0-6.63-5.37-12-12-12z"></path></svg>';

const iconMap = {
  "C#": "devicon-csharp-plain",
  "C++": "devicon-cplusplus-plain",
  Kotlin: "devicon-kotlin-plain",
  PHP: "devicon-php-plain",
  MySQL: "devicon-mysql-plain",
  SQLite: "devicon-sqlite-plain",
  Python: "devicon-python-plain",
  R: "devicon-r-plain",
  JS: "devicon-javascript-plain",
  Dart: "devicon-dart-plain",
  "HTML/CSS": "devicon-html5-plain",
  VS: "devicon-visualstudio-plain",
  "Android Studio": "devicon-androidstudio-plain",
  Gradle: "devicon-gradle-plain",
  XML: "devicon-xml-plain",
  YAML: "devicon-yaml-plain",
  Hexadecimal: "devicon-hex-plain",
  PyCharm: "devicon-pycharm-plain",
  Jupyter: "devicon-jupyter-plain",
  Quarto: "devicon-rstudio-plain",
  playwright: "devicon-playwright-plain",
  FastAPI: "devicon-fastapi-plain",
  selenium: "devicon-selenium-plain",
  Flutter: "devicon-flutter-plain",
  React: "devicon-react-original",
  "Node.js": "devicon-nodejs-plain",
  Airflow: "devicon-apacheairflow-plain",
  Kafka: "devicon-apachekafka-original",
  Docker: "devicon-docker-plain",
  NetworkX: "devicon-networkx-plain",
  Streamlit: "devicon-streamlit-plain",
  "Jetpack Compose": "devicon-jetpackcompose-plain-wordmark",
  Jira: "devicon-jira-plain",
  LaTeX: "devicon-latex-original",
  MatplotLib: "devicon-latex-original",
  Neo4j: "devicon-neo4j-plain",
  pandas: "devicon-pandas-plain",
  plotly: "devicon-plotly-plain",
  postman: "devicon-postman-plain",
  postgreSQL: "devicon-postgresql-plain",
  "Riot Games API": "devicon-openapi-plain",
  Octokit: "devicon-github-plain",
  "YouTube API": "devicon-openapi-plain",
  "Spotify API": "devicon-openapi-plain",
  "Discord API": "devicon-openapi-plain",
  "OpenAI API": "devicon-openapi-plain",
  Overpass: "devicon-openapi-plain",
  "Open-Meteo API": "devicon-openapi-plain",
  TomTom: "devicon-openapi-plain",
  Scikit: "devicon-scikitlearn-plain",
  PyTorch: "devicon-pytorch-original",
  TensorFlow: "devicon-tensorflow-original",
  Keras: "devicon-keras-plain",
  NumPy: "devicon-numpy-plain",
};

// status -> grupo semántico y color rgb (paleta de glow.js)
const STATUS_GROUPS = [
  { key: "activo", label: "Activos", rgb: "83,224,255", match: (s) => /progress|updating/.test(s) },
  { key: "pausa", label: "En pausa", rgb: "253,197,23", match: (s) => /stand|waiting/.test(s) },
  { key: "concluido", label: "Concluidos", rgb: "154,170,180", match: (s) => /concluded|done/.test(s) },
  { key: "muerto", label: "Descontinuados", rgb: "255,59,78", match: (s) => /discontinued|dead/.test(s) },
];
function groupOf(status) {
  const s = (status || "").toLowerCase();
  return STATUS_GROUPS.find((g) => g.match(s)) || STATUS_GROUPS[2];
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function iconClasses(project) {
  const seen = new Set();
  return [...(project.lenguajes || []), ...(project.herramientas || [])]
    .map((name) => iconMap[name])
    .filter((cls) => cls && !seen.has(cls) && seen.add(cls));
}

let projects = [];
const state = { q: "", techs: new Set(), groups: new Set(), view: "constellation" };

const grid = document.getElementById("grid");
const search = document.getElementById("search");
const techBar = document.getElementById("techs");
const statusBar = document.getElementById("statuses");
const countEl = document.getElementById("count");
const overlay = document.getElementById("overlay");
const viewBtns = document.querySelectorAll(".c-view button");

async function load() {
  const res = await fetch(document.body.dataset.src);
  projects = await res.json();
  try {
    const v = localStorage.getItem("sw-view");
    if (v === "index" || v === "constellation") state.view = v;
  } catch (_) {}
  buildTechBar();
  buildStatusBar();
  wire();
  syncViewButtons();
  render();
}

function buildTechBar() {
  // solo lenguajes con ícono, para que la fila no se dispare
  const langs = [...new Set(projects.flatMap((p) => p.lenguajes || []))]
    .filter((l) => iconMap[l])
    .sort();
  techBar.innerHTML = langs
    .map(
      (l) =>
        `<button class="c-tech" type="button" data-tech="${escapeHtml(l)}" aria-pressed="false" aria-label="Filtrar por ${escapeHtml(l)}" title="${escapeHtml(l)}"><i class="${iconMap[l]} colored"></i></button>`
    )
    .join("");
}

function buildStatusBar() {
  statusBar.innerHTML = STATUS_GROUPS.map(
    (g) =>
      `<button class="c-dot" type="button" data-group="${g.key}" style="--g:rgb(${g.rgb})" aria-pressed="false">${g.label}</button>`
  ).join("");
}

function wire() {
  search.addEventListener("input", () => {
    state.q = search.value.trim().toLowerCase();
    render();
  });
  techBar.addEventListener("click", (e) => {
    const b = e.target.closest(".c-tech");
    if (!b) return;
    toggle(state.techs, b.dataset.tech);
    b.setAttribute("aria-pressed", state.techs.has(b.dataset.tech));
    render();
  });
  statusBar.addEventListener("click", (e) => {
    const b = e.target.closest(".c-dot");
    if (!b) return;
    toggle(state.groups, b.dataset.group);
    b.setAttribute("aria-pressed", state.groups.has(b.dataset.group));
    render();
  });
  viewBtns.forEach((b) =>
    b.addEventListener("click", () => {
      state.view = b.dataset.view;
      try { localStorage.setItem("sw-view", state.view); } catch (_) {}
      syncViewButtons();
      render();
    })
  );
  grid.addEventListener("click", (e) => {
    const el = e.target.closest("[data-idx]");
    if (el) openDetail(Number(el.dataset.idx));
  });
  grid.addEventListener("keydown", (e) => {
    const el = e.target.closest("[data-idx]");
    if (el && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      openDetail(Number(el.dataset.idx));
    }
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.closest(".detail-close")) closeDetail();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDetail();
  });
}

function toggle(set, val) {
  set.has(val) ? set.delete(val) : set.add(val);
}

function syncViewButtons() {
  viewBtns.forEach((b) =>
    b.setAttribute("aria-pressed", b.dataset.view === state.view)
  );
}

function filtered() {
  return projects.filter((p) => {
    if (state.groups.size && !state.groups.has(groupOf(p.status).key)) return false;
    if (state.techs.size && !(p.lenguajes || []).some((l) => state.techs.has(l)))
      return false;
    if (state.q) {
      const hay = `${p.nombre} ${p.descripcion} ${(p.lenguajes || []).join(" ")} ${(p.herramientas || []).join(" ")}`.toLowerCase();
      if (!hay.includes(state.q)) return false;
    }
    return true;
  });
}

function render() {
  const list = filtered();
  countEl.textContent = `${list.length} / ${projects.length}`;
  if (!list.length) {
    grid.className = "";
    grid.innerHTML = '<p class="no-results">Ninguna estrella en este cielo.</p>';
    return;
  }
  state.view === "index" ? renderIndex(list) : renderConstellation(list);
}

function renderConstellation(list) {
  grid.className = "constellation";
  grid.innerHTML = list
    .map((p) => {
      const g = groupOf(p.status);
      const icons = iconClasses(p).slice(0, 4);
      const iconsHtml = icons.length
        ? icons.map((c) => `<i class="${c}"></i>`).join("")
        : '<span class="lambda-mark">λ</span>';
      return `
      <article class="node" tabindex="0" role="button" data-idx="${projects.indexOf(p)}"
        style="--g:${g.rgb}" aria-label="${escapeHtml(p.nombre)} · ${escapeHtml(p.status || "")}">
        <div class="node-icons">${iconsHtml}</div>
        <div class="node-name">${escapeHtml(p.nombre)}</div>
        <span class="node-pulse" aria-hidden="true"></span>
      </article>`;
    })
    .join("");
}

function renderIndex(list) {
  grid.className = "index-view";
  grid.innerHTML = STATUS_GROUPS.map((g) => {
    const rows = list.filter((p) => groupOf(p.status).key === g.key);
    if (!rows.length) return "";
    const items = rows
      .map((p) => {
        const icons = iconClasses(p)
          .slice(0, 4)
          .map((c) => `<i class="${c} colored"></i>`)
          .join("");
        return `
        <div class="index-row" tabindex="0" role="button" data-idx="${projects.indexOf(p)}"
          style="--g:${g.rgb}" aria-label="${escapeHtml(p.nombre)}">
          <span class="index-name">${escapeHtml(p.nombre)}</span>
          <span class="index-icons">${icons}</span>
        </div>`;
      })
      .join("");
    return `<section class="index-group" style="--g:${g.rgb}"><h2>${g.label}</h2>${items}</section>`;
  }).join("");
}

function openDetail(idx) {
  const p = projects[idx];
  if (!p) return;
  const g = groupOf(p.status);
  const icons = iconClasses(p).map((c) => `<i class="${c} colored"></i>`).join("");
  const tools = [...(p.lenguajes || []), ...(p.herramientas || [])]
    .map(escapeHtml)
    .join(", ");
  const images = (p.imagenes || [])
    .map(
      (img) => `
      <figure>
        <img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.caption || p.nombre)}" loading="lazy"
          onerror="this.onerror=null;this.style.display='none'">
        ${img.caption ? `<figcaption>${escapeHtml(img.caption)}</figcaption>` : ""}
      </figure>`
    )
    .join("");
  const hasRepo = p.github && p.github !== "https://github.com/RemiH06/";
  const detail = overlay.querySelector(".detail");
  detail.style.setProperty("--g", g.rgb);
  detail.innerHTML = `
    <button class="detail-close" aria-label="Cerrar">&times;</button>
    <h2>${escapeHtml(p.nombre)}</h2>
    <p class="detail-sub">
      <span>Author(s): ${escapeHtml(p.autor || "Hex")}</span>
      <span class="st">${escapeHtml(p.status || "—")}</span>
      ${tools ? `<span>${tools}</span>` : ""}
    </p>
    ${icons ? `<div class="detail-icons">${icons}</div>` : ""}
    <p class="desc">${escapeHtml(p.descripcion)}</p>
    ${images ? `<div class="detail-images">${images}</div>` : ""}
    ${hasRepo ? `<a class="repo-link" href="${escapeHtml(p.github)}" target="_blank" rel="noopener">${GITHUB_SVG}<span>Go to repo</span></a>` : ""}
  `;
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeDetail() {
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}

load();
