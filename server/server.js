const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import des middlewares de sécurité
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();
const Appointment = require('./models/Appointment');
const Review = require('./models/Review');
const Project = require('./models/Project');

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
app.use(mongoSanitize()); // Protection contre les injections NoSQL
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
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fabulous')
.then(() => console.log('Connecté à MongoDB'))
.catch((err) => console.error('Erreur de connexion à MongoDB:', err));

// Configuration Nodemailer avec options complètes
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true, // Active le mode debug
  logger: true // Active le logging
});

// Vérifier la configuration email au démarrage
console.log('Tentative de connexion au serveur SMTP...');
console.log('Utilisateur email:', process.env.EMAIL_USER);
console.log('Mot de passe présent:', !!process.env.EMAIL_PASS);

transporter.verify((error, success) => {
  if (error) {
    console.error('Erreur de configuration email:', error);
    console.error('Détails de l\'erreur:', {
      code: error.code,
      command: error.command,
      response: error.response
    });
  } else {
    console.log('Connexion SMTP réussie! Serveur prêt à envoyer des emails');
  }
});

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
    html: clientEmailTemplate(appointmentData),
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'Importance': 'high'
    }
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
    html: adminEmailTemplate(appointmentData),
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'Importance': 'high'
    }
  };

  try {
    console.log('Envoi de l\'email au client...');
    const clientResult = await transporter.sendMail(clientMail);
    console.log('Email client envoyé avec succès:', {
      messageId: clientResult.messageId,
      response: clientResult.response
    });

    console.log('Envoi de l\'email à l\'admin...');
    const adminResult = await transporter.sendMail(adminMail);
    console.log('Email admin envoyé avec succès:', {
      messageId: adminResult.messageId,
      response: adminResult.response
    });

    return {
      success: true,
      clientMessageId: clientResult.messageId,
      adminMessageId: adminResult.messageId
    };
  } catch (error) {
    console.error('Erreur détaillée lors de l\'envoi des emails:', {
      errorName: error.name,
      errorMessage: error.message,
      errorCode: error.code,
      errorCommand: error.command,
      errorResponse: error.response,
      stack: error.stack
    });
    throw error;
  }
};

// Configuration pour l'authentification admin
const ADMIN_EMAIL = 'fabulouscreationsd@gmail.com';
const ADMIN_PASSWORD = 'fabulousfah1';
const VERIFICATION_CODES = new Map();

