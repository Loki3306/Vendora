// @module admin | Vendora v1.0 | SPIT Mini Project AY 2026-27
const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../../middleware/auth.middleware');
const { requireAdmin } = require('../../middleware/role.middleware');
const { validate } = require('../../middleware/validate.middleware');
const controller = require('../../controllers/admin/category.controller');
const router = express.Router();
router.use(verifyToken, requireAdmin);
router.get('/categories', controller.listCategories);
router.post('/categories', [body('name').trim().notEmpty().withMessage('Name is required.')], validate, controller.createCategory);
router.put('/categories/:id', controller.updateCategory);
router.delete('/categories/:id', controller.deleteCategory);
module.exports = router;
