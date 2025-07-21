const mongoose = require("mongoose");

const BankSchema = new mongoose.Schema({
  bankName: {
    type: String,
  },
  bankImage: {
    type: String,
  },
  interestRate: {
    type: Number,
  },
  processingFees: {
    type: Number,
  },
  emi: {
    type: Number,
  },
  maxLoanAmount: {
    type: Number,
  },
  featured: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Bank", BankSchema);
