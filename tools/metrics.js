// Mide cada proyecto de docs/json/sw.json desde su historia de git y escribe
// `metricas` (líneas únicas, días con commits, último cambio) más estrellas,
// forks y página de documentación de GitHub. Uso: node tools/metrics.js [--dry]
//
// De dónde sale cada repo: un clon de GitHub en el temporal del sistema, que se
// reutiliza entre corridas. Si el clon falla (repo enorme o borrado de GitHub),
// una carpeta en iroFactory cuyo remoto coincida, hasta dos niveles abajo.
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const dry = process.argv.includes("--dry");
const swPath = path.join(__dirname, "..", "docs", "json", "sw.json");
const factory = path.join(__dirname, "..", "..");
const cache = path.join(os.tmpdir(), "lambdasvault-repos");

// commits propios: los de compañeros no cuentan como esfuerzo
const MINE = /remi\.hexagon@|hector8heredia@|108415420\+/i;
const CODE = new Set(["py","ipynb","js","mjs","ts","tsx","jsx","html","css","scss","kt","kts","java","cs","php","sql","go","rs","ex","exs","heex","eex","c","h","cpp","hpp","glsl","wgsl","frag","vert","sh","ps1","r","jl","lua","dart","swift","vue","svelte","hs","gd","tex","bat"]);
// docs/ es la página de presentación del repo, no el proyecto
const SKIP_DIR = /(^|\/)(docs|node_modules|vendor|third_party|dist|build|out|\.venv|venv|env|__pycache__|\.gradle|bin|obj|libs|fixtures|(windows|linux|macos|ios)\/runner|site-packages|deps|_build|\.next|target|Pods)\//i;
const SKIP_FILE = /(\.min\.(js|css)$|-lock\.|\.lock$|bundle\.js$|\.designer\.cs$|\.g\.cs$|(^|\/)gradlew(\.bat)?$)/i;
// si un solo commit trae más de esta fracción del código, el historial no muestra el trabajo
const BULK = 0.85;

const git = (dir, args) =>
  execFileSync("git", ["-C", dir, "-c", "core.quotepath=off", ...args], { encoding: "utf8", maxBuffer: 1 << 30, stdio: ["pipe", "pipe", "ignore"] });
const isCode = (f) => CODE.has(path.extname(f).slice(1).toLowerCase()) && !SKIP_DIR.test(f) && !SKIP_FILE.test(f);
const repoName = (url) => path.basename(url.replace(/\.git$/, "").replace(/\/$/, "")).toLowerCase();

function localRepos() {
  const found = {};
  const visit = (dir, depth) => {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    if (entries.some((e) => e.name === ".git")) {
      try { found[repoName(git(dir, ["remote", "get-url", "origin"]).trim())] = dir; } catch {}
      return;
    }
    if (depth < 2) entries.filter((e) => e.isDirectory() && !e.name.startsWith(".")).forEach((e) => visit(path.join(dir, e.name), depth + 1));
  };
  visit(factory, 0);
  return found;
}

function repoDir(url, local) {
  const name = repoName(url);
  const dir = path.join(cache, name);
  try {
    if (fs.existsSync(dir)) git(dir, ["fetch", "-q", "--all"]);
    else execFileSync("git", ["clone", "-q", "--no-checkout", url, dir], { stdio: "ignore" });
    return dir;
  } catch {
    fs.rmSync(dir, { recursive: true, force: true });
    return local[name] || null;
  }
}

// lee los blobs de HEAD en lote: no depende del índice ni del árbol de trabajo
function headFiles(dir) {
  const entries = git(dir, ["ls-tree", "-r", "-l", "HEAD"]).split("\n").filter(Boolean)
    .map((l) => {
      const [meta, f] = l.split("\t");
      const [, type, sha, size] = meta.split(/\s+/);
      return { f, type, sha, size: +size };
    })
    .filter((e) => e.type === "blob" && isCode(e.f) && e.size < 2_000_000); // más grande = datos o código generado
  if (!entries.length) return [];
  const out = execFileSync("git", ["-C", dir, "cat-file", "--batch"], { input: entries.map((e) => e.sha).join("\n") + "\n", maxBuffer: 1 << 30 });
  let pos = 0;
  return entries.map((e) => {
    const nl = out.indexOf(10, pos);
    const size = +out.toString("latin1", pos, nl).split(" ")[2];
    const txt = out.toString("utf8", nl + 1, nl + 1 + size);
    pos = nl + 1 + size + 1;
    return { f: e.f, txt };
  });
}

