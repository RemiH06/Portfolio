// Catálogo de proyectos: rejilla + filtros + detalle en overlay.
// Reemplaza al "elevador" (scroll panel por panel) para que escale a muchos
// proyectos. Lee la ruta del JSON de <body data-src="...">.

const GITHUB_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.25 3.44 9.68 8.19 11.29.6.11.81-.26.81-.58v-2.06c-3.33.72-4.03-1.61-4.03-1.61-.54-1.36-1.33-1.73-1.33-1.73-1.09-.74.08-.73.08-.73 1.21.09 1.85 1.24 1.85 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.77.42-1.3.76-1.6-2.67-.3-5.46-1.34-5.46-5.97 0-1.32.47-2.4 1.25-3.24-.13-.31-.54-1.56.12-3.25 0 0 1.02-.32 3.34 1.24a11.51 11.51 0 0 1 3.03-.41c1.02 0 2.05.14 3.02.41 2.32-1.56 3.34-1.24 3.34-1.24.67 1.69.25 2.94.12 3.25.78.84 1.25 1.92 1.25 3.24 0 4.64-2.8 5.66-5.48 5.96.43.37.82 1.1.82 2.22v3.28c0 .32.2.69.81.58 4.76-1.61 8.19-6.03 8.19-11.28 0-6.63-5.37-12-12-12z"></path></svg>';

// devicon por lenguaje/herramienta
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

// clasifica el status en una familia de color (robusto a textos largos)
function statusClass(status) {
  const s = (status || "").toLowerCase();
  if (s.includes("progress") || s.includes("updating")) return "status-progress";
  if (s.includes("stand") || s.includes("waiting")) return "status-standby";
  if (s.includes("discontinued") || s.includes("dead")) return "status-dead";
  if (s.includes("concluded") || s.includes("done")) return "status-active";
  return "status-default";
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

function iconClasses(project) {
  const seen = new Set();
  return [...(project.lenguajes || []), ...(project.herramientas || [])]
    .map((name) => iconMap[name])
    .filter((cls) => cls && !seen.has(cls) && seen.add(cls));
}

// estrellas 0–5 con medias; project.ratings opcional
function starsHtml(value) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  let out = "";
  for (let i = 0; i < 5; i++) {
    if (i < full) out += "★";
    else if (i === full && half) out += "⯨";
    else out += '<span class="empty">★</span>';
  }
  return `<span class="stars" title="${value}/5">${out}</span>`;
}

let allProjects = [];
const grid = document.getElementById("grid");
const searchInput = document.getElementById("search");
const statusSel = document.getElementById("statusFilter");
const langSel = document.getElementById("langFilter");
const countEl = document.getElementById("count");

async function load() {
  const src = document.body.dataset.src;
  const res = await fetch(src);
  allProjects = await res.json();
  buildFilters();
  render();
  setupOverlay();
}

function buildFilters() {
  const statuses = [...new Set(allProjects.map((p) => p.status).filter(Boolean))].sort();
  const langs = [
    ...new Set(allProjects.flatMap((p) => p.lenguajes || [])),
  ].sort();
  for (const s of statuses) {
    statusSel.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`);
  }
  for (const l of langs) {
    langSel.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(l)}">${escapeHtml(l)}</option>`);
  }
  [searchInput, statusSel, langSel].forEach((el) =>
    el.addEventListener("input", render)
  );
}

function filtered() {
  const q = searchInput.value.trim().toLowerCase();
  const status = statusSel.value;
  const lang = langSel.value;
  return allProjects.filter((p) => {
    if (status && p.status !== status) return false;
    if (lang && !(p.lenguajes || []).includes(lang)) return false;
    if (q) {
      const hay = `${p.nombre} ${p.descripcion} ${(p.lenguajes || []).join(" ")} ${(p.herramientas || []).join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function render() {
  const list = filtered();
  countEl.textContent = `${list.length} / ${allProjects.length}`;
  if (!list.length) {
    grid.innerHTML = '<p class="no-results">No hay proyectos que coincidan.</p>';
    return;
  }
  grid.innerHTML = list
    .map((p) => {
      const idx = allProjects.indexOf(p);
      const thumb = p.imagenes && p.imagenes.length
        ? `<img class="card-thumb" src="${escapeHtml(p.imagenes[0].src)}" alt="" loading="lazy" onerror="this.onerror=null;this.outerHTML='&lt;div class=&quot;card-thumb placeholder&quot;&gt;&#955;&lt;/div&gt;'">`
        : `<div class="card-thumb placeholder">λ</div>`;
      const icons = iconClasses(p)
        .slice(0, 5)
        .map((c) => `<i class="${c} colored"></i>`)
        .join("");
      const stars = p.ratings && typeof p.ratings.importancia === "number"
        ? starsHtml(p.ratings.importancia)
        : "";
      return `
      <article class="card" tabindex="0" role="button" data-idx="${idx}" aria-label="${escapeHtml(p.nombre)}">
        ${thumb}
        <div class="card-body">
          <h2 class="card-title">${escapeHtml(p.nombre)}</h2>
          <div class="card-icons">${icons}</div>
          <div class="card-meta">
            <span class="status-pill ${statusClass(p.status)}">${escapeHtml(p.status || "—")}</span>
            ${stars}
          </div>
        </div>
      </article>`;
    })
    .join("");
}

// ---- Overlay de detalle ----
const overlay = document.getElementById("detailOverlay");

function setupOverlay() {
  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) openDetail(Number(card.dataset.idx));
  });
  grid.addEventListener("keydown", (e) => {
    const card = e.target.closest(".card");
    if (card && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      openDetail(Number(card.dataset.idx));
    }
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.closest(".detail-close")) closeDetail();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDetail();
  });
}

function openDetail(idx) {
  const p = allProjects[idx];
  if (!p) return;
  const icons = iconClasses(p)
    .map((c) => `<i class="${c} colored"></i>`)
    .join("");
  const tools = [...(p.lenguajes || []), ...(p.herramientas || [])]
    .map(escapeHtml)
    .join(", ");
  const images = (p.imagenes || [])
    .map(
      (img) => `
      <figure>
        <img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.caption || "")}" loading="lazy">
        ${img.caption ? `<figcaption>${escapeHtml(img.caption)}</figcaption>` : ""}
      </figure>`
    )
    .join("");
  overlay.querySelector(".detail").innerHTML = `
    <button class="detail-close" aria-label="Cerrar">&times;</button>
    <h2>${escapeHtml(p.nombre)}</h2>
    <p class="detail-sub">
      <span>Author(s): ${escapeHtml(p.autor || "Hex")}</span>
      <span class="status-pill ${statusClass(p.status)}">${escapeHtml(p.status || "—")}</span>
      ${tools ? `<span>${tools}</span>` : ""}
    </p>
    ${icons ? `<div class="detail-icons">${icons}</div>` : ""}
    <p class="desc">${escapeHtml(p.descripcion)}</p>
    ${images ? `<div class="detail-images">${images}</div>` : ""}
    ${
      p.github && p.github !== "https://github.com/RemiH06/"
        ? `<a class="github-button" href="${escapeHtml(p.github)}" target="_blank" rel="noopener">${GITHUB_SVG}<span>Go to repo</span></a>`
        : ""
    }
  `;
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeDetail() {
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}

load();
