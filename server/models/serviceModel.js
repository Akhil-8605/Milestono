const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  
  name: String,
  description: String,
  category: String,
  image: String,
  


  email: String,
  vendorEmail: String,
  landmark: String,
  address: String,
  district: String,
  city: String,
  state: String,
  pincode: String,

  
  status: String,
  price: String,
  otp: String,
  coordinates: {
    type: [Number], 
    index: "2dsphere", 
  },
});

module.exports = mongoose.model("Service", serviceSchema);


