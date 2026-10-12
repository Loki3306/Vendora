// @module database | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category_id: { type: Number, required: true, unique: true, index: true },
  name: { type: String, required: true, unique: true, trim: true, maxlength: 100 },
  description: { type: String, default: '' },
  emoji: { type: String, default: '', maxlength: 10 },
}, {
  versionKey: false,
  collection: 'categories',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

module.exports = mongoose.model('Category', categorySchema);
