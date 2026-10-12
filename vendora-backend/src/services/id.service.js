// @module database | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const { Counter } = require('../models');

async function nextSequence(key) {
  const counter = await Counter.findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).lean();
  return counter.seq;
}

async function setSequence(key, seq) {
  await Counter.updateOne({ key }, { $set: { seq } }, { upsert: true });
}

module.exports = { nextSequence, setSequence };
