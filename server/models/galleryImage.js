const mongoose = require("mongoose");

const GalleryImageSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  image: {
    type: String,
  }
});

module.exports = mongoose.model("GalleryImage", GalleryImageSchema);
