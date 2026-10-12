// @module database | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  item_id: { type: Number, required: true, unique: true, index: true },
  order_id: { type: Number, required: true, index: true },
  product_id: { type: Number, required: true, index: true },
  vendor_id: { type: Number, required: true, index: true },
  quantity: { type: Number, required: true, min: 1 },
  unit_price: { type: Number, required: true, min: 0 },
}, { versionKey: false, collection: 'order_items', timestamps: true });

module.exports = mongoose.model('OrderItem', orderItemSchema);
