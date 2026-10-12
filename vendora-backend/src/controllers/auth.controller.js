// @module auth | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const asyncHandler = require('../utils/asyncHandler');
const { User, Vendor } = require('../models');
const { signToken } = require('../config/jwt.config');
const { hashPassword, comparePasswords } = require('../services/auth.service');
const { nextSequence } = require('../services/id.service');
const { sendSuccess, sendError } = require('../utils/response');

const publicUser = (record, vendor = null) => ({
  user_id: record.user_id,
  name: record.name,
  email: record.email,
  role: record.role,
  is_active: Boolean(record.is_active),
  created_at: record.created_at,
  ...(vendor ? { vendor_id: vendor.vendor_id, shop_name: vendor.shop_name, vendor_status: vendor.status } : {}),
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'customer', shop_name: shopName, description = '' } = req.body;
  const normalizedEmail = String(email).toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail }).lean();
  if (existing) return sendError(res, 'An account already exists with this email.', 409, 'EMAIL_EXISTS');

  const userId = await nextSequence('user_id');
  const passwordHash = await hashPassword(password);
  let user;
  try {
    user = await User.create({ user_id: userId, name, email: normalizedEmail, password_hash: passwordHash, role });
    let vendor = null;
    if (role === 'vendor') {
      const vendorId = await nextSequence('vendor_id');
      vendor = await Vendor.create({ vendor_id: vendorId, user_id: userId, shop_name: shopName, description, status: 'pending' });
    }
    const payload = { user_id: userId, email: normalizedEmail, role, ...(vendor ? { vendor_id: vendor.vendor_id } : {}) };
    const token = signToken(payload);
    return sendSuccess(res, { user: publicUser(user.toObject(), vendor && vendor.toObject()), token }, 'Registration successful.', 201);
  } catch (error) {
    if (user) await User.deleteOne({ user_id: userId }).catch(() => {});
    throw error;
  }
});

const login = asyncHandler(async (req, res) => {
  console.log('Login attempt:', req.body.email, 'password length:', req.body.password?.length);
  const normalizedEmail = String(req.body.email).toLowerCase();
  const record = await User.findOne({ email: normalizedEmail }).lean();
  console.log('User found:', !!record);
  if (!record) return sendError(res, 'Invalid email or password.', 401, 'INVALID_CREDENTIALS');
  if (!record.is_active) return sendError(res, 'This account is suspended.', 403, 'ACCOUNT_SUSPENDED');
  
  const isMatch = await comparePasswords(req.body.password, record.password_hash);
  console.log('Password match:', isMatch);
  if (!isMatch) {
    return sendError(res, 'Invalid email or password.', 401, 'INVALID_CREDENTIALS');
  }
  const vendor = record.role === 'vendor' ? await Vendor.findOne({ user_id: record.user_id }).lean() : null;
  const payload = { user_id: record.user_id, email: record.email, role: record.role, ...(vendor ? { vendor_id: vendor.vendor_id } : {}) };
  const token = signToken(payload);
  return sendSuccess(res, { user: publicUser(record, vendor), token }, 'Login successful.');
});

const getMe = asyncHandler(async (req, res) => {
  const record = await User.findOne({ user_id: req.user.user_id }).lean();
  if (!record) return sendError(res, 'User not found.', 404, 'USER_NOT_FOUND');
  const vendor = record.role === 'vendor' ? await Vendor.findOne({ user_id: record.user_id }).lean() : null;
  return sendSuccess(res, publicUser(record, vendor), 'Profile retrieved.');
});

module.exports = { register, login, getMe };
