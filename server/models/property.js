const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertySchema = new Schema({
  heading: { type: String },
  deposite: { type: String },
  pricePerMonth: { type: String },
  sellType: { type: String },
  sellerType: { type: String },
  propertyCategory: { type: String },
  oldProperty: { type: String },
  propertyContains: { type: [String] },
  amenities: { type: [String] },
  furnitures: { type: [String] },
  email: { type: String },
  phnumber: { type: String },
  city: { type: String },
  landmark: { type: String },
  bedrooms: { type: String },
  bathrooms: { type: String },
  balconies: { type: String },
  ownership: { type: String },
  expectedPrice: { type: String },
  pricePerSqFt: { type: String },
  isAllInclusive: { type: Boolean, default: false },
  isPriceNegotiable: { type: Boolean, default: false },
  isTaxchargeExc: { type: Boolean, default: false },
  uniqueFeatures: { type: String },
  areaSqft: { type: String },
  reservedParking:{ type: String },
  selectedFurnishing:{ type: String },
  selectedRoom:{ type: [String] },
  uploadedPhotos: { type: [String] },
  featured: { type: Boolean, default: false },
  bulkCount: { type: String },
  latitude: { type: Number},
  longitude: { type: Number},
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
});

propertySchema.index({ location: '2dsphere' });
const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
