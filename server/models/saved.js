const mongoose = require('mongoose');

const savedSchema = new mongoose.Schema({
    email: { type: String, required: true },
    property_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true }
});

module.exports = mongoose.model('saved', savedSchema);
