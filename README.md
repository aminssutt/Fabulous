<p align="center">
  <img src="./logofabulousv2.png" alt="Fabulous logo" width="160" />
</p>

<h1 align="center">Fabulous</h1>
<p align="center">Site vitrine premium pour un portfolio d'architecture d'intérieur.</p>

<p align="center">
  <img alt="Frontend Vite React" src="https://img.shields.io/badge/Frontend-Vite%20%2B%20React-1a1a1a?style=for-the-badge&logo=react&logoColor=D4AF37">
  <img alt="Backend Node Express" src="https://img.shields.io/badge/Backend-Node%20%2B%20Express-2d2d2d?style=for-the-badge&logo=express&logoColor=FCF6BA">
  <img alt="Database Supabase" src="https://img.shields.io/badge/Data-Supabase-111111?style=for-the-badge&logo=supabase&logoColor=BF953F">
</p>

<p align="center">
  <img alt="Palette Or Signature" src="https://img.shields.io/badge/Or%20Signature-%23D4AF37?style=flat-square&labelColor=%231a1a1a">
  <img alt="Palette Noir Profond" src="https://img.shields.io/badge/Noir%20Profond-%231a1a1a?style=flat-square&labelColor=%231a1a1a">
  <img alt="Palette Or Clair" src="https://img.shields.io/badge/Or%20Clair-%23FCF6BA?style=flat-square&labelColor=%231a1a1a">
</p>

---

## ✨ Aperçu

**Fabulous** est une expérience web élégante et responsive, pensée pour être présentée sur un portfolio ou LinkedIn avec une identité visuelle forte (or + noir), une navigation fluide et un espace admin.

### Fonctionnalités clés
- Hero et sections premium (About, Services, Portfolio, Testimonials)
- Galerie administrable
- Interface responsive mobile/tablette/desktop
- Backend Express pour auth admin et opérations sécurisées
- Intégration Supabase (base de données + storage)

---

## 🧱 Architecture du projet

```text
Fabulous/
├── client-vite/     # Frontend principal (React + Vite)
├── client/          # Frontend CRA legacy (historique)
├── server/          # API Express (auth, contact, gestion données)
├── DEPLOYMENT.md    # Guide de déploiement complet
└── README.md
```

---

## 🚀 Démarrage rapide (recommandé)

### 1) Frontend (Vite)
```bash
cd client-vite
npm install
npm run dev
```

### 2) Backend (Express)
```bash
cd server
npm install
npm run dev
```

> Le frontend Vite est la version recommandée pour la présentation professionnelle.

---

## 🛠️ Scripts utiles

### `client-vite`
- `npm run dev` : lancement local
- `npm run build` : build production
- `npm run preview` : preview du build
- `npm run deploy:gh` : déploiement GitHub Pages (branche `gh-pages`)

### `server`
- `npm run dev` : backend en mode développement (nodemon)
- `npm run start` : backend en mode production

---

## 🔐 Sécurité (résumé)

Le backend inclut déjà des protections essentielles :
- `helmet` (headers de sécurité)
- `xss-clean` (réduction risques XSS)
- `hpp` (protection HTTP Parameter Pollution)
- `express-rate-limit` (limitation de requêtes API/login)
- JWT pour l'accès admin
- CORS avec whitelist contrôlée

### Vérifications recommandées avant mise en production
- Utiliser un `JWT_SECRET` robuste (32+ caractères)
- Utiliser un `ADMIN_PASSWORD` fort (12+ caractères, mixte)
- Ne jamais exposer les clés `SUPABASE_SERVICE_KEY` côté client
- Activer la 2FA sur les comptes d'infrastructure (Supabase, Vercel, Render)

👉 Détails complets : [`DEPLOYMENT.md`](./DEPLOYMENT.md)

---

## 🌍 Déploiement

Le projet supporte un déploiement moderne :
- Frontend : Vercel ou GitHub Pages (`client-vite`)
- Backend : Render
- Données : Supabase

Pour la procédure complète, suivre [`DEPLOYMENT.md`](./DEPLOYMENT.md).

---

## 📄 Licence

MIT © Fabulous
