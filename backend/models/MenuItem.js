const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  category: { type: String, required: true },
  isVeg: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  isBestseller: { type: Boolean, default: false },
  spicyLevel: { type: Number, default: 0, min: 0, max: 3 }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
