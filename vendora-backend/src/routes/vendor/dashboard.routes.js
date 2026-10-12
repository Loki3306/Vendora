// @module vendor | Vendora v1.0 | SPIT Mini Project AY 2026-27
const express = require('express');
const { verifyToken } = require('../../middleware/auth.middleware');
const { requireVendor } = require('../../middleware/role.middleware');
const { vendorVerified } = require('../../middleware/vendor.middleware');
const { getDashboard } = require('../../controllers/vendor/dashboard.controller');
const router = express.Router();
router.use(verifyToken, requireVendor, vendorVerified);
router.get('/dashboard', getDashboard);
module.exports = router;
