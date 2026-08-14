# Contexto del proyecto — Protocolo / Tesis de Maestría

Este archivo existe para que cualquier sesión de Claude (incluyendo
sesiones en la nube que no comparten memoria entre sí) recupere el
contexto completo del proyecto sin que David tenga que repetirlo. Léelo
al empezar a trabajar en esta carpeta.

## Quién y qué

David está escribiendo su protocolo de tesis de maestría en LaTeX (y más
adelante el desarrollo completo de la tesis), alternando entre una Mac y
una PC con Windows. El repositorio vive en GitHub bajo el usuario
**LuisPerezcx** y se sincroniza manualmente con `git pull` / `git push`
entre ambas máquinas.

## Setup por máquina

**Mac:** BasicTeX (TeX Live 2026) + `latexmk`. BasicTeX es una
distribución mínima: cuando falte un paquete, se instala manualmente con:

```bash
sudo tlmgr install <paquete>
```

Cuando el error de compilación menciona un `.sty` faltante, el nombre del
paquete tlmgr **no siempre coincide** con el nombre del `.sty`. Si David
pide ayuda para identificar el paquete correcto: buscar en CTAN
(`https://ctan.org/pkg/<nombre>`) o usar
`tlmgr search --global --file /<nombre>.sty` para encontrar a qué paquete
pertenece antes de dar el comando de instalación.

**Windows:** MiKTeX con "install missing packages on-the-fly" activado —
los paquetes se instalan solos al compilar, no requiere intervención
manual. También usa **StrawberryPerl** (necesario para que `latexmk`
funcione en Windows, ya que `latexmk` es un script Perl).

**Ambas:** VSCode + extensión **LaTeX Workshop**, configuración
sincronizada vía Settings Sync (recetas de latexmk para pdflatex/xelatex,
autoBuild onSave, PDF en tab lateral, SyncTeX). Motor por defecto:
**pdflatex** con `babel` en modo `spanish`.

Cuando David pida instalar un paquete: dar el comando `tlmgr` para Mac.
Para Windows normalmente no hace falta dar ningún comando (se instala
solo), salvo que tenga "on-the-fly" desactivado — en ese caso el comando
equivalente es abrir la consola de paquetes de MiKTeX o
`mpm --install=<paquete>`.

## Decisión de bibliografía: biblatex-apa + biber (no bibtex clásico)

Al planear el proyecto, David pidió citas en formato APA con "bibtex, que
es lo más común". Se evaluaron dos opciones:

- **apacite** (bibtex clásico): solo soporta APA **6ª edición**, ya no se
  actualiza para APA 7.
- **biblatex + biblatex-apa** (backend **biber**, no bibtex): sí soporta
  APA **7ª edición** de forma activa y completa. Requiere biber en lugar
  de bibtex clásico como backend.

Como David necesita cumplimiento con **APA 7**, se decidió usar
**biblatex-apa + biber**. Esto es intencional y ya está verificado que
compila correctamente (probado en sandbox: pdflatex → biber → pdflatex ×2,
6 páginas, citas y bibliografía renderizando bien, incluyendo
`spanish-apa.lbx` para las convenciones de idioma español).

Implicación práctica: en Mac hay que instalar el paquete `biber` con
tlmgr (es un binario aparte, no solo un `.sty`); en Windows, MiKTeX lo
instala solo la primera vez que se compile. En VSCode LaTeX Workshop, la
receta de compilación debe incluir el paso de biber — si algún día se
edita la receta manualmente (fuera del `.latexmkrc` del proyecto), debe
ser: `pdflatex` → `biber` → `pdflatex` → `pdflatex`. El `.latexmkrc` en
`protocolo/` ya maneja esto automáticamente, así que en la mayoría de los
casos no hay que tocar nada.

## Estructura de secciones del protocolo

Basada en la plantilla institucional (`Anteproyecto_Formato_Maestria`),
con una sección adicional que David pidió agregar:

1. Introducción y motivaciones
2. **Descripción del problema** ← sección agregada (no está en la
   plantilla original; va después de la introducción porque ahí es donde
   se acota el problema específico a partir del estado del arte
   presentado en la sección 1)
3. Limitaciones de la investigación
4. Hipótesis de la tesis
5. Objetivos de la tesis
6. Aproximación a la solución
7. Plan de trabajo
8. Publicaciones generadas
9. Bibliografía fundamental (con subsección 9.1 Accesos por Internet)

Cada sección es un archivo independiente en `protocolo/secciones/`,
incluido desde `protocolo/main.tex` vía `\input`. Mantener esta
separación al editar: no fusionar secciones en `main.tex`.

## Formato de página

Réplica del formato de la plantilla institucional en docx: papel carta,
márgenes 2.5 cm arriba/abajo, 3 cm izquierda/derecha (paquete
`geometry`), fuente 12pt. Si David menciona requisitos adicionales del
reglamento de su universidad (interlineado, tipografía específica), se
ajustan en el preámbulo de `main.tex`.

## Bitácora de artículos (`articulos/`)

Carpeta separada del proyecto LaTeX. Propósito: cuando David encuentra un
artículo interesante, guarda el link + descripción breve en
`articulos/index.md`, y opcionalmente una nota más detallada en
`articulos/notas/<slug>.md`. Cuando David pida "revisa qué dice el
artículo X sobre Y" sin querer releerlo desde cero, buscar primero en
`articulos/notas/` antes de pedirle que reenvíe el artículo.

Los PDFs de artículos (`articulos/pdfs/`) están excluidos de git por
defecto (derechos de autor / peso del repo) — solo se versionan si David
lo pide explícitamente con `git add -f`.

## Entregas (`entregas/`)

A diferencia del resto de los PDFs (que se regeneran y no se versionan),
los PDFs finales entregados al director/comité sí se guardan aquí y sí se
suben a git, como respaldo histórico de qué versión se entregó y cuándo.
Convención de nombre sugerida: `protocolo_v<n>_<AAAA-MM-DD>.pdf`.

## Cómo ayudar en este proyecto

- Motor por defecto: pdflatex. No cambiar a xelatex/lualatex salvo que
  David lo pida explícitamente (ej. por necesitar una fuente específica).
- Al dar instrucciones de instalación de paquetes, recordar que en Mac es
  `tlmgr` y en Windows es automático — no dar el mismo comando para
  ambas plataformas.
- Preferir `\parencite` / `\textcite` (sintaxis biblatex/natbib) sobre
  `\cite` a secas al escribir ejemplos, para mantener consistencia con lo
  ya usado en el proyecto.
- Si se agrega una figura o tabla nueva, usar siempre `\label` +
  `\ref`/`\autoref` para que quede enlazada dinámicamente (aprovechar
  hyperref, ya configurado).
