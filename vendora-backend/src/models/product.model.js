// @module database | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_id: { type: Number, required: true, unique: true, index: true },
  vendor_id: { type: Number, required: true, index: true },
  category_id: { type: Number, required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 255 },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  original_price: { type: Number, default: null, min: 0 },
  stock_qty: { type: Number, required: true, default: 0, min: 0 },
  avg_rating: { type: Number, default: 0, min: 0, max: 5 },
  review_count: { type: Number, default: 0, min: 0 },
  is_active: { type: Boolean, default: true, required: true, index: true },
}, {
  versionKey: false,
  collection: 'products',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ vendor_id: 1, category_id: 1, is_active: 1 });

module.exports = mongoose.model('Product', productSchema);
