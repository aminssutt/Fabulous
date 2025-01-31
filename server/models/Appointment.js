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
    required: true
  },
  time: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Méthode statique pour vérifier la disponibilité d'un créneau
appointmentSchema.statics.isTimeSlotAvailable = async function(date, time) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const existingAppointment = await this.findOne({
    date: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    time: time,
    status: { $ne: 'cancelled' }
  });
  
  return !existingAppointment;
};

// Méthode statique pour obtenir les créneaux disponibles pour une date donnée
appointmentSchema.statics.getAvailableTimeSlots = async function(date) {
  const allTimeSlots = [];
  
  // Générer les créneaux de 30 minutes entre 9h et 18h
  for (let hour = 9; hour <= 18; hour++) {
    for (let minute of ['00', '30']) {
      if (hour === 18 && minute === '30') continue;
      allTimeSlots.push(`${hour.toString().padStart(2, '0')}:${minute}`);
    }
  }
  
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const bookedAppointments = await this.find({
    date: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    status: { $ne: 'cancelled' }
  }).select('time');
  
  const bookedTimeSlots = bookedAppointments.map(apt => apt.time);
  
  return allTimeSlots.filter(time => !bookedTimeSlots.includes(time));
};

module.exports = mongoose.model('Appointment', appointmentSchema);
