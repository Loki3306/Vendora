// @module admin | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const asyncHandler = require('../../utils/asyncHandler');
const { Vendor, User, Product, Order, OrderItem } = require('../../models');
const { sendSuccess, sendError } = require('../../utils/response');
const { createNotification } = require('../../services/notification.service');

const listVendors = asyncHandler(async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  const vendors = await Vendor.find(filter).sort({ created_at: -1 }).lean();
  const users = await User.find({ user_id: { $in: vendors.map((v) => v.user_id) } }).lean();
  const uMap = new Map(users.map((u) => [u.user_id, u]));
  const productCounts = await Product.aggregate([
    { $match: { vendor_id: { $in: vendors.map((v) => v.vendor_id) } } },
    { $group: { _id: '$vendor_id', count: { $sum: 1 } } },
  ]);
  const pcMap = new Map(productCounts.map((x) => [x._id, x.count]));
  const items = await OrderItem.find({ vendor_id: { $in: vendors.map((v) => v.vendor_id) } }).lean();
  const orders = await Order.find({ order_id: { $in: [...new Set(items.map((i) => i.order_id))] }, status: 'delivered' }).lean();
  const delivered = new Set(orders.map((o) => o.order_id));
  const revenueMap = new Map();
  for (const item of items) {
    if (!delivered.has(item.order_id)) continue;
    revenueMap.set(item.vendor_id, (revenueMap.get(item.vendor_id) || 0) + item.quantity * item.unit_price);
  }
  const rows = vendors.map((v) => {
    const user = uMap.get(v.user_id) || {};
    return {
      vendor_id: v.vendor_id, shop_name: v.shop_name, description: v.description, status: v.status, created_at: v.created_at,
      user_id: v.user_id, owner_name: user.name || '', email: user.email || '', is_active: user.is_active ?? false,
      product_count: pcMap.get(v.vendor_id) || 0,
      total_revenue: Number((revenueMap.get(v.vendor_id) || 0).toFixed(2)),
    };
  });
  return sendSuccess(res, rows, 'Vendors retrieved.');
});

const updateVendorStatus = asyncHandler(async (req, res) => {
  const vendorId = Number(req.params.id);
  const status = req.body.status;
  if (!['pending', 'verified', 'suspended'].includes(status)) return sendError(res, 'Invalid vendor status.', 422, 'VALIDATION_ERROR');
  const vendor = await Vendor.findOne({ vendor_id: vendorId });
  if (!vendor) return sendError(res, 'Vendor not found.', 404, 'VENDOR_NOT_FOUND');
  const previous = vendor.status;
  vendor.status = status; await vendor.save();
  if (previous === 'pending' && status === 'verified') await createNotification(vendor.user_id, 'Your vendor account has been approved.');
  return sendSuccess(res, { vendor_id: vendorId, status }, 'Vendor status updated.');
});

module.exports = { listVendors, updateVendorStatus };
