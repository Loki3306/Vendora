// @module shared | Vendora v1.0 | SPIT Mini Project AY 2026-27
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
