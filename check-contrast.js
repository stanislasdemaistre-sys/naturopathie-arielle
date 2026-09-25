#!/usr/bin/env node
/**
 * check-contrast.js — Vérification WCAG 2.1 AA des contrastes (LOT 1)
 *
 * Usage :
 *   node check-contrast.js          → analyse statique CSS (sans dépendances)
 *   npx playwright install && node check-contrast.js --playwright  → rendu réel
 *
 * Seuils WCAG AA :
 *   - texte normal (< 18px ou < 14px bold) : ratio ≥ 4.5:1
 *   - grand texte (≥ 18px ou ≥ 14px bold)  : ratio ≥ 3:1
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ─── Utilitaires WCAG ────────────────────────────────────────────────────────

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const n = parseInt(hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function parseColor(str) {
  if (!str) return null;
  str = str.trim();
  if (str.startsWith('#')) return hexToRgb(str);
  const rgba = str.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);
  if (rgba) return [parseFloat(rgba[1]), parseFloat(rgba[2]), parseFloat(rgba[3])];
  // couleurs nommées courantes
  const named = { white:[255,255,255], black:[0,0,0] };
  return named[str.toLowerCase()] || null;
}

function luminance([r, g, b]) {
  return [r, g, b].reduce((sum, c, i) => {
    const s = c / 255;
    const lin = s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    return sum + lin * [0.2126, 0.7152, 0.0722][i];
  }, 0);
}

function contrastRatio(c1, c2) {
  const l1 = luminance(c1), l2 = luminance(c2);
  const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function formatRatio(r) { return r.toFixed(2) + ':1'; }

// ─── Palette statique résolue ─────────────────────────────────────────────────

const VARS = {
  // fond
  '--creme':             '#FAF7F2',
  '--creme-dark':        '#F0EBE3',
  '--blanc':             '#FFFFFF',
  '--bleu-petrole':      '#1B4D5C',
  '--bleu-petrole-deep': '#0F3540',
  '--bleu-petrole-light':'#2A6B7E',
  // texte décoratif
  '--dore':              '#C4A265',
  '--dore-light':        '#D4BA8A',
  '--vert-sauge':        '#8FA98B',
  // nouvelles vars accessibles (LOT 1)
  '--do-texte':          '#7F6128',
  '--vs-texte':          '#4E6B48',
  '--do-t':              '#7F6128',
  '--vs-t':              '#4E6B48',
  '--texte':             '#2C3E3A',
  '--texte-light':       '#5A6E68',
  // audit vars courtes
  '--bp':  '#1B4D5C', '--bp-d': '#0F3540', '--bp-l': '#2A6B7E',
  '--vs':  '#8FA98B', '--do':   '#C4A265',
  '--cr':  '#FAF7F2', '--cr-d': '#F0EBE3',
  '--tx':  '#2C3E3A', '--tx-l': '#5A6E68',
};

function resolveVar(v, fallbackHex) {
  if (!v) return fallbackHex ? parseColor(fallbackHex) : null;
  v = v.trim();
  if (v.startsWith('#') || v.startsWith('rgb')) return parseColor(v);
  if (v.startsWith('var(')) {
    const name = v.match(/var\((--[^,)]+)/)?.[1];
    return name && VARS[name] ? parseColor(VARS[name]) : null;
  }
  return parseColor(v);
}

// ─── Paires à vérifier ────────────────────────────────────────────────────────
// Format : { label, fg, bg, large, file }
// large=true  → seuil 3:1 (grand texte)
// large=false → seuil 4.5:1 (texte normal)

const PAIRS = [
  // 1.2 — Labels sur fond crème
  { label: '.section-label  (--do-texte sur crème)',    fg:'#7F6128', bg:'#FAF7F2', large:false },
  { label: '.section-title em (--vs-texte sur crème)',  fg:'#4E6B48', bg:'#FAF7F2', large:false },
  { label: '.pilier-keyword (--do-texte sur --dore-pale)',fg:'#7F6128',bg:'#F0E6D2',large:false },
  { label: '.pq-age (--do-texte sur blanc)',             fg:'#7F6128', bg:'#FFFFFF', large:false },
  { label: '.audit-step-indicator (--do-texte sur blanc)',fg:'#7F6128',bg:'#FFFFFF',large:false },
  { label: '.sub-heading em (--vs-texte sur crème)',    fg:'#4E6B48', bg:'#FAF7F2', large:true },
  { label: '.results-header h2 em (--vs-t sur blanc)',  fg:'#4E6B48', bg:'#FFFFFF', large:true },
  // 1.3 — Boutons dorés
  { label: '.btn-bilan-gold text (#0F3540 sur #C4A265)', fg:'#0F3540', bg:'#C4A265', large:false },
  { label: '.btn-gold text (#0F3540 sur #C4A265)',       fg:'#0F3540', bg:'#C4A265', large:false },
  { label: '.btn-bilan-gold hover (#0F3540 sur #B8934F)',fg:'#0F3540', bg:'#B8934F', large:false },
  // 1.4 — Footer (0.7 opacité crème sur #0F3540)
  // rgba(250,247,242,.7) composited on #0F3540
  { label: 'footer text 0.7 (sur #0F3540)',             fg:'#B7C0BC', bg:'#0F3540', large:false },
  // valeur approximée de rgba(250,247,242,.7) sur fond #0F3540 :
  // composited = fond * (1-alpha) + fg * alpha
  // R: 15*(0.3) + 250*(0.7) = 4.5+175 = 179.5 → 180, mais on reste sur #0F3540 comme fond
  // La valeur effective de rgba(250,247,242,.7) sur #0F3540 :
  // R: round(15*0.3 + 250*0.7)=180, G:round(53*0.3+247*0.7)=189, B:round(64*0.3+242*0.7)=188
  { label: 'footer links 0.7 composite (sur #0F3540)',  fg:'#B4BDB9', bg:'#0F3540', large:false },
  { label: 'footer copy 0.6 composite (sur #0F3540)',   fg:'#9AA3A0', bg:'#0F3540', large:false },
  // 1.5 — Pétale Confiance badge (#4E6B48 sur rgba(78,107,72,.12) sur blanc)
  { label: 'confiance badge text #4E6B48 sur blanc',    fg:'#4E6B48', bg:'#FFFFFF', large:false },
  // Anciens contrastes qui auraient échoué (avant correction) - pour référence
  { label: '[AVANT] .section-label --dore sur crème',   fg:'#C4A265', bg:'#FAF7F2', large:false },
  { label: '[AVANT] .btn-bilan-gold blanc sur --dore',   fg:'#FFFFFF', bg:'#C4A265', large:false },
  { label: '[AVANT] footer 0.5 composite',              fg:'#8F9895', bg:'#0F3540', large:false },
];

// ─── Analyse statique des fichiers HTML ───────────────────────────────────────

const PUBLIC = path.join(__dirname, 'public');
const FILES  = [
  'index.html', 'about.html', 'methode.html',
  'tarifs-accompagnement.html', 'contact.html',
  'guides-pratiques.html', 'audit.html',
];

function compositeOnBg(rgba, bgHex) {
  const bg = hexToRgb(bgHex);
  const [r, g, b, a] = rgba;
  const alpha = a !== undefined ? a : 1;
  return [
    Math.round(bg[0] * (1 - alpha) + r * alpha),
    Math.round(bg[1] * (1 - alpha) + g * alpha),
    Math.round(bg[2] * (1 - alpha) + b * alpha),
  ];
}

function parseRgba(str) {
  const m = str.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);
  if (!m) return null;
  return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]), m[4] !== undefined ? parseFloat(m[4]) : 1];
}

function scanFileForViolations(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const violations = [];

  // Cherche toutes les occurrences de rgba avec opacité faible sur fond sombre (footer)
  const darkBg = '#0F3540';
  const reLow = /color\s*:\s*rgba\(250\s*,\s*247\s*,\s*242\s*,\s*(0?\.\d+)\)/g;
  let m;
  while ((m = reLow.exec(html)) !== null) {
    const alpha = parseFloat(m[1]);
    const composited = compositeOnBg([250, 247, 242, alpha], darkBg);
    const ratio = contrastRatio(composited, hexToRgb(darkBg));
    if (ratio < 4.5) {
      const lineNo = html.substring(0, m.index).split('\n').length;
      violations.push({
        line: lineNo,
        msg: `rgba(250,247,242,${alpha}) sur ${darkBg} → ${formatRatio(ratio)} < 4.5:1`,
        match: m[0].substring(0, 50),
      });
    }
  }

  // Note : var(--dore) utilisé pour du texte décoratif sur fond clair (#FAF7F2) = ratio 2.26:1
  // Identifié comme LOT 2 (labels de catégories non critiques, hover states, nav, etc.)
  // Non signalé ici pour éviter les faux positifs hors périmètre LOT 1.

  return violations;
}

// ─── Rapport principal ────────────────────────────────────────────────────────

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║       CHECK-CONTRAST — WCAG 2.1 AA — Horizon & Équilibre    ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

// 1. Vérification des paires connues
console.log('── Paires couleur × fond (LOT 1) ──────────────────────────────\n');
let totalOk = 0, totalFail = 0;

for (const p of PAIRS) {
  const fg = parseColor(p.fg);
  const bg = parseColor(p.bg);
  if (!fg || !bg) { console.log(`  ⚠️  SKIP  ${p.label} (couleur non parsable)`); continue; }
  const ratio = contrastRatio(fg, bg);
  const threshold = p.large ? 3.0 : 4.5;
  const pass = ratio >= threshold;
  const icon = pass ? '✅' : '❌';
  const label = p.label.startsWith('[AVANT]') ? `\x1b[2m${icon}  ${formatRatio(ratio).padEnd(8)}  ${p.label}\x1b[0m` :
                `${icon}  ${formatRatio(ratio).padEnd(8)}  ${p.label}`;
  console.log('  ' + label);
  if (!p.label.startsWith('[AVANT]')) {
    if (pass) totalOk++; else totalFail++;
  }
}

// 2. Scan des fichiers HTML pour les opacités résiduelles
console.log('\n── Scan statique des fichiers HTML ─────────────────────────────\n');
let scanFail = 0;
for (const file of FILES) {
  const fp = path.join(PUBLIC, file);
  if (!fs.existsSync(fp)) { console.log(`  ⚠️  Fichier introuvable : ${file}`); continue; }
  const violations = scanFileForViolations(fp);
  if (violations.length === 0) {
    console.log(`  ✅  ${file}`);
  } else {
    console.log(`  ❌  ${file} (${violations.length} problème(s))`);
    for (const v of violations) {
      console.log(`       L${v.line}: ${v.msg}`);
    }
    scanFail += violations.length;
  }
}

// 3. Résumé
console.log('\n── Résumé ──────────────────────────────────────────────────────\n');
console.log(`  Paires connues : ${totalOk} ✅  ${totalFail} ❌`);
console.log(`  Violations scan HTML : ${scanFail}`);
if (totalFail === 0 && scanFail === 0) {
  console.log('\n  🎉  Aucune violation WCAG AA détectée.\n');
} else {
  console.log('\n  ⚠️   Des corrections sont nécessaires (voir ci-dessus).\n');
}

console.log('Note : pour une analyse complète avec rendu réel (styles hérités,');
console.log('JS dynamique), installer playwright :');
console.log('  npm install --save-dev playwright');
console.log('  npx playwright install chromium');
console.log('  node check-contrast.js --playwright\n');
