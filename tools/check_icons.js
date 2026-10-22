// Verifica que cada tecnología de docs/json/sw.json tenga ícono: clase de devicon
// (iconMap), archivo en docs/img/icons (localIcons) o un lenguaje padre presente
// en el mismo proyecto (parentOf). Uso: node tools/check_icons.js
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

console.log("sin ícono:", missing.length ? missing : "ninguno");
console.log("padre ausente:", badParent.length ? badParent : "ninguno");
console.log("archivos faltantes:", noFile.length ? noFile : "ninguno");
process.exitCode = missing.length || badParent.length || noFile.length ? 1 : 0;
