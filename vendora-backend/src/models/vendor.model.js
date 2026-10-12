// @module database | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  vendor_id: { type: Number, required: true, unique: true, index: true },
  user_id: { type: Number, required: true, unique: true, index: true },
  shop_name: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'verified', 'suspended'], default: 'pending', required: true, index: true },
}, {
  versionKey: false,
  collection: 'vendors',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

module.exports = mongoose.model('Vendor', vendorSchema);
