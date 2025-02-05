const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Anonyme'
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

module.exports = mongoose.model('Review', reviewSchema); 