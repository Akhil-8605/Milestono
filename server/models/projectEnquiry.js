const mongoose = require('mongoose');

const projectEnquirySchema = new mongoose.Schema({
    email: { type: String, required: true },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('projectEnquiry', projectEnquirySchema);
