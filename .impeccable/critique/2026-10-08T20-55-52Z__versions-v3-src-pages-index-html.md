---
target: v3 (accueil + pages)
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Users\\PMFwe\\Claude\\maison-antoine\\versions\\v3\\src\\pages\\index.html"
target_fingerprint: "sha256:df3bc7d4d4275f0dcf3ee1da3552169d6253dcaaf67247677b44013f9e41493c"
target_path: "C:\\Users\\PMFwe\\Claude\\maison-antoine\\versions\\v3\\src\\pages\\index.html"
timestamp: 2026-10-08T20-55-52Z
slug: versions-v3-src-pages-index-html
---
Method: dual-agent (A: design review · B: detector + browser)

## Design Health Score — 21/32 (66 %, Acceptable) — précédent 20/32
| # | Heuristique | Note | Problème clé |
|---|---|---|---|
| 1 | État du système | 2 | Point doré des horaires lu comme voyant « ouvert » mais statique ; formulaire sans envoi réel |
| 2 | Langage réel | 3 | « jeu – sam » abrégé ; « 5100 Namur » vs « Jambes (Namur) » |
| 3 | Contrôle | 3 | Vidéos en boucle sans pause (WCAG 2.2.2) |
| 4 | Cohérence | 2 | Bandeau « Poussez la porte » + bouton rendez-vous ; CTA nav pointe sur la page contact elle-même |
| 5 | Prévention d'erreurs | 2 | Formulaire d'apparence active mais non branché (VOTRE_ID) |
| 6 | Reconnaissance | 3 | Horaires partout ; aucune carte / itinéraire / parking |
| 7 | Flexibilité | n/a | Site vitrine |
| 8 | Esthétique | 3 | Chaud et calme ; titre « discover » de deux phrases, bandeau de chiffres gabarit |
| 9 | Récupération | 3 | Erreur du formulaire honnête avec repli téléphone |
| 10 | Aide | n/a | WhatsApp + téléphone couvrent ce rôle |

## Spécificité
~70 % propre à la Maison (photos, reels, vocabulaire, horaires, pré-qualification WhatsApp adressée à Marie-Frédérique), ~30 % gabarit Sanz (chiffres, carte Galerie, lignes numérotées). La chaleur vient de la palette et des photos.
Détecteur : 39 alertes — 32 espacements = faux positifs (moteur statique, clamp/padding-block), 6 « palette crème » = choix demandé, 1 interlignage de citation display = faux positif. Navigateur : h1 surdimensionné (choix), rythme titres (faux positif).

## Priorités
1. [P0 — corrigé pendant la revue] Lignes des quatre temps cassées sur mobile (règle vidéo verticale trop spécifique). Corrigé : grille réservée au desktop, vidéo centrée ~60 % sur mobile.
2. [P1] Le bouton principal mène à un formulaire non branché : brancher l'envoi, ou mettre téléphone/WhatsApp en avant tant qu'il ne l'est pas ; ajouter un créneau souhaité (lun–mer, atelier / domicile). → harden
3. [P1] La visite n'est jamais concrétisée : lien Itinéraire à côté des horaires (hero, bandeau), « Jambes · av. Jean Materne 70 » sur l'accueil, carte/accès sur Contact, adresse unifiée « Jambes (Namur) ». → clarify
4. [P2] Ligne au-dessus du titre du hero sous AA (2,7–3,7:1 sur Savoir-faire/Contact) ; point doré trompeur. → polish
5. [P2] Bandeau de chiffres = remplissage ; « 15 éditeurs » fragile (« et bien d'autres ») ; Marie-Frédérique et Claude absents de l'accueil. → distill

## Personas
- Première visite : ne comprend pas en 5 s que c'est un tapissier (rideaux, stores, sièges) ; « matériauthèque » jamais expliqué.
- Mobile : lignes cassées (corrigé), hero plus haut que l'écran, WhatsApp chevauche du contenu.
- Testeur : formulaire en erreur, 6 liens reels au même libellé, bordures de champs ~1,15:1, ancres masquées par la barre fixe.
- Propriétaire 50+ : petits libellés clairs, abréviations, pas d'e-mail, pas de carte, pas de visages sur l'accueil.

## Mineurs
Vidéos avec incrustations Instagram et sans pause ; défilement fluide ignore « réduire les animations » ; liens de 24 px de haut ; réutilisation de photos (ma-09 = Claude et « pose de stores », ma-10 deux légendes) ; colonnes de la galerie inégales ; lien « Découvrir la galerie » qui flotte ; CSS data-reveal inutilisé.

## Questions
- Pourquoi la carte « Galerie » plutôt que « Jambes · Itinéraire » dans le hero ?
- Marie-Frédérique est la marque : pourquoi absente de l'accueil jusqu'aux reels ?
- Le site perdrait-il quelque chose sans le bandeau de chiffres ni la carte Galerie ?
