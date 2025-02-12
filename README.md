# Fabulous - Système de Gestion de Rendez-vous

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

## Configuration et Sécurité

### Gestion des fichiers sensibles

1. Ne jamais commiter les fichiers .env :
   ```bash
   # Si les fichiers .env sont déjà suivis par Git
   git rm --cached .env
   git rm --cached .env.production
   git rm --cached server/.env
   git rm --cached server/.env.production
   git rm --cached client/.env
   git rm --cached client/.env.production
   ```

2. Avant de faire un commit :
   - Vérifier qu'aucun fichier sensible n'est stagé : `git status`
   - Utiliser `git add` spécifiquement pour les fichiers à commiter
   - Ne pas utiliser `git add .` pour éviter d'ajouter accidentellement des fichiers sensibles

3. Pour un nouveau clone du projet :
   - Copier les fichiers .env.example vers .env
   - Remplir les variables avec les bonnes valeurs
   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

### Variables d'environnement requises

#### Serveur
- MONGODB_URI
- JWT_SECRET
- ADMIN_EMAIL
- ADMIN_PASSWORD
- EMAIL_USER
- EMAIL_PASS

#### Client
- REACT_APP_API_URL
- PORT

## Installation

1. Installer les dépendances pour le client et le serveur :
```bash
npm run install-all
```

2. Configurer MongoDB :
- Installer MongoDB sur votre machine
- Créer une base de données nommée 'fabulous'

3. Configurer les variables d'environnement :
- Copier le fichier `.env.example` vers `.env` dans le dossier server
- Remplir les variables d'environnement appropriées

## Démarrage

Pour lancer l'application en mode développement :

```bash
npm run dev
```

Cela démarrera :
- Le serveur backend sur http://localhost:5001
- L'application frontend sur http://localhost:3000

## Fonctionnalités

- Gestion des rendez-vous
- Vérification des créneaux disponibles
- Envoi d'emails de confirmation
- Interface utilisateur réactive

Site web one-page moderne pour l'architecte d'intérieur Fabulous, construit avec React.

## 🚀 Fonctionnalités

- Design moderne et épuré
- Site responsive (mobile, tablette, desktop)
- Sections interactives
- Formulaire de prise de rendez-vous
- Galerie de projets filtrable
- Témoignages clients
- Animations fluides

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
│   │   ├── Appointment.js
│   │   ├── Testimonials.js
│   │   └── Footer.js
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
\`\`\`

## 📝 Todo

- [ ] Ajouter des images de projets
- [ ] Intégrer une base de données pour les rendez-vous
- [ ] Ajouter une authentification admin
- [ ] Optimiser les performances
- [ ] Ajouter des tests unitaires

## 📄 Licence

MIT © Fabulous
