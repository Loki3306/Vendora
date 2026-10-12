// @module database | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vendora_db';
let connectionPromise = null;

async function checkDatabaseConnection() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 5000),
    }).then(() => {
      if (process.env.NODE_ENV !== 'test') process.stdout.write('Vendora MongoDB connection established.\n');
      return mongoose.connection;
    }).catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }
  return connectionPromise;
}

async function closeDatabaseConnection() {
  connectionPromise = null;
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
}

module.exports = { mongoose, MONGODB_URI, checkDatabaseConnection, closeDatabaseConnection };
