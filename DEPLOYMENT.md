# 🚀 Guide de Déploiement - Fabulous

## Architecture de Production
- **Frontend** : Vercel (React + Vite)
- **Backend** : Render (Node.js + Express)
- **Base de données** : Supabase (PostgreSQL)
- **Stockage** : Supabase Storage
- **Emails** : Resend

---

## 1. 📦 Configuration Supabase

### Créer un projet Supabase
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter les clés (dans Project Settings > API) :
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY` (public)
   - `SUPABASE_SERVICE_KEY` (secret - service_role)

### Exécuter le script SQL
Dans l'éditeur SQL de Supabase, exécuter le contenu de `server/supabase_setup.sql`

### Configurer le Storage
1. Aller dans Storage > Create new bucket
2. Nom : `images`
3. Public : **OUI**
4. MIME types : `image/jpeg, image/png, image/webp`
5. Max file size : 5MB

---

## 2. 📧 Configuration Resend (Emails)

1. Aller sur [resend.com](https://resend.com)
2. Créer un compte et obtenir une API key
3. **Important** : En mode gratuit, vous ne pouvez envoyer qu'à votre propre email vérifié
4. Pour la production, ajouter et vérifier votre domaine
5. Noter : `RESEND_API_KEY`

---

## 3. 🖥️ Déploiement Backend sur Render

### Via le Dashboard Render
1. Aller sur [render.com](https://render.com)
2. New > Web Service
3. Connecter votre repo GitHub
4. Configurer :
   - **Name** : fabulous-api
   - **Region** : Frankfurt (EU) ou Oregon (US)
   - **Branch** : main
   - **Root Directory** : `Fabulous/server`
   - **Runtime** : Node
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Health Check Path** : `/api/health`

### Variables d'environnement Render
Dans Environment > Environment Variables, ajouter :

| Variable | Valeur |
|----------|--------|
| `NODE_ENV` | production |
| `PORT` | 10000 |
| `SUPABASE_URL` | https://xxx.supabase.co |
| `SUPABASE_ANON_KEY` | eyJhbGci... |
| `SUPABASE_SERVICE_KEY` | eyJhbGci... |
| `JWT_SECRET` | (générer 32+ caractères aléatoires) |
| `JWT_EXPIRATION` | 24h |
| `ADMIN_EMAIL` | votre@email.com |
| `ADMIN_PASSWORD` | (mot de passe fort) |
| `RESEND_API_KEY` | re_xxxxxxxxx |
| `EMAIL_USER` | votre@email.com |
| `CLIENT_URL` | https://votre-app.vercel.app |

---

## 4. 🌐 Déploiement Frontend sur Vercel

### Via le Dashboard Vercel
1. Aller sur [vercel.com](https://vercel.com)
2. Add New > Project > Import Git Repository
3. Configurer :
   - **Framework Preset** : Vite
   - **Root Directory** : `Fabulous/client-vite`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`

### Variables d'environnement Vercel
Dans Settings > Environment Variables :

| Variable | Valeur |
|----------|--------|
| `VITE_API_URL` | https://fabulous-api.onrender.com |

> ⚠️ Ne pas mettre de slash `/` à la fin de l'URL

---

## 5. ⚙️ Configuration du fichier config.js

Le fichier `client-vite/src/config.js` utilise la variable d'environnement :

```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

---

## 6. 🔧 Variables d'environnement locales

### Backend (créer `.env` dans `server/`)
```env
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_KEY=eyJhbGci...

# JWT
JWT_SECRET=dev_secret_change_in_production_32chars
JWT_EXPIRATION=24h

# Admin
ADMIN_EMAIL=admin@fabulous.com
ADMIN_PASSWORD=admin123

# Email (Resend)
EMAIL_USER=admin@fabulous.com
RESEND_API_KEY=re_xxxxxxxxx

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (créer `.env` dans `client-vite/`)
```env
VITE_API_URL=http://localhost:5000
```

---

## 7. ✅ Vérification post-déploiement

### Backend
- [ ] Health check : `curl https://fabulous-api.onrender.com/api/health`
- [ ] API Gallery : `curl https://fabulous-api.onrender.com/api/gallery`

### Frontend
- [ ] Page d'accueil accessible
- [ ] Connexion admin fonctionne (avec code email)
- [ ] Upload d'images fonctionne
- [ ] Soumission d'avis fonctionne
- [ ] Email de notification reçu pour nouvel avis
- [ ] Approbation/rejet d'avis fonctionne

---

## 8. 🔍 Résolution des problèmes courants

### CORS Errors
- Vérifier que `CLIENT_URL` dans Render correspond **exactement** à l'URL Vercel
- Format : `https://votre-app.vercel.app` (sans slash final)

### Emails non envoyés
1. Vérifier que `RESEND_API_KEY` est configuré dans Render
2. Vérifier que `ADMIN_EMAIL` est configuré
3. **Mode gratuit Resend** : emails uniquement vers l'email vérifié
4. Vérifier les logs Render pour les erreurs

### Render en veille (Free tier)
- Le service gratuit se met en veille après 15 min d'inactivité
- La première requête peut prendre 30-60 secondes
- Solution : passer au plan Starter ($7/mois) ou utiliser un service de ping

### Images non affichées
1. Vérifier que le bucket Supabase `images` est bien **public**
2. Vérifier les policies RLS dans Supabase

### Erreur de connexion admin
1. Vérifier que `ADMIN_EMAIL` et `ADMIN_PASSWORD` sont corrects
2. Vérifier que l'email de code est bien reçu (spam?)
3. Vérifier que `JWT_SECRET` est configuré

---

## 9. 💻 Commandes de développement

```bash
# Démarrer le backend
cd Fabulous/server
npm install
npm run dev   # ou npm start

# Démarrer le frontend
cd Fabulous/client-vite
npm install
npm run dev

# Build production frontend
cd Fabulous/client-vite
npm run build

# Preview du build
npm run preview
```

---

## 10. 🔐 Checklist Sécurité Production

- [ ] `JWT_SECRET` : minimum 32 caractères aléatoires
- [ ] `ADMIN_PASSWORD` : mot de passe fort (12+ caractères, mixte)
- [ ] Clés Supabase `SERVICE_KEY` non exposées côté client
- [ ] 2FA activé sur Supabase, Vercel et Render
- [ ] Variables sensibles marquées comme "Secret" dans Render
- [ ] HTTPS activé (automatique sur Vercel et Render)

---

## 11. 📊 Monitoring

### Render
- Dashboard > Logs pour voir les erreurs backend
- Metrics pour la performance

### Vercel
- Analytics (plan Pro) pour le trafic
- Logs de déploiement

### Supabase
- Dashboard > Logs pour les requêtes DB
- Usage pour surveiller la consommation

---

## 12. 🔄 Mises à jour

Pour déployer une mise à jour :

1. **Push sur GitHub** : Vercel et Render se mettent à jour automatiquement
2. **Forcer un redéploiement** : Dans le dashboard, cliquer sur "Redeploy"

---

*Dernière mise à jour : Février 2026*
