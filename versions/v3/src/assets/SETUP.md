# À finaliser avant mise en ligne

## 1. Images (vraies photos Maison Antoine)

Le site utilise désormais les **vraies photos de la Maison Antoine**, reprises du projet de base :
- `src/assets/img/photos/` — `ma-hero.webp` + `ma-01..10.avif` (intérieurs, étoffes, réalisations).
- `src/assets/img/logos/` — les 15 logos des éditeurs partenaires.

Où elles apparaissent : hero + blocs « feature » + grille « matières » + Instagram (index),
galerie (galerie), portraits (la-maison), mur de logos (partenaires).

Pour en ajouter / remplacer : déposez le fichier dans `src/assets/img/photos/`, pointez le `src`
de l'`<img>` concerné dessus, puis `npm run build`. Formats : WEBP/AVIF/JPG, ~2000 px pour les
grandes images, ~1000 px pour les tuiles.

> Remarque : les `ma-01..10` ont été nommées génériquement (contenu non trié). Si vous voulez une
> photo précise à un endroit précis, indiquez-le et on réassigne.

## 2. Formulaire de contact

Le formulaire (`src/pages/contact.html`) est **prêt à brancher** mais pas encore actif.

Option simple — **Formspree** (gratuit pour un faible volume) :
1. Créez un compte sur https://formspree.io et un formulaire → vous obtenez un identifiant.
2. Remplacez `VOTRE_ID` dans `action="https://formspree.io/f/VOTRE_ID"`.
3. `npm run build`. Le premier envoi demandera une confirmation par e-mail.

Alternative : pointer l'`action` vers un webhook **n8n** et traiter l'envoi côté workflow.

Un champ anti-spam caché (`_gotcha`) et l'objet du mail (`_subject`) sont déjà en place.

## 3. Réseaux sociaux

Les liens Instagram / Facebook du pied de page pointent vers `#` — à compléter avec les vraies URLs.

## 4. Section Instagram (bas de la page d'accueil)

La grille 3×3 affiche pour l'instant des **images placeholder**. Deux options :

**A. Flux live qui se met à jour seul (recommandé)** — via un widget gratuit :
1. Compte sur **https://lightwidget.com** (ou https://behold.so), connecter `@maisonantoinenamur`.
2. On obtient un bout de code (`<script>` + `<iframe>`).
3. Dans `src/pages/index.html`, remplacer tout le bloc `<div class="ig-grid">…</div>` par cet embed.
4. `npm run build`.

> Note : impossible de coder « en dur » les 9 derniers posts — Instagram bloque l'accès automatisé
> et des posts figés deviendraient vite périmés. Le widget est la seule voie fiable pour un vrai flux.

**B. 9 visuels choisis à la main** — déposer 9 images dans `src/assets/img/` (ex. `insta-1.jpg`…`insta-9.jpg`)
et remplacer les `src` des 9 `.ig-tile`. Les liens pointent déjà vers le profil.
