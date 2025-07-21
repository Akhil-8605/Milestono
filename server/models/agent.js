const mongoose = require("mongoose");

const AgentSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    company: {
        type: String,
    },
    operatingSince: {
        type: String,
    },
    buyersServed: {
        type: String,
    },
    propertiesForSale: {
        type: Number,
    },
    propertiesForRent: {
        type: Number,
    },
    address: {
        type: String,
    },
    image: {
        type: String,
    },
});

module.exports = mongoose.model("Agent", AgentSchema);
