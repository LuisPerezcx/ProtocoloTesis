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
   como "seguimiento, no citar" en el vault de Obsidian (ver sección
   siguiente, "Dónde vive cada tipo de referencia"), y se revisa de
   nuevo más adelante por si ya se publicó.
3. Excepción de facto: el propio artículo del director (RSM) todavía no
   tiene venue confirmada en este repo — verificar su estado de
   publicación cuando David lo confirme, y actualizar esta nota.

Ejemplo de caso ya resuelto (2026-08-16): de una primera búsqueda sobre
orquestación/especialización de roles multiagente, tres artículos sí
tenían venue arbitrada (NeurIPS 2025, NeurIPS 2025, ICLR 2026) y se
citan por su DOI/página de proceedings oficial; otros cuatro
(AgentCARD, TeamBench, EntCollabBench, y una survey de colaboración
multiagente) solo estaban en arXiv sin venue confirmada, así que se
dejaron fuera del `.bib` citable como registro de seguimiento (en su
momento en una nota de este repo; desde 2026-09-09 ese seguimiento vive
en el vault, ver sección siguiente).

## Dónde vive cada tipo de referencia (protocolo vs. vault de Obsidian)

Regla explícita de David (2026-09-09), para que cualquier sesión futura
sepa dónde poner cada cosa sin tener que preguntarlo de nuevo:

- **`bibliografia.bib` (este repo) solo contiene lo que ya está citado
  en el protocolo, o lo que se va a citar de inmediato.** Nunca agregar
  ahí una referencia "por si acaso", "para no perderla", o porque David
  todavía no la ha leído — aunque ya tenga venue arbitrada confirmada.
- **Todo lo demás vive en el vault de Obsidian**
  (`~/dev/Notas/maestria/tesis/`, ver skill `notas-obsidian`):
  - Artículos ya leídos/usados (o candidatos serios ya evaluados): una
    nota por artículo en `articulos/<slug>.md` (`tipo: lectura`),
    indexada en `_indice.md` bajo "Artículos revisados".
  - Candidatos sin leer todavía, preprints sin venue arbitrada
    confirmada, y "leads" de segunda mano (una referencia que aparece
    citada dentro del related work de *otro* paper, no encontrada por
    búsqueda propia): todo eso va a `lecturas-pendientes.md`
    (`tipo: idea`), no a una nota de lectura propia y mucho menos al
    `.bib`.
- **Antes de iniciar una ronda nueva de búsqueda de literatura**,
  revisar primero `lecturas-pendientes.md` del vault — puede que ya
  haya un candidato ahí que sirva, antes de buscar desde cero.
- **Una referencia de segunda mano nunca se cita directamente.** Si
  aparece mencionada dentro del related work de un paper que sí se leyó
  (no porque David o el agente la buscaron por su cuenta), se anota en
  `lecturas-pendientes.md` como lead sin verificar, y se le presenta a
  David para que decida si vale la pena verificarla (autores, venue,
  DOI) antes de moverla a una nota de lectura propia o al `.bib`. Citar
  algo que no se ha leído directamente rompe el método BLASER que pide
  la rúbrica del profesor ("Respetar la fuente").

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
dejarlo, 2026-08-16).

Nota técnica (corregida 2026-08-17, verificada compilando): escribir
`"..."` en crudo con `babel[spanish]` activo SÍ se corrompe (ej.
`"olvidar"` se convierte en `.lvidar`) porque `babel-spanish` usa `"`
como carácter de atajo (shorthand). `\MakeOuterQuote{"}` en `main.tex`
corrige esa corrupción, pero de forma predeterminada enruta `"..."` a
través de `csquotes`, cuyo estilo para español son comillas angulares
`«...»` — es decir, sin nada más, el resultado visual es angular, no
recto. Por eso `main.tex` también define un estilo `straightsp` propio
con `\DeclareQuoteStyle` + `\setquotestyle{straightsp}` justo después del
`\MakeOuterQuote{"}`, que fuerza comillas rectas reales manteniendo el
fix de la corrupción. No quitar esas líneas pensando que son
redundantes — sin ellas el documento compila bien pero con comillas
angulares, no rectas.

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

