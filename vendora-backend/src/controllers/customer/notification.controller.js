// @module customer | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const asyncHandler = require('../../utils/asyncHandler');
const { Notification } = require('../../models');
const { sendSuccess, sendError } = require('../../utils/response');

const getNotifications = asyncHandler(async (req, res) => {
  const rows = await Notification.find({ user_id: req.user.user_id }).sort({ created_at: -1 }).limit(100).lean();
  return sendSuccess(res, rows.map(({ _id, ...row }) => row), 'Notifications retrieved.');
});

const markRead = asyncHandler(async (req, res) => {
  const result = await Notification.updateOne(
    { notification_id: Number(req.params.id), user_id: req.user.user_id },
    { $set: { is_read: true } },
  );
  if (!result.matchedCount) return sendError(res, 'Notification not found.', 404, 'NOTIFICATION_NOT_FOUND');
  return sendSuccess(res, null, 'Notification marked as read.');
});

const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user_id: req.user.user_id }, { $set: { is_read: true } });
  return sendSuccess(res, null, 'All notifications marked as read.');
});

module.exports = { getNotifications, markRead, markAllRead };
