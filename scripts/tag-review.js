#!/usr/bin/env node
/**
 * Crea una etiqueta de git para marcar "esto ya se lo mandé a mi director".
 * Uso:
 *   node scripts/tag-review.js
 *   npm run tag:review
 *
 * La etiqueta queda como envio-director-YYYY-MM-DD (si ya existe una con
 * esa fecha, agrega un sufijo -2, -3, ... para no chocar).
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

sh(`git tag ${tagName}`);
console.log(`Listo: se creó la etiqueta "${tagName}" apuntando al commit actual (HEAD).`);
console.log(`La próxima vez que corras "npm run diff", se comparará contra esta etiqueta por defecto.`);
