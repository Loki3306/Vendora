// @module admin | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const asyncHandler = require('../../utils/asyncHandler');
const { User, Vendor, Product, Order, OrderItem, Cart, Notification, Review } = require('../../models');
const { sendSuccess, sendError } = require('../../utils/response');
const { parsePagination } = require('../../utils/pagination');

const esc = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const listUsers = asyncHandler(async (req, res) => {
  const { limit, offset, page } = parsePagination(req.query);
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.is_active !== undefined && req.query.is_active !== '') filter.is_active = ['true', '1', true, 1].includes(req.query.is_active);
  if (req.query.search) {
    const re = new RegExp(esc(req.query.search), 'i'); filter.$or = [{ name: re }, { email: re }];
  }
  const total = await User.countDocuments(filter);
  const users = await User.find(filter).sort({ created_at: -1 }).skip(offset).limit(limit).lean();
  const vendors = await Vendor.find({ user_id: { $in: users.map((u) => u.user_id) } }).lean();
  const vMap = new Map(vendors.map((v) => [v.user_id, v]));
  const rows = users.map((u) => {
    const v = vMap.get(u.user_id);
    return {
      user_id: u.user_id, name: u.name, email: u.email, role: u.role, is_active: u.is_active, created_at: u.created_at,
      ...(v ? { vendor_id: v.vendor_id, shop_name: v.shop_name, vendor_status: v.status } : {}),
    };
  });
  return sendSuccess(res, rows, 'Users retrieved.', 200, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

const suspendUser = asyncHandler(async (req, res) => {
  const userId = Number(req.params.id);
  if (userId === req.user.user_id) return sendError(res, 'You cannot suspend your own account.', 409, 'SELF_SUSPEND_BLOCKED');
  const user = await User.findOne({ user_id: userId });
  if (!user) return sendError(res, 'User not found.', 404, 'USER_NOT_FOUND');
  user.is_active = !user.is_active; await user.save();
  return sendSuccess(res, { user_id: userId, is_active: user.is_active }, user.is_active ? 'User restored.' : 'User suspended.');
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = Number(req.params.id);
  if (userId === req.user.user_id) return sendError(res, 'You cannot delete your own account.', 409, 'SELF_DELETE_BLOCKED');
  const user = await User.findOne({ user_id: userId }).lean();
  if (!user) return sendError(res, 'User not found.', 404, 'USER_NOT_FOUND');
  if (await Order.exists({ user_id: userId })) return sendError(res, 'User has orders and cannot be deleted.', 409, 'USER_HAS_ORDERS');
  const vendor = await Vendor.findOne({ user_id: userId }).lean();
  if (vendor && await OrderItem.exists({ vendor_id: vendor.vendor_id })) return sendError(res, 'Vendor has historical order items and cannot be deleted.', 409, 'VENDOR_HAS_ORDERS');
  if (vendor) {
    const productIds = (await Product.find({ vendor_id: vendor.vendor_id }, { product_id: 1, _id: 0 }).lean()).map((p) => p.product_id);
    await Review.deleteMany({ product_id: { $in: productIds } });
    await Cart.deleteMany({ product_id: { $in: productIds } });
    await Product.deleteMany({ vendor_id: vendor.vendor_id });
    await Vendor.deleteOne({ vendor_id: vendor.vendor_id });
  }
  await Promise.all([
    Cart.deleteMany({ user_id: userId }), Review.deleteMany({ user_id: userId }), Notification.deleteMany({ user_id: userId }), User.deleteOne({ user_id: userId }),
  ]);
  return sendSuccess(res, null, 'User deleted.');
});

module.exports = { listUsers, suspendUser, deleteUser };
