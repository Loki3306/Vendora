// @module customer | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const { Notification } = require('../models');
const { nextSequence } = require('./id.service');

async function createNotification(userId, message) {
  const notificationId = await nextSequence('notification_id');
  return Notification.create({ notification_id: notificationId, user_id: Number(userId), message, is_read: false });
}

module.exports = { createNotification };
