// @module auth | Vendora v1.0 | SPIT Mini Project AY 2026-27
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'development_only_change_me_please_32_chars';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const signToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
const verifyToken = (token) => jwt.verify(token, JWT_SECRET);

module.exports = { JWT_SECRET, JWT_EXPIRES_IN, signToken, verifyToken };
