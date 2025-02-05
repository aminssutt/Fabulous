const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    select: false // Ne pas inclure par défaut dans les requêtes
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isApproved: {
    type: Boolean,
    default: true
  }
});

// Index unique sur l'email pour empêcher les doublons
reviewSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema); 