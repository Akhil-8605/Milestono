const mongoose = require("mongoose");

const MobGalleryImageSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  image: {
    type: String,
  }
});

module.exports = mongoose.model("MobGalleryImage", MobGalleryImageSchema);
