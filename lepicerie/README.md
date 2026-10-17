# La table de l'épicerie — site vitrine

Site one-page (HTML/CSS/JS statique, sans build) pour le restaurant
**La table de l'épicerie**, Av. du Bourgmestre Jean Materne 47, 5100 Namur (Jambes).

## Structure

```
lepicerie/
├── index.html      # page unique : accueil, le lieu, l'ardoise, la carte, infos
├── css/style.css
├── js/main.js      # menu mobile, filtres de la carte, animations
└── images/         # photos recadrées et compressées
```

## Voir en local

Depuis la racine du dépôt : `npm run dev`, puis ouvrir http://localhost:3000/lepicerie/
(ou ouvrir directement `lepicerie/index.html` dans un navigateur).

## À compléter

- Téléphone / e-mail de réservation
- Horaires d'ouverture
- Liens réseaux sociaux (Facebook, Instagram)
- Carte des plats (seules les suggestions de l'ardoise sont en ligne) et carte des vins
- Mettre à jour l'ardoise dans `index.html` (section `#ardoise`) quand elle change
