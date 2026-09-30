# Lambda's Vault

Portafolio público de RemiH06 (repo `RemiH06/Portfolio`, GitHub Pages) y, en local, centro de planeación personal y de proyectos.

## Estructura

- `docs/`: el sitio. GitHub Pages publica solo esta carpeta. Rutas relativas (`./css`, `./img`, `./js`, `./json`).
- `assets-src/`: fuentes de edición (`.tif`, originales de títulos). Versionadas pero no publicadas.
- `tools/`: scripts de mantenimiento del sitio (`resize.py` genera `docs/img/titles` desde `assets-src`).
- `vault/`: bóveda de Obsidian y contexto personal. Gitignorada completa.

## Reglas

- Nada personal fuera de `vault/` (o `CLAUDE.local.md`). Antes de proponer un checkpoint, revisar `git status` para confirmar que no se cuela nada.
- Español mexicano en comentarios, docs y commits. Sin guión largo en ningún archivo.
- Commits: conventional commits de una línea (checkpoints).
- UI con íconos, sin texto de respaldo. Nada de `#000` ni `#fff` puros en tokens de color.
