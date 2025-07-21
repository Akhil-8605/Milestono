const mongoose = require('mongoose');

const servicemanSchema = new mongoose.Schema({
  vendorImage: String,
  email: String,
  adharImage: String,
  panImage: String,
  serviceCategory: String,
  certificateImage: String,
  vendorName: String,
  serviceRoll: String,
  vendorDescription: String,
  experience: String,
  district: String,
  state: String,
  subDistrict: String,
  address: String,
  accountNo: String,
  ifsccode: String,
  adharNumber: String, 
  panNumber: String,   
  status: String,
});

module.exports = mongoose.model('Serviceman', servicemanSchema);
