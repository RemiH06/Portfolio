# Lambda's Vault

Portafolio público de RemiH06 (repo `RemiH06/Portfolio`, GitHub Pages) y, en local, centro de planeación personal y de proyectos.

## Tres repos en una carpeta

| Repo | Carpeta | Visibilidad | Para qué |
|---|---|---|---|
| `RemiH06/Portfolio` | raíz (sitio en `docs/`) | Público | Portafolio web: proyectos, CV, galería. Lo que ve un reclutador o cliente. |
| `RemiH06/RemiH06` | `RemiH06/` | Público | README del perfil de GitHub: presentación corta y "currently working on". |
| `RemiH06/LambdasVault` | `vault/` | Privado | Bóveda de Obsidian: registro de proyectos, ideas, vida. La fuente de verdad; los dos públicos se actualizan a partir de ella. |

Los dos anidados están en `.gitignore` de Portfolio y tienen su propio git.

## Estructura

- `docs/`: el sitio. GitHub Pages publica solo esta carpeta. Rutas relativas (`./css`, `./img`, `./js`, `./json`).
- `assets-src/`: fuentes de edición (`.tif`, originales de títulos). Versionadas pero no publicadas.
- `tools/`: scripts de mantenimiento del sitio (`resize.py` genera `docs/img/titles` desde `assets-src`; `check_icons.js` verifica íconos).
- `vault/`: bóveda de Obsidian y contexto personal. Es su propio repo privado; este repo la ignora completa.

## Reglas

- Nada personal fuera de `vault/` (o `CLAUDE.local.md`). Antes de proponer un checkpoint, revisar `git status` para confirmar que no se cuela nada.
- UI con íconos, sin texto de respaldo.
- Íconos de tecnologías en `sw.html` (método en la skill `logos`): devicon a color por CDN (`iconMap` en `docs/js/catalog.js`); lo que devicon no tiene vive en `docs/img/icons/` (`localIcons`) con su procedencia en `CREDITOS.md`; las librerías sin logo se suman al tooltip de su lenguaje (`parentOf`). Toda tecnología nueva en `sw.json` necesita una de las tres: correr `node tools/check_icons.js` antes de proponer un checkpoint.