function codeLines({ f, txt }) {
  if (f.endsWith(".ipynb")) {
    try {
      return JSON.parse(txt).cells.filter((c) => c.cell_type === "code")
        .flatMap((c) => [].concat(c.source).join("").split("\n")).map((l) => l.trim()).filter(Boolean);
    } catch { return []; }
  }
  return txt.split("\n").map((l) => l.trim()).filter(Boolean);
}

function measure(dir) {
  // solo cuentan los commits que tocan código: un barrido de READMEs no es trabajo en el proyecto
  const log = git(dir, ["log", "--all", "--no-merges", "--format=@%ae|%ad", "--date=short", "--numstat"]);
  const days = new Set(), dates = [];
  let added = 0, maxCommit = 0, cur = null;
  const close = () => {
    if (!cur?.code) return;
    dates.push(cur.date);
    if (MINE.test(cur.email)) days.add(cur.date);
    maxCommit = Math.max(maxCommit, cur.added);
  };
  for (const line of log.split("\n")) {
    if (line.startsWith("@")) {
      close();
      const [email, date] = line.slice(1).split("|");
      cur = { email, date, code: false, added: 0 };
    } else {
      const [a, , f] = line.split("\t");
      if (f && isCode(f)) { cur.code = true; if (a !== "-") { added += +a; cur.added += +a; } }
    }
  }
  close();
  if (!dates.length) return null;

  // líneas únicas: lo copiado y pegado entre archivos (variantes de un notebook) cuenta una vez
  const lineas = new Set(headFiles(dir).flatMap(codeLines)).size;
  const m = { lineas, dias: days.size, ultimo: dates.sort().at(-1) };
  if (added && maxCommit / added > BULK) m.historiaParcial = true;
  return m;
}

async function githubCounts() {
  try {
    const res = await fetch("https://api.github.com/users/RemiH06/repos?per_page=100");
    if (!res.ok) throw new Error(res.status);
    return Object.fromEntries((await res.json()).map((r) => [r.name.toLowerCase(), r]));
  } catch (e) {
    console.warn(`GitHub no respondió (${e.message}): se conservan estrellas y forks anteriores`);
    return null;
  }
}

(async () => {
  const sw = JSON.parse(fs.readFileSync(swPath, "utf8"));
  const local = localRepos();
  const gh = await githubCounts();
  fs.mkdirSync(cache, { recursive: true });

  for (const p of sw) {
    const dir = p.github && repoDir(p.github, local);
    const m = dir && measure(dir);
    if (m) p.metricas = m;
    else console.warn(`${p.nombre}: sin repo o sin commits de código, se conservan sus métricas`);

    if (gh) {
      const r = gh[repoName(p.github || "")];
      // en cero no se muestran, así que tampoco se guardan
      for (const [k, v] of [["estrellas", r?.stargazers_count], ["forks", r?.forks_count]]) {
        if (v) p[k] = v; else delete p[k];
      }
      // documentación: la página de inicio del repo, o su GitHub Pages si no declara una
      const docs = r?.homepage || (r?.has_pages && `https://remih06.github.io/${r.name}/`);
      if (docs) p.docs = docs; else delete p.docs;
    }
    const { lineas, dias, ultimo, historiaParcial } = p.metricas || {};
    console.log(`${p.nombre.padEnd(30)} ${String(lineas).padStart(6)} líneas ${String(dias).padStart(4)} días  ${ultimo}${historiaParcial ? "  (historia parcial)" : ""}`);
  }

  if (dry) return;
  // mismo formato que el archivo a mano: 4 espacios, objetos pequeños y listas de texto en una línea
  const json = JSON.stringify(sw, null, 4)
    .replace(/\{\n\s+([^{}\[\]]{0,400}?)\n\s+\}/g, (_, body) => `{ ${body.split(/,\n\s+/).join(", ")} }`)
    .replace(/\[\n\s+("[^{}\[\]]*?)\n\s+\]/g, (_, body) => `[${body.split(/,\n\s+/).join(", ")}]`);
  fs.writeFileSync(swPath, json + "\n");
  console.log(`escrito ${path.relative(process.cwd(), swPath)}`);
})();
