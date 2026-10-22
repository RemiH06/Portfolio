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
- `tools/`: scripts de mantenimiento del sitio (`resize.py` genera `docs/img/titles` desde `assets-src`).
- `vault/`: bóveda de Obsidian y contexto personal. Es su propio repo privado; este repo la ignora completa.

## Reglas

- Nada personal fuera de `vault/` (o `CLAUDE.local.md`). Antes de proponer un checkpoint, revisar `git status` para confirmar que no se cuela nada.
- UI con íconos, sin texto de respaldo.
