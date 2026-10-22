// Software: categorías como pestañas, un riel con todos los proyectos de la
// categoría (el más reciente primero) y una ficha grande a la vez, para que
// ningún proyecto se quede atrás. Ruta en el hash: #categoria/proyecto.
// Fondo: nebulosa gris (shader WebGL vanilla) sobre la base negra de CSS.

const GITHUB_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.25 3.44 9.68 8.19 11.29.6.11.81-.26.81-.58v-2.06c-3.33.72-4.03-1.61-4.03-1.61-.54-1.36-1.33-1.73-1.33-1.73-1.09-.74.08-.73.08-.73 1.21.09 1.85 1.24 1.85 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.77.42-1.3.76-1.6-2.67-.3-5.46-1.34-5.46-5.97 0-1.32.47-2.4 1.25-3.24-.13-.31-.54-1.56.12-3.25 0 0 1.02-.32 3.34 1.24a11.51 11.51 0 0 1 3.03-.41c1.02 0 2.05.14 3.02.41 2.32-1.56 3.34-1.24 3.34-1.24.67 1.69.25 2.94.12 3.25.78.84 1.25 1.92 1.25 3.24 0 4.64-2.8 5.66-5.48 5.96.43.37.82 1.1.82 2.22v3.28c0 .32.2.69.81.58 4.76-1.61 8.19-6.03 8.19-11.28 0-6.63-5.37-12-12-12z"></path></svg>';

// Octicons (MIT): star-16, repo-forked-16 y book-24
const BOOK_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M0 3.75A.75.75 0 0 1 .75 3h7.497c1.566 0 2.945.8 3.751 2.014A4.495 4.495 0 0 1 15.75 3h7.5a.75.75 0 0 1 .75.75v15.063a.752.752 0 0 1-.755.75l-7.682-.052a3 3 0 0 0-2.142.878l-.89.891a.75.75 0 0 1-1.061 0l-.902-.901a2.996 2.996 0 0 0-2.121-.879H.75a.75.75 0 0 1-.75-.75Zm12.75 15.232a4.503 4.503 0 0 1 2.823-.971l6.927.047V4.5h-6.75a3 3 0 0 0-3 3ZM11.247 7.497a3 3 0 0 0-3-2.997H1.5V18h6.947c1.018 0 2.006.346 2.803.98Z"></path></svg>';
const STAR_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path></svg>';
const FORK_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path></svg>';

// SVG `original` de devicon: la fuente de devicon pinta un solo color por glifo,
// el SVG trae los colores reales de cada logo. Verificar con tools/check_icons.js
const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons";
const iconMap = {
  "C#": "csharp", ".NET": "dotnetcore", Kotlin: "kotlin", PHP: "php",
  MySQL: "mysql", SQLite: "sqlite", Python: "python", R: "r",
  JS: "javascript", TypeScript: "typescript", Rust: "rust", Haskell: "haskell",
  Elixir: "elixir", Dart: "dart", "HTML/CSS": "html5", "Visual Studio": "visualstudio",
  "Android Studio": "androidstudio", Gradle: "gradle",
  "Jetpack Compose": "jetpackcompose", "Compose Multiplatform": "jetpackcompose",
  Jupyter: "jupyter", Playwright: "playwright", Selenium: "selenium", FastAPI: "fastapi",
  Flutter: "flutter", React: "react", Vite: "vitejs", D3: "d3js",
  "Three.js": "threejs", Tailwind: "tailwindcss", "Phoenix LiveView": "phoenix",
  PostgreSQL: "postgresql", "Node.js": "nodejs", "GitHub Actions": "githubactions",
  Airflow: "apacheairflow", Kafka: "apachekafka", Docker: "docker", NetworkX: "networkx",
  pandas: "pandas", Plotly: "plotly", Octokit: "github", "scikit-learn": "scikitlearn",
  PyTorch: "pytorch", TensorFlow: "tensorflow", OpenCV: "opencv", Kaggle: "kaggle",
  pytest: "pytest",
};
const iconUrl = (name) => `${DEVICON}/${name}/${name}-original.svg`;

