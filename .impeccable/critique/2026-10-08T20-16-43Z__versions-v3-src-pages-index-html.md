---
target: v3 (accueil + pages)
total_score: 20
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 2
target_identity: "file:C:\\Users\\PMFwe\\Claude\\maison-antoine\\versions\\v3\\src\\pages\\index.html"
target_fingerprint: "sha256:49eb20f9937b3354ee7781a8eea1af20169eb510b8aa3659a03ad455ebe9ff2e"
target_path: "C:\\Users\\PMFwe\\Claude\\maison-antoine\\versions\\v3\\src\\pages\\index.html"
timestamp: 2026-10-08T20-16-43Z
slug: versions-v3-src-pages-index-html
---
Method: dual-agent (A: design review · B: detector + browser)

## Design Health Score — 20/32 (62 %, Acceptable)

| # | Heuristique | Note | Problème clé |
|---|---|---|---|
| 1 | Visibilité de l'état | 3 | Rien n'indique « ouvert aujourd'hui » alors que l'action principale dépend du jour |
| 2 | Correspondance au réel | 3 | Copy chaleureuse ; la carte hero « Galerie » ne promet rien |
| 3 | Contrôle utilisateur | 3 | Menu et WhatsApp se ferment bien ; carte hero sous le bouton WhatsApp sur mobile |
| 4 | Cohérence | 2 | « 5100 Namur » (pied) vs « 5100 Jambes (Namur) » (contact) ; « sans rendez-vous » + bouton « Prendre rendez-vous » |
| 5 | Prévention des erreurs | 2 | Formulaire branché sur `VOTRE_ID` mais d'apparence active |
| 6 | Reconnaissance > rappel | 2 | Horaires absents du hero, du pied de page et du menu mobile ; pas de lien itinéraire |
| 7 | Flexibilité | n/a | Site vitrine |
| 8 | Esthétique minimaliste | 3 | Calme et soigné ; vides dans les lignes, scroll mobile très long |
| 9 | Récupération d'erreur | 2 | Message de repli, mais seul le téléphone est proposé |
| 10 | Aide | n/a | Site vitrine |

## Verdict de spécificité
Fidèle à Sanz, presque trop : sans les photos et les mots, c'est le gabarit Sanz recoloré. La marque vit dans le contenu (photos réelles, Century Gothic, « matériauthèque », 1895), pas dans la structure. Deux transpositions réussies : les témoignages devenus reels Instagram (rien d'inventé), des chiffres réels. Deux qui nuisent : le modèle de conversion « Book Now » conservé, et un registre plus froid que la référence.
Détecteur : 41 alertes. 38 « cramped-padding » = faux positifs (le moteur statique lit `padding-block`/`clamp()` comme 0 ; détecteur navigateur : 0). Réels : titre sauté sur Savoir-faire (h1 → h3), interlignage serré sur 2 grands textes (mineur). En navigateur : h1 surdimensionné (choix assumé), rythme des titres (faux positif, chaque h2 est lié à son label).

## Priorités
1. [P0] L'action principale est invisible et les boutons poussent l'inverse : nav et bandeau disent « Prendre rendez-vous » alors que la promesse est « sans rendez-vous » ; ≤480 px le hero n'a aucune action. Fix : ligne de visite dans le hero, carte hero → carte visite (adresse, jeu–sam 10h–18h, Itinéraire), bouton principal « Venir à l'atelier », rendez-vous en lien secondaire, horaires dans pied de page et menu mobile. → clarify + layout
2. [P1] Registre froid contraire au brief : quasi-blanc + vert + pied noir, vidéos des étapes en noir et blanc, photos assombries. Fix : fond lin chaud, pied de page brun/vert chaud, visuels d'étapes en couleur, accent sable/or, voile du bandeau allégé. → colorize
3. [P1] Vides hérités des lignes Sanz : ~200 px entre titre et texte (accueil, savoir-faire, portraits). Fix : texte aligné sous le titre, média moins haut, numéro intégré au titre sur mobile. → layout
4. [P2] Confiance et contact : Namur/Jambes incohérent, pas de lien Maps, formulaire factice, contour de focus vert invisible sur fonds sombres. → harden
5. [P3] Libellés : label « La Maison » au-dessus de la matériauthèque, « Suivez @… » en H2 pleine largeur, titre manquant sur Savoir-faire. → distill / polish

## Personas
- Jordan (première visite) : le premier écran ne dit pas ce que fait la Maison ; apprend qu'on peut entrer sans rendez-vous à ~75 % de la page.
- Casey (mobile) : pas d'action dans le hero, carte Galerie sous WhatsApp, horaires à ~5 300 px sur ~6 900, logo illisible dans la barre.
- Riley (stress) : formulaire `VOTRE_ID`, vidéos figées si l'autoplay est bloqué, 6 liens reels au même libellé.
- Propriétaire namurois 50+ : peu d'ancrages pratiques (qui vient, première visite, parking), petits labels gris, visages de Marie-Frédérique et Claude enfouis.

## Observations mineures
Filigrane « OINE - Décoration Antoine sprl » visible sur ma-12 ; bouton « La Maison » flottant 300 px sous son texte ; « 130+ ans » redondant avec 1895 ; carrousel Instagram sans affordance de défilement ; cibles tactiles < 44 px (icône Instagram, liens du pied).

## Questions
- Si l'essentiel est « venez jeudi–samedi, sans rendez-vous », pourquoi aucun bouton ne le dit ?
- La page d'accueil devrait-elle s'ouvrir sur des mains dans l'étoffe plutôt qu'une pièce sombre ?
- Qu'est-ce qui ferait se sentir attendu un visiteur de 60 ans à Jambes : un visage, un prénom ?
