#!/usr/bin/env node
// ============================================================
// lecturas.js
// Genera la bitacora de lecturas CITADAS del protocolo a partir del .bib.
//
// Fuente de verdad: protocolo/referencias/bibliografia.bib (regla del
// proyecto: ahi solo vive lo que ya se cita o se citara de inmediato).
// El script no inventa nada: solo lista las entradas del .bib que de
// verdad aparecen citadas en protocolo/secciones/*.tex, y cruza cada una
// con la carpeta de PDFs.
//
// Salida:
//   - articulos/lecturas.csv  (abre en Excel; tambien alimenta el Google Sheet)
//   - un reporte de consistencia por consola (huecos a revisar).
//
// No tiene dependencias: solo modulos nativos de Node. Igual que los demas
// scripts de este repo, se corre con `npm run lecturas`.
// ============================================================

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BIB = path.join(ROOT, 'protocolo', 'referencias', 'bibliografia.bib');
const SECCIONES = path.join(ROOT, 'protocolo', 'secciones');
const PDFS = path.join(ROOT, 'articulos', 'pdfs');
const OUT_CSV = path.join(ROOT, 'articulos', 'lecturas.csv');

// ---------- utilidades de limpieza ----------
function cleanBraces(s) {
  if (!s) return '';
  return s
    .replace(/[{}]/g, '')
    .replace(/\\&/g, '&')
    .replace(/---/g, '—')
    .replace(/--/g, '–')
    .replace(/~/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function familyName(author) {
  const a = author.replace(/[{}]/g, '').trim();
  if (a.includes(',')) return a.split(',')[0].trim();
  return a; // nombre de organizacion (ej. "BBC News")
}

function formatAuthors(authorField) {
  if (!authorField) return '';
  const authors = authorField.split(/\s+and\s+/).map(familyName).filter(Boolean);
  if (authors.length === 0) return '';
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
  return `${authors[0]} et al.`;
}

// ---------- parser de .bib ----------
function parseFields(s) {
  const fields = {};
  let i = 0;
  const n = s.length;
  while (i < n) {
    while (i < n && /[\s,]/.test(s[i])) i++;
    if (i >= n) break;
    let name = '';
    while (i < n && /[A-Za-z0-9_-]/.test(s[i])) { name += s[i]; i++; }
    while (i < n && /\s/.test(s[i])) i++;
    if (s[i] !== '=') { while (i < n && s[i] !== ',') i++; continue; }
    i++;
    while (i < n && /\s/.test(s[i])) i++;
    let val = '';
    if (s[i] === '{') {
      let depth = 0;
      for (; i < n; i++) {
        if (s[i] === '{') { depth++; if (depth === 1) continue; }
        else if (s[i] === '}') { depth--; if (depth === 0) { i++; break; } }
        val += s[i];
      }
    } else if (s[i] === '"') {
      i++;
      while (i < n && s[i] !== '"') { val += s[i]; i++; }
      i++;
    } else {
      while (i < n && s[i] !== ',') { val += s[i]; i++; }
    }
    if (name) fields[name.toLowerCase()] = val.trim();
  }
  return fields;
}

function parseBib(text) {
  const entries = [];
  const re = /@(\w+)\s*\{/g;
  let m;
  while ((m = re.exec(text))) {
    const type = m[1].toLowerCase();
    if (['comment', 'string', 'preamble'].includes(type)) continue;
    let depth = 0;
    let j = re.lastIndex - 1; // posicion de la '{' de apertura
    const open = j;
    for (; j < text.length; j++) {
      if (text[j] === '{') depth++;
      else if (text[j] === '}') { depth--; if (depth === 0) break; }
    }
    const body = text.slice(open + 1, j);
    const commaIdx = body.indexOf(',');
    if (commaIdx === -1) { re.lastIndex = j + 1; continue; }
    const key = body.slice(0, commaIdx).trim();
    const fields = parseFields(body.slice(commaIdx + 1));
    entries.push({ type, key, fields });
    re.lastIndex = j + 1;
  }
  return entries;
}

function venueOf(entry) {
  const f = entry.fields;
  switch (entry.type) {
    case 'article': return cleanBraces(f.journaltitle || f.journal || '');
    case 'inproceedings': return cleanBraces(f.booktitle || '');
    case 'misc': return cleanBraces(f.note || f.howpublished || '');
    case 'online': return cleanBraces(f.note || f.howpublished || 'En linea');
    default: return cleanBraces(f.journaltitle || f.booktitle || f.note || '');
  }
}

function linkOf(entry) {
  const f = entry.fields;
  if (f.doi) return `https://doi.org/${f.doi.replace(/[{}]/g, '').trim()}`;
  if (f.url) return f.url.replace(/[{}]/g, '').trim();
  return '';
}

function yearOf(entry) {
  const f = entry.fields;
  if (f.year) return f.year.replace(/[{}]/g, '').trim();
  if (f.date) return f.date.replace(/[{}]/g, '').trim().slice(0, 4);
  return '';
}

// ---------- deteccion de citas por seccion ----------
const HEAD_RE = /\\(subsubsection|subsection|section)\*?\{([^}]*)\}/g;
const CITE_RE = /\\(?:parencite|textcite|autocite|footcite|cite)(?:\[[^\]]*\])*\{([^}]*)\}/g;