// logos que se pierden en el negro: los negros se invierten, los oscuros se aclaran sin perder su color
const iconTone = {
  Rust: "invert", "Three.js": "invert", Kafka: "invert", Octokit: "invert",
  MySQL: "lift", Gradle: "lift", Haskell: "lift", pandas: "lift-max",
};

// lo que devicon no tiene: archivos en img/icons (Simple Icons, Iconify, logos oficiales)
const localIcons = {
  Neo4j: "neo4j.svg", // el SVG de devicon trae el logo diminuto dentro de un lienzo enorme
  Leaflet: "leaflet.svg", Quarto: "quarto.svg", "Ray RLlib": "ray.svg",
  "Spotify API": "spotify.svg", "YouTube API": "youtube.svg", "Riot Games API": "riotgames.svg",
  WebGL: "webgl.svg", esbuild: "esbuild.svg", YOLO: "ultralytics.svg", timm: "huggingface.svg",
  "anime.js": "animedotjs.svg", "discord.py": "discord.svg", pynvml: "nvidia.svg",
  "OpenAI API": "openai.svg", "Outlook (pywin32)": "outlook.svg", Cabal: "cabal.svg",
  LightGBM: "lightgbm.svg", statsmodels: "statsmodels.svg", Prophet: "prophet.svg",
  OSRM: "osrm.svg", "Glyph SDK": "glyph.svg", CatBoost: "catboost.png", MONAI: "monai.png",
  CustomTkinter: "customtkinter.png", Pillow: "pillow.png", XGBoost: "xgboost.png",
  PostGIS: "postgis.png", tidymodels: "tidymodels.png", fable: "fable.png", pydicom: "pydicom.png",
  clap: "clap.png", requests: "requests.png", Gymnasium: "gymnasium.png", librosa: "librosa.png",
  "scikit-optimize": "skopt.png",
};

// librerías sin logo propio: se suman al tooltip del ícono de su lenguaje
const parentOf = {
  Room: "Kotlin", Volley: "Kotlin", Retrofit: "Kotlin", Glance: "Kotlin", MPAndroidChart: "Kotlin",
  serde: "Rust", rayon: "Rust",
  selectolax: "Python", BeautifulSoup: "Python", fontTools: "Python", Shapely: "Python",
  "Praat (parselmouth)": "Python",
};

const STATUS_LABEL = {
  Concluded: "Concluido",
  "In progress": "En curso",
  "Stand by": "En pausa",
  Discontinued: "Descontinuado",
};

const CATEGORIES = [
  { key: "obras", label: "Obras" },
  { key: "investigacion", label: "Investigación" },
  { key: "data", label: "Data" },
  { key: "kaggle", label: "Kaggle" },
  { key: "apps", label: "Apps" },
  { key: "herramientas", label: "Herramientas" },
  { key: "diseno", label: "Diseño" },
  { key: "diversiones", label: "Diversiones" },
];

// métricas objetivas (las mide tools/metrics.js); la barra es el percentil entre todos los proyectos
const METRICS = [
  { key: "tamano", label: "Tamaño", get: (p) => p.metricas?.lineas, unit: ["línea", "líneas"],
    hint: "Líneas de código únicas: lo copiado entre archivos cuenta una vez" },
  { key: "esfuerzo", label: "Esfuerzo", get: (p) => p.metricas?.dias, unit: ["día", "días"],
    hint: "Días distintos con commits míos que tocan código" },
  { key: "amplitud", label: "Amplitud", get: (p) => (p.lenguajes?.length ?? 0) + (p.herramientas?.length ?? 0),
    unit: ["tecnología", "tecnologías"], hint: "Lenguajes y herramientas del proyecto" },
];

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const nf = new Intl.NumberFormat("es-MX");

// status -> color del punto (paleta de glow.js)
const STATUS = [
  { rgb: "90,225,255", match: /progress|updating/ },  // activo
  { rgb: "253,197,23", match: /stand|waiting/ },      // en pausa
  { rgb: "214,214,222", match: /concluded|done/ },    // concluido
  { rgb: "255,90,110", match: /discontinued|dead/ },  // descontinuado
];
const statusRgb = (s) =>
  (STATUS.find((g) => g.match.test((s || "").toLowerCase())) || STATUS[2]).rgb;

