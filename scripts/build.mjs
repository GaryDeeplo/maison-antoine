// Build statique Maison Antoine : assemble les pages depuis des partials.
// Aucune dépendance externe. Sortie : dist/ (HTML statique, nav dans le markup).
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, cpSync, statSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// usage : node scripts/build.mjs [dossier-src] [dossier-dist]  (défaut : src → dist)
const src = join(root, process.argv[2] || 'src');
const dist = join(root, process.argv[3] || 'dist');

const read = (p) => readFileSync(p, 'utf8');

const layout = read(join(src, 'partials', 'layout.html'));
const header = read(join(src, 'partials', 'header.html'));
const footer = read(join(src, 'partials', 'footer.html'));

// thème optionnel (meta `theme:`) : partials `<nom>.<theme>.html` + CSS/JS `<theme>.css|js`
const themed = (name, theme, fallback) => {
  const p = join(src, 'partials', `${name}.${theme}.html`);
  return theme && statSync(p, { throwIfNoEntry: false }) ? read(p) : fallback;
};

// cache-buster : hash du CSS + JS, change uniquement quand ils changent
const ver = createHash('sha1')
  .update(read(join(src, 'assets', 'css', 'site.css')))
  .update(read(join(src, 'assets', 'js', 'site.js')))
  .update(readdirSync(join(src, 'assets', 'css')).map((f) => read(join(src, 'assets', 'css', f))).join(''))
  .update(readdirSync(join(src, 'assets', 'js')).map((f) => read(join(src, 'assets', 'js', f))).join(''))
  .digest('hex')
  .slice(0, 8);

// --- parse le bloc <!--meta ... --> en tête de chaque page ---
function parsePage(raw) {
  const m = raw.match(/^\s*<!--meta([\s\S]*?)-->/);
  const meta = {};
  let body = raw;
  if (m) {
    for (const line of m[1].trim().split('\n')) {
      const i = line.indexOf(':');
      if (i > -1) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
    body = raw.slice(m[0].length);
  }
  return { meta, body: body.trim() };
}

function render({ meta, body }) {
  const active = meta.active || '';
  const theme = meta.theme || '';
  const head = themed('header', theme, header);
  // marque le(s) lien(s) de nav actif(s) — desktop + mobile
  const nav = active
    ? head.replaceAll(`data-nav="${active}"`, `data-nav="${active}" aria-current="page"`)
    : head;
  return themed('layout', theme, layout)
    .replaceAll('{{title}}', meta.title || 'Maison Antoine')
    .replaceAll('{{description}}', meta.description || '')
    .replaceAll('{{v}}', ver)
    .replaceAll('{{active}}', active)
    .replace('{{header}}', nav)
    .replace('{{content}}', body)
    .replace('{{footer}}', themed('footer', theme, footer));
}

// --- (re)construit dist ---
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const pagesDir = join(src, 'pages');
const pages = readdirSync(pagesDir).filter((f) => f.endsWith('.html'));
for (const file of pages) {
  const out = render(parsePage(read(join(pagesDir, file))));
  writeFileSync(join(dist, file), out, 'utf8');
}

// copie les assets tels quels
const assetsSrc = join(src, 'assets');
if (statSync(assetsSrc, { throwIfNoEntry: false })) {
  cpSync(assetsSrc, join(dist, 'assets'), { recursive: true });
}

// copie le service worker auto-destructeur à la racine du site servi
const swSrc = join(root, 'sw.js');
if (statSync(swSrc, { throwIfNoEntry: false })) {
  cpSync(swSrc, join(dist, 'sw.js'));
}

console.log(`✓ ${pages.length} pages générées dans dist/ :`, pages.map((p) => basename(p)).join(', '));
