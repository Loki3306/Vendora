// @module auth | Vendora v1.0 | SPIT Mini Project AY 2026-27
const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

const router = express.Router();
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('A valid email is required.').normalizeEmail({ gmail_remove_dots: false }),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
  body('role').optional().isIn(['customer','vendor']).withMessage('Role must be customer or vendor.'),
  body('shop_name').custom((value, { req }) => {
    if (req.body.role === 'vendor' && !String(value || '').trim()) throw new Error('Shop name is required for vendors.');
    return true;
  }),
];
const loginValidation = [
  body('email').isEmail().withMessage('A valid email is required.').normalizeEmail({ gmail_remove_dots: false }),
  body('password').notEmpty().withMessage('Password is required.'),
];

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', verifyToken, getMe);

module.exports = router;
