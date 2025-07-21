const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  text: {
    type: String,
  },
  image: {
    type: String,
    default: null,
  },
  read: {
    type: Boolean,
    default: false,
  },
  redirect: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
