const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function(date) {
        return date.getDay() !== 0;
      },
      message: 'Les rendez-vous ne sont pas possibles le dimanche'
    }
  },
  time: {
    type: String,
    required: true,
    validate: {
      validator: function(time) {
        const hour = parseInt(time.split(':')[0]);
        return hour >= 9 && hour <= 17;
      },
      message: 'Les rendez-vous sont possibles uniquement entre 9h et 17h'
    }
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Méthode pour vérifier la disponibilité d'un créneau
appointmentSchema.statics.isTimeSlotAvailable = async function(date, time) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Vérifier si c'est un dimanche
  if (startOfDay.getDay() === 0) {
    return false;
  }

  // Vérifier si la date est dans le passé
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (startOfDay < today) {
    return false;
  }

  // Vérifier si le créneau est déjà pris
  const existingAppointment = await this.findOne({
    date: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    time: time
  });

  return !existingAppointment;
};

// Méthode pour obtenir tous les créneaux avec leur disponibilité
appointmentSchema.statics.getAvailableTimeSlots = async function(date) {
  const requestedDate = new Date(date);
  const startOfDay = new Date(requestedDate);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(requestedDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Si c'est un dimanche, retourner tous les créneaux comme non disponibles
  if (requestedDate.getDay() === 0) {
    return {
      slots: this.generateAllTimeSlots().map(time => ({
        time,
        available: false,
        reason: 'Les rendez-vous ne sont pas possibles le dimanche'
      })),
      message: 'Les rendez-vous ne sont pas possibles le dimanche'
    };
  }

  // Vérifier si la date est dans le passé
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (requestedDate < today) {
    return {
      slots: this.generateAllTimeSlots().map(time => ({
        time,
        available: false,
        reason: 'Cette date est déjà passée'
      })),
      message: 'Impossible de prendre un rendez-vous dans le passé'
    };
  }

  // Récupérer tous les rendez-vous pour cette date
  const bookedAppointments = await this.find({
    date: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  }).select('time');

  const bookedTimeSlots = new Set(bookedAppointments.map(apt => apt.time));

  // Générer tous les créneaux avec leur disponibilité
  const slots = this.generateAllTimeSlots().map(time => ({
    time,
    available: !bookedTimeSlots.has(time),
    reason: bookedTimeSlots.has(time) ? 'Créneau déjà réservé' : null
  }));

  const availableCount = slots.filter(slot => slot.available).length;

  return {
    slots,
    message: availableCount > 0 
      ? `${availableCount} créneaux disponibles`
      : 'Aucun créneau disponible pour cette date'
  };
};

// Méthode utilitaire pour générer tous les créneaux horaires
appointmentSchema.statics.generateAllTimeSlots = function() {
  const timeSlots = [];
  for (let hour = 9; hour <= 17; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return timeSlots;
};

module.exports = mongoose.model('Appointment', appointmentSchema);
