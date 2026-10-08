# Template bruderco.be

Structure complète récupérée depuis https://bruderco.be (WordPress + Elementor + WooCommerce)
pour servir de base/template, **sans images ni vidéos**.

## Aperçu local
Serveur lite-server déjà lancé : http://localhost:3003/bruderco-template/index.html

## Pages
| Page | Fichier |
|------|---------|
| Accueil | `index.html` |
| Fabrics | `fabrics.html` |
| Rugs | `rugs.html` |
| Gallery | `gallery.html` |
| Agents | `agents.html` |
| News | `news.html` |
| Contact | `contact.html` |

Les liens de navigation entre pages ont été réécrits en local (`.html`).

## Assets
- `assets/css/` — 47 feuilles de style (Elementor, WooCommerce, thème hello-elementor + child, fonts Google).
  Le style **spécifique au site** est dans les fichiers `*__uploads__elementor__css__post-*.css`
  (mise en page Elementor par page) et `*hello-elementor-child__style.css`.
- `assets/js/` — 33 scripts (jQuery, Elementor frontend, WooCommerce, filtres produits…).

Tous les `<link>`/`<script>` pointent désormais vers ces copies locales.

## Notes
- **Images & vidéos non téléchargées** (demande explicite). Les `<img>` pointent encore vers
  les URLs absolues de bruderco.be → l'aperçu reste visuel tant que le site source est en ligne.
  À remplacer par les visuels Maison Antoine.
- Les polices Google sont en CSS local mais les fichiers `.woff2` ne sont pas téléchargés
  (fallback navigateur) — à récupérer si besoin du rendu typographique exact.
- `_raw/` contient le HTML original non réécrit + `assetmap.json` (mapping URL→local), utile
  pour re-télécharger ou diffuser.

## Prochaines étapes possibles
- Nettoyer le markup Elementor (très verbeux) page par page.
- Extraire un layout réutilisable (header/footer) au lieu du HTML dupliqué.
- Remplacer textes/images par le contenu Maison Antoine.
