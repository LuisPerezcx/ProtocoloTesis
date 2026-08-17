# Contexto del proyecto — Protocolo / Tesis de Maestría

Este archivo existe para que cualquier sesión de Claude (incluyendo
sesiones en la nube que no comparten memoria entre sí) recupere el
contexto completo del proyecto sin que David tenga que repetirlo. Léelo
al empezar a trabajar en esta carpeta.

## Director de tesis y punto de partida del protocolo

El director de tesis de David es el **Dr. Carlos Alberto Fernández-y-Fernández**
(Instituto de Computación, Universidad Tecnológica de la Mixteca — UTM).

El punto de partida del protocolo es un artículo del propio director:
*"The Role Specialization Model (RSM): Coordinating LLM-Based Tools in
Agentic Software Development – An Exploratory Case Study"* (Fernández-y-Fernández
& Aguilar Cisneros, UPAEP). Propone el **RSM**, un marco para coordinar
varias herramientas basadas en LLM (Antigravity, Gemini CLI, Qwen Code)
asignándoles roles fijos (Arquitecto / Analista / Especialista) dentro de
un flujo de desarrollo de software agéntico, con un humano como
orquestador. Es un estudio de caso exploratorio, de caso único y sin
replicación empírica — el propio artículo enumera sus limitaciones
(homogeneidad de modelos entre herramientas, ausencia de límites de
alcance formalizados entre roles, evaluación de calidad solo cualitativa,
falta de métricas cuantitativas de orquestación, sin agente evaluador),
que son candidatas naturales a convertirse en el problema de tesis.

Material de referencia guardado en el repo:
- `articulos/pdfs/RSM_Role Specialization Model_v6_unlinked_unnumbered.pdf` — PDF original.
- `articulos/traducciones/RSM-role-specialization-model_traduccion.md` — síntesis completa en español, por sección (no traducción literal, por derechos de autor).
- `articulos/notas/rsm-role-specialization-model.md` — nota de análisis: hallazgos, huecos/limitaciones reconocidas por el propio artículo, y cómo se conectan con la sección "Descripción del problema".

Cuando David retome el protocolo en una sesión nueva, leer primero estas
tres referencias junto con este archivo — dan el contexto teórico base
sin tener que releer el PDF completo.

## Convención: `articulos/traducciones/`

Carpeta nueva (no estaba en la estructura original) para síntesis/traducciones
en español de artículos en inglés que David necesita releer en su idioma.
Igual que `notas/`, un archivo por artículo, nombrado `<slug>_traduccion.md`.
Por derechos de autor, estas síntesis **no son traducciones literales
completas** del artículo — son un resumen fiel y completo por sección,
en palabras propias, más citas puntuales entre comillas cuando hace falta
precisión. Si David necesita la redacción exacta de un párrafo específico,
pedirla puntualmente en vez de traducir el artículo entero de nuevo.

## Política de fuentes: no preprints, solo artículos publicados y arbitrados

Regla explícita de David (y de sus directores): **nunca citar arXiv ni
ningún otro preprint** en el protocolo/tesis, solo artículos que ya
pasaron revisión por pares (proceedings de una conferencia arbitrada,
journal, etc.). Esto aplica tanto a la bibliografía formal (`.bib`) como
a cualquier afirmación que se use como evidencia en el texto.

En la práctica, cuando se encuentre un artículo relevante:
1. Buscar primero si ya tiene versión publicada en una venue arbitrada
   (NeurIPS, ICLR, ACL, IJCAI, una revista, etc.) — normalmente en
   `proceedings.neurips.cc`, `proceedings.iclr.cc`, `dl.acm.org`,
   `ieeexplore.ieee.org`, `openreview.net` (solo si dice "accepted"),
   páginas oficiales de la conferencia, o el DOI de la revista. **No**
   usar el link de arXiv como cita final aunque el contenido sea
   idéntico — usar el link/DOI de la proceedings oficial.
2. Si el artículo *solo* existe en arXiv (o similar) y no se encuentra
   evidencia de que haya pasado arbitraje, **no se agrega a
   `bibliografia.bib` como cita citable todavía**. Se deja registrado
   como "seguimiento, no citar" en la nota correspondiente de
   `articulos/notas/`, y se revisa de nuevo más adelante por si ya se
   publicó.
3. Excepción de facto: el propio artículo del director (RSM) todavía no
   tiene venue confirmada en este repo — verificar su estado de
   publicación cuando David lo confirme, y actualizar esta nota.

Ejemplo de caso ya resuelto (2026-08-16): de una primera búsqueda sobre
orquestación/especialización de roles multiagente, tres artículos sí
tenían venue arbitrada (NeurIPS 2025, NeurIPS 2025, ICLR 2026) y se
citan por su DOI/página de proceedings oficial; otros cuatro
(AgentCARD, TeamBench, EntCollabBench, y una survey de colaboración
multiagente) solo estaban en arXiv sin venue confirmada, así que se
dejaron fuera del `.bib` citable y solo quedaron como registro de
seguimiento en `articulos/notas/orquestacion-especializacion-multiagente-2025-2026.md`.

## Revisión de redacción: alertar sobre plagio / parafraseo demasiado cercano

Instrucción explícita de David (2026-08-16), válida para cualquier sesión
futura: cuando revise algo que David redactó (protocolo, tesis, cualquier
sección), si detecta que una oración o fragmento **parafrasea demasiado
cerca** el texto original de una fuente citada (misma estructura de
oración, mismo orden de ideas, traducción casi literal aunque cambien
algunas palabras — lo que en inglés se llama "patchwriting"), debe
**alertarlo explícitamente**, señalando:
- qué oración específica es la de riesgo,
- de qué fuente/oración original viene (sección/página si es posible),
- por qué se considera demasiado cercana (no basta con traducir y cambiar
  un par de palabras — hay que reestructurar la idea o citar textualmente
  entre comillas si la frase original es muy específica),
- y una sugerencia de cómo corregirlo (reformular con estructura propia,
  o usar cita textual entre comillas con `\parencite`/`\textcite` si de
  plano conviene conservar la frase exacta).

Esto aplica sobre todo al escribir a partir de la síntesis en español de
un artículo (`articulos/traducciones/`), porque el riesgo de traducir
casi literal sin darse cuenta es mayor ahí que citando en inglés
directamente. No esperar a que David lo pida en cada ocasión — revisarlo
por defecto cada vez que comparta redacción del protocolo.

## Convención de comillas

David prefiere comillas rectas `"..."` en todo el protocolo, no comillas
angulares `«...»` (aunque `«...»` es lo que suele recomendar la RAE en
español, en México es más común usar comillas rectas y así se decidió
dejarlo, 2026-08-16). Con la configuración actual de `main.tex`
(`fontenc` en T1, `lmodern`, `babel[spanish]` sin `shorthands` activado),
`"..."` se renderiza bien tal cual, sin necesitar ningún paquete
adicional — no usar `«...»` salvo que David lo pida explícitamente para
un caso puntual.

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
