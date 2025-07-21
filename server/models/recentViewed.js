const mongoose = require('mongoose');

const recentViewedSchema = new mongoose.Schema({
    email: { type: String, required: true },
    property_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }]
});

module.exports = mongoose.model('RecentViewed', recentViewedSchema);