const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { Resend } = require('resend');

// Configuration Resend
const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Fonction pour envoyer un email de notification
const sendNotificationEmail = async (appointment) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px;">
        <h2 style="color: #D4AF37; text-align: center;">🗓️ Nouveau Rendez-vous</h2>
        <div style="background: #fff; padding: 15px; border-radius: 4px; margin: 15px 0;">
          <p><strong>Nom:</strong> ${appointment.name}</p>
          <p><strong>Email:</strong> ${appointment.email}</p>
          <p><strong>Téléphone:</strong> ${appointment.phone}</p>
          <p><strong>Date:</strong> ${formatDate(appointment.date)}</p>
          <p><strong>Heure:</strong> ${appointment.time}</p>
          <p><strong>Message:</strong> ${appointment.message || 'Aucun message'}</p>
        </div>
        <p style="color: #666; font-size: 12px; text-align: center;">Fabulous Creations Design</p>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: 'Fabulous <onboarding@resend.dev>',
      to: [ADMIN_EMAIL],
      subject: `Nouveau rendez-vous - ${appointment.name}`,
      html: htmlContent
    });
    console.log('✅ Email de notification envoyé pour le rendez-vous');
  } catch (error) {
    console.error('⚠️ Erreur envoi email notification:', error.message);
    // Ne pas bloquer si l'email échoue
  }
};

// GET - Récupérer tous les rendez-vous (protégé admin)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    console.error('Erreur lors de la récupération des rendez-vous:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des rendez-vous',
      error: error.message 
    });
  }
});

// GET - Récupérer les créneaux disponibles pour une date
router.get('/available-slots', async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ message: 'Date requise' });
    }

    // Récupérer les rendez-vous existants pour cette date
    const { data: existingAppointments, error } = await supabase
      .from('appointments')
      .select('time')
      .eq('date', date);

    if (error) throw error;

    // Tous les créneaux possibles (9h-18h)
    const allSlots = [
      '09:00', '10:00', '11:00', '12:00', 
      '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    // Filtrer les créneaux déjà pris
    const bookedTimes = existingAppointments?.map(apt => apt.time) || [];
    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

    res.json(availableSlots);
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des créneaux',
      error: error.message 
    });
  }
});

// POST - Créer un nouveau rendez-vous
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, date, time, message } = req.body;

    // Validation
    if (!name || !email || !phone || !date || !time) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Vérifier si le créneau est déjà pris
    const { data: existing, error: checkError } = await supabase
      .from('appointments')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .single();

    if (existing) {
      return res.status(400).json({ message: 'Ce créneau est déjà réservé' });
    }

    // Créer le rendez-vous
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          name,
          email,
          phone,
          date,
          time,
          message: message || '',
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Envoyer un email de notification à l'admin
    await sendNotificationEmail(data);

    res.status(201).json(data);
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création du rendez-vous',
      error: error.message 
    });
  }
});

// DELETE - Supprimer un rendez-vous (protégé admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Rendez-vous supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du rendez-vous',
      error: error.message 
    });
  }
});

module.exports = router;
