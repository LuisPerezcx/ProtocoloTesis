#!/usr/bin/env node
/**
 * Genera un PDF de "solo lo que cambió" desde la última vez que le
 * mandaste avances a tu director (o desde la referencia de git que le
 * pases como argumento).
 *
 * Uso:
 *   node scripts/diff-review.js                    -> usa la última etiqueta envio-director-*
 *   node scripts/diff-review.js <tag-o-commit>      -> compara contra esa referencia específica
 *   npm run diff
 *   npm run diff -- envio-director-2026-08-20
 *
 * Requiere tener instalado latexdiff (tlmgr install latexdiff en Mac;
 * en Windows/MiKTeX se instala solo la primera vez, o mpm --install=latexdiff).
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function sh(cmd, opts = {}) {
  return execSync(cmd, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"], ...opts });
}

const PROTOCOLO_DIR = path.join(__dirname, "..", "protocolo");
const OUT_DIR = path.join(PROTOCOLO_DIR, "build-diff");

function resolveRef() {
  const argRef = process.argv[2];
  if (argRef) return argRef;

  const tags = sh('git tag --list "envio-director-*" --sort=-creatordate')
    .trim()
    .split("\n")
    .filter(Boolean);

  if (tags.length === 0) {
    console.error(
      'No encontré ninguna etiqueta "envio-director-*". Corre primero "npm run tag:review" ' +
        "después de la última vez que le mandaste avances a tu director, o pasa un commit/tag " +
        'manualmente: "npm run diff -- <referencia>".'
    );
    process.exit(1);
  }
  return tags[0];
}

function main() {
  const ref = resolveRef();
  console.log(`Comparando contra: ${ref}`);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  // 0. Limpiar cualquier main-diff*.tex que haya quedado de una corrida
  //    anterior, ANTES de generar uno nuevo.
  //
  //    Bug encontrado 2026-09-01 (David corrió "npm run diff" dos veces
  //    seguidas y le quedaron 2 archivos "main-diff" en protocolo/): si ya
  //    existe un "main-diff.tex" de una corrida previa cuando corre esta
  //    (porque el paso de abajo lo genera con el nombre "main-diff.tex" al
  //    terminar), y latexdiff-vc genera esta vez un archivo con OTRO nombre
  //    (algo como "main-diffenvio-director-2026-08-28.tex" -- latexdiff-vc
  //    nombra el archivo según la referencia con la que comparaste), quedan
  //    DOS archivos que hacen match con "empieza con main-diff y termina en
  //    .tex". El código de abajo toma el PRIMERO que encuentre
  //    (`Array.find`), y el orden de `fs.readdirSync` no está garantizado
  //    -- en la práctica salió alfabético, así que agarraba el
  //    "main-diff.tex" viejo (ya procesado en la corrida anterior) en vez
  //    del recién generado, lo volvía a "procesar" (sin cambios reales,
  //    porque ya estaba procesado) y lo dejaba tal cual -- mientras que el
  //    archivo realmente nuevo de esta corrida se quedaba sin tocar, sin
  //    compilar, y sin borrar. El PDF que se ve seguía siendo el de la
  //    corrida anterior, no el de la comparación que se acababa de pedir.
  //    Borrar aquí cualquier main-diff*.tex sobrante antes de generar uno
  //    nuevo garantiza que después de correr latexdiff-vc solo exista un
  //    archivo que haga match, y sea siempre el de esta corrida.
  fs.readdirSync(PROTOCOLO_DIR)
    .filter((f) => f.startsWith("main-diff") && f.endsWith(".tex"))
    .forEach((f) => fs.unlinkSync(path.join(PROTOCOLO_DIR, f)));

  // 1. Generar el .tex con las diferencias marcadas (color, sin subrayado ulem)
  try {
    sh(`latexdiff-vc --git -r ${ref} --flatten --type=CFONT main.tex`, { cwd: PROTOCOLO_DIR });
  } catch (e) {
    // latexdiff-vc a veces regresa código != 0 aunque sí generó el archivo
    // (por los warnings de "wide character"); seguimos si el archivo existe.
  }

  const generated = fs
    .readdirSync(PROTOCOLO_DIR)
    .find((f) => f.startsWith("main-diff") && f.endsWith(".tex"));

  if (!generated) {
    console.error("No se generó el archivo de diferencias. Revisa el mensaje de latexdiff-vc arriba.");
    process.exit(1);
  }

  const generatedPath = path.join(PROTOCOLO_DIR, generated);
  // Se deja el .tex fuente en protocolo/ (junto a main.tex) para que las
  // rutas relativas (referencias/bibliografia.bib, etc.) se resuelvan
  // igual que cuando compilas el documento normal; solo los archivos de
  // salida (aux/log/pdf) van a build-diff/.
  const targetTexPath = path.join(PROTOCOLO_DIR, "main-diff.tex");

  // 2. Uniformar tamaño/tipografía y agregar tachado a lo eliminado.
  //
  //    NOTA (corregida 2026-09-01, la primera versión de esta nota estaba
  //    mal): el nombre real de la macro que trae el color depende de si
  //    main.tex carga hyperref (que sí carga). Con hyperref presente,
  //    latexdiff agrega un bloque extra "%DIF HYPERREF PREAMBLE" que mete
  //    el color/tamaño en \DIFaddtex / \DIFdeltex, y deja \DIFadd / \DIFdel
  //    como simples envoltorios \texorpdfstring{...}{...} (para que los
  //    marcadores del PDF no lleven \color adentro). Sin hyperref, el color
  //    vive directo en \DIFadd / \DIFdel. Se comprobó generando el diff real
  //    en sandbox con y sin \usepackage{hyperref} en el preámbulo -- con
  //    hyperref aparecen \DIFaddtex/\DIFdeltex, sin él no. Por eso las
  //    regexes de abajo prueban los dos nombres (\DIFadd|\DIFaddtex y
  //    \DIFdel|\DIFdeltex): cualquiera que sea el que de verdad trae
  //    `\protect\color{...}` es al que se le aplica el cambio; el otro
  //    simplemente no hace match y no pasa nada.
  //
  //    Además, ahora lo eliminado sale tachado (\sout), no solo en rojo.
  //    \sout es de ulem, que por defecto choca con el shorthand activo `"`
  //    de babel-spanish (mismo bug que la corrupción "olvidar" -> .lvidar
  //    documentada en CLAUDE.md) y rompe la compilación si el texto tachado
  //    contiene comillas -- probado en sandbox: "Extra }, or forgotten
  //    \endgroup" al tachar un fragmento con comillas. La solución (también
  //    probada, compila y renderiza bien) es que \DIFdelbegin desactive el
  //    catcode activo de `"` (poniéndolo "ordinario") justo antes de que se
  //    lea el texto eliminado, y \DIFdelend lo restaure -- así ulem nunca ve
  //    el carácter activo de babel. Las comillas dentro de texto tachado
  //    salen como comilla recta simple (visualmente igual a las demás,
  //    porque el estilo del documento ya es de comillas rectas).
  let contents = fs.readFileSync(generatedPath, "utf8");

  // Requiere ulem (con normalem para no pisar \emph) antes de \begin{document}.
  contents = contents.replace(
    /(\\RequirePackage\{color\}\\definecolor\{RED\}[^\n]*\n)/,
    "$1\\RequirePackage[normalem]{ulem} %DIF PREAMBLE\n"
  );

  // Agregado: solo color, sin \sf. Prueba \DIFadd y \DIFaddtex -- el que
  // no trae \protect\color{...} de verdad simplemente no hace match.
  contents = contents.replace(
    /\\providecommand\{\\(DIFadd|DIFaddtex)\}\[1\]\{\{\\protect\\color\{blue\}[^}]*#1\}\}/g,
    "\\providecommand{\\$1}[1]{{\\protect\\color{blue}#1}}"
  );
  // Eliminado: color + tachado, sin \scriptsize. Mismo truco con \DIFdel /
  // \DIFdeltex.
  contents = contents.replace(
    /\\providecommand\{\\(DIFdel|DIFdeltex)\}\[1\]\{\{\\protect\\color\{red\}[^}]*#1\}\}/g,
    "\\providecommand{\\$1}[1]{{\\protect\\color{red}\\sout{#1}}}"
  );
  // DIFdelbegin/DIFdelend (y las variantes FL de figuras/tablas): desactivar
  // el catcode de `"` mientras dure el tachado, para que ulem no truene con
  // el shorthand de babel-spanish.
  contents = contents.replace(
    /\\providecommand\{\\DIFdelbegin(FL)?\}\{\}/g,
    "\\providecommand{\\DIFdelbegin$1}{\\begingroup\\catcode`\\\"=12\\relax}"
  );
  contents = contents.replace(
    /\\providecommand\{\\DIFdelend(FL)?\}\{\}/g,
    "\\providecommand{\\DIFdelend$1}{\\endgroup}"
  );

  // Bug propio de latexdiff 1.3.2 (no nuestro): cuando el documento carga
  // graphicx (main.tex sí lo hace), latexdiff agrega un bloque
  // "HIGHLIGHTGRAPHICS PREAMBLE" que vuelve a redefinir \DIFdelend /
  // \DIFdelendFL para además restaurar \includegraphics -- pero por un
  // error de copiar/pegar en el propio latexdiff, esa redefinición llama a
  // \DIFOaddend (el \DIFaddend original guardado) en vez de \DIFOdelend (el
  // \DIFdelend original guardado, que es justo el que acabamos de poner
  // arriba con el \endgroup). Con el \DIFdelend vacío de siempre esto pasa
  // desapercibido (ambos no hacen nada), pero en cuanto \DIFdelend hace algo
  // (nuestro \endgroup) el \begingroup de \DIFdelbegin se queda sin cerrar
  // -- confirmado en sandbox: pdflatex terminaba con grupos \begingroup sin
  // cerrar acumulados y salía con error. Se corrige apuntando esas dos
  // redefiniciones a la variable correcta.
  contents = contents.replace(
    /(\\DeclareRobustCommand\{\\DIFdelend\}\{)\\DIFOaddend /,
    "$1\\DIFOdelend "
  );
  contents = contents.replace(
    /(\\DeclareRobustCommand\{\\DIFdelendFL\}\{)\\DIFOaddendFL /,
    "$1\\DIFOdelendFL "
  );

  if (generatedPath !== targetTexPath) {
    fs.writeFileSync(targetTexPath, contents, "utf8");
    fs.unlinkSync(generatedPath);
  } else {
    fs.writeFileSync(targetTexPath, contents, "utf8");
  }

  // 3. Compilar (pdflatex -> biber -> pdflatex x2) desde protocolo/, con
  //    salida a build-diff/ para no ensuciar ni mezclar con build/.
  const run = (cmd) => sh(cmd, { cwd: PROTOCOLO_DIR });
  try {
    run(`pdflatex -interaction=nonstopmode -halt-on-error -output-directory=build-diff main-diff.tex`);
    run(`biber --input-directory=build-diff --output-directory=build-diff main-diff`);
    run(`pdflatex -interaction=nonstopmode -halt-on-error -output-directory=build-diff main-diff.tex`);
    run(`pdflatex -interaction=nonstopmode -halt-on-error -output-directory=build-diff main-diff.tex`);
  } catch (e) {
    console.error("Falló la compilación. Revisa protocolo/build-diff/main-diff.log para más detalle.");
    process.exit(1);
  }

  const pdfPath = path.join(OUT_DIR, "main-diff.pdf");
  if (fs.existsSync(pdfPath)) {
    console.log(`Listo: ${path.relative(process.cwd(), pdfPath)}`);
  } else {
    console.error("No se generó el PDF. Revisa build-diff/main-diff.log.");
    process.exit(1);
  }
}

main();
