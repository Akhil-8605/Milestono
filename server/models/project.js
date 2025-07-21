const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  email: String ,
  title: String,
  type: String,
  status: String,
  developer: String,

  address: String,
  city: String,
  state: String,
  zip: String,
  country: String,

  units: Number,
  minPrice: Number,
  maxPrice: Number,
  possession: Date,
  progress: Number,
  rating: Number,
  description: String,

  features: [String],
  images: [String],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
