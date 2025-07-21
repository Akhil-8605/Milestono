const mongoose = require('mongoose');

const viewedSchema = new mongoose.Schema({
    email: { type: String, required: true },
    property_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('viewed', viewedSchema);
