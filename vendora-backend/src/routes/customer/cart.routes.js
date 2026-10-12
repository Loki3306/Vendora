// @module customer | Vendora v1.0 | SPIT Mini Project AY 2026-27
const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../../middleware/auth.middleware');
const { requireCustomer } = require('../../middleware/role.middleware');
const { validate } = require('../../middleware/validate.middleware');
const controller = require('../../controllers/customer/cart.controller');
const router = express.Router();
router.use(verifyToken, requireCustomer);
router.get('/', controller.getCart);
router.post('/', [body('product_id').isInt({ min: 1 }), body('quantity').optional().isInt({ min: 1 })], validate, controller.addToCart);
router.put('/:cart_id', [body('quantity').isInt({ min: 0 })], validate, controller.updateCartItem);
router.delete('/:cart_id', controller.removeFromCart);
module.exports = router;
