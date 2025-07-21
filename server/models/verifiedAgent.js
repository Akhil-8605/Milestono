const mongoose = require('mongoose');

const VerifiedAgentSchema = new mongoose.Schema({
  profile: String, 
  logo: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  dateOfBirth: String,
  address: String,
  city: String,
  state: String,
  bio: String,
  licenseNumber: String,
  licenseExpiry: String,
  yearsOfExperience: String,
  agency: String,
  achievements: String,
  specializations: [String],
  documents: [String],
  documentNames: [String],
}, { timestamps: true });

module.exports = mongoose.model('VerifiedAgent', VerifiedAgentSchema);