const escapeHtml = (str) =>
  String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));

const slug = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let projects = [];
let current = { cat: null, idx: -1 };

const tabsEl = document.getElementById("tabs");
const railEl = document.getElementById("rail");
const cardEl = document.getElementById("project");

function inCat(cat) {
  return projects
    .filter((p) => p.categoria === cat)
    .sort(
      (a, b) =>
        (b.metricas?.ultimo ?? "").localeCompare(a.metricas?.ultimo ?? "") ||
        a.nombre.localeCompare(b.nombre)
    );
}

async function load() {
  const res = await fetch(document.body.dataset.src);
  projects = await res.json();
  tabsEl.innerHTML = CATEGORIES.map(
    (c) =>
      `<button class="tab" role="tab" type="button" data-cat="${c.key}" aria-selected="false">${c.label}<span class="n">${inCat(c.key).length}</span></button>`
  ).join("");
  tabsEl.addEventListener("click", (e) => {
    const t = e.target.closest(".tab");
    if (t) go(t.dataset.cat, 0);
  });
  railEl.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-i]");
    if (b) go(current.cat, Number(b.dataset.i));
  });
  cardEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-step]");
    if (b) step(Number(b.dataset.step));
  });
  document.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea")) return;
    if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
  });
  window.addEventListener("hashchange", route);
  route();
  initNebula();
}

function go(cat, i) {
  const list = inCat(cat);
  if (!list.length) return;
  location.hash = `${cat}/${slug(list[i].nombre)}`;
}

function step(d) {
  const list = inCat(current.cat);
  if (!list.length) return;
  go(current.cat, (current.idx + d + list.length) % list.length);
}

function route() {
  const [catRaw, projRaw] = decodeURIComponent(location.hash.slice(1)).split("/");
  const cat = CATEGORIES.some((c) => c.key === catRaw) ? catRaw : CATEGORIES[0].key;
  const list = inCat(cat);
  let idx = list.findIndex((p) => slug(p.nombre) === projRaw);
  if (idx < 0) idx = 0;
  const changedCat = cat !== current.cat;
  const first = current.cat === null;
  current = { cat, idx };

  tabsEl.querySelectorAll(".tab").forEach((t) =>
    t.setAttribute("aria-selected", String(t.dataset.cat === cat))
  );
  if (changedCat) renderRail(list);
  railEl.querySelectorAll("button[data-i]").forEach((b) =>
    b.setAttribute("aria-current", String(Number(b.dataset.i) === idx))
  );
  railEl.querySelector('[aria-current="true"]')?.scrollIntoView({ block: "nearest", inline: "nearest" });

  if (first || reduceMotion) {
    renderCard(list, idx);
  } else {
    cardEl.classList.add("swap");
    setTimeout(() => {
      renderCard(list, idx);
      cardEl.classList.remove("swap");
    }, 140);
  }
}

function renderRail(list) {
  railEl.innerHTML = list
    .map(
      (p, i) =>
        `<button type="button" data-i="${i}" aria-current="false" style="--g:${statusRgb(p.status)}">
          <span class="dot" aria-hidden="true"></span>
          <span class="name">${escapeHtml(p.nombre)}</span>
        </button>`
    )
    .join("");
}

function techHtml(p) {
  const all = [...(p.lenguajes || []), ...(p.herramientas || [])].filter((t) => t && t.trim());
  // las librerías sin logo se agregan al título del ícono de su lenguaje
  const extra = {};
  for (const t of all) {
    const parent = parentOf[t];
    if (parent && all.includes(parent)) (extra[parent] ||= []).push(t);
  }
  const seen = new Set();
  return all
    .filter((t) => !(parentOf[t] && all.includes(parentOf[t])))
    .map((t) => {
      const label = escapeHtml(extra[t] ? `${t} · ${extra[t].join(", ")}` : t);
      const src = localIcons[t] ? `./img/icons/${localIcons[t]}` : iconMap[t] && iconUrl(iconMap[t]);
      if (!src || seen.has(src)) return src ? "" : `<span class="tag">${escapeHtml(t)}</span>`;
      seen.add(src);
      const tone = iconTone[t] ? ` ${iconTone[t]}` : "";
      return `<img class="ti${tone}" src="${src}" alt="${label}" title="${label}" loading="lazy">`;
    })
    .join("");
}

