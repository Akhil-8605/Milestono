
const mongoose = require('mongoose');

const accountHistorySchema = new mongoose.Schema({
  email: { 
    type: String, 
    trim: true 
  },
  accountName: { 
    type: String, 
    trim: true 
  },
  price: { 
    type: Number, 
  },
  paymentDate: { 
    type: Date, 
    default: Date.now 
  },
  validityEndDate: { 
    type: Date,
  },
}, {
  timestamps: true
});

const AccountHistory = mongoose.model('AccountHistory', accountHistorySchema);

module.exports = AccountHistory;
