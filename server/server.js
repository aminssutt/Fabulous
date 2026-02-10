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
const xss = require('xss-clean');
const hpp = require('hpp');

// Import des routes
const galleryRoutes = require('./routes/gallery');
const appointmentsRoutes = require('./routes/appointments');
const reviewsRoutes = require('./routes/reviews');
const servicesRoutes = require('./routes/services');
const categoriesRoutes = require('./routes/categories');

const app = express();

// Configuration Resend
const resend = new Resend(process.env.RESEND_API_KEY);

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

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
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

const clientEmailTemplate = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de rendez-vous</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: #D4AF37; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
      <h1 style="color: #fff; margin: 0; font-size: 24px;">Confirmation de Rendez-vous</h1>
    </div>
    
    <div style="background-color: #fff; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <p style="font-size: 16px; color: #333;">Bonjour ${data.name},</p>
      
      <p style="font-size: 16px; color: #333;">Votre rendez-vous a été confirmé pour :</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Date :</strong> ${formatDate(data.date)}</p>
        <p style="margin: 5px 0;"><strong>Heure :</strong> ${data.time}</p>
      </div>
      
      <p style="font-size: 14px; color: #666;">Message : ${data.message}</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #888; font-size: 14px;">Pour toute modification ou annulation, veuillez nous contacter directement.</p>
      </div>
    </div>
    
    <div style="text-align: center; margin-top: 20px;">
      <p style="color: #D4AF37; font-weight: bold; margin: 0;">L'équipe Fabulous</p>
      <p style="color: #888; font-size: 12px; margin: 5px 0;">Email: ${process.env.EMAIL_USER}</p>
    </div>
  </div>
</body>
</html>`;

const adminEmailTemplate = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouveau rendez-vous</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: #D4AF37; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
      <h1 style="color: #fff; margin: 0; font-size: 24px;">Nouveau Rendez-vous</h1>
    </div>
    
    <div style="background-color: #fff; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px;">
        <p style="margin: 5px 0;"><strong>Nom :</strong> ${data.name}</p>
        <p style="margin: 5px 0;"><strong>Email :</strong> ${data.email}</p>
        <p style="margin: 5px 0;"><strong>Téléphone :</strong> ${data.phone}</p>
        <p style="margin: 5px 0;"><strong>Date :</strong> ${formatDate(data.date)}</p>
        <p style="margin: 5px 0;"><strong>Heure :</strong> ${data.time}</p>
      </div>
      
      <div style="margin-top: 20px;">
        <h3 style="color: #666;">Message du client :</h3>
        <p style="background-color: #f9f9f9; padding: 10px; border-radius: 4px;">${data.message}</p>
      </div>
    </div>
  </div>
</body>
</html>`;

const sendEmails = async (appointmentData) => {
  console.log('Préparation de l\'envoi des emails pour:', appointmentData.email);

  const clientMail = {
    from: {
      name: 'Fabulous',
      address: process.env.EMAIL_USER
    },
    to: {
      name: appointmentData.name,
      address: appointmentData.email
    },
    subject: 'Confirmation de rendez-vous - Fabulous',
    html: clientEmailTemplate(appointmentData)
  };

  const adminMail = {
    from: {
      name: 'Fabulous System',
      address: process.env.EMAIL_USER
    },
    to: {
      name: 'Fabulous Admin',
      address: process.env.EMAIL_USER
    },
    subject: `Nouveau rendez-vous - ${appointmentData.name}`,
    html: adminEmailTemplate(appointmentData)
  };

  try {
    console.log('Envoi de l\'email au client...');
    const clientResult = await transporter.sendMail(clientMail);
    console.log('✅ Email client envoyé:', clientResult.messageId);

    console.log('Envoi de l\'email à l\'admin...');
    const adminResult = await transporter.sendMail(adminMail);
    console.log('✅ Email admin envoyé:', adminResult.messageId);

    return {
      success: true,
      clientMessageId: clientResult.messageId,
      adminMessageId: adminResult.messageId
    };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi des emails:', error);
    throw error;
  }
};

// Configuration pour l'authentification admin
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const VERIFICATION_CODES = new Map();

// Middleware pour protéger les routes admin
const authenticateAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    req.adminEmail = decoded.email;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
};

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
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
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
app.post('/api/admin/verify-code', (req, res) => {
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
  console.log(`📧 Email configuré: ${process.env.EMAIL_USER}`);
  console.log(`🗄️  Supabase URL: ${process.env.SUPABASE_URL}\n`);
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
  console.error('❌ Erreur non capturée:', err.message);
  // Ne pas arrêter le serveur pour les erreurs non critiques
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Promesse rejetée non gérée:', err.message || err);
  // Ne pas arrêter le serveur pour les erreurs non critiques
});
