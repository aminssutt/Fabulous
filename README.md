# Fabulous - Site Vitrine (Version Allégée Sans Backend)

## Structure du Projet

```
fabulous/
├── client/               # Frontend React
│   ├── public/          # Fichiers statiques
│   └── src/             # Code source React
│       ├── components/  # Composants React
│       ├── App.js       # Composant principal
│       └── index.js     # Point d'entrée
│
└── server/              # Backend Node.js/Express
	├── models/          # Modèles MongoDB
	├── server.js        # Serveur Express
	└── .env            # Variables d'environnement
```
### Variables d'environnement (Client uniquement)

Créé maintenant en mode purement frontend.

Client :
- REACT_APP_ADMIN_PASSWORD = Mot de passe pour accéder au mini panneau d'administration (galerie).

## Installation (Nouvelle Version Simplifiée)

1. Aller dans le dossier `client` et installer :
```bash
cd client
npm install
```
2. Copier `client/.env.example` vers `client/.env` et définir votre mot de passe :
```bash
REACT_APP_ADMIN_PASSWORD=MonSuperMotDePasseSecret
```
3. Lancer le site :
```bash
npm start
```

## Démarrage

Mode développement React standard (plus de serveur Express requis) :
```bash
cd client
npm start
```
Le site tourne sur: http://localhost:3000

## Fonctionnalités (Version Actuelle)

- Site vitrine 100% statique (React + localStorage)
- Accès admin simple par mot de passe (stocké côté build – pour démo uniquement)
- Gestion d'une galerie dynamique (ajout d'URLs d'images + catégorisation)
- Filtrage par catégorie dans la section Galerie / Portfolio
- Témoignages statiques (avatars génériques, pas de photos de profil réelles)

Supprimé :
- Rendez-vous / calendrier
- Emails
- Auth multi-facteur
- API / base de données

## 🚀 Détails UI

- Design moderne et épuré
- Responsive (mobile / tablette / desktop)
- Animations légères
- Galerie alimentée par localStorage (persistance navigateur)

## 🛠️ Technologies Utilisées

- React.js
- Styled Components
- Material-UI
- React Scroll
- React Slick
- Font Awesome

## 📦 Installation

1. Clonez le repository :
\`\`\`bash
git clone [url-du-repo]
\`\`\`

2. Installez les dépendances :
\`\`\`bash
npm install
\`\`\`

3. Lancez le serveur de développement :
\`\`\`bash
npm start
\`\`\`

## 🎨 Structure du Projet

\`\`\`
fabulous-website/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── About.js
│   │   ├── Portfolio.js
│   │   ├── Services.js
│   │   ├── Admin/
│   │   │   ├── AdminLogin.js
│   │   │   └── AdminDashboard.js (galerie)
│   │   ├── Testimonials.js
│   │   └── Footer.js
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
\`\`\`

## Déploiement GitHub Pages (Branche gh-pages)

La configuration utilise maintenant le package `gh-pages` et publie le dossier `build/` directement sur une branche `gh-pages`.

Pré-requis :
```
cd client
npm install
```
### Déploiement GitHub Pages

Depuis le dossier `client-vite` :

1. Installer les dépendances si pas déjà fait: `npm install`
2. Construire le build production: `npm run build`
3. Déployer sur la branche gh-pages: `npm run deploy:gh`

Le script `deploy:gh` crée (ou met à jour) la branche `gh-pages` avec le contenu du dossier `dist`.

Assurez-vous que le repo distant existe et que vous avez les droits de push. La config `base: '/Fabulous/'` dans `vite.config.js` est nécessaire pour GitHub Pages (chemins relatifs corrects).

Si vous utilisez une autre URL (ex: changement de nom du repo), mettre à jour la propriété `base`.


Déployer :
```
cd client
npm run deploy
```
Ce script :
- lance `npm run build`
- pousse le contenu du dossier `build` sur la branche `gh-pages`

Sur GitHub (Settings > Pages) :
- Source = Deploy from a branch
- Branch = gh-pages (root)

URL attendue : https://aminssutt.github.io/Fabulous

Notes:
- `homepage` dans `client/package.json` assure les chemins corrects.
- Si tu renommes le repo, mets à jour ce champ.
- Pour nettoyer un ancien dossier `docs`, tu peux simplement le supprimer si présent.

## 📝 Todo (Potentiel futur)

- [ ] Export / import JSON de la galerie (déjà présent mais doc à clarifier)
- [ ] Mini aperçu & validation des URLs (partiellement fait pour Imgur dans l'admin)
- [ ] Support drag & drop + upload (ex: Cloudinary)
- [ ] Hash côté build du mot de passe pour éviter le plain text (obfuscation minime)
- [ ] Tests unitaires basiques

## 📄 Licence

MIT © Fabulous
