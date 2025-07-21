

const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email:{
    type: String,
  },
  vendorEmail:{
    type: String,
  },
  address: {
    type: String,
  },
  problemImage: {
    type: String,
  },
  problemDescription: {
    type: String,
  },
  problemType: {
    type: String,
  },
  status: {
    type: String,
  },
  serviceCategory: {
    type: String,
  },
  expectedPrice : {
    type: String,
  },
  otp : {
    type: String,
  },
});

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
