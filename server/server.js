const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const Appointment = require('./models/Appointment');

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: '*',  // Permettre toutes les origines en développement
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
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
