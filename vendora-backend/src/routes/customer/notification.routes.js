// @module customer | Vendora v1.0 | SPIT Mini Project AY 2026-27
const express = require('express');
const { verifyToken } = require('../../middleware/auth.middleware');
const { requireCustomer } = require('../../middleware/role.middleware');
const controller = require('../../controllers/customer/notification.controller');
const router = express.Router();
router.use(verifyToken, requireCustomer);
router.get('/', controller.getNotifications);
router.patch('/read-all', controller.markAllRead);
router.patch('/:id/read', controller.markRead);
module.exports = router;
