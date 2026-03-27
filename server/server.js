const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import Supabase
const supabase = require('./config/supabase');

// Import des middlewares de sécurité
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { xss } = require('express-xss-sanitizer');
const hpp = require('hpp');
const { authenticateAdmin } = require('./middleware/auth');

// Import des routes
const galleryRoutes = require('./routes/gallery');
const appointmentsRoutes = require('./routes/appointments');
const reviewsRoutes = require('./routes/reviews');
const servicesRoutes = require('./routes/services');
const categoriesRoutes = require('./routes/categories');
const contentRoutes = require('./routes/content');

const app = express();

// Configuration Resend
const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_SENDER =
  process.env.EMAIL_FROM ||
  process.env.EMAIL_USER ||
  process.env.ADMIN_EMAIL ||
  'no-reply@fabulous.local';

// Configuration des limiteurs de requêtes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives maximum
  message: {
    error: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.'
  }
});

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 100, // 100 requêtes par IP
  message: {
    error: 'Trop de requêtes depuis cette IP. Veuillez réessayer dans une heure.'
  }
});

const verifyCodeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives max
  message: {
    error: 'Trop de tentatives de vérification. Réessayez dans 15 minutes.'
  }
});

// Application des middlewares de sécurité
app.use(helmet()); // Sécurité des en-têtes HTTP
app.use(xss()); // Protection contre les attaques XSS
app.use(hpp()); // Protection contre la pollution des paramètres HTTP

// Application des limiteurs de requêtes
app.use('/api/admin/login', loginLimiter); // Limite les tentatives de connexion
app.use('/api', apiLimiter); // Limite générale pour toutes les routes API

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Configuration CORS dynamique pour accepter toutes les URLs Vercel
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  /^https:\/\/fabulous.*\.vercel\.app$/,  // Toutes les URLs Vercel de fabulous
];

app.use(cors({
  origin: function(origin, callback) {
    // Permettre les requêtes sans origin (Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Vérifier si l'origin correspond à un pattern autorisé
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS bloqué pour:', origin);
      callback(new Error('Non autorisé par CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Route de health check pour Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'fabulous-api'
  });
});

// Fonction pour envoyer un email via Resend
const sendEmail = async ({ to, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Fabulous <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: html
    });
    
    if (error) {
      console.error('❌ Erreur Resend:', error);
      throw error;
    }
    
    console.log('✅ Email envoyé:', data.id);
    return data;
  } catch (err) {
    console.error('❌ Erreur envoi email:', err);
    throw err;
  }
};

console.log('📧 Email configuré avec Resend');

// Fonctions utilitaires pour les emails
const formatDate = (date) => {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  };
  return new Date(date).toLocaleDateString('fr-FR', options);
};

// Configuration pour l'authentification admin
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const VERIFICATION_CODES = new Map();

// ==================== ROUTES AUTHENTIFICATION ====================

// Route pour la connexion admin
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error('Variables d\'environnement manquantes');
      return res.status(500).json({ message: "Erreur de configuration du serveur" });
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // Générer un code à 6 chiffres
    const verificationCode = crypto.randomInt(100000, 1000000).toString();
    const expirationTime = Date.now() + 15 * 60 * 1000; // 15 minutes

    VERIFICATION_CODES.set(verificationCode, { email, expirationTime });

    // Envoyer l'email de vérification
    const emailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Code de vérification admin</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
          <h2 style="color: #D4AF37; text-align: center;">Code de vérification admin</h2>
          <p>Voici votre code de vérification :</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #D4AF37; color: #fff; padding: 20px; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 4px;">
              ${verificationCode}
            </div>
          </div>
          <p style="color: #666; font-size: 14px;">Ce code expirera dans 15 minutes.</p>
        </div>
      </body>
      </html>
    `;

    // Envoyer l'email via Resend
    await sendEmail({
      to: email,
      subject: 'Code de vérification admin - Fabulous',
      html: emailTemplate
    });

    res.json({ message: "Un code de vérification a été envoyé par email" });

  } catch (error) {
    console.error('Erreur lors de la connexion admin:', error);
    res.status(500).json({ message: "Une erreur s'est produite" });
  }
});

// Route pour vérifier le code
app.post('/api/admin/verify-code', verifyCodeLimiter, (req, res) => {
  try {
    const { code, email } = req.body;
    const codeData = VERIFICATION_CODES.get(code);

    if (!codeData || codeData.email !== email) {
      return res.status(400).json({ message: "Code invalide" });
    }

    if (Date.now() > codeData.expirationTime) {
      VERIFICATION_CODES.delete(code);
      return res.status(400).json({ message: "Le code a expiré" });
    }

    // Générer un JWT pour la session
    const sessionToken = jwt.sign(
      { email: codeData.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '24h' }
    );

    VERIFICATION_CODES.delete(code);

    res.json({
      token: sessionToken,
      message: "Connexion réussie"
    });

  } catch (error) {
    console.error('Erreur lors de la vérification du code:', error);
    res.status(500).json({ message: "Une erreur s'est produite" });
  }
});

// ==================== UTILISATION DES ROUTES ====================

// Routes de la galerie
app.use('/api/gallery', galleryRoutes);

// Routes des rendez-vous
app.use('/api/appointments', appointmentsRoutes);

// Routes des avis
app.use('/api/reviews', reviewsRoutes);

// Routes des services
app.use('/api/services', servicesRoutes);

// Routes des catégories
app.use('/api/categories', categoriesRoutes);

// Routes du contenu éditable
app.use('/api/content', contentRoutes);

// Route protégée pour récupérer les rendez-vous admin
app.get('/api/admin/appointments', authenticateAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des rendez-vous' });
  }
});

// Route protégée pour récupérer les avis admin
app.get('/api/admin/reviews', authenticateAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des avis' });
  }
});

// ==================== DÉMARRAGE DU SERVEUR ====================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, (err) => {
  if (err) {
    console.error('❌ Erreur lors du démarrage du serveur:', err);
    process.exit(1);
  }
  console.log(`\n✅ Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📧 Email configuré: ${EMAIL_SENDER}\n`);
})
.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Le port ${PORT} est déjà utilisé.`);
  } else {
    console.error('❌ Erreur serveur:', err);
  }
  process.exit(1);
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (err) => {
  console.error('❌ Erreur non capturée:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Promesse rejetée non gérée:', err);
});