Reestructurada el 2026-08-31 para alinearse **estrictamente** con la
plantilla institucional oficial (`Formato_Tema_Investigacion.docx`, la
que David subió, no confundir con la plantilla vieja
`Anteproyecto_Formato_Maestria` referenciada en versiones anteriores de
esta nota). Estructura vigente:

1. Introducción y motivaciones — 3 subsecciones exactas, tal como las
   pide la plantilla, sustituyendo la vieja subsección "Descripción del
   problema" con sus subsubsections (Planteamiento/Evidencia/
   Consecuencias), todas eliminadas en este cambio:
   - 1.1 **Contexto del problema** (identificación del problema)
   - 1.2 **Importancia del problema** (justificación del problema)
   - 1.3 **Trabajo relacionado** (relevancia del problema)
   - cierre de la sección SIN subsección propia (párrafo suelto):
     la plantilla pide que aquí se identifique el factor de innovación
     de la investigación.
2. Delimitaciones y limitaciones del trabajo (con 2.1 Delimitaciones y
   2.2 Limitaciones como subsecciones — la plantilla distingue ambos
   conceptos: delimitaciones = alcance que decide el candidato no
   cubrir; limitaciones = factores fuera de su control)
3. Hipótesis del trabajo
4. Objetivos del trabajo
5. Metodología (antes "Aproximación a la solución" — se renombró para
   igualar el nombre exacto de la plantilla; mismo contenido/label
   actualizado a `sec:metodologia`)
6. Estructura preliminar de la tesis (sección **nueva**, no existía
   antes de este cambio — describe los capítulos que tendrá el
   documento de tesis final, no el protocolo)
7. Plan de trabajo
8. Bibliografía fundamental (ya sin la subsección "Accesos por Internet",
   eliminada el 2026-08-17 por quedar obsoleta frente al flujo unificado
   de `biblatex-apa`)

"Aprobación" (firmas) se mantiene como página final sin numerar
(`\section*`), fuera de las 8 secciones de la plantilla — es un
requisito de entrega, no parte del contenido del tema de investigación.

**Diferencias deliberadas frente a la plantilla** (decisiones de David,
2026-08-31): se mantiene un `Abstract`/`Keywords` en inglés en
`portada.tex` junto con el `Resumen`/`Palabras clave` en español, aunque
la plantilla solo pide estos últimos. Se eliminó por completo la sección
"Publicaciones generadas" que existía antes (no está en la plantilla).

Cada sección es un archivo independiente en `protocolo/secciones/`
(numerados según el orden de arriba: `01-introduccion.tex`,
`02-limitaciones.tex`, `03-hipotesis.tex`, `04-objetivos.tex`,
`05-metodologia.tex`, `06-estructura-tesis.tex`, `07-plan-trabajo.tex`,
`08-bibliografia.tex`, `09-firmas.tex`), incluido desde
`protocolo/main.tex` vía `\input`. Mantener esta separación al editar:
no fusionar secciones en `main.tex`. Si se vuelve a reordenar/fusionar
alguna sección, renombrar también los archivos para que el número del
nombre siga coincidiendo con su posición real — evita confusión al
navegar la carpeta.

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

## Flujo de revisión con el director (git tags + latexdiff)

Sugerencia del propio director (2026-08-27, por correo): que el texto
nuevo/cambiado desde la última vez que le mandó avances aparezca en otro
color, para no tener que releer todo el documento de nuevo. Se implementó
con `latexdiff-vc` + dos scripts de Node en `scripts/`, expuestos como
comandos npm (no es un proyecto de Node real, `package.json` solo se usa
como task runner multiplataforma — no requiere `npm install`, solo Node
instalado):

- `npm run tag:review` → `scripts/tag-review.js`: crea una etiqueta de git
  `envio-director-YYYY-MM-DD` apuntando al commit actual (si ya existe una
  con esa fecha, agrega sufijo `-2`, `-3`, ...).
