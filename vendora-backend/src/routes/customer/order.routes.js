// @module customer | Vendora v1.0 | SPIT Mini Project AY 2026-27
const express = require('express');
const { verifyToken } = require('../../middleware/auth.middleware');
const { requireCustomer } = require('../../middleware/role.middleware');
const controller = require('../../controllers/customer/order.controller');
const router = express.Router();
router.use(verifyToken, requireCustomer);
router.post('/', controller.placeOrder);
router.get('/', controller.listOrders);
router.get('/:order_id', controller.trackOrder);
module.exports = router;
