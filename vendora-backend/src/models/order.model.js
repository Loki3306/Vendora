// @module database | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_id: { type: Number, required: true, unique: true, index: true },
  user_id: { type: Number, required: true, index: true },
  total_amount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending', required: true, index: true },
}, {
  versionKey: false,
  collection: 'orders',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

module.exports = mongoose.model('Order', orderSchema);
