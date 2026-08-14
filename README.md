# Protocolo de Tesis de Maestría

Repositorio de trabajo para el protocolo (y, más adelante, el desarrollo)
de la tesis de maestría. Contiene el proyecto LaTeX, la bitácora de
artículos leídos/por leer, y notas de configuración para retomar el
contexto entre sesiones y entre máquinas (Mac / Windows).

## Estructura

```
protocoloTesis/
├── CLAUDE.md              # contexto persistente para asistencia con Claude
├── protocolo/              # proyecto LaTeX
│   ├── main.tex            # documento maestro — compilar este archivo
│   ├── portada.tex         # título, candidato, director, resumen, abstract
│   ├── secciones/          # una sección del protocolo por archivo
│   ├── referencias/
│   │   └── bibliografia.bib
│   ├── figuras/             # imágenes/diagramas
│   └── build/               # salida de compilación (ignorado por git)
├── entregas/                # PDFs finales entregados (sí se versionan)
└── articulos/                # bitácora de lecturas
    ├── index.md              # tabla resumen de todos los artículos
    ├── notas/                 # una nota detallada por artículo
    └── pdfs/                  # PDFs descargados (ignorados por git salvo -f)
```

## Cómo compilar

El proyecto usa **pdflatex** + **biblatex** con backend **biber** (no
bibtex clásico — ver nota de decisión más abajo) para citas en **APA 7**.

### Con VSCode + LaTeX Workshop (recomendado, ambas máquinas)

1. Abre la carpeta `protocoloTesis/` en VSCode.
2. Abre `protocolo/main.tex`.
3. Guarda el archivo (autoBuild onSave ya compila) o usa el comando
   "Build LaTeX project". LaTeX Workshop detecta automáticamente que hay
   que correr `biber` porque el `.latexmkrc` vive junto a `main.tex`.
4. El PDF aparece en el tab lateral (SyncTeX habilitado: clic en el PDF
   salta a la línea del `.tex` y viceversa).

### Por terminal (Mac o Windows con StrawberryPerl)

```bash
cd protocolo
latexmk -pdf main.tex
```

Para limpiar archivos de compilación:

```bash
latexmk -C
```

## Paquetes necesarios

El documento usa: `babel` (spanish), `geometry`, `graphicx`, `float`,
`caption`, `booktabs`, `enumitem`, `csquotes`, `setspace`, `xcolor`,
`microtype`, `lmodern`, `biblatex` + `biblatex-apa` (backend `biber`),
`hyperref`.

- **Mac (BasicTeX):** instala lo que falte con `sudo tlmgr install <paquete>`.
  Los nombres de paquete tlmgr suelen coincidir con el nombre del `.sty`
  (ej. `lmodern`, `biblatex`, `biber`), pero algunos difieren — ver
  `CLAUDE.md` para cómo identificar el paquete correcto a partir de un
  `.sty` faltante.
- **Windows (MiKTeX):** con "install missing packages on-the-fly"
  activado, se instalan solos al compilar. No se requiere acción manual.

## Cómo citar

Todas las referencias viven en `protocolo/referencias/bibliografia.bib`.
En el texto:

```latex
\parencite{sommerville2016}      % (Sommerville, 2016)
\textcite{sommerville2016}       % Sommerville (2016)
\parencite[p.~12]{sommerville2016} % (Sommerville, 2016, p. 12)
```

La bibliografía final (`\printbibliography` en
`secciones/09-bibliografia.tex`) se genera y ordena sola — no se edita a
mano.

## Bitácora de artículos (`articulos/`)

Cuando encuentres un artículo interesante:

1. Agrégalo como fila en `articulos/index.md` (link + resumen de 1-2
   líneas).
2. Si quieres poder pedirle a Claude que consulte detalles puntuales más
   adelante sin releer el artículo completo, crea
   `articulos/notas/<slug>.md` con los puntos clave, citas textuales
   relevantes y su referencia BibTeX ya lista para copiar a
   `bibliografia.bib`.
3. (Opcional) guarda el PDF en `articulos/pdfs/` — por defecto no se sube
   a git (ver `.gitignore`), porque muchos PDFs académicos tienen
   restricciones de derechos de autor. Si quieres versionar uno en
   particular: `git add -f articulos/pdfs/nombre.pdf`.

## Git / GitHub

Ver la sección correspondiente en `CLAUDE.md` para el flujo de trabajo
entre Mac y Windows, y los comandos de inicialización del repositorio.
