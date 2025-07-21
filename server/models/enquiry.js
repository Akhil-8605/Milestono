const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  name: { type: String},
  phone: { type: String},
  email: { type: String},
  location: { type: String},
  propertyType: { type: String},
  description: { type: String },
  reached: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Enquiry", enquirySchema);
