#!/usr/bin/env node
/**
 * Crea una (o varias) etiquetas de git para marcar "esto ya lo entregué".
 *
 * Hay DOS destinatarios distintos que piden ver los avances marcados
 * (texto nuevo en azul / eliminado en rojo, ver scripts/diff-review.js):
 *   - director   -> etiqueta envio-director-YYYY-MM-DD
 *   - seminario  -> etiqueta envio-seminario-YYYY-MM-DD   (la clase de
 *                   Protocolo de Tesis, que ahora también pide lo mismo)
 *
 * Cada destinatario lleva su propia línea de etiquetas independiente, para
 * poder decir "lo que vio el director" y "lo que vio el seminario" por
 * separado cuando sus entregas NO coinciden. Cuando sí coinciden (ambos
 * vieron exactamente el mismo commit, como pasó la primera vez que el
 * seminario empezó a pedirlo), se marcan las dos de una sola corrida con
 * `ambos` -- ambas etiquetas apuntan al mismo commit, que es perfectamente
 * válido en git (un commit puede tener cuantas etiquetas quieras).
 *
 * Uso:
 *   node scripts/tag-review.js                 -> solo director (por defecto, como siempre)
 *   node scripts/tag-review.js director        -> solo director
 *   node scripts/tag-review.js seminario       -> solo seminario
 *   node scripts/tag-review.js ambos           -> director Y seminario (mismo commit)
 *   node scripts/tag-review.js director seminario  -> equivalente a `ambos`
 *   npm run tag:review                         -> solo director
 *   npm run tag:seminario                      -> solo seminario
 *   npm run tag:ambos                          -> ambos
 *   npm run tag:review -- seminario            -> (o pasa el argumento tú mismo)
 *
 * Cada etiqueta queda como <prefijo>-YYYY-MM-DD (si ya existe una con esa
 * fecha, agrega un sufijo -2, -3, ... para no chocar).
 *
 * IMPORTANTE (corregido 2026-09-01): la etiqueta se crea ANOTADA
 * (`git tag -a ... -m ...`), no "ligera" (`git tag ...` a secas). Esto
 * importa porque `push.followTags` (configurado en este repo para que
 * un `git push` normal también suba las etiquetas, ver CLAUDE.md)
 * **solo sube etiquetas anotadas** -- es una regla de git, no algo que
 * se pueda ajustar con configuración. Con una etiqueta ligera (como
 * generaba una versión anterior del script), `push.followTags` no
 * hacía nada y la etiqueta se quedaba solo en la máquina, sin subir
 * nunca sola -- se comprobó armando un repo de prueba: la ligera nunca
 * llegó al remoto después de varios `git push` con followTags activo,
 * la anotada sí, en el primer push. Si ya tienes etiquetas viejas
 * creadas como ligeras (por ejemplo con esa versión anterior del
 * script) que no aparecen en GitHub, hay que subirlas una vez a mano
 * con `git push origin <nombre-de-la-etiqueta>` -- después de eso, las
 * que cree esta versión corregida del script sí subirán solas.
 */
const { execSync } = require("child_process");

function sh(cmd) {
  return execSync(cmd, { encoding: "utf8" }).trim();
}

// Configuración de cada destinatario: prefijo de la etiqueta y cómo se
// describe en el mensaje anotado. Para agregar un tercer destinatario en
// el futuro basta con sumar una entrada aquí (y, si se quiere, un script
// npm de atajo en package.json).
const DESTINATARIOS = {
  director: {
    prefijo: "envio-director",
    descripcion: "al director",
  },
  seminario: {
    prefijo: "envio-seminario",
    descripcion: "al seminario de protocolo de tesis",
  },
};

// Resuelve los argumentos a una lista de claves de DESTINATARIOS, sin
// repetidos. Sin argumentos -> solo director (comportamiento histórico).
// `ambos` / `both` / `todos` -> todos los destinatarios.
function parseDestinatarios(argv) {
  const args = argv.slice(2).map((a) => a.toLowerCase());
  if (args.length === 0) return ["director"];

  const seleccion = new Set();
  for (const arg of args) {
    if (arg === "ambos" || arg === "both" || arg === "todos") {
      Object.keys(DESTINATARIOS).forEach((k) => seleccion.add(k));
    } else if (DESTINATARIOS[arg]) {
      seleccion.add(arg);
    } else {
      console.error(
        `Argumento no reconocido: "${arg}". Opciones válidas: ` +
          `${Object.keys(DESTINATARIOS).join(", ")}, ambos.`
      );
      process.exit(1);
    }
  }
  // Devolver en el orden fijo de DESTINATARIOS (no en el orden en que se
  // escribieron), para que la salida sea siempre predecible.
  return Object.keys(DESTINATARIOS).filter((k) => seleccion.has(k));
}

// Crea una etiqueta anotada <prefijo>-YYYY-MM-DD en HEAD, con sufijo
// numérico si ya existe una con esa fecha. Devuelve el nombre creado.
function crearEtiqueta({ prefijo, descripcion }, today) {
  const base = `${prefijo}-${today}`;
  let tagName = base;
  let n = 2;

  const existing = sh(`git tag --list "${prefijo}-*"`).split("\n").filter(Boolean);
  while (existing.includes(tagName)) {
    tagName = `${base}-${n}`;
    n += 1;
  }

  sh(`git tag -a ${tagName} -m "Envío de avances ${descripcion} (${today})"`);
  return tagName;
}

function main() {
  const claves = parseDestinatarios(process.argv);
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const creadas = claves.map((clave) => ({
    clave,
    tag: crearEtiqueta(DESTINATARIOS[clave], today),
  }));

  for (const { clave, tag } of creadas) {
    console.log(`Listo: se creó la etiqueta anotada "${tag}" (${clave}) apuntando al commit actual (HEAD).`);
  }
  if (creadas.length > 1) {
    console.log(`Ambas etiquetas apuntan al mismo commit (las entregas coincidieron).`);
  }
  for (const { clave, tag } of creadas) {
    console.log(`Para ver solo lo que cambió desde "${tag}": npm run diff -- ${clave}`);
  }
  console.log(`Al hacer "git push" normal, estas etiquetas se suben solas (push.followTags ya configurado).`);
}

main();
