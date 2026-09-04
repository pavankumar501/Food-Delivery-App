const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, default: '' },
  cuisine: [{ type: String }],
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  deliveryTime: { type: String, default: '30-40 min' },
  minOrder: { type: Number, default: 99 },
  isOpen: { type: Boolean, default: true },
  address: { type: String },
  phone: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  offers: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
