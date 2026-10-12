// @module database | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 150 },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'vendor', 'admin'], default: 'customer', required: true },
  is_active: { type: Boolean, default: true, required: true },
}, {
  versionKey: false,
  collection: 'users',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

module.exports = mongoose.model('User', userSchema);