// Route pour la connexion admin
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier les identifiants
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect"
      });
    }

    // Générer un code à 6 chiffres
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Stocker le code avec sa date d'expiration
    VERIFICATION_CODES.set(verificationCode, {
      email,
      expirationTime
    });

    // Préparer l'email de vérification
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
          <p>Une tentative de connexion a été effectuée sur votre compte administrateur.</p>
          <p>Voici votre code de vérification :</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #D4AF37; color: #fff; padding: 20px; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 4px;">
              ${verificationCode}
            </div>
          </div>
          <p style="color: #666; font-size: 14px;">Ce code expirera dans 15 minutes.</p>
          <p style="color: #666; font-size: 14px;">Si vous n'êtes pas à l'origine de cette tentative de connexion, ignorez cet email.</p>
        </div>
      </body>
      </html>
    `;

    // Envoyer l'email de vérification
    await transporter.sendMail({
      from: {
        name: 'Fabulous Admin',
        address: process.env.EMAIL_USER
      },
      to: {
        name: 'Admin',
        address: email
      },
      subject: 'Code de vérification admin - Fabulous',
      html: emailTemplate
    });

    res.json({
      message: "Un code de vérification a été envoyé par email"
    });

  } catch (error) {
    console.error('Erreur lors de la connexion admin:', error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la connexion"
    });
  }
});

// Route pour vérifier le code
app.post('/api/admin/verify-code', (req, res) => {
  try {
    const { code, email } = req.body;
    const codeData = VERIFICATION_CODES.get(code);

    if (!codeData || codeData.email !== email) {
      return res.status(400).json({
        message: "Code invalide"
      });
    }

    if (Date.now() > codeData.expirationTime) {
      VERIFICATION_CODES.delete(code);
      return res.status(400).json({
        message: "Le code a expiré"
      });
    }

    // Générer un JWT pour la session
    const sessionToken = jwt.sign(
      { email: codeData.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Supprimer le code de vérification
    VERIFICATION_CODES.delete(code);

    res.json({
      token: sessionToken,
      message: "Connexion réussie"
    });

  } catch (error) {
    console.error('Erreur lors de la vérification du code:', error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la vérification"
    });
  }
});

// Middleware pour protéger les routes admin
const authenticateAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        message: "Token manquant"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (decoded.email !== ADMIN_EMAIL) {
      return res.status(403).json({
        message: "Accès non autorisé"
      });
    }

    req.adminEmail = decoded.email;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Token invalide"
    });
  }
};

// Route protégée pour récupérer les rendez-vous
app.get('/api/admin/appointments', authenticateAdmin, async (req, res) => {
  try {
    const currentDate = new Date();
    const appointments = await Appointment.find({
      date: { $gte: currentDate }
    }).sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (error) {
    console.error('Erreur lors de la récupération des rendez-vous:', error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la récupération des rendez-vous"
    });
  }
});

// Route protégée pour récupérer tous les avis
app.get('/api/admin/reviews', authenticateAdmin, async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la récupération des avis"
    });
  }
});

// Route protégée pour supprimer un avis
app.delete('/api/admin/reviews/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);

    res.json({
      message: "Avis supprimé avec succès"
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'avis:', error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la suppression de l'avis"
    });
  }
});

// Routes
app.post('/api/appointment', async (req, res) => {
  try {
    const appointmentData = req.body;
    console.log('Données reçues:', appointmentData);
    
    appointmentData.date = new Date(appointmentData.date);
    console.log('Date parsée:', appointmentData.date);

    // Vérifier si c'est un dimanche
    if (appointmentData.date.getDay() === 0) {
      console.log('Tentative de rendez-vous un dimanche');
      return res.status(400).json({
        error: 'Les rendez-vous ne sont pas possibles le dimanche'
      });
    }

    // Vérifier si la date est dans le passé
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (appointmentData.date < today) {
      console.log('Tentative de rendez-vous dans le passé');
      return res.status(400).json({
        error: 'Impossible de prendre un rendez-vous dans le passé'
      });
    }

    // Vérifier la disponibilité du créneau
    const isAvailable = await Appointment.isTimeSlotAvailable(appointmentData.date, appointmentData.time);
    console.log('Disponibilité du créneau:', isAvailable);
    
    if (!isAvailable) {
      return res.status(400).json({ 
        error: 'Ce créneau n\'est plus disponible. Veuillez en choisir un autre.' 
      });
    }

    // Sauvegarder le rendez-vous
    const appointment = new Appointment(appointmentData);
    await appointment.save();
    console.log('Rendez-vous sauvegardé avec succès');

    // Envoyer les emails
    try {
      await sendEmails(appointmentData);
      console.log('Emails envoyés avec succès');
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi des emails:', emailError);
      // On continue même si l'envoi d'email échoue, mais on notifie le client
      return res.status(201).json({
        message: 'Rendez-vous enregistré avec succès, mais il y a eu un problème lors de l\'envoi des emails de confirmation. Notre équipe vous contactera bientôt.',
        appointment: appointment.toObject(),
        emailError: true
      });
    }

    res.status(201).json({ 
      message: 'Rendez-vous enregistré avec succès',
      appointment: appointment.toObject()
    });

  } catch (error) {
    console.error('Erreur détaillée:', error);
    console.error('Stack trace:', error.stack);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      console.error('Erreur MongoDB:', error);
      return res.status(500).json({ 
        error: 'Erreur de base de données lors de la prise de rendez-vous' 
      });
    }
    
    res.status(500).json({ 
      error: 'Une erreur est survenue lors de la prise de rendez-vous',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.get('/api/available-slots', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ 
        error: 'Veuillez spécifier une date',
        slots: []
      });
    }

    const result = await Appointment.getAvailableTimeSlots(date);
    
    res.json({ 
      date: formatDate(date),
      slots: result.slots.map(slot => ({
        ...slot,
        formattedTime: `${slot.time}`,
        status: slot.available ? 'disponible' : 'indisponible'
      })),
      message: result.message
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ 
      error: 'Une erreur est survenue lors de la récupération des créneaux disponibles',
      slots: []
    });
  }
});

// Route pour vérifier l'email des rendez-vous passés
app.post('/api/appointments/verify-email', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    // Récupérer la date actuelle
    const currentDate = new Date();

    // Rechercher les rendez-vous passés pour cet email
    const pastAppointments = await Appointment.find({
      email: email,
      date: { $lt: currentDate }
    }).sort({ date: -1 });

    if (pastAppointments.length === 0) {
      return res.status(404).json({
        message: "Aucun rendez-vous passé trouvé pour cet email. Vous devez avoir eu un rendez-vous pour pouvoir laisser un avis."
      });
    }

    // Vérifier si la personne a déjà laissé un avis
    const existingReview = await Review.findOne({ email: email });
    if (existingReview) {
      return res.status(400).json({
        message: "Vous avez déjà laissé un avis. Merci de votre participation !"
      });
    }

    // Retourner les informations du client
    return res.status(200).json({
      message: "Email vérifié avec succès",
      name: pastAppointments[0].name
    });

  } catch (error) {
    console.error('Erreur lors de la vérification de l\'email:', error);
    res.status(500).json({ message: "Une erreur s'est produite lors de la vérification" });
  }
});

// Modifier la route POST des avis pour inclure la vérification
app.post('/api/reviews', async (req, res) => {
  try {
    const { name, rating, comment, email } = req.body;

    // Vérifier si l'email existe et a un rendez-vous passé
    const currentDate = new Date();
    const pastAppointment = await Appointment.findOne({
      email: email,
      date: { $lt: currentDate }
    });

    if (!pastAppointment) {
      return res.status(403).json({
        message: "Vous devez avoir eu un rendez-vous pour pouvoir laisser un avis"
      });
    }

    // Vérifier si la personne a déjà laissé un avis
    const existingReview = await Review.findOne({ email: email });
    if (existingReview) {
      return res.status(400).json({
        message: "Vous avez déjà laissé un avis"
      });
    }

    // Créer le nouvel avis
    const review = new Review({
      name,
      rating,
      comment,
      email // Stocké mais non affiché publiquement
    });

    await review.save();
    
    // Ne pas renvoyer l'email dans la réponse
    const { email: _, ...reviewWithoutEmail } = review.toObject();
    res.status(201).json(reviewWithoutEmail);

  } catch (error) {
    console.error('Erreur lors de la création de l\'avis:', error);
    res.status(500).json({ message: "Une erreur s'est produite lors de l'enregistrement de l'avis" });
  }
});

// Route pour récupérer tous les avis
app.get('/api/reviews', async (req, res) => {
  try {
    // Récupérer tous les avis approuvés, triés par date décroissante
    const reviews = await Review.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .select('-email'); // Exclure l'email des résultats

    res.json(reviews);
  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error);
    res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des avis" });
  }
});

// Route protégée pour récupérer tous les projets
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des projets" });
  }
});

// Route protégée pour récupérer tous les projets (admin)
app.get('/api/admin/projects', authenticateAdmin, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des projets" });
  }
});

// Route protégée pour ajouter un projet
app.post('/api/admin/projects', authenticateAdmin, async (req, res) => {
  try {
    const projectData = req.body;
    const project = new Project(projectData);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Une erreur s'est produite lors de l'ajout du projet" });
  }
});

// Route protégée pour supprimer un projet
app.delete('/api/admin/projects/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    res.json({ message: "Projet supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Une erreur s'est produite lors de la suppression du projet" });
  }
});

const PORT = process.env.PORT || 5000;

// Gestion améliorée du démarrage du serveur
const server = app.listen(PORT, (err) => {
  if (err) {
    console.error('Erreur lors du démarrage du serveur:', err);
    process.exit(1);
  }
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log('Pour tester l\'API:');
  console.log(`curl http://localhost:${PORT}/api/available-slots?date=2024-02-03`);
})
.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Le port ${PORT} est déjà utilisé. Veuillez arrêter le processus qui l'utilise ou changer de port.`);
  } else {
    console.error('Erreur lors du démarrage du serveur:', err);
  }
  process.exit(1);
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (err) => {
  console.error('Erreur non capturée:', err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('unhandledRejection', (err) => {
  console.error('Promesse rejetée non gérée:', err);
  server.close(() => {
    process.exit(1);
  });
});
