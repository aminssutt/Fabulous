const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const Appointment = require('./models/Appointment');

// Configuration de CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Connexion à MongoDB avec options supplémentaires
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fabulous', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  retryWrites: true
})
.then(() => {
  console.log('Connecté à MongoDB');
})
.catch((err) => {
  console.error('Erreur de connexion à MongoDB:', err);
  console.log('Assurez-vous que MongoDB est installé et en cours d\'exécution');
});

// Configuration de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Templates d'emails
const clientEmailTemplate = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #D4AF37;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 20px;
      background-color: #f9f9f9;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Confirmation de Rendez-vous</h1>
    </div>
    <div class="content">
      <p>Cher(e) ${data.name},</p>
      <p>Nous avons bien reçu votre demande de rendez-vous. Voici les détails :</p>
      <ul>
        <li><strong>Date :</strong> ${new Date(data.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
        <li><strong>Heure :</strong> ${data.time}</li>
        <li><strong>Message :</strong> ${data.message}</li>
      </ul>
      <p>Nous vous contacterons prochainement pour confirmer ce rendez-vous.</p>
    </div>
    <div class="footer">
      <p>Merci de nous faire confiance !</p>
      <p>L'équipe Fabulous</p>
    </div>
  </div>
</body>
</html>
`;

const adminEmailTemplate = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #D4AF37;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 20px;
      background-color: #f9f9f9;
    }
    .details {
      background-color: #fff;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Nouvelle Demande de Rendez-vous</h1>
    </div>
    <div class="content">
      <p>Une nouvelle demande de rendez-vous a été reçue.</p>
      <div class="details">
        <h3>Informations du client :</h3>
        <ul>
          <li><strong>Nom :</strong> ${data.name}</li>
          <li><strong>Email :</strong> ${data.email}</li>
          <li><strong>Téléphone :</strong> ${data.phone}</li>
          <li><strong>Date :</strong> ${new Date(data.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
          <li><strong>Heure :</strong> ${data.time}</li>
        </ul>
        <h3>Message :</h3>
        <p>${data.message}</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Route pour les rendez-vous
app.post('/api/appointment', async (req, res) => {
  try {
    const appointmentData = req.body;
    console.log('Données reçues:', appointmentData);

    // Convertir la date en objet Date
    appointmentData.date = new Date(appointmentData.date);

    // Vérifier si le créneau est disponible
    const isAvailable = await Appointment.isTimeSlotAvailable(
      appointmentData.date,
      appointmentData.time
    );
    console.log('Créneau disponible:', isAvailable);

    if (!isAvailable) {
      return res.status(409).json({
        error: 'Ce créneau n\'est plus disponible. Veuillez en choisir un autre.'
      });
    }

    // Créer et sauvegarder le rendez-vous
    const appointment = new Appointment(appointmentData);
    console.log('Rendez-vous à sauvegarder:', appointment);

    try {
      await appointment.save();
      console.log('Rendez-vous sauvegardé avec succès');
    } catch (saveError) {
      console.error('Erreur lors de la sauvegarde:', saveError);
      return res.status(500).json({
        error: `Erreur lors de la sauvegarde: ${saveError.message}`
      });
    }

    // Envoyer l'email de confirmation au client
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: appointmentData.email,
        subject: 'Confirmation de votre rendez-vous - Fabulous',
        html: clientEmailTemplate(appointmentData)
      });
      console.log('Email de confirmation envoyé au client');
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email au client:', emailError);
      // On continue même si l'email échoue
    }

    // Envoyer l'email de notification à l'administrateur
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'Nouvelle demande de rendez-vous',
        html: adminEmailTemplate(appointmentData)
      });
      console.log('Email de notification envoyé à l\'administrateur');
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email à l\'administrateur:', emailError);
      // On continue même si l'email échoue
    }

    res.status(201).json({ 
      message: 'Rendez-vous enregistré et emails envoyés avec succès',
      appointment: appointment.toObject()
    });

  } catch (error) {
    console.error('Erreur détaillée:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      error: 'Une erreur est survenue lors du traitement de votre demande',
      details: error.message
    });
  }
});

// Route pour les créneaux disponibles
app.get('/api/available-slots', async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: 'La date est requise' });
    }

    // Récupérer les créneaux disponibles pour la date donnée
    const availableSlots = await Appointment.getAvailableTimeSlots(new Date(date));
    
    res.json({ availableSlots });
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux:', error);
    res.status(500).json({ 
      error: 'Une erreur est survenue lors de la récupération des créneaux disponibles' 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
