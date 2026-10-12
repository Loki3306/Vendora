// @module admin | Vendora v1.0 | SPIT Mini Project AY 2026-27
const express = require('express');
const { verifyToken } = require('../../middleware/auth.middleware');
const { requireAdmin } = require('../../middleware/role.middleware');
const { getDashboard } = require('../../controllers/admin/dashboard.controller');
const router = express.Router();
router.use(verifyToken, requireAdmin);
router.get('/dashboard', getDashboard);
module.exports = router;