// percentil: qué parte de los demás proyectos queda debajo (los empates cuentan la mitad)
function percentile(m, p) {
  const v = m.get(p);
  const others = projects.filter((q) => q !== p).map(m.get).filter((x) => x != null);
  if (v == null || !others.length) return null;
  const below = others.reduce((n, x) => n + (x < v ? 1 : x === v ? 0.5 : 0), 0);
  return Math.round((100 * below) / others.length);
}

// barras: valor real a la derecha, largo = percentil
function metricsHtml(p) {
  const rows = METRICS.map((m) => {
    const v = m.get(p);
    const pct = percentile(m, p);
    if (v == null || pct == null) return "";
    // si el código llegó casi completo en un commit, git solo prueba una cota inferior
    const partial = m.key === "esfuerzo" && p.metricas?.historiaParcial;
    const value = `${partial ? "≥ " : ""}${nf.format(v)} ${m.unit[v === 1 ? 0 : 1]}`;
    const hint = partial
      ? `${m.hint}. El código se subió casi completo en un solo commit, así que el historial no muestra todo el trabajo.`
      : m.hint;
    const sentence =
      pct === 100 ? "el más alto de mis proyectos"
      : pct === 0 ? "el más bajo de mis proyectos"
      : `más que el ${pct} % de mis proyectos`;
    return `<div class="metric" title="${escapeHtml(hint)}">
        <dt>${m.label}</dt>
        <dd><span class="v">${value}</span><span class="pct">${sentence}</span>
          <span class="bar" aria-hidden="true"><span style="width:${Math.max(pct, 2)}%"></span></span></dd>
      </div>`;
  }).join("");
  return rows ? `<dl class="metrics">${rows}</dl>` : "";
}

function lastChange(p) {
  const d = p.metricas?.ultimo;
  if (!d) return "";
  const [y, mo] = d.split("-");
  return `<time class="last" datetime="${d}" title="Último cambio en el código">${MONTHS[+mo - 1]} ${y}</time>`;
}

// documentación (si tiene página) y repo con estrellas y forks; en cero no aparecen
function linksHtml(p, hasRepo) {
  const docs = p.docs
    ? `<a class="link" href="${escapeHtml(p.docs)}" target="_blank" rel="noopener" aria-label="Documentación" title="Documentación">${BOOK_SVG}</a>`
    : "";
  const counts = [[p.estrellas, STAR_SVG, "estrella", "estrellas"], [p.forks, FORK_SVG, "fork", "forks"]]
    .filter(([n]) => n > 0)
    .map(([n, svg, one, many]) => `<span class="count" title="${n} ${n === 1 ? one : many}">${svg}${n}</span>`)
    .join("");
  const repo = hasRepo
    ? `<a class="link" href="${escapeHtml(p.github)}" target="_blank" rel="noopener" aria-label="Repositorio en GitHub" title="Repositorio en GitHub">${counts}${GITHUB_SVG}</a>`
    : "";
  return docs || repo ? `<div class="links">${docs}${repo}</div>` : "";
}

