// @module vendor | Vendora v1.0 | SPIT Mini Project AY 2026-27
const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../../middleware/auth.middleware');
const { requireVendor } = require('../../middleware/role.middleware');
const { vendorVerified } = require('../../middleware/vendor.middleware');
const { validate } = require('../../middleware/validate.middleware');
const controller = require('../../controllers/vendor/order.controller');
const router = express.Router();
router.use(verifyToken, requireVendor, vendorVerified);
router.get('/orders', controller.getOrders);
router.patch('/orders/:order_id/status', [body('status').isIn(['processing','shipped','delivered'])], validate, controller.updateOrderStatus);
module.exports = router;
