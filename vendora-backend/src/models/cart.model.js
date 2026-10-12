// @module database | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  cart_id: { type: Number, required: true, unique: true, index: true },
  user_id: { type: Number, required: true, index: true },
  product_id: { type: Number, required: true, index: true },
  quantity: { type: Number, required: true, default: 1, min: 1 },
}, {
  versionKey: false,
  collection: 'cart',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
cartSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

module.exports = mongoose.model('Cart', cartSchema);