function renderCard(list, idx) {
  const p = list[idx];
  const n = list.length;
  const prev = list[(idx - 1 + n) % n];
  const next = list[(idx + 1) % n];
  const images = (p.imagenes || [])
    .map(
      (img) => `<figure>
        <img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.caption || p.nombre)}" loading="lazy"
          onerror="this.closest('figure').remove()">
        ${img.caption ? `<figcaption>${escapeHtml(img.caption)}</figcaption>` : ""}
      </figure>`
    )
    .join("");
  const hasRepo = p.github && !/github\.com\/RemiH06\/?$/.test(p.github);

  cardEl.style.setProperty("--g", statusRgb(p.status));
  cardEl.innerHTML = `
    <header class="title">
      <h1>${p.logo ? `<img class="logo" src="${escapeHtml(p.logo)}" alt="" aria-hidden="true">` : ""}${escapeHtml(p.nombre)}</h1>
      ${linksHtml(p, hasRepo)}
    </header>
    <div class="meta">
      <span class="status"><span class="dot" aria-hidden="true"></span>${escapeHtml(STATUS_LABEL[p.status] || p.status || "")}</span>
      ${lastChange(p)}
      <span class="techs">${techHtml(p)}</span>
    </div>
    <div class="about">
      <p class="desc">${escapeHtml(p.descripcion)}</p>
      ${metricsHtml(p)}
    </div>
    ${images ? `<div class="gallery">${images}</div>` : ""}
    ${
      n > 1
        ? `<nav class="pager" aria-label="Proyectos de la categoría">
            <button type="button" data-step="-1">← ${escapeHtml(prev.nombre)}</button>
            <span>${idx + 1} / ${n}</span>
            <button type="button" data-step="1">${escapeHtml(next.nombre)} →</button>
          </nav>`
        : ""
    }`;
}

// ---------- Nebulosa: shader de pantalla completa en WebGL vanilla ----------
function initNebula() {
  const canvas = document.getElementById("nebula");
  if (!canvas) return;
  // alpha:true para compositar sobre la base negra de CSS
  const opts = { alpha: true, premultipliedAlpha: false, antialias: false };
  const gl = canvas.getContext("webgl", opts) || canvas.getContext("experimental-webgl", opts);
  if (!gl) return; // la base de CSS ya se ve

  const vsrc = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  const fsrc = `
    precision highp float;
    uniform vec2 u_res; uniform float u_time;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){
      vec2 i=floor(p),f=fract(p);
      vec2 u=f*f*(3.-2.*f);
      return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),
                 mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
    }
    float fbm(vec2 p){
      float v=0.,a=.5;
      for(int i=0;i<6;i++){v+=a*noise(p);p*=2.02;a*=.5;}
      return v;
    }
    void main(){
      vec2 uv=(gl_FragCoord.xy-.5*u_res)/u_res.y;
      float t=u_time*.045;
      uv+=vec2(u_time*.006,-u_time*.003); // deriva lenta de todo el campo
      vec2 q=vec2(fbm(uv*2.2+vec2(0.,t)),fbm(uv*2.2+vec2(5.2,-t)));
      vec2 r=vec2(fbm(uv*2.2+q*2.2+vec2(1.7,9.2)+t*.5),
                  fbm(uv*2.2+q*2.2+vec2(8.3,2.8)-t*.5));
      float cloud=fbm(uv*2.2+r*2.2);
      // humo gris sobre negro absoluto, con filamentos blanquecinos
      float glow=smoothstep(1.05,0.0,length(uv-vec2(0.18,0.02)));
      float v=pow(cloud,2.2)*0.5;
      v+=glow*pow(cloud,2.0)*0.3;
      v+=pow(cloud,6.0)*0.65;
      v*=(1.-0.6*length(uv))*0.55; // tenue: el texto va directo encima
      vec3 col=vec3(v)*vec3(0.95,0.96,1.0);
      // alpha por brillo: lo oscuro deja ver el negro de CSS
      float a=clamp(v*1.6-0.06,0.,0.9);
      gl_FragColor=vec4(col,a);
    }`;

  function compile(type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  }
  const vs = compile(gl.VERTEX_SHADER, vsrc);
  const fs = compile(gl.FRAGMENT_SHADER, fsrc);
  if (!vs || !fs) return;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uRes = gl.getUniformLocation(prog, "u_res");
  const uTime = gl.getUniformLocation(prog, "u_time");

  function draw(time) {
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, time);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(innerWidth * dpr);
    canvas.height = Math.floor(innerHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (reduceMotion) draw(8);
  }
  resize();
  window.addEventListener("resize", resize);
  if (reduceMotion) return; // un cuadro quieto

  const start = performance.now();
  let raf = 0;
  const frame = (now) => {
    draw((now - start) / 1000);
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  document.addEventListener("visibilitychange", () => {
    cancelAnimationFrame(raf);
    if (!document.hidden) raf = requestAnimationFrame(frame);
  });
}

load();
