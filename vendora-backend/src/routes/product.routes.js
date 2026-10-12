// @module customer | Vendora v1.0 | SPIT Mini Project AY 2026-27
const express = require('express');
const { listProducts, getProduct, listCategories, listVendors } = require('../controllers/product.controller');
const router = express.Router();
router.get('/', listProducts);
router.get('/meta/categories', listCategories);
router.get('/meta/vendors', listVendors);
router.get('/:id', getProduct);
module.exports = router;
