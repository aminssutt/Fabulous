const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const Appointment = require('./models/Appointment');

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000'
}));

app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fabulous')
.then(() => console.log('Connecté à MongoDB'))
.catch((err) => console.error('Erreur de connexion à MongoDB:', err));

// Configuration Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
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

// Templates d'emails simplifiés
const clientEmailTemplate = (data) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
  <h1 style="color: #D4AF37; text-align: center; font-size: 24px; margin-bottom: 30px;">Confirmation de Rendez-vous</h1>
  <p style="color: #333; font-size: 16px; line-height: 1.6;">Bonjour ${data.name},</p>
  <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <p style="color: #333; font-size: 16px; margin: 10px 0;">
      <strong>Date :</strong> ${formatDate(data.date)}
    </p>
    <p style="color: #333; font-size: 16px; margin: 10px 0;">
      <strong>Heure :</strong> ${data.time}
    </p>
  </div>
  <p style="color: #666; font-size: 14px;">${data.message}</p>
  <p style="color: #333; font-style: italic; margin-top: 30px;">Nous vous contacterons bientôt pour confirmer.</p>
  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
    <p style="color: #D4AF37; font-weight: bold;">L'équipe Fabulous</p>
  </div>
</div>`;

const adminEmailTemplate = (data) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
  <h1 style="color: #D4AF37; text-align: center;">Nouveau Rendez-vous</h1>
  <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <ul style="list-style: none; padding: 0;">
      <li style="margin: 10px 0;"><strong>Nom :</strong> ${data.name}</li>
      <li style="margin: 10px 0;"><strong>Email :</strong> ${data.email}</li>
      <li style="margin: 10px 0;"><strong>Téléphone :</strong> ${data.phone}</li>
      <li style="margin: 10px 0;"><strong>Date :</strong> ${formatDate(data.date)}</li>
      <li style="margin: 10px 0;"><strong>Heure :</strong> ${data.time}</li>
    </ul>
  </div>
  <p style="color: #666; font-size: 14px; margin-top: 20px;">Message : ${data.message}</p>
</div>`;

// Routes
app.post('/api/appointment', async (req, res) => {
  try {
    const appointmentData = req.body;
    appointmentData.date = new Date(appointmentData.date);

    // Vérifier si c'est un dimanche
    if (appointmentData.date.getDay() === 0) {
      return res.status(400).json({
        error: 'Les rendez-vous ne sont pas possibles le dimanche'
      });
    }

    // Vérifier si la date est dans le passé
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (appointmentData.date < today) {
      return res.status(400).json({
        error: 'Impossible de prendre un rendez-vous dans le passé'
      });
    }

    // Vérifier la disponibilité du créneau
    const isAvailable = await Appointment.isTimeSlotAvailable(appointmentData.date, appointmentData.time);
    if (!isAvailable) {
      return res.status(400).json({ 
        error: 'Ce créneau n\'est plus disponible. Veuillez en choisir un autre.' 
      });
    }

    // Sauvegarder le rendez-vous
    const appointment = new Appointment(appointmentData);
    await appointment.save();

    // Envoyer les emails
    await Promise.all([
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: appointmentData.email,
        subject: 'Confirmation de rendez-vous - Fabulous',
        html: clientEmailTemplate(appointmentData)
      }),
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'Nouveau rendez-vous',
        html: adminEmailTemplate(appointmentData)
      })
    ]);

    res.status(201).json({ 
      message: 'Rendez-vous enregistré avec succès',
      appointment: appointment.toObject()
    });

  } catch (error) {
    console.error('Erreur:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    res.status(500).json({ 
      error: 'Une erreur est survenue lors de la prise de rendez-vous' 
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
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
