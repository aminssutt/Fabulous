# Fabulous Backend pour Render

## Configuration Render

### Variables d'environnement requises
Configurez ces variables dans le dashboard Render :

```
PORT=5000
NODE_ENV=production

# Email (Resend sender)
EMAIL_FROM=votre-email@votre-domaine.com
# Legacy fallback (optional)
EMAIL_USER=votre-email@votre-domaine.com

# Admin
ADMIN_EMAIL=admin@fabulous.com
ADMIN_PASSWORD=votre-mot-de-passe-admin

# JWT
JWT_SECRET=votre-secret-jwt-tres-long-et-securise
JWT_EXPIRATION=24h

# Supabase
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_KEY=votre-service-key

# Client URL (URL Vercel)
CLIENT_URL=https://votre-app.vercel.app
```

### Commandes de démarrage
- **Build Command**: `npm install`
- **Start Command**: `npm start`
