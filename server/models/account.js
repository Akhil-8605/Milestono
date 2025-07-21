const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  email: { type: String, required: true },

  numOfProperties: { type: Number, default: 0 },
  numOfContactDetails: { type: Number, default: 0 },
  numOfImages: { type: Number, default: 0 },
  numOfVideos: { type: Number, default: 0 },
  numOfFeaturedProperties: { type: Number, default: 0 },

  crmAccess: { type: Boolean, default: false },
  whatsappIntegration: { type: Boolean, default: false },

  exportCustomers: { type: String, enum: ["no", "email", "mobile"], default: "no" },
  bulkUpload: { type: Boolean, default: false },

  branding: { type: String, enum: ["no", "trusted", "custom"], default: "no" },

  premiumStartDate: { type: Date, default: null },
  premiumEndDate: { type: Date, default: null },
});

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
