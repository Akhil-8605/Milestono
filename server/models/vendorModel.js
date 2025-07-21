const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  
  userId: String,
  name: String,
  email: String,
  mobile: String,
  city: String,
  pincode: String,

  vendorImage: String,
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
  status: {
    type: String,
    default: "available",
  },
  
  serviceDescription: String,
  experience: String,
  quotedServices: [
    {
      serviceId: String,
      price: String,
    }
  ],

  
  coordinates: {
    type: [Number], 
    index: "2dsphere", 
  },

  
  reviews: [
    {
      review: String,
      reviewer_name: String,
    }
  ]
});

module.exports = mongoose.model("Vendor", vendorSchema);