- `npm run diff` (o `npm run diff -- <tag-o-commit>`) → `scripts/diff-review.js`:
  1. Resuelve la referencia a comparar: el argumento si se dio uno, o si
     no la etiqueta `envio-director-*` más reciente.
  2. Corre `latexdiff-vc --git -r <ref> --flatten --type=CFONT main.tex`
     dentro de `protocolo/`, generando `protocolo/main-diff.tex`.
  3. Post-procesa ese `.tex` con una regex para que `\DIFaddtex`/`\DIFdeltex`
     solo cambien de color (azul = agregado, rojo = eliminado), sin tocar
     tamaño ni familia de fuente — por defecto latexdiff también encoge el
     texto agregado/eliminado, y eso no se quería.
  4. Compila `main-diff.tex` (pdflatex → biber → pdflatex ×2) con
     `-output-directory=build-diff`, para no mezclarse con `protocolo/build/`.
     El `.tex` de salida se queda en `protocolo/` (mismo nivel que
     `main.tex`) para que las rutas relativas a `referencias/bibliografia.bib`
     sigan resolviendo bien; solo los archivos de compilación (aux/log/pdf)
     van a `build-diff/`.
  5. Resultado: `protocolo/build-diff/main-diff.pdf`.

**Por qué `--type=CFONT` y no el estilo por defecto de latexdiff
(UNDERLINE):** UNDERLINE usa el paquete `ulem` (`\uline`/`\uwave`), cuyo
manejo de subrayado a nivel de carácter choca con el shorthand activo `"`
de `babel-spanish` (la misma familia de bug que la corrupción
`"olvidar"` → `.lvidar` documentada arriba) — producía un carácter
extra pegado justo después de palabras entre comillas. Se verificó
renderizando el PDF. `CFONT` evita el problema porque solo envuelve el
texto en `\color{}`, sin pasar por `ulem`.

**Texto eliminado tachado además de en rojo (agregado 2026-09-01):**
además de colorearse, lo eliminado ahora sale con `\sout` (tachado) —
`\DIFdel` queda como `{\protect\color{red}\sout{#1}}`. Esto sí usa
`ulem` (con la opción `normalem`, para no pisar `\emph`), así que en
principio reintroduce el riesgo del párrafo anterior. Se evitó con dos
piezas, ambas verificadas compilando y renderizando el PDF en sandbox
antes de aplicarlas:

1. `\DIFdelbegin` (y su variante `\DIFdelbeginFL` de figuras/tablas) ya
   no son macros vacías: ahora hacen
   `\begingroup\catcode`\"=12\relax` — es decir, mientras dura el
   bloque de texto eliminado, la comilla `"` deja de ser el carácter
   activo de `babel-spanish` y pasa a ser un carácter "ordinario" común
   y corriente. `\DIFdelend`/`\DIFdelendFL` hacen `\endgroup` para
   restaurarlo justo después. Esto es necesario porque el problema no
   es *qué* significa `"` (eso sí se podría cambiar en caliente con
   `\shorthandoff{"}`, se probó y **no alcanza**: para cuando el cuerpo
   de un comando ve su propio `\shorthandoff`, el argumento ya se
   tokenizó con `"` activo) sino que sea un carácter activo *en
   absoluto* en el momento en que se lee el texto — por eso el cambio
   tiene que ser de `\catcode` y tiene que ocurrir en `\DIFdelbegin`,
   antes de que se lea el `{...}` de `\DIFdel`, no dentro de la
   definición de `\DIFdel` misma (ahí ya sería tarde, mismo problema que
   con `\shorthandoff`). Efecto secundario menor y aceptado: una
   comilla `"` dentro de texto tachado sale como comilla recta "pelada"
   en vez de pasar por `\DeclareQuoteStyle{straightsp}` — visualmente
   son la misma comilla recta, así que no se nota.