function scanCitations() {
  const citedBy = {}; // key -> Set de etiquetas de seccion
  const files = fs.readdirSync(SECCIONES).filter(f => f.endsWith('.tex')).sort();
  for (const file of files) {
    const text = fs.readFileSync(path.join(SECCIONES, file), 'utf8');
    const markers = [];
    let m;
    HEAD_RE.lastIndex = 0;
    while ((m = HEAD_RE.exec(text))) {
      markers.push({ idx: m.index, kind: 'head', level: m[1], title: cleanBraces(m[2]) });
    }
    CITE_RE.lastIndex = 0;
    while ((m = CITE_RE.exec(text))) {
      const keys = m[1].split(',').map(k => k.trim()).filter(Boolean);
      markers.push({ idx: m.index, kind: 'cite', keys });
    }
    markers.sort((a, b) => a.idx - b.idx);
    let section = '';
    let subsection = '';
    for (const mk of markers) {
      if (mk.kind === 'head') {
        if (mk.level === 'section') { section = mk.title; subsection = ''; }
        else if (mk.level === 'subsection') { subsection = mk.title; }
        // subsubsection: no lo usamos como etiqueta principal
      } else {
        const label = subsection || section || file.replace(/\.tex$/, '');
        for (const k of mk.keys) {
          if (!citedBy[k]) citedBy[k] = new Set();
          citedBy[k].add(label);
        }
      }
    }
  }
  return citedBy;
}

// ---------- PDFs ----------
function scanPdfs() {
  if (!fs.existsSync(PDFS)) return [];
  return fs.readdirSync(PDFS)
    .filter(f => f.toLowerCase().endsWith('.pdf'))
    .map(f => f.replace(/\.pdf$/i, ''));
}

// ---------- CSV ----------
function csvCell(v) {
  const s = String(v == null ? '' : v);
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}
function toCsv(rows) {
  return '﻿' + rows.map(r => r.map(csvCell).join(',')).join('\r\n') + '\r\n';
}

// ---------- main ----------
function main() {
  const bibText = fs.readFileSync(BIB, 'utf8');
  const entries = parseBib(bibText);
  const byKey = {};
  for (const e of entries) byKey[e.key] = e;

  const citedBy = scanCitations();
  const pdfBasenames = scanPdfs();
  const pdfSet = new Set(pdfBasenames);

  const citedKeys = Object.keys(citedBy).sort();

  // filas: solo lo CITADO que ademas existe en el .bib
  const header = ['Clave', 'Autores', 'Anio', 'Titulo', 'Tipo', 'Venue', 'DOI / Link', 'Citado en', 'PDF'];
  const rows = [header];
  const missingPdf = [];
  const citedNotInBib = [];

  for (const key of citedKeys) {
    const e = byKey[key];
    if (!e) { citedNotInBib.push(key); continue; }
    const hasPdf = pdfSet.has(key);
    if (!hasPdf) missingPdf.push(key);
    rows.push([
      key,
      formatAuthors(e.fields.author || e.fields.editor || ''),
      yearOf(e),
      cleanBraces(e.fields.title || ''),
      e.type,
      venueOf(e),
      linkOf(e),
      Array.from(citedBy[key]).sort().join('; '),
      hasPdf ? 'Si' : 'FALTA',
    ]);
  }

  fs.writeFileSync(OUT_CSV, toCsv(rows), 'utf8');

  // entradas en el bib que NO se citan (solo informativo)
  const notCited = entries.map(e => e.key).filter(k => !citedBy[k]).sort();
  // PDFs que no corresponden a ninguna clave del bib
  const orphanPdfs = pdfBasenames.filter(b => !byKey[b]).sort();

  // ---------- reporte ----------
  const n = rows.length - 1;
  console.log(`\n  Bitacora de lecturas citadas  ->  ${path.relative(ROOT, OUT_CSV)}`);
  console.log(`  ${n} articulo(s) citado(s) en el protocolo.\n`);

  const col = rows.slice(1).map(r => ({ clave: r[0], cit: r[7], pdf: r[8] }));
  const w = Math.max(...col.map(r => r.clave.length), 5);
  for (const r of col) {
    const flag = r.pdf === 'Si' ? 'PDF ok ' : 'sin PDF';
    console.log(`  ${r.clave.padEnd(w)}  [${flag}]  ${r.cit}`);
  }

  console.log('\n  --- Chequeo de consistencia ---');
  if (citedNotInBib.length)
    console.log(`  [ERROR] citado en el .tex pero NO esta en el .bib: ${citedNotInBib.join(', ')}`);
  if (missingPdf.length)
    console.log(`  [falta PDF] citado pero sin articulos/pdfs/<clave>.pdf: ${missingPdf.join(', ')}`);
  if (orphanPdfs.length)
    console.log(`  [PDF huerfano] en pdfs/ pero no corresponde a ninguna clave: ${orphanPdfs.join(', ')}`);
  if (notCited.length)
    console.log(`  [info] en el .bib pero aun sin citar (no entran a la tabla): ${notCited.join(', ')}`);
  if (!citedNotInBib.length && !missingPdf.length && !orphanPdfs.length)
    console.log('  Todo en orden.');
  console.log('');
}

main();
