const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  feedback: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isOnHomePage: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Feedback", FeedbackSchema);