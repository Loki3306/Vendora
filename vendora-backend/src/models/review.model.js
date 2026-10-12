// @module database | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review_id: { type: Number, required: true, unique: true, index: true },
  user_id: { type: Number, required: true, index: true },
  product_id: { type: Number, required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
}, {
  versionKey: false,
  collection: 'reviews',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
reviewSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
