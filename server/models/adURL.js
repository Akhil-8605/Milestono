const mongoose = require('mongoose');

const adURL = new mongoose.Schema({
  ad: { type: String},
});

const Advertise = mongoose.model('Advertise', adURL);

module.exports = Advertise;
