// @module vendor | Vendora v1.0 | SPIT Mini Project AY 2026-27
const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../../middleware/auth.middleware');
const { requireVendor } = require('../../middleware/role.middleware');
const { vendorVerified } = require('../../middleware/vendor.middleware');
const { validate } = require('../../middleware/validate.middleware');
const controller = require('../../controllers/vendor/product.controller');
const router = express.Router();
router.use(verifyToken, requireVendor, vendorVerified);
router.get('/products', controller.listProducts);
router.post('/products', [
  body('name').trim().notEmpty(), body('category_id').isInt({ min: 1 }),
  body('price').isFloat({ min: 0.01 }), body('stock_qty').optional().isInt({ min: 0 }),
], validate, controller.createProduct);
router.put('/products/:id', controller.updateProduct);
router.delete('/products/:id', controller.deleteProduct);
module.exports = router;
