const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  googleId: String,
  fullName: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: String,
  profile: String,

  numOfProperties: Number,

  numOfContactDetails: Number,

  numOfImages: Number,

  numOfVideos: Number,

  numOfFeaturedProperties: Number,

  crmAccess: Boolean,

  whatsappIntegration: Boolean,

  exportCustomers: { type: String, enum: ['no', 'email', 'mobile'], default: 'no' },

  bulkUpload: Boolean,

  branding: { type: String, enum: ['no', 'trusted', 'custom'], default: 'no' },

});

userSchema.index(
  { phone: 1 },
  {
    unique: true,
    partialFilterExpression: { phone: { $type: "string" } }
  }
);

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  const hashedPassword = await bcrypt.hash(user.password, 12);
  user.password = hashedPassword;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