2. Bug propio de `latexdiff` 1.3.2 (no de este proyecto, confirmado
   comparando la salida cruda de `latexdiff-vc` antes de nuestro
   post-proceso): cuando el documento carga `graphicx` (que `main.tex`
   sí carga), `latexdiff` agrega un bloque `%DIF HIGHLIGHTGRAPHICS
   PREAMBLE` que vuelve a redefinir `\DIFdelend`/`\DIFdelendFL` (para
   además restaurar `\includegraphics`) — pero por un error de
   copiar/pegar en el propio `latexdiff`, esa redefinición llama a
   `\DIFOaddend`/`\DIFOaddendFL` (el `\DIFaddend` original guardado) en
   vez de `\DIFOdelend`/`\DIFOdelendFL` (el `\DIFdelend` original
   guardado, el que nosotros acabamos de poner con el `\endgroup`). Con
   el `\DIFdelend` vacío de siempre esto pasaba desapercibido (ambos no
   hacen nada); en cuanto `\DIFdelend` hace algo real, el `\begingroup`
   de `\DIFdelbegin` se queda sin cerrar y `pdflatex` termina con
   grupos sin cerrar acumulados (`\end occurred inside a group at level
   N`) — se reprodujo en sandbox exactamente así antes de corregirlo.
   `scripts/diff-review.js` corrige esas dos líneas después de correr
   `latexdiff-vc`.

**Corrección (2026-09-01, mismo día):** la primera versión de este fix
se probó en un sandbox sin `hyperref` en el preámbulo y de ahí salió
una conclusión equivocada ("el post-proceso apuntaba a nombres que
latexdiff nunca genera") que quedaba escrita aquí antes — no era
cierto, quedó corregido abajo. Al aplicarlo sobre el `main-diff.tex`
real de David no salió tachado; comparando el archivo real contra el
del sandbox se encontró la causa: **el nombre de la macro que trae el
color de verdad depende de si el documento carga `hyperref`** (que
`main.tex` sí carga). Con `hyperref` presente, `latexdiff` agrega un
bloque extra `%DIF HYPERREF PREAMBLE` que mueve el color/tamaño a
`\DIFaddtex`/`\DIFdeltex`, y deja `\DIFadd`/`\DIFdel` como simples
envoltorios `\texorpdfstring{...}{...}` (para que los marcadores del
PDF —índice, hipervínculos— no lleven `\color` adentro, que ahí sí
rompería). Sin `hyperref`, el color vive directo en `\DIFadd`/`\DIFdel`,
sin la capa `tex`. Se confirmó generando el diff real con y sin
`\usepackage{hyperref}` en dos sandboxes — mismo `latexdiff`, mismo
`--type=CFONT`, distinto resultado solo por eso. `scripts/diff-review.js`
ahora prueba los dos nombres posibles en cada caso (`\DIFadd` o
`\DIFaddtex`; `\DIFdel` o `\DIFdeltex`) y solo modifica el que de
verdad trae `\protect\color{...}` — el otro no hace match y no pasa
nada. Volví a probar de punta a punta con el preámbulo real (`hyperref`
+ `graphicx` + `biblatex-apa`+biber + `\tableofcontents`) y ahora sí
sale tachado, sin romper el índice ni los hipervínculos.

Archivos generados por `npm run diff` (`protocolo/main-diff.tex` y
`protocolo/build-diff/`) están en `.gitignore` — son temporales y se
regeneran en cualquier momento, no se versionan.

**Bug encontrado y corregido (2026-09-01): podían quedar dos archivos
`main-diff*.tex`.** `latexdiff-vc` nombra su salida según la referencia
comparada (ej. `main-diffenvio-director-2026-08-28.tex`), y el script la
renombra a `main-diff.tex` al terminar. Si ya había un `main-diff.tex`
de una corrida anterior cuando arrancaba la siguiente, quedaban dos
archivos que hacían match con "empieza con `main-diff`, termina en
`.tex`" al mismo tiempo, y el script podía agarrar el viejo (ya
procesado) en vez del recién generado — dejando el nuevo sin procesar,
sin compilar y sin borrar, tirado en `protocolo/`. `scripts/diff-review.js`
ahora borra cualquier `main-diff*.tex` sobrante **antes** de generar uno
nuevo, así que después de correr `npm run diff` siempre debe quedar
solo uno. Si alguna vez aparece un archivo suelto tipo
`main-diffenvio-director-*.tex` (de antes de este fix), se puede borrar
sin problema — es un archivo temporal sin usarse, no forma parte del
protocolo.

**Ciclo completo de trabajo:**

1. Trabajar y hacer commits normalmente en `01-introduccion.tex` (o la
   sección que sea), como cualquier otro cambio de git.
