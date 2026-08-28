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

  // 2. Uniformar tamaño/tipografía: que agregado y eliminado solo cambien
  //    de color, sin tocar tamaño de fuente ni familia tipográfica.
  let contents = fs.readFileSync(generatedPath, "utf8");
  contents = contents.replace(
    /\\providecommand\{\\DIFaddtex\}\[1\]\{\{\\protect\\color\{blue\}[^}]*#1\}\}/,
    "\\providecommand{\\DIFaddtex}[1]{{\\protect\\color{blue}#1}}"
  );
  contents = contents.replace(
    /\\providecommand\{\\DIFdeltex\}\[1\]\{\{\\protect\\color\{red\}[^}]*#1\}\}/,
    "\\providecommand{\\DIFdeltex}[1]{{\\protect\\color{red}#1}}"
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
