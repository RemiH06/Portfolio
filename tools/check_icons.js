// Verifica que cada tecnología de docs/json/sw.json tenga ícono: SVG de devicon
// (iconMap), archivo en docs/img/icons (localIcons) o un lenguaje padre presente
// en el mismo proyecto (parentOf). También que cada nombre de iconMap tenga SVG
// `original` en la versión fijada de devicon. Uso: node tools/check_icons.js
const fs = require("fs");
const path = require("path");

const docs = path.join(__dirname, "..", "docs");
const src = fs.readFileSync(path.join(docs, "js/catalog.js"), "utf8");

function grab(name) {
  const start = src.indexOf(`const ${name} = {`);
  const end = src.indexOf("\n};", start);
  return Function("return " + src.slice(src.indexOf("{", start), end + 2))();
}

const iconMap = grab("iconMap");
const localIcons = grab("localIcons");
const parentOf = grab("parentOf");
const iconTone = grab("iconTone");
const data = JSON.parse(fs.readFileSync(path.join(docs, "json/sw.json"), "utf8"));

const missing = [];
const badParent = [];
for (const p of data) {
  const all = [...p.lenguajes, ...p.herramientas];
  for (const t of all) {
    if (iconMap[t] || localIcons[t]) continue;
    if (parentOf[t]) {
      if (!all.includes(parentOf[t])) badParent.push(`${p.nombre}: ${t} (falta ${parentOf[t]})`);
      continue;
    }
    missing.push(`${p.nombre}: ${t}`);
  }
}
const noFile = Object.values(localIcons).filter((f) => !fs.existsSync(path.join(docs, "img/icons", f)));
const noLogo = data.filter((p) => p.logo && !fs.existsSync(path.join(docs, p.logo))).map((p) => p.nombre);
const strayTone = Object.keys(iconTone).filter((t) => !iconMap[t] && !localIcons[t]);

(async () => {
  // devicon.json de la versión fijada en DEVICON: lista los SVG que existen por ícono
  let noSvg = "sin verificar (no se pudo descargar devicon.json)";
  const version = src.match(/devicon@(v[\d.]+)/)?.[1];
  try {
    const res = await fetch(`https://cdn.jsdelivr.net/gh/devicons/devicon@${version}/devicon.json`);
    const svgs = Object.fromEntries((await res.json()).map((e) => [e.name, e.versions.svg]));
    const bad = Object.entries(iconMap).filter(([, n]) => !svgs[n]?.includes("original")).map(([t, n]) => `${t} (${n})`);
    noSvg = bad.length ? bad : "ninguno";
  } catch {}

  console.log("sin ícono:", missing.length ? missing : "ninguno");
  console.log("padre ausente:", badParent.length ? badParent : "ninguno");
  console.log("archivos faltantes:", noFile.length ? noFile : "ninguno");
  console.log("logos de proyecto faltantes:", noLogo.length ? noLogo : "ninguno");
  console.log(`sin SVG original en devicon ${version}:`, noSvg);
  console.log("tono sin ícono:", strayTone.length ? strayTone : "ninguno");
  const fail = missing.length || badParent.length || noFile.length || noLogo.length || strayTone.length || Array.isArray(noSvg);
  process.exitCode = fail ? 1 : 0;
})();