2. Cuando llegue el momento de mandarle avances al director: **primero
   asegurarse de que ese estado exacto esté comiteado** (commit
   obligatorio — ver nota abajo), y **después** correr
   `npm run tag:review`. Esto deja una etiqueta apuntando exactamente a
   "lo que el director ya vio". Al hacer `git push` después, la etiqueta
   se sube sola (ver nota de `push.followTags` abajo) — no hace falta un
   paso aparte.
3. Seguir trabajando y comiteando como siempre.
4. En cualquier momento (para revisar el propio avance, o antes de la
   siguiente entrega), correr `npm run diff` para generar
   `protocolo/build-diff/main-diff.pdf` con solo lo que cambió desde la
   última etiqueta `envio-director-*` (o desde una referencia específica
   con `npm run diff -- <tag-o-commit>`).
5. Cuando se le mande la siguiente ronda de avances al director: comitear
   ese nuevo estado y volver a correr `npm run tag:review`, que crea una
   nueva etiqueta y mueve el marcador hacia adelante.

**¿Es obligatorio comitear antes de `npm run tag:review`?** Sí. Un tag de
git es un puntero inmutable a un commit ya existente, no una foto del
directorio de trabajo — no existe tal cosa como "un tag de cambios sin
comitear". Si se corre `npm run tag:review` con cambios sin comitear, la
etiqueta va a apuntar al último commit real (HEAD), que **no** incluye
esos cambios pendientes. Entonces el diff generado después con `npm run
diff` no reflejaría correctamente "lo que cambió desde que se lo mandé al
director", porque la etiqueta no representa lo que en verdad se le mandó.
Por eso el paso 2 dice explícitamente: comitear primero, etiquetar
después — en ese orden, siempre.

**`git push` normal no sube tags (bug encontrado 2026-08-28):** David
comiteó, corrió `npm run tag:review` y luego `git push`, pero la
etiqueta `envio-director-2026-08-28` no aparecía en GitHub
(`github.com/LuisPerezcx/ProtocoloTesis/tags`). Causa: por defecto, git
solo sube los commits de la rama con `git push` — las etiquetas hay que
subirlas aparte (`git push origin <tag>`, o todas juntas con
`git push --tags`). Para no tener que acordarse de este paso extra cada
vez, se configuró en este repo (**solo local, no `--global`** — no afecta
otros repos de David en la misma máquina):

```bash
git config push.followTags true
```

Con esto, un `git push` normal también sube automáticamente cualquier
tag anotado en el commit que se está subiendo (incluye las
`envio-director-*` creadas por `npm run tag:review`). Si David clona el
repo en otra máquina (ej. la de Windows) o alguien más lo clona, esta
configuración **no viaja con el repo** — es local a cada copia — así que
hay que volver a correrla ahí si se quiere el mismo comportamiento.

**Corrección importante (encontrada 2026-09-01):** esta nota ya decía
"tag anotado" arriba, pero `scripts/tag-review.js` en realidad creaba
etiquetas **ligeras** (`git tag nombre`, sin `-a`/`-m`) — contradiciendo
su propia documentación. `push.followTags` **solo sube etiquetas
anotadas**; con una ligera, no hace nada, nunca, por más veces que se
haga `git push` — no es un tema de "se subirá la próxima vez", ligera
simplemente no aplica. Esto se comprobó armando un repo de prueba: la
etiqueta ligera nunca llegó al remoto después de varios `git push` con
`followTags` activo, mientras que una anotada sí llegó en el primer
push. Efecto real: la etiqueta `envio-director-2026-08-28` sí está en
GitHub porque en su momento se subió **a mano** (`git push origin
<tag>`, como se documentó arriba cuando se encontró el bug original),
no porque `push.followTags` la haya subido sola — nunca lo hizo.
`scripts/tag-review.js` ya se corrigió para crear etiquetas anotadas
(`git tag -a nombre -m "..."`) — a partir de ahora sí deberían subir
solas con un `git push` normal. Cualquier etiqueta `envio-director-*`
creada con la versión vieja del script (ligera) que no aparezca en
GitHub necesita subirse una vez a mano con
`git push origin <nombre-de-la-etiqueta>`.

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
