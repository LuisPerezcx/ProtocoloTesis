#!/usr/bin/env node
/**
 * Crea una etiqueta de git para marcar "esto ya se lo mandé a mi director".
 * Uso:
 *   node scripts/tag-review.js
 *   npm run tag:review
 *
 * La etiqueta queda como envio-director-YYYY-MM-DD (si ya existe una con
 * esa fecha, agrega un sufijo -2, -3, ... para no chocar).
 *
 * IMPORTANTE (corregido 2026-09-01): la etiqueta se crea ANOTADA
 * (`git tag -a ... -m ...`), no "ligera" (`git tag ...` a secas). Esto
 * importa porque `push.followTags` (configurado en este repo para que
 * un `git push` normal también suba las etiquetas, ver CLAUDE.md)
 * **solo sube etiquetas anotadas** -- es una regla de git, no algo que
 * se pueda ajustar con configuración. Con una etiqueta ligera (como
 * generaba esta versión anterior del script), `push.followTags` no
 * hacía nada y la etiqueta se quedaba solo en la máquina, sin subir
 * nunca sola -- se comprobó armando un repo de prueba: la ligera nunca
 * llegó al remoto después de varios `git push` con followTags activo,
 * la anotada sí, en el primer push. Si ya tienes etiquetas viejas
 * creadas como ligeras (por ejemplo con esta versión anterior del
 * script) que no aparecen en GitHub, hay que subirlas una vez a mano
 * con `git push origin <nombre-de-la-etiqueta>` -- después de eso, las
 * que cree esta versión corregida del script sí subirán solas.
 */
const { execSync } = require("child_process");

function sh(cmd) {
  return execSync(cmd, { encoding: "utf8" }).trim();
}

const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
let base = `envio-director-${today}`;
let tagName = base;
let n = 2;

const existing = sh('git tag --list "envio-director-*"').split("\n").filter(Boolean);
while (existing.includes(tagName)) {
  tagName = `${base}-${n}`;
  n += 1;
}

sh(`git tag -a ${tagName} -m "Envío de avances al director (${today})"`);
console.log(`Listo: se creó la etiqueta anotada "${tagName}" apuntando al commit actual (HEAD).`);
console.log(`La próxima vez que corras "npm run diff", se comparará contra esta etiqueta por defecto.`);
console.log(`Al hacer "git push" normal, esta etiqueta se sube sola (push.followTags ya configurado).`);
