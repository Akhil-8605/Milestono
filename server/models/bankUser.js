const mongoose = require("mongoose");

const BankUserSchema = new mongoose.Schema({
  propertyIdentified: {
    type: String,
  },
  propertyCity: {
    type: String,
  },
  propertyCost: {
    type: String,
  },
  employmentType: {
    type: String,
  },
  income: {
    type: String,
  },
  currentEmi: {
    type: String,
  },
  fullName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  loanAmount: {
    type: String,
  },
  tenure: {
    type: String,
  },
  age: {
    type: String,
  },
  mobile: {
    type: String,
  },
  acceptTerms: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("BankUser", BankUserSchema);
