// NOTE: Ancien backend conservé pour référence mais non utilisé dans la version vitrine.
// Le site se lance uniquement via le dossier client désormais.
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

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fabulous')
  .then(() => {
    console.log('Connecté à MongoDB');
  })
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB:', err);
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
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%);
      color: #D4AF37;
      padding: 30px 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .content {
      background: #ffffff;
      padding: 40px 20px;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .appointment-details {
      background: #f8f8f8;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
      border-left: 4px solid #D4AF37;
    }
    .detail-row {
      margin: 10px 0;
      padding: 5px 0;
      border-bottom: 1px solid #eee;
    }
    .detail-label {
      font-weight: bold;
      color: #1a1a1a;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #D4AF37;
      color: #666;
    }
    .signature {
      font-style: italic;
      color: #D4AF37;
      margin-top: 20px;
    }
    .social-links {
      margin-top: 20px;
    }
    .social-links a {
      color: #D4AF37;
      text-decoration: none;
      margin: 0 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>FABULOUS</h1>
    </div>
    <div class="content">
      <h2 style="color: #D4AF37;">Confirmation de votre demande de rendez-vous</h2>
      <p>Cher(e) ${data.name},</p>
      <p>Nous avons bien reçu votre demande de rendez-vous. Voici un récapitulatif des détails :</p>
      
      <div class="appointment-details">
        <div class="detail-row">
          <span class="detail-label">Date :</span> ${new Date(data.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <div class="detail-row">
          <span class="detail-label">Heure :</span> ${data.time}
        </div>
        <div class="detail-row">
          <span class="detail-label">Type de projet :</span> ${data.projectType}
        </div>
        <div class="detail-row">
          <span class="detail-label">Message :</span> ${data.message}
        </div>
      </div>

      <p>Nous vous contacterons dans les plus brefs délais pour confirmer votre rendez-vous.</p>
      
      <div class="footer">
        <p>Merci de nous faire confiance pour votre projet.</p>
        <div class="signature">
          <p>L'équipe FABULOUS</p>
          <p style="color: #666;">Email : fabulouscreationsd@gmail.com</p>
          <p style="color: #666;">Architecte d'intérieur - Design & Création</p>
        </div>
        <div class="social-links">
          <a href="#">Instagram</a> |
          <a href="#">Facebook</a> |
          <a href="#">LinkedIn</a>
        </div>
      </div>
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
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%);
      color: #D4AF37;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .content {
      background: #ffffff;
      padding: 30px 20px;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .client-info {
      background: #1a1a1a;
      color: #ffffff;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .appointment-details {
      background: #f8f8f8;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
      border-left: 4px solid #D4AF37;
    }
    .detail-row {
      margin: 10px 0;
      padding: 5px 0;
      border-bottom: 1px solid #eee;
    }
    .detail-label {
      font-weight: bold;
      color: #1a1a1a;
      min-width: 120px;
      display: inline-block;
    }
    .priority-high {
      color: #D4AF37;
      font-weight: bold;
    }
    .actions {
      margin-top: 20px;
      padding: 20px;
      background: #f0f0f0;
      border-radius: 6px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Nouvelle Demande de Rendez-vous</h1>
    </div>
    <div class="content">
      <div class="client-info">
        <h3 style="color: #D4AF37; margin-top: 0;">Informations Client</h3>
        <p><strong>Nom :</strong> ${data.name}</p>
        <p><strong>Email :</strong> ${data.email}</p>
        <p><strong>Téléphone :</strong> ${data.phone}</p>
      </div>

      <div class="appointment-details">
        <h3 style="color: #D4AF37; margin-top: 0;">Détails du Rendez-vous</h3>
        <div class="detail-row">
          <span class="detail-label">Date :</span>
          <span class="priority-high">${new Date(data.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Heure :</span>
          <span class="priority-high">${data.time}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Type de projet :</span>
          ${data.projectType}
        </div>
        <div class="detail-row">
          <span class="detail-label">Message :</span>
          ${data.message}
        </div>
      </div>

      <div class="actions">
        <h3 style="color: #D4AF37; margin-top: 0;">Actions requises</h3>
        <ul>
          <li>Vérifier la disponibilité pour la date et l'heure demandées</li>
          <li>Préparer un dossier client</li>
          <li>Confirmer le rendez-vous par téléphone</li>
        </ul>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Route pour vérifier les créneaux disponibles
app.get('/api/available-slots', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date requise' });
    }

    const availableSlots = await Appointment.getAvailableTimeSlots(new Date(date));
    res.json({ availableSlots });
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour créer un rendez-vous
app.post('/api/appointment', async (req, res) => {
  try {
    const appointmentData = req.body;
    
    // Vérifier si le créneau est toujours disponible
    const isAvailable = await Appointment.isTimeSlotAvailable(
      appointmentData.date,
      appointmentData.time
    );
    
    if (!isAvailable) {
      return res.status(409).json({
        error: 'Ce créneau n\'est plus disponible. Veuillez en choisir un autre.'
      });
    }
    
    // Créer le rendez-vous
    const appointment = new Appointment(appointmentData);
    await appointment.save();

    // Envoyer les emails
    const clientMailOptions = {
      from: process.env.EMAIL_USER,
      to: appointmentData.email,
      subject: 'Confirmation de votre demande de rendez-vous - FABULOUS',
      html: clientEmailTemplate(appointmentData)
    };

    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Nouvelle demande de rendez-vous',
      html: adminEmailTemplate(appointmentData)
    };

    await transporter.sendMail(clientMailOptions);
    await transporter.sendMail(adminMailOptions);

    res.status(201).json({
      message: 'Rendez-vous créé avec succès',
      appointment
    });
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
