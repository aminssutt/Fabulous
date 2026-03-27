# Fabulous (Vite + React 19)

Migration de l'ancienne application CRA vers Vite + React 19.

## Scripts
- `npm run dev` : demarrage en developpement
- `npm run build` : build de production (sortie dans `dist/`)
- `npm run preview` : previsualisation locale du build
- `npm run deploy:gh` : build puis publication sur `gh-pages`

## Variables d'environnement
Copier `.env.example` vers `.env.local` (ou `.env`) et definir :

```bash
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_anon_key_publique
```

## GitHub Pages
La base est configuree dans `vite.config.js` avec `base: '/Fabulous/'`.
