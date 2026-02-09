# Fabulous (Vite + React 19)

Migration de l'ancienne application CRA vers Vite + React 19.

## Scripts
- `npm run dev` : démarrage en développement
- `npm run build` : build de production (sortie dans dist/)
- `npm run preview` : prévisualisation du build

## Variables d'environnement
Copier `.env.example` vers `.env` et définir :
```
VITE_ADMIN_PASSWORD=FahimaFerqazwsx123
VITE_API_URL=https://example.com (optionnel si plus d'API)
```

## Déploiement GitHub Pages
Base configurée dans `vite.config.js` avec `base: '/Fabulous/'`.
Générer le build puis pousser `dist/` dans la branche `gh-pages`.

```bash
npm run build
# (Option) Copier contenu dist à la racine de la branche gh-pages
```
