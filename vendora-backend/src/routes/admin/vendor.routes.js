// @module admin | Vendora v1.0 | SPIT Mini Project AY 2026-27
const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../../middleware/auth.middleware');
const { requireAdmin } = require('../../middleware/role.middleware');
const { validate } = require('../../middleware/validate.middleware');
const controller = require('../../controllers/admin/vendor.controller');
const router = express.Router();
router.use(verifyToken, requireAdmin);
router.get('/vendors', controller.listVendors);
router.patch('/vendors/:id/status', [body('status').isIn(['pending','verified','suspended'])], validate, controller.updateVendorStatus);
module.exports = router;
