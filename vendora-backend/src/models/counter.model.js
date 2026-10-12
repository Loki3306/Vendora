// @module database | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, trim: true },
  seq: { type: Number, required: true, default: 0 },
}, { versionKey: false, collection: 'counters' });

module.exports = mongoose.model('Counter', counterSchema);
