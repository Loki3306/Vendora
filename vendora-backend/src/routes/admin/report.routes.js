// @module admin | Vendora v1.0 | SPIT Mini Project AY 2026-27
const express = require('express');
const { verifyToken } = require('../../middleware/auth.middleware');
const { requireAdmin } = require('../../middleware/role.middleware');
const { getReports } = require('../../controllers/admin/report.controller');
const router = express.Router();
router.use(verifyToken, requireAdmin);
router.get('/reports', getReports);
module.exports = router;
