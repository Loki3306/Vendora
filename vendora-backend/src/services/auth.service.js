// @module auth | Vendora v1.0 | SPIT Mini Project AY 2026-27
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

const hashPassword = (plain) => bcrypt.hash(plain, SALT_ROUNDS);
const comparePasswords = (plain, hash) => bcrypt.compare(plain, hash);

module.exports = { SALT_ROUNDS, hashPassword, comparePasswords };
