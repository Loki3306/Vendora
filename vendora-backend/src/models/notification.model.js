// @module database | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notification_id: { type: Number, required: true, unique: true, index: true },
  user_id: { type: Number, required: true, index: true },
  message: { type: String, required: true, maxlength: 500 },
  is_read: { type: Boolean, default: false, required: true },
}, {
  versionKey: false,
  collection: 'notifications',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

module.exports = mongoose.model('Notification', notificationSchema);
