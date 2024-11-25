const mongoose = require('mongoose');

// Appointment Schema
const LaboratorySchema = new mongoose.Schema({
  memId: { type: String, required: true },
  date: String,
  time: String,
  selectedServices: Array,
  total: Number,
  status: {
    type: String,
    enum: ['Pending', 'Cancelled', 'Success'],
    default: 'Pending' 
  },
  tranDate: {
    type: Date,
    default: Date.now
  },
  result:{
    data: Buffer,
    contentType: String
  }
});

// Export the Appointment model
const AppointmentModel = mongoose.model('laboratory', LaboratorySchema);
module.exports = AppointmentModel;
